import { DocsPageShell } from "@/src/components/docs/docs-page-shell";
import { CodeBlock } from "@/src/components/docs/code-block";
import { DatasetApiPanel } from "@/src/components/docs/dataset-api-panel";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { DOCS_DATASET_CATALOG, DOCS_DOMAINS } from "@/src/content/docs/dataset-catalog";
import { getDatasetDocContent, type Bi, type DatasetDocContent } from "@/src/content/docs/dataset-pages";
import { DATASET_GRADE_COLORS, datasetGradeLabel } from "@/src/lib/docs/dataset-grade";
import { API_AUTH_HEADER, API_BASE_URL as CAPTURED_BASE_URL, API_KEY_PREFIX, API_TRUTH_CAPTURED_AT } from "@/src/content/api-truth";
import { apiCaptureBody, getApiCapture } from "@/src/content/api-captures";
import { VERIFIED_DATASET_PARAMS } from "@/src/content/docs/verified-request-examples";

// Bilingual renderer for a v5 dataset endpoint page. Genuinely en + zh (no "coming soon" banner) so
// /en is fully usable and the CJK guards can scan it. All facts come from the catalog (grade / agency /
// plan / price) and the dataset-pages content (real coverage numbers or explicit TODO markers).

// Base and auth header come from the captured API truth — the in-body examples must not contradict
// the Request/Response panel beside them. The row-array key is per dataset (see api-captures.ts).
const API_BASE = CAPTURED_BASE_URL;

type Locale = string;

function bi(value: Bi, locale: Locale): string {
  return locale === "en" ? value.en : value.zh;
}

// rowsKey may be a dotted path ("data" or "envelope.data") — render it as chained subscripts so the
// example runs against the real (sometimes nested) envelope.
function pyRows(rowsKey: string): string {
  return `resp.json()${rowsKey.split(".").map((seg) => `["${seg}"]`).join("")}`;
}

// Per-dataset verified params drive BOTH the request examples and the param table from ONE source, so
// they can never disagree. index_code / rate_code / ticker etc. appear instead of a made-up symbol
// because these are the real params (openapi authority + verified fixture); dates use start_date/end_date
// (the fixture's date_from is ignored by the backend). Fallback: generic symbol=2330.
function exampleParamsFor(slug: string): Record<string, string> {
  const ps = VERIFIED_DATASET_PARAMS[slug];
  if (!ps || ps.length === 0) return { symbol: "2330" };
  return Object.fromEntries(ps.map((p) => [p.name, p.example]));
}
// The minimal (non-date) params — the smallest call that returns rows.
function coreParamsFor(slug: string): Record<string, string> {
  const entries = Object.entries(exampleParamsFor(slug)).filter(([k]) => k !== "start_date" && k !== "end_date");
  return entries.length > 0 ? Object.fromEntries(entries) : { symbol: "2330" };
}
function toQuery(params: Record<string, string>): string {
  const q = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return q ? `?${q}` : "";
}
function toPyParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `"${k}": "${v}"`)
    .join(", ");
}

function pythonBasic(backendPath: string, slug: string, rowsKey: string | null): string {
  return `import requests

resp = requests.get(
    "${API_BASE}${backendPath}",
    params={${toPyParams(coreParamsFor(slug))}},
    headers={"${API_AUTH_HEADER}": "${API_KEY_PREFIX}..."},
)
resp.raise_for_status()
${rowsKey ? `print(${pyRows(rowsKey)})` : "print(resp.json())"}`;
}

function pythonFiltered(backendPath: string, slug: string, rowsKey: string | null): string {
  return `import requests

# The full verified example — the same call with every supported filter set.
resp = requests.get(
    "${API_BASE}${backendPath}",
    params={${toPyParams(exampleParamsFor(slug))}},
    headers={"${API_AUTH_HEADER}": "${API_KEY_PREFIX}..."},
)
resp.raise_for_status()
${rowsKey ? `for row in ${pyRows(rowsKey)}:\n    print(row)` : "print(resp.json())"}`;
}

