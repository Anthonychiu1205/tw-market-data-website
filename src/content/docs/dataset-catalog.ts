// DOCS-01 dataset catalog — the single backbone the v5 docs sidebar and the endpoint pages both read.
//
// SSOT discipline (rule 1): the slug / plan / price / backend path are NOT copied here — they are
// imported from the billing SSOT `DATASET_ACCESS_POLICIES` (64 sellable public slugs). This module
// only LAYERS what the docs need on top: which of the 8 user-facing domains a dataset belongs to, its
// bilingual display name, its source agency, and its grade.
//
// STATIC by design (owner ruling): docs pages are static documents, not a live dashboard. The `grade`
// is a set-once STATIC field on each entry — NOT computed at runtime from an availability API or DB.
// To change a dataset's grade you edit this file. dataset-grade.ts keeps only the four-grade label +
// colour map; there is no runtime grade derivation.

import { DATASET_ACCESS_POLICIES, type GatewayPlanCode } from "@/src/lib/gateway/dataset-policies";
import type { DatasetGrade } from "@/src/lib/docs/dataset-grade";

export type DocsDomainId =
  | "market-prices"
  | "financials"
  | "capital-flows"
  | "companies-events"
  | "structure-reference"
  | "macro"
  | "derivatives"
  | "funds-intel";

export type DocsDomain = { id: DocsDomainId; zh: string; en: string };

// The 8 collapsible sidebar groups, in display order.
export const DOCS_DOMAINS: DocsDomain[] = [
  { id: "market-prices", zh: "市場與價格", en: "Market & Prices" },
  { id: "financials", zh: "財務與成長", en: "Financials & Growth" },
  { id: "capital-flows", zh: "籌碼與資金", en: "Capital Flows" },
  { id: "companies-events", zh: "公司與事件", en: "Companies & Events" },
  { id: "structure-reference", zh: "市場結構與參考", en: "Market Structure & Reference" },
  { id: "macro", zh: "總體經濟", en: "Macroeconomics" },
  { id: "derivatives", zh: "衍生與可轉債", en: "Derivatives & Convertibles" },
  { id: "funds-intel", zh: "基金與企業情報", en: "Funds & Corporate Intelligence" },
];

type DatasetMeta = {
  domain: DocsDomainId;
  zh: string;
  en: string;
  agency: string; // real source agency — TWSE / TPEx / MOPS / TAIFEX / CBC / MOEA / Issuer / etc.
  grade: DatasetGrade; // STATIC, set-once. Edit here to change the badge.
};

