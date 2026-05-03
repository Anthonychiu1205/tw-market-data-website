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
  readiness: "available_now";
  sourceOrigin: string;
  shortUseCase: string;
  endpoint: string;
};

export const datasetProducts: DatasetProduct[] = [
  { id: "twse-daily-price", name: "twse-daily-price", domain: "行情資料", marketCoverage: "TWSE 日線價格", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE", shortUseCase: "上市股票日價、成交量與交易日對齊查詢", endpoint: "/v2/datasets/twse-daily-price" },
  { id: "tpex-daily-price", name: "tpex-daily-price", domain: "行情資料", marketCoverage: "TPEx 日線價格", maturity: "v2", readiness: "available_now", sourceOrigin: "TPEx", shortUseCase: "上櫃股票日價、成交量與交易日對齊查詢", endpoint: "/v2/datasets/tpex-daily-price" },
  { id: "adjusted-prices", name: "adjusted-prices", domain: "行情資料", marketCoverage: "還原價格序列", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "已驗證 adjusted price 序列查詢", endpoint: "/v2/datasets/adjusted-prices" },
  { id: "monthly-revenue", name: "monthly-revenue", domain: "基本面", marketCoverage: "MOPS 月營收", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "月營收趨勢、YoY/MoM 成長追蹤", endpoint: "/v2/datasets/monthly-revenue" },
  { id: "valuation-data", name: "valuation-data", domain: "基本面", marketCoverage: "上市櫃估值指標", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "PER / PBR / 殖利率估值流程", endpoint: "/v2/datasets/valuation-data" },
  { id: "technical-indicators", name: "technical-indicators", domain: "市場分析", marketCoverage: "技術指標", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "MA/RSI/MACD 指標查詢", endpoint: "/v2/datasets/technical-indicators" },
  { id: "income-statement", name: "income-statement", domain: "財報", marketCoverage: "損益表", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "公司損益表欄位查詢", endpoint: "/v2/datasets/income-statement" },
  { id: "cash-flow-statement", name: "cash-flow-statement", domain: "財報", marketCoverage: "現金流量表", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "公司現金流欄位查詢", endpoint: "/v2/datasets/cash-flow-statement" },
  { id: "balance-sheet", name: "balance-sheet", domain: "財報", marketCoverage: "資產負債表", maturity: "v2", readiness: "available_now", sourceOrigin: "MOPS", shortUseCase: "公司資產負債欄位查詢", endpoint: "/v2/datasets/balance-sheet" },
  { id: "institutional-flow", name: "institutional-flow", domain: "籌碼分析", marketCoverage: "法人買賣", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "三大法人買賣超與淨流量", endpoint: "/v2/datasets/institutional-flow" },
  { id: "margin-short", name: "margin-short", domain: "籌碼分析", marketCoverage: "融資融券", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "融資融券餘額與變化", endpoint: "/v2/datasets/margin-short" },
  { id: "issuer-announcements", name: "issuer-announcements", domain: "公司事件", marketCoverage: "上市櫃公告與重大訊息", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx / MOPS", shortUseCase: "公告事件追蹤與文件索引", endpoint: "/v2/datasets/issuer-announcements" },
  { id: "issuer-profile", name: "issuer-profile", domain: "公司主檔", marketCoverage: "上市櫃公司主檔", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "公司識別、分類與主檔查詢", endpoint: "/v2/datasets/issuer-profile" },
  { id: "corporate-actions-enhanced", name: "corporate-actions-enhanced", domain: "公司事件", marketCoverage: "除權息與公司行動", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "公司行動事件與調整資訊", endpoint: "/v2/datasets/corporate-actions-enhanced" },
  { id: "index-market-context", name: "index-market-context", domain: "市場環境", marketCoverage: "指數市場脈絡", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "指數層級市場脈絡與摘要", endpoint: "/v2/datasets/index-market-context" },
  { id: "interest-rate-snapshot", name: "interest-rate-snapshot", domain: "市場環境", marketCoverage: "利率快照", maturity: "v2", readiness: "available_now", sourceOrigin: "中央銀行 / 公開資料平台", shortUseCase: "折現率與市場環境快照", endpoint: "/v2/datasets/interest-rate-snapshot" },
  { id: "ownership-distribution", name: "ownership-distribution", domain: "持股結構", marketCoverage: "股權分散", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "持股分布與集中度查詢", endpoint: "/v2/datasets/ownership-distribution" },
  { id: "institutional-ownership", name: "institutional-ownership", domain: "持股結構", marketCoverage: "法人持股", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "法人持股比率與變化", endpoint: "/v2/datasets/institutional-ownership" },
  { id: "index-constituents", name: "index-constituents", domain: "市場結構", marketCoverage: "指數成分股", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "指數成分、權重與變化", endpoint: "/v2/datasets/index-constituents" },
  { id: "etf-flow", name: "etf-flow", domain: "資金流", marketCoverage: "ETF 資金流", maturity: "v2", readiness: "available_now", sourceOrigin: "TWSE / TPEx", shortUseCase: "ETF 淨申購贖回與資金流向", endpoint: "/v2/datasets/etf-flow" },
  { id: "derivatives-market", name: "derivatives-market", domain: "衍生性商品", marketCoverage: "期權市場", maturity: "v2", readiness: "available_now", sourceOrigin: "TAIFEX", shortUseCase: "期貨與選擇權主要欄位", endpoint: "/v2/datasets/derivatives-market" },
  { id: "convertible-bonds", name: "convertible-bonds", domain: "債券", marketCoverage: "可轉債", maturity: "v2", readiness: "available_now", sourceOrigin: "公開資訊觀測站 / 交易所", shortUseCase: "可轉債發行與交易欄位", endpoint: "/v2/datasets/convertible-bonds" },
  { id: "events-structured", name: "events-structured", domain: "事件", marketCoverage: "結構化事件", maturity: "v2", readiness: "available_now", sourceOrigin: "多來源事件整合", shortUseCase: "事件標準化與時間序列查詢", endpoint: "/v2/datasets/structured-events" },
  { id: "company-news", name: "company-news", domain: "新聞", marketCoverage: "公司層級新聞", maturity: "v2", readiness: "available_now", sourceOrigin: "公開新聞來源", shortUseCase: "公司事件與新聞流追蹤", endpoint: "/v2/datasets/company-news" },
  { id: "market-news", name: "market-news", domain: "新聞", marketCoverage: "市場層級新聞", maturity: "v2", readiness: "available_now", sourceOrigin: "公開新聞來源", shortUseCase: "市場主題與消息流觀察", endpoint: "/v2/datasets/market-news" },
  { id: "theme-taxonomy", name: "theme-taxonomy", domain: "主題", marketCoverage: "主題分類", maturity: "v2", readiness: "available_now", sourceOrigin: "內部 taxonomy 與公開資料", shortUseCase: "標的主題標籤與分類查詢", endpoint: "/v2/datasets/theme-taxonomy" },
];

export const sourcePolicy = [
  "TWSE / TPEx / MOPS / TAIFEX 優先，official / public-first。",
  "canonical、fallback、helper 角色分離。",
  "FinMind 不是 canonical；twstock 僅 helper；Yahoo 僅 helper/fallback。",
  "lineage / freshness / completeness / auditability 為核心能力。",
];

export const platformCapabilities = [
  {
    title: "資料引擎",
    items: ["台股 canonical 資料層", "26 個可公開販售資料集", "來源分層與可審計"],
  },
  {
    title: "API 產品",
    items: ["REST API", "API 金鑰 / 配額 / 用量", "Quickstart 與文件導流"],
  },
  {
    title: "商業化流程",
    items: ["controlled rollout", "billing preview semantics", "public sellable boundary 已更新為 26"],
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
    features: ["26 sellable-now 資料集", "API 金鑰管理", "標準配額與速率"],
    cta: "開始使用",
  },
  {
    name: "Pro",
    monthly: "NT$6,800",
    yearly: "NT$5,700",
    summary: "團隊產品化與策略研究。",
    features: ["26 sellable-now 資料集完整存取", "較高配額與速率", "帳單與支援（billing preview）"],
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
  { capability: "資料集範圍", developer: "26（available now）", pro: "26（完整）", enterprise: "26 + 客製擴充" },
  { capability: "API 金鑰", developer: "1~2 組", pro: "多組", enterprise: "策略控管" },
  { capability: "配額 / 速率", developer: "標準", pro: "提高", enterprise: "客製" },
  { capability: "帳務模式", developer: "billing preview", pro: "billing preview + 帳單", enterprise: "合約" },
  { capability: "支援", developer: "文件", pro: "Email", enterprise: "專屬通道" },
];

export const creditsReference = [
  { endpoint: "/v2/datasets/twse-daily-price", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/tpex-daily-price", unit: "每 1,000 次", cost: "NT$15" },
  { endpoint: "/v2/datasets/monthly-revenue", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/valuation-data", unit: "每 1,000 次", cost: "NT$18" },
  { endpoint: "/v2/datasets/derivatives-market", unit: "每 1,000 次", cost: "NT$24" },
  { endpoint: "/v2/datasets/convertible-bonds", unit: "每 1,000 次", cost: "NT$22" },
  { endpoint: "/v2/datasets/structured-events", unit: "每 1,000 次", cost: "NT$20" },
  { endpoint: "/v2/datasets/theme-taxonomy", unit: "每 1,000 次", cost: "NT$16" },
];
