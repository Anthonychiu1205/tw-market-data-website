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
  { id: "margin-short", name: "margin-short", domain: "籌碼與資金", marketCoverage: "TWSE 融資融券（Private Beta）", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE official-first", shortUseCase: "TWSE 融資融券餘額、買賣與來源血緣；private beta 限定", endpoint: "/v2/datasets/margin-short" },
  { id: "total-margin-short-daily", name: "total-margin-short", domain: "籌碼與資金", marketCoverage: "TWSE 整體融資融券匯總（Private Beta）", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE official-first", shortUseCase: "TWSE 市場級融資融券匯總，含餘額、買賣與來源血緣；private beta 種子資料", endpoint: "/v2/datasets/total-margin-short" },
  { id: "issuer-profile", name: "issuer-profile", domain: "公司與事件", marketCoverage: "公司基本資料", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "公司識別、上市櫃別與產業分類", endpoint: "/v2/datasets/issuer-profile" },
  { id: "issuer-announcements", name: "issuer-announcements", domain: "公司與事件", marketCoverage: "公司公告", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "公告事件追蹤與文件索引", endpoint: "/v2/datasets/issuer-announcements" },
  { id: "events", name: "events", domain: "公司與事件", marketCoverage: "事件日曆", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "事件時間軸與分類查詢", endpoint: "/v2/datasets/events" },
  { id: "structured-events", name: "structured-events", domain: "公司與事件", marketCoverage: "結構化事件", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "事件標準化欄位與跨來源對齊", endpoint: "/v2/datasets/structured-events" },
  { id: "corporate-actions", name: "corporate-actions", domain: "公司與事件", marketCoverage: "公司行動", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "除權息與公司行動事件查詢", endpoint: "/v2/datasets/corporate-actions" },
  { id: "dividends", name: "dividends", domain: "公司與事件", marketCoverage: "股利", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "股利政策與發放欄位查詢", endpoint: "/v2/datasets/dividends" },
  { id: "index-data", name: "index-data", domain: "市場與價格", marketCoverage: "市場指數", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "大盤與類股指數查詢", endpoint: "/v2/datasets/index-data" },
  { id: "market-breadth", name: "market-breadth", domain: "市場與價格", marketCoverage: "市場廣度", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "上漲/下跌家數與市場廣度指標", endpoint: "/v2/datasets/market-breadth" },
  { id: "interest-rate-snapshot", name: "interest-rate-snapshot", domain: "市場與價格", marketCoverage: "利率快照", maturity: "v2", readiness: "available_now", sourceOrigin: "官方總體來源", shortUseCase: "利率與總體市場環境快照", endpoint: "/v2/datasets/interest-rate-snapshot" },
  { id: "theme-taxonomy", name: "theme-taxonomy", domain: "分類與結構", marketCoverage: "主題分類", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "標的主題標籤與分類查詢", endpoint: "/v2/datasets/theme-taxonomy" },
  { id: "index-classification", name: "index-classification", domain: "分類與結構", marketCoverage: "指數分類", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "指數分類與成員結構映射", endpoint: "/v2/datasets/index-classification" },
  { id: "features", name: "features", domain: "策略與量化", marketCoverage: "特徵資料", maturity: "v2", readiness: "available_now", sourceOrigin: "internal derived", shortUseCase: "跨資料集特徵輸出與模型輸入欄位", endpoint: "/v2/datasets/features" },
  { id: "factor-data", name: "factor-data", domain: "策略與量化", marketCoverage: "因子資料", maturity: "v2", readiness: "available_now", sourceOrigin: "internal derived", shortUseCase: "因子暴露與排名欄位", endpoint: "/v2/datasets/factor-data" },
  { id: "time-alignment", name: "time-alignment", domain: "策略與量化", marketCoverage: "時間對齊", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "跨表時間軸對齊資料", endpoint: "/v2/datasets/time-alignment" },
  { id: "screener", name: "screener", domain: "策略與量化", marketCoverage: "條件篩選", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "多條件篩選與清單輸出", endpoint: "/v2/datasets/screener" },
  { id: "search", name: "search", domain: "查詢與工具", marketCoverage: "搜尋 API", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "代號、公司與主題搜尋", endpoint: "/v2/search" },
  { id: "query", name: "query", domain: "查詢與工具", marketCoverage: "查詢 API", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "跨資料集查詢與欄位聚合", endpoint: "/v2/query" },
  { id: "query-fields", name: "query-fields", domain: "查詢與工具", marketCoverage: "查詢欄位", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "可查詢欄位清單", endpoint: "/v2/query/fields" },
  { id: "query-examples", name: "query-examples", domain: "查詢與工具", marketCoverage: "查詢範例", maturity: "v2", readiness: "available_now", sourceOrigin: "internal", shortUseCase: "可重用查詢模板", endpoint: "/v2/query/examples" },
  { id: "company-news", name: "company-news", domain: "預覽", marketCoverage: "公司新聞", maturity: "v2", readiness: "preview", sourceOrigin: "curated snapshot / backend summary", shortUseCase: "公司新聞摘要（preview）", endpoint: "/v2/datasets/company-news" },
  { id: "market-news", name: "market-news", domain: "預覽", marketCoverage: "市場新聞", maturity: "v2", readiness: "preview", sourceOrigin: "curated snapshot / backend summary", shortUseCase: "市場新聞摘要（preview）", endpoint: "/v2/datasets/market-news" },
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
  { endpoint: "/v2/datasets/theme-taxonomy", unit: "每 1,000 次", cost: "NT$16" },
];