// Per-slug docs metadata. Grade meanings: verified = official + full coverage; derived = computed from
// official data; reference = lookup / master (no verifiable time series); building = roadmap (none of
// the 64 sellable slugs are building — that badge is for roadmap items like Webhooks in the sidebar).
const DATASET_META: Record<string, DatasetMeta> = {
  // ── Market & Prices ──
  "twse-daily-price": { domain: "market-prices", zh: "TWSE 日線價格", en: "TWSE daily prices", agency: "TWSE", grade: "verified" },
  "tpex-daily-price": { domain: "market-prices", zh: "TPEx 日線價格", en: "TPEx daily prices", agency: "TPEx", grade: "verified" },
  "market-prices": { domain: "market-prices", zh: "整合日線價格", en: "Unified daily prices", agency: "TWSE / TPEx", grade: "verified" },
  "price-enhanced": { domain: "market-prices", zh: "增強價格欄位", en: "Enhanced price fields", agency: "TWSE / TPEx", grade: "derived" },
  "adjusted-prices": { domain: "market-prices", zh: "還原價格", en: "Adjusted prices", agency: "TWSE / TPEx", grade: "derived" },
  "market-index": { domain: "market-prices", zh: "市場指數", en: "Market indices", agency: "TWSE", grade: "verified" },
  "index-data": { domain: "market-prices", zh: "指數資料", en: "Index data", agency: "TWSE", grade: "verified" },
  "index-classification": { domain: "market-prices", zh: "指數分類", en: "Index classification", agency: "TWSE", grade: "reference" },
  "index-constituents": { domain: "market-prices", zh: "指數成分股", en: "Index constituents", agency: "TWSE", grade: "derived" },
  "return-index-daily": { domain: "market-prices", zh: "報酬指數日線", en: "Return index (daily)", agency: "TWSE", grade: "derived" },
  "market-snapshot": { domain: "market-prices", zh: "市場快照", en: "Market snapshot", agency: "TWSE", grade: "verified" },
  "market-overview-snapshots": { domain: "market-prices", zh: "市場概況快照", en: "Market overview snapshots", agency: "TWSE", grade: "reference" },
  "market-breadth": { domain: "market-prices", zh: "市場廣度", en: "Market breadth", agency: "TWSE", grade: "derived" },
  "technical-indicators": { domain: "market-prices", zh: "技術指標", en: "Technical indicators", agency: "TWSE / TPEx", grade: "derived" },
  "stock-price-limit-daily": { domain: "market-prices", zh: "漲跌停價日線", en: "Price-limit (daily)", agency: "TWSE", grade: "verified" },
  "valuation-core-daily": { domain: "market-prices", zh: "核心估值日線", en: "Core valuation (daily)", agency: "TWSE / TPEx", grade: "derived" },
  "valuation-data": { domain: "market-prices", zh: "估值資料", en: "Valuation data", agency: "TWSE / TPEx / MOPS", grade: "derived" },

  // ── Financials & Growth ──
  "monthly-revenue": { domain: "financials", zh: "月營收", en: "Monthly revenue", agency: "MOPS", grade: "verified" },
  "monthly-revenue-enhanced": { domain: "financials", zh: "增強月營收", en: "Enhanced monthly revenue", agency: "MOPS", grade: "derived" },
  "income-statement": { domain: "financials", zh: "損益表", en: "Income statement", agency: "MOPS", grade: "verified" },
  "balance-sheet": { domain: "financials", zh: "資產負債表", en: "Balance sheet", agency: "MOPS", grade: "verified" },
  "cash-flow-statement": { domain: "financials", zh: "現金流量表", en: "Cash-flow statement", agency: "MOPS", grade: "verified" },
  "financials": { domain: "financials", zh: "財報三表合併", en: "Financial statements (combined)", agency: "MOPS", grade: "verified" },
  "financial-metrics": { domain: "financials", zh: "財務比率指標", en: "Financial metrics", agency: "MOPS", grade: "derived" },
  "dividends": { domain: "financials", zh: "股利政策", en: "Dividend policy", agency: "MOPS", grade: "verified" },

  // ── Capital Flows ──
  "institutional-flow": { domain: "capital-flows", zh: "三大法人買賣", en: "Institutional flow", agency: "TWSE", grade: "verified" },
  "institutional-flow-market-aggregate": { domain: "capital-flows", zh: "法人市場匯總", en: "Institutional flow (market aggregate)", agency: "TWSE", grade: "derived" },
  "institutional-ownership": { domain: "capital-flows", zh: "法人持股", en: "Institutional ownership", agency: "TWSE", grade: "verified" },
  "margin-short": { domain: "capital-flows", zh: "融資融券", en: "Margin & short", agency: "TWSE", grade: "reference" },
  "margin-short-enhanced": { domain: "capital-flows", zh: "增強融資融券", en: "Enhanced margin & short", agency: "TWSE", grade: "derived" },
  "total-margin-short": { domain: "capital-flows", zh: "整體融資融券匯總", en: "Total margin & short", agency: "TWSE", grade: "reference" },
  "securities-lending": { domain: "capital-flows", zh: "借券資料", en: "Securities lending", agency: "TWSE", grade: "verified" },
  "chip-flows": { domain: "capital-flows", zh: "籌碼流向", en: "Chip flows", agency: "TWSE", grade: "derived" },
  "ownership-distribution": { domain: "capital-flows", zh: "股權分散", en: "Ownership distribution", agency: "TDCC", grade: "verified" },
  "insider-director-holdings": { domain: "capital-flows", zh: "董監持股", en: "Insider & director holdings", agency: "MOPS", grade: "verified" },
  "day-trading-suspension": { domain: "capital-flows", zh: "現股當沖暫停", en: "Day-trading suspension", agency: "TWSE", grade: "reference" },

  // ── Companies & Events ──
  "events": { domain: "companies-events", zh: "事件日曆", en: "Events calendar", agency: "TWSE / TPEx / MOPS", grade: "verified" },
  "corporate-actions": { domain: "companies-events", zh: "公司行動", en: "Corporate actions", agency: "TWSE / TPEx / MOPS", grade: "verified" },
  "corporate-actions-enhanced": { domain: "companies-events", zh: "增強公司行動", en: "Enhanced corporate actions", agency: "TWSE / TPEx / MOPS", grade: "derived" },
  "stock-split-par-value-events": { domain: "companies-events", zh: "股票分割／面額事件", en: "Stock split & par-value events", agency: "TWSE / TPEx", grade: "verified" },
  "stock-delisting-lifecycle": { domain: "companies-events", zh: "下市生命週期", en: "Delisting lifecycle", agency: "TWSE / TPEx", grade: "reference" },
  "company-risk-events": { domain: "companies-events", zh: "公司風險事件", en: "Company risk events", agency: "TWSE / TPEx", grade: "reference" },
  "disposition-securities-period": { domain: "companies-events", zh: "處置證券期間", en: "Disposition securities period", agency: "TWSE", grade: "reference" },
  "esg-tesg": { domain: "companies-events", zh: "ESG（TESG）", en: "ESG (TESG)", agency: "TWSE", grade: "derived" },

  // ── Market Structure & Reference ──
  "security-master": { domain: "structure-reference", zh: "股票主檔", en: "Security master", agency: "TWSE / TPEx", grade: "reference" },
  "issuer-profile": { domain: "structure-reference", zh: "公司基本資料", en: "Issuer profile", agency: "TWSE / TPEx", grade: "reference" },
  "broker-branch-reference": { domain: "structure-reference", zh: "券商分點參考", en: "Broker-branch reference", agency: "TWSE", grade: "reference" },
  "theme-taxonomy": { domain: "structure-reference", zh: "主題分類", en: "Theme taxonomy", agency: "TWMD", grade: "reference" },
  "screener": { domain: "structure-reference", zh: "選股器", en: "Screener", agency: "TWSE / TPEx", grade: "derived" },
  "warrants-reference": { domain: "structure-reference", zh: "權證參考", en: "Warrants reference", agency: "TWSE / TPEx", grade: "reference" },

  // ── Macroeconomics ──
  "business-indicator-monthly": { domain: "macro", zh: "景氣指標（月）", en: "Business indicator (monthly)", agency: "NDC", grade: "verified" },
  "macro-global": { domain: "macro", zh: "全球總經", en: "Global macro", agency: "International", grade: "verified" },
  "macro-worldbank": { domain: "macro", zh: "世界銀行總經", en: "World Bank macro", agency: "World Bank", grade: "verified" },
  "interest-rate-snapshot": { domain: "macro", zh: "利率快照", en: "Interest-rate snapshot", agency: "CBC", grade: "verified" },

  // ── Derivatives & Convertibles ──
  "derivatives-market": { domain: "derivatives", zh: "期貨市場", en: "Derivatives market", agency: "TAIFEX", grade: "verified" },
  "options-daily-taifex": { domain: "derivatives", zh: "選擇權日線", en: "Options (daily)", agency: "TAIFEX", grade: "verified" },
  "taifex-options-settlement-price": { domain: "derivatives", zh: "選擇權結算價", en: "Options settlement price", agency: "TAIFEX", grade: "verified" },
  "taifex-institutional-flow": { domain: "derivatives", zh: "期貨法人籌碼", en: "TAIFEX institutional flow", agency: "TAIFEX", grade: "verified" },
  "convertible-bonds": { domain: "derivatives", zh: "可轉債", en: "Convertible bonds", agency: "TPEx", grade: "verified" },
  "bond-convertible-reference": { domain: "derivatives", zh: "可轉債參考", en: "Convertible-bond reference", agency: "TPEx", grade: "reference" },

  // ── Funds & Corporate Intelligence ──
  "fund-etf-metadata": { domain: "funds-intel", zh: "基金／ETF 主檔", en: "Fund / ETF metadata", agency: "Issuer", grade: "reference" },
  // etf-flow is NOT here: it is delisted from billing (no official source, returns 0 rows) and shown as
  // a `building` roadmap item instead of `verified` — see DOCS_BUILDING_DATASETS below.
  "etf-holdings": { domain: "funds-intel", zh: "ETF 持股明細", en: "ETF holdings", agency: "Issuer", grade: "reference" },
  "tax-business-registration": { domain: "funds-intel", zh: "稅籍／商業登記", en: "Tax & business registration", agency: "MOEA", grade: "reference" },
};

