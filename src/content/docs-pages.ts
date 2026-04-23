export type DocsSidebarIcon =
  | "book"
  | "rocket"
  | "database"
  | "shield"
  | "braces"
  | "chart"
  | "building"
  | "earnings"
  | "kpi"
  | "metrics"
  | "statements"
  | "insider"
  | "news"
  | "holdings"
  | "rates"
  | "search"
  | "filings"
  | "segments"
  | "prices"
  | "guide"
  | "advanced"
  | "support";

export type DocsContentSection = {
  id: string;
  label: string;
  paragraphs: string[];
  bullets?: string[];
  codeBlocks?: Array<{
    language?: "python" | "javascript" | "curl" | "text";
    code: string;
  }>;
};

export type ApiQueryParameter = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type ApiResponseField = {
  path: string;
  type: string;
  description: string;
};

export type ApiStatusExample = {
  status: "200" | "400" | "401" | "403" | "404";
  description: string;
  body: string;
};

export type ApiCodeExamples = {
  python: string;
  javascript: string;
  curl: string;
};

export type ApiReferenceContent = {
  layoutVariant?: "default" | "data-api-standard";
  categoryLabel: string;
  endpoint: string;
  method: "GET";
  overview: string[];
  requestDescription?: string[];
  useCases: string[];
  gettingStarted: string[];
  exampleRequestCurl: string;
  queryParameters: ApiQueryParameter[];
  responseSummary: string[];
  responseFields: ApiResponseField[];
  notes: string[];
  planRequirement?: {
    title?: string;
    bullets: string[];
  };
  errorCases?: string[];
  sidePanel: {
    requestExample?: string;
    codeExamples?: ApiCodeExamples;
    statusExamples: ApiStatusExample[];
  };
};

export type DocsPageEntry = {
  slug: string[];
  href: string;
  navLabel: string;
  category: "overview" | "api" | "guides" | "advanced" | "support";
  apiSection?: string;
  icon: DocsSidebarIcon;
  title: string;
  subtitle: string;
  sections: DocsContentSection[];
  apiReference?: ApiReferenceContent;
  tier: "complete" | "placeholder";
};

export type DocsSidebarNavItem = {
  title: string;
  href: string;
  icon?: DocsSidebarIcon;
  children?: DocsSidebarNavItem[];
};

export type DocsSidebarNavGroup = {
  id: string;
  label: string;
  items: DocsSidebarNavItem[];
};

const apiSidebarSections: Array<{
  id:
    | "financial-reports"
    | "operating-indicators"
    | "market-prices"
    | "segment-financials"
    | "financial-metrics"
    | "filings"
    | "company-master"
    | "analyst-estimates"
    | "institutional-holdings"
    | "news"
    | "interest-rates"
    | "search";
  label: string;
  icon: DocsSidebarIcon;
}> = [
  { id: "financial-reports", label: "財報數據", icon: "earnings" },
  { id: "operating-indicators", label: "營運指標", icon: "kpi" },
  { id: "market-prices", label: "股價資料", icon: "prices" },
  { id: "segment-financials", label: "分部財務數據", icon: "segments" },
  { id: "financial-metrics", label: "財務指標", icon: "metrics" },
  { id: "filings", label: "公告文件", icon: "filings" },
  { id: "company-master", label: "公司基本資料", icon: "building" },
  { id: "analyst-estimates", label: "分析師預估", icon: "chart" },
  { id: "institutional-holdings", label: "法人持股", icon: "holdings" },
  { id: "news", label: "新聞", icon: "news" },
  { id: "interest-rates", label: "利率", icon: "rates" },
  { id: "search", label: "搜尋", icon: "search" },
];

const apiPlaceholderCatalog: Array<{
  sectionId:
    | "financial-reports"
    | "operating-indicators"
    | "market-prices"
    | "segment-financials"
    | "financial-metrics"
    | "filings"
    | "company-master"
    | "analyst-estimates"
    | "institutional-holdings"
    | "news"
    | "interest-rates"
    | "search";
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  usage: string;
}> = [
  { sectionId: "financial-reports", slug: "company-earnings", navLabel: "公司財報", title: "公司財報", subtitle: "提供單一公司在指定期間的財報重點欄位，用於研究與系統整合。", usage: "財報追蹤、公告後反應分析與策略特徵建模" },
  { sectionId: "financial-reports", slug: "earnings-feed", navLabel: "財報事件流", title: "財報事件流", subtitle: "提供財報事件的時間序列流，用於事件驅動流程與監控。", usage: "事件日曆建立、觸發式策略與資料訂閱流程" },
  { sectionId: "operating-indicators", slug: "metrics", navLabel: "指標數據", title: "指標數據", subtitle: "提供公司營運指標的結構化欄位，補足傳統財報頻率不足。", usage: "營運趨勢追蹤、領先訊號分析與基本面監控" },
  { sectionId: "operating-indicators", slug: "guidance", navLabel: "公司展望", title: "公司展望", subtitle: "整理公司對未來營運的公開展望資訊，支援預期管理分析。", usage: "展望變動追蹤、預估修正與風險評估" },
  { sectionId: "operating-indicators", slug: "non-gaap-metrics", navLabel: "非會計指標", title: "非會計指標", subtitle: "提供非會計口徑指標，作為補充性營運觀察資料。", usage: "口徑補充分析、跨來源校對與指標對照" },
  { sectionId: "market-prices", slug: "historical-prices", navLabel: "歷史股價", title: "歷史股價", subtitle: "提供可回測的歷史行情資料，包含價格與成交量主欄位。", usage: "回測、風險模型與歷史績效分析" },
  { sectionId: "market-prices", slug: "realtime-prices", navLabel: "即時股價", title: "即時股價", subtitle: "提供接近即時的價格快照，用於監控與即時策略流程。", usage: "盤中監控、訊號觸發與即時風控" },
  { sectionId: "market-prices", slug: "company-overview", navLabel: "公司概況", title: "公司概況", subtitle: "提供單一公司的市場概況欄位，支援快速檢視與比對。", usage: "標的初步篩選、主檔查核與投研面板" },
  { sectionId: "market-prices", slug: "market-overview", navLabel: "市場概況", title: "市場概況", subtitle: "提供市場層級的聚合資訊，用於盤勢與結構觀察。", usage: "市場廣度追蹤、盤中概況分析與風險監看" },
  { sectionId: "segment-financials", slug: "segment-income-statement", navLabel: "分部損益表", title: "分部損益表", subtitle: "提供公司分部層級的損益欄位，支援結構化比較。", usage: "分部獲利分析、產品線表現追蹤與結構變化研究" },
  { sectionId: "segment-financials", slug: "segment-balance-sheet", navLabel: "分部資產負債表", title: "分部資產負債表", subtitle: "提供分部層級資產與負債資料，協助資本結構分析。", usage: "分部資本效率評估與風險曝險比較" },
  { sectionId: "segment-financials", slug: "segment-cash-flow", navLabel: "分部現金流量表", title: "分部現金流量表", subtitle: "提供分部現金流資料，補足公司整體現金流分析。", usage: "現金流品質檢查與分部資金運用分析" },
  { sectionId: "segment-financials", slug: "all-segments", navLabel: "全部分部資料", title: "全部分部資料", subtitle: "整合分部財務欄位，提供跨分部的完整檢索入口。", usage: "分部全貌比對、聚合查詢與報表彙整" },
  { sectionId: "financial-metrics", slug: "metrics-snapshot", navLabel: "指標快照", title: "指標快照", subtitle: "提供特定時點的財務指標快照，適合橫截面分析。", usage: "估值篩選、同業比較與即時風險檢查" },
  { sectionId: "financial-metrics", slug: "metrics-history", navLabel: "指標歷史", title: "指標歷史", subtitle: "提供財務指標歷史序列，適合趨勢與變動分析。", usage: "長期趨勢追蹤、回測特徵建立與因子研究" },
  { sectionId: "filings", slug: "company-announcements", navLabel: "公司公告", title: "公司公告", subtitle: "提供公司公告索引與欄位，支援公告查詢與追蹤。", usage: "公告監控、事件索引建立與法說追蹤" },
  { sectionId: "filings", slug: "financial-filings", navLabel: "財報文件", title: "財報文件", subtitle: "提供財報類文件索引與 metadata，便於文件檢索。", usage: "文件下載流程、財報對照與審核留存" },
  { sectionId: "filings", slug: "material-information", navLabel: "重大訊息", title: "重大訊息", subtitle: "提供重大訊息資料，支援事件偵測與風險告警。", usage: "重大事件追蹤、公告分類與異常監控" },
  { sectionId: "company-master", slug: "company-profile", navLabel: "公司基本資料", title: "公司基本資料", subtitle: "提供公司主檔欄位，包含識別、產業與市場分類。", usage: "主檔建立、ticker 對照與資料整合前置" },
  { sectionId: "company-master", slug: "company-classification", navLabel: "公司分類", title: "公司分類", subtitle: "提供公司分類資料，支援產業與主題分群。", usage: "分群建模、投資池管理與篩選條件設定" },
  { sectionId: "analyst-estimates", slug: "estimates", navLabel: "預估數據", title: "預估數據", subtitle: "提供市場預估欄位，支援預期與實際落差分析。", usage: "共識追蹤、預估偏差分析與事件研究" },
  { sectionId: "analyst-estimates", slug: "revision-history", navLabel: "修正歷史", title: "修正歷史", subtitle: "提供預估修正歷史，觀察市場預期變化路徑。", usage: "修正趨勢分析、風險提前偵測與策略觸發" },
  { sectionId: "institutional-holdings", slug: "investor-holdings", navLabel: "投資者持股", title: "投資者持股", subtitle: "提供投資者層級持股資料，支援持股結構分析。", usage: "資金流向觀察、持股集中度分析與風格研究" },
  { sectionId: "institutional-holdings", slug: "single-stock-holdings", navLabel: "個股持股", title: "個股持股", subtitle: "提供個股持股資訊，用於標的層級結構檢視。", usage: "個股法人動態追蹤與持股變化檢測" },
  { sectionId: "news", slug: "company-news", navLabel: "公司新聞", title: "公司新聞", subtitle: "提供公司層級新聞資料，用於事件與情緒分析。", usage: "公司事件追蹤、輿情監控與風險評估" },
  { sectionId: "news", slug: "market-news", navLabel: "市場新聞", title: "市場新聞", subtitle: "提供市場層級新聞資料，輔助總體脈絡判讀。", usage: "市場主題追蹤、訊息分類與宏觀觀察" },
  { sectionId: "interest-rates", slug: "rate-snapshot", navLabel: "利率快照", title: "利率快照", subtitle: "提供當期利率快照，支援估值與風險參數設定。", usage: "折現率設定、當期風險因子補充與報表輸入" },
  { sectionId: "interest-rates", slug: "rate-history", navLabel: "利率歷史", title: "利率歷史", subtitle: "提供歷史利率序列，支援長期回測與敏感度分析。", usage: "歷史風險因子建模、宏觀迴歸與壓力測試" },
  { sectionId: "search", slug: "stock-search", navLabel: "股票搜尋", title: "股票搜尋", subtitle: "提供股票搜尋入口，支援代號與名稱查找。", usage: "前端搜尋、標的定位與查詢前置校正" },
  { sectionId: "search", slug: "filter-screening", navLabel: "條件篩選", title: "條件篩選", subtitle: "提供條件式篩選能力，快速縮小標的範圍。", usage: "研究篩選、候選池建立與策略前置選股" },
];

type ApiPlaceholderItem = (typeof apiPlaceholderCatalog)[number];
type ApiSectionId = ApiPlaceholderItem["sectionId"];

const sectionSourceMap: Record<ApiSectionId, string> = {
  "financial-reports": "MOPS",
  "operating-indicators": "MOPS",
  "market-prices": "TWSE/TPEx",
  "segment-financials": "MOPS",
  "financial-metrics": "TWSE/TPEx",
  filings: "TWSE/TPEx/MOPS",
  "company-master": "TWSE/TPEx",
  "analyst-estimates": "公開資料整合",
  "institutional-holdings": "TWSE/TPEx",
  news: "公開新聞來源",
  "interest-rates": "中央銀行/政府公開資料",
  search: "平台索引",
};

const apiEndpointPathMap: Record<string, string> = {
  "financial-reports/company-earnings": "/v1/financial-reports/company-earnings",
  "financial-reports/earnings-feed": "/v1/financial-reports/earnings-feed",
  "operating-indicators/metrics": "/v1/operating-indicators/metrics",
  "operating-indicators/guidance": "/v1/operating-indicators/guidance",
  "operating-indicators/non-gaap-metrics": "/v1/operating-indicators/non-gaap-metrics",
  "market-prices/historical-prices": "/v1/prices/historical",
  "market-prices/realtime-prices": "/v1/prices/realtime",
  "market-prices/company-overview": "/v1/prices/company-overview",
  "market-prices/market-overview": "/v1/prices/market-overview",
  "segment-financials/segment-income-statement": "/v1/segments/income-statement",
  "segment-financials/segment-balance-sheet": "/v1/segments/balance-sheet",
  "segment-financials/segment-cash-flow": "/v1/segments/cash-flow",
  "segment-financials/all-segments": "/v1/segments/all",
  "financial-metrics/metrics-snapshot": "/v1/financial-metrics/snapshot",
  "financial-metrics/metrics-history": "/v1/financial-metrics/history",
  "filings/company-announcements": "/v1/filings/company-announcements",
  "filings/financial-filings": "/v1/filings/financial-filings",
  "filings/material-information": "/v1/filings/material-information",
  "company-master/company-profile": "/v1/company/profile",
  "company-master/company-classification": "/v1/company/classification",
  "analyst-estimates/estimates": "/v1/analyst-estimates/estimates",
  "analyst-estimates/revision-history": "/v1/analyst-estimates/revision-history",
  "institutional-holdings/investor-holdings": "/v1/institutional-holdings/investor-holdings",
  "institutional-holdings/single-stock-holdings": "/v1/institutional-holdings/single-stock-holdings",
  "news/company-news": "/v1/news/company-news",
  "news/market-news": "/v1/news/market-news",
  "interest-rates/rate-snapshot": "/v1/interest-rates/snapshot",
  "interest-rates/rate-history": "/v1/interest-rates/history",
  "search/stock-search": "/v2/search/stocks",
  "search/filter-screening": "/v2/search/screening",
};

function getApiEndpointPath(item: ApiPlaceholderItem) {
  const key = `${item.sectionId}/${item.slug}`;
  return apiEndpointPathMap[key] ?? `/v1/${item.sectionId}/${item.slug}`;
}

function getApiSampleData(item: ApiPlaceholderItem) {
  const key = `${item.sectionId}/${item.slug}`;
  switch (key) {
    case "financial-reports/company-earnings":
      return [{ ticker: "2330", fiscal_period: "2025Q4", revenue: 868461000000, eps: 13.45, net_income: 346783000000, currency: "TWD" }];
    case "financial-reports/earnings-feed":
      return [{ event_time: "2026-04-21T09:15:00+08:00", ticker: "2330", event_type: "earnings_release", fiscal_period: "2025Q4", status: "published" }];
    case "operating-indicators/metrics":
      return [{ ticker: "2330", period: "2026-03", utilization_rate_pct: 91.2, shipment_wafer_k: 1298, inventory_days: 54 }];
    case "operating-indicators/guidance":
      return [{ ticker: "2330", announcement_date: "2026-04-15", quarter: "2026Q2", revenue_guidance_low: 860000000000, revenue_guidance_high: 900000000000 }];
    case "operating-indicators/non-gaap-metrics":
      return [{ ticker: "2330", period: "2026Q1", adjusted_ebitda: 412700000000, adjusted_margin_pct: 47.5 }];
    case "market-prices/historical-prices":
      return [{ ticker: "2330", date: "2026-04-18", open: 806, high: 815, low: 804, close: 812, volume: 28519324 }];
    case "market-prices/realtime-prices":
      return { ticker: "2330", as_of: "2026-04-21T10:25:00+08:00", last: 813, bid: 812, ask: 813, volume: 10982340 };
    case "market-prices/company-overview":
      return { ticker: "2330", name: "台積電", industry: "半導體", exchange: "TWSE", market: "上市" };
    case "market-prices/market-overview":
      return { date: "2026-04-21", twse_index: 21485.32, tpex_index: 262.11, total_turnover: 358721000000 };
    case "segment-financials/segment-income-statement":
      return [{ ticker: "2317", fiscal_period: "2025Q4", segment: "消費電子", revenue: 1385000000000, operating_income: 96500000000 }];
    case "segment-financials/segment-balance-sheet":
      return [{ ticker: "2317", fiscal_period: "2025Q4", segment: "雲端網通", total_assets: 412300000000, total_liabilities: 229100000000 }];
    case "segment-financials/segment-cash-flow":
      return [{ ticker: "2317", fiscal_period: "2025Q4", segment: "元件", operating_cash_flow: 84500000000, investing_cash_flow: -39200000000 }];
    case "segment-financials/all-segments":
      return [
        { ticker: "2317", fiscal_period: "2025Q4", segment: "消費電子", revenue: 1385000000000 },
        { ticker: "2317", fiscal_period: "2025Q4", segment: "雲端網通", revenue: 426000000000 },
      ];
    case "financial-metrics/metrics-snapshot":
      return { ticker: "2330", date: "2026-04-21", pe: 26.8, pb: 6.2, dividend_yield_pct: 1.9, market_cap: 21053000000000 };
    case "financial-metrics/metrics-history":
      return [{ ticker: "2330", date: "2026-04-21", pe: 26.8, pb: 6.2 }, { ticker: "2330", date: "2026-04-20", pe: 26.5, pb: 6.1 }];
    case "filings/company-announcements":
      return [{ ticker: "2330", announcement_date: "2026-04-20", title: "董事會決議股利分派", source_url: "https://mops.twse.com.tw" }];
    case "filings/financial-filings":
      return [{ ticker: "2330", filing_date: "2026-04-15", report_type: "Q1 財報", doc_id: "mops_2330_2026Q1", source_url: "https://mops.twse.com.tw" }];
    case "filings/material-information":
      return [{ ticker: "2330", event_time: "2026-04-21T08:30:00+08:00", category: "重大訊息", summary: "設備擴產進度更新" }];
    case "company-master/company-profile":
      return { ticker: "2330", name: "台積電", short_name: "TSMC", exchange: "TWSE", listed_market: "上市" };
    case "company-master/company-classification":
      return { ticker: "2330", industry: "半導體", sector: "電子工業", sub_sector: "晶圓代工" };
    case "analyst-estimates/estimates":
      return [{ ticker: "2330", fiscal_year: 2026, eps_estimate: 56.2, revenue_estimate: 3612000000000, analysts_count: 23 }];
    case "analyst-estimates/revision-history":
      return [{ ticker: "2330", revised_at: "2026-04-10", metric: "eps", old_value: 54.8, new_value: 56.2, direction: "up" }];
    case "institutional-holdings/investor-holdings":
      return [{ investor_type: "foreign", date: "2026-04-21", market_value: 12573000000000, holding_ratio_pct: 41.8 }];
    case "institutional-holdings/single-stock-holdings":
      return [{ ticker: "2330", date: "2026-04-21", foreign_holding_pct: 72.3, investment_trust_holding_pct: 2.1, dealer_holding_pct: 0.9 }];
    case "news/company-news":
      return [{ ticker: "2330", published_at: "2026-04-21T07:45:00+08:00", title: "新製程產能規劃更新", source: "工商時報" }];
    case "news/market-news":
      return [{ published_at: "2026-04-21T08:10:00+08:00", topic: "半導體供應鏈", title: "台股早盤焦點整理", source: "經濟日報" }];
    case "interest-rates/rate-snapshot":
      return { date: "2026-04-21", policy_rate_pct: 1.875, overnight_rate_pct: 1.61, source: "中央銀行" };
    case "interest-rates/rate-history":
      return [{ date: "2026-04-21", policy_rate_pct: 1.875 }, { date: "2026-03-21", policy_rate_pct: 1.875 }];
    case "search/stock-search":
      return [{ ticker: "2330", name: "台積電", exchange: "TWSE", industry: "半導體" }];
    case "search/filter-screening":
      return [{ ticker: "2308", name: "台達電", pe: 22.1, market_cap: 1004200000000 }, { ticker: "2454", name: "聯發科", pe: 18.7, market_cap: 1883300000000 }];
    default:
      return [{ ticker: "2330", date: "2026-04-21", value: 1 }];
  }
}

