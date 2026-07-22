// VERIFIED request-example params — vendored from the backend fixture
// (_handoffs/verified_slug_example_params.json, 26 verified slugs). These are the REAL
// working query params (incl. dataset-specific required filters like index_code / rate_code /
// series_id / country / dataset_name, and ticker vs symbol) captured against the live API, so
// the docs request examples match what actually returns rows — never a guessed param. A slug
// absent here falls back to the generic symbol=2330 example. Do NOT hand-edit; re-vendor from
// the fixture. 鐵則②/③: 顯示的範例參數走真源。
export const VERIFIED_REQUEST_EXAMPLES: Record<string, Record<string, string>> = {
  "twse-daily-price": { "symbol": "2330", "date_from": "2026-06-01", "date_to": "2026-07-15" },
  "tpex-daily-price": { "symbol": "6488", "date_from": "2026-06-01", "date_to": "2026-07-15" },
  "market-prices": { "symbol": "2330", "date_from": "2026-06-01", "date_to": "2026-07-15" },
  "market-index": {  },
  "index-data": { "index_code": "TWSE_TAIEX", "date_from": "2026-06-01", "date_to": "2026-07-15" },
  "stock-price-limit-daily": { "symbol": "2330" },
  "monthly-revenue": { "symbol": "2330" },
  "income-statement": { "symbol": "2330" },
  "balance-sheet": { "symbol": "2330" },
  "cash-flow-statement": { "symbol": "2330" },
  "financials": { "symbol": "2330" },
  "dividends": { "ticker": "2330" },
  "institutional-flow": { "symbol": "2330", "date_from": "2026-06-01", "date_to": "2026-07-15" },
  "securities-lending": { "symbol": "2330", "date_from": "2026-06-01", "date_to": "2026-07-17" },
  "ownership-distribution": { "ticker": "2330" },
  "insider-director-holdings": { "symbol": "2330" },
  "stock-split-par-value-events": {  },
  "business-indicator-monthly": {  },
  "macro-global": { "series_id": "GDP" },
  "macro-worldbank": { "country": "TWN" },
  "interest-rate-snapshot": { "rate_code": "CBC_REDISCOUNT_RATE" },
  "derivatives-market": { "dataset_name": "taifex_txf_front" },
  "options-daily-taifex": {  },
  "taifex-options-settlement-price": {  },
  "taifex-institutional-flow": {  },
  "convertible-bonds": {  },
};