// Roadmap ("building") datasets — declared but NOT sellable: no billing policy, no live source yet.
// Shown in the sidebar with a building badge and rendered non-clickable (honest "coming soon" rather
// than a `verified` badge on empty data). Kept separate from DATASET_META so they can never leak into
// the sellable catalog (DOCS_DATASET_CATALOG is billing-derived).
export type DocsBuildingDataset = { domain: DocsDomainId; slug: string; zh: string; en: string };

export const DOCS_BUILDING_DATASETS: DocsBuildingDataset[] = [
  // etf-flow: no official source; the live endpoint returns 0 rows. Delisted from billing 2026-07-21
  // (was falsely `verified` + pro/2cr — a paying customer got empty data). Roadmap until a source lands.
  { domain: "funds-intel", slug: "etf-flow", zh: "ETF 資金流", en: "ETF flow" },
];

export function buildingDatasetsByDomain(domainId: DocsDomainId): DocsBuildingDataset[] {
  return DOCS_BUILDING_DATASETS.filter((d) => d.domain === domainId);
}

export type DocsDatasetEntry = {
  slug: string;
  domain: DocsDomainId;
  zh: string;
  en: string;
  agency: string;
  requiredPlan: GatewayPlanCode;
  creditsCost: number;
  backendPath: string;
  grade: DatasetGrade;
};

