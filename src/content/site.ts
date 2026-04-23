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
  readiness: "available_now" | "coming_soon" | "beta";
  sourceOrigin: string;
  shortUseCase: string;
  endpoint: string | null;
};

export const datasetProducts: DatasetProduct[] = [
  {
    id: "issuer-profile",
    name: "issuer-profile",
    domain: "公司基本資料",
    marketCoverage: "上市櫃公司主檔",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE / TPEx / 公開揭露",
    shortUseCase: "公司識別、分類與主檔查詢",
    endpoint: "/v2/datasets/issuer-profile",
  },
  {
    id: "issuer-announcements",
    name: "issuer-announcements",
    domain: "公告文件",
    marketCoverage: "上市櫃公司公告與重大訊息",
    maturity: "v2",
    readiness: "available_now",
    sourceOrigin: "TWSE / TPEx / MOPS",
    shortUseCase: "公告事件追蹤與文件索引",
    endpoint: "/v2/datasets/issuer-announcements",
  },
  {
    id: "company-news",
    name: "company-news",
    domain: "新聞",
    marketCoverage: "公司層級新聞",
    maturity: "base",
    readiness: "beta",
    sourceOrigin: "公開新聞來源",
    shortUseCase: "公司事件與新聞流追蹤",
    endpoint: null,
  },
  {
    id: "market-news",
    name: "market-news",
    domain: "新聞",
    marketCoverage: "市場層級新聞",
    maturity: "base",
    readiness: "beta",
    sourceOrigin: "公開新聞來源",
    shortUseCase: "市場主題與消息流觀察",
    endpoint: null,
  },
  {
    id: "interest-rate-snapshot",
    name: "interest-rate-snapshot",
    domain: "利率",
    marketCoverage: "利率快照",
    maturity: "base",
    readiness: "coming_soon",
    sourceOrigin: "官方公開利率來源",
    shortUseCase: "折現率與市場環境快照",
    endpoint: null,
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
    items: ["台股 canonical 資料層", "2 個已上線資料主題", "來源分層與可審計"],
  },
  {
    title: "API 產品",
    items: ["REST API", "API 金鑰 / 配額 / 用量", "Quickstart 與文件導流"],
  },
  {
    title: "商業化流程",
    items: ["方案管理", "訂閱與帳單流程", "自助導入就緒"],
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
    features: ["8 資料集基礎存取", "API 金鑰管理", "標準配額與速率"],
    cta: "開始使用",
  },
  {
    name: "Pro",
    monthly: "NT$6,800",
    yearly: "NT$5,700",
    summary: "團隊產品化與策略研究。",
    features: ["8 資料集完整存取", "較高配額與速率", "帳單與支援"],
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
  { capability: "資料集範圍", developer: "8（基礎）", pro: "8（完整）", enterprise: "8 + 客製" },
  { capability: "API 金鑰", developer: "1~2 組", pro: "多組", enterprise: "策略控管" },
  { capability: "配額 / 速率", developer: "標準", pro: "提高", enterprise: "客製" },
  { capability: "帳務模式", developer: "自助", pro: "自助 + 帳單", enterprise: "合約" },
  { capability: "支援", developer: "文件", pro: "Email", enterprise: "專屬通道" },
];

export const creditsReference = [
  { endpoint: "/v2/datasets/issuer-profile", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/issuer-announcements", unit: "每 1,000 次", cost: "NT$20" },
];