function curlExample(backendPath: string, slug: string): string {
  return `curl "${API_BASE}${backendPath}${toQuery(exampleParamsFor(slug))}" \\
  -H "${API_AUTH_HEADER}: ${API_KEY_PREFIX}..."`;
}

const SECTIONS = [
  { id: "overview", en: "Overview", zh: "總覽" },
  { id: "coverage", en: "Coverage", zh: "涵蓋範圍" },
  { id: "example", en: "Example response", zh: "範例回應" },
  { id: "getting-started", en: "Getting started", zh: "快速開始" },
  { id: "filtering", en: "Filtering", zh: "篩選參數" },
  { id: "python", en: "Python", zh: "Python 範例" },
  { id: "openapi", en: "OpenAPI", zh: "OpenAPI" },
];

export function isDatasetDocSlug(slugParts: string[]): boolean {
  // /docs/api/<domain>/<dataset>  → catch-all captures ["api", <domain>, <dataset>].
  // BOTH the domain and the dataset must match a catalog entry, so this never hijacks a legacy
  // /docs/api/<old-group>/<dataset> path that happens to end in a catalog slug.
  if (slugParts.length !== 3 || slugParts[0] !== "api") return false;
  const [, domain, dataset] = slugParts;
  return DOCS_DATASET_CATALOG.some((d) => d.slug === dataset && d.domain === domain);
}

