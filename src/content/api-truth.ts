// API TRUTH — the single source of truth for what our API actually is, established by CALLING it,
// not by reading our own docs. This exists because several in-repo descriptions of the API
// contradicted each other and none matched reality (rule 5: 改一個數字前先問「有幾個源」).
//
// HOW TO RE-CAPTURE (re-run these, then update this file and ./api-captures.ts):
//
//   # customer path, free-tier dataset, no key  → 200
//   curl -s "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=2"
//   # customer path, paid dataset, no key       → 401 missing_api_key
//   curl -s "https://api.twmarketdata.com/v2/datasets/dividends?symbol=2330"
//   # customer path, bad key                    → 401 invalid_api_key
//   curl -s -H "X-API-Key: sk_live_bogus" "https://api.twmarketdata.com/v2/datasets/dividends?symbol=2330"

export const API_TRUTH_CAPTURED_AT = "2026-07-20";

// ── Base ───────────────────────────────────────────────────────────────────────
// The CUSTOMER base. `sk_live_` keys authenticate here; this is what docs must print.
// Verified: a bogus sk_live_ key returns 401 invalid_api_key, and paid datasets return 401
// missing_api_key without one.
export const API_BASE_URL = "https://api.twmarketdata.com";

// NOT the customer path: the website also exposes a billing gateway at
// https://twmarketdata.com/v2/datasets/... . It has its OWN key namespace and rejects sk_live_ keys,
// and its error envelope differs from the read API's (see READ_API_ERRORS below vs
// src/lib/gateway/error-codes.ts). Do not document it as the customer endpoint.
export const API_GATEWAY_BASE_URL = "https://twmarketdata.com";

// ── Auth ───────────────────────────────────────────────────────────────────────
// Verified against the read API: the header is read, and the key format is sk_live_.
export const API_AUTH_HEADER = "X-API-Key";
export const API_KEY_PREFIX = "sk_live_";

// ── Success envelope ───────────────────────────────────────────────────────────
// There is NO single success envelope. See ./api-captures.ts — the row array is `data`, `rows` or
// `items` depending on the dataset, across nine distinct top-level shapes, and provenance appears as
// either a singular top-level `source_role` or a plural `lineage.source_roles`. Anything that needs a
// success body must read that dataset's own capture; there is deliberately no shared shape constant
// here, because publishing one would be inventing a contract the API does not honour.

// ── Error envelope ─────────────────────────────────────────────────────────────
// Captured live from the READ API. Shape: { "error": "<code>", "message": "<text>" } — `error` is a
// FLAT STRING, and there is no requestId. This differs from the gateway's
// { error: { code, message }, requestId }; the gateway's contract lives in gateway/error-codes.ts and
// does not apply to customers.
//
// The `message` values are returned in CHINESE regardless of the caller. Docs must not invent an
// English translation and present it as the API's response: /zh shows them verbatim, /en replaces the
// message VALUE with a marker and says the API answers in Chinese.
export const API_ERROR_ENVELOPE_KEYS = ["error", "message"] as const;

export type ReadApiError = {
  status: number;
  /** The flat `error` value, verbatim. */
  code: string;
  /** The `message` value, verbatim (Chinese, as the API returns it). */
  messageZh: string;
  /** What triggers it — our words, not the API's. Bilingual, for the caption beside the example. */
  when: { en: string; zh: string };
};

export const READ_API_ERRORS: ReadApiError[] = [
  {
    status: 400,
    code: "missing_required_filter",
    messageZh: "Missing required filter",
    when: {
      en: "A required filter was not supplied. The body does not name which one — supplying the right filter can flip this to 403 if the plan also lacks access.",
      zh: "缺少必要的篩選參數。回應不會指明是哪一個；補上正確參數後，若方案無權限則會轉為 403。",
    },
  },
  {
    status: 401,
    code: "missing_api_key",
    messageZh: "缺少 API 金鑰。請在 X-API-KEY 標頭帶入金鑰,或改打五檔免金鑰試玩端點。",
    when: {
      en: "No X-API-Key header was sent to a dataset that requires one.",
      zh: "呼叫需要金鑰的資料集時未帶 X-API-Key 標頭。",
    },
  },
  {
    status: 401,
    code: "invalid_api_key",
    messageZh: "API 金鑰無效。請確認金鑰是否正確或已被撤銷。",
    when: {
      en: "The key was sent but is unknown or has been revoked.",
      zh: "有帶金鑰,但金鑰不存在或已被撤銷。",
    },
  },
  {
    status: 403,
    code: "commercial_use_not_allowed",
    messageZh:
      "Developer 僅限個人開發與測試使用,不可用於商業產品或對外服務。 升級至 Pro 或 Enterprise 以用於商業產品與正式環境。",
    when: {
      en: "The key is valid but its plan does not cover this dataset. Captured with a Developer-tier key on 2026-07-20.",
      zh: "金鑰有效,但方案未涵蓋此資料集。2026-07-20 以 Developer 方案金鑰實測擷取。",
    },
  },
  {
    status: 404,
    code: "Not Found",
    messageZh: "Not found",
    when: {
      en: "No dataset exists at this path. This body is generic — it carries no dataset-specific code.",
      zh: "此路徑沒有對應的資料集。此回應為通用格式,不帶資料集專屬錯誤碼。",
    },
  },
  {
    status: 422,
    code: "validation_error",
    messageZh: "ticker: Field required",
    when: {
      en: "A parameter is missing or malformed. Unlike 400, this body names the field — several datasets use `ticker` rather than `symbol`.",
      zh: "參數缺漏或格式錯誤。與 400 不同,此回應會指明欄位 —— 部分資料集用 `ticker` 而非 `symbol`。",
    },
  },
];

// The placeholder shown in place of a Chinese message on /en. Deliberately not a translation.
export const LOCALIZED_MESSAGE_PLACEHOLDER = "<localized message>";

export function readApiErrorBody(error: ReadApiError, locale: string): string {
  const message = locale === "en" ? LOCALIZED_MESSAGE_PLACEHOLDER : error.messageZh;
  return JSON.stringify({ error: error.code, message }, null, 2);
}

// ── What is still NOT verified ─────────────────────────────────────────────────
// Honest gaps, so nothing downstream mistakes this file for complete (rule 2).
export const API_TRUTH_GAPS = [
  "30 of the 64 sellable datasets are captured. The other 34 are blocked by PLAN TIER, not by missing data: the capture key is Developer-tier, and 24 datasets answer 403 commercial_use_not_allowed. Another 9 answer 400/422 first, but supplying the parameter they ask for flips them to the same 403 — so they are plan-blocked too. Re-running the capture script with a Pro/Enterprise key should fill all 33.",
  "securities-lending answers 404 Not Found — the route does not exist on the read API even though the billing SSOT sells the slug. That is a backend/catalogue mismatch, not a docs gap.",
  "Rate limiting (429) and upstream failures (5xx) have not been observed on the read API.",
] as const;

// ── Billing-gate mismatch worth an owner's attention ───────────────────────────
// Not a docs problem; recorded here because it surfaced while capturing. `monthly-revenue` is
// requiredPlan "pro" in the billing SSOT yet returns 200 with NO API key. Other paid datasets
// (dividends, technical-indicators, valuation-data, company-risk-events) correctly return 401. The
// free tier being public is by design; this one looks like a gap rather than a policy.
export const API_UNGATED_PAID_DATASETS = ["monthly-revenue"] as const;
