// DOCS-01 dataset catalog — the single backbone the v5 docs sidebar and the endpoint pages both read.
//
// SSOT discipline (rule 1): the slug / plan / price / backend path are NOT copied here — they are
// imported from the billing SSOT `DATASET_ACCESS_POLICIES` (64 sellable public slugs). This module
// only LAYERS what the docs need on top: which of the 8 user-facing domains a dataset belongs to, its
// bilingual display name, its source agency, and the SIGNALS its grade is derived from. So a price or
// tier change in the policy table flows through automatically; there is no second price list to drift.
//
// Grade is DERIVED, never frozen (rule: 掉綠自動變色). The signals below come from the coverage /
// readiness registry (site.ts readiness + coverage-facts availability); when the live availability API
// becomes reliable per-dataset, swap the signal source and every badge re-colours with no page edits.
//
// The domain assignment of all 64 slugs is a PROPOSED v5 IA grouping — the marketing-domain taxonomy
// the owner chose, extended to cover macro / derivatives / funds which the original 31-dataset
// marketing list did not. It is meant to be reviewed in the Phase-1 draft PR.

import { DATASET_ACCESS_POLICIES, type GatewayPlanCode } from "@/src/lib/gateway/dataset-policies";
import { deriveDatasetGrade, type DatasetGrade, type DatasetGradeSignals } from "@/src/lib/docs/dataset-grade";

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

// Role drives the grade derivation: "official" (verified when full-history, reference when preview),
// "derived" (a computed dataset), "reference" (a lookup/master with no verifiable time series).
type DatasetRole = "official" | "derived" | "reference";

type DatasetMeta = {
  domain: DocsDomainId;
  zh: string;
  en: string;
  agency: string; // real source agency — TWSE / TPEx / MOPS / TAIFEX / CBC / MOEA / Issuer
  role: DatasetRole;
  preview?: boolean; // site.ts readiness === "preview" (private beta / partial coverage)
};