function buildApiQueryParameters(item: ApiPlaceholderItem): ApiQueryParameter[] {
  const key = `${item.sectionId}/${item.slug}`;
  if (key === "search/stock-search") {
    return [
      { name: "query", type: "string", required: true, description: "股票代碼或公司名稱關鍵字。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數上限。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移量。" },
    ];
  }

  if (key === "search/filter-screening") {
    return [
      { name: "sector", type: "string", required: false, description: "產業條件，例如半導體。" },
      { name: "market", type: "string", required: false, description: "市場別，例如 TWSE、TPEx。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數上限。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移量。" },
    ];
  }

  if (item.sectionId === "interest-rates" || key === "market-prices/market-overview" || key === "news/market-news") {
    return [
      { name: "date", type: "string", required: false, description: "指定日期（YYYY-MM-DD）。" },
      { name: "start_date", type: "string", required: false, description: "查詢區間起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢區間結束日期。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數上限。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移量。" },
    ];
  }

  return [
    { name: "ticker", type: "string", required: true, description: "股票代碼，例如 2330。" },
    { name: "date", type: "string", required: false, description: "指定日期（YYYY-MM-DD）。" },
    { name: "start_date", type: "string", required: false, description: "查詢區間起始日期。" },
    { name: "end_date", type: "string", required: false, description: "查詢區間結束日期。" },
    { name: "limit", type: "integer", required: false, description: "回傳筆數上限。" },
    { name: "offset", type: "integer", required: false, description: "分頁偏移量。" },
  ];
}

function buildApiResponseFields(item: ApiPlaceholderItem): ApiResponseField[] {
  const shared: ApiResponseField[] = [
    { path: "dataset", type: "string", description: "資料集識別名稱。" },
    { path: "source_role", type: "string", description: "來源角色（canonical / fallback / helper）。" },
    { path: "freshness", type: "string", description: "資料時效與更新節點。" },
    { path: "lineage.trace_id", type: "string", description: "追蹤識別，用於審計與排查。" },
    { path: "data", type: "array | object", description: "實際資料內容。" },
  ];

  if (item.sectionId === "company-master") {
    return [...shared, { path: "data.ticker", type: "string", description: "股票代碼。" }, { path: "data.name", type: "string", description: "公司名稱。" }, { path: "data.industry", type: "string", description: "產業分類。" }, { path: "data.exchange", type: "string", description: "交易所。" }];
  }

  if (item.sectionId === "market-prices") {
    return [...shared, { path: "data[].ticker", type: "string", description: "股票代碼。" }, { path: "data[].date", type: "string", description: "交易日期。" }, { path: "data[].close", type: "number", description: "收盤價。" }, { path: "data[].volume", type: "integer", description: "成交量。" }];
  }

  if (item.sectionId === "financial-reports" || item.sectionId === "segment-financials") {
    return [...shared, { path: "data[].ticker", type: "string", description: "股票代碼。" }, { path: "data[].fiscal_period", type: "string", description: "財報期間。" }, { path: "data[].revenue", type: "number", description: "營收欄位。" }, { path: "data[].net_income", type: "number", description: "淨利或對應核心損益欄位。" }];
  }

  if (item.sectionId === "filings") {
    return [...shared, { path: "data[].ticker", type: "string", description: "股票代碼。" }, { path: "data[].announcement_date", type: "string", description: "公告日期。" }, { path: "data[].title", type: "string", description: "公告或文件標題。" }, { path: "data[].source_url", type: "string", description: "原始來源連結。" }];
  }

  return [...shared, { path: "data[].ticker", type: "string", description: "股票代碼或識別鍵。" }, { path: "data[].date", type: "string", description: "資料日期。" }, { path: "data[].value", type: "number | string", description: "主要數值欄位。" }];
}

function buildApiCodeExamples(item: ApiPlaceholderItem): ApiCodeExamples {
  const endpoint = getApiEndpointPath(item);
  const requiresTicker = buildApiQueryParameters(item).some((parameter) => parameter.name === "ticker" && parameter.required);
  const query = requiresTicker ? "ticker=2330&limit=10" : "limit=10";
  const url = `https://api.twmarketdata.com${endpoint}?${query}`;

  return {
    python: `import requests\n\nheaders = {\"X-API-Key\": \"your_api_key_here\"}\nresponse = requests.get(\"${url}\", headers=headers)\nprint(response.json())`,
    javascript: `const response = await fetch(\"${url}\", {\n  headers: {\n    \"X-API-Key\": \"your_api_key_here\"\n  }\n});\n\nconst data = await response.json();\nconsole.log(data);`,
    curl: `curl -X GET \"${url}\" \\\n  -H \"X-API-Key: your_api_key_here\"`,
  };
}

function buildApiStatusExamples(item: ApiPlaceholderItem): ApiStatusExample[] {
  const key = `${item.sectionId}/${item.slug}`;
  const dataset = item.slug.replace(/-/g, "_");
  const source = sectionSourceMap[item.sectionId];
  const sample = getApiSampleData(item);
  const traceId = `${dataset}_2330_20260421`;
  const hasTicker = buildApiQueryParameters(item).some((parameter) => parameter.name === "ticker" && parameter.required);

  const successBody = JSON.stringify(
    {
      dataset,
      source_role: "canonical",
      freshness: "2026-04-21T10:30:00+08:00",
      lineage: {
        source,
        ingested_at: "2026-04-21T10:30:02+08:00",
        trace_id: traceId,
      },
      data: sample,
    },
    null,
    2,
  );

  return [
    {
      status: "200",
      description: "成功回傳資料。",
      body: successBody,
    },
    {
      status: "400",
      description: "參數格式錯誤或查詢條件不合法。",
      body: JSON.stringify(
        {
          error: {
            code: "BAD_REQUEST",
            message: hasTicker ? "ticker 格式錯誤，請使用交易所股票代碼。" : "查詢參數格式錯誤。",
          },
        },
        null,
        2,
      ),
    },
    {
      status: "401",
      description: "未提供 API key 或驗證失敗。",
      body: JSON.stringify(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "缺少有效的 X-API-Key。",
          },
        },
        null,
        2,
      ),
    },
    {
      status: "404",
      description: "查無資料或 ticker 不存在。",
      body: JSON.stringify(
        {
          dataset,
          source_role: "canonical",
          data: [],
          message: key === "search/stock-search" ? "查無符合條件的股票。" : "查無符合條件的資料。",
        },
        null,
        2,
      ),
    },
  ];
}

function buildApiReference(item: ApiPlaceholderItem): ApiReferenceContent {
  const sectionLabel = apiSidebarSections.find((section) => section.id === item.sectionId)?.label ?? "API";
  const endpoint = getApiEndpointPath(item);
  const codeExamples = buildApiCodeExamples(item);
  const statusExamples = buildApiStatusExamples(item);

  return {
    categoryLabel: sectionLabel,
    endpoint,
    method: "GET",
    overview: [
      item.subtitle,
      "此 endpoint 提供穩定的契約格式，可直接整合至資料管線、回測系統與自動化流程。",
    ],
    useCases: [
      item.usage,
      "建立單一來源的資料查詢層，降低跨來源整合成本。",
      "在研究與生產環境共用同一組 request / response 契約。",
    ],
    gettingStarted: [
      "在 header 放入 X-API-Key。",
      "先以單一 ticker 或小範圍條件驗證回應格式。",
      "確認欄位後再擴展至批次查詢與分頁流程。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: buildApiQueryParameters(item),
    responseSummary: [
      "回應採統一 envelope，固定包含 dataset、source_role、freshness、lineage、data。",
      "data 欄位會依 endpoint 性質回傳陣列或單一物件，但欄位命名與型別維持穩定。",
    ],
    responseFields: buildApiResponseFields(item),
    notes: [
      "建議使用 ticker 作為 join key，避免以名稱匹配造成錯配。",
      "批次查詢請使用 limit / offset，避免單次大量請求超出 rate limit。",
      "整合多 endpoint 時，請保留 source_role 與 lineage 以便驗證與排錯。",
    ],
    errorCases: [
      "ticker 不存在時，回應 data 可能為空陣列。",
      "資料尚未更新時，請依 freshness 判斷是否需要延後重試。",
      "canonical 暫不可用時，可能出現 fallback source_role。",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples,
    },
  };
}

const apiDocsPages: DocsPageEntry[] = apiPlaceholderCatalog.map((item) => {
  const sectionMeta = apiSidebarSections.find((section) => section.id === item.sectionId);

  return {
    slug: ["api", item.sectionId, item.slug],
    href: `/docs/api/${item.sectionId}/${item.slug}`,
    navLabel: item.navLabel,
    category: "api",
    apiSection: item.sectionId,
    icon: sectionMeta?.icon ?? "database",
    title: item.title,
    subtitle: item.subtitle,
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "request", label: "Request", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "field-reference", label: "Field", paragraphs: [] },
      { id: "best-practices", label: "Best Practices", paragraphs: [] },
      { id: "error-boundaries", label: "Errors", paragraphs: [] },
    ],
    apiReference: buildApiReference(item),
  };
});

const apiCategoryPages: DocsPageEntry[] = apiSidebarSections.map((section) => ({
  slug: ["api", section.id],
  href: `/docs/api/${section.id}`,
  navLabel: section.label,
  category: "api",
  apiSection: section.id,
  icon: section.icon,
  title: section.label,
  subtitle: `此頁整理「${section.label}」分類下的 API 能力，作為子資料集文件的入口。`,
  tier: "placeholder",
  sections: [
    {
      id: "category-overview",
      label: "分類說明",
      paragraphs: [
        `${section.label}分類提供台股資料產品的主題化入口，便於依使用情境選擇對應 endpoint。`,
      ],
    },
    {
      id: "integration-order",
      label: "使用建議",
      paragraphs: [
        "建議先確認此分類下的資料口徑與更新節奏，再選擇子項進行查詢實作。",
        "若流程需跨分類整合，請先建立欄位映射與資料時間對齊規則。",
      ],
    },
    {
      id: "next-step",
      label: "下一步",
      paragraphs: [
        "可從左側展開分類，進入子項文件頁查看欄位、參數與回應格式。",
      ],
    },
  ],
}));

