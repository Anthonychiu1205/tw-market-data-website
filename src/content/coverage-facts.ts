// Marketing-safe coverage facts — the single in-repo SSOT for any coverage NUMBER shown to the
// public (SEO/AEO pages, Dataset schema temporalCoverage, etc.).
//
// Source of truth: tw-feature-engine `docs/coverage/MARKETING_SAFE_COVERAGE_FACTS.md`, a read-only
// DB-measured snapshot verified by D on 2026-07-11. DO NOT invent or round beyond what is stated
// there; anything not listed as "safe to claim" must not appear on the site.
//
// Explicitly NOT claimable yet (do not add here): "weekly official reconciliation" as a live
// feature (harness built, single pass only, no cron — roadmap only) and a production hosted MCP
// endpoint (MCP stays "preview"). See §2 of the source doc.

export const COVERAGE_FACTS_SNAPSHOT_DATE = "2026-07-11";

export const coverageFacts = {
  twseDailyPrice: {
    rows: 5_215_311,
    rowsDisplay: "5.2 million",
    stocks: 1_682,
    earliestDate: "2004-02-11",
    latestDate: "2026-07-08",
    // Survivorship-bias-free: stocks that have stopped trading (>90 days) but whose full price
    // history is retained. 262 of these carry an official delisting date in security_master_items.
    stoppedTradingStocks: 311,
    delistedWithOfficialDate: 262,
  },
  tpexDailyPrice: {
    rows: 3_920_223,
    stocks: 11_757,
    earliestDate: "1994-01-05",
  },
  monthlyRevenue: {
    rows: 331_109,
    stocks: 2_096,
    earliestPeriod: "2010-01",
    latestPeriod: "2026-06",
  },
} as const;

// Dataset-page temporalCoverage (schema.org ISO 8601 interval) for datasets with a DB-verified
// coverage window. Keyed by dataset slug; only include slugs with a real window from the source doc.
export const datasetTemporalCoverage: Record<string, string> = {
  "twse-daily-price": `${coverageFacts.twseDailyPrice.earliestDate}/${coverageFacts.twseDailyPrice.latestDate}`,
  "monthly-revenue": `${coverageFacts.monthlyRevenue.earliestPeriod}/${coverageFacts.monthlyRevenue.latestPeriod}`,
};
