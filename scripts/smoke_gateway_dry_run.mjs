const baseUrl = (process.env.GATEWAY_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiKey = process.env.GATEWAY_SMOKE_API_KEY?.trim();
const deductionEnabled = String(process.env.PUBLIC_API_CREDITS_DEDUCTION_ENABLED || "").trim().toLowerCase() === "true";

function readHeader(headers, name) {
  return headers.get(name) || "-";
}

function maskApiKey(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "(missing)";
  if (trimmed.length <= 12) return `${trimmed.slice(0, 4)}••••`;
  return `${trimmed.slice(0, 10)}••••••`;
}

async function extractErrorCode(response) {
  try {
    const body = await response.clone().json();
    return typeof body?.error?.code === "string" ? body.error.code : "-";
  } catch {
    return "-";
  }
}

async function extractErrorPayload(response) {
  try {
    const body = await response.clone().json();
    return {
      code: typeof body?.error?.code === "string" ? body.error.code : "-",
      message: typeof body?.error?.message === "string" ? body.error.message : "-",
      requestId: typeof body?.requestId === "string" ? body.requestId : "-",
    };
  } catch {
    return { code: "-", message: "-", requestId: "-" };
  }
}

async function runRequest(label, url, options = {}) {
  const response = await fetch(url, options);
  const errorCode = await extractErrorCode(response);
  const errorPayload = await extractErrorPayload(response);
  const headerRequestId = readHeader(response.headers, "x-request-id");
  const effectiveRequestId = headerRequestId !== "-" ? headerRequestId : errorPayload.requestId;
  const headerMissingRequestId = headerRequestId === "-" && errorPayload.requestId !== "-";

  console.log(`\n[${label}]`);
  console.log(`status=${response.status}`);
  console.log(`errorCode=${errorCode}`);
  console.log(`x-request-id=${headerRequestId}`);
  console.log(`x-twmd-plan=${readHeader(response.headers, "x-twmd-plan")}`);
  console.log(`x-twmd-credits-cost=${readHeader(response.headers, "x-twmd-credits-cost")}`);
  console.log(`x-twmd-dry-run=${readHeader(response.headers, "x-twmd-dry-run")}`);
  console.log(`content-type=${readHeader(response.headers, "content-type")}`);
  if (headerMissingRequestId) {
    console.log("header_missing_request_id=true");
  }
  if (response.status >= 500) {
    console.log(`error.message=${errorPayload.message}`);
    console.log(`error.requestId=${errorPayload.requestId}`);
  }

  return {
    status: response.status,
    errorCode,
    requestId: effectiveRequestId,
    headerRequestId,
    headerMissingRequestId,
    plan: readHeader(response.headers, "x-twmd-plan"),
    creditsCost: readHeader(response.headers, "x-twmd-credits-cost"),
    dryRun: readHeader(response.headers, "x-twmd-dry-run"),
    bodyRequestId: errorPayload.requestId,
    bodyMessage: errorPayload.message,
  };
}

async function main() {
  if (deductionEnabled) {
    console.log("[SKIPPED] dry-run smoke is disabled because PUBLIC_API_CREDITS_DEDUCTION_ENABLED=true.");
    process.exit(0);
  }

  if (!apiKey) {
    console.log("[SKIPPED] GATEWAY_SMOKE_API_KEY is not set.");
    process.exit(0);
  }

  console.log(`[INFO] baseUrl=${baseUrl}`);
  console.log(`[INFO] apiKey=${maskApiKey(apiKey)}`);

  const validResult = await runRequest(
    "valid-key twse-daily-price",
    `${baseUrl}/v2/datasets/twse-daily-price?symbol=2330&limit=2`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
    },
  );

  const missingKeyResult = await runRequest(
    "missing-key",
    `${baseUrl}/v2/datasets/twse-daily-price?symbol=2330&limit=2`,
  );

  const unsupportedResult = await runRequest(
    "unsupported-dataset",
    `${baseUrl}/v2/datasets/not-a-real-dataset?symbol=2330`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
    },
  );

  const malformedResult = await runRequest(
    "malformed-key",
    `${baseUrl}/v2/datasets/twse-daily-price?symbol=2330&limit=2`,
    {
      headers: {
        "X-API-Key": "bad-key",
      },
    },
  );

  const failures = [];

  if (missingKeyResult.status !== 401 || missingKeyResult.errorCode !== "invalid_api_key") {
    failures.push("missing-key should return 401 invalid_api_key");
  }
  if (missingKeyResult.requestId === "-") {
    failures.push("missing-key response should include X-Request-Id");
  }
  if (missingKeyResult.headerMissingRequestId) {
    failures.push("missing-key response missing X-Request-Id header (body requestId present)");
  }

  if (unsupportedResult.status !== 404 || unsupportedResult.errorCode !== "dataset_not_found") {
    failures.push("unsupported-dataset should return 404 dataset_not_found");
  }
  if (unsupportedResult.requestId === "-") {
    failures.push("unsupported-dataset response should include X-Request-Id");
  }
  if (unsupportedResult.headerMissingRequestId) {
    failures.push("unsupported-dataset response missing X-Request-Id header (body requestId present)");
  }

  if (malformedResult.status !== 401 || malformedResult.errorCode !== "invalid_api_key") {
    failures.push("malformed-key should return 401 invalid_api_key");
  }
  if (malformedResult.requestId === "-") {
    failures.push("malformed-key response should include X-Request-Id");
  }
  if (malformedResult.headerMissingRequestId) {
    failures.push("malformed-key response missing X-Request-Id header (body requestId present)");
  }

  if (validResult.dryRun !== "true" || validResult.requestId === "-" || validResult.creditsCost === "-") {
    failures.push("valid-key should include X-Request-Id, X-TWMD-Dry-Run, and X-TWMD-Credits-Cost");
  }

  if (validResult.requestId === "-") {
    failures.push("valid-key response should always include X-Request-Id");
  }
  if (validResult.headerMissingRequestId) {
    failures.push("valid-key response missing X-Request-Id header (body requestId present)");
  }

  if (validResult.status === 502 || validResult.status === 504) {
    console.log("[WARN] gateway-auth-ok-upstream-failed");
  } else if (validResult.status === 401 || validResult.status === 403) {
    failures.push("valid-key request should not return auth failure");
  } else if (validResult.status >= 500) {
    failures.push(
      `valid-key request returned 5xx (requestId=${validResult.requestId}, error=${validResult.errorCode}); inspect requestId/stage in server logs`,
    );
  }

  console.log("\n[SUMMARY]");
  console.log(
    `valid-key: status=${validResult.status} code=${validResult.errorCode} requestId=${validResult.requestId} headerRequestId=${validResult.headerRequestId} dryRun=${validResult.dryRun} plan=${validResult.plan} credits=${validResult.creditsCost}`,
  );
  console.log(
    `missing-key: status=${missingKeyResult.status} code=${missingKeyResult.errorCode} requestId=${missingKeyResult.requestId} headerRequestId=${missingKeyResult.headerRequestId}`,
  );
  console.log(
    `malformed-key: status=${malformedResult.status} code=${malformedResult.errorCode} requestId=${malformedResult.requestId} headerRequestId=${malformedResult.headerRequestId}`,
  );
  console.log(
    `unsupported-dataset: status=${unsupportedResult.status} code=${unsupportedResult.errorCode} requestId=${unsupportedResult.requestId} headerRequestId=${unsupportedResult.headerRequestId}`,
  );
  console.log("revoked-key: not covered by default smoke (requires dedicated revoked key)");

  if (failures.length > 0) {
    console.error("\n[FAILED]");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("\n[PASSED] gateway dry-run smoke checks completed");
}

main().catch((error) => {
  console.error("[FAILED] smoke_gateway_dry_run");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