const baseDocsPages: DocsPageEntry[] = [
  {
    slug: ["introduction"],
    href: "/docs/introduction",
    navLabel: "介紹",
    category: "overview",
    icon: "book",
    title: "台股資料 API 文件",
    subtitle: "台股市場的資料基礎設施，面向程式化存取與自動化系統設計。",
    tier: "complete",
    sections: [
      {
        id: "platform-overview",
        label: "平台說明",
        paragraphs: [
          "這是一個台股決策資料平台文件入口，面向研究、量化與自動化系統。",
          "平台採官方來源優先（TWSE / TPEx / MOPS），資料經結構化處理後透過 API 對外提供。",
          "每筆回應保留 source_role 與 lineage，支援可追溯驗證與治理流程。",
        ],
      },
      {
        id: "docs-portals",
        label: "文件入口",
        paragraphs: ["文件導覽分為四個主要入口："],
        bullets: [
          "Getting Started：平台介紹、快速開始、認證方式、API 模型、來源政策、資料更新與 lineage",
          "Data APIs：依資料主題分類的正式 API 文件（公司、財務、市場、籌碼、量化、分類、查詢工具）",
          "Workflows / Use Cases：任務導向流程，聚焦 5 個核心情境，避免零碎教學頁干擾",
          "Coming Soon：規劃中主題清單，明確區分尚未開放能力",
        ],
      },
      {
        id: "workflow-highlights",
        label: "Workflows / Use Cases（5 個核心情境）",
        paragraphs: ["文件站目前保留以下 5 個任務導向工作流入口："],
        bullets: [
          "查公司基本面（issuer_profile + financial_metrics + valuation_data）",
          "看籌碼（institutional_flow + margin_short）",
          "看市場狀態（index_data + market_breadth）",
          "快速查資料（search + query + explainability）",
          "做策略 / AI（features + factor_data + time_alignment）",
        ],
      },
      {
        id: "core-differentiators",
        label: "核心差異化能力",
        paragraphs: ["平台差異化能力集中在查詢層與可解釋性："],
        bullets: [
          "Search API：快速定位股票與資料主題，降低查詢前置成本",
          "Query API：欄位與條件式查詢入口，支援批次與流程化查詢",
          "Explainability：提供來源與公式解釋，便於驗證、審計與策略回顧",
          "official-first + source_role + lineage：確保資料來源透明與治理一致性",
        ],
      },
      {
        id: "data-coverage",
        label: "可取得資料摘要",
        paragraphs: ["目前可用能力依下列主題分組："],
        bullets: [
          "公司與事件：公司主檔、公告、事件、公司行動、股利",
          "財務與成長：財報指標、月營收、估值",
          "市場與價格：股價、技術指標、指數、市場廣度、利率",
          "籌碼與資金：法人買賣、融資融券",
          "策略與量化：features、factor_data、time_alignment、screener",
          "分類與結構：公司分類、指數分類",
          "查詢與工具：/v2/search、/v2/query、explainability layer",
        ],
      },
      {
        id: "target-users",
        label: "適用對象",
        paragraphs: [],
        bullets: [
          "研究者與資料分析團隊",
          "量化開發者與策略研究流程",
          "SaaS / workflow builders",
          "AI agent 與 automation use cases",
        ],
      },
      {
        id: "design-principles",
        label: "設計原則",
        paragraphs: [],
        bullets: [
          "官方來源優先：以交易所與官方揭露資料為核心來源",
          "一致的資料結構：所有 API 採統一 schema 設計",
          "可追溯性（lineage）：每筆資料保留來源與處理流程",
          "資料角色分層：明確區分 canonical / fallback / helper",
          "面向機器設計：優先支援程式化存取與自動化流程",
        ],
      },
    ],
  },
  {
    slug: ["quick-start"],
    href: "/docs/quick-start",
    navLabel: "快速開始",
    category: "overview",
    icon: "rocket",
    title: "Quick Start",
    subtitle: "在 2 分鐘內完成第一個台股資料 API 呼叫。建立帳號、取得 API key，並驗證第一筆回應。",
    tier: "complete",
    sections: [
      {
        id: "create-account",
        label: "1. 建立帳號",
        paragraphs: ["註冊帳號後，在 dashboard 取得 API key。"],
      },
      {
        id: "first-request",
        label: "2. 發送第一個請求",
        paragraphs: ["每個 API request 需要："],
        bullets: [
          "API key（放在 X-API-Key header）",
          "ticker（股票代碼，例如 2330）",
        ],
      },
      {
        id: "explore-more",
        label: "3. Explore More",
        paragraphs: ["延伸查詢常用資料主題，確認欄位與更新節奏。"],
      },
      {
        id: "whats-next",
        label: "4. What's Next",
        paragraphs: ["從常用文件入口繼續完成整合流程。"],
      },
    ],
  },
  {
    slug: ["data-access"],
    href: "/docs/data-access",
    navLabel: "資料存取",
    category: "overview",
    icon: "database",
    title: "資料存取",
    subtitle:
      "所有資料透過一致的 REST API 提供，設計重點在於穩定性、可預測性與可組合性。每一個 endpoint 都遵循相同的回應結構與欄位命名規則，讓資料可以直接接入研究流程、策略系統與自動化 agent。",
    tier: "complete",
    sections: [
      {
        id: "dataset-categories",
        label: "資料主題分類",
        paragraphs: [
          "平台的目標不是提供一次性的資料查詢，而是建立一個可以長期維運的資料層。當你的系統需要跨資料主題整合、回測、或進入 production 環境時，資料存取方式必須保持一致且可追溯。",
          "資料依照主題（dataset）進行組織，每個主題對應一組 API endpoints。不同主題之間共用相同的 request / response 結構，避免在整合時需要針對每個資料來源做客製解析。",
          "目前主要資料主題包括：",
        ],
        bullets: [
          "行情資料：即時與歷史價格、成交資訊與市場指標",
          "財報資料：損益表、資產負債表與現金流量表",
          "營運資料：月營收與公司揭露的營運數據",
          "公司基本資料：公司資訊、產業分類與基礎識別資料",
          "公司事件：公告、重大訊息與事件型資料",
          "籌碼與資金流向：法人資金流與市場資金動向",
          "利率與總體資料：利率快照與部分總體指標",
        ],
      },
      {
        id: "endpoint-pattern",
        label: "endpoint 使用模式",
        paragraphs: [
          "每個 dataset 都可以獨立查詢，也可以在同一個流程中組合使用。這樣的設計可以降低跨資料整合的成本，並避免資料結構不一致帶來的風險。",
          "API 設計偏向可組合，而不是高度封裝的單一功能接口。建議的使用方式如下：",
        ],
        bullets: [
          "先以單一 ticker 與短時間範圍進行驗證，確認欄位與回應結構符合預期後，再擴大查詢範圍",
          "將不同 dataset 的查詢拆成多個 request，在應用層做整合，而不是依賴單一複雜 endpoint",
          "對於大規模資料需求，使用分批查詢（batch）與適當的速率控制，避免觸發限制",
          "避免把 API 當作資料庫查詢語言；API 的設計是資料傳輸層，而不是即時分析引擎",
        ],
      },
      {
        id: "response-structure",
        label: "一致的回應結構",
        paragraphs: [
          "所有 API 回應都遵循同一個結構，讓資料可以被統一處理：",
          "這個設計讓你可以在 parser 或資料處理層先統一處理 metadata（dataset、freshness、lineage），再針對 data 欄位做具體解析。當系統規模擴大時，這種分層會大幅降低維護成本。",
        ],
        bullets: [
          "dataset：資料集識別名稱",
          "source_role：資料來源角色（canonical / fallback / helper）",
          "freshness：資料更新時間或有效時間",
          "lineage：資料來源與處理流程資訊（可用於追溯）",
          "data：實際資料內容",
        ],
      },
      {
        id: "query-expansion-strategy",
        label: "查詢與擴展策略",
        paragraphs: [
          "當資料需求從單一查詢成長為系統級使用時，建議採用以下策略：",
          "這些策略能讓 API 從「查資料工具」升級為「資料基礎設施」。",
        ],
        bullets: [
          "建立中間層（data access layer），將 API 呼叫集中管理，而不是散落在不同服務中",
          "統一 ticker 與時間格式，避免不同資料源使用不同 key 導致錯誤匹配",
          "對常用查詢做快取（cache），降低重複請求與速率壓力",
          "將長期資料（如歷史價格、財報）落地；API 適合做資料同步，不適合每次即時查詢",
          "對重要流程加入資料版本與時間標記，確保回測與實際交易使用相同資料狀態",
        ],
      },
      {
        id: "error-handling-limits",
        label: "錯誤處理與限制",
        paragraphs: [
          "在實務使用中，最常見的問題來自於速率限制與資料邊界。",
          "建議在系統中對不同錯誤類型做分類處理，對 rate limit 加入 retry 或 backoff 機制，並對關鍵流程加上監控與警示。",
        ],
        bullets: [
          "請求過於頻繁：會觸發 rate limit，需要調整節奏或分批處理",
          "查詢範圍過大：可能導致回應時間增加或資料不完整",
          "使用未授權的 dataset：不同方案可用資料範圍不同",
          "資料尚未更新：freshness 欄位應作為判斷依據，而不是假設資料即時",
        ],
      },
      {
        id: "practical-guidance",
        label: "實務建議",
        paragraphs: [
          "在開發初期，可以直接從 API 讀取資料進行實驗。但當進入穩定運行階段，建議將資料存取納入整體系統設計。",
          "當資料存取被正確設計後，後續的策略開發、分析與產品化會變得更穩定。",
        ],
        bullets: [
          "將 API 當作資料來源，而不是最終資料存放位置",
          "為不同用途建立明確的資料流（research / backtest / production）",
          "保留 lineage 與 freshness，用於驗證與排錯",
          "避免在 production 流程中依賴不可預測的即時查詢",
        ],
      },
    ],
  },
  {
    slug: ["source-policy"],
    href: "/docs/source-policy",
    navLabel: "來源政策",
    category: "overview",
    icon: "shield",
    title: "來源政策",
    subtitle: "以官方來源為核心的台股資料體系，提供完整可追溯（provenance）的資料鏈路。",
    tier: "complete",
    sections: [
      {
        id: "official-public-first",
        label: "來源政策說明",
        paragraphs: [
          "本平台以交易所與官方揭露系統為主要資料來源，包含 TWSE、TPEx 與公開資訊觀測站（MOPS）。所有資料皆由系統直接擷取、解析與結構化處理，建立從原始揭露到 API 回傳的完整資料路徑。",
          "對於市場行情等即時資料，平台會採用經過驗證的資料來源，並明確標示來源角色（source_role），確保使用者清楚了解資料來源與信任層級。",
          "本頁說明各類資料的來源與處理方式，以及資料如何從原始來源進入 API。",
        ],
      },
      {
        id: "why-transparency-matters",
        label: "為什麼來源透明很重要",
        paragraphs: [
          "在量化研究、策略回測與交易系統中，資料的可追溯性是必要條件。",
          "當模型輸出或交易決策需要驗證時，必須能夠追溯每一筆資料的來源與處理過程。",
          "本平台透過明確的來源政策與 lineage 記錄，降低上述風險，使資料可驗證、可審計。",
        ],
        bullets: [
          "無法確認資料是否來自官方或二手來源",
          "無法評估資料延遲（latency）",
          "無法定位錯誤來源（來源錯誤或解析錯誤）",
          "不同資料之間存在不一致",
        ],
      },
      {
        id: "source-roles",
        label: "資料來源分類",
        paragraphs: [
          "平台資料依來源與信任等級分為三種角色：",
          "所有 API 回傳皆包含 source_role，方便使用者在系統中做資料選擇與風控。",
        ],
        bullets: [
          "canonical：官方來源或最接近原始來源的資料，優先使用",
          "fallback：當 canonical 不可用時的替代來源",
          "helper：輔助性資料，用於補充或提升可用性，不作為唯一依據",
        ],
      },
      {
        id: "primary-sources",
        label: "主要資料來源",
        paragraphs: ["財報與基本面資料：所有財報資料（損益表、資產負債表、現金流量表）皆來自公開資訊觀測站（MOPS）與交易所揭露系統。平台會解析原始申報內容，並統一欄位結構與命名，使不同公司與期間資料可直接比較。"],
        bullets: [
          "來源：公開資訊觀測站（MOPS）",
          "來源：TWSE / TPEx 公司揭露系統",
        ],
      },
      {
        id: "filings-source",
        label: "公告與申報文件",
        paragraphs: ["重大訊息、公告與公司申報文件直接來自交易所與 MOPS 系統。平台提供文件 metadata 與結構化欄位，並保留原始來源連結。"],
        bullets: [
          "來源：TWSE",
          "來源：TPEx",
          "來源：MOPS",
        ],
      },
      {
        id: "operations-source",
        label: "營運與公司揭露資料",
        paragraphs: ["公司揭露之營運數據（如營收、業務指標）來自官方公告與申報資料。"],
        bullets: [
          "來源：MOPS",
          "來源：公司公開揭露文件",
        ],
      },
      {
        id: "holdings-source",
        label: "法人與持股資料",
        paragraphs: ["法人持股與相關統計資料來自交易所與公開揭露系統。"],
        bullets: [
          "來源：TWSE",
          "來源：TPEx",
        ],
      },
      {
        id: "market-source",
        label: "股價與市場資料",
        paragraphs: ["股價資料來自交易所或經驗證之市場資料來源。包含開盤價、最高價、最低價、收盤價與成交資訊。"],
        bullets: [
          "來源：TWSE / TPEx",
          "來源：經驗證之市場資料供應來源（若適用）",
        ],
      },
      {
        id: "macro-source",
        label: "總體與利率資料",
        paragraphs: ["利率與總體經濟資料來自官方或公開發布之政策與統計資料。"],
        bullets: [
          "來源：中央銀行",
          "來源：政府公開資料平台",
        ],
      },
      {
        id: "lineage",
        label: "lineage（資料血統）",
        paragraphs: ["每筆資料皆附帶 lineage 記錄，用於描述：", "lineage 可用於："],
        bullets: [
          "原始來源（source）",
          "擷取時間（ingestion time）",
          "處理流程（processing steps）",
          "最終輸出時間（as_of_date）",
          "驗證資料來源",
          "排查資料異常",
          "評估資料延遲",
        ],
      },
      {
        id: "provenance-guarantees",
        label: "來源保證（Provenance Guarantees）",
        paragraphs: ["平台對資料來源提供以下保證：", "本來源政策確保資料在研究、分析與交易場景中具備可驗證性與一致性。"],
        bullets: [
          "完整可追溯：每筆資料可追溯至明確來源",
          "官方來源優先：優先使用 TWSE / TPEx / MOPS 等官方資料",
          "明確來源角色：所有資料標示 canonical / fallback / helper",
          "可量測延遲：ingestion 與更新時間可被追蹤",
          "單一責任：資料處理由平台負責，問題可定位與修正",
        ],
      },
    ],
  },
  {
    slug: ["api-model"],
    href: "/docs/api-model",
    navLabel: "API 模型",
    category: "overview",
    icon: "braces",
    title: "API 模型",
    subtitle: "維持一致 schema 與可預測欄位，降低整合成本。",
    tier: "complete",
    sections: [
      {
        id: "resource-design",
        label: "resource-oriented 設計",
        paragraphs: [
          "API 以資源為中心命名與分組，讓端點目的清楚、行為可預測。",
          "不同資料主題的差異主要位於 data 內容，而非回應外層框架。",
        ],
      },
      {
        id: "top-level-fields",
        label: "常見頂層欄位",
        paragraphs: ["多數回應會包含 dataset、source_role、freshness、lineage、data。"],
        bullets: [
          "dataset：資料主題識別",
          "source_role：來源角色",
          "freshness：時效資訊",
          "lineage：來源追蹤資訊",
          "data：實際資料內容",
        ],
      },
      {
        id: "data-shapes",
        label: "data 欄位型態",
        paragraphs: [
          "data 可能是陣列或單一物件，取決於資源與查詢條件。",
          "建議 parser 先判斷型態，再進入欄位映射，避免固定假設造成解析錯誤。",
        ],
      },
      {
        id: "metadata-traceability",
        label: "metadata 與 traceability",
        paragraphs: [
          "metadata 提供審計與治理所需上下文，應與 data 一起保存。",
          "對於需要重現結果的流程，trace_id、ingested_at 與來源文件識別是關鍵欄位。",
        ],
      },
      {
        id: "error-response",
        label: "錯誤回應格式",
        paragraphs: [
          "錯誤回應維持固定模型，包含錯誤代碼、訊息與可判斷的處理方向。",
          "建議對 4xx、5xx 分別設計重試與告警策略，不要用同一條重試邏輯。",
        ],
      },
    ],
  },
  ...apiCategoryPages,
  ...apiDocsPages,
  {
    slug: ["api", "analyst-estimates"],
    href: "/docs/api/analyst-estimates",
    navLabel: "分析師預估",
    category: "api",
    icon: "chart",
    title: "分析師預估",
    subtitle: "提供市場對營收、獲利與關鍵指標的預估資料。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "分析師預估",
      method: "GET",
      endpoint: "/v1/analyst-estimates",
      overview: [
        "此 endpoint 回傳特定公司在指定期間的預估值與共識統計，常見指標包含 EPS、營收與毛利率。",
        "回應會保留預估更新時間與來源追蹤欄位，便於建立 revision 與 surprise 分析流程。",
      ],
      useCases: [
        "比較公司實際財報與市場共識差異。",
        "追蹤預估修正方向，建立事件前後預期變動序列。",
        "搭配價格與財報資料建立預估偏差因子。",
      ],
      gettingStarted: [
        "在 request header 帶入 X-API-Key: your_api_key_here。",
        "至少提供 ticker；若要控制資料範圍可加 period 或 latest。",
        "先以單一公司驗證欄位，再擴展批次查詢。",
      ],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v1/analyst-estimates" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "latest=true"`,
      queryParameters: [
        { name: "ticker", type: "string", required: true, description: "公司代號，例如 2330。" },
        { name: "period", type: "string", required: false, description: "目標財報期間，例如 2025-Q4。" },
        { name: "latest", type: "boolean", required: false, description: "true 時僅回傳最新可用預估。預設 false。" },
      ],
      responseSummary: [
        "回應 data 為預估紀錄陣列，單筆通常對應某一期間、某一指標的共識與分布資訊。",
        "若部分欄位尚未揭露，可能回傳 null，建議在下游模型中顯式處理。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 analyst_estimates。" },
        { path: "source_role", type: "string", description: "來源角色：canonical、fallback 或 helper。" },
        { path: "lineage.provider", type: "string", description: "來源提供者識別。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].fiscal_period", type: "string", description: "預估對應財務期間。" },
        { path: "data[].estimate_metric", type: "string", description: "預估指標名稱。" },
        { path: "data[].consensus_mean", type: "number", description: "共識平均值。" },
      ],
      notes: [
        "預估值會隨時間修正，回測時請固定查詢時間點，避免回看偏差。",
        "不同來源對指標口徑可能不同，建議建立 metric mapping 後再比較。",
      ],
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v1/analyst-estimates" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "period=2025-Q4"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳預估資料",
            body: `{
  "dataset": "analyst_estimates",
  "source_role": "canonical",
  "lineage": { "provider": "market_consensus", "trace_id": "ae_2330_2025q4" },
  "data": [
    {
      "ticker": "2330",
      "fiscal_period": "2025-Q4",
      "estimate_metric": "eps",
      "consensus_mean": 13.2,
      "consensus_std": 0.6,
      "revision_at": "2026-01-10T09:20:00+08:00"
    }
  ]
}`,
          },
          { status: "400", description: "缺少必要參數 ticker", body: `{"error":{"code":"invalid_request","message":"ticker is required"}}` },
          { status: "401", description: "API key 無效或缺失", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無對應資料", body: `{"error":{"code":"not_found","message":"no analyst estimates found"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "company-profile"],
    href: "/docs/api/company-profile",
    navLabel: "公司基本資料",
    category: "api",
    icon: "building",
    title: "公司基本資料",
    subtitle: "提供公司識別、上市櫃別、產業分類與交易所資訊。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "公司主檔",
      method: "GET",
      endpoint: "/v2/datasets/company-profile",
      overview: [
        "此 endpoint 提供公司識別主檔，包含 ticker、公司名稱、上市櫃別、交易所與產業分類。",
        "資料適合作為所有查詢流程的基礎維度，先建立主檔可降低後續 join 錯誤。",
      ],
      useCases: [
        "建立 ticker 與公司名稱對照表。",
        "做市場別與產業別分群分析。",
        "在批次流程中過濾停牌、下市或狀態異常標的。",
      ],
      gettingStarted: [
        "帶入 API key 與 ticker 後即可查詢單一公司主檔。",
        "若需要搜尋用途，可在 query 帶入公司名關鍵字。",
      ],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v2/datasets/company-profile" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330"`,
      queryParameters: [
        { name: "ticker", type: "string", required: false, description: "公司代號。與 query 至少擇一。" },
        { name: "query", type: "string", required: false, description: "公司名稱或代號關鍵字。" },
        { name: "market", type: "string", required: false, description: "市場別篩選，例如 TWSE、TPEx。" },
      ],
      responseSummary: [
        "回應 data 可為單一物件或清單，取決於查詢條件是否為精確 ticker。",
        "來源資訊會保留於 lineage，以供主檔同步與審計流程使用。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 company_profile。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].company_name", type: "string", description: "公司名稱。" },
        { path: "data[].exchange", type: "string", description: "交易所識別。" },
        { path: "data[].market_type", type: "string", description: "上市櫃別或市場板塊。" },
        { path: "data[].industry", type: "string", description: "產業分類。" },
        { path: "data[].status", type: "string", description: "公司狀態（正常、停牌、下市等）。" },
      ],
      notes: [
        "公司狀態與分類可能異動，建議定期同步主檔而非僅在初始化時查詢一次。",
        "跨來源合併時請固定使用同一識別鍵與生效日期規則。",
      ],
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v2/datasets/company-profile" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "query=台積電"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳公司主檔",
            body: `{
  "dataset": "company_profile",
  "source_role": "canonical",
  "data": [
    {
      "ticker": "2330",
      "company_name": "台灣積體電路製造股份有限公司",
      "exchange": "TWSE",
      "market_type": "上市",
      "industry": "半導體",
      "status": "active"
    }
  ]
}`,
          },
          { status: "400", description: "ticker 與 query 皆未提供", body: `{"error":{"code":"invalid_request","message":"ticker or query is required"}}` },
          { status: "401", description: "認證失敗", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無公司資料", body: `{"error":{"code":"not_found","message":"company profile not found"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "earnings"],
    href: "/docs/api/earnings",
    navLabel: "財報（Earnings）",
    category: "api",
    icon: "earnings",
    title: "財報（Earnings）",
    subtitle: "提供季度與年度財報結果與發佈節點資訊。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "財報",
      method: "GET",
      endpoint: "/v1/earnings",
      overview: [
        "此 endpoint 提供公司季度或年度財報快照，包含營收、EPS、淨利、毛利與營業利益等核心欄位。",
        "資料會依公告節點逐步補齊，初步揭露與完整財報欄位可能存在差異。",
      ],
      useCases: [
        "建立財報事件日歷，追蹤公告前後價格反應。",
        "比較市場共識與實際公告值，評估 surprise 影響。",
        "搭配財報三大表與股價資料建立基本面策略。",
      ],
      gettingStarted: [
        "在 request header 帶入 X-API-Key: your_api_key_here。",
        "至少提供 ticker，必要時再加 period 或 latest 控制回傳範圍。",
        "先以單一公司驗證欄位，再擴展至批次查詢流程。",
      ],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v1/earnings" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "latest=true"`,
      queryParameters: [
        { name: "ticker", type: "string", required: true, description: "公司代號，例如 2330。" },
        { name: "period", type: "string", required: false, description: "財報期間，例如 2025-Q4 或 2025。" },
        { name: "report_type", type: "string", required: false, description: "quarterly 或 annual；未提供時由系統依資料可用性回傳。" },
        { name: "latest", type: "boolean", required: false, description: "true 時僅回傳最新一期。" },
      ],
      responseSummary: [
        "回應 data 為財報紀錄陣列，單筆資料對應一個公司與一個財報期間。",
        "若欄位尚未在初次公告揭露，可能回傳 null，後續更新會反映在 lineage 與 freshness。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 earnings。" },
        { path: "source_role", type: "string", description: "來源角色標記（canonical、fallback、helper）。" },
        { path: "lineage.provider", type: "string", description: "資料來源提供者識別。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].fiscal_period", type: "string", description: "財報期間，例如 2025-Q4。" },
        { path: "data[].announcement_date", type: "string", description: "公告日期。" },
        { path: "data[].revenue", type: "number|null", description: "營收欄位；部分初步公告可能缺值。" },
        { path: "data[].eps", type: "number|null", description: "每股盈餘。" },
        { path: "data[].net_income", type: "number|null", description: "淨利。" },
        { path: "data[].eps_surprise_pct", type: "number|null", description: "實際值相對共識差異百分比。" },
      ],
      notes: [
        "初步公告通常先揭露主欄位，完整欄位會在後續正式揭露補齊。",
        "若用於回測，請固定查詢時間點並保存當時回應，避免回看偏差。",
        "建議搭配 /v1/financial-statements 與 /v1/prices 建立完整事件分析流程。",
      ],
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v1/earnings" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "period=2025-Q4"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳財報資料",
            body: `{
  "dataset": "earnings",
  "source_role": "canonical",
  "lineage": {
    "provider": "MOPS",
    "trace_id": "earnings_2330_2025q4"
  },
  "data": [
    {
      "ticker": "2330",
      "fiscal_period": "2025-Q4",
      "report_type": "quarterly",
      "announcement_date": "2026-02-14",
      "revenue": 868461000000,
      "gross_profit": 466512000000,
      "operating_income": 382146000000,
      "net_income": 346783000000,
      "eps": 13.37,
      "eps_surprise_pct": 2.8
    }
  ]
}`,
          },
          { status: "400", description: "參數格式錯誤", body: `{"error":{"code":"invalid_request","message":"period format is invalid"}}` },
          { status: "401", description: "認證失敗", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無對應財報", body: `{"error":{"code":"not_found","message":"earnings data not found"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "kpi-metrics"],
    href: "/docs/api/kpi-metrics",
    navLabel: "KPI 指標",
    category: "api",
    icon: "kpi",
    title: "KPI 指標",
    subtitle: "提供公司揭露的營運 KPI 與追蹤欄位。",
    tier: "complete",
    sections: [
      {
        id: "dataset-overview",
        label: "資料集說明",
        paragraphs: [
          "KPI 指標資料集收錄公司定期揭露的營運數據，包含出貨量、稼動率、產能利用或區域營收占比等欄位。",
          "此資料集用於補足財報低頻資料，提供營運面變化的前導訊號。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "常見使用情境",
        paragraphs: [
          "常見用途為追蹤月/季營運變化、建立領先指標、在財報發布前觀察趨勢轉折。",
          "實務上多與月營收、財報三大表一起使用，交叉驗證單一 KPI 變動是否具代表性。",
        ],
      },
      {
        id: "key-fields",
        label: "關鍵欄位",
        paragraphs: [
          "欄位通常包含 ticker、period、kpi_name、kpi_value、unit、segment、yoy_change_pct。",
          "同公司不同期間可能新增或移除 KPI 項目，建議以 kpi_name 建立維度表做長期追蹤。",
        ],
        bullets: [
          "kpi_name：KPI 指標名稱",
          "kpi_value：指標值",
          "unit：欄位單位（%、千台、億元等）",
          "segment：分部或產品線識別（如有）",
        ],
      },
      {
        id: "source-notes",
        label: "來源說明",
        paragraphs: [
          "KPI 多來自公司公告、法說資料與公開揭露文件，來源異質性高於標準財報欄位。",
          "回應會保留 source_role 與 lineage，方便判斷該指標是否來自 canonical 揭露來源。",
        ],
      },
      {
        id: "response-shape",
        label: "回應結構示意",
        paragraphs: ["回應維持統一模型，data 為 KPI 記錄陣列；單次查詢可能回傳多個 KPI 名稱。"],
        bullets: [
          "dataset: kpi_metrics",
          "source_role / lineage: 來源角色與追蹤資訊",
          "data[]: ticker、period、kpi_name、kpi_value、unit、yoy_change_pct",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "並非所有公司都提供完整 KPI 欄位，請在流程中允許缺值與欄位動態變化。",
          "跨公司比較前請先統一單位與定義，避免把不同口徑指標直接併算。",
        ],
      },
    ],
  },
  {
    slug: ["api", "financial-metrics"],
    href: "/docs/api/financial-metrics",
    navLabel: "財務指標",
    category: "api",
    icon: "metrics",
    title: "財務指標",
    subtitle: "提供估值與財務比率欄位，支援篩選與比較分析。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "財務指標",
      method: "GET",
      endpoint: "/v1/financial-metrics",
      overview: [
        "此 endpoint 提供估值與財務比率快照，例如 PER、PBR、殖利率、ROE 與市值欄位。",
        "資料常與股價與財報資料一起使用，作為篩選與策略評估的共通特徵層。",
      ],
      useCases: ["建立估值篩選條件。", "做產業橫截面比較。", "在策略模型中加入財務比率特徵。"],
      gettingStarted: ["帶入 API key 與 ticker。", "可加 date 或 latest 控制快照範圍。", "回應欄位請統一轉為數值型別後再計算。"],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v1/financial-metrics" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "latest=true"`,
      queryParameters: [
        { name: "ticker", type: "string", required: true, description: "公司代號。" },
        { name: "date", type: "string", required: false, description: "快照日期，格式 YYYY-MM-DD。" },
        { name: "latest", type: "boolean", required: false, description: "是否僅回傳最新快照。" },
      ],
      responseSummary: [
        "回應 data 為指標快照陣列，欄位包含估值與獲利效率指標。",
        "部分指標會因原始揭露時點不同而短暫缺值。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 financial_metrics。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].date", type: "string", description: "指標日期。" },
        { path: "data[].per", type: "number|null", description: "本益比。" },
        { path: "data[].pbr", type: "number|null", description: "股價淨值比。" },
        { path: "data[].dividend_yield_pct", type: "number|null", description: "殖利率（百分比）。" },
        { path: "data[].market_cap", type: "number|null", description: "市值。" },
      ],
      notes: [
        "跨公司比較前請固定日期口徑。",
        "對於 null 欄位請避免直接補 0，建議保留缺值狀態。",
      ],
      planRequirement: {
        title: "適用方案",
        bullets: [
          "Free：可用（限制）",
          "Developer：可用（限制，僅限開發與測試）",
          "Pro / Enterprise：完整可用（含商業使用）",
        ],
      },
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v1/financial-metrics" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳財務指標",
            body: `{
  "dataset": "financial_metrics",
  "source_role": "canonical",
  "data": [
    {
      "ticker": "2330",
      "date": "2026-04-18",
      "per": 28.4,
      "pbr": 6.1,
      "dividend_yield_pct": 1.82,
      "roe_pct": 31.4,
      "market_cap": 21965000000000
    }
  ]
}`,
          },
          { status: "400", description: "參數錯誤", body: `{"error":{"code":"invalid_request","message":"ticker is required"}}` },
          { status: "401", description: "認證失敗", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無資料", body: `{"error":{"code":"not_found","message":"financial metrics not found"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "financial-statements"],
    href: "/docs/api/financial-statements",
    navLabel: "財報三大表",
    category: "api",
    icon: "statements",
    title: "財報三大表",
    subtitle: "提供損益表、資產負債表與現金流量表的結構化資料。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "財報三大表",
      method: "GET",
      endpoint: "/v1/financial-statements",
      overview: [
        "此 endpoint 回傳公司財報三大表：損益表、資產負債表、現金流量表，並以一致 schema 輸出。",
        "適合直接作為基本面分析與模型特徵來源，減少自行解析原始揭露文件的成本。",
      ],
      useCases: [
        "建立跨公司財務比率與成長率模型。",
        "做季度追蹤與年度趨勢分析。",
        "將財報欄位與估值、價格資料合併成策略資料集。",
      ],
      gettingStarted: [
        "在 request header 帶入 X-API-Key: your_api_key_here。",
        "至少提供 ticker，並以 period 或 frequency 控制查詢粒度。",
        "先驗證 income_statement、balance_sheet、cash_flow_statement 三個主物件是否完整。",
      ],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v1/financial-statements" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "period=2025-Q4"`,
      queryParameters: [
        { name: "ticker", type: "string", required: true, description: "公司代號。" },
        { name: "period", type: "string", required: false, description: "財報期間，例如 2025-Q4 或 2025。" },
        { name: "frequency", type: "string", required: false, description: "quarterly 或 annual。" },
        { name: "latest", type: "boolean", required: false, description: "true 時僅回傳最新一期。" },
      ],
      responseSummary: [
        "回應 data 為財報紀錄陣列，單筆會包含三大表主物件與 period、currency、lineage 資訊。",
        "部分細項欄位可能因揭露格式差異而缺值，建議以 null 處理，不要直接補 0。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 financial_statements。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].period", type: "string", description: "財報期間。" },
        { path: "data[].income_statement.revenue", type: "number|null", description: "營收。" },
        { path: "data[].income_statement.net_income", type: "number|null", description: "淨利。" },
        { path: "data[].balance_sheet.total_assets", type: "number|null", description: "總資產。" },
        { path: "data[].balance_sheet.shareholders_equity", type: "number|null", description: "股東權益。" },
        { path: "data[].cash_flow_statement.operating_cash_flow", type: "number|null", description: "營運現金流。" },
        { path: "lineage.trace_id", type: "string", description: "資料追蹤識別。" },
      ],
      notes: [
        "不同公司會計科目細節不同，跨公司比較前請先做欄位映射。",
        "若遇到重編或更正公告，建議保存版本資訊並重算衍生指標。",
        "搭配 /v1/earnings 可補足財報公告節點資訊。",
      ],
      planRequirement: {
        title: "適用方案",
        bullets: [
          "Free：—",
          "Developer：可用（限制，僅限開發與測試）",
          "Pro / Enterprise：完整可用（含商業使用）",
        ],
      },
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v1/financial-statements" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "frequency=quarterly"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳財報三大表",
            body: `{
  "dataset": "financial_statements",
  "source_role": "canonical",
  "lineage": { "provider": "MOPS", "trace_id": "fs_2330_2025q4" },
  "data": [
    {
      "ticker": "2330",
      "period": "2025-Q4",
      "currency": "TWD",
      "income_statement": {
        "revenue": 868461000000,
        "gross_profit": 466512000000,
        "operating_income": 382146000000,
        "net_income": 346783000000
      },
      "balance_sheet": {
        "total_assets": 6321458000000,
        "total_liabilities": 2418321000000,
        "shareholders_equity": 3903137000000
      },
      "cash_flow_statement": {
        "operating_cash_flow": 512384000000,
        "investing_cash_flow": -218450000000,
        "financing_cash_flow": -102381000000
      }
    }
  ]
}`,
          },
          { status: "400", description: "缺少必要參數", body: `{"error":{"code":"invalid_request","message":"ticker is required"}}` },
          { status: "401", description: "認證失敗", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無財報資料", body: `{"error":{"code":"not_found","message":"financial statements not found"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "insider-trades"],
    href: "/docs/api/insider-trades",
    navLabel: "內線交易",
    category: "api",
    icon: "insider",
    title: "內線交易",
    subtitle: "提供董事、經理人等申報交易紀錄。",
    tier: "placeholder",
    sections: [
      {
        id: "dataset-overview",
        label: "資料定義",
        paragraphs: [
          "此資料集收錄公司內部人員申報的買賣交易紀錄，包含申報人身分、交易型態與數量。",
          "資料常用於觀察管理階層行為與市場情緒輔助判讀。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "使用情境",
        paragraphs: [
          "可用於建立內部人交易事件清單、統計特定期間淨買賣方向。",
          "建議搭配公告文件與價格資料交叉分析，不宜單一使用。",
        ],
      },
      {
        id: "field-and-source-notes",
        label: "欄位與來源注意事項",
        paragraphs: [
          "申報時間與實際交易時間可能不同，事件研究需選定一致的時間準則。",
          "回應保留來源資訊，便於核對原始申報依據。",
        ],
      },
    ],
  },
  {
    slug: ["api", "news"],
    href: "/docs/api/news",
    navLabel: "新聞",
    category: "api",
    icon: "news",
    title: "新聞",
    subtitle: "提供與公司與市場相關的新聞資料。",
    tier: "placeholder",
    sections: [
      {
        id: "dataset-overview",
        label: "資料定義",
        paragraphs: [
          "新聞資料集提供標題、發布時間、來源與分類等欄位，可作為事件與情緒分析輸入。",
          "此資料集主要用於訊號輔助，不應直接取代基本面與價格資料。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "使用情境",
        paragraphs: [
          "可建立新聞事件索引、關鍵字過濾與特定公司新聞追蹤流程。",
          "建議與公告文件、事件資料一起使用以降低誤判。",
        ],
      },
      {
        id: "field-and-source-notes",
        label: "欄位與來源注意事項",
        paragraphs: [
          "同一事件可能有多篇新聞，建議用 hash 或主題欄位做去重。",
          "請保留來源與時間欄位，方便後續審計。",
        ],
      },
    ],
  },
  {
    slug: ["api", "institutional-holdings"],
    href: "/docs/api/institutional-holdings",
    navLabel: "法人持股",
    category: "api",
    icon: "holdings",
    title: "法人持股",
    subtitle: "提供法人與機構持股相關資料。",
    tier: "placeholder",
    sections: [
      {
        id: "dataset-overview",
        label: "資料定義",
        paragraphs: [
          "此資料集聚焦法人持股比例與持股變動，適合觀察資金流向與市場結構。",
          "常見欄位包含法人類別、持股比率、變動數量與統計區間。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "使用情境",
        paragraphs: [
          "可用於建立法人偏好因子、觀察持股集中度變化。",
          "建議配合股價與成交量資料，避免只看單一維度。",
        ],
      },
      {
        id: "field-and-source-notes",
        label: "欄位與來源注意事項",
        paragraphs: [
          "不同法人類別資料更新節奏可能不同，查詢時請帶入日期條件。",
          "若跨來源合併，請先確認分類口徑一致。",
        ],
      },
    ],
  },
  {
    slug: ["api", "interest-rates"],
    href: "/docs/api/interest-rates",
    navLabel: "利率",
    category: "api",
    icon: "rates",
    title: "利率",
    subtitle: "提供市場基準利率與時間序列資料。",
    tier: "placeholder",
    sections: [
      {
        id: "dataset-overview",
        label: "資料定義",
        paragraphs: [
          "利率資料集提供不同期限與類型的基準利率時間序列。",
          "可作為估值折現參數或總體環境特徵輸入。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "使用情境",
        paragraphs: [
          "常見情境包括：策略回測中的宏觀因子、估值模型折現率設定。",
          "建議明確標記利率口徑與頻率後再進行模型訓練。",
        ],
      },
      {
        id: "field-and-source-notes",
        label: "欄位與來源注意事項",
        paragraphs: [
          "同名利率在不同來源可能有不同發布時點與修訂機制。",
          "請保留來源 metadata，避免混用不同口徑時間序列。",
        ],
      },
    ],
  },
  {
    slug: ["api", "search"],
    href: "/docs/api/search",
    navLabel: "搜尋",
    category: "api",
    icon: "search",
    title: "搜尋",
    subtitle: "提供 ticker、公司名稱與條件式查詢入口。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "搜尋",
      method: "GET",
      endpoint: "/v2/search",
      overview: [
        "此 endpoint 用於查找公司與標的識別資訊，可依 ticker、公司名稱或關鍵字回傳候選結果。",
        "常作為前端 autocomplete 與批次查詢前的標的校正入口。",
      ],
      useCases: ["使用者輸入校正。", "建立標的清單。", "依市場別過濾查詢結果。"],
      gettingStarted: ["帶入 API key 與 query。", "視需求加 market 與 limit。", "結果可再搭配 /v2/datasets/company-profile 做二次驗證。"],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v2/search" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "query=台積電"`,
      queryParameters: [
        { name: "query", type: "string", required: true, description: "公司名稱、代號或關鍵字。" },
        { name: "market", type: "string", required: false, description: "市場別篩選，例如 TWSE、TPEx。" },
        { name: "limit", type: "integer", required: false, description: "回傳筆數上限，預設 20。" },
      ],
      responseSummary: ["回應 data 為候選清單，含 ticker、公司名稱、市場別與匹配分數。"],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 search。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].company_name", type: "string", description: "公司名稱。" },
        { path: "data[].market_type", type: "string", description: "上市櫃別。" },
        { path: "data[].score", type: "number", description: "匹配分數，僅作排序用途。" },
      ],
      notes: [
        "關鍵字過短可能回傳過多結果，建議設定最小字元長度。",
        "score 不是交易訊號，不應直接作為策略特徵。",
      ],
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v2/search" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "query=2330" \\
  --data-urlencode "limit=10"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳搜尋結果",
            body: `{
  "dataset": "search",
  "source_role": "canonical",
  "data": [
    {
      "ticker": "2330",
      "company_name": "台灣積體電路製造股份有限公司",
      "exchange": "TWSE",
      "market_type": "上市",
      "score": 0.98
    }
  ]
}`,
          },
          { status: "400", description: "缺少 query", body: `{"error":{"code":"invalid_request","message":"query is required"}}` },
          { status: "401", description: "認證失敗", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無結果", body: `{"error":{"code":"not_found","message":"no search result"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "filings"],
    href: "/docs/api/filings",
    navLabel: "公告文件",
    category: "api",
    icon: "filings",
    title: "公告文件",
    subtitle: "提供公告文件索引與文件屬性欄位。",
    tier: "complete",
    sections: [
      {
        id: "dataset-overview",
        label: "資料集說明",
        paragraphs: [
          "公告文件資料集提供公司公告、申報文件與相關文件索引，重點是可查詢與可追溯的文件 metadata。",
          "資料不只包含文件標題與日期，亦保留文件類型、主題分類與來源識別。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "常見使用情境",
        paragraphs: [
          "可用於建立公告追蹤服務、事件研究樣本建立、法說與重大訊息監控。",
          "建議先以日期、公司與文件類型做結構化過濾，再進行全文解析。",
        ],
      },
      {
        id: "key-fields",
        label: "關鍵欄位",
        paragraphs: [
          "常見欄位包含 ticker、filing_id、filing_type、announcement_date、title、document_url、language。",
          "若需要文件追蹤與去重，建議以 filing_id 與 document_hash 作為主識別鍵。",
        ],
        bullets: [
          "filing_type：文件類型（法說、重大訊息、定期申報等）",
          "announcement_date：公告日期",
          "document_url：文件連結",
          "title / summary：文件標題與摘要",
        ],
      },
      {
        id: "source-notes",
        label: "來源說明",
        paragraphs: [
          "文件索引以官方與公開揭露來源為主，並依來源角色標記 canonical 或 helper。",
          "若文件由輔助流程補齊，lineage 會記錄來源 provider 與 ingest trace。",
        ],
      },
      {
        id: "response-shape",
        label: "回應結構示意",
        paragraphs: ["回應 data 為文件清單，每筆代表一份文件索引，適合串接後續下載或解析流程。"],
        bullets: [
          "dataset: filings",
          "source_role / lineage: 來源角色與追蹤資訊",
          "data[]: filing_id、ticker、filing_type、announcement_date、title、document_url",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "公告文件類型命名在不同來源可能不同，建議先建立 filing_type 對照表。",
          "同一事件可能有多份更新文件，請以 filing_id 與時間戳管理版本。",
        ],
      },
    ],
  },
  {
    slug: ["api", "segments"],
    href: "/docs/api/segments",
    navLabel: "分部資料",
    category: "api",
    icon: "segments",
    title: "分部資料",
    subtitle: "提供公司業務分部與營收結構資料。",
    tier: "complete",
    sections: [
      {
        id: "dataset-overview",
        label: "資料集說明",
        paragraphs: [
          "分部資料集描述公司在不同業務線、產品線或地區的營收與獲利拆分。",
          "此資料集用於觀察公司成長來源與結構變化，補足總體財報欄位無法反映的細節。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "常見使用情境",
        paragraphs: [
          "常見用途包含分部營收占比追蹤、區域曝險分析、產品組合變化監控。",
          "建議與財報三大表同步比對，確認分部加總與主表口徑一致。",
        ],
      },
      {
        id: "key-fields",
        label: "關鍵欄位",
        paragraphs: [
          "常見欄位包含 ticker、period、segment_name、segment_revenue、segment_profit、segment_ratio_pct。",
          "若公司同時揭露產品別與地區別，建議分開維度表管理再做匯總。",
        ],
        bullets: [
          "segment_name：分部名稱",
          "segment_revenue / segment_profit：分部主數值",
          "segment_ratio_pct：分部占比",
          "dimension：分部維度（產品、地區、事業群）",
        ],
      },
      {
        id: "source-notes",
        label: "來源說明",
        paragraphs: [
          "分部欄位主要來自公司公開揭露文件，平台會保留來源角色與 lineage 以供追溯。",
          "若分部資料經由文件解析流程產出，lineage 會記錄來源文件識別。",
        ],
      },
      {
        id: "response-shape",
        label: "回應結構示意",
        paragraphs: ["回應 data 通常為某期間下的多分部陣列，可直接用於占比計算與結構比較。"],
        bullets: [
          "dataset: segments",
          "source_role / lineage: 來源與追蹤資訊",
          "data[]: ticker、period、segment_name、segment_revenue、segment_ratio_pct",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "分部命名可能隨公司揭露策略調整，跨期比較前請先做名稱映射。",
          "同期間若存在重分類或補充揭露，建議保留版本欄位並重新計算占比。",
        ],
      },
    ],
  },
  {
    slug: ["api", "prices"],
    href: "/docs/api/prices",
    navLabel: "股價資料",
    category: "api",
    icon: "prices",
    title: "股價資料",
    subtitle: "提供 OHLCV、還原欄位與交易日對齊資料。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "use-cases", label: "適用情境", paragraphs: [] },
      { id: "getting-started", label: "Getting Started", paragraphs: [] },
      { id: "example-request", label: "範例請求", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "notes", label: "Notes", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "股價資料",
      method: "GET",
      endpoint: "/v1/prices",
      overview: [
        "此 endpoint 提供日線層級的 OHLCV 與成交金額欄位，支援還原價查詢。",
        "資料適合做技術指標、報酬序列、事件窗口分析與回測前處理。",
      ],
      useCases: ["計算技術指標。", "建立回測用時間序列。", "搭配事件資料檢查除權息影響。"],
      gettingStarted: [
        "帶入 API key 與 ticker。",
        "用 start_date 與 end_date 控制查詢期間。",
        "根據策略口徑決定是否使用 adjusted=true。",
      ],
      exampleRequestCurl: `curl -G "https://api.twmd.example/v1/prices" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "start_date=2026-01-01" \\
  --data-urlencode "end_date=2026-04-18"`,
      queryParameters: [
        { name: "ticker", type: "string", required: true, description: "公司代號。" },
        { name: "start_date", type: "string", required: false, description: "起始交易日，格式 YYYY-MM-DD。" },
        { name: "end_date", type: "string", required: false, description: "結束交易日，格式 YYYY-MM-DD。" },
        { name: "adjusted", type: "boolean", required: false, description: "是否回傳還原價欄位。預設 false。" },
        { name: "limit", type: "integer", required: false, description: "單次回傳筆數上限。" },
      ],
      responseSummary: [
        "回應 data 為日期序列，固定包含 open、high、low、close、volume、turnover。",
        "adjusted_close 僅在支援條件下回傳，請在模型側處理缺值情境。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 prices。" },
        { path: "data[].ticker", type: "string", description: "公司代號。" },
        { path: "data[].date", type: "string", description: "交易日。" },
        { path: "data[].open", type: "number", description: "開盤價。" },
        { path: "data[].high", type: "number", description: "最高價。" },
        { path: "data[].low", type: "number", description: "最低價。" },
        { path: "data[].close", type: "number", description: "收盤價。" },
        { path: "data[].volume", type: "number", description: "成交量。" },
        { path: "data[].turnover", type: "number", description: "成交金額。" },
        { path: "data[].adjusted_close", type: "number|null", description: "還原收盤價。" },
      ],
      notes: [
        "回測前請先確認是否使用還原價，避免跨事件期間的報酬偏誤。",
        "若查詢區間橫跨停牌或無成交日，請在下游流程補齊交易日曆。",
        "建議搭配 /v1/corporate-actions 一起檢查事件調整。",
      ],
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v1/prices" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330" \\
  --data-urlencode "adjusted=true"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳股價資料",
            body: `{
  "dataset": "prices",
  "source_role": "canonical",
  "lineage": { "provider": "TWSE", "trace_id": "prices_2330_20260418" },
  "data": [
    {
      "ticker": "2330",
      "date": "2026-04-18",
      "open": 842,
      "high": 850,
      "low": 838,
      "close": 847,
      "volume": 24518321,
      "turnover": 20781456327,
      "adjusted_close": 847
    }
  ]
}`,
          },
          { status: "400", description: "日期參數錯誤", body: `{"error":{"code":"invalid_request","message":"start_date format is invalid"}}` },
          { status: "401", description: "認證失敗", body: `{"error":{"code":"unauthorized","message":"invalid api key"}}` },
          { status: "404", description: "查無資料", body: `{"error":{"code":"not_found","message":"price data not found"}}` },
        ],
      },
    },
  },
  {
    slug: ["guides", "get-fundamentals"],
    href: "/docs/guides/get-fundamentals",
    navLabel: "如何取得基本面資料",
    category: "guides",
    icon: "guide",
    title: "如何取得基本面資料",
    subtitle: "從 API key 到資料落地，建立穩定的基本面查詢流程。",
    tier: "complete",
    sections: [
      {
        id: "problem-definition",
        label: "問題定義",
        paragraphs: [
          "基本面資料分散於月營收、財報、估值與公司主檔等多個資料集。",
          "目標是建立一條可重現、可追溯、可擴展的查詢與清洗流程。",
        ],
      },
      {
        id: "implementation-steps",
        label: "實作步驟",
        paragraphs: [
          "先確認標的清單，再依序查詢公司主檔、月營收、財報三大表與估值欄位。",
          "每次查詢都保留 dataset、source_role、lineage，便於後續比對來源。",
        ],
        bullets: [
          "步驟 1：查 company-profile 建立主檔",
          "步驟 2：查 revenue 與 financial-statements",
          "步驟 3：查 financial-metrics 補足估值欄位",
          "步驟 4：落地並做欄位一致性檢查",
        ],
      },
      {
        id: "recommended-order",
        label: "建議查詢順序",
        paragraphs: [
          "先取得靜態主檔，再取時間序列資料，可降低 join 錯誤。",
          "若流程每日執行，建議先抓增量 period，再補齊缺失區間。",
        ],
      },
      {
        id: "common-errors",
        label: "常見錯誤",
        paragraphs: [
          "常見問題包含欄位型別不一致、期間格式混用、缺值處理方式不一致。",
          "建議在 ETL 層統一 period 與數值型別，並保留原始值供回溯。",
        ],
      },
      {
        id: "applicable-endpoints",
        label: "適用 endpoint",
        paragraphs: [
          "/docs/api/company-profile、/docs/api/financial-statements、/docs/api/financial-metrics、/docs/data-access。",
        ],
      },
    ],
  },
  {
    slug: ["guides", "query-filings"],
    href: "/docs/guides/query-filings",
    navLabel: "如何查詢公告文件",
    category: "guides",
    icon: "guide",
    title: "如何查詢公告文件",
    subtitle: "建立公告檢索與文件追蹤流程。",
    tier: "placeholder",
    sections: [
      {
        id: "problem-definition",
        label: "問題定義",
        paragraphs: [
          "公告文件資料量大且類型多，若缺少索引策略，查詢成本與噪音會快速升高。",
          "此頁說明如何以日期、公司與文件類型建立可維運查詢流程。",
        ],
      },
      {
        id: "implementation-steps",
        label: "實作步驟",
        paragraphs: [
          "先用日期與公司範圍縮小結果，再依文件類型與主題條件過濾。",
          "將文件識別欄位與來源 metadata 一併保存，便於後續追溯。",
        ],
      },
      {
        id: "common-errors",
        label: "常見錯誤與注意事項",
        paragraphs: [
          "常見錯誤是只以標題關鍵字篩選，忽略文件類型與公告狀態。",
          "建議先做結構化過濾，再進入全文分析。",
        ],
      },
    ],
  },
  {
    slug: ["guides", "get-prices"],
    href: "/docs/guides/get-prices",
    navLabel: "如何取得股價資料",
    category: "guides",
    icon: "guide",
    title: "如何取得股價資料",
    subtitle: "建立可回測與可上線的股價資料查詢流程。",
    tier: "complete",
    sections: [
      {
        id: "problem-definition",
        label: "問題定義",
        paragraphs: [
          "股價資料看似單純，但在回測與上線時常遇到交易日、還原與缺值處理不一致問題。",
          "目標是取得可直接用於策略計算的時間序列資料。",
        ],
      },
      {
        id: "implementation-steps",
        label: "實作步驟",
        paragraphs: [
          "先決定查詢期間與標的，再送出 prices 請求，最後驗證欄位完整性。",
          "若策略對公司事件敏感，請同步查詢事件資料並確認是否使用還原價。",
        ],
        bullets: [
          "步驟 1：確定 ticker 與日期範圍",
          "步驟 2：查詢 prices 端點取得 OHLCV",
          "步驟 3：檢查交易日連續性與缺值",
          "步驟 4：決定 close 或 adjusted_close 口徑",
        ],
      },
      {
        id: "recommended-order",
        label: "建議查詢順序",
        paragraphs: [
          "先抓小範圍樣本驗證欄位與交易日，再擴展到長區間批次處理。",
          "正式流程建議分段抓取，並在資料層做去重與時間排序。",
        ],
      },
      {
        id: "common-errors",
        label: "常見錯誤",
        paragraphs: [
          "最常見錯誤是忽略停牌/無成交日，或混用還原與未還原價格造成報酬失真。",
          "建議把口徑固定寫入策略設定檔，避免不同環境結果不一致。",
        ],
      },
      {
        id: "applicable-endpoints",
        label: "適用 endpoint",
        paragraphs: ["/docs/api/prices、/docs/api/segments、/docs/source-policy。"],
      },
    ],
  },
  {
    slug: ["guides", "backtesting"],
    href: "/docs/guides/backtesting",
    navLabel: "如何做策略回測",
    category: "guides",
    icon: "guide",
    title: "如何做策略回測",
    subtitle: "以一致口徑建立可重現的回測資料管線。",
    tier: "placeholder",
    sections: [
      {
        id: "problem-definition",
        label: "問題定義",
        paragraphs: [
          "回測結果不穩定通常來自資料口徑不一致，而非策略本身。",
          "本頁聚焦資料層面的回測準備，而非交易邏輯設計。",
        ],
      },
      {
        id: "implementation-steps",
        label: "實作步驟",
        paragraphs: [
          "固定資料版本、固定來源角色，再建立可重放的時間序列切片流程。",
          "回測輸入需包含價格、事件與必要基本面欄位。",
        ],
      },
      {
        id: "common-errors",
        label: "常見錯誤與注意事項",
        paragraphs: [
          "常見錯誤包含 look-ahead bias、資料重編未處理、交易成本假設缺失。",
          "建議先完成資料審計，再比較策略表現。",
        ],
      },
    ],
  },
  {
    slug: ["guides", "data-cleaning"],
    href: "/docs/guides/data-cleaning",
    navLabel: "如何做資料清洗",
    category: "guides",
    icon: "guide",
    title: "如何做資料清洗",
    subtitle: "建立一致欄位與可追溯的清洗流程。",
    tier: "placeholder",
    sections: [
      {
        id: "problem-definition",
        label: "問題定義",
        paragraphs: [
          "資料清洗不是一次性工作，而是持續維運流程的一部分。",
          "若缺乏規則化流程，研究與生產結果會逐步偏離。",
        ],
      },
      {
        id: "implementation-steps",
        label: "實作步驟",
        paragraphs: [
          "先定義欄位型別與主鍵，再處理缺值、去重與異常值。",
          "清洗後資料應保留來源與 traceability 欄位，避免失去可審計性。",
        ],
      },
      {
        id: "common-errors",
        label: "常見錯誤與注意事項",
        paragraphs: [
          "常見錯誤包含直接覆寫原始值、缺乏版本控管、跨來源欄位硬合併。",
          "建議採 raw / normalized / serving 三層資料模型。",
        ],
      },
    ],
  },
  {
    slug: ["advanced", "mcp-server"],
    href: "/docs/advanced/mcp-server",
    navLabel: "MCP Server",
    category: "advanced",
    icon: "advanced",
    title: "MCP Server",
    subtitle: "將資料能力封裝為可被 agent 調用的工具介面。",
    tier: "placeholder",
    sections: [
      {
        id: "concept",
        label: "概念說明",
        paragraphs: [
          "MCP Server 用於把資料查詢能力轉為標準化工具，供 agent workflow 直接調用。",
          "此模式可減少每個 agent 重複實作 API 客戶端。",
        ],
      },
      {
        id: "scenarios",
        label: "適用情境",
        paragraphs: [
          "適合多代理協作、查詢規劃與語義查詢流程。",
          "建議先明確定義工具輸入輸出 schema，再串接執行層。",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "工具層仍需遵守 API 配額與權限管理，不應繞過原本安全邊界。",
          "請記錄調用 trace，便於問題排查。",
        ],
      },
    ],
  },
  {
    slug: ["advanced", "rate-limits"],
    href: "/docs/advanced/rate-limits",
    navLabel: "Rate Limit 與配額",
    category: "advanced",
    icon: "advanced",
    title: "Rate Limit 與配額",
    subtitle: "說明請求速率、配額控管與高併發整合策略。",
    tier: "complete",
    sections: [
      {
        id: "concept",
        label: "概念說明",
        paragraphs: [
          "Rate limit 控制單位時間請求速率；配額控制方案期間內可用總量。",
          "兩者需同時考慮，否則即使短期流量正常，仍可能觸發總量限制。",
          "TWSE/TPEx 日價端點目前採每組 API key 每分鐘 60 次限制。",
        ],
      },
      {
        id: "scenarios",
        label: "適用情境",
        paragraphs: [
          "高頻查詢、批次回補與多服務共享同一組金鑰時，最容易觸發限制。",
          "建議在 client 端實作併發池與請求節流策略。",
        ],
      },
      {
        id: "implementation",
        label: "實作重點",
        paragraphs: [
          "建議在 SDK 或 API gateway 層統一處理 429 與重試間隔，避免每個服務重複實作。",
          "搭配本地快取、批次聚合與增量查詢可顯著降低請求量。",
        ],
        bullets: ["使用 exponential backoff", "設定最大重試次數", "重試前檢查剩餘配額與業務時效"],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "不要在短時間以固定間隔盲目重試，這通常會放大擁塞。",
          "建議在控制台設定告警門檻，於接近配額時提前降載。",
        ],
      },
    ],
  },
  {
    slug: ["advanced", "error-handling"],
    href: "/docs/advanced/error-handling",
    navLabel: "錯誤處理",
    category: "advanced",
    icon: "advanced",
    title: "錯誤處理",
    subtitle: "建立一致的 API 例外處理與排查流程。",
    tier: "complete",
    sections: [
      {
        id: "concept",
        label: "概念說明",
        paragraphs: [
          "錯誤處理的目標是讓系統在異常時仍可預測：可重試、可觀測、可回溯。",
          "請先區分認證錯誤、參數錯誤、流量限制與伺服器錯誤，再定義策略。",
        ],
      },
      {
        id: "scenarios",
        label: "適用情境",
        paragraphs: [
          "批次任務、即時策略與 agent workflow 都需要一致的錯誤模型。",
          "若沒有統一策略，系統常出現 silent failure 或重試風暴。",
        ],
      },
      {
        id: "implementation",
        label: "實作重點",
        paragraphs: [
          "對 4xx 先做輸入修正與權限檢查，對 5xx 才做可控重試。",
          "每次錯誤請保留 request id、trace_id、endpoint、參數摘要與時間戳。",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "不要把所有錯誤統一重試；例如 401、403、422 重試通常無效。",
          "對可恢復錯誤需設定熔斷與告警，避免擴散影響下游流程。",
        ],
      },
    ],
  },
  {
    slug: ["advanced", "pagination-and-query-design"],
    href: "/docs/advanced/pagination-and-query-design",
    navLabel: "分頁與查詢設計",
    category: "advanced",
    icon: "advanced",
    title: "分頁與查詢設計",
    subtitle: "在大資料量場景下維持查詢穩定性與可維運性。",
    tier: "placeholder",
    sections: [
      {
        id: "concept",
        label: "概念說明",
        paragraphs: [
          "分頁與查詢條件設計直接影響 API 成本、延遲與資料一致性。",
          "建議優先使用可重放的 cursor 或明確排序鍵。",
        ],
      },
      {
        id: "scenarios",
        label: "適用情境",
        paragraphs: [
          "適用於長期間歷史資料拉取、批次同步與後台報表查詢。",
          "查詢條件應先限制時間範圍，再增加主題過濾。",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [
          "避免一次拉取過大資料量，建議分頁並搭配 checkpoint 機制。",
          "若分頁參數變動，請同步更新下游去重策略。",
        ],
      },
    ],
  },
  {
    slug: ["support", "faq"],
    href: "/docs/support/faq",
    navLabel: "常見問題",
    category: "support",
    icon: "support",
    title: "常見問題",
    subtitle: "整理 API 使用、配額、來源與錯誤排查的常見疑問。",
    tier: "complete",
    sections: [
      {
        id: "api-key",
        label: "API key 與權限",
        paragraphs: [
          "Q：金鑰可以共用嗎？",
          "A：可以，但不建議跨系統共用同一金鑰。建議按服務或環境拆分，以利追蹤與停用。",
        ],
      },
      {
        id: "quota-rate-limit",
        label: "配額與 rate limit",
        paragraphs: [
          "Q：收到 429 要怎麼處理？",
          "A：請實作退避重試並降低短時間併發；若長期接近上限，請調整查詢策略或升級方案。",
        ],
      },
      {
        id: "freshness-source-role",
        label: "更新頻率與來源角色",
        paragraphs: [
          "Q：如何判斷資料時效與來源？",
          "A：請檢查 freshness、source_role、lineage 欄位；若為 helper/fallback，回應會保留角色標記。",
        ],
      },
      {
        id: "response-and-debugging",
        label: "回應格式與錯誤排查",
        paragraphs: [
          "Q：欄位解析異常時該先看什麼？",
          "A：先確認 dataset 與 data 型態，再檢查 period/date、欄位型別與來源 metadata。",
        ],
      },
    ],
  },
  {
    slug: ["support", "contact"],
    href: "/docs/support/contact",
    navLabel: "聯絡支援",
    category: "support",
    icon: "support",
    title: "聯絡支援",
    subtitle: "支援範圍、問題回報方式與 Enterprise 諮詢入口。",
    tier: "complete",
    sections: [
      {
        id: "support-scope",
        label: "支援範圍",
        paragraphs: [
          "技術支援涵蓋 API 整合、回應解析、配額策略與資料來源標記說明。",
          "商務與 Enterprise 問題可透過同一入口提交，會由對應團隊接手。",
        ],
      },
      {
        id: "how-to-report",
        label: "問題回報方式",
        paragraphs: [
          "建議透過聯絡頁提交問題，並在標題中標註環境（dev/staging/prod）與受影響資料集。",
          "若為緊急故障，請同步提供影響範圍與預期回覆時限。",
        ],
      },
      {
        id: "required-context",
        label: "建議提供資訊",
        paragraphs: ["為加速排查，請附上 endpoint、時間範圍、錯誤碼、request id、trace_id 與樣本回應。"],
      },
      {
        id: "enterprise",
        label: "Enterprise 諮詢",
        paragraphs: [
          "若需要專用基礎設施、SLA 或客製化資料供給，請於聯絡表單註明預估流量與導入時程。",
          "團隊會根據使用情境提供方案建議與時程評估。",
        ],
      },
    ],
  },
];

