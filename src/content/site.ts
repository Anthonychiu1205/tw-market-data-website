export const mainNav = [
  { href: "/product", label: "產品" },
  { href: "/api", label: "API" },
  { href: "/docs", label: "文件" },
  { href: "/pricing", label: "方案" },
];

export type DatasetProduct = {
  id: string;
  name: string;
  domain: string;
  marketCoverage: string;
  maturity: "base" | "v2" | "v3";
  readiness: "available_now" | "preview";
  sourceOrigin: string;
  shortUseCase: string;
  endpoint: string;
};

export const datasetProducts: DatasetProduct[] = [
  { id: "twse-daily-price", name: "twse-daily-price", domain: "市場與價格", marketCoverage: "TWSE 日線價格", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE", shortUseCase: "上市股票日線價格、成交量與交易日對齊", endpoint: "/v2/datasets/twse-daily-price" },
  { id: "tpex-daily-price", name: "tpex-daily-price", domain: "市場與價格", marketCoverage: "TPEx 日線價格", maturity: "v2", readiness: "available_now", sourceOrigin: "TPEx", shortUseCase: "上櫃股票日線價格、成交量與交易日對齊", endpoint: "/v2/datasets/tpex-daily-price" },
  { id: "monthly-revenue", name: "monthly-revenue", domain: "財務與成長", marketCoverage: "月營收", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "月營收趨勢、YoY/MoM 成長追蹤", endpoint: "/v2/datasets/monthly-revenue" },
  { id: "income-statement", name: "income-statement", domain: "財務與成長", marketCoverage: "損益表", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "公司損益表欄位查詢", endpoint: "/v2/datasets/income-statement" },
  { id: "balance-sheet", name: "balance-sheet", domain: "財務與成長", marketCoverage: "資產負債表", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "公司資產負債欄位查詢", endpoint: "/v2/datasets/balance-sheet" },
  { id: "cash-flow-statement", name: "cash-flow-statement", domain: "財務與成長", marketCoverage: "現金流量表", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "公司現金流量欄位查詢", endpoint: "/v2/datasets/cash-flow-statement" },
  { id: "valuation-data", name: "valuation-data", domain: "財務與成長", marketCoverage: "估值資料", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS derived", shortUseCase: "PER / PBR / 殖利率與市值相關欄位", endpoint: "/v2/datasets/valuation-data" },
  { id: "technical-indicators", name: "technical-indicators", domain: "市場與價格", marketCoverage: "技術指標", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "MA / RSI / MACD 指標查詢", endpoint: "/v2/datasets/technical-indicators" },
  { id: "institutional-flow", name: "institutional-flow", domain: "籌碼與資金", marketCoverage: "法人買賣", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "三大法人買賣超與淨流量", endpoint: "/v2/datasets/institutional-flow" },
  { id: "margin-short", name: "margin-short", domain: "籌碼與資金", marketCoverage: "TWSE 融資融券（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official-first", shortUseCase: "TWSE 融資融券餘額、買賣與來源血緣；private beta 限定", endpoint: "/v2/datasets/margin-short" },
  { id: "total-margin-short-daily", name: "total-margin-short", domain: "籌碼與資金", marketCoverage: "TWSE 整體融資融券匯總（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official-first", shortUseCase: "TWSE 市場級融資融券匯總；aggregate-only、無個股列、無借券列", endpoint: "/v2/datasets/total-margin-short" },
  { id: "market-overview-snapshots", name: "market-overview-snapshots", domain: "市場與價格", marketCoverage: "TWSE 市場概況快照（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official-first", shortUseCase: "TWSE 市場層級快照；seeded 視窗 2026-05-04..2026-05-28，非完整歷史", endpoint: "/v2/datasets/market-overview-snapshots" },
  { id: "day-trading-suspension", name: "day-trading-suspension", domain: "市場結構", marketCoverage: "當前先買後賣現股當沖暫停清單（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official-first", shortUseCase: "目前快照 only；data_gaps: no_historical_completeness, no_2022_2026_backfill, no_tpex_coverage", endpoint: "/v2/datasets/day-trading-suspension" },
  { id: "disposition-securities-period", name: "disposition-securities-period", domain: "市場結構", marketCoverage: "當前處置證券期間清單（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official-first", shortUseCase: "目前快照 only；data_gaps: no_historical_completeness, no_2022_2026_backfill, no_tpex_coverage", endpoint: "/v2/datasets/disposition-securities-period" },
  { id: "security-master", name: "security-master", domain: "公司與事件", marketCoverage: "股票主檔（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official / TPEx held", shortUseCase: "active snapshot only；非 point-in-time 完整主檔，delisted / rename lifecycle 未整合", endpoint: "/v2/datasets/security-master" },
  { id: "issuer-profile", name: "issuer-profile", domain: "公司與事件", marketCoverage: "公司基本資料", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "公司識別、上市櫃別與產業分類", endpoint: "/v2/datasets/issuer-profile" },
  { id: "issuer-announcements", name: "issuer-announcements", domain: "公司與事件", marketCoverage: "公司公告", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "公告事件追蹤與文件索引", endpoint: "/v2/datasets/issuer-announcements" },
  { id: "events", name: "events", domain: "公司與事件", marketCoverage: "事件日曆", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "事件時間軸與分類查詢", endpoint: "/v2/datasets/events" },
  { id: "structured-events", name: "structured-events", domain: "公司與事件", marketCoverage: "結構化事件", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "事件標準化欄位與跨來源對齊", endpoint: "/v2/datasets/structured-events" },
  { id: "corporate-actions", name: "corporate-actions", domain: "公司與事件", marketCoverage: "公司行動", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "除權息與公司行動事件查詢", endpoint: "/v2/datasets/corporate-actions" },
  { id: "dividends", name: "dividends", domain: "公司與事件", marketCoverage: "股利", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "股利政策與發放欄位查詢", endpoint: "/v2/datasets/dividends" },
  { id: "market-index", name: "market-index", domain: "市場與價格", marketCoverage: "市場指數", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE official-first", shortUseCase: "TAIEX / 市場指數查詢", endpoint: "/v2/datasets/market-index" },
  { id: "market-breadth", name: "market-breadth", domain: "市場與價格", marketCoverage: "市場廣度（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE-only", shortUseCase: "TWSE 漲跌家數與市場廣度欄位；private beta + source_lineage/data_gaps", endpoint: "/v2/datasets/market-breadth" },
  { id: "interest-rate-snapshot", name: "interest-rate-snapshot", domain: "市場與價格", marketCoverage: "利率快照", maturity: "v2", readiness: "available_now", sourceOrigin: "官方總體來源", shortUseCase: "利率與總體市場環境快照", endpoint: "/v2/datasets/interest-rate-snapshot" },
  { id: "company-risk-events", name: "company-risk-events", domain: "公司與事件", marketCoverage: "公司風險事件（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE / TPEx official structured", shortUseCase: "taxonomy-controlled risk / penalty events；非完整 litigation universe、非法律意見", endpoint: "/v2/datasets/company-risk-events" },
  { id: "capital-formation-events", name: "capital-formation-events", domain: "公司與事件", marketCoverage: "資本形成事件（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TWSE official-first", shortUseCase: "TWSE-only narrow baseline；explicit cash capital increase schedule only", endpoint: "/v2/datasets/capital-formation-events" },
  { id: "tax-business-registration", name: "tax-business-registration", domain: "企業情報", marketCoverage: "稅籍 / 商業登記參考資料（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "MOEA / data.gov.tw official-first", shortUseCase: "public business/company registration reference only；非 private tax data、非 issuer_profile replacement", endpoint: "/v2/datasets/tax-business-registration" },
  { id: "etf-holdings", name: "etf-holdings", domain: "基金與 ETF", marketCoverage: "ETF 持股明細（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "Issuer official-first", shortUseCase: "Fubon issuer-limited latest snapshot only；非 market-wide、非 historical、非 index constituents", endpoint: "/v2/datasets/etf-holdings" },
  { id: "convertible-bond-institutional-flow", name: "convertible-bond-institutional-flow", domain: "可轉債", marketCoverage: "可轉債法人籌碼（Private Beta）", maturity: "v2", readiness: "preview", sourceOrigin: "TPEx official-first", shortUseCase: "aggregate institutional bucket surface only；no bond_code、非 bond-level daily flow", endpoint: "/v2/datasets/convertible-bond-institutional-flow" },
];

export const sourcePolicy = [
  "TWSE / TPEx / MOPS 優先，official / public-first。",
  "canonical、fallback、helper 角色分離。",
  "lineage / freshness / completeness / auditability 為核心能力。",
];

export const platformCapabilities = [
  {
    title: "資料引擎",
    items: ["台股官方來源優先資料層", "available-now 與 preview 分級", "來源分層與可審計"],
  },
  {
    title: "API 產品",
    items: ["REST API", "API 金鑰 / 配額 / 用量", "Quick Start 與文件導流"],
  },
  {
    title: "商業化流程",
    items: ["controlled rollout", "方案分級與用量控管", "public sellable boundary 管理"],
  },
  {
    title: "V2 能力",
    items: ["query / search", "screener / factor", "MCP / agent workflow"],
  },
];

export const pricingPlans = [
  {
    name: "Enterprise",
    monthly: "聯繫我們",
    yearly: "聯繫我們",
    summary: "全量 available-now 能力 + 客製擴充。",
    features: ["available-now datasets 全開通", "Custom API key / quota / rpm", "SLA / support / custom access"],
    cta: "聯繫我們",
  },
  {
    name: "Team",
    monthly: "NT$6,000",
    yearly: "NT$72,000",
    summary: "高配額團隊方案。",
    features: ["多數核心資料集", "API Keys 10 / RPM 600", "完整 usage breakdown 與 billing preview"],
    cta: "選擇團隊方案",
  },
  {
    name: "Pro",
    monthly: "NT$1,490",
    yearly: "NT$17,880",
    summary: "進階資料與商業使用。",
    features: ["核心資料集 + 量化查詢", "API Keys 5 / RPM 120", "完整用量總覽與 dataset breakdown"],
    cta: "選擇專業方案",
  },
  {
    name: "Developer",
    monthly: "NT$690",
    yearly: "NT$8,280",
    summary: "開發驗證與輕量整合。",
    features: ["核心起步資料集", "API Keys 2 / RPM 30", "基本用量總覽與簡化 breakdown"],
    cta: "選擇開發者方案",
  },
  {
    name: "Free",
    monthly: "免費",
    yearly: "免費",
    summary: "試用與接線測試。",
    features: ["基礎資料集", "API Keys 1 / RPM 10", "基本用量顯示"],
    cta: "開始使用",
  },
];

export const pricingMatrix = [
  { capability: "可用資料集數量", enterprise: "全量開通", team: "多數", pro: "核心 + 進階", developer: "核心", free: "基礎" },
  { capability: "API 金鑰", enterprise: "Custom", team: "10", pro: "5", developer: "2", free: "1" },
  { capability: "每日配額", enterprise: "Custom", team: "20,000", pro: "4,000", developer: "800", free: "100" },
  { capability: "每月配額", enterprise: "Custom", team: "500,000", pro: "100,000", developer: "20,000", free: "2,000" },
  { capability: "RPM", enterprise: "Custom", team: "600", pro: "120", developer: "30", free: "10" },
  { capability: "商業使用", enterprise: "是", team: "是", pro: "是", developer: "否", free: "否" },
];

export const creditsReference = [
  { endpoint: "/v2/datasets/twse-daily-price", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/tpex-daily-price", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/monthly-revenue", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/income-statement", unit: "每 1,000 次", cost: "NT$20" },
  { endpoint: "/v2/datasets/valuation-data", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/technical-indicators", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/institutional-flow", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/market-overview-snapshots", unit: "每 1,000 次", cost: "NT$16" },
];
