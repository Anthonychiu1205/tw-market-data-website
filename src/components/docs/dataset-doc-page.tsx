import { DocsPageShell } from "@/src/components/docs/docs-page-shell";
import { CodeBlock } from "@/src/components/docs/code-block";
import { DatasetApiPanel } from "@/src/components/docs/dataset-api-panel";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { DOCS_DATASET_CATALOG, DOCS_DOMAINS } from "@/src/content/docs/dataset-catalog";
import { getDatasetDocContent, type Bi, type DatasetDocContent } from "@/src/content/docs/dataset-pages";
import { DATASET_GRADE_COLORS, datasetGradeLabel } from "@/src/lib/docs/dataset-grade";

// Bilingual renderer for a v5 dataset endpoint page. Genuinely en + zh (no "coming soon" banner) so
// /en is fully usable and the CJK guards can scan it. All facts come from the catalog (grade / agency /
// plan / price) and the dataset-pages content (real coverage numbers or explicit TODO markers).

const API_BASE = "https://api.twmarketdata.com";

type Locale = string;

function bi(value: Bi, locale: Locale): string {
  return locale === "en" ? value.en : value.zh;
}

function pythonBasic(backendPath: string): string {
  return `import requests

resp = requests.get(
    "${API_BASE}${backendPath}",
    params={"symbol": "2330", "limit": 5},
    headers={"X-API-Key": "sk_live_..."},
)
resp.raise_for_status()
print(resp.json()["data"])`;
}

function pythonFiltered(backendPath: string): string {
  return `import requests

# Same call, narrowed to a date range.
resp = requests.get(
    "${API_BASE}${backendPath}",
    params={"symbol": "2330", "start_date": "2026-01-01", "end_date": "2026-06-30"},
    headers={"X-API-Key": "sk_live_..."},
)
resp.raise_for_status()
for row in resp.json()["data"]:
    print(row)`;
}

function curlExample(backendPath: string): string {
  return `curl "${API_BASE}${backendPath}?symbol=2330&limit=5" \\
  -H "X-API-Key: sk_live_..."`;
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

  // The sticky Request/Response panel makes this a data-API page: the shell switches to the wide
  // right column and drops the TOC (article pages keep the TOC and stay single-column).
  const apiPanel = content ? (
    <DatasetApiPanel
      locale={locale}
      datasetSlug={entry.slug}
      backendPath={entry.backendPath}
      params={content.params}
      exampleJson={typeof content.exampleJson === "string" ? content.exampleJson : bi(content.exampleJson, locale)}
      planCode={entry.requiredPlan}
      creditsCost={entry.creditsCost}
      hasRealCoverage={content.coverage !== null}
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
                    <tr className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-500">{en ? "Frequency" : "更新頻率"}</td>
                      <td className="py-2 text-slate-800">{bi(content.coverage.frequency, locale)}</td>
                    </tr>
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
            <p className="mt-3 text-sm text-slate-500">
              {en
                ? "Each row carries its source fields (source_role / lineage) so a value is verifiable, not opaque."
                : "每一列都帶來源欄位（source_role／lineage），數值可驗證而非黑箱。"}
            </p>
            <div className="mt-3">
              <CodeBlock code={typeof content.exampleJson === "string" ? content.exampleJson : bi(content.exampleJson, locale)} language="json" />
            </div>
          </section>

          {/* Getting started */}
          <section className="mt-10">
            <SectionHeading id="getting-started">{en ? "Getting started" : "快速開始"}</SectionHeading>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
              <li>{en ? "Put your key in the X-API-Key header." : "把你的金鑰放進 X-API-Key 標頭。"}</li>
              <li>{en ? "Add query parameters (symbol, date range, limit)." : "加上查詢參數（symbol、日期區間、limit）。"}</li>
              <li>{en ? "Send the request and read the data array." : "送出請求並讀取 data 陣列。"}</li>
            </ol>
            <div className="mt-4">
              <CodeBlock code={curlExample(entry.backendPath)} language="bash" />
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
            <div className="mt-2"><CodeBlock code={pythonBasic(entry.backendPath)} language="python" /></div>
            <p className="mt-4 text-sm text-slate-500">{en ? "With a date-range filter:" : "帶日期區間篩選："}</p>
            <div className="mt-2"><CodeBlock code={pythonFiltered(entry.backendPath)} language="python" /></div>
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
