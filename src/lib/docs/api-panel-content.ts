// Builders for the dataset API pages' right-hand Request / Response panel. Pure and dependency-light
// so every snippet and body is unit-tested rather than eyeballed.
//
// TRUTH SOURCES (rule 2 — nothing here is invented):
//   - auth header `X-API-Key`  → public/openapi.json securitySchemes (ApiKeyAuth, type apiKey, in header)
//   - endpoint path            → DATASET_ACCESS_POLICIES.backendPath (billing SSOT), passed in
//   - query parameters         → each dataset's documented params (STANDARD/REFERENCE_PARAMS)
//   - response `meta` keys     → src/lib/gateway/response.ts mergeMetaField, which the gateway
//                                GUARANTEES it injects on every JSON object response
//   - error status/code/message→ src/lib/gateway/error-codes.ts (the gateway's own contract)
//
// NOT documented here, on purpose:
//   - `data_grade` — it exists nowhere in the product. The grade shown on these pages is the STATIC
//     docs classification (dataset-grade.ts), rendered as a badge and labelled as such, never as a
//     response field.
//   - Any row-level field the page does not already publish. buildSuccessBody only ever re-uses the
//     dataset's own documented example row, so this panel adds zero new claims about the row shape.
//   - The SDKs (packages/python-sdk, packages/js-sdk): real code, but unpublished (`private: true`,
//     no PyPI release), so the snippets use `requests` / `fetch` — the same raw-HTTP style the rest of
//     the docs use and the only style a reader can actually run today.

// Relative (not `@/`) so the unit tests can import this module directly under `node --test`.
import { GATEWAY_DEFAULT_MESSAGES, GATEWAY_ERROR_STATUS, type GatewayErrorCode } from "../gateway/error-codes.ts";

// TODO(owner): the repo documents two different bases and they contradict —
//   api.twmarketdata.com   (all site content + answer pages + self-serve-client, whose comment calls
//                           it the backend read API)
//   twmarketdata.com       (openapi.json `servers`, both SDK defaults, and the actual billing gateway
//                           route app/v2/datasets/[dataset])
// Held at api.twmarketdata.com so this panel matches the 64 page bodies rather than creating a third
// variant. Confirm which one a customer's X-API-Key is meant to hit, then change it HERE and in
// dataset-doc-page.tsx together.
export const API_BASE_URL = "https://api.twmarketdata.com";

export type PanelParam = { name: string; required: boolean };

export type RequestLanguage = "curl" | "python" | "javascript" | "typescript";

export const REQUEST_LANGUAGES: { id: RequestLanguage; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
];

// Example argument values for the documented params. `symbol` uses 2330 because that is the ticker the
// dataset pages' example rows were written for; the rest illustrate shape only. A param we do not
// document is skipped rather than given a made-up value.
export function exampleArgs(params: PanelParam[]): { name: string; value: string; quoted: boolean }[] {
  const out: { name: string; value: string; quoted: boolean }[] = [];
  for (const p of params) {
    switch (p.name) {
      case "symbol":
        out.push({ name: "symbol", value: "2330", quoted: true });
        break;
      case "start_date":
        out.push({ name: "start_date", value: "2026-01-01", quoted: true });
        break;
      case "end_date":
        out.push({ name: "end_date", value: "2026-06-30", quoted: true });
        break;
      case "limit":
        out.push({ name: "limit", value: "5", quoted: false });
        break;
      default:
        break;
    }
  }
  return out;
}

function queryString(params: PanelParam[]): string {
  return exampleArgs(params)
    .map((a) => `${a.name}=${a.value}`)
    .join("&");
}

export function buildCurlSnippet(backendPath: string, params: PanelParam[]): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  return `curl "${url}" \\
  -H "X-API-Key: $TWMD_API_KEY"`;
}

export function buildPythonSnippet(backendPath: string, params: PanelParam[]): string {
  const args = exampleArgs(params)
    .map((a) => `        "${a.name}": ${a.quoted ? `"${a.value}"` : a.value},`)
    .join("\n");
  const paramsBlock = args ? `\n    params={\n${args}\n    },` : "";
  return `import os
import requests

resp = requests.get(
    "${API_BASE_URL}${backendPath}",${paramsBlock}
    headers={"X-API-Key": os.environ["TWMD_API_KEY"]},
)
resp.raise_for_status()

for row in resp.json()["data"]:
    print(row)`;
}

