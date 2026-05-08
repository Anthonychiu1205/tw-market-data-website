const baseUrl = (process.env.GATEWAY_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiKey = process.env.GATEWAY_SMOKE_API_KEY?.trim();

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

async function runRequest(label, url, options = {}) {
  const response = await fetch(url, options);
  const errorCode = await extractErrorCode(response);

  console.log(`\n[${label}]`);
  console.log(`status=${response.status}`);
  console.log(`errorCode=${errorCode}`);
  console.log(`x-request-id=${readHeader(response.headers, "x-request-id")}`);
  console.log(`x-twmd-plan=${readHeader(response.headers, "x-twmd-plan")}`);
  console.log(`x-twmd-credits-cost=${readHeader(response.headers, "x-twmd-credits-cost")}`);
  console.log(`x-twmd-dry-run=${readHeader(response.headers, "x-twmd-dry-run")}`);
  console.log(`content-type=${readHeader(response.headers, "content-type")}`);

  return {
    status: response.status,
    errorCode,
    requestId: readHeader(response.headers, "x-request-id"),
    creditsCost: readHeader(response.headers, "x-twmd-credits-cost"),
    dryRun: readHeader(response.headers, "x-twmd-dry-run"),
  };
}

async function main() {
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

  if (unsupportedResult.status !== 404 || unsupportedResult.errorCode !== "dataset_not_found") {
    failures.push("unsupported-dataset should return 404 dataset_not_found");
  }

  if (malformedResult.status !== 401 || malformedResult.errorCode !== "invalid_api_key") {
    failures.push("malformed-key should return 401 invalid_api_key");
  }

  if (validResult.dryRun !== "true" || validResult.requestId === "-" || validResult.creditsCost === "-") {
    failures.push("valid-key should include dry-run gateway headers");
  }

  if (validResult.status === 502 || validResult.status === 504) {
    console.log("[WARN] gateway-auth-ok-upstream-failed");
  } else if (validResult.status === 401 || validResult.status === 403) {
    failures.push("valid-key request should not return auth failure");
  }

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
