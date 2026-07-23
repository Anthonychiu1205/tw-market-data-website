import type { Metadata } from "next";

import { getLocale } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { Link } from "@/src/i18n/navigation";
import { DOCS_DATASET_CATALOG } from "@/src/content/docs/dataset-catalog";
import { getRulesHistory, PUBLIC_API, type RuleChange } from "@/src/lib/facts/facts-data";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import type { AppLocale } from "@/src/i18n/locales";

const DOCS_PATH = "/docs/api/structure-reference/trading-rules-reference";
const CATALOG_COUNT = DOCS_DATASET_CATALOG.length;

// Bilingual display names for the rule_domain enum (data is language-neutral; only the label is localized).
const DOMAIN_LABEL: Record<string, { en: string; zh: string }> = {
  price_limit: { en: "Daily price limit", zh: "漲跌幅限制" },
  day_trading: { en: "Day trading", zh: "現股當沖" },
  odd_lot: { en: "Intraday odd-lot", zh: "盤中零股" },
  tick_size: { en: "Tick size", zh: "檔位（tick size）" },
  continuous_trading: { en: "Continuous trading", zh: "逐筆交易" },
};

function domainLabel(domain: string, en: boolean): string {
  const l = DOMAIN_LABEL[domain];
  if (l) return en ? l.en : l.zh;
  return domain.replace(/_/g, " ");
}

