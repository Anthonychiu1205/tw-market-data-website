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
  readiness: "available_now" | "invited_preview" | "not_yet_available";
  sourceOrigin: string;
  shortUseCase: string;
  endpoint: string | null;
};

export const datasetProducts: DatasetProduct[] = [
  {
    id: "twse-daily-price",
    name: "twse-daily-price",
    domain: "行情資料",
    marketCoverage: "TWSE 日線價格",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE",
    shortUseCase: "上市股票日價、成交量與交易日對齊查詢",
    endpoint: "/v2/datasets/twse-daily-price",
  },
  {
    id: "tpex-daily-price",
    name: "tpex-daily-price",
    domain: "行情資料",
    marketCoverage: "TPEx 日線價格",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TPEx",
    shortUseCase: "上櫃股票日價、成交量與交易日對齊查詢",
    endpoint: "/v2/datasets/tpex-daily-price",
  },
  {
    id: "monthly-revenue",
    name: "monthly-revenue",
    domain: "基本面",
    marketCoverage: "MOPS 月營收",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "MOPS",
    shortUseCase: "月營收趨勢、YoY/MoM 成長與營運追蹤",
    endpoint: "/v2/datasets/monthly-revenue",
  },
  {
    id: "valuation-data",
    name: "valuation-data",
    domain: "基本面",
    marketCoverage: "上市櫃估值指標",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE / TPEx",
    shortUseCase: "PER / PBR / 殖利率等估值流程",
    endpoint: "/v2/datasets/valuation-data",
  },
  {
    id: "adjusted-prices",
    name: "adjusted-prices",
    domain: "行情資料",
    marketCoverage: "還原價格序列",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE / TPEx",
    shortUseCase: "已驗證的 adjusted price 序列查詢（目前以既有證明範圍為準）",
    endpoint: "/v2/datasets/adjusted-prices",
  },
  {
    id: "issuer-announcements",
    name: "issuer-announcements",
    domain: "公司事件",
    marketCoverage: "上市櫃公告與重大訊息",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE / TPEx / MOPS",
    shortUseCase: "公告事件追蹤與文件索引",
    endpoint: "/v2/datasets/issuer-announcements",
  },
  {
    id: "issuer-profile",
    name: "issuer-profile",
    domain: "公司主檔",
    marketCoverage: "上市櫃公司主檔",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE / TPEx / 公開揭露",
    shortUseCase: "公司識別、分類與主檔查詢",
    endpoint: "/v2/datasets/issuer-profile",
  },
  {
    id: "interest-rate-snapshot",
    name: "interest-rate-snapshot",
    domain: "市場環境",
    marketCoverage: "利率快照",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "中央銀行 / 公開資料平台",
    shortUseCase: "折現率與市場環境快照",
    endpoint: "/v2/datasets/interest-rate-snapshot",
  },
  {
    id: "technical-indicators",
    name: "technical-indicators",
    domain: "市場分析",
    marketCoverage: "技術指標",
    maturity: "v2",
    readiness: "invited_preview",
    sourceOrigin: "TWSE / TPEx",
    shortUseCase: "策略研究與訊號驗證，仍屬 invited / preview 範圍",
    endpoint: "/v2/datasets/technical-indicators",
  },
  {
    id: "institutional-flow",
    name: "institutional-flow",
    domain: "籌碼分析",
    marketCoverage: "法人買賣",
    maturity: "v2",
    readiness: "invited_preview",
    sourceOrigin: "TWSE / TPEx",
    shortUseCase: "觀察資金方向，仍屬 invited / preview 範圍",
    endpoint: "/v2/datasets/institutional-flow",
  },
  {
    id: "company-news",
    name: "company-news",
    domain: "新聞",
    marketCoverage: "公司層級新聞",
    maturity: "base",
    readiness: "invited_preview",
    sourceOrigin: "公開新聞來源",
    shortUseCase: "公司事件與新聞流追蹤，仍屬 preview",
    endpoint: null,
  },
  {
    id: "market-news",
    name: "market-news",
    domain: "新聞",
    marketCoverage: "市場層級新聞",
    maturity: "base",
    readiness: "invited_preview",
    sourceOrigin: "公開新聞來源",
    shortUseCase: "市場主題與消息流觀察，仍屬 preview",
    endpoint: null,
  },
  {
    id: "income-statement",
    name: "income-statement",
    domain: "財報",
    marketCoverage: "損益表",
    maturity: "v2",
    readiness: "not_yet_available",
    sourceOrigin: "MOPS",
    shortUseCase: "尚未納入 available-now 商售邊界",
    endpoint: "/v2/datasets/income-statement",
  },
  {
    id: "cash-flow-statement",
    name: "cash-flow-statement",
    domain: "財報",
    marketCoverage: "現金流量表",
    maturity: "v2",
    readiness: "not_yet_available",
    sourceOrigin: "MOPS",
    shortUseCase: "尚未納入 available-now 商售邊界",
    endpoint: "/v2/datasets/cash-flow-statement",
  },
  {
    id: "balance-sheet",
    name: "balance-sheet",
    domain: "財報",
    marketCoverage: "資產負債表",
    maturity: "v2",
    readiness: "not_yet_available",
    sourceOrigin: "MOPS",
    shortUseCase: "尚未納入 available-now 商售邊界",
    endpoint: "/v2/datasets/balance-sheet",
  },
  {
    id: "margin-short",
    name: "margin-short",
    domain: "籌碼分析",
    marketCoverage: "融資融券",
    maturity: "v2",
    readiness: "not_yet_available",
    sourceOrigin: "TWSE / TPEx",
    shortUseCase: "尚未納入 available-now 商售邊界",
    endpoint: "/v2/datasets/margin-short",
  },
];