// Per-slug docs metadata. zh names follow site.ts marketCoverage where present; agency + role + preview
// come from site.ts (sourceOrigin/readiness) and the dataset's known source. Datasets without a
// site.ts entry are classified from their slug + known TWMD source; their real coverage numbers are
// filled per-page (or TODO-marked) — this table only carries name/domain/agency/grade-signal.
const DATASET_META: Record<string, DatasetMeta> = {
  // ── Market & Prices ──
  "twse-daily-price": { domain: "market-prices", zh: "TWSE 日線價格", en: "TWSE daily prices", agency: "TWSE", role: "official" },
  "tpex-daily-price": { domain: "market-prices", zh: "TPEx 日線價格", en: "TPEx daily prices", agency: "TPEx", role: "official" },
  "market-prices": { domain: "market-prices", zh: "整合日線價格", en: "Unified daily prices", agency: "TWSE / TPEx", role: "official" },
  "price-enhanced": { domain: "market-prices", zh: "增強價格欄位", en: "Enhanced price fields", agency: "TWSE / TPEx", role: "derived" },
  "adjusted-prices": { domain: "market-prices", zh: "還原價格", en: "Adjusted prices", agency: "TWSE / TPEx", role: "derived" },
  "market-index": { domain: "market-prices", zh: "市場指數", en: "Market indices", agency: "TWSE", role: "official" },
  "index-data": { domain: "market-prices", zh: "指數資料", en: "Index data", agency: "TWSE", role: "official" },
  "index-classification": { domain: "market-prices", zh: "指數分類", en: "Index classification", agency: "TWSE", role: "reference" },
  "index-constituents": { domain: "market-prices", zh: "指數成分股", en: "Index constituents", agency: "TWSE", role: "derived" },
  "return-index-daily": { domain: "market-prices", zh: "報酬指數日線", en: "Return index (daily)", agency: "TWSE", role: "derived" },
  "market-snapshot": { domain: "market-prices", zh: "市場快照", en: "Market snapshot", agency: "TWSE", role: "official" },
  "market-overview-snapshots": { domain: "market-prices", zh: "市場概況快照", en: "Market overview snapshots", agency: "TWSE", role: "official", preview: true },
  "market-breadth": { domain: "market-prices", zh: "市場廣度", en: "Market breadth", agency: "TWSE", role: "derived", preview: true },
  "technical-indicators": { domain: "market-prices", zh: "技術指標", en: "Technical indicators", agency: "TWSE / TPEx", role: "derived" },
  "stock-price-limit-daily": { domain: "market-prices", zh: "漲跌停價日線", en: "Price-limit (daily)", agency: "TWSE", role: "official" },
  "valuation-core-daily": { domain: "market-prices", zh: "核心估值日線", en: "Core valuation (daily)", agency: "TWSE / TPEx", role: "derived" },
  "valuation-data": { domain: "market-prices", zh: "估值資料", en: "Valuation data", agency: "TWSE / TPEx / MOPS", role: "derived" },

  // ── Financials & Growth ──
  "monthly-revenue": { domain: "financials", zh: "月營收", en: "Monthly revenue", agency: "MOPS", role: "official" },
  "monthly-revenue-enhanced": { domain: "financials", zh: "增強月營收", en: "Enhanced monthly revenue", agency: "MOPS", role: "derived" },
  "income-statement": { domain: "financials", zh: "損益表", en: "Income statement", agency: "MOPS", role: "official" },
  "balance-sheet": { domain: "financials", zh: "資產負債表", en: "Balance sheet", agency: "MOPS", role: "official" },
  "cash-flow-statement": { domain: "financials", zh: "現金流量表", en: "Cash-flow statement", agency: "MOPS", role: "official" },
  "financials": { domain: "financials", zh: "財報三表合併", en: "Financial statements (combined)", agency: "MOPS", role: "official" },
  "financial-metrics": { domain: "financials", zh: "財務比率指標", en: "Financial metrics", agency: "MOPS", role: "derived" },
  "dividends": { domain: "financials", zh: "股利政策", en: "Dividend policy", agency: "MOPS", role: "official" },

  // ── Capital Flows ──
  "institutional-flow": { domain: "capital-flows", zh: "三大法人買賣", en: "Institutional flow", agency: "TWSE", role: "official" },
  "institutional-flow-market-aggregate": { domain: "capital-flows", zh: "法人市場匯總", en: "Institutional flow (market aggregate)", agency: "TWSE", role: "derived" },
  "institutional-ownership": { domain: "capital-flows", zh: "法人持股", en: "Institutional ownership", agency: "TWSE", role: "official" },
  "margin-short": { domain: "capital-flows", zh: "融資融券", en: "Margin & short", agency: "TWSE", role: "official", preview: true },
  "margin-short-enhanced": { domain: "capital-flows", zh: "增強融資融券", en: "Enhanced margin & short", agency: "TWSE", role: "derived" },
  "total-margin-short": { domain: "capital-flows", zh: "整體融資融券匯總", en: "Total margin & short", agency: "TWSE", role: "official", preview: true },
  "securities-lending": { domain: "capital-flows", zh: "借券資料", en: "Securities lending", agency: "TWSE", role: "official" },
  "chip-flows": { domain: "capital-flows", zh: "籌碼流向", en: "Chip flows", agency: "TWSE", role: "derived" },
  "ownership-distribution": { domain: "capital-flows", zh: "股權分散", en: "Ownership distribution", agency: "TDCC", role: "official" },
  "insider-director-holdings": { domain: "capital-flows", zh: "董監持股", en: "Insider & director holdings", agency: "MOPS", role: "official" },
  "day-trading-suspension": { domain: "capital-flows", zh: "現股當沖暫停", en: "Day-trading suspension", agency: "TWSE", role: "official", preview: true },

  // ── Companies & Events ──
  "events": { domain: "companies-events", zh: "事件日曆", en: "Events calendar", agency: "TWSE / TPEx / MOPS", role: "official" },
  "corporate-actions": { domain: "companies-events", zh: "公司行動", en: "Corporate actions", agency: "TWSE / TPEx / MOPS", role: "official" },
  "corporate-actions-enhanced": { domain: "companies-events", zh: "增強公司行動", en: "Enhanced corporate actions", agency: "TWSE / TPEx / MOPS", role: "derived" },
  "stock-split-par-value-events": { domain: "companies-events", zh: "股票分割／面額事件", en: "Stock split & par-value events", agency: "TWSE / TPEx", role: "official" },
  "stock-delisting-lifecycle": { domain: "companies-events", zh: "下市生命週期", en: "Delisting lifecycle", agency: "TWSE / TPEx", role: "reference" },
  "company-risk-events": { domain: "companies-events", zh: "公司風險事件", en: "Company risk events", agency: "TWSE / TPEx", role: "official", preview: true },
  "disposition-securities-period": { domain: "companies-events", zh: "處置證券期間", en: "Disposition securities period", agency: "TWSE", role: "official", preview: true },
  "esg-tesg": { domain: "companies-events", zh: "ESG（TESG）", en: "ESG (TESG)", agency: "TWSE", role: "derived" },

  // ── Market Structure & Reference ──
  "security-master": { domain: "structure-reference", zh: "股票主檔", en: "Security master", agency: "TWSE / TPEx", role: "reference", preview: true },
  "issuer-profile": { domain: "structure-reference", zh: "公司基本資料", en: "Issuer profile", agency: "TWSE / TPEx", role: "reference" },
  "broker-branch-reference": { domain: "structure-reference", zh: "券商分點參考", en: "Broker-branch reference", agency: "TWSE", role: "reference" },
  "theme-taxonomy": { domain: "structure-reference", zh: "主題分類", en: "Theme taxonomy", agency: "TWMD", role: "reference" },
  "screener": { domain: "structure-reference", zh: "選股器", en: "Screener", agency: "TWSE / TPEx", role: "derived" },
  "warrants-reference": { domain: "structure-reference", zh: "權證參考", en: "Warrants reference", agency: "TWSE / TPEx", role: "reference" },

  // ── Macroeconomics ──
  "business-indicator-monthly": { domain: "macro", zh: "景氣指標（月）", en: "Business indicator (monthly)", agency: "NDC", role: "official" },
  "macro-global": { domain: "macro", zh: "全球總經", en: "Global macro", agency: "International", role: "official" },
  "macro-worldbank": { domain: "macro", zh: "世界銀行總經", en: "World Bank macro", agency: "World Bank", role: "official" },
  "interest-rate-snapshot": { domain: "macro", zh: "利率快照", en: "Interest-rate snapshot", agency: "CBC", role: "official" },

  // ── Derivatives & Convertibles ──
  "derivatives-market": { domain: "derivatives", zh: "期貨市場", en: "Derivatives market", agency: "TAIFEX", role: "official" },
  "options-daily-taifex": { domain: "derivatives", zh: "選擇權日線", en: "Options (daily)", agency: "TAIFEX", role: "official" },
  "taifex-options-settlement-price": { domain: "derivatives", zh: "選擇權結算價", en: "Options settlement price", agency: "TAIFEX", role: "official" },
  "taifex-institutional-flow": { domain: "derivatives", zh: "期貨法人籌碼", en: "TAIFEX institutional flow", agency: "TAIFEX", role: "official" },
  "convertible-bonds": { domain: "derivatives", zh: "可轉債", en: "Convertible bonds", agency: "TPEx", role: "official" },
  "bond-convertible-reference": { domain: "derivatives", zh: "可轉債參考", en: "Convertible-bond reference", agency: "TPEx", role: "reference" },

  // ── Funds & Corporate Intelligence ──
  "fund-etf-metadata": { domain: "funds-intel", zh: "基金／ETF 主檔", en: "Fund / ETF metadata", agency: "Issuer", role: "reference" },
  "etf-flow": { domain: "funds-intel", zh: "ETF 資金流", en: "ETF flow", agency: "Issuer", role: "official" },
  "etf-holdings": { domain: "funds-intel", zh: "ETF 持股明細", en: "ETF holdings", agency: "Issuer", role: "official", preview: true },
  "tax-business-registration": { domain: "funds-intel", zh: "稅籍／商業登記", en: "Tax & business registration", agency: "MOEA", role: "reference", preview: true },
};

function signalsFor(meta: DatasetMeta): DatasetGradeSignals {
  if (meta.role === "derived") return { sourceRole: "derived_dataset", availability: "available", hasRealCoverage: true };
  if (meta.role === "reference") return { sourceRole: "official_reference_master", availability: "metadata-only" };
  // official
  return {
    sourceRole: "official_source",
    availability: meta.preview ? "coverage-limited" : "available",
    readiness: meta.preview ? "preview" : "available_now",
    hasRealCoverage: true,
  };
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

// Assemble the full catalog: policy SSOT (slug/plan/cost/path) × docs meta (domain/name/agency) × derived grade.
// A policy slug missing from DATASET_META is surfaced (not silently dropped) so drift is caught, not hidden.
export const DOCS_DATASET_CATALOG: DocsDatasetEntry[] = Object.values(DATASET_ACCESS_POLICIES).map((policy) => {
  const meta = DATASET_META[policy.datasetSlug];
  if (!meta) {
    // Drift guard: a sellable slug we forgot to classify. Show it under reference rather than hide it.
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
    grade: deriveDatasetGrade(signalsFor(meta)),
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