type SchemaReadyTopic = {
  title: string;
  href: string;
  topicId: string;
  tableName: string;
  endpoint: string;
  source: string;
  icon?: DocsSidebarIcon;
};

type SchemaReadyGroup = {
  id: string;
  label: string;
  href: string;
  icon: DocsSidebarIcon;
  topics: SchemaReadyTopic[];
};

const topicPlanVisibility: Partial<Record<string, { bullets: string[] }>> = {
  financial_metrics: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
  valuation_data: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
  institutional_flow: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
  technical_indicators: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
  monthly_revenue_enhanced: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
  issuer_announcements: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
  events: {
    bullets: [
      "Free：可用（限制）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：完整可用（含商業使用）",
    ],
  },
};

const schemaReadyGroups: SchemaReadyGroup[] = [
  {
    id: "company",
    label: "公司",
    href: "/docs/api/company",
    icon: "building",
    topics: [
      { title: "公司基本資料", href: "/docs/api/company/company-profile", topicId: "issuer_profile", tableName: "issuer_profile", endpoint: "/v2/datasets/company-profile", source: "TWSE / TPEx" },
    ],
  },
  {
    id: "company-events",
    label: "公司與事件",
    href: "/docs/api/company-events",
    icon: "building",
    topics: [
      { title: "公告資訊", href: "/docs/api/company-events/issuer-announcements", topicId: "issuer_announcements", tableName: "issuer_announcements", endpoint: "/v2/datasets/issuer-announcements", source: "TWSE / TPEx / MOPS" },
      { title: "事件日曆", href: "/docs/api/company-events/events-calendar", topicId: "events", tableName: "events", endpoint: "/v2/datasets/events", source: "TWSE / TPEx / MOPS" },
      { title: "結構化事件", href: "/docs/api/company-events/structured-events", topicId: "structured_events", tableName: "structured_events", endpoint: "/v2/datasets/structured-events", source: "TWSE / TPEx / MOPS" },
      { title: "公司行動", href: "/docs/api/company-events/corporate-actions", topicId: "corporate_actions_enhanced", tableName: "corporate_actions_enhanced", endpoint: "/v2/datasets/corporate-actions-enhanced", source: "TWSE / TPEx / MOPS" },
      { title: "股利資料", href: "/docs/api/company-events/dividends", topicId: "dividends_corporate_actions_enhanced", tableName: "dividends_corporate_actions_enhanced", endpoint: "/v2/datasets/dividends", source: "TWSE / TPEx / MOPS" },
    ],
  },
  {
    id: "financial-growth",
    label: "財務與成長",
    href: "/docs/api/financial-growth",
    icon: "metrics",
    topics: [
      { title: "財報指標", href: "/docs/api/financial-growth/financial-metrics", topicId: "financial_metrics", tableName: "financial_metrics", endpoint: "/v2/datasets/financial-metrics", source: "MOPS / TWSE / TPEx" },
      { title: "月營收", href: "/docs/api/financial-growth/monthly-revenue", topicId: "monthly_revenue_enhanced", tableName: "monthly_revenue_enhanced", endpoint: "/v2/datasets/monthly-revenue-enhanced", source: "MOPS" },
      { title: "估值資料", href: "/docs/api/financial-growth/valuation-data", topicId: "valuation_data", tableName: "valuation_data", endpoint: "/v2/datasets/valuation-data", source: "TWSE / TPEx" },
    ],
  },
  {
    id: "market-prices",
    label: "市場與價格",
    href: "/docs/api/market-prices",
    icon: "prices",
    topics: [
      { title: "股價資料", href: "/docs/api/market-prices/price-data", topicId: "price_enhanced", tableName: "price_enhanced", endpoint: "/v2/datasets/price-enhanced", source: "TWSE / TPEx" },
      { title: "技術指標", href: "/docs/api/market-prices/technical-indicators", topicId: "technical_indicators", tableName: "technical_indicators", endpoint: "/v2/datasets/technical-indicators", source: "TWSE / TPEx" },
      { title: "指數資料", href: "/docs/api/market-prices/index-data", topicId: "index_data", tableName: "index_data", endpoint: "/v2/datasets/index-data", source: "TWSE / TPEx" },
      { title: "市場廣度", href: "/docs/api/market-prices/market-breadth", topicId: "market_breadth", tableName: "market_breadth", endpoint: "/v2/datasets/market-breadth", source: "TWSE / TPEx" },
      { title: "利率", href: "/docs/api/market-prices/interest-rate", topicId: "interest_rate_snapshot", tableName: "interest_rate_snapshot", endpoint: "/v2/datasets/interest-rate-snapshot", source: "中央銀行 / 公開資料平台" },
    ],
  },
  {
    id: "capital-flow",
    label: "籌碼與資金",
    href: "/docs/api/capital-flow",
    icon: "holdings",
    topics: [
      { title: "法人買賣", href: "/docs/api/capital-flow/institutional-flow", topicId: "institutional_flow", tableName: "institutional_flow", endpoint: "/v2/datasets/institutional-flow", source: "TWSE / TPEx" },
      { title: "融資融券", href: "/docs/api/capital-flow/margin-short", topicId: "margin_short", tableName: "margin_short", endpoint: "/v2/datasets/margin-short", source: "TWSE / TPEx" },
    ],
  },
  {
    id: "strategy-quant",
    label: "策略與量化",
    href: "/docs/api/strategy-quant",
    icon: "chart",
    topics: [
      { title: "特徵資料", href: "/docs/api/strategy-quant/features", topicId: "features", tableName: "features", endpoint: "/v2/datasets/features", source: "平台派生資料" },
      { title: "因子資料", href: "/docs/api/strategy-quant/factor-data", topicId: "factor_data", tableName: "factor_data", endpoint: "/v2/datasets/factor-data", source: "平台派生資料" },
      { title: "時間對齊資料", href: "/docs/api/strategy-quant/time-alignment", topicId: "time_alignment", tableName: "time_alignment", endpoint: "/v2/datasets/time-alignment", source: "平台對齊層" },
      { title: "選股器", href: "/docs/api/strategy-quant/screener", topicId: "screener", tableName: "screener", endpoint: "/v2/datasets/screener", source: "平台查詢層" },
    ],
  },
  {
    id: "taxonomy",
    label: "分類與結構",
    href: "/docs/api/taxonomy",
    icon: "segments",
    topics: [
      { title: "公司分類", href: "/docs/api/taxonomy/theme-taxonomy", topicId: "theme_taxonomy", tableName: "theme_taxonomy", endpoint: "/v2/datasets/theme-taxonomy", source: "平台分類模型" },
      { title: "指數分類", href: "/docs/api/taxonomy/index-classification", topicId: "index_classification", tableName: "index_classification", endpoint: "/v2/datasets/index-classification", source: "交易所分類 / 平台映射" },
    ],
  },
  {
    id: "query-tools",
    label: "查詢與工具",
    href: "/docs/api/query-tools",
    icon: "search",
    topics: [
      { title: "搜尋 API", href: "/docs/api/query-tools/search-api", topicId: "search_api", tableName: "search_index", endpoint: "/v2/search", source: "平台索引層", icon: "search" },
      { title: "查詢 API", href: "/docs/api/query-tools/query-api", topicId: "query_api", tableName: "query_engine", endpoint: "/v2/query", source: "平台查詢引擎", icon: "braces" },
      { title: "Explainability", href: "/docs/api/query-tools/explainability", topicId: "explainability_layer", tableName: "explainability_layer", endpoint: "/v2/query", source: "平台解釋層", icon: "guide" },
    ],
  },
];

