// Builders for the dataset API pages' right-hand Request / Response panel. Pure and dependency-light
// so every snippet and body is unit-tested rather than eyeballed.
//
// TRUTH SOURCES (rule 2 — nothing here is invented):
//   - base URL + auth header   → src/content/api-truth.ts (captured by calling the API)
//   - success bodies           → src/content/api-captures.ts, PER DATASET. There is no shared
//                                envelope: the row array is `data`, `rows` or `items` depending on the
//                                dataset. Nothing here normalizes that — a dataset with no capture
//                                gets an honest TODO instead of a templated body.
//   - endpoint path            → DATASET_ACCESS_POLICIES.backendPath (billing SSOT), passed in
//   - query parameters         → each dataset's documented params (STANDARD/REFERENCE_PARAMS)
//   - error bodies             → READ_API_ERRORS in api-truth.ts, captured from the read API. NOT the
//                                gateway contract in gateway/error-codes.ts — that path uses a
//                                different key namespace and a different error envelope.
//
// NOT documented here, on purpose:
//   - `data_grade` — it exists nowhere in the product, and the captured response confirms it is not a
//     response field. The grade on these pages is the STATIC docs classification (dataset-grade.ts),
//     rendered as a badge and labelled as such.
//   - The SDKs (packages/python-sdk, packages/js-sdk): real code, but unpublished (`private: true`,
//     no PyPI release), so the snippets use `requests` / `fetch` — the same raw-HTTP style the rest of
//     the docs use and the only style a reader can actually run today.

// Relative (not `@/`) so the unit tests can import these modules directly under `node --test`.
import {
  API_AUTH_HEADER,
  API_BASE_URL as CAPTURED_BASE_URL,
  API_KEY_PREFIX,
  READ_API_ERRORS,
  readApiErrorBody,
  type ReadApiError,
} from "../../content/api-truth.ts";
import { apiCaptureBody, getApiCapture } from "../../content/api-captures.ts";

// The customer base: sk_live_ keys authenticate against the read API.
export const API_BASE_URL = CAPTURED_BASE_URL;

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

// Every snippet takes the dataset's OWN rowsKey (from its capture). `null` means we have not captured
// that dataset, so the snippet prints the whole payload rather than asserting a key that may not exist.
export type SnippetInput = {
  backendPath: string;
  params: PanelParam[];
  rowsKey: string | null;
};

export function buildCurlSnippet({ backendPath, params }: SnippetInput): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  return `curl "${url}" \\
  -H "${API_AUTH_HEADER}: $TWMD_API_KEY"`;
}

export function buildPythonSnippet({ backendPath, params, rowsKey }: SnippetInput): string {
  const args = exampleArgs(params)
    .map((a) => `        "${a.name}": ${a.quoted ? `"${a.value}"` : a.value},`)
    .join("\n");
  const paramsBlock = args ? `\n    params={\n${args}\n    },` : "";
  const consume = rowsKey
    ? `for row in payload["${rowsKey}"]:\n    print(row)`
    : `print(payload)`;
  return `import os
import requests

resp = requests.get(
    "${API_BASE_URL}${backendPath}",${paramsBlock}
    headers={"${API_AUTH_HEADER}": os.environ["TWMD_API_KEY"]},
)
resp.raise_for_status()
payload = resp.json()

${consume}`;
}

export function buildJavaScriptSnippet({ backendPath, params, rowsKey }: SnippetInput): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  const consume = rowsKey
    ? `const { ${rowsKey} } = payload;\nconsole.log(${rowsKey});`
    : `console.log(payload);`;
  return `const res = await fetch(
  "${url}",
  { headers: { "${API_AUTH_HEADER}": process.env.TWMD_API_KEY } },
);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const payload = await res.json();

${consume}`;
}

export function buildTypeScriptSnippet({ backendPath, params, rowsKey }: SnippetInput): string {
  const query = queryString(params);
  const url = query ? `${API_BASE_URL}${backendPath}?${query}` : `${API_BASE_URL}${backendPath}`;
  // The envelope differs per dataset, so the type is written from THIS dataset's captured shape.
  // Without a capture we type it as an opaque record instead of guessing a row key.
  const type = rowsKey
    ? `type Response = { ${rowsKey}: Record<string, unknown>[] };`
    : `type Response = Record<string, unknown>;`;
  const consume = rowsKey
    ? `const { ${rowsKey} }: Response = await res.json();\nconsole.log(${rowsKey});`
    : `const payload: Response = await res.json();\nconsole.log(payload);`;
  return `${type}

const res = await fetch(
  "${url}",
  { headers: { "${API_AUTH_HEADER}": process.env.TWMD_API_KEY! } },
);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

${consume}`;
}

export function buildRequestSnippet(language: RequestLanguage, input: SnippetInput): string {
  switch (language) {
    case "curl":
      return buildCurlSnippet(input);
    case "python":
      return buildPythonSnippet(input);
    case "javascript":
      return buildJavaScriptSnippet(input);
    case "typescript":
      return buildTypeScriptSnippet(input);
  }
}

// ── Response bodies ──

// The statuses documented, straight from the read API's captured errors. There is no 400 and no 403:
// the read API has never been observed emitting either (403/entitlement needs a real entitled key —
// see API_TRUTH_GAPS).
export const PANEL_ERRORS: ReadApiError[] = READ_API_ERRORS;

export function panelStatuses(): string[] {
  const seen: string[] = ["200"];
  for (const e of READ_API_ERRORS) {
    const s = String(e.status);
    if (!seen.includes(s)) seen.push(s);
  }
  return seen;
}

export function buildErrorBody(error: ReadApiError, locale: string): string {
  return readApiErrorBody(error, locale);
}

export type SuccessBody =
  | { kind: "captured"; body: string; rowsKey: string | null }
  | { kind: "uncaptured" };

// The 200 body for a dataset: its OWN captured response, or nothing. There is deliberately no
// synthesized fallback — a dataset we have not called gets an honest TODO on the page instead of a
// body that looks observed but is not (rule 2).
export function buildSuccessBody(datasetSlug: string, locale: string): SuccessBody {
  const capture = getApiCapture(datasetSlug);
  if (!capture) return { kind: "uncaptured" };
  return { kind: "captured", body: apiCaptureBody(capture, locale), rowsKey: capture.rowsKey };
}

export function datasetRowsKey(datasetSlug: string): string | null {
  return getApiCapture(datasetSlug)?.rowsKey ?? null;
}

export { API_KEY_PREFIX };
