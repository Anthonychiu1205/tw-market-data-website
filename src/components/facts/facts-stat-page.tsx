import type { Metadata } from "next";

import { getLocale } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { Link } from "@/src/i18n/navigation";
import { DOCS_DATASET_CATALOG } from "@/src/content/docs/dataset-catalog";
import { getFactsStat, type FactsStatRow } from "@/src/lib/facts/facts-data";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import type { AppLocale } from "@/src/i18n/locales";

const CATALOG_COUNT = DOCS_DATASET_CATALOG.length;

type Bilingual = { en: string; zh: string };

export type FactsColumn = {
  source: "dimension" | "metrics";
  key: string;
  label: Bilingual;
  align?: "left" | "right";
  /** Presentation only — never invents data; formats the raw value from the API. */
  format?: (value: unknown, en: boolean) => string;
};

export type FactsStatPageConfig = {
  /** Route slug (/facts/<pageSlug>). */
  pageSlug: string;
  /** API endpoint slug (/v2/facts/<endpointSlug>). */
  endpointSlug: string;
  jsonLdName: Bilingual;
  title: Bilingual;
  intro: Bilingual;
  /** Authored EN methodology (the zh side shows meta.methodology verbatim from the backend). */
  methodologyEn: string;
  /** Authored EN coverage note (the zh side shows meta.coverage_note verbatim). */
  coverageEn: string;
  /** Per-dataset docs reference, if any. */
  docsPath?: string;
  columns: FactsColumn[];
};

// ── shared formatters (presentation of real API values, no fabrication) ──
export const fmt = {
  /** fraction → signed percent, e.g. 0.004303 → "+0.43%" */
  pctSigned: (v: unknown) => (typeof v === "number" ? `${v >= 0 ? "+" : ""}${(v * 100).toFixed(2)}%` : "—"),
  /** fraction → percent, e.g. 0.5217 → "52%" */
  pct0: (v: unknown) => (typeof v === "number" ? `${Math.round(v * 100)}%` : "—"),
  /** fraction → percent 1dp, e.g. 0.4515 → "45.2%" */
  pct1: (v: unknown) => (typeof v === "number" ? `${(v * 100).toFixed(1)}%` : "—"),
  int: (v: unknown) => (typeof v === "number" ? v.toLocaleString("en-US") : "—"),
  /** share count → billions, e.g. 68911305828 → "68.9B" */
  billions: (v: unknown) => (typeof v === "number" ? `${(v / 1e9).toFixed(1)}B` : "—"),
};

const MONTHS: Bilingual[] = [
  { en: "Jan", zh: "1 月" }, { en: "Feb", zh: "2 月" }, { en: "Mar", zh: "3 月" },
  { en: "Apr", zh: "4 月" }, { en: "May", zh: "5 月" }, { en: "Jun", zh: "6 月" },
  { en: "Jul", zh: "7 月" }, { en: "Aug", zh: "8 月" }, { en: "Sep", zh: "9 月" },
  { en: "Oct", zh: "10 月" }, { en: "Nov", zh: "11 月" }, { en: "Dec", zh: "12 月" },
];
export const monthLabel = (v: unknown, en: boolean): string => {
  const m = typeof v === "number" ? MONTHS[v - 1] : undefined;
  return m ? (en ? m.en : m.zh) : String(v ?? "—");
};

