const baseUrl = (process.env.GATEWAY_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiKey = process.env.GATEWAY_SMOKE_API_KEY?.trim();

function maskApiKey(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "(missing)";
  if (trimmed.length <= 12) return `${trimmed.slice(0, 4)}••••`;
  return `${trimmed.slice(0, 10)}••••••`;
}

function readHeader(headers, name) {
  return headers.get(name) || "-";
}

async function extractErrorCode(response) {
  try {
    const body = await response.clone().json();
    return typeof body?.error?.code === "string" ? body.error.code : "-";
  } catch {
    return "-";
  }
}

async function callGateway(label, path, headers = {}) {
  const response = await fetch(`${baseUrl}${path}`, { headers });
  const errorCode = await extractErrorCode(response);
  const result = {
    label,
    status: response.status,
    requestId: readHeader(response.headers, "x-request-id"),
    dryRun: readHeader(response.headers, "x-twmd-dry-run"),
    creditsCost: readHeader(response.headers, "x-twmd-credits-cost"),
    cache: readHeader(response.headers, "x-twmd-cache"),
    cacheAge: readHeader(response.headers, "x-twmd-cache-age"),
    errorCode,
  };

  console.log(`\\n[${label}]`);
  console.log(`status=${result.status}`);
  console.log(`x-request-id=${result.requestId}`);
  console.log(`x-twmd-dry-run=${result.dryRun}`);
  console.log(`x-twmd-credits-cost=${result.creditsCost}`);
  console.log(`x-twmd-cache=${result.cache}`);
  console.log(`x-twmd-cache-age=${result.cacheAge}`);
  console.log(`errorCode=${result.errorCode}`);

  return result;
}

function isCacheHitLike(value) {
  return value === "HIT" || value === "STALE";
}

async function main() {
  if (!apiKey) {
    console.log("[SKIPPED] GATEWAY_SMOKE_API_KEY is not set.");
    process.exit(0);
  }

  console.log(`[INFO] baseUrl=${baseUrl}`);
  console.log(`[INFO] apiKey=${maskApiKey(apiKey)}`);

  const first = await callGateway(
    "cache-pass-1",
    "/v2/datasets/twse-daily-price?symbol=2330&limit=1",
    { "X-API-Key": apiKey },
  );
  const second = await callGateway(
    "cache-pass-2",
    "/v2/datasets/twse-daily-price?symbol=2330&limit=1",
    { "X-API-Key": apiKey },
  );
  const third = await callGateway(
    "cache-pass-3",
    "/v2/datasets/twse-daily-price?symbol=2330&limit=1",
    { "X-API-Key": apiKey },
  );

  const missing = await callGateway(
    "missing-key",
    "/v2/datasets/twse-daily-price?symbol=2330&limit=1",
  );
  const malformed = await callGateway(
    "malformed-key",
    "/v2/datasets/twse-daily-price?symbol=2330&limit=1",
    { "X-API-Key": "bad-key" },
  );
  const unsupported = await callGateway(
    "unsupported-dataset",
    "/v2/datasets/not-real-dataset?symbol=2330",
    { "X-API-Key": apiKey },
  );

  const failures = [];

  const warmupResults = [first, second, third];
  if (warmupResults.some((item) => item.status === 502 || item.status === 504)) {
    failures.push("upstream issue detected (502/504) during cache warmup; cache validation not pass");
  }

  for (const item of warmupResults) {
    if (item.requestId === "-") {
      failures.push(`${item.label} missing X-Request-Id`);
    }
  }

  if (first.status !== 200 || second.status !== 200 || third.status !== 200) {
    failures.push("cache-pass-1/2/3 must return 200 for cache validation");
  }

  if (first.dryRun !== "true" || second.dryRun !== "true" || third.dryRun !== "true") {
    failures.push("cache-pass-1/2/3 must return X-TWMD-Dry-Run=true");
  }

  if (first.creditsCost !== "1" || second.creditsCost !== "1" || third.creditsCost !== "1") {
    failures.push("cache-pass-1/2/3 must return X-TWMD-Credits-Cost=1");
  }

  if (!(first.cache === "MISS" || first.cache === "-" || first.cache === "STALE")) {
    failures.push("cache-pass-1 should be MISS (or '-' when cache header absent)");
  }

  if (!(isCacheHitLike(second.cache) || second.cache === "-")) {
    failures.push("cache-pass-2 should be HIT/STALE (or '-' when cache header absent)");
  }

  if (!(isCacheHitLike(third.cache) || third.cache === "-")) {
    failures.push("cache-pass-3 should be HIT/STALE (or '-' when cache header absent)");
  }

  if (missing.status !== 401 || missing.errorCode !== "invalid_api_key") {
    failures.push("missing-key should be 401 invalid_api_key");
  }
  if (missing.cache === "HIT") {
    failures.push("missing-key must not return X-TWMD-Cache=HIT");
  }

  if (malformed.status !== 401 || malformed.errorCode !== "invalid_api_key") {
    failures.push("malformed-key should be 401 invalid_api_key");
  }
  if (malformed.cache === "HIT") {
    failures.push("malformed-key must not return X-TWMD-Cache=HIT");
  }

  if (unsupported.status !== 404 || unsupported.errorCode !== "dataset_not_found") {
    failures.push("unsupported-dataset should be 404 dataset_not_found");
  }
  if (unsupported.cache === "HIT") {
    failures.push("unsupported-dataset must not return X-TWMD-Cache=HIT");
  }

  console.log("\\n[SUMMARY]");
  console.log(`cache-sequence=${first.cache} -> ${second.cache} -> ${third.cache}`);
  console.log(`missing-key=${missing.status}/${missing.errorCode} cache=${missing.cache}`);
  console.log(`malformed-key=${malformed.status}/${malformed.errorCode} cache=${malformed.cache}`);
  console.log(`unsupported=${unsupported.status}/${unsupported.errorCode} cache=${unsupported.cache}`);

  if (failures.length > 0) {
    console.error("\\n[FAILED]");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("\\n[PASSED] gateway cache smoke checks completed");
}

main().catch((error) => {
  console.error("[FAILED] smoke_gateway_cache");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