export const sourcePolicy = [
  "TWSE / TPEx / MOPS 優先，official / public-first。",
  "canonical、fallback、helper 角色分離。",
  "FinMind 不是 canonical；twstock 僅 helper；Yahoo 僅 helper/fallback。",
  "lineage / freshness / completeness / auditability 為核心能力。",
];

export const platformCapabilities = [
  {
    title: "資料引擎",
    items: ["台股 canonical 資料層", "8 個可公開販售資料集", "來源分層與可審計"],
  },
  {
    title: "API 產品",
    items: ["REST API", "API 金鑰 / 配額 / 用量", "Quickstart 與文件導流"],
  },
  {
    title: "商業化流程",
    items: ["受控 limited rollout", "preview billing semantics", "public sellable boundary 已明確"],
  },
  {
    title: "V2 能力",
    items: ["semantic catalog", "query planner", "MCP / agent workflow"],
  },
];

export const pricingPlans = [
  {
    name: "Developer",
    monthly: "NT$0",
    yearly: "NT$0",
    summary: "個人開發與研究。",
    features: ["8 sellable-now 資料集", "API 金鑰管理", "標準配額與速率"],
    cta: "開始使用",
  },
  {
    name: "Pro",
    monthly: "NT$6,800",
    yearly: "NT$5,700",
    summary: "團隊產品化與策略研究。",
    features: ["8 sellable-now 資料集完整存取", "較高配額與速率", "帳單與支援（preview billing）"],
    cta: "升級 Pro",
  },
  {
    name: "Enterprise",
    monthly: "客製",
    yearly: "客製",
    summary: "機構導入與客製需求。",
    features: ["客製配額與 SLA", "專屬導入協作", "企業支援"],
    cta: "聯絡銷售",
  },
];

export const pricingMatrix = [
  { capability: "資料集範圍", developer: "8（available now）", pro: "8（完整）", enterprise: "8 + 後續擴充" },
  { capability: "API 金鑰", developer: "1~2 組", pro: "多組", enterprise: "策略控管" },
  { capability: "配額 / 速率", developer: "標準", pro: "提高", enterprise: "客製" },
  { capability: "帳務模式", developer: "preview", pro: "preview + 帳單", enterprise: "合約" },
  { capability: "支援", developer: "文件", pro: "Email", enterprise: "專屬通道" },
];

export const creditsReference = [
  { endpoint: "/v2/datasets/twse-daily-price", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/tpex-daily-price", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/monthly-revenue", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/valuation-data", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/adjusted-prices", unit: "每 1,000 次", cost: "NT$22" },
  { endpoint: "/v2/datasets/issuer-announcements", unit: "每 1,000 次", cost: "NT$20" },
  { endpoint: "/v2/datasets/issuer-profile", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/interest-rate-snapshot", unit: "每 1,000 次", cost: "NT$15" },
];