// Assemble the full catalog: policy SSOT (slug/plan/cost/path) × docs meta (domain/name/agency/grade).
// A policy slug missing from DATASET_META is surfaced (not silently dropped) so drift is caught.
export const DOCS_DATASET_CATALOG: DocsDatasetEntry[] = Object.values(DATASET_ACCESS_POLICIES).map((policy) => {
  const meta = DATASET_META[policy.datasetSlug];
  if (!meta) {
    return {
      slug: policy.datasetSlug,
      domain: "structure-reference" as DocsDomainId,
      zh: policy.datasetSlug,
      en: policy.datasetSlug,
      agency: "TODO",
      requiredPlan: policy.requiredPlan,
      creditsCost: policy.creditsCost,
      backendPath: policy.backendPath,
      grade: "reference" as DatasetGrade,
    };
  }
  return {
    slug: policy.datasetSlug,
    domain: meta.domain,
    zh: meta.zh,
    en: meta.en,
    agency: meta.agency,
    requiredPlan: policy.requiredPlan,
    creditsCost: policy.creditsCost,
    backendPath: policy.backendPath,
    grade: meta.grade,
  };
});

export function datasetsByDomain(domainId: DocsDomainId): DocsDatasetEntry[] {
  return DOCS_DATASET_CATALOG.filter((d) => d.domain === domainId);
}

export function datasetDisplayName(entry: DocsDatasetEntry, locale: string): string {
  return locale === "en" ? entry.en : entry.zh;
}

export function domainDisplayName(domain: DocsDomain, locale: string): string {
  return locale === "en" ? domain.en : domain.zh;
}