const comingSoonTopics: Array<{ title: string; href: string; topicId: string }> = [
  { title: "持股分布", href: "/docs/coming-soon/ownership-distribution", topicId: "ownership_distribution" },
  { title: "ETF Flow", href: "/docs/coming-soon/etf-flow", topicId: "etf_flow" },
  { title: "指數成分", href: "/docs/coming-soon/index-constituents", topicId: "index_constituents" },
  { title: "法人持股", href: "/docs/coming-soon/institutional-ownership", topicId: "institutional_ownership" },
  { title: "可轉債", href: "/docs/coming-soon/convertible-bonds", topicId: "convertible_bonds" },
  { title: "衍生品", href: "/docs/coming-soon/derivatives-market", topicId: "derivatives_market" },
  { title: "供應鏈資料", href: "/docs/coming-soon/supply-chain", topicId: "supply_chain" },
];

function hrefToSlug(href: string) {
  return href.replace(/^\/docs\//, "").split("/");
}

const usageFocusedTopicIds = new Set([
  "features",
  "factor_data",
  "time_alignment",
  "financial_metrics",
  "monthly_revenue_enhanced",
  "valuation_data",
  "institutional_flow",
  "margin_short",
  "search_api",
  "query_api",
  "explainability_layer",
]);

const topicWorkflowLinks: Record<string, Array<{ title: string; href: string }>> = {
  features: [
    { title: "做策略 / AI", href: "/docs/workflows/strategy-ai" },
  ],
  factor_data: [
    { title: "做策略 / AI", href: "/docs/workflows/strategy-ai" },
  ],
  time_alignment: [
    { title: "做策略 / AI", href: "/docs/workflows/strategy-ai" },
  ],
  financial_metrics: [
    { title: "查公司基本面", href: "/docs/workflows/company-fundamentals" },
  ],
  monthly_revenue_enhanced: [
    { title: "查公司基本面", href: "/docs/workflows/company-fundamentals" },
  ],
  valuation_data: [
    { title: "查公司基本面", href: "/docs/workflows/company-fundamentals" },
  ],
  institutional_flow: [
    { title: "看籌碼", href: "/docs/workflows/capital-flow" },
  ],
  margin_short: [{ title: "看籌碼", href: "/docs/workflows/capital-flow" }],
  index_data: [{ title: "看市場狀態", href: "/docs/workflows/market-status" }],
  market_breadth: [{ title: "看市場狀態", href: "/docs/workflows/market-status" }],
  interest_rate_snapshot: [{ title: "看市場狀態", href: "/docs/workflows/market-status" }],
  search_api: [{ title: "快速查資料", href: "/docs/workflows/fast-data-access" }],
  query_api: [
    { title: "快速查資料", href: "/docs/workflows/fast-data-access" },
  ],
  explainability_layer: [{ title: "快速查資料", href: "/docs/workflows/fast-data-access" }],
};

function buildSchemaReadyTopicSections(topic: SchemaReadyTopic): DocsContentSection[] {
  const planRequirement = topicPlanVisibility[topic.topicId];
  const mappingSection: DocsContentSection = {
    id: "topic-mapping",
    label: "Topic 對照",
    paragraphs: [],
    bullets: [
      `topic：${topic.topicId}`,
      `table：${topic.tableName}`,
      `docs route：${topic.href}`,
      `endpoint：${topic.endpoint}`,
      `source：${topic.source}`,
      "readiness：schema_ready",
    ],
  };

  if (!usageFocusedTopicIds.has(topic.topicId)) {
    const out: DocsContentSection[] = [
      {
        id: "topic-summary",
        label: "主題說明",
        paragraphs: [
          `${topic.title}為台股決策資料平台的正式主題之一，對應 topic id：${topic.topicId}。`,
          "此頁用於產品化接線，確認主題在文件與路由中的識別方式。",
        ],
      },
      mappingSection,
      {
        id: "readiness",
        label: "Readiness",
        paragraphs: [
          "目前狀態：schema_ready。",
          "此標示代表主題契約已可被系統辨識；若尚未開放完整 public API，會另行於產品與文件標示。",
        ],
      },
    ];
    if (planRequirement) {
      out.splice(1, 0, {
        id: "plan-requirement",
        label: "適用方案",
        paragraphs: ["以下為此資料主題的對外可用方案："],
        bullets: planRequirement.bullets,
      });
    }
    return out;
  }

  const out: DocsContentSection[] = [
    {
      id: "what-is-this",
      label: "這個主題是什麼",
      paragraphs: [
        `${topic.title}對應 topic「${topic.topicId}」，用於台股決策流程中的核心資料查詢。`,
        "此主題已完成 schema_ready 接線，可作為系統辨識與資料治理的正式節點。",
      ],
    },
    {
      id: "use-cases",
      label: "適合使用情境",
      paragraphs: ["常見使用情境："],
      bullets: [
        "研究與回測前的資料對齊與欄位驗證",
        "策略訊號建立與決策流程補強",
        "自動化流程中的查詢與結果追溯",
      ],
    },
    {
      id: "query-pattern",
      label: "常見查詢方式 / 基本範例",
      paragraphs: [
        `建議先用小範圍查詢驗證欄位，再擴展到批次流程。範例 endpoint：${topic.endpoint}`,
        "標準流程：先確認輸入條件，再檢查 source_role、lineage 與 freshness。",
      ],
    },
    {
      id: "cross-topic",
      label: "常搭配主題",
      paragraphs: [
        "建議與公司主檔、股價、公告事件與查詢工具主題搭配使用，以建立完整決策上下文。",
      ],
    },
    {
      id: "next-workflow",
      label: "下一步（Workflow）",
      paragraphs: ["可直接延伸到以下任務導向文件："],
      bullets: (topicWorkflowLinks[topic.topicId] ?? [{ title: "快速查資料", href: "/docs/workflows/fast-data-access" }]).map(
        (item) => `${item.title}（${item.href}）`,
      ),
    },
    mappingSection,
  ];
  if (planRequirement) {
    out.splice(1, 0, {
      id: "plan-requirement",
      label: "適用方案",
      paragraphs: ["以下為此資料主題的對外可用方案："],
      bullets: planRequirement.bullets,
    });
  }
  return out;
}

function buildCompanyProfileApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/company-profile";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/company-profile",
    headers=headers,
    params={"ticker": "2330"},
)
print(response.json())`,
    javascript: `const response = await fetch(
  "https://api.twmarketdata.com/v2/datasets/company-profile?ticker=2330",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
);

