import { TWMarketDataClient } from "../../packages/js-sdk/src";

type ResearchContext = {
  symbol: string;
  issuerProfile: unknown;
  latestPriceRows: unknown;
  monthlyRevenueRows: unknown;
  trace: {
    issuerProfileRequestId: string | null;
    twsePriceRequestId: string | null;
    monthlyRevenueRequestId: string | null;
    dryRun: boolean | null;
    estimatedCreditsCost: number;
  };
};

async function run() {
  const apiKey = process.env.TWMD_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("TWMD_API_KEY is required.");
  }

  const client = new TWMarketDataClient({
    apiKey,
    baseUrl: process.env.TWMD_BASE_URL || "https://twmarketdata.com",
    timeoutMs: 10000,
  });

  const symbol = process.env.TWMD_SYMBOL || "2330";

  const issuer = await client.issuerProfile({ symbol });
  const prices = await client.twseDailyPrice({ symbol, limit: 5 });
  const revenue = await client.monthlyRevenue({ symbol, limit: 12 });

  const context: ResearchContext = {
    symbol,
    issuerProfile: issuer.data,
    latestPriceRows: prices.data,
    monthlyRevenueRows: revenue.data,
    trace: {
      issuerProfileRequestId: issuer.meta.requestId,
      twsePriceRequestId: prices.meta.requestId,
      monthlyRevenueRequestId: revenue.meta.requestId,
      dryRun: issuer.meta.dryRun,
      estimatedCreditsCost: [issuer.meta.creditsCost, prices.meta.creditsCost, revenue.meta.creditsCost]
        .map((value) => value || 0)
        .reduce((sum, value) => sum + value, 0),
    },
  };

  console.log(JSON.stringify(context, null, 2));
}

run().catch((error) => {
  console.error("simple_research_agent_failed", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
