// VERIFIED per-dataset request params — vendored, single source for BOTH the param table and
// the request examples so they can never disagree. Authority (owner ruling): backend /openapi.json
// drives param name / required / type for the endpoints it documents; the verified fixture drives the
// required-filter NAMES for endpoints openapi does not cover. Date params use start_date/end_date (the
// fixture's date_from is ignored by the backend). Do NOT hand-edit; re-vendor from
// _handoffs/verified_slug_example_params.json × backend /openapi.json.
import type { ParamDoc } from "@/src/content/docs/dataset-pages";

export type VerifiedParam = ParamDoc & { example: string };

export const VERIFIED_DATASET_PARAMS: Record<string, VerifiedParam[]> = {
  "twse-daily-price": [
    { name: "symbol", required: true, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
    { name: "limit", required: false, type: "integer", example: "5", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
  ],
  "tpex-daily-price": [
    { name: "symbol", required: false, type: "string", example: "6488", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
    { name: "limit", required: false, type: "integer", example: "5", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
  ],
  "market-prices": [
    { name: "ticker", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
  ],
  "market-index": [],
  "index-data": [
    { name: "index_code", required: false, type: "string", example: "TWSE_TAIEX", desc: { en: "Index code, e.g. TWSE_TAIEX.", zh: "指數代碼，例如 TWSE_TAIEX。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
  ],
  "stock-price-limit-daily": [
    { name: "symbol", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "monthly-revenue": [
    { name: "symbol", required: true, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
    { name: "limit", required: false, type: "integer", example: "5", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
  ],
  "income-statement": [
    { name: "symbol", required: true, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
    { name: "limit", required: false, type: "integer", example: "5", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
  ],
  "balance-sheet": [
    { name: "symbol", required: true, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
    { name: "limit", required: false, type: "integer", example: "5", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
  ],
  "cash-flow-statement": [
    { name: "symbol", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "financials": [
    { name: "symbol", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "dividends": [
    { name: "ticker", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "institutional-flow": [
    { name: "symbol", required: true, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-15", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
    { name: "limit", required: false, type: "integer", example: "5", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
  ],
  "securities-lending": [
    { name: "symbol", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
    { name: "start_date", required: false, type: "string", example: "2026-06-01", desc: { en: "Start of the query range (YYYY-MM-DD).", zh: "查詢起始日期（YYYY-MM-DD）。" } },
    { name: "end_date", required: false, type: "string", example: "2026-07-17", desc: { en: "End of the query range (YYYY-MM-DD).", zh: "查詢結束日期（YYYY-MM-DD）。" } },
  ],
  "ownership-distribution": [
    { name: "ticker", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "insider-director-holdings": [
    { name: "symbol", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "stock-split-par-value-events": [],
  "business-indicator-monthly": [],
  "macro-global": [
    { name: "series_id", required: false, type: "string", example: "GDP", desc: { en: "Macro series id, e.g. GDP.", zh: "總體序列代碼，例如 GDP。" } },
  ],
  "macro-worldbank": [
    { name: "country", required: false, type: "string", example: "TWN", desc: { en: "Country code, e.g. TWN.", zh: "國家代碼，例如 TWN。" } },
  ],
  "interest-rate-snapshot": [
    { name: "rate_code", required: false, type: "string", example: "CBC_REDISCOUNT_RATE", desc: { en: "Rate code, e.g. CBC_REDISCOUNT_RATE.", zh: "利率代碼，例如 CBC_REDISCOUNT_RATE。" } },
  ],
  "derivatives-market": [
    { name: "dataset_name", required: false, type: "string", example: "taifex_txf_front", desc: { en: "Sub-dataset name, e.g. taifex_txf_front.", zh: "子資料集名稱，例如 taifex_txf_front。" } },
  ],
  "options-daily-taifex": [],
  "taifex-options-settlement-price": [],
  "taifex-institutional-flow": [],
  "convertible-bonds": [],
  "price-enhanced": [
    { name: "ticker", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
  "financial-metrics": [
    { name: "ticker", required: false, type: "string", example: "2330", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  ],
};
