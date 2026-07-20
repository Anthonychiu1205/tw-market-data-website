// API TRUTH — the single source of truth for what our API actually is, established by CALLING it, not
// by reading our own docs. Everything here was captured on the date below; nothing is hand-authored
// from intent. This exists because four in-repo descriptions of the API contradicted each other and
// none matched reality (rule 5: 改一個數字前先問「有幾個源」).
//
// HOW TO RE-CAPTURE (re-run these, then update this file + the fixture beside it):
//
//   # gateway, no key  → missing_api_key
//   curl -s "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=1"
//   # gateway, bad key → invalid_api_key
//   curl -s -H "X-API-Key: sk_live_bogus" "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=1"
//   # backend, no key  → 200 (see the OPEN-BACKEND note below)
//   curl -s "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=2"

export const API_TRUTH_CAPTURED_AT = "2026-07-20";

// ── Bases ──────────────────────────────────────────────────────────────────────
// Both hosts are real and they are NOT interchangeable.

// The CUSTOMER-facing base. Validates the API key, enforces plan entitlement, meters credits, and
// returns the gateway error contract below. This is what docs must print.
// Verified: GET without a key → 401 missing_api_key.
export const API_GATEWAY_BASE_URL = "https://twmarketdata.com";

// The upstream read API the gateway proxies to (BACKEND_API_BASE_URL in .env). Not the customer path.
// ⚠️ OPEN-BACKEND: as captured, this host served full dataset rows over plain GET with NO API key and
// no metering. Documenting it as the customer base would route paying users around billing entirely.
// Flagged to the owner; not a website-side fix.
export const API_BACKEND_BASE_URL = "https://api.twmarketdata.com";

// ── Auth ───────────────────────────────────────────────────────────────────────
// Verified by probing both header styles against the gateway:
//   X-API-Key: <bad key>            → 401 invalid_api_key   (header IS read)
//   Authorization: Bearer <bad key> → 401 missing_api_key   (header is NOT read)
export const API_AUTH_HEADER = "X-API-Key";

// ── Success envelope ───────────────────────────────────────────────────────────
// The capture itself is API_CAPTURED_SUCCESS_BODIES below — held as one constant rather than a
// separate .json fixture so there is exactly one copy to keep honest (rule 1).
//
// This differs from EVERY prior in-repo description, so read it carefully:
//   - the row array is `rows`, NOT `data`
//   - `source_role` and `lineage` are TOP-LEVEL, not per-row
//   - there is no `pagination` and no `data_gaps` (both are OpenAPI fiction)
export const API_SUCCESS_ENVELOPE_KEYS = [
  "dataset",
  "rows",
  "count",
  "data_as_of",
  "source_role",
  "lineage",
  "meta",
] as const;

export const API_ROWS_KEY = "rows";

// The provenance the API really ships, at the top level of the response.
export const API_PROVENANCE_KEYS = ["source_role", "lineage", "data_as_of"] as const;

// Keys inside the top-level `lineage` object.
export const API_LINEAGE_KEYS = [
  "provider",
  "official_source",
  "source_endpoints",
  "table",
  "dataset",
  "not_investment_advice",
] as const;

// Keys the GATEWAY merges into `meta` on top of the upstream body (src/lib/gateway/response.ts
// mergeMetaField). Confirmed from code; a live capture through the gateway needs a real sk_live_ key,
// which was not available at capture time — see API_TRUTH_GAPS.
export const API_GATEWAY_META_KEYS = ["requestId", "dryRun", "creditsCost", "creditsCharged", "planCode"] as const;

// Real captured 200 bodies, keyed by dataset slug, verbatim apart from trimming the `market_status`
// calendar to two entries for length. Values are REAL market data as of the capture date — 2330 closed
// at 2290.0 on 2026-07-17. Any dataset absent from this map has NOT been captured; docs must label its
// example illustrative rather than implying it was observed.
export const API_CAPTURED_SUCCESS_BODIES: Record<string, string> = {
  "twse-daily-price": `{
  "dataset": "twse_daily_price",
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-07-17",
      "open": 2375.0,
      "high": 2395.0,
      "low": 2290.0,
      "close": 2290.0,
      "volume_shares": 97362670,
      "turnover_value": 229051751965,
      "trade_count": 1150086,
      "price_change": -180.0,
      "price_change_sign": "-",
      "price_method": "official",
      "price_confidence": null
    },
    {
      "symbol": "2330",
      "date": "2026-07-16",
      "open": 2430.0,
      "high": 2470.0,
      "low": 2420.0,
      "close": 2470.0,
      "volume_shares": 30538604,
      "turnover_value": 74750491934,
      "trade_count": 97957,
      "price_change": 30.0,
      "price_change_sign": "+",
      "price_method": "official",
      "price_confidence": null
    }
  ],
  "count": 2,
  "data_as_of": "2026-07-17",
  "source_role": "official_twse",
  "lineage": {
    "provider": "TWSE",
    "official_source": ["official_twse"],
    "source_endpoints": [
      "twse_mi_index_allbut0999_json",
      "twse_official_stock_day",
      "twse_stock_day_all_openapi"
    ],
    "table": "normalized_twse_daily_prices",
    "dataset": "twse_daily_price",
    "not_investment_advice": true
  },
  "meta": {
    "last_trading_day": "2026-07-16",
    "market_status": [
      { "date": "2026-07-16", "status": "open" },
      { "date": "2026-07-17", "status": "unknown" }
    ]
  }
}`,
};

// ── Error envelope ─────────────────────────────────────────────────────────────
// Captured live from the gateway. Shape: { error: { code, message }, requestId }. Messages are English
// regardless of locale — the API does not localize them, so docs must not show a translated version.
export const API_ERROR_ENVELOPE_KEYS = ["error", "requestId"] as const;

export type CapturedError = { status: number; code: string; message: string };

export const API_CAPTURED_ERRORS: CapturedError[] = [
  { status: 401, code: "missing_api_key", message: "API key is required." },
  { status: 401, code: "invalid_api_key", message: "Invalid API key." },
  { status: 404, code: "dataset_not_found", message: "Dataset not found." },
];

// ── What is still NOT verified ─────────────────────────────────────────────────
// Honest gaps, so nothing downstream mistakes this file for complete (rule 2).
export const API_TRUTH_GAPS = [
  "No sk_live_ key was available, so no 200 has been captured THROUGH the gateway — the success body here is the upstream body the gateway forwards, without the gateway's injected meta keys.",
  "402 insufficient_credits and 403 plan_not_entitled are traced to their throw sites in code but not yet captured live (both need a real key in a specific wallet/plan state).",
  "Only twse-daily-price was captured. Other datasets may carry different row keys; do not assume this row shape generalizes.",
] as const;
