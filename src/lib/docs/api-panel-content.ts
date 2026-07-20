// Builders for the dataset API pages' right-hand Request / Response panel. Pure and dependency-light
// so every snippet and body is unit-tested rather than eyeballed.
//
// TRUTH SOURCES (rule 2 — nothing here is invented):
//   - base URL, auth header,   → src/content/api-truth.ts — CAPTURED by calling the API, which is the
//     envelope + row shape       only reason we know the row array is `rows` (not `data`) and that
//                                source_role / lineage sit at the TOP level (not per row)
//   - endpoint path            → DATASET_ACCESS_POLICIES.backendPath (billing SSOT), passed in
//   - query parameters         → each dataset's documented params (STANDARD/REFERENCE_PARAMS)
//   - gateway `meta` keys      → src/lib/gateway/response.ts mergeMetaField
//   - error status/code/message→ src/lib/gateway/error-codes.ts, confirmed against live 401/404 bodies
//
// NOT documented here, on purpose:
//   - `data_grade` — it exists nowhere in the product, and the captured response confirms it is not a
//     response field. The grade on these pages is the STATIC docs classification (dataset-grade.ts),
//     rendered as a badge and labelled as such.
//   - The SDKs (packages/python-sdk, packages/js-sdk): real code, but unpublished (`private: true`,
//     no PyPI release), so the snippets use `requests` / `fetch` — the same raw-HTTP style the rest of
//     the docs use and the only style a reader can actually run today.

// Relative (not `@/`) so the unit tests can import these modules directly under `node --test`.
import { GATEWAY_DEFAULT_MESSAGES, GATEWAY_ERROR_STATUS, type GatewayErrorCode } from "../gateway/error-codes.ts";
import {
  API_AUTH_HEADER,
  API_CAPTURED_SUCCESS_BODIES,
  API_GATEWAY_BASE_URL,
  API_ROWS_KEY,
} from "../../content/api-truth.ts";

// Base + auth header are no longer guessed: they come from the captured API truth (src/content/
// api-truth.ts), established by calling both hosts. The customer base is the GATEWAY — the one that
// validates the key, enforces the plan and meters credits.
export const API_BASE_URL = API_GATEWAY_BASE_URL;

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
  -H "${API_AUTH_HEADER}: $TWMD_API_KEY"`;
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
    headers={"${API_AUTH_HEADER}": os.environ["TWMD_API_KEY"]},
)
resp.raise_for_status()

for row in resp.json()["${API_ROWS_KEY}"]:
    print(row)`;
}

export function buildJavaScriptSnippet(backendPath: string, params: PanelParam[]): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  return `const res = await fetch(
  "${url}",
  { headers: { "${API_AUTH_HEADER}": process.env.TWMD_API_KEY } },
);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

const { ${API_ROWS_KEY} } = await res.json();
console.log(${API_ROWS_KEY});`;
}

export function buildTypeScriptSnippet(backendPath: string, params: PanelParam[]): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  // Envelope typed from the captured response; `meta` also carries the keys the gateway injects
  // (src/lib/gateway/response.ts).
  return `type DatasetResponse<Row> = {
  dataset: string;
  ${API_ROWS_KEY}: Row[];
  count: number;
  data_as_of: string;
  source_role: string;
  lineage: Record<string, unknown>;
  meta: { requestId: string; planCode?: string; creditsCost?: number; dryRun: boolean };
};

const res = await fetch(
  "${url}",
  { headers: { "${API_AUTH_HEADER}": process.env.TWMD_API_KEY! } },
);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

const { ${API_ROWS_KEY}, source_role }: DatasetResponse<Record<string, unknown>> = await res.json();
console.log(source_role, ${API_ROWS_KEY});`;
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
  // "captured" → this exact body came back from the real API; "illustrative" → the envelope is the
  // captured shape but the rows are the page's own documented example, which has NOT been observed.
  provenance: "captured" | "illustrative";
};

// The 200 body for a dataset. If the API was actually called for this dataset, its captured response is
// returned verbatim. Otherwise the page's own example rows are placed in the CAPTURED envelope shape —
// and flagged illustrative, because API_TRUTH_GAPS says the row shape of one dataset must not be
// assumed to generalize.
export function buildSuccessBody(input: {
  exampleJson: string;
  datasetSlug: string;
  planCode: string;
  creditsCost: number;
}): SuccessBodyResult {
  const captured = API_CAPTURED_SUCCESS_BODIES[input.datasetSlug];
  if (captured) return { body: captured, provenance: "captured" };

  let rows: unknown[] = [];
  try {
    const parsed: unknown = JSON.parse(input.exampleJson);
    if (Array.isArray(parsed)) {
      rows = parsed;
    } else if (parsed && typeof parsed === "object") {
      const record = parsed as Record<string, unknown>;
      // Older page examples wrap rows in `data`; the real API uses `rows`. Accept either.
      const inner = API_ROWS_KEY in record ? record[API_ROWS_KEY] : record.data;
      rows = Array.isArray(inner) ? inner : [record];
    }
  } catch {
    rows = ["<see the Example response section on this page>"];
  }

  const body = {
    dataset: input.datasetSlug.replace(/-/g, "_"),
    [API_ROWS_KEY]: rows,
    count: rows.length,
    meta: {
      requestId: "req_01J8ZC4W2Q",
      planCode: input.planCode,
      creditsCost: input.creditsCost,
      dryRun: false,
    },
  };
  return { body: JSON.stringify(body, null, 2), provenance: "illustrative" };
}
