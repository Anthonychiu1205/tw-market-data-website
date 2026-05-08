const baseUrl = (process.env.GATEWAY_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiKey = process.env.GATEWAY_SMOKE_API_KEY?.trim();

function readHeader(headers, name) {
  return headers.get(name) || "-";
}

async function runRequest(label, url, options = {}) {
  const response = await fetch(url, options);
  let errorCode = "-";

  try {
    const body = await response.clone().json();
    const parsedCode = body?.error?.code;
    if (typeof parsedCode === "string") {
      errorCode = parsedCode;
    }
  } catch {
    // best effort: route may return non-json for upstream passthrough
  }

  console.log(`\n[${label}]`);
  console.log(`status=${response.status}`);
  console.log(`errorCode=${errorCode}`);
  console.log(`x-request-id=${readHeader(response.headers, "x-request-id")}`);
  console.log(`x-twmd-plan=${readHeader(response.headers, "x-twmd-plan")}`);
  console.log(`x-twmd-credits-cost=${readHeader(response.headers, "x-twmd-credits-cost")}`);
  console.log(`x-twmd-dry-run=${readHeader(response.headers, "x-twmd-dry-run")}`);
}

async function main() {
  if (!apiKey) {
    console.log("[SKIPPED] GATEWAY_SMOKE_API_KEY is not set.");
    process.exit(0);
  }

  await runRequest(
    "valid-key twse-daily-price",
    `${baseUrl}/v2/datasets/twse-daily-price?symbol=2330&limit=2`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
    },
  );

  await runRequest(
    "missing-key",
    `${baseUrl}/v2/datasets/twse-daily-price?symbol=2330&limit=2`,
  );

  await runRequest(
    "unsupported-dataset",
    `${baseUrl}/v2/datasets/not-a-real-dataset?symbol=2330`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
    },
  );
}

main().catch((error) => {
  console.error("[FAILED] smoke_gateway_dry_run");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
