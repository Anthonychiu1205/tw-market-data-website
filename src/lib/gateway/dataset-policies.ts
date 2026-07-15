// Pure dataset policy data — the SSOT for which plan may call a dataset and what it COSTS.
//
// Deliberately NOT "server-only": the billing dashboard renders the credit-cost table, and it used to
// keep its own hand-maintained copy of these numbers, which had already drifted (it showed monthly
// revenue at 2 credits while the gateway actually charged 3). One table, one truth.
//
// src/lib/gateway/policies.ts re-exports all of this and adds the server-only helpers.

export type GatewayPlanCode = "free" | "starter" | "pro" | "max" | "developer" | "enterprise";

export type DatasetPolicy = {
  datasetSlug: string;
  backendPath: string;
  requiredPlan: GatewayPlanCode;
  creditsCost: number;
};

export const PLAN_LEVEL: Record<GatewayPlanCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  max: 3,
  developer: 4,
  enterprise: 5,
};

// Billable dataset pricing — the pricing SSOT (owner-authorized 2026-07-15, 63 datasets).
//
// Pricing philosophy (1 credit ≈ $0.0025, since $10 = 4,000 credits):
//   free 1cr   基礎價量 / 指數 / 參考(獲客);  free 2cr  還原價
//   starter 2–3cr  衍生(技術 / 估值 / 營收 / 總經 / breadth / 新聞)
//   pro 2–3cr      財報 / 籌碼 / 事件 / 衍生性 / ESG / 風險(差異化主力)
//   max 4cr        分點(進階深)
//
// Anti-arbitrage: endpoints serving the same data cost the same (market-prices == twse/tpex 1cr).
//
// TRIMMED 2026-07-15 (B台 sellability sweep): 9 empty/stub datasets removed so we do not charge for
// shells before charged mode. They now fall through the meter as NO-PRICE (fail-open, free) until
// they have real data and are re-added: derivatives-market, factor-data, structured-events,
// issuer-announcements, market-news, capital-formation-events, cb-institutional,
// convertible-bond-institutional-flow, company-news.
//
// EXCLUDED on purpose (do NOT add): `features`, `time-alignment` — analysis-line tooling, not sold.
// They must be gated off on the read API too; a slug absent from this table has no price and the
// meter returns unknown_dataset, but that only fires once the read API actually calls the meter.
//
// `financials` (pro 4cr) is priced as a 3-statement combined pack (cheaper than 3×2cr). Verify on
// the read API side that it really is a combined endpoint and not a single-table alias — if it is a
// duplicate, exclude it. Not verifiable from this repo.
export const DATASET_ACCESS_POLICIES: Record<string, DatasetPolicy> = {
  "bond-convertible-reference": { datasetSlug: "bond-convertible-reference", backendPath: "/v2/datasets/bond-convertible-reference", requiredPlan: "free", creditsCost: 1 },
  "corporate-actions": { datasetSlug: "corporate-actions", backendPath: "/v2/datasets/corporate-actions", requiredPlan: "free", creditsCost: 1 },
  "fund-etf-metadata": { datasetSlug: "fund-etf-metadata", backendPath: "/v2/datasets/fund-etf-metadata", requiredPlan: "free", creditsCost: 1 },
  "index-classification": { datasetSlug: "index-classification", backendPath: "/v2/datasets/index-classification", requiredPlan: "free", creditsCost: 1 },
  "index-data": { datasetSlug: "index-data", backendPath: "/v2/datasets/index-data", requiredPlan: "free", creditsCost: 1 },
  "interest-rate-snapshot": { datasetSlug: "interest-rate-snapshot", backendPath: "/v2/datasets/interest-rate-snapshot", requiredPlan: "free", creditsCost: 1 },
  "issuer-profile": { datasetSlug: "issuer-profile", backendPath: "/v2/datasets/issuer-profile", requiredPlan: "free", creditsCost: 1 },
  "market-index": { datasetSlug: "market-index", backendPath: "/v2/datasets/market-index", requiredPlan: "free", creditsCost: 1 },
  "market-prices": { datasetSlug: "market-prices", backendPath: "/v2/datasets/market-prices", requiredPlan: "free", creditsCost: 1 },
  "market-snapshot": { datasetSlug: "market-snapshot", backendPath: "/v2/datasets/market-snapshot", requiredPlan: "free", creditsCost: 1 },
  "return-index-daily": { datasetSlug: "return-index-daily", backendPath: "/v2/datasets/return-index-daily", requiredPlan: "free", creditsCost: 1 },
  "security-master": { datasetSlug: "security-master", backendPath: "/v2/datasets/security-master", requiredPlan: "free", creditsCost: 1 },
  "stock-delisting-lifecycle": { datasetSlug: "stock-delisting-lifecycle", backendPath: "/v2/datasets/stock-delisting-lifecycle", requiredPlan: "free", creditsCost: 1 },
  "stock-split-par-value-events": { datasetSlug: "stock-split-par-value-events", backendPath: "/v2/datasets/stock-split-par-value-events", requiredPlan: "free", creditsCost: 1 },
  "tax-business-registration": { datasetSlug: "tax-business-registration", backendPath: "/v2/datasets/tax-business-registration", requiredPlan: "free", creditsCost: 1 },
  "theme-taxonomy": { datasetSlug: "theme-taxonomy", backendPath: "/v2/datasets/theme-taxonomy", requiredPlan: "free", creditsCost: 1 },
  "tpex-daily-price": { datasetSlug: "tpex-daily-price", backendPath: "/v2/datasets/tpex-daily-price", requiredPlan: "free", creditsCost: 1 },
  "twse-daily-price": { datasetSlug: "twse-daily-price", backendPath: "/v2/datasets/twse-daily-price", requiredPlan: "free", creditsCost: 1 },
  "warrants-reference": { datasetSlug: "warrants-reference", backendPath: "/v2/datasets/warrants-reference", requiredPlan: "free", creditsCost: 1 },
  "adjusted-prices": { datasetSlug: "adjusted-prices", backendPath: "/v2/datasets/adjusted-prices", requiredPlan: "free", creditsCost: 2 },
  "business-indicator-monthly": { datasetSlug: "business-indicator-monthly", backendPath: "/v2/datasets/business-indicator-monthly", requiredPlan: "starter", creditsCost: 2 },
  "corporate-actions-enhanced": { datasetSlug: "corporate-actions-enhanced", backendPath: "/v2/datasets/corporate-actions-enhanced", requiredPlan: "starter", creditsCost: 2 },
  "day-trading-suspension": { datasetSlug: "day-trading-suspension", backendPath: "/v2/datasets/day-trading-suspension", requiredPlan: "starter", creditsCost: 2 },
  "disposition-securities-period": { datasetSlug: "disposition-securities-period", backendPath: "/v2/datasets/disposition-securities-period", requiredPlan: "starter", creditsCost: 2 },
  "dividends": { datasetSlug: "dividends", backendPath: "/v2/datasets/dividends", requiredPlan: "starter", creditsCost: 2 },
  "index-constituents": { datasetSlug: "index-constituents", backendPath: "/v2/datasets/index-constituents", requiredPlan: "starter", creditsCost: 2 },
  "macro-global": { datasetSlug: "macro-global", backendPath: "/v2/datasets/macro-global", requiredPlan: "starter", creditsCost: 2 },
  "macro-worldbank": { datasetSlug: "macro-worldbank", backendPath: "/v2/datasets/macro-worldbank", requiredPlan: "starter", creditsCost: 2 },
  "market-breadth": { datasetSlug: "market-breadth", backendPath: "/v2/datasets/market-breadth", requiredPlan: "starter", creditsCost: 2 },
  "market-overview-snapshots": { datasetSlug: "market-overview-snapshots", backendPath: "/v2/datasets/market-overview-snapshots", requiredPlan: "starter", creditsCost: 2 },
  "price-enhanced": { datasetSlug: "price-enhanced", backendPath: "/v2/datasets/price-enhanced", requiredPlan: "starter", creditsCost: 2 },
  "stock-price-limit-daily": { datasetSlug: "stock-price-limit-daily", backendPath: "/v2/datasets/stock-price-limit-daily", requiredPlan: "starter", creditsCost: 2 },
  "taifex-options-settlement-price": { datasetSlug: "taifex-options-settlement-price", backendPath: "/v2/datasets/taifex-options-settlement-price", requiredPlan: "starter", creditsCost: 2 },
  "valuation-core-daily": { datasetSlug: "valuation-core-daily", backendPath: "/v2/datasets/valuation-core-daily", requiredPlan: "starter", creditsCost: 2 },
  "valuation-data": { datasetSlug: "valuation-data", backendPath: "/v2/datasets/valuation-data", requiredPlan: "starter", creditsCost: 2 },
  "monthly-revenue": { datasetSlug: "monthly-revenue", backendPath: "/v2/datasets/monthly-revenue", requiredPlan: "starter", creditsCost: 3 },
  "monthly-revenue-enhanced": { datasetSlug: "monthly-revenue-enhanced", backendPath: "/v2/datasets/monthly-revenue-enhanced", requiredPlan: "starter", creditsCost: 3 },
  "technical-indicators": { datasetSlug: "technical-indicators", backendPath: "/v2/datasets/technical-indicators", requiredPlan: "starter", creditsCost: 3 },
  "balance-sheet": { datasetSlug: "balance-sheet", backendPath: "/v2/datasets/balance-sheet", requiredPlan: "pro", creditsCost: 2 },
  "cash-flow-statement": { datasetSlug: "cash-flow-statement", backendPath: "/v2/datasets/cash-flow-statement", requiredPlan: "pro", creditsCost: 2 },
  "convertible-bonds": { datasetSlug: "convertible-bonds", backendPath: "/v2/datasets/convertible-bonds", requiredPlan: "pro", creditsCost: 2 },
  "etf-flow": { datasetSlug: "etf-flow", backendPath: "/v2/datasets/etf-flow", requiredPlan: "pro", creditsCost: 2 },
  "etf-holdings": { datasetSlug: "etf-holdings", backendPath: "/v2/datasets/etf-holdings", requiredPlan: "pro", creditsCost: 2 },
  "events": { datasetSlug: "events", backendPath: "/v2/datasets/events", requiredPlan: "pro", creditsCost: 2 },
  "income-statement": { datasetSlug: "income-statement", backendPath: "/v2/datasets/income-statement", requiredPlan: "pro", creditsCost: 2 },
  "institutional-flow": { datasetSlug: "institutional-flow", backendPath: "/v2/datasets/institutional-flow", requiredPlan: "pro", creditsCost: 2 },
  "institutional-flow-market-aggregate": { datasetSlug: "institutional-flow-market-aggregate", backendPath: "/v2/datasets/institutional-flow-market-aggregate", requiredPlan: "pro", creditsCost: 2 },
  "institutional-ownership": { datasetSlug: "institutional-ownership", backendPath: "/v2/datasets/institutional-ownership", requiredPlan: "pro", creditsCost: 2 },
  "margin-short": { datasetSlug: "margin-short", backendPath: "/v2/datasets/margin-short", requiredPlan: "pro", creditsCost: 2 },
  // securities-lending: backendPath intentionally kept at the legacy chip-deep path — the retiring
  // /v2 proxy still routes through backendPath, and only the slug→cost mapping matters to the meter.
  "securities-lending": { datasetSlug: "securities-lending", backendPath: "/v2/datasets/chip-deep-securities-lending-daily", requiredPlan: "pro", creditsCost: 2 },
  "total-margin-short": { datasetSlug: "total-margin-short", backendPath: "/v2/datasets/total-margin-short", requiredPlan: "pro", creditsCost: 2 },
  "chip-flows": { datasetSlug: "chip-flows", backendPath: "/v2/datasets/chip-flows", requiredPlan: "pro", creditsCost: 3 },
  "company-risk-events": { datasetSlug: "company-risk-events", backendPath: "/v2/datasets/company-risk-events", requiredPlan: "pro", creditsCost: 3 },
  "esg-tesg": { datasetSlug: "esg-tesg", backendPath: "/v2/datasets/esg-tesg", requiredPlan: "pro", creditsCost: 3 },
  "financial-metrics": { datasetSlug: "financial-metrics", backendPath: "/v2/datasets/financial-metrics", requiredPlan: "pro", creditsCost: 3 },
  "insider-director-holdings": { datasetSlug: "insider-director-holdings", backendPath: "/v2/datasets/insider-director-holdings", requiredPlan: "pro", creditsCost: 3 },
  "margin-short-enhanced": { datasetSlug: "margin-short-enhanced", backendPath: "/v2/datasets/margin-short-enhanced", requiredPlan: "pro", creditsCost: 3 },
  "options-daily-taifex": { datasetSlug: "options-daily-taifex", backendPath: "/v2/datasets/options-daily-taifex", requiredPlan: "pro", creditsCost: 3 },
  "ownership-distribution": { datasetSlug: "ownership-distribution", backendPath: "/v2/datasets/ownership-distribution", requiredPlan: "pro", creditsCost: 3 },
  "screener": { datasetSlug: "screener", backendPath: "/v2/datasets/screener", requiredPlan: "pro", creditsCost: 3 },
  "taifex-institutional-flow": { datasetSlug: "taifex-institutional-flow", backendPath: "/v2/datasets/taifex-institutional-flow", requiredPlan: "pro", creditsCost: 3 },
  "financials": { datasetSlug: "financials", backendPath: "/v2/datasets/financials", requiredPlan: "pro", creditsCost: 4 },
  "broker-branch-reference": { datasetSlug: "broker-branch-reference", backendPath: "/v2/datasets/broker-branch-reference", requiredPlan: "max", creditsCost: 4 },
}

export const DATASET_CREDIT_COSTS = Object.fromEntries(
  Object.entries(DATASET_ACCESS_POLICIES).map(([datasetSlug, policy]) => [datasetSlug, policy.creditsCost]),
);