export async function factsStatMetadata(config: FactsStatPageConfig, locale: string): Promise<Metadata> {
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  const title = isEn ? config.title.en : config.title.zh;
  const description = isEn ? config.intro.en : config.intro.zh;
  return {
    title,
    description,
    alternates: buildAlternates(l, `/facts/${config.pageSlug}`),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

function cellValue(row: FactsStatRow, col: FactsColumn, en: boolean): string {
  const raw = col.source === "dimension" ? row.dimension?.[col.key] : row.metrics?.[col.key];
  return col.format ? col.format(raw, en) : String(raw ?? "—");
}

export async function FactsStatPage({ config }: { config: FactsStatPageConfig }) {
  const locale = await getLocale();
  const en = locale === "en";
  const stat = await getFactsStat(config.endpointSlug);

  // Contract: a 404 / empty stat degrades to an honest "unavailable" page — never an empty table.
  if (!stat) {
    return (
      <Container className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{en ? config.title.en : config.title.zh}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          {en
            ? "This statistic is temporarily unavailable — the upstream source did not respond. It is generated live from the API; no data is shown rather than stale or invented values."
            : "此統計暫時無法載入——上游來源未回應。本頁由 API 即時生成;不顯示資料,而非呈現過期或捏造的數值。"}
        </p>
      </Container>
    );
  }

  const { meta, rows, csvUrl, jsonUrl } = stat;
  const pageUrl = `https://twmarketdata.com/${en ? "en" : "zh-TW"}/facts/${config.pageSlug}`;
  const organization = { "@type": "Organization", name: "TW Market Data", url: "https://twmarketdata.com" };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: en ? config.jsonLdName.en : config.jsonLdName.zh,
    description: en ? config.intro.en : config.intro.zh,
    url: pageUrl,
    isAccessibleForFree: true,
    spatialCoverage: "Taiwan",
    ...(meta.sample_period ? { temporalCoverage: `${meta.sample_period.start}/${meta.sample_period.end}` } : {}),
    ...(meta.as_of ? { dateModified: meta.as_of } : {}),
    inLanguage: ["en", "zh-Hant"],
    // Only claim a license when the backend actually set one (contract) — never assert one otherwise.
    ...(meta.license ? { license: meta.license } : {}),
    creator: organization,
    publisher: organization,
    includedInDataCatalog: { "@type": "DataCatalog", name: "TW Market Data", url: "https://twmarketdata.com/datasets" },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: csvUrl },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: jsonUrl },
    ],
  };

  return (
    <Container className="space-y-10 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />

      <header className="space-y-3 border-b border-slate-200 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{en ? "Market Facts" : "統計資料室"}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{en ? config.title.en : config.title.zh}</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{en ? config.intro.en : config.intro.zh}</p>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 pt-1 text-xs text-slate-500">
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-400">{en ? "as_of" : "資料截止"}</dt>
            <dd className="font-mono text-slate-600">{meta.as_of ?? "—"}</dd>
          </div>
          {meta.sample_period ? (
            <div className="flex gap-2">
              <dt className="font-semibold text-slate-400">{en ? "Sample period" : "樣本區間"}</dt>
              <dd className="font-mono text-slate-600">{meta.sample_period.start} → {meta.sample_period.end}</dd>
            </div>
          ) : null}
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-400">{en ? "Rows" : "列數"}</dt>
            <dd className="font-mono text-slate-600">{meta.row_count}</dd>
          </div>
        </dl>
      </header>

      {/* Methodology + coverage (B-3 §2): EN authored; ZH shows the backend's meta verbatim. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{en ? "Methodology" : "方法論"}</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{en ? config.methodologyEn : meta.methodology ?? config.methodologyEn}</p>
        <p className="max-w-3xl text-sm leading-7 text-slate-500">{en ? config.coverageEn : meta.coverage_note ?? config.coverageEn}</p>
        {config.docsPath ? (
          <p className="text-sm">
            <Link href={config.docsPath} className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
              {en ? "Dataset documentation" : "資料集文件"}
            </Link>
          </p>
        ) : null}
      </section>

      {/* Table (B-3 §1: every figure shares the page as_of stated above; values are passthrough). */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">{en ? "Data" : "數據"}</h2>
          <a href={csvUrl} className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100">
            {en ? "Download CSV" : "下載 CSV"}
          </a>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500">
                {config.columns.map((col) => (
                  <th key={`${col.source}-${col.key}`} className={`px-4 py-2.5 ${col.align === "right" ? "text-right" : ""}`}>
                    {en ? col.label.en : col.label.zh}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-b-0">
                  {config.columns.map((col) => (
                    <td key={`${col.source}-${col.key}`} className={`px-4 py-2.5 tabular-nums text-slate-700 ${col.align === "right" ? "text-right" : ""}`}>
                      {cellValue(row, col, en)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Single CTA (B-3 §6). */}
      <section className="border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-600">
          {en ? "This page is auto-generated from the TWMD database. " : "本頁數據由 TWMD 資料庫自動生成。"}
          <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
            {en ? `Explore all ${CATALOG_COUNT} datasets` : `探索 ${CATALOG_COUNT} 個資料集`}
          </Link>
        </p>
      </section>
    </Container>
  );
}