const data = await response.json();
console.log(data);`,
    curl: `curl -G "https://api.twmarketdata.com/v2/datasets/company-profile" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "company_profile",
      source_role: "canonical",
      freshness: "2026-04-22T09:30:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T09:30:02+08:00",
        trace_id: "company_profile_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          company_name: "台灣積體電路製造股份有限公司",
          short_name: "台積電",
          market: "TWSE",
          exchange: "上市",
          industry: "半導體業",
          listing_status: "active",
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "公司基本資料",
    endpoint,
    method: "GET",
    overview: [
      "公司基本資料 API 用於提供發行人層級的靜態資料。這類資料通常不會像行情或事件資料一樣高頻更新，但在研究流程、資料清洗、前端展示與多資料集 join 時是必要基礎。",
      "典型用途包括：",
    ],
    requestDescription: [
      "此 endpoint 通常以 ticker 或市場範圍查詢。建議優先使用 ticker 作為識別鍵，避免以名稱進行模糊匹配。",
    ],
    useCases: [
      "以 ticker 對應公司名稱與市場別",
      "在前端或報表中顯示公司資訊",
      "將月營收、財報、公告與價格資料對齊到同一個 issuer entity",
      "作為 research pipeline 中的 metadata layer",
    ],
    gettingStarted: [
      "在 header 放入 X-API-Key。",
      "先以 ticker=2330 驗證回應結構。",
      "再依需求加入 market、limit、offset。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司。" },
      { name: "market", type: "string", required: false, description: "市場別（上市 / 上櫃；若後端已支持）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制（若後端支持）。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移（若後端支持）。" },
    ],
    responseSummary: [
      "所有回應維持一致結構，包含 dataset、source_role、freshness、lineage、data。",
    ],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].company_name", type: "string", description: "公司全名。" },
      { path: "data[].short_name", type: "string", description: "公司簡稱。" },
      { path: "data[].market", type: "string", description: "市場識別（例如 TWSE、TPEx）。" },
      { path: "data[].exchange", type: "string", description: "上市櫃別。" },
      { path: "data[].industry", type: "string", description: "主要產業分類。" },
      { path: "data[].listing_status", type: "string", description: "掛牌狀態（例如 active）。" },
      { path: "source_role", type: "string", description: "資料來源角色（canonical / fallback / helper）。" },
      { path: "freshness", type: "string", description: "資料更新時間或有效時間。" },
      { path: "lineage.trace_id", type: "string", description: "資料追蹤識別碼。" },
    ],
    notes: [
      "建議使用 ticker 作為 join key。",
      "不建議以 company_name 作為主要匹配欄位。",
      "靜態資料應可快取，不需高頻重複請求。",
      "若資料需與價格/財報整合，應保留 ticker 與 market 欄位。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["適用方案：Free（限制） / Developer / Pro / Enterprise"],
    },
    errorCases: [
      "200：成功回傳資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的公司資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳資料。",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤。",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "ticker 格式錯誤，請使用有效股票代碼。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key。",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少有效的 X-API-Key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料。",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案未開放 company_profile，請升級方案後重試。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的公司資料。",
          body: JSON.stringify(
            {
              dataset: "company_profile",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的公司資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildCompanyProfileApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes / 使用建議", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildFinancialMetricsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/financial-metrics";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/financial-metrics",
    headers=headers,
    params={"ticker": "2330", "period": "quarterly"}
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/financial-metrics?ticker=2330&period=quarterly&limit=10",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/financial-metrics?ticker=2330&period=quarterly&limit=10" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "financial_metrics",
      source_role: "canonical",
      freshness: "2026-04-22T11:30:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T11:30:05+08:00",
        trace_id: "financial_metrics_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          report_period: "2025-Q4",
          revenue_growth: 0.18,
          gross_margin: 0.53,
          operating_margin: 0.42,
          net_margin: 0.36,
          roe: 0.28,
          roa: 0.18,
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "財務與分析",
    endpoint,
    method: "GET",
    overview: [
      "財報指標 API 提供基於財報資料計算後的分析欄位，例如成長率、利潤率與估值相關指標。",
      "這一層資料的特性：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "已完成標準化與計算",
      "可直接用於篩選與比較",
      "避免每次重複自行計算",
      "與財報資料的差異：",
      "財報資料：原始數據（revenue、assets 等）",
      "財報指標：已計算數據（margin、growth、ratio）",
      "建立選股條件（例如 ROE、毛利率）",
      "計算成長與趨勢",
      "排序與 ranking",
      "與價格資料整合做策略",
      "作為 agent workflow 的分析層",
    ],
    gettingStarted: [
      "優先使用 ticker + period。",
      "對 ranking / screening，可批量查詢。",
      "若要長期分析，應落地資料。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼。" },
      { name: "period", type: "string", required: false, description: "資料期間（quarterly / annual）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數。" },
      { name: "offset", type: "integer", required: false, description: "分頁。" },
    ],
    responseSummary: [
      "所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。",
    ],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].report_period", type: "string", description: "報導期間。" },
      { path: "data[].revenue_growth", type: "number", description: "營收成長率。" },
      { path: "data[].gross_margin", type: "number", description: "毛利率。" },
      { path: "data[].operating_margin", type: "number", description: "營業利益率。" },
      { path: "data[].net_margin", type: "number", description: "淨利率。" },
      { path: "data[].roe", type: "number", description: "股東權益報酬率。" },
      { path: "data[].roa", type: "number", description: "資產報酬率。" },
      { path: "data[].eps", type: "number|null", description: "每股盈餘（若 schema 提供）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + report_period 作為主要識別鍵。",
      "不需重新計算已提供的指標欄位。",
      "ranking / screening 建議直接使用此 API。",
      "與價格資料整合時，請注意時間對齊。",
      "若需要完整控制計算邏輯，應改用財報資料自行計算。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳財報指標資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 financial-metrics。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的財報指標資料",
          body: JSON.stringify(
            {
              dataset: "financial_metrics",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的財報指標資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildFinancialMetricsApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildMonthlyRevenueApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/monthly-revenue";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/monthly-revenue",
    headers=headers,
    params={"ticker": "2330", "limit": 24}
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/monthly-revenue?ticker=2330&limit=24",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/monthly-revenue?ticker=2330&limit=24" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "monthly_revenue",
      source_role: "canonical",
      freshness: "2026-04-22T11:45:00+08:00",
      lineage: {
        source: "MOPS",
        ingested_at: "2026-04-22T11:45:05+08:00",
        trace_id: "monthly_revenue_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          revenue_month: "2026-03",
          revenue: 210000000000,
          revenue_yoy: 0.18,
          revenue_mom: 0.05,
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "財務與分析",
    endpoint,
    method: "GET",
    overview: [
      "月營收 API 提供公司每月營運表現的關鍵數據，是台股市場中最常用的高頻基本面資料之一。",
      "這類資料的特性包括：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "更新頻率高（每月）",
      "可快速反映營運變化",
      "常用於提前觀察趨勢",
      "與其他資料的差異：",
      "財報資料：低頻（季度 / 年度），但完整",
      "月營收：高頻，但較單一指標",
      "財報指標：已計算分析結果",
      "觀察營收成長趨勢",
      "提前判斷基本面變化",
      "建立營收動能策略",
      "與價格資料對照短期反應",
      "作為量化模型中的輸入特徵",
    ],
    gettingStarted: [
      "優先使用 ticker 查詢單一公司。",
      "若需要趨勢分析，建議拉取至少 12～24 個月資料。",
      "若做回測或策略，建議資料落地後再使用。",
      "若與財報整合，應保留月份與期間欄位。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（建議用於控制月份數）。" },
      { name: "offset", type: "integer", required: false, description: "分頁。" },
    ],
    responseSummary: [
      "所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。",
    ],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].revenue_month", type: "string", description: "營收月份（例如 2026-03）。" },
      { path: "data[].revenue", type: "number", description: "當月營收。" },
      { path: "data[].revenue_yoy", type: "number|null", description: "年增率（若目前 schema 有）。" },
      { path: "data[].revenue_mom", type: "number|null", description: "月增率（若目前 schema 有）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + revenue_month 作為識別。",
      "若要分析成長，應搭配 yoy / mom。",
      "若要做策略，建議與價格資料整合。",
      "若需要完整財務結構，應搭配財報資料。",
      "若做 ranking，可直接用 revenue 或 growth 指標。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳月營收資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 monthly-revenue。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的月營收資料",
          body: JSON.stringify(
            {
              dataset: "monthly_revenue",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的月營收資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildMonthlyRevenueApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildPriceDataApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/price-enhanced";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/price-enhanced",
    headers=headers,
    params={
        "ticker": "2330",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 60
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/price-enhanced?ticker=2330&start_date=2026-01-01&end_date=2026-04-30&limit=60",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/price-enhanced?ticker=2330&start_date=2026-01-01&end_date=2026-04-30&limit=60" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "price_enhanced",
      source_role: "canonical",
      freshness: "2026-04-22T12:15:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T12:15:05+08:00",
        trace_id: "price_enhanced_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          date: "2026-04-22",
          open: 812,
          high: 818,
          low: 808,
          close: 815,
          volume: 18234000,
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場資料",
    endpoint,
    method: "GET",
    overview: [
      "股價資料 API 提供 TWSE / TPEx 的未還原（unadjusted）市場價格資料，包含開盤、最高、最低、收盤與成交量等欄位，是最基礎也最常用的市場時間序列資料之一。",
      "這類資料的特性包括：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "更新頻率高",
      "適合做價格序列分析",
      "可作為其他資料層的基準時間軸",
      "與其他資料的差異：",
      "股價資料：原始價格與成交資訊",
      "還原價格：已調整公司行動後的價格序列",
      "技術指標：由價格計算出的分析欄位",
      "估值資料：價格與基本面結合後的市場評價結果",
      "建立價格時間序列研究",
      "作為回測與策略模擬的基礎資料",
      "對照公告、財報與事件的市場反應",
      "生成技術特徵或衍生分析欄位",
      "作為其他 dataset 的時間對齊基準",
      "如果你的目的是保留最原始的市場表現，應優先使用股價資料（未還原）；如果需要處理股利、分割或其他權益事件，則應改用還原價格資料。",
    ],
    gettingStarted: [
      "優先使用 ticker + 日期範圍。",
      "對長期資料請分段抓取，不要一次查詢過長區間。",
      "若要做回測或長期策略，建議落地後再使用。",
      "若後續要與事件或財報整合，請保留交易日期欄位。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。"],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].date", type: "string", description: "交易日期。" },
      { path: "data[].open", type: "number", description: "開盤價。" },
      { path: "data[].high", type: "number", description: "最高價。" },
      { path: "data[].low", type: "number", description: "最低價。" },
      { path: "data[].close", type: "number", description: "收盤價。" },
      { path: "data[].volume", type: "number", description: "成交量。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + date 作為主要識別組合。",
      "若要做回測，請先確認是否需要改用還原價格。",
      "若要做技術分析，通常應先取得股價資料，再搭配技術指標頁面。",
      "若要與事件資料對照，請保留日期欄位並注意交易日對齊。",
      "對長期研究建議先完整抓取並落地，不要重複高頻查詢同一段歷史區間。",
      "日期以 Asia/Taipei 交易日語意（YYYY-MM-DD）為準。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: [
      "200：成功回傳股價資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的股價資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳股價資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 price-enhanced。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的股價資料",
          body: JSON.stringify(
            {
              dataset: "price_enhanced",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的股價資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildPriceDataApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildIssuerAnnouncementsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/issuer-announcements";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/issuer-announcements",
    headers=headers,
    params={
        "ticker": "2330",
        "limit": 20
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/issuer-announcements?ticker=2330&limit=20",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/issuer-announcements?ticker=2330&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "events",
      source_role: "canonical",
      freshness: "2026-04-22T10:15:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T10:15:04+08:00",
        trace_id: "issuer_announcements_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          event_date: "2026-04-22",
          title: "公告本公司董事會通過第一季財務報告",
          event_type: "financial_report",
          summary: "董事會決議通過 2026 年第一季財務報告。",
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "公司與事件",
    endpoint,
    method: "GET",
    overview: [
      "公告資訊 API 提供公司對外揭露的事件型資料，可用於追蹤個股異動、建立事件時間線，或與價格、財報、月營收等資料整合分析。",
      "這類資料的特性包括：",
    ],
    requestDescription: [
      "使用此 endpoint 時，建議：",
    ],
    useCases: [
      "更新節奏不固定，但具高度事件價值",
      "適合用於事件驅動研究與監控流程",
      "通常需要與 ticker、日期與其他資料集一起使用",
      "追蹤單一公司的公告歷史",
      "建立重大事件時間線",
      "將公告事件與價格反應進行對照",
      "作為研究流程中的事件標記層",
      "將公告資料接入 agent workflow 作為文本型 context 入口",
      "公告資訊不應被視為單純的新聞摘要，而是正式揭露資料的一部分。若要在研究或正式流程中使用，建議保留事件時間、ticker 與來源資訊。",
    ],
    gettingStarted: [
      "優先使用 ticker 查詢單一公司",
      "以日期範圍或 limit 控制查詢量",
      "對長期間資料做分批抓取，而不是一次請求過大範圍",
      "若後續要與價格或財報資料整合，應保留 ticker 與 event_date",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司公告資料。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: [
      "所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。",
    ],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].event_date", type: "string", description: "事件日期或公告發布日期。" },
      { path: "data[].title", type: "string", description: "公告標題。" },
      { path: "data[].event_type", type: "string", description: "公告或事件類型。" },
      { path: "data[].summary", type: "string|null", description: "摘要內容（若 schema 提供）。" },
      { path: "data[].source_url", type: "string|null", description: "原始來源連結（若 schema 提供）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + event_date 作為主要識別組合。",
      "若要與價格資料整合，應保留事件發生時間。",
      "對長期研究建議落地存放，不要重複高頻請求同一批事件。",
      "若要接入 agent 或分析流程，建議將公告資料視為事件層，而不是靜態 company metadata。",
      "若同時需要正式揭露與高階分析，應搭配 company-profile、financial-statements 或 monthly-revenue 一起使用。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: [
      "200：成功回傳公告資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的公告資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳公告資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 issuer_announcements。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的公告資料",
          body: JSON.stringify(
            {
              dataset: "events",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的公告資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildIssuerAnnouncementsApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildEventsCalendarApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/events";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/events",
    headers=headers,
    params={
        "ticker": "2330",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 20
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/events?ticker=2330&start_date=2026-01-01&end_date=2026-04-30&limit=20",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/events?ticker=2330&start_date=2026-01-01&end_date=2026-04-30&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "events",
      source_role: "canonical",
      freshness: "2026-04-22T10:30:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T10:30:05+08:00",
        trace_id: "events_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          event_date: "2026-04-18",
          event_type: "board_meeting",
          title: "董事會通過第一季財務報告",
          summary: "董事會決議通過 2026 年第一季財務報告。",
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "公司與事件",
    endpoint,
    method: "GET",
    overview: [
      "事件日曆 API 提供可按時間檢索的公司事件資料，適合用於研究流程、監控系統與事件驅動分析。",
      "這類資料的特性包括：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "以時間為核心索引",
      "適合建立事件時間線",
      "可與價格、財報、公告等資料一起使用",
      "查詢特定公司在一段期間內的重要事件",
      "建立事件時間線並觀察前後市場反應",
      "將事件資料與價格或月營收資料整合分析",
      "將事件節點作為 research pipeline 的標記層",
      "提供 agent workflow 可引用的事件 context",
      "事件日曆適合用於時間序列上的事件檢視；相較公告資訊頁面，這一頁更強調事件時間、範圍查詢與時間線用途。",
    ],
    gettingStarted: [
      "優先使用 ticker + 日期範圍",
      "以 start_date / end_date 控制時間區間",
      "若查詢範圍較大，請搭配 limit 與分頁處理",
      "若要與其他資料整合，請保留 ticker 與 event_date",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司的事件資料。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。"],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].event_date", type: "string", description: "事件日期。" },
      { path: "data[].event_type", type: "string", description: "事件類型。" },
      { path: "data[].title", type: "string", description: "事件標題。" },
      { path: "data[].summary", type: "string|null", description: "事件摘要（若目前 schema 有）。" },
      { path: "data[].source_url", type: "string|null", description: "原始來源連結（若目前 schema 有）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + event_date 作為主要識別組合。",
      "若要與價格資料整合，應保留事件時間。",
      "對長期研究建議先抓取後落地存放，不要重複高頻查詢。",
      "若同時需要文本細節，應搭配公告資訊頁面一起使用。",
      "若要做事件驅動策略，應先確認 freshness 與時間對齊邏輯。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: [
      "200：成功回傳事件資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的事件資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳事件資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 events。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的事件資料",
          body: JSON.stringify(
            {
              dataset: "events",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的事件資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildEventsCalendarApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildStructuredEventsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/structured-events";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/structured-events",
    headers=headers,
    params={
        "ticker": "2330",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 20
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/structured-events?ticker=2330&start_date=2026-01-01&end_date=2026-04-30&limit=20",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/structured-events?ticker=2330&start_date=2026-01-01&end_date=2026-04-30&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "events",
      source_role: "canonical",
      freshness: "2026-04-22T10:45:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T10:45:05+08:00",
        trace_id: "structured_events_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          event_date: "2026-04-18",
          event_type: "financial_report",
          title: "董事會通過第一季財務報告",
          summary: "董事會決議通過 2026 年第一季財務報告。",
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "公司與事件",
    endpoint,
    method: "GET",
    overview: [
      "結構化事件 API 提供已整理為可分析欄位的事件資料，適合用於研究、監控系統與事件驅動 workflow。",
      "相較於原始公告資訊，這一頁更強調：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "事件欄位已被結構化整理",
      "更適合直接做篩選、分類與統計",
      "便於與價格、財報、月營收等資料整合",
      "依事件類型篩選公司事件",
      "建立事件驅動研究流程",
      "將事件作為回測或監控條件",
      "與價格反應或基本面變化進行對照",
      "作為 agent workflow 中的結構化事件層",
      "如果公告資訊偏向原始文本入口，結構化事件則更適合直接作為分析資料使用。",
    ],
    gettingStarted: [
      "優先使用 ticker + 日期範圍查詢",
      "若要做事件篩選，可搭配事件類型欄位",
      "若資料量較大，請搭配 limit 與分頁處理",
      "若後續要與價格或財報資料整合，應保留 ticker 與 event_date",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司的結構化事件資料。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期。" },
      { name: "event_type", type: "string", required: false, description: "事件類型（若目前 schema 有正式支持）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。"],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].event_date", type: "string", description: "事件日期。" },
      { path: "data[].event_type", type: "string", description: "結構化後的事件類型。" },
      { path: "data[].title", type: "string", description: "事件標題。" },
      { path: "data[].summary", type: "string|null", description: "事件摘要（若目前 schema 有）。" },
      { path: "data[].importance", type: "string|null", description: "事件重要性或事件層級（若目前 schema 有正式對外欄位）。" },
      { path: "data[].source_url", type: "string|null", description: "原始來源連結（若目前 schema 有）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + event_date + event_type 作為主要識別組合。",
      "若要做事件驅動研究，應保留事件時間與事件類型。",
      "若資料將用於回測，建議先落地並保留 freshness / lineage。",
      "若同時需要原始文本細節，應搭配公告資訊頁面一起使用。",
      "若只需要時間線檢視，可搭配事件日曆頁面使用。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: [
      "200：成功回傳結構化事件資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的事件資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳結構化事件資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 structured-events。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的事件資料",
          body: JSON.stringify(
            {
              dataset: "events",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的事件資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildStructuredEventsApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildCorporateActionsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/corporate-actions";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/corporate-actions",
    headers=headers,
    params={
        "ticker": "2330",
        "start_date": "2024-01-01",
        "end_date": "2026-04-30",
        "limit": 20
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/corporate-actions?ticker=2330&start_date=2024-01-01&end_date=2026-04-30&limit=20",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/corporate-actions?ticker=2330&start_date=2024-01-01&end_date=2026-04-30&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "corporate_actions",
      source_role: "canonical",
      freshness: "2026-04-22T11:00:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T11:00:05+08:00",
        trace_id: "corporate_actions_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          event_date: "2025-06-12",
          action_type: "cash_dividend",
          title: "現金股利除息",
          cash_amount: 3.5,
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "公司與事件",
    endpoint,
    method: "GET",
    overview: [
      "公司行動 API 提供與股東權益、持有部位與價格調整直接相關的事件資料，例如股利、分割、減資、增資或其他需要納入資料處理邏輯的公司行為。",
      "這類資料和一般公告不同。",
      "它的重點不在於文字揭露本身，而在於是否需要影響價格序列、持有報酬、部位計算或研究樣本的解讀方式。",
      "典型用途包括：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "建立還原價格與總報酬序列",
      "在回測中處理股利、分割與其他權益事件",
      "將公司行動作為資料清洗與正規化流程的一部分",
      "檢查特定期間內是否有會影響比較基準的公司事件",
      "與歷史價格、股利資料或公司事件資料一起交叉驗證",
      "如果事件日曆偏向發生了什麼，公司行動更偏向這個事件是否需要改變資料處理方式。",
    ],
    gettingStarted: [
      "優先以 ticker + 日期範圍查詢",
      "對需要長期序列處理的資料，先完整抓取再落地",
      "若後續要做還原價格或總報酬分析，應保留 event_date 與 action_type",
      "不要把公司行動資料視為一般公告列表；它更接近價格與持有資料的校正層",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司的公司行動資料。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期。" },
      { name: "action_type", type: "string", required: false, description: "公司行動類型（若目前 schema 有正式支持）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。"],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].event_date", type: "string", description: "公司行動生效或公告日期。" },
      { path: "data[].action_type", type: "string", description: "公司行動類型。" },
      { path: "data[].title", type: "string", description: "事件標題。" },
      { path: "data[].cash_amount", type: "number|null", description: "現金配發或相關金額（若目前 schema 有）。" },
      { path: "data[].ratio", type: "number|string|null", description: "配發比例、分割比例或相關比率（若目前 schema 有）。" },
      { path: "data[].source_url", type: "string|null", description: "原始來源連結（若目前 schema 有）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + event_date + action_type 作為主要識別組合。",
      "若要做還原價格，應與價格資料搭配使用。",
      "若要做總報酬或持有報酬分析，應保留現金與比例類欄位。",
      "對長期研究建議先完整抓取並落地，不要反覆即時查詢。",
      "若只需要一般事件追蹤，應改用事件日曆或公告資訊頁面。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: [
      "200：成功回傳公司行動資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的公司行動資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳公司行動資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 corporate-actions。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的公司行動資料",
          body: JSON.stringify(
            {
              dataset: "corporate_actions",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的公司行動資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildCorporateActionsApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

function buildDividendsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/dividends";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/dividends",
    headers=headers,
    params={
        "ticker": "2330",
        "start_date": "2024-01-01",
        "end_date": "2026-04-30",
        "limit": 20
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/dividends?ticker=2330&start_date=2024-01-01&end_date=2026-04-30&limit=20",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/dividends?ticker=2330&start_date=2024-01-01&end_date=2026-04-30&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "dividends",
      source_role: "canonical",
      freshness: "2026-04-22T11:15:00+08:00",
      lineage: {
        source: "TWSE",
        ingested_at: "2026-04-22T11:15:05+08:00",
        trace_id: "dividends_2330_20260422",
      },
      data: [
        {
          ticker: "2330",
          event_date: "2025-06-12",
          dividend_type: "cash_dividend",
          cash_amount: 3.5,
          title: "現金股利除息",
        },
      ],
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "公司與事件",
    endpoint,
    method: "GET",
    overview: [
      "股利資料 API 提供公司對股東的分配資訊，包含現金股利、股票股利與相關除權息事件資料。這類資料適合用於股利策略、報酬分析與長期持有研究。",
      "與一般公告或事件資料不同，股利資料的核心價值在於可量化的股東回報資訊。",
      "它不只是事件發生與否，而是可以直接影響殖利率、持有報酬與價格調整邏輯的資料。",
      "典型用途包括：",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "計算現金殖利率",
      "建立總報酬與股利再投資研究",
      "驗證除權息前後價格表現",
      "將股利資料納入因子、選股或長期持有策略",
      "與公司行動、價格資料一起交叉檢查權益調整",
      "如果公司行動頁面偏向哪些事件會影響資料處理，股利資料頁面則更聚焦於股東實際收到的分配與對報酬的影響。",
    ],
    gettingStarted: [
      "優先以 ticker + 日期範圍查詢",
      "若要做歷史股利研究，應完整抓取後再落地",
      "若要做殖利率或總報酬分析，應保留除息日與股利金額",
      "若資料將與價格整合，請保留 event_date 與 dividend_type",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司的股利資料。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期。" },
      { name: "dividend_type", type: "string", required: false, description: "股利類型（若目前 schema 有正式支持）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["所有回應遵循一致結構，包含 dataset、source_role、freshness、lineage、data。"],
    responseFields: [
      { path: "data[].ticker", type: "string", description: "股票代碼。" },
      { path: "data[].event_date", type: "string", description: "股利事件日期或除權息相關日期。" },
      { path: "data[].dividend_type", type: "string", description: "股利類型，例如現金股利或股票股利。" },
      { path: "data[].cash_amount", type: "number|null", description: "現金股利金額（若目前 schema 有）。" },
      { path: "data[].stock_ratio", type: "number|string|null", description: "股票股利比例（若目前 schema 有）。" },
      { path: "data[].title", type: "string|null", description: "事件標題（若目前 schema 有）。" },
      { path: "data[].source_url", type: "string|null", description: "原始來源連結（若目前 schema 有）。" },
      { path: "source_role", type: "string", description: "資料來源角色。" },
      { path: "freshness", type: "string", description: "資料更新時間。" },
      { path: "lineage.trace_id", type: "string", description: "可追蹤資料處理鏈路。" },
    ],
    notes: [
      "使用 ticker + event_date + dividend_type 作為主要識別組合。",
      "若要做殖利率分析，應保留現金股利金額與除息時間。",
      "若要做總報酬研究，應與還原價格或公司行動資料一起使用。",
      "對長期研究建議先完整抓取並落地，不要重複即時查詢。",
      "若只需要查看是否有事件發生，應改用事件日曆；若要做權益調整，應搭配公司行動頁面。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"],
    },
    errorCases: [
      "200：成功回傳股利資料",
      "400：查詢參數錯誤",
      "401：缺少或無效 API key",
      "403：目前方案無法存取此資料",
      "404：查無符合條件的股利資料",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        {
          status: "200",
          description: "成功回傳股利資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              error: {
                code: "BAD_REQUEST",
                message: "查詢參數錯誤。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "缺少或無效 API key。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify(
            {
              error: {
                code: "FORBIDDEN",
                message: "目前方案無法存取 dividends。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的股利資料",
          body: JSON.stringify(
            {
              dataset: "dividends",
              source_role: "canonical",
              data: [],
              message: "查無符合條件的股利資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildDividendsApiSections(): DocsContentSection[] {
  return [
    { id: "overview", label: "Overview", paragraphs: [] },
    { id: "request", label: "Request", paragraphs: [] },
    { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
    { id: "response-shape", label: "Response Shape", paragraphs: [] },
    { id: "field-reference", label: "Field 說明", paragraphs: [] },
    { id: "usage-notes", label: "Usage Notes", paragraphs: [] },
    { id: "plan-requirement", label: "Plan Requirement", paragraphs: [] },
  ];
}

const workflowPageCatalog: Array<{
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  sections: DocsContentSection[];
}> = [
  {
    slug: "company-fundamentals",
    navLabel: "查看公司基本面",
    title: "查看公司基本面",
    subtitle: "學會如何用台股資料 API 快速查看一家公司的基本面，包含公司資料、財報、財報指標與月營收趨勢。",
    sections: [
      {
        id: "overview",
        label: "Overview",
        paragraphs: [
          "查看公司基本面通常不只是一個 API request，而是一個由多個資料主題組成的流程。",
          "在實務上，常見的基本面檢查會包含：",
        ],
        bullets: [
          "公司基本資料：確認 ticker、公司名稱、市場別與產業分類",
          "財報資料：查看營收、獲利、資產負債與現金流",
          "財報指標：快速判斷毛利率、營業利益率、ROE 等分析欄位",
          "月營收：補充較高頻的營運變化訊號",
          "這一頁會帶你用一套固定流程，從單一 ticker 出發，逐步把一家公司的核心基本面資料串起來。",
        ],
      },
      {
        id: "prerequisites",
        label: "Prerequisites",
        paragraphs: ["開始前，請先確認："],
        bullets: [
          "你已取得 API key",
          "你知道要查詢的股票代碼，例如 2330",
          "你可以使用 Python、JavaScript 或 cURL 發送 request",
          "你了解不同資料主題的更新頻率不同：財報較低頻，月營收較高頻",
        ],
      },
      {
        id: "step-1-company-profile",
        label: "Step 1：先查公司基本資料",
        paragraphs: [
          "第一步先確認公司主體資訊。這可以幫你確認 ticker 是否正確，並建立後續 join 與資料整理的基礎。",
          "建議先查：",
        ],
        bullets: ["公司名稱", "市場別", "產業分類", "上市狀態"],
        codeBlocks: [
          {
            language: "python",
            code: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/company-profile",
    headers=headers,
    params={"ticker": "2330"},
)

print(response.json())`,
          },
        ],
      },
      {
        id: "step-2-financial-statements",
        label: "Step 2：取得財報資料",
        paragraphs: [
          "第二步用財報資料取得原始數據。這一層適合查看營收、淨利、資產負債與現金流結構。",
          "建議先查近 4～8 季，確認季節性與趨勢，再決定是否擴展到年度資料。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/financial-statements",
    headers=headers,
    params={"ticker": "2330", "period": "quarterly", "limit": 8},
)

print(response.json())`,
          },
        ],
      },
      {
        id: "step-3-financial-metrics",
        label: "Step 3：取得財報指標",
        paragraphs: [
          "第三步改用財報指標層。這一層是已計算好的分析欄位，適合快速比較與篩選。",
          "你可以優先關注毛利率、營業利益率、ROE 等欄位，快速判讀公司基本面品質。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/financial-metrics",
    headers=headers,
    params={"ticker": "2330", "period": "quarterly", "limit": 8},
)

print(response.json())`,
          },
        ],
      },
      {
        id: "step-4-monthly-revenue",
        label: "Step 4：補充月營收趨勢",
        paragraphs: [
          "第四步補上月營收，用較高頻的資料觀察近期營運變化。",
          "如果財報顯示長期結構，而月營收可以補足短期變化，兩者一起看通常更完整。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/monthly-revenue",
    headers=headers,
    params={"ticker": "2330", "limit": 24},
)

print(response.json())`,
          },
        ],
      },
      {
        id: "step-5-integration-flow",
        label: "Step 5：整合成基本面檢查流程",
        paragraphs: [
          "把前面四步整合後，你可以建立一個固定的基本面檢查順序：",
        ],
        bullets: [
          "先查 company-profile，確認公司識別",
          "再查 financial-statements，取得原始財報數據",
          "再查 financial-metrics，快速做分析判讀",
          "最後補 monthly-revenue，觀察近期營運趨勢",
          "若要進一步策略化，建議把這套流程落地成可重複執行的 pipeline。",
        ],
      },
      {
        id: "next-steps",
        label: "Next Steps",
        paragraphs: ["完成基本面流程後，可繼續："],
        bullets: [
          "搭配股價資料做事件前後對照：/docs/api/market-prices/price-data",
          "搭配查詢工具做批量拉取：/docs/api/query-tools/query-api",
          "搭配 Explainability 驗證欄位與來源：/docs/api/query-tools/explainability",
          "延伸到策略場景：/docs/workflows/strategy-ai",
        ],
      },
    ],
  },
  {
    slug: "capital-flow",
    navLabel: "看籌碼",
    title: "看籌碼",
    subtitle: "結合法人買賣與融資融券，觀察資金方向與風險偏好。",
    sections: [
      { id: "problem", label: "這個 workflow 解決什麼問題", paragraphs: ["用一致口徑追蹤市場資金流向，降低單一指標誤判。"] },
      { id: "datasets", label: "用到哪些 API / dataset", paragraphs: [], bullets: ["institutional_flow", "margin_short"] },
      {
        id: "minimal-flow",
        label: "最小使用流程",
        paragraphs: [],
        bullets: ["先看 institutional_flow 判斷法人方向", "再看 margin_short 觀察槓桿變化", "比對兩者是否同向，建立風險訊號"],
      },
      { id: "order", label: "建議先後順序", paragraphs: ["先資金方向、再槓桿結構；必要時再搭配股價做驗證。"] },
      { id: "next", label: "可延伸搭配頁面", paragraphs: ["/docs/api/market-prices/price-data、/docs/workflows/market-status"] },
    ],
  },
  {
    slug: "market-status",
    navLabel: "看市場狀態",
    title: "看市場狀態",
    subtitle: "透過指數與市場廣度辨識整體盤勢與結構變化。",
    sections: [
      { id: "problem", label: "這個 workflow 解決什麼問題", paragraphs: ["快速判斷市場是普漲普跌、區間震盪，或由少數權值股帶動。"] },
      { id: "datasets", label: "用到哪些 API / dataset", paragraphs: [], bullets: ["index_data", "market_breadth"] },
      {
        id: "minimal-flow",
        label: "最小使用流程",
        paragraphs: [],
        bullets: ["先看 index_data 判斷大盤方向", "再看 market_breadth 觀察上漲/下跌家數與結構", "搭配利率快照補充宏觀環境"],
      },
      { id: "order", label: "建議先後順序", paragraphs: ["先方向、再廣度、最後補宏觀；可降低短線噪音干擾。"] },
      { id: "next", label: "可延伸搭配頁面", paragraphs: ["/docs/api/market-prices/interest-rate、/docs/api/market-prices/technical-indicators"] },
    ],
  },
  {
    slug: "fast-data-access",
    navLabel: "快速查資料",
    title: "快速查資料",
    subtitle: "先搜尋再查詢，再用 Explainability 驗證來源與公式。",
    sections: [
      { id: "problem", label: "這個 workflow 解決什麼問題", paragraphs: ["把查資料流程從『找不到資料』變成『可快速定位、可驗證、可落地』。"] },
      { id: "datasets", label: "用到哪些 API / dataset", paragraphs: [], bullets: ["/v2/search", "/v2/query", "explainability layer"] },
      {
        id: "minimal-flow",
        label: "最小使用流程",
        paragraphs: [],
        bullets: ["用 Search API 先找標的與主題", "用 Query API 取回指定欄位", "用 Explainability 檢查來源角色與計算邏輯"],
      },
      { id: "order", label: "建議先後順序", paragraphs: ["先定位（search）再提取（query）最後驗證（explainability）。"] },
      { id: "next", label: "可延伸搭配頁面", paragraphs: ["/docs/api/query-tools/search-api、/docs/api/query-tools/query-api、/docs/api/query-tools/explainability"] },
    ],
  },
  {
    slug: "strategy-ai",
    navLabel: "做策略 / AI",
    title: "做策略 / AI",
    subtitle: "以 features、factor_data、time_alignment 建立策略與 agent 可用資料流。",
    sections: [
      { id: "problem", label: "這個 workflow 解決什麼問題", paragraphs: ["把策略研究與 AI workflow 的資料準備流程標準化，降低特徵口徑不一致風險。"] },
      { id: "datasets", label: "用到哪些 API / dataset", paragraphs: [], bullets: ["features", "factor_data", "time_alignment"] },
      {
        id: "minimal-flow",
        label: "最小使用流程",
        paragraphs: [],
        bullets: ["用 features 做快速訊號判讀", "用 factor_data 建立結構化因子集", "用 time_alignment 對齊決策時間點與資料時間"],
      },
      { id: "order", label: "建議先後順序", paragraphs: ["先判讀、再建模、最後對齊；可降低回測與即時執行偏差。"] },
      {
        id: "next",
        label: "可延伸搭配頁面",
        paragraphs: ["/docs/api/query-tools/query-api、/docs/api/query-tools/explainability、/docs/workflows/fast-data-access"],
      },
    ],
  },
];

const gettingStartedExtraPages: DocsPageEntry[] = [
  {
    slug: ["authentication"],
    href: "/docs/authentication",
    navLabel: "認證方式",
    category: "overview",
    icon: "shield",
    title: "認證方式",
    subtitle:
      "所有 API 請求皆透過 API key 驗證。每一個 request 都必須在 header 中帶入 X-API-Key，平台會依據該金鑰對應的方案、權限與使用限制處理請求。",
    tier: "complete",
    sections: [
      {
        id: "auth-method",
        label: "認證方式",
        paragraphs: [
          "認證機制的目的不只是識別使用者，也包括請求隔離、使用量統計、速率控制與存取追蹤。",
          "若你將資料接入研究流程、策略系統、agent workflow 或內部平台，應將金鑰管理視為正式基礎設施的一部分，而不是單純的登入資訊。",
          "平台目前採用 API key 認證。請將 API key 放入每一個 request 的 X-API-Key header 中，再搭配對應的 endpoint 與查詢參數發送請求。",
          "這種設計的優點是簡單、穩定，且容易整合進現有系統。無論你使用的是後端服務、排程任務、資料管線、研究腳本或自動化 agent，都可以在不依賴 session 的情況下直接完成存取控制。",
          "每個 API key 都會對應到明確的方案與使用限制，例如請求速率、可用資料範圍、歷史深度與商業使用權限。因此，認證不只是「能不能呼叫 API」，也是平台套用 entitlement 與治理規則的入口。",
        ],
      },
      {
        id: "why-api-key",
        label: "為什麼使用 API key",
        paragraphs: [
          "對資料基礎設施產品而言，認證的需求不只是在入口阻擋未授權請求，更重要的是讓每一次資料存取都能被正確歸屬、計量與限制。",
          "第一，系統可以將每次請求明確歸屬到特定帳號、團隊或環境，避免不同服務之間共用同一身份，造成追蹤困難。",
          "第二，平台可以依據方案套用速率限制、並發限制與可用資料範圍，讓同一套 API 在不同授權下維持可預測行為。",
          "第三，當某個服務需要輪替金鑰、停用金鑰或隔離風險時，不必影響其他系統。",
          "第四，使用量統計、稽核紀錄與後續支援處理，都能以金鑰為基礎建立更清楚的責任邊界。",
          "如果你的系統中同時存在開發、測試與正式環境，或同時有研究腳本、排程任務與線上服務，API key 幾乎都是最容易治理的認證方式。",
        ],
      },
      {
        id: "request-pattern",
        label: "請求方式",
        paragraphs: [
          "每次請求都應在 header 中帶入 X-API-Key。平台收到請求後，會先驗證金鑰是否存在、是否有效、是否已停用，接著再套用方案對應的權限與限制。",
          "在實務上，建議把 API key 視為伺服器端憑證，而不是前端參數。應由後端服務、排程系統、資料同步程序或安全的執行環境負責注入，而不要直接暴露在公開前端程式碼中。",
          "若請求未帶入金鑰、金鑰格式錯誤、金鑰已失效，或請求超出方案允許範圍，平台應回傳明確的認證或授權錯誤，讓呼叫端能分辨是憑證問題、權限問題，還是 rate limit 問題。",
        ],
      },
      {
        id: "key-management",
        label: "金鑰管理",
        paragraphs: [
          "建議不要讓所有系統共用同一把金鑰。較好的做法是依照環境與用途拆分，例如開發環境一把、正式環境一把、排程任務一把、對外服務一把。",
          "這樣做的好處是當某一組流程需要停用或輪替時，不會影響其他系統，也能更清楚追蹤使用來源。",
          "對於研究團隊與產品團隊而言，金鑰管理不應只是把字串存起來，而應有明確的治理規則。你需要知道哪一把金鑰屬於哪個服務、誰負責使用、部署在哪個環境，以及是否仍在有效使用中。",
          "若平台方案支援多把金鑰，應善用這個能力來區分服務邊界。若目前方案僅允許有限數量的金鑰，更應避免把同一把金鑰散落到多個應用中，否則後續輪替與排錯都會變得困難。",
        ],
      },
      {
        id: "security-notes",
        label: "安全注意事項",
        paragraphs: [
          "不要把 API key 寫入前端公開程式碼，不要把 API key 硬寫在可公開的 repository 中，也不要把 API key 放進會被第三方工具自動收集的前端 log、client error trace 或公開 notebook。",
          "建議把金鑰存放在環境變數、secret manager 或部署平台提供的安全憑證系統中。若你的系統已有 CI/CD、serverless、容器平台或任務排程環境，應使用對應的 secret 注入機制，而不是把金鑰直接寫死在設定檔中。",
          "若懷疑金鑰外洩，應立即停用並輪替。不要等到發生異常流量或授權問題後才處理。對於正式系統，金鑰輪替應是可以重複執行的標準流程，而不是臨時手動操作。",
        ],
      },
      {
        id: "auth-failures",
        label: "認證失敗與常見問題",
        paragraphs: ["若請求被拒絕，最常見的原因通常有幾類。"],
        bullets: [
          "沒有帶入 X-API-Key header。",
          "金鑰值錯誤、格式不完整，或複製時包含多餘空白字元。",
          "金鑰已被停用、輪替或撤銷。",
          "請求超出方案的速率、並發或資料存取範圍。",
          "使用的 endpoint 或資料主題並不包含在目前方案內。",
        ],
      },
      {
        id: "practical-guidance",
        label: "實務建議",
        paragraphs: [
          "在排查時，建議先確認 header 是否存在，再確認金鑰是否有效，最後再檢查是否命中方案限制。若你在後端有做 request logging，也應避免把完整金鑰直接寫入 log，只保留必要的遮罩資訊即可。",
          "若你只是剛開始接入，先用單一金鑰完成本地測試即可。但當你準備進入正式流程時，應盡快把金鑰管理納入環境分層、部署流程與權限治理。",
          "對於長期運行的資料產品，API key 不只是認證手段，它同時也是平台治理、使用量管理與可追溯性的基礎。將它當成正式基礎設施來管理，後續在擴充、排錯與商業化時會省下很多成本。",
        ],
      },
    ],
  },
  {
    slug: ["data-freshness-lineage"],
    href: "/docs/data-freshness-lineage",
    navLabel: "資料更新與 lineage",
    category: "overview",
    icon: "chart",
    title: "資料更新與 lineage",
    subtitle:
      "平台不只提供資料存取，也提供資料的更新機制與來源追蹤能力。每一筆資料都包含明確的更新時間與來源資訊，讓你可以判斷資料是否可用，並在需要時回溯資料來源。這對於研究、回測與 production 系統非常重要。當結果需要被驗證或重現時，你必須知道資料來自哪裡、何時更新、是否經過轉換，以及是否與當時決策使用的資料一致。",
    tier: "complete",
    sections: [
      {
        id: "update-mechanism",
        label: "資料更新機制",
        paragraphs: [
          "不同資料主題具有不同的更新頻率與特性。平台會依據資料來源與資料類型，設計對應的 ingestion 與更新流程。",
          "常見更新模式包括：",
          "在設計系統時，不應假設所有資料都是即時的。應依據資料類型與更新頻率，決定是否可以直接用於策略或需要做額外處理。",
        ],
        bullets: [
          "即時或近即時更新：用於行情資料與部分市場指標，資料在發布後短時間內即可取得",
          "定期更新：用於月營收、財報等資料，依據官方發布週期更新",
          "事件驅動更新：用於公告與公司事件，資料在事件發布後即被擷取與處理",
        ],
      },
      {
        id: "freshness",
        label: "freshness（資料時效）",
        paragraphs: [
          "每個 API 回應都包含 freshness 欄位，用於描述資料的時間狀態。",
          "這個欄位可以用來：",
          "實務上，應將 freshness 納入流程，而不是在應用邏輯中忽略。尤其在事件驅動或自動交易系統中，資料延遲可能直接影響結果。",
        ],
        bullets: [
          "判斷資料是否已更新",
          "避免使用過期資料進行決策",
          "在 pipeline 中設計條件（例如：資料未更新則暫停流程）",
        ],
      },
      {
        id: "lineage",
        label: "lineage（來源追蹤）",
        paragraphs: [
          "lineage 描述資料從來源到 API 回應的完整路徑。每筆資料都會附帶 lineage 資訊，讓你可以追蹤：",
          "這些資訊讓資料具備可審計性（auditability）。當你需要驗證某個結果時，可以回到原始來源，而不是依賴不可追蹤的中間資料。",
        ],
        bullets: [
          "資料來自哪個來源（例如 TWSE、TPEx、MOPS）",
          "何時被擷取（ingested_at）",
          "經過哪些處理流程",
          "對應的 trace identifier（trace_id）",
        ],
      },
      {
        id: "source-role",
        label: "source_role（來源角色）",
        paragraphs: [
          "平台會對資料來源進行分層標記：",
          "這樣的設計可以避免不同來源混用造成的不一致問題。在實務上，你可以根據 source_role 決定資料是否適合用於關鍵決策。",
        ],
        bullets: [
          "canonical：官方來源或最具權威性的資料",
          "fallback：當 canonical 資料缺失時使用的替代來源",
          "helper：用於補充或輔助計算的資料",
        ],
      },
      {
        id: "why-it-matters",
        label: "為什麼這很重要",
        paragraphs: [
          "在簡單的應用中，資料來源與更新時間可能不是主要問題。但在研究、策略開發與 production 系統中，這些資訊是必要條件。",
          "幾個典型場景：",
          "如果資料不可追溯，就無法驗證結果。這會讓系統在規模擴大時產生風險。",
        ],
        bullets: [
          "回測結果與實際交易不一致：需要確認當時使用的資料版本與來源",
          "模型輸出異常：需要追蹤資料是否延遲或來自 fallback",
          "多資料來源整合：需要確保欄位一致與時間對齊",
          "團隊協作：需要明確資料責任與來源",
        ],
      },
      {
        id: "practical-guidance",
        label: "實務建議",
        paragraphs: [
          "在實際系統中，建議把資料更新與 lineage 當成設計的一部分，而不是附加資訊。",
          "對於長期運行的系統，這些資訊會成為排錯與驗證的基礎。",
        ],
        bullets: [
          "在資料處理流程中保留 freshness 與 lineage",
          "不要在轉換或存儲時丟棄來源資訊",
          "在回測與 production 流程中使用相同資料條件",
          "對關鍵資料建立監控（例如更新延遲）",
        ],
      },
    ],
  },
];

const workflowPages: DocsPageEntry[] = workflowPageCatalog.map((workflow) => ({
  slug: ["workflows", workflow.slug],
  href: `/docs/workflows/${workflow.slug}`,
  navLabel: workflow.navLabel,
  category: "guides",
  icon: "guide",
  title: workflow.title,
  subtitle: workflow.subtitle,
  tier: "complete",
  sections: workflow.sections,
}));

const schemaReadyTopicPages: DocsPageEntry[] = schemaReadyGroups.flatMap((group) => {
  const groupPage: DocsPageEntry = {
    slug: hrefToSlug(group.href),
    href: group.href,
    navLabel: group.label,
    category: "api",
    apiSection: group.id,
    icon: group.icon,
    title: group.label,
    subtitle: "本分類收錄台股決策資料平台已具備 schema_ready 的正式主題，可直接作為 Data APIs 導覽入口。",
    tier: "complete",
    sections: [
      {
        id: "group-overview",
        label: "分類概覽",
        paragraphs: [
          `${group.label}為 Data APIs 主分類之一，對應可辨識的資料主題與文件路由。`,
          "本分類僅收錄目前已具備 schema_ready 的主題，不將規劃中項目標示為可用能力。",
        ],
      },
      {
        id: "integration",
        label: "接線方式",
        paragraphs: [
          "可由左側子項進入主題頁，確認 topic、table、docs route 與 endpoint 對照。",
          "建議先完成欄位驗證，再串接自動化流程與下游策略模組。",
        ],
      },
      {
        id: "status",
        label: "狀態標示",
        paragraphs: [
          "本分類內主題皆標示為 schema_ready。",
          "schema_ready 表示契約與文件可辨識，不等同於所有公開 API 都已全面開放。",
        ],
      },
    ],
  };

  const topicPages = group.topics.map<DocsPageEntry>((topic) => {
    if (topic.topicId === "issuer_profile") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "公司基本資料",
        subtitle: "提供台股發行人的基礎識別資料，適合用於 ticker 對照、公司資訊顯示與跨資料集整合。",
        tier: "complete",
        sections: buildCompanyProfileApiSections(),
        apiReference: buildCompanyProfileApiReference(),
      };
    }

    if (topic.topicId === "issuer_announcements") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "公告資訊",
        subtitle: "提供台股公司的公告與揭露事件資料，適合用於事件追蹤、研究流程與訊號整合。",
        tier: "complete",
        sections: buildIssuerAnnouncementsApiSections(),
        apiReference: buildIssuerAnnouncementsApiReference(),
      };
    }

    if (topic.topicId === "financial_metrics") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "財報指標",
        subtitle: "提供已計算完成的財務指標資料，適合用於研究、篩選與策略分析。",
        tier: "complete",
        sections: buildFinancialMetricsApiSections(),
        apiReference: buildFinancialMetricsApiReference(),
      };
    }

    if (topic.topicId === "monthly_revenue_enhanced") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "月營收",
        subtitle: "提供台股公司每月營收資料，適合用於營運趨勢追蹤與高頻基本面分析。",
        tier: "complete",
        sections: buildMonthlyRevenueApiSections(),
        apiReference: buildMonthlyRevenueApiReference(),
      };
    }

    if (topic.topicId === "price_enhanced") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "股價資料",
        subtitle: "提供台股市場的原始價格時間序列資料，適合用於回測、價格研究與事件對照分析。",
        tier: "complete",
        sections: buildPriceDataApiSections(),
        apiReference: buildPriceDataApiReference(),
      };
    }

    if (topic.topicId === "events") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "事件日曆",
        subtitle: "提供台股公司的事件型資料，適合用於建立事件時間線、事件追蹤與跨資料集分析。",
        tier: "complete",
        sections: buildEventsCalendarApiSections(),
        apiReference: buildEventsCalendarApiReference(),
      };
    }

    if (topic.topicId === "structured_events") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "結構化事件",
        subtitle: "提供經過整理與標準化的公司事件資料，適合用於事件驅動研究、篩選條件建構與自動化流程。",
        tier: "complete",
        sections: buildStructuredEventsApiSections(),
        apiReference: buildStructuredEventsApiReference(),
      };
    }

    if (topic.topicId === "corporate_actions_enhanced") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "公司行動",
        subtitle: "提供會影響持有人權益與價格序列的公司行動資料，適合用於還原價格、報酬計算與事件調整流程。",
        tier: "complete",
        sections: buildCorporateActionsApiSections(),
        apiReference: buildCorporateActionsApiReference(),
      };
    }

    if (topic.topicId === "dividends_corporate_actions_enhanced") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "股利資料",
        subtitle: "提供台股公司的股利分配資料，適合用於殖利率分析、總報酬計算與股利策略研究。",
        tier: "complete",
        sections: buildDividendsApiSections(),
        apiReference: buildDividendsApiReference(),
      };
    }

    return {
      slug: hrefToSlug(topic.href),
      href: topic.href,
      navLabel: topic.title,
      category: "api",
      apiSection: group.id,
      icon: topic.icon ?? group.icon,
      title: topic.title,
      subtitle: "schema_ready 主題頁，提供 topic、資料表、文件與 route 的對照資訊。",
      tier: "complete",
      sections: buildSchemaReadyTopicSections(topic),
    };
  });

  return [groupPage, ...topicPages];
});

const comingSoonDocsPages: DocsPageEntry[] = [
  {
    slug: ["coming-soon"],
    href: "/docs/coming-soon",
    navLabel: "規劃中 / Coming Soon",
    category: "api",
    apiSection: "coming-soon",
    icon: "advanced",
    title: "規劃中 / Coming Soon",
    subtitle: "以下主題目前為規劃中或來源受限，尚未作為正式可用主功能對外宣告。",
    tier: "placeholder",
    sections: [
      {
        id: "scope",
        label: "範圍",
        paragraphs: [
          "本區塊僅呈現規劃中主題，目的為提供 roadmap 可見性。",
          "所有項目均不視為已 live 功能。",
        ],
      },
      {
        id: "list",
        label: "主題清單",
        paragraphs: ["目前規劃中主題如下："],
        bullets: comingSoonTopics.map((topic) => topic.topicId),
      },
    ],
  },
  ...comingSoonTopics.map<DocsPageEntry>((topic) => ({
    slug: hrefToSlug(topic.href),
    href: topic.href,
    navLabel: topic.title,
    category: "api",
    apiSection: "coming-soon",
    icon: "advanced",
    title: topic.title,
    subtitle: "此主題目前為規劃中，尚未納入正式可用能力清單。",
    tier: "placeholder",
    sections: [
      {
        id: "status",
        label: "狀態",
        paragraphs: [
          `topic：${topic.topicId}`,
          "目前狀態：Coming Soon。",
          "此頁僅提供路由保留與資訊架構定位，不代表主功能已上線。",
        ],
      },
      {
        id: "availability",
        label: "可用性說明",
        paragraphs: [
          "尚未開放正式 public API。",
          "待 ingestion 與來源條件完成後，才會升級為 schema_ready 或 live 狀態。",
        ],
      },
      {
        id: "next-step",
        label: "下一步",
        paragraphs: [
          "建議先使用左側已可用主題完成系統串接。",
          "此主題開放時，將更新對應 endpoint 與欄位契約文件。",
        ],
      },
    ],
  })),
];

const deprecatedDocsPrefixes = new Set(["guides"]);

export const docsPages: DocsPageEntry[] = [
  ...baseDocsPages,
  ...gettingStartedExtraPages,
  ...workflowPages,
  ...schemaReadyTopicPages,
  ...comingSoonDocsPages,
].filter((page) => !deprecatedDocsPrefixes.has(page.slug[0]));

export const docsSidebarNav: DocsSidebarNavGroup[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      { title: "介紹", href: "/docs/introduction", icon: "book" },
      { title: "快速開始", href: "/docs/quick-start", icon: "rocket" },
      { title: "認證方式", href: "/docs/authentication", icon: "shield" },
      { title: "資料存取", href: "/docs/data-access", icon: "database" },
      { title: "API 模型", href: "/docs/api-model", icon: "braces" },
      { title: "來源政策", href: "/docs/source-policy", icon: "shield" },
      { title: "資料更新與 lineage", href: "/docs/data-freshness-lineage", icon: "chart" },
    ],
  },
  {
    id: "api",
    label: "Data APIs",
    items: schemaReadyGroups.map((group) => ({
      title: group.label,
      href: group.href,
      icon: group.icon,
      children: group.topics.map((topic) => ({ title: topic.title, href: topic.href })),
    })),
  },
  {
    id: "workflows",
    label: "Workflows / Use Cases",
    items: workflowPages.map((page) => ({
      title: page.navLabel,
      href: page.href,
      icon: "guide",
    })),
  },
  {
    id: "coming-soon",
    label: "Coming Soon",
    items: comingSoonTopics.map((topic) => ({
      title: topic.title,
      href: topic.href,
      icon: "advanced",
    })),
  },
];

function getFirstLeafHref(item: DocsSidebarNavItem): string | null {
  if (!item.children?.length) {
    return item.href;
  }

  for (const child of item.children) {
    const href = getFirstLeafHref(child);
    if (href) return href;
  }

  return null;
}

function findSidebarItemByHref(items: DocsSidebarNavItem[], href: string): DocsSidebarNavItem | null {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children?.length) {
      const nested = findSidebarItemByHref(item.children, href);
      if (nested) return nested;
    }
  }

  return null;
}

export function resolveDocsGroupTargetHref(href: string): string | null {
  for (const group of docsSidebarNav) {
    const item = findSidebarItemByHref(group.items, href);
    if (!item || !item.children?.length) continue;

    const firstLeafHref = getFirstLeafHref(item);
    if (firstLeafHref && firstLeafHref !== item.href) {
      return firstLeafHref;
    }
  }

  return null;
}

export function getDocsPageBySlug(slug: string[]) {
  return docsPages.find((page) => page.slug.join("/") === slug.join("/"));
}
