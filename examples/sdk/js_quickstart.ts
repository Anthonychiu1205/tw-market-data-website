import { TWMarketDataClient, TWMarketDataError } from "../../packages/js-sdk/src";

async function main() {
  const apiKey = process.env.TWMD_API_KEY?.trim();
  if (!apiKey) {
    console.log("TWMD_API_KEY is missing");
    return;
  }

  const client = new TWMarketDataClient({
    apiKey,
    baseUrl: process.env.TWMD_BASE_URL || "https://twmarketdata.com",
    timeoutMs: 10_000,
  });

  try {
    const response = await client.twseDailyPrice({ symbol: "2330", limit: 1 });
    console.log("requestId:", response.meta.requestId);
    console.log("dryRun:", response.meta.dryRun);
    console.log("creditsCost:", response.meta.creditsCost);
    console.log("data:", response.data);
  } catch (error) {
    if (error instanceof TWMarketDataError) {
      console.log("request failed");
      console.log("status:", error.status);
      console.log("code:", error.code);
      console.log("requestId:", error.requestId);
      return;
    }

    console.log("unexpected error", error);
  }
}

void main();