// Source values are language-neutral tokens (e.g. after_hours_only, 7%). Show them readable, unchanged.
function formatValue(v: string | null): string {
  if (!v) return "—";
  return v.replace(/_/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  const title = isEn
    ? "Taiwan market rules history — price limits, day trading, tick size"
    : "台股制度沿革 — 漲跌幅、當沖、盤中零股、檔位";
  const description = isEn
    ? "A sourced timeline of Taiwan market-microstructure rule changes (daily price-limit widening, day-trading opening, intraday odd-lot, tick size), auto-generated from the TWMD trading_rules_reference dataset. Every entry carries its effective date, prior/new value, market, and official source."
    : "台股市場微結構制度變更的有出處時間軸(漲跌幅放寬、當沖開放、盤中零股、檔位),由 TWMD trading_rules_reference 資料集自動生成。每筆都帶生效日、變更前後值、市場與官方出處。";
  return {
    title,
    description,
    alternates: buildAlternates(l, "/facts/rules-history"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

function Unavailable({ en }: { en: boolean }) {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        {en ? "Rules history" : "制度沿革"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
        {en
          ? "This timeline is temporarily unavailable — the upstream dataset did not respond. It is generated live from the API and will return once the source is reachable; no data is shown rather than stale or invented values."
          : "此時間軸暫時無法載入——上游資料集未回應。本頁由 API 即時生成,來源恢復後即會顯示;不顯示資料,而非呈現過期或捏造的數值。"}
      </p>
    </Container>
  );
}

export default async function RulesHistoryPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const data = await getRulesHistory();

  // Rule 2: if the live source is unreachable/empty, render an honest unavailable state — never fabricate.
  if (!data) return <Unavailable en={en} />;

  const { rows, asOf, coverageStart, coverageEnd, rowCount, csvUrl, jsonUrl } = data;
  const pageUrl = `https://twmarketdata.com/${en ? "en" : "zh-TW"}/facts/rules-history`;

  const organization = { "@type": "Organization", name: "TW Market Data", url: "https://twmarketdata.com" };
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: en ? "Taiwan market rules history" : "台股制度沿革",
    description: en
      ? "Sourced timeline of Taiwan market-microstructure rule changes, generated from the TWMD trading_rules_reference dataset."
      : "台股市場微結構制度變更的有出處時間軸,由 TWMD trading_rules_reference 資料集生成。",
    url: pageUrl,
    isAccessibleForFree: true,
    spatialCoverage: "Taiwan",
    ...(coverageStart && coverageEnd ? { temporalCoverage: `${coverageStart}/${coverageEnd}` } : {}),
    ...(asOf ? { dateModified: asOf } : {}),
    inLanguage: ["en", "zh-Hant"],
    license: "https://twmarketdata.com/terms",
    creator: organization,
    publisher: organization,
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "TW Market Data",
      url: "https://twmarketdata.com/datasets",
    },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: csvUrl },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: jsonUrl },
    ],
  };

  return (
    <Container className="space-y-10 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />

      <header className="space-y-3 border-b border-slate-200 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {en ? "Market Facts" : "統計資料室"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {en ? "Taiwan market rules history" : "台股制度沿革"}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {en
            ? "How Taiwan's trading rules have changed over time — daily price limits, day trading, intraday odd-lot, tick size, and continuous trading. Generated straight from the dataset, one entry per rule change, each with an official source."
            : "台股交易制度隨時間的變化——漲跌幅、現股當沖、盤中零股、檔位與逐筆交易。直接由資料集生成,每筆制度變更一列,皆附官方出處。"}
        </p>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 pt-1 text-xs text-slate-500">
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-400">{en ? "as_of" : "資料截止"}</dt>
            <dd className="font-mono text-slate-600">{asOf ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-400">{en ? "Coverage" : "涵蓋區間"}</dt>
            <dd className="font-mono text-slate-600">{coverageStart} → {coverageEnd}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-400">{en ? "Rule changes" : "制度變更筆數"}</dt>
            <dd className="font-mono text-slate-600">{rowCount}</dd>
          </div>
        </dl>
      </header>

      {/* Methodology (B-3 §2) */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{en ? "Methodology" : "方法論"}</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {en ? (
            <>
              This page is generated from the <code className="font-mono text-xs">trading_rules_reference</code> dataset —
              one row per (rule domain, rule key, effective date), carrying the prior and new value, the market it
              applies to, and an official source (no entry is admitted without one). Dates are the rule&apos;s effective
              date. See the{" "}
              <Link href={DOCS_PATH} className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
                dataset documentation
              </Link>{" "}
              for field definitions.
            </>
          ) : (
            <>
              本頁由 <code className="font-mono text-xs">trading_rules_reference</code> 資料集生成——每一列對應一組
              (制度領域、規則鍵、生效日),帶變更前後值、適用市場與官方出處(無出處不入表)。日期為規則生效日。欄位定義見{" "}
              <Link href={DOCS_PATH} className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
                資料集文件
              </Link>
              。
            </>
          )}
        </p>
      </section>

      {/* Timeline (B-3 §1 — every row carries its own effective_date/as_of and source) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">{en ? "Timeline" : "時間軸"}</h2>
          <a
            href={csvUrl}
            className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {en ? "Download CSV" : "下載 CSV"}
          </a>
        </div>
        <ol className="space-y-3">
          {rows.map((r: RuleChange, i) => (
            <li key={`${r.rule_domain}-${r.rule_key}-${r.effective_date}-${i}`} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <time dateTime={r.effective_date} className="font-mono text-slate-700">{r.effective_date}</time>
                <span className="rounded border border-slate-200 px-2 py-0.5 font-medium text-slate-600">
                  {domainLabel(r.rule_domain, en)}
                </span>
                {r.market ? <span className="font-mono text-slate-400">{r.market}</span> : null}
              </div>
              <p className="mt-2 text-sm text-slate-800">
                <span className="font-mono text-slate-500">{formatValue(r.prior_value)}</span>
                <span className="px-2 text-slate-400">→</span>
                <span className="font-mono font-semibold text-slate-900">{formatValue(r.new_value)}</span>
              </p>
              {/* The source `description` prose is Chinese-only; show it on the zh page, keep /en CJK-free. */}
              {!en && r.description ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">{r.description}</p>
              ) : null}
              {r.source_authority ? (
                <p className="mt-2 text-xs text-slate-400">
                  {en ? "Source: " : "來源:"}{r.source_authority}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {/* Single CTA (B-3 §6) */}
      <section className="border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-600">
          {en
            ? "This page is auto-generated from the TWMD database. "
            : "本頁數據由 TWMD 資料庫自動生成。"}
          <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
            {en ? `Explore all ${CATALOG_COUNT} datasets` : `探索 ${CATALOG_COUNT} 個資料集`}
          </Link>
        </p>
      </section>
    </Container>
  );
}