export function buildJavaScriptSnippet(backendPath: string, params: PanelParam[]): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  return `const res = await fetch(
  "${url}",
  { headers: { "X-API-Key": process.env.TWMD_API_KEY } },
);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

const { data } = await res.json();
console.log(data);`;
}

export function buildTypeScriptSnippet(backendPath: string, params: PanelParam[]): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  // `meta` is typed from the keys the gateway is proven to inject (src/lib/gateway/response.ts).
  return `type DatasetResponse<Row> = {
  data: Row[];
  meta: {
    requestId: string;
    planCode?: string;
    creditsCost?: number;
    creditsCharged?: number;
    dryRun: boolean;
  };
};

const res = await fetch(
  "${url}",
  { headers: { "X-API-Key": process.env.TWMD_API_KEY! } },
);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

const { data, meta }: DatasetResponse<Record<string, unknown>> = await res.json();
console.log(meta.requestId, data);`;
}

export function buildRequestSnippet(
  language: RequestLanguage,
  input: { backendPath: string; params: PanelParam[] },
): string {
  switch (language) {
    case "curl":
      return buildCurlSnippet(input.backendPath, input.params);
    case "python":
      return buildPythonSnippet(input.backendPath, input.params);
    case "javascript":
      return buildJavaScriptSnippet(input.backendPath, input.params);
    case "typescript":
      return buildTypeScriptSnippet(input.backendPath, input.params);
  }
}

// ── Response bodies ──

// The statuses this panel documents, each traced to a real throw site. 400 is deliberately absent: the
// gateway never emits one. (The OpenAPI spec's `INVALID_QUERY` / uppercase error shape is stale and
// contradicts the codes the gateway actually serves — error-codes.ts is the truth.)
export const PANEL_ERROR_CODES: GatewayErrorCode[] = [
  "invalid_api_key",
  "insufficient_credits",
  "plan_not_entitled",
  "dataset_not_found",
];

export function errorStatusFor(code: GatewayErrorCode): number {
  return GATEWAY_ERROR_STATUS[code];
}

export const PANEL_STATUSES: string[] = ["200", ...PANEL_ERROR_CODES.map((code) => String(errorStatusFor(code)))];

// Mirrors createGatewayErrorBody in src/lib/gateway/errors.ts: { error: { code, message }, requestId }.
// The message is the gateway's real English default — the API returns English regardless of locale, so
// this is identical on /en and /zh rather than a translated fiction.
export function buildErrorBody(code: GatewayErrorCode): string {
  return JSON.stringify(
    { error: { code, message: GATEWAY_DEFAULT_MESSAGES[code] }, requestId: "req_01J8ZC4W2Q" },
    null,
    2,
  );
}

export type SuccessBodyResult = {
  body: string;
  // false when the dataset's documented example is not parseable on its own (a few pages show bare
  // rows rather than a whole envelope). We then render the envelope shape with a pointer to the
  // page's Example response section instead of inventing rows.
  embeddedExample: boolean;
};

// Wraps the dataset's OWN documented example row(s) in the response envelope the gateway really
// returns. `meta` carries only the keys src/lib/gateway/response.ts is proven to inject.
export function buildSuccessBody(input: {
  exampleJson: string;
  datasetSlug: string;
  planCode: string;
  creditsCost: number;
}): SuccessBodyResult {
  const meta = {
    dataset: input.datasetSlug,
    requestId: "req_01J8ZC4W2Q",
    planCode: input.planCode,
    creditsCost: input.creditsCost,
    dryRun: false,
  };

  let rows: unknown = null;
  try {
    const parsed: unknown = JSON.parse(input.exampleJson);
    if (Array.isArray(parsed)) {
      rows = parsed;
    } else if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      rows = "data" in record ? record.data : [record];
    }
  } catch {
    rows = null;
  }

  if (rows === null) {
    return {
      body: JSON.stringify({ data: ["<see the Example response section on this page>"], meta }, null, 2),
      embeddedExample: false,
    };
  }

  return { body: JSON.stringify({ data: rows, meta }, null, 2), embeddedExample: true };
}