export function DatasetDocPage({ slugParts, locale }: { slugParts: string[]; locale: Locale }) {
  const datasetSlug = slugParts[2];
  const entry = DOCS_DATASET_CATALOG.find((d) => d.slug === datasetSlug);
  if (!entry) return null;

  const domain = DOCS_DOMAINS.find((d) => d.id === entry.domain);
  const content: DatasetDocContent | null = getDatasetDocContent(datasetSlug);
  const en = locale === "en";
  const gradeColor = DATASET_GRADE_COLORS[entry.grade];
  const href = `/docs/api/${entry.domain}/${entry.slug}`;

  const title = en ? entry.en : entry.zh;
  const subtitle = content ? bi(content.description, locale) : entry.slug;
  const pageLabel = domain ? (en ? domain.en : domain.zh) : "Dataset API";
  const tocSections = SECTIONS.map((s) => ({ id: s.id, label: en ? s.en : s.zh }));
  // Per-dataset row-array key from its own capture; null when this dataset has not been captured.
  const capture = getApiCapture(entry.slug);
  const rowsKey = capture?.rowsKey ?? null;

  // The sticky Request/Response panel makes this a data-API page: the shell switches to the wide
  // right column and drops the TOC (article pages keep the TOC and stay single-column).
  // Param table is driven by the SAME verified spec as the request examples (openapi authority + fixture
  // filter names), so the table can never say start_date while the example uses a different param. Only
  // the name/required/type/desc are shown in the table (the `example` field feeds the code samples).
  const verifiedParams = VERIFIED_DATASET_PARAMS[entry.slug];
  const tableParams =
    verifiedParams && verifiedParams.length > 0
      ? verifiedParams.map(({ example: _example, ...p }) => p)
      : content?.params ?? [];
  const apiPanel = content ? (
    <DatasetApiPanel
      locale={locale}
      datasetSlug={entry.slug}
      backendPath={entry.backendPath}
      params={tableParams}
    />
  ) : undefined;

  return (
    <DocsPageShell
      page={{ title, subtitle, href, sections: tocSections }}
      tocSections={tocSections}
      pageLabel={pageLabel}
      rightPanelTitle={en ? "Request & Response" : "請求與回應"}
      rightPanelContent={apiPanel}
    >
      {/* Grade badge + real facts line (agency / plan / price). The 對帳 verification section is
          intentionally deferred until the backend produces real verified dates. */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span
          className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
          style={{ borderColor: gradeColor, color: gradeColor }}
        >
          {datasetGradeLabel(entry.grade, locale)}
        </span>
        <span className="text-slate-500">
          {en ? "Source" : "來源"}: <span className="font-medium text-slate-700">{entry.agency}</span>
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500">
          {en ? "Plan" : "方案"}: <span className="font-medium text-slate-700">{entry.requiredPlan}</span>
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500">
          {en ? "Cost" : "計費"}: <span className="font-medium text-slate-700">{entry.creditsCost} {en ? "credits" : "點"}</span>
        </span>
        <span className="text-slate-300">·</span>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">GET {entry.backendPath}</code>
      </div>

      {!content ? (
        <p className="mt-8 text-slate-600">
          {en ? "Documentation for this dataset is being written." : "此資料集的文件正在撰寫中。"}
        </p>
      ) : (
        <>
          {/* Overview */}
          <section className="mt-10">
            <SectionHeading id="overview">{en ? "Overview" : "總覽"}</SectionHeading>
            {content.overview.map((p, i) => (
              <p key={i} className="mt-3">{bi(p, locale)}</p>
            ))}
            {content.fields.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-2 pr-4 font-medium">{en ? "Field" : "欄位"}</th>
                      <th className="py-2 pr-4 font-medium">{en ? "Type" : "型別"}</th>
                      <th className="py-2 font-medium">{en ? "Description" : "說明"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.fields.map((f) => (
                      <tr key={f.name} className="border-b border-slate-100 align-top">
                        <td className="py-2 pr-4"><code className="text-slate-800">{f.name}</code></td>
                        <td className="py-2 pr-4 text-slate-500">{f.type}</td>
                        <td className="py-2 text-slate-600">{bi(f.desc, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>

          {/* Coverage */}
          <section className="mt-10">
            <SectionHeading id="coverage">{en ? "Coverage" : "涵蓋範圍"}</SectionHeading>
            {content.coverage ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {content.coverage.rows ? (
                      <tr className="border-b border-slate-100">
                        <td className="py-2 pr-4 text-slate-500">{en ? "Rows" : "列數"}</td>
                        <td className="py-2 font-medium tabular-nums text-slate-800">{content.coverage.rows}</td>
                      </tr>
                    ) : null}
                    {content.coverage.symbols ? (
                      <tr className="border-b border-slate-100">
                        <td className="py-2 pr-4 text-slate-500">{en ? "Symbols" : "標的數"}</td>
                        <td className="py-2 font-medium tabular-nums text-slate-800">{content.coverage.symbols}</td>
                      </tr>
                    ) : null}
                    <tr className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-500">{en ? "Window" : "涵蓋起訖"}</td>
                      <td className="py-2 text-slate-800">{bi(content.coverage.window, locale)}</td>
                    </tr>
                    {content.coverage.frequency ? (
                      <tr className="border-b border-slate-100">
                        <td className="py-2 pr-4 text-slate-500">{en ? "Frequency" : "更新頻率"}</td>
                        <td className="py-2 text-slate-800">{bi(content.coverage.frequency, locale)}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="py-2 pr-4 text-slate-500">{en ? "Grade" : "分級"}</td>
                      <td className="py-2 font-medium" style={{ color: gradeColor }}>{datasetGradeLabel(entry.grade, locale)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {content.coverageTodo ? bi(content.coverageTodo, locale) : "TODO"}
              </p>
            )}
          </section>

          {/* Example response */}
          <section className="mt-10">
            <SectionHeading id="example">{en ? "Example response" : "範例回應"}</SectionHeading>
            {capture ? (
              <>
                <p className="mt-3 text-sm text-slate-500">
                  {en
                    ? `A real response from this endpoint. Rows are returned under "${capture.rowsKey ?? "-"}", and provenance is carried in the shape shown below — it is not identical across datasets, so read this page's rather than assuming another's.`
                    : `此為本端點的真實回應。資料列位於 "${capture.rowsKey ?? "-"}" 之下，來源資訊如下方所示；各資料集形狀不盡相同，請以本頁為準。`}
                </p>
                <div className="mt-3">
                  <CodeBlock code={apiCaptureBody(capture, locale)} language="json" />
                </div>
                <p className="mt-2 text-xs text-emerald-700">
                  {en
                    ? `Captured from the live API on ${API_TRUTH_CAPTURED_AT}.`
                    : `擷取自 ${API_TRUTH_CAPTURED_AT} 的線上 API。`}
                </p>
                {capture.en ? (
                  <p className="mt-1 text-xs text-slate-400">
                    {en
                      ? "Chinese data values are shown as a marker here so this page stays in English; the /zh page shows them verbatim."
                      : "本頁顯示原始中文值；英文頁會以標記取代，以維持全英文。"}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {en
                  ? "TODO — no real response has been captured for this dataset yet. It needs an entitled API key, or its required parameters are not yet known. Rather than show an example nobody has observed, this section stays empty."
                  : "TODO —— 尚未擷取到此資料集的真實回應（需要有權限的 API 金鑰，或其必填參數尚未確認）。寧可留白，也不顯示未經實測的範例。"}
              </p>
            )}
          </section>

          {/* Getting started */}
          <section className="mt-10">
            <SectionHeading id="getting-started">{en ? "Getting started" : "快速開始"}</SectionHeading>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
              <li>{en ? `Put your key in the ${API_AUTH_HEADER} header.` : `把你的金鑰放進 ${API_AUTH_HEADER} 標頭。`}</li>
              <li>{en ? "Add query parameters (symbol, date range, limit)." : "加上查詢參數（symbol、日期區間、limit）。"}</li>
              <li>{rowsKey ? (en ? `Send the request and read the ${rowsKey} array.` : `送出請求並讀取 ${rowsKey} 陣列。`) : (en ? "Send the request and read the returned payload." : "送出請求並讀取回傳內容。")}</li>
            </ol>
            <div className="mt-4">
              <CodeBlock code={curlExample(entry.backendPath, entry.slug)} language="bash" />
            </div>
          </section>

          {/* Filtering */}
          <section className="mt-10">
            <SectionHeading id="filtering">{en ? "Filtering" : "篩選參數"}</SectionHeading>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4 font-medium">{en ? "Parameter" : "參數"}</th>
                    <th className="py-2 pr-4 font-medium">{en ? "Required" : "必填"}</th>
                    <th className="py-2 pr-4 font-medium">{en ? "Type" : "型別"}</th>
                    <th className="py-2 font-medium">{en ? "Description" : "說明"}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.params.map((p) => (
                    <tr key={p.name} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-4"><code className="text-slate-800">{p.name}</code></td>
                      <td className="py-2 pr-4 text-slate-500">{p.required ? (en ? "Yes" : "是") : (en ? "No" : "否")}</td>
                      <td className="py-2 pr-4 text-slate-500">{p.type}</td>
                      <td className="py-2 text-slate-600">{bi(p.desc, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Python */}
          <section className="mt-10">
            <SectionHeading id="python">{en ? "Python" : "Python 範例"}</SectionHeading>
            <p className="mt-3 text-sm text-slate-500">{en ? "A first call:" : "第一個呼叫："}</p>
            <div className="mt-2"><CodeBlock code={pythonBasic(entry.backendPath, entry.slug, rowsKey)} language="python" /></div>
            <p className="mt-4 text-sm text-slate-500">{en ? "With a date-range filter:" : "帶日期區間篩選："}</p>
            <div className="mt-2"><CodeBlock code={pythonFiltered(entry.backendPath, entry.slug, rowsKey)} language="python" /></div>
          </section>

          {/* OpenAPI */}
          <section className="mt-10">
            <SectionHeading id="openapi">OpenAPI</SectionHeading>
            <p className="mt-3 text-sm text-slate-600">
              {en ? (
                <>This endpoint is <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET {entry.backendPath}</code>. The full machine-readable schema (parameters, security, response envelope) lives in the <a href="/openapi.json" className="underline underline-offset-2">OpenAPI spec</a>.</>
              ) : (
                <>此端點為 <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET {entry.backendPath}</code>。完整機器可讀 schema（參數、認證、回應封裝）見 <a href="/openapi.json" className="underline underline-offset-2">OpenAPI spec</a>。</>
              )}
            </p>
          </section>

          {/* Notes / honest limitations */}
          {content.notes && content.notes.length > 0 ? (
            <section className="mt-10">
              <SectionHeading id="notes">{en ? "Notes & limitations" : "備註與限制"}</SectionHeading>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                {content.notes.map((n, i) => (
                  <li key={i}>{bi(n, locale)}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </DocsPageShell>
  );
}
