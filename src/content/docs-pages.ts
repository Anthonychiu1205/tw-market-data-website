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
  paragraphs?: string[];
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
  status: "200" | "400" | "401" | "403" | "404" | "429" | "503";
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
  apiReferenceFactory?: () => ApiReferenceContent;
  tier: "complete" | "placeholder";
};

export type DocsSidebarNavItem = {
  title: string;
  href: string;
  icon?: DocsSidebarIcon;
  status?: "production" | "normalized" | "preview";
  children?: DocsSidebarNavItem[];
};

export type DocsSidebarNavGroup = {
  id: string;
  label: string;
  groupIcon:
    | "rocket"
    | "line-chart"
    | "file-spreadsheet"
    | "landmark"
    | "building-2"
    | "network"
    | "activity"
    | "search-code"
    | "eye";
  items: DocsSidebarNavItem[];
};

type DocSectionLike = {
  id?: string | null;
  label: string;
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
  { id: "analyst-estimates", label: "進階估計資料（規劃中）", icon: "chart" },
  { id: "institutional-holdings", label: "進階持有結構（規劃中）", icon: "holdings" },
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
  { sectionId: "market-prices", slug: "market-overview", navLabel: "市場概況", title: "市場概況", subtitle: "提供市場層級的官方快照資訊，用於盤勢與結構觀察。", usage: "TWSE 市場概況快照、seeded window 檢視與風險監看" },
  { sectionId: "segment-financials", slug: "segment-income-statement", navLabel: "分部損益表", title: "分部損益表", subtitle: "提供公司分部層級的損益欄位，支援結構化比較。", usage: "分部獲利分析、產品線表現追蹤與結構變化研究" },
  { sectionId: "segment-financials", slug: "segment-balance-sheet", navLabel: "分部資產負債表", title: "分部資產負債表", subtitle: "提供分部層級資產與負債資料，協助資本結構分析。", usage: "分部資本效率評估與風險曝險比較" },
  { sectionId: "segment-financials", slug: "segment-cash-flow", navLabel: "分部現金流量表", title: "分部現金流量表", subtitle: "提供分部現金流資料，補足公司整體現金流分析。", usage: "現金流品質檢查與分部資金運用分析" },
  { sectionId: "segment-financials", slug: "all-segments", navLabel: "全部分部資料", title: "全部分部資料", subtitle: "整合分部財務欄位，提供跨分部的完整檢索入口。", usage: "分部全貌比對、聚合查詢與報表彙整" },
  { sectionId: "financial-metrics", slug: "metrics-snapshot", navLabel: "指標快照", title: "指標快照", subtitle: "提供特定時點的財務指標快照，適合橫截面分析。", usage: "估值篩選、同業比較與即時風險檢查" },
  { sectionId: "financial-metrics", slug: "metrics-history", navLabel: "指標歷史", title: "指標歷史", subtitle: "提供財務指標歷史序列，適合趨勢與變動分析。", usage: "長期趨勢追蹤、回測特徵建立與因子研究" },
  { sectionId: "filings", slug: "company-announcements", navLabel: "公司公告", title: "公司公告", subtitle: "提供公司公告索引與欄位，支援公告查詢與追蹤。", usage: "公告監控、事件索引建立與法說追蹤" },
  { sectionId: "filings", slug: "financial-filings", navLabel: "財報文件", title: "財報文件", subtitle: "提供財報類文件索引與 metadata，便於文件檢索。", usage: "文件下載流程、財報對照與審核留存" },
  { sectionId: "filings", slug: "material-information", navLabel: "重大訊息", title: "重大訊息", subtitle: "提供重大訊息資料，支援事件偵測與風險告警。", usage: "重大事件追蹤、公告分類與異常監控" },
  { sectionId: "company-master", slug: "issuer-profile", navLabel: "公司基本資料", title: "公司基本資料", subtitle: "提供公司主檔欄位，包含識別、產業與市場分類。", usage: "主檔建立、ticker 對照與資料整合前置" },
  { sectionId: "company-master", slug: "company-classification", navLabel: "公司分類", title: "公司分類", subtitle: "提供公司分類資料，支援產業與主題分群。", usage: "分群建模、投資池管理與篩選條件設定" },
  { sectionId: "analyst-estimates", slug: "estimates", navLabel: "預估數據（規劃中）", title: "預估數據（規劃中）", subtitle: "此資料主題尚未納入 available-now 能力。", usage: "目前不提供公開查詢，僅保留規劃說明。" },
  { sectionId: "analyst-estimates", slug: "revision-history", navLabel: "修正歷史（規劃中）", title: "修正歷史（規劃中）", subtitle: "此資料主題尚未納入 available-now 能力。", usage: "目前不提供公開查詢，僅保留規劃說明。" },
  { sectionId: "institutional-holdings", slug: "investor-holdings", navLabel: "投資者持股（規劃中）", title: "投資者持股（規劃中）", subtitle: "此資料主題尚未納入 available-now 能力。", usage: "目前不提供公開查詢，僅保留規劃說明。" },
  { sectionId: "institutional-holdings", slug: "single-stock-holdings", navLabel: "個股持股（規劃中）", title: "個股持股（規劃中）", subtitle: "此資料主題尚未納入 available-now 能力。", usage: "目前不提供公開查詢，僅保留規劃說明。" },
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
  "market-prices/historical-prices": "/v2/datasets/price-enhanced/historical",
  "market-prices/realtime-prices": "/v2/datasets/price-enhanced/realtime",
  "market-prices/company-overview": "/v2/datasets/price-enhanced/company-overview",
  "market-prices/market-overview": "/v2/datasets/market-overview-snapshots",
  "segment-financials/segment-income-statement": "/v1/segments/income-statement",
  "segment-financials/segment-balance-sheet": "/v1/segments/balance-sheet",
  "segment-financials/segment-cash-flow": "/v1/segments/cash-flow",
  "segment-financials/all-segments": "/v1/segments/all",
  "financial-metrics/metrics-snapshot": "/v1/financial-metrics/snapshot",
  "financial-metrics/metrics-history": "/v1/financial-metrics/history",
  "filings/company-announcements": "/v1/filings/company-announcements",
  "filings/financial-filings": "/v1/filings/financial-filings",
  "filings/material-information": "/v1/filings/material-information",
  "company-master/issuer-profile": "/v2/datasets/issuer-profile",
  "company-master/company-classification": "/v1/company/classification",
  "analyst-estimates/estimates": "/v1/analyst-estimates/estimates",
  "analyst-estimates/revision-history": "/v1/analyst-estimates/revision-history",
  "institutional-holdings/investor-holdings": "/v1/institutional-holdings/investor-holdings",
  "institutional-holdings/single-stock-holdings": "/v1/institutional-holdings/single-stock-holdings",
  "news/company-news": "/v2/datasets/company-news",
  "news/market-news": "/v2/datasets/market-news",
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
    case "company-master/issuer-profile":
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
    apiReferenceFactory: () => buildApiReference(item),
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
    title: "台股資料 API 基礎設施",
    subtitle: "為 AI agent、量化研究與自動化系統提供可驗證、結構一致、來源可追溯的台股資料。",
    tier: "complete",
    sections: [
      {
        id: "docs-portals",
        label: "文件入口",
        paragraphs: [],
      },
      {
        id: "what-you-can-access",
        label: "目前可存取的資料",
        paragraphs: [],
      },
      {
        id: "built-for",
        label: "適合使用者",
        paragraphs: [],
      },
      {
        id: "design-principles",
        label: "設計原則",
        paragraphs: [],
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
    subtitle: "用 2 分鐘建立第一個 TW Market Data API request，完成認證、查詢台股資料，並理解 response 結構。",
    tier: "complete",
    sections: [
      {
        id: "create-account",
        label: "建立帳號",
        paragraphs: [],
      },
      {
        id: "first-request",
        label: "發送第一個請求",
        paragraphs: [],
      },
      {
        id: "explore-more",
        label: "探索更多 endpoint",
        paragraphs: [],
      },
      {
        id: "whats-next",
        label: "下一步",
        paragraphs: [],
      },
    ],
  },
  {
    slug: ["data-access"],
    href: "/docs/data-access",
    navLabel: "Coverage / Freshness",
    category: "overview",
    icon: "database",
    title: "Coverage / Freshness",
    subtitle: "說明各資料家族的覆蓋範圍、更新節奏與 data_gaps 判讀方式。",
    tier: "complete",
    sections: [
      {
        id: "docs-portals",
        label: "文件入口",
        paragraphs: [
          "你可以從左側導覽查看所有資料集文件，也可以先從 Quick Start 建立第一個 request。",
          "若要讓 agent 或內部工具讀取文件，TW Market Data 已提供 /openapi.json、/llms.txt、/llms-full.txt 作為 machine-readable 入口；MCP 仍為 preview/planned。",
        ],
      },
      {
        id: "coverage-overview",
        label: "Coverage 是什麼",
        paragraphs: [
          "Coverage 指的是資料集在 ticker、日期、財報期間或事件類型上的可用範圍。Coverage 會隨資料來源揭露節奏與產品化進度持續更新，不應假設所有資料集都已完整覆蓋。",
          "建議把 coverage 視為可觀測狀態，而不是固定常數。實際可用範圍應以 API 回應與 docs 說明為準。",
        ],
        bullets: [
          "TWSE 日線價格：核心資料集，持續維護 coverage 與資料品質。",
          "月營收、損益表、資產負債表：依公司公告與季度申報節奏更新。",
          "三大法人買賣超：coverage 持續補齊中，請搭配 data_gaps 判讀。",
          "技術指標：由價格資料衍生，覆蓋範圍依底層價格資料可用性而定。",
          "現金流量表、News Intelligence 等主題：請依 docs 上的 available/preview/deferred 狀態判讀，不假設已完整上線。",
        ],
      },
      {
        id: "freshness-definition",
        label: "Freshness 是什麼",
        paragraphs: [
          "Freshness 指的是某筆資料最近一次可用更新時間。不同資料集更新頻率不同，例如日線價格、月營收、季報與事件資料的揭露節奏並不相同。",
          "在跨資料集查詢時，請同時檢查 freshness 與資料時間欄位，避免把不同更新節奏的資料視為同一時間點。",
        ],
      },
      {
        id: "data-gaps-interpretation",
        label: "Data gaps 如何判讀",
        paragraphs: [
          "data_gaps 表示資料缺口或來源限制，是研究流程中應保留的訊號。請不要把缺口直接當成 0 或自動補值。",
          "建議在 pipeline 中將 data_gaps、source_role、lineage 一起保存，以便後續審計與回溯。",
        ],
        bullets: [
          "先檢查資料是否存在，再處理數值分析與策略邏輯。",
          "缺口若來自官方來源延遲，應標記為 unavailable/pending，而非填入假值。",
          "跨資料集整合時，優先以交集日期做分析，並記錄被排除的缺口範圍。",
        ],
      },
      {
        id: "status-categories",
        label: "Dataset status categories",
        paragraphs: [
          "平台目前使用下列狀態語意，協助你在系統內區分可用程度與風險邊界。",
        ],
        bullets: [
          "available：已進入主要公開能力，仍需依方案權限存取。",
          "preview：可供測試或限定場景使用，欄位與 coverage 可能調整。",
          "coverage-limited：已提供查詢，但覆蓋範圍仍在補齊。",
          "deferred / not-yet-available：尚未納入正式對外能力。",
        ],
      },
      {
        id: "family-status-notes",
        label: "資料家族狀態說明",
        paragraphs: [],
        bullets: [
          "Market prices：TWSE/TPEx 日線為核心入口；技術指標為衍生層。",
          "Fundamentals：月營收與財報三表依官方揭露節奏更新。",
          "Capital flow：institutional-flow 仍在持續 productization rollout。",
          "News Intelligence：metadata-first，非完整新聞全文商用再散佈服務。",
          "Cash flow / 其他延伸主題：以 docs 狀態說明為準，不預設為 fully production-ready。",
        ],
      },
      {
        id: "how-to-read-in-api",
        label: "如何在 API / Docs 判讀 coverage 與 freshness",
        paragraphs: [
          "查看 response 中的 freshness、source_role、lineage、data_gaps 欄位，再搭配對應 endpoint 的 docs 說明與參數限制。",
          "建議同時參考資料集介紹頁（/datasets）與單一資料集頁（例如 /datasets/twse-daily-price、/datasets/institutional-flow）。",
        ],
        bullets: [
          "/docs/data-provenance",
          "/datasets",
          "/datasets/twse-daily-price",
          "/datasets/monthly-revenue",
          "/datasets/institutional-flow",
        ],
      },
      {
        id: "feedback",
        label: "Feedback",
        paragraphs: [
          "若需要特定產業、資料集或企業級導入，請聯繫我們。",
        ],
      },
    ],
  },
  {
    slug: ["source-policy"],
    href: "/docs/source-policy",
    navLabel: "Data Provenance",
    category: "overview",
    icon: "shield",
    title: "Data Provenance / Source Policy",
    subtitle: "說明台股資料來源政策、official/public-first 原則與 lineage 可追溯機制。",
    tier: "complete",
    sections: [
      {
        id: "official-public-first",
        label: "來源政策說明",
        paragraphs: [
          "本平台以交易所與官方揭露系統為主要資料來源，包含 TWSE、TPEx 與公開資訊觀測站（MOPS）。所有資料皆由系統直接擷取、解析與結構化處理，建立從原始揭露到 API 回傳的完整資料路徑。",
          "對於市場行情等即時資料，平台會採用經過驗證的資料來源，並明確標示來源角色（source_role），確保使用者清楚了解資料來源與信任層級。",
          "本頁說明各類資料的來源與處理方式，以及資料如何從原始來源進入 API。資料產品優先追求可驗證性與可追溯性，而非未經驗證的資料擴張。",
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
        id: "raw-to-normalized-to-api",
        label: "Raw → Normalized → API response",
        paragraphs: [
          "資料流程通常包含：原始來源擷取、欄位正規化、契約驗證、資料缺口標記與 API 回傳封裝。",
          "這個流程可降低多來源欄位語意不一致的風險，並讓開發者在 response 中使用一致的欄位與判讀規則。",
        ],
        bullets: [
          "Raw layer：官方公開揭露內容與原始欄位。",
          "Normalized layer：欄位命名與型別對齊、日期與單位統一。",
          "API layer：對外回傳可查詢資料，並附帶 source_role / lineage / freshness / data_gaps。",
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
        paragraphs: ["法人買賣與融資融券資料以交易所公開揭露系統為優先來源。"],
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
        id: "derived-dataset-notes",
        label: "Derived datasets 如何標示",
        paragraphs: [
          "部分資料為 derived layer（例如技術指標、部分策略資料）。這類資料會保留來源脈絡，並區分是否由官方資料直接推導。",
          "derived 資料不代表較低可信度，但需要更清楚的公式、欄位定義與資料前提，才能避免誤用。",
        ],
      },
      {
        id: "data-gaps-limitations",
        label: "Data gaps 與限制",
        paragraphs: [
          "資料缺口是正常且需要揭露的資訊，不應以隱式補值掩蓋。當官方來源延遲、欄位暫缺或契約變動時，系統會優先保留缺口訊號。",
          "對於 coverage 未完整的資料集（例如部分 institutional flow 補齊中），請在研究流程中顯式處理缺值與可用範圍。",
        ],
        bullets: [
          "不假設所有資料集在所有日期都完整。",
          "不把 data_gaps 自動轉為 0 或成功值。",
          "不把 preview/deferred 主題視為 production-ready。",
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
      {
        id: "compliance-notes",
        label: "使用與合規聲明",
        paragraphs: [
          "本文件用於說明資料來源與產品邊界，不構成投資建議或交易指令。",
          "News Intelligence 目前以 metadata-first 為主，不應視為可任意再散佈的完整新聞全文資料庫。",
        ],
      },
    ],
  },
  {
    slug: ["api-model"],
    href: "/docs/api-model",
    navLabel: "OpenAPI Spec",
    category: "overview",
    icon: "braces",
    title: "OpenAPI Spec",
    subtitle: "提供機器可讀的 API 規格，方便 client generation、API testing 與 agent endpoint discovery。",
    tier: "complete",
    sections: [
      {
        id: "docs-portals",
        label: "文件入口",
        paragraphs: [
          "你可以從左側導覽查看所有資料集文件，也可以先從 Quick Start 建立第一個 request。",
          "若要讓 agent 或內部工具讀取文件，後續可透過 OpenAPI spec、llms.txt 或 MCP tools 作為入口。",
        ],
      },
      {
        id: "openapi-json",
        label: "openapi.json",
        paragraphs: [
          "TW Market Data 會以 OpenAPI 3.x 格式描述可公開使用的 API contract。",
          "公開 machine-readable artifact：/openapi.json。",
          "OpenAPI 內容會隨資料 coverage 與 productization rollout 逐步更新，詳細欄位仍以對應 docs endpoint 頁面為準。",
        ],
      },
      {
        id: "whats-included",
        label: "What’s included",
        paragraphs: [],
        bullets: [
          "endpoint path",
          "request parameters",
          "response schema",
          "authentication header",
          "error status",
          "dataset availability status",
          "examples for query / screener",
        ],
      },
      {
        id: "use-cases",
        label: "使用情境",
        paragraphs: [],
        bullets: [
          "產生 TypeScript / Python client",
          "匯入 Postman / Insomnia / Bruno",
          "讓 agent 或 MCP tool 探索可用 endpoint",
          "validate request / response schema",
          "將 docs 與 backend contract 對齊",
        ],
      },
      {
        id: "notes",
        label: "注意事項",
        paragraphs: [],
        bullets: [
          "spec 只描述 available-now / preview API，不保證 skeleton / placeholder。",
          "controlled rollout 下，不同 API key 可能有不同 access。",
          "以 backend read API contract 為準。",
          "若 docs 與 spec 不一致，應回報並以 spec / backend contract 校正。",
        ],
      },
    ],
  },
  ...apiCategoryPages,
  ...apiDocsPages,
  {
    slug: ["api", "analyst-estimates"],
    href: "/docs/api/analyst-estimates",
    navLabel: "分析師預估（規劃中）",
    category: "api",
    icon: "chart",
    title: "分析師預估（規劃中）",
    subtitle: "此主題目前未納入 available-now 或 preview 對外能力。",
    tier: "placeholder",
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
      categoryLabel: "規劃中資料主題",
      method: "GET",
      endpoint: "/v1/analyst-estimates",
      overview: [
        "此主題目前未納入 public sellable boundary。",
        "請改用 available-now 的財務與成長資料集（例如月營收、財報三表、估值資料）。",
      ],
      useCases: [
        "用作未來規劃範圍參考。",
        "與現行可用資料集做能力邊界區分。",
        "避免將此主題誤判為可立即串接的正式功能。",
      ],
      gettingStarted: [
        "若有此主題導入需求，請先聯繫團隊評估。",
        "正式可用範圍以帳號方案與權限開通狀態為準。",
        "目前建議先使用已上線 endpoint 建立流程。",
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
        "此頁僅作規劃說明，不代表目前可公開查詢。",
        "若 endpoint 未開通，應視為 not available。",
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
        "本頁不代表正式上線能力。",
        "請以 available-now / preview 文件與 API contract 為準。",
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
          { status: "404", description: "此主題尚未開通", body: `{"error":{"code":"not_found","message":"dataset not available in current rollout"}}` },
        ],
      },
    },
  },
  {
    slug: ["api", "company", "security-master"],
    href: "/docs/api/company/security-master",
    navLabel: "公司主檔 / Security Master",
    category: "api",
    icon: "building",
    title: "股票主檔 / Security Master",
    subtitle: "Security Master read-only API，提供 AI-friendly 身分、覆蓋、血緣與資料缺口上下文。",
    tier: "complete",
    sections: [
      { id: "overview", label: "Overview", paragraphs: [] },
      { id: "endpoints", label: "Endpoints", paragraphs: [] },
      { id: "query-parameters", label: "Query Parameters", paragraphs: [] },
      { id: "response", label: "Response", paragraphs: [] },
      { id: "ai-context", label: "AI Context", paragraphs: [] },
      { id: "limitations", label: "Limitations", paragraphs: [] },
      { id: "safe-usage", label: "Safe Usage", paragraphs: [] },
    ],
    apiReference: {
      categoryLabel: "公司主檔",
      method: "GET",
      endpoint: "/v2/datasets/security-master",
      overview: [
        "Security Master 提供股票身分主檔（ticker/market/security_type）與 AI context packet，支援 research assistant、agent orchestration 與 dataset coverage 決策。",
        "此頁同步兩個 read-only endpoint：`/v2/datasets/security-master`（列表）與 `/v2/securities/{ticker}`（單一查詢）。",
      ],
      requestDescription: [
        "列表查詢：`GET /v2/datasets/security-master`，可用 `market/ticker/active_only/limit/include_ai_context`。",
        "單一查詢：`GET /v2/securities/{ticker}`，可用 `market/include_coverage/include_data_gaps`。",
        "若 `include_ai_context=true`，回應會帶 AI usage 所需 section 與 warning。 ",
      ],
      useCases: [
        "建立 ticker→market/security_type 的 deterministic identity lookup。",
        "在 pipeline 內先判斷 coverage/data_gaps，再決定是否查詢下游 dataset。",
        "提供 agent 以 `source_lineage` 與 `survivorship_bias_warning` 做回答風險約束。",
      ],
      gettingStarted: [
        "先呼叫 `/v2/datasets/security-master?market=TWSE&active_only=true&limit=50` 查看主檔與 coverage 概況。",
        "再用 `/v2/securities/{ticker}` 拉單一標的 AI context。",
        "TPEx 若為 held/unavailable，請依 `data_gaps` 與 `source_lineage` 顯示限制，不要假裝 official 覆蓋。",
      ],
      exampleRequestCurl: `curl -G "https://api.twmarketdata.com/v2/datasets/security-master" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "market=TWSE" \\
  --data-urlencode "active_only=true" \\
  --data-urlencode "limit=20" \\
  --data-urlencode "include_ai_context=true"`,
      queryParameters: [
        { name: "market", type: "string", required: false, description: "市場別篩選（TWSE / TPEx）。可用於列表與單一 ticker 查詢。" },
        { name: "ticker", type: "string", required: false, description: "列表 route 的 ticker 篩選條件（lookup route 用 path ticker）。" },
        { name: "active_only", type: "boolean", required: false, description: "僅回傳 active 標的，預設 true（dataset route）。" },
        { name: "limit", type: "integer", required: false, description: "dataset route 回傳筆數上限。" },
        { name: "include_ai_context", type: "boolean", required: false, description: "dataset route 是否回傳 AI context packet（預設 true）。" },
        { name: "include_coverage", type: "boolean", required: false, description: "lookup route 是否包含 dataset_coverage（預設 true）。" },
        { name: "include_data_gaps", type: "boolean", required: false, description: "lookup route 是否包含 data_gaps（預設 true）。" },
      ],
      responseSummary: [
        "回應重點 section：`security_identity`、`market_identity`、`dataset_coverage`、`source_lineage`、`data_gaps`。",
        "同時提供 `safe_usage_notes`、`survivorship_bias_warning`、`available_tools_or_endpoints`。",
      ],
      responseFields: [
        { path: "items[].security_identity", type: "object", description: "ticker/name/security_type/is_active 等主體識別欄位。" },
        { path: "items[].market_identity", type: "object", description: "market/source_provider/source_role/source_confidence。" },
        { path: "items[].dataset_coverage", type: "object", description: "各資料家族可用性（available/held/unknown/partial）。" },
        { path: "items[].source_lineage", type: "object", description: "official-first lineage 與來源選擇上下文。" },
        { path: "items[].data_gaps", type: "array", description: "缺口與限制（如 TPEx official source 未整合）。" },
        { path: "items[].safe_usage_notes", type: "array", description: "安全使用註記（含 not_investment_advice）。" },
        { path: "survivorship_bias_warning", type: "object", description: "回測使用風險提示（非完整 PIT lifecycle）。" },
        { path: "available_tools_or_endpoints", type: "array", description: "可用工具/route（含 MCP tool plan 提示）。" },
      ],
      notes: [
        "current_master_v1：目前不是完整歷史 PIT master。",
        "not_survivorship_safe_for_historical_backtests：不可直接宣稱回測無生存者偏誤。",
        "TPEx official issuer profile 尚未整合，部分 row 應標示 held/unavailable。",
        "FinMind 僅作 benchmark，不是 production source of truth。",
        "非投資建議（not investment advice）。",
      ],
      planRequirement: {
        title: "Status / Scope",
        bullets: [
          "Dataset status: private_beta",
          "Source policy: official-first",
          "TWSE official issuer profile: available",
          "TPEx: held for official enrichment",
        ],
      },
      sidePanel: {
        requestExample: `curl -G "https://api.twmarketdata.com/v2/securities/2330" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "market=TWSE" \\
  --data-urlencode "include_coverage=true" \\
  --data-urlencode "include_data_gaps=true"`,
        codeExamples: {
          python: `import requests\n\nurl = "https://api.twmarketdata.com/v2/securities/2330"\nheaders = {"X-API-Key": "your_api_key_here"}\nparams = {"market": "TWSE", "include_coverage": "true", "include_data_gaps": "true"}\nresp = requests.get(url, headers=headers, params=params)\nprint(resp.status_code)\nprint(resp.json())`,
          javascript: `const url = "/v2/securities/2330?market=TWSE&include_coverage=true&include_data_gaps=true";\nconst response = await fetch(url, { headers: { "X-API-Key": "your_api_key_here" } });\nconst body = await response.json();\nconsole.log(response.status, body);`,
          curl: `curl -G "https://api.twmarketdata.com/v2/datasets/security-master" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "market=TWSE" \\
  --data-urlencode "active_only=true" \\
  --data-urlencode "limit=20" \\
  --data-urlencode "include_ai_context=true"`,
        },
        statusExamples: [
          {
            status: "200",
            description: "成功回傳 Security Master AI context",
            body: `{
  "dataset_id": "security-master",
  "items": [
    {
      "security_identity": {"ticker": "2330", "name_zh": "台灣積體電路製造股份有限公司", "market": "TWSE"},
      "market_identity": {"market": "TWSE", "source_provider": "twse_official", "source_role": "official_twse_issuer_profile"},
      "dataset_coverage": {"price": "available", "technical_indicators": "available"},
      "source_lineage": {"source_policy": "official_first"},
      "data_gaps": [],
      "safe_usage_notes": ["not_investment_advice"],
      "survivorship_bias_warning": {"enabled": true}
    }
  ],
  "available_tools_or_endpoints": [
    {"name": "security_master_lookup", "contract": "security_master_lookup(ticker, market?, include_coverage?, include_data_gaps?)"}
  ]
}`,
          },
          {
            status: "404",
            description: "查無 ticker（controlled not found）",
            body: `{
  "status": "not_found",
  "reason": "security_not_found"
}`,
          },
          {
            status: "503",
            description: "資料來源或表不可用（controlled unavailable）",
            body: `{
  "status": "unavailable",
  "reason": "security_master_table_not_ready"
}`,
          },
        ],
      },
    },
  },
  {
    slug: ["api", "company", "issuer-profile"],
    href: "/docs/api/company/issuer-profile",
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
      endpoint: "/v2/datasets/issuer-profile",
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
      exampleRequestCurl: `curl -G "https://api.twmd.example/v2/datasets/issuer-profile" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330"`,
      queryParameters: [
        { name: "ticker", type: "string", required: false, description: "公司代號。與 query 至少擇一。" },
        { name: "query", type: "string", required: false, description: "公司名稱或代號關鍵字。" },
        { name: "market", type: "string", required: false, description: "市場別篩選，例如 TWSE、TPEx。" },
      ],
      responseSummary: [
        "回應結構固定為 dataset、rows、count。",
        "rows 依查詢條件回傳單筆或多筆公司主檔資料。",
      ],
      responseFields: [
        { path: "dataset", type: "string", description: "固定為 issuer_profile。" },
        { path: "rows[].symbol", type: "string", description: "公司代號（內部對應 ticker）。" },
        { path: "rows[].company_name", type: "string", description: "公司名稱。" },
        { path: "rows[].exchange", type: "string", description: "交易所識別。" },
        { path: "rows[].market_type", type: "string", description: "上市櫃別或市場板塊。" },
        { path: "rows[].industry", type: "string", description: "產業分類。" },
        { path: "rows[].status", type: "string", description: "公司狀態（正常、停牌、下市等）。" },
        { path: "count", type: "integer", description: "回傳資料筆數。" },
      ],
      notes: [
        "公司狀態與分類可能異動，建議定期同步主檔而非僅在初始化時查詢一次。",
        "跨來源合併時請固定使用同一識別鍵與生效日期規則。",
      ],
      sidePanel: {
        requestExample: `curl -G "https://api.twmd.example/v2/datasets/issuer-profile" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "query=台積電"`,
        statusExamples: [
          {
            status: "200",
            description: "成功回傳公司主檔",
            body: `{
  "dataset": "issuer_profile",
  "rows": [
    {
      "symbol": "2330",
      "company_name": "台灣積體電路製造股份有限公司",
      "exchange": "TWSE",
      "market_type": "上市",
      "industry": "半導體",
      "status": "active"
    }
  ],
  "count": 1
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
        "建議搭配 /v2/datasets/income-statement 與 /v2/datasets/price-enhanced 建立完整事件分析流程。",
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
    navLabel: "財報（損益表）",
    category: "api",
    icon: "statements",
    title: "財報（損益表）",
    subtitle: "提供公司損益表關鍵欄位，適合用於基本面分析、估值研究與策略建模。",
    tier: "complete",
    sections: buildIncomeStatementApiSections(),
    apiReferenceFactory: () => buildIncomeStatementApiReference(),
  },
  {
    slug: ["api", "insider-trades"],
    href: "/docs/api/insider-trades",
    navLabel: "內線交易（規劃中）",
    category: "api",
    icon: "insider",
    title: "內線交易（規劃中）",
    subtitle: "此主題目前未納入 available-now 或 preview 對外能力。",
    tier: "placeholder",
    sections: [
      {
        id: "dataset-overview",
        label: "資料定義",
        paragraphs: [
          "此主題目前為規劃中，尚未提供正式可查詢 endpoint。",
          "如需公司事件相關研究，請先使用公司公告、事件日曆與結構化事件資料。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "使用情境",
        paragraphs: [
          "本頁僅作規劃範圍說明，不構成可用能力承諾。",
          "正式開放時程與配額範圍依 controlled rollout 決定。",
        ],
      },
      {
        id: "field-and-source-notes",
        label: "欄位與來源注意事項",
        paragraphs: [
          "目前無公開 contract，請勿將此頁資訊用於正式串接。",
          "對外功能以 available-now / preview 文件頁為準。",
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
    navLabel: "進階持有結構（規劃中）",
    category: "api",
    icon: "holdings",
    title: "進階持有結構（規劃中）",
    subtitle: "此主題目前未納入 available-now 或 preview 對外能力。",
    tier: "placeholder",
    sections: [
      {
        id: "dataset-overview",
        label: "資料定義",
        paragraphs: [
          "此主題仍屬規劃中，尚未納入目前公開可販售能力。",
          "現行可用的資金面資料請改用法人買賣（institutional-flow）與融資融券（margin-short）。",
        ],
      },
      {
        id: "usage-scenarios",
        label: "使用情境",
        paragraphs: [
          "若有此主題需求，建議先以法人買賣、融資融券與事件資料建立替代流程。",
          "實際開放時程與權限範圍以 controlled rollout 為準。",
        ],
      },
      {
        id: "field-and-source-notes",
        label: "欄位與來源注意事項",
        paragraphs: [
          "本頁僅保留規劃說明，不代表當前可查詢 contract。",
          "請優先使用已上線 docs 章節中的 available-now dataset。",
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
      gettingStarted: ["帶入 API key 與 query。", "視需求加 market 與 limit。", "結果可再搭配 /v2/datasets/issuer-profile 做二次驗證。"],
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
          "步驟 1：查 issuer-profile 建立主檔",
          "步驟 2：查 revenue 與 income-statement",
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
          "/docs/api/company/issuer-profile、/docs/api/financial-growth/income-statement、/docs/api/financial-growth/financial-metrics、/docs/data-access。",
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
        paragraphs: ["/docs/api/market-prices/twse-daily-price、/docs/api/market-prices/tpex-daily-price、/docs/source-policy。"],
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
          "如需人工協助，請來信 avenra.platform@gmail.com。",
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
          "聯絡信箱：avenra.platform@gmail.com",
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
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：尚未納入 available-now 商售邊界",
    ],
  },
  technical_indicators: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（限制，僅限開發與測試）",
      "Pro / Enterprise：尚未納入 available-now 商售邊界",
    ],
  },
  monthly_revenue: {
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
  dataset_factory_institutional_flow: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（文件預覽，非正式商售宣告）",
      "Pro / Enterprise：維持 production_ready=false，待後續產品化核准",
    ],
  },
  dataset_factory_technical_indicators: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（文件預覽，非正式商售宣告）",
      "Pro / Enterprise：維持 production_ready=false，待後續產品化核准",
    ],
  },
  dataset_factory_valuation_data: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（文件預覽，非正式商售宣告）",
      "Pro / Enterprise：維持 production_ready=false，待後續產品化核准",
    ],
  },
  dataset_factory_income_statement: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（文件預覽，非正式商售宣告）",
      "Pro / Enterprise：維持 production_ready=false，待後續產品化核准",
    ],
  },
  dataset_factory_balance_sheet: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（文件預覽，非正式商售宣告）",
      "Pro / Enterprise：維持 production_ready=false，待後續產品化核准",
    ],
  },
  dataset_factory_cash_flow: {
    bullets: [
      "Invited / Preview：可用（受控驗證）",
      "Developer：可用（文件預覽，非正式商售宣告）",
      "Pro / Enterprise：維持 production_ready=false，待後續產品化核准",
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
      { title: "股票主檔 / Security Master", href: "/docs/api/company/security-master", topicId: "security_master", tableName: "security_master_items", endpoint: "/v2/datasets/security-master", source: "TWSE official / TPEx held" },
      { title: "公司基本資料", href: "/docs/api/company/issuer-profile", topicId: "issuer_profile", tableName: "issuer_profile", endpoint: "/v2/datasets/issuer-profile", source: "TWSE / TPEx" },
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
      { title: "月營收", href: "/docs/api/financial-growth/monthly-revenue", topicId: "monthly_revenue", tableName: "monthly_revenue", endpoint: "/v2/datasets/monthly-revenue", source: "mops_official / Canonical" },
      { title: "估值資料", href: "/docs/api/financial-growth/valuation-data", topicId: "valuation_data", tableName: "valuation_data", endpoint: "/v2/datasets/valuation-data", source: "TWSE / TPEx" },
      { title: "損益表", href: "/docs/api/financial-growth/income-statement", topicId: "income_statement", tableName: "fundamental_income_statements", endpoint: "/v2/datasets/income-statement", source: "MOPS" },
      { title: "現金流量表", href: "/docs/api/financial-growth/cash-flow-statement", topicId: "cash_flow_statement", tableName: "fundamental_cash_flows", endpoint: "/v2/datasets/cash-flow-statement", source: "MOPS" },
      { title: "資產負債表", href: "/docs/api/financial-growth/balance-sheet", topicId: "balance_sheet", tableName: "fundamental_balance_sheets", endpoint: "/v2/datasets/balance-sheet", source: "MOPS" },
      { title: "財報資料（Canonical）", href: "/docs/api/financial-growth/financials-canonical", topicId: "financials_canonical", tableName: "fundamental_*", endpoint: "/v2/datasets/financials", source: "MOPS / Canonical Layer" },
      { title: "估值核心日資料（Canonical）", href: "/docs/api/financial-growth/valuations-canonical", topicId: "valuations_canonical", tableName: "valuation_core_daily", endpoint: "/v2/datasets/valuation-core-daily", source: "MOPS / Canonical Layer" },
    ],
  },
  {
    id: "market-prices",
    label: "市場與價格",
    href: "/docs/api/market-prices",
    icon: "prices",
    topics: [
      { title: "TWSE 日線價格", href: "/docs/api/market-prices/twse-daily-price", topicId: "twse_daily_price", tableName: "normalized_twse_daily_prices", endpoint: "/v2/datasets/twse-daily-price", source: "TWSE" },
      { title: "TPEx 日線價格", href: "/docs/api/market-prices/tpex-daily-price", topicId: "tpex_daily_price", tableName: "normalized_tpex_daily_prices", endpoint: "/v2/datasets/tpex-daily-price", source: "TPEx" },
      { title: "還原股價", href: "/docs/api/market-prices/adjusted-prices", topicId: "adjusted_prices", tableName: "adjusted_prices", endpoint: "/v2/datasets/adjusted-prices", source: "TWSE / TPEx" },
      { title: "技術指標", href: "/docs/api/market-prices/technical-indicators", topicId: "technical_indicators", tableName: "technical_indicators", endpoint: "/v2/datasets/technical-indicators", source: "TWSE（Non-TPEx, Stage0 baseline）" },
      { title: "市場指數 / Market Index", href: "/docs/api/market-prices/market-index", topicId: "market_index", tableName: "index_data_items", endpoint: "/v2/datasets/market-index", source: "TWSE official MI_INDEX / exact mapping" },
      { title: "指數資料", href: "/docs/api/market-prices/index-data", topicId: "index_data", tableName: "index_data", endpoint: "/v2/datasets/index-data", source: "TWSE / TPEx" },
      { title: "市場廣度", href: "/docs/api/market-prices/market-breadth", topicId: "market_breadth", tableName: "market_breadth", endpoint: "/v2/datasets/market-breadth", source: "TWSE" },
      { title: "利率", href: "/docs/api/market-prices/interest-rate", topicId: "interest_rate_snapshot", tableName: "interest_rate_snapshot", endpoint: "/v2/datasets/interest-rate-snapshot", source: "中央銀行 / 公開資料平台" },
    ],
  },
  {
    id: "capital-flow",
    label: "籌碼與資金",
    href: "/docs/api/capital-flow",
    icon: "holdings",
    topics: [
      { title: "三大法人", href: "/docs/api/capital-flow/institutional-flow", topicId: "institutional_flow", tableName: "institutional_flow", endpoint: "/v2/datasets/institutional-flow", source: "TWSE / TPEx" },
      { title: "融資融券", href: "/docs/api/capital-flow/margin-short", topicId: "margin_short", tableName: "margin_short", endpoint: "/v2/datasets/margin-short", source: "TWSE official-first" },
      { title: "整體融資融券", href: "/docs/api/capital-flow/total-margin-short", topicId: "total_margin_short", tableName: "total_margin_short", endpoint: "/v2/datasets/total-margin-short", source: "TWSE official-first" },
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
      { title: "查詢欄位", href: "/docs/api/query-tools/query-fields", topicId: "query_fields", tableName: "query_field_allowlist", endpoint: "/v2/query/fields", source: "平台查詢引擎", icon: "braces" },
      { title: "查詢範例", href: "/docs/api/query-tools/query-examples", topicId: "query_examples", tableName: "query_examples_registry", endpoint: "/v2/query/examples", source: "平台查詢引擎", icon: "braces" },
    ],
  },
  {
    id: "preview",
    label: "預覽",
    href: "/docs/api/preview",
    icon: "news",
    topics: [
      { title: "公司新聞", href: "/docs/api/preview/company-news", topicId: "company_news", tableName: "company_news_items", endpoint: "/v2/datasets/company-news", source: "TWSE / TPEx / MOPS" },
      { title: "市場新聞", href: "/docs/api/preview/market-news", topicId: "market_news", tableName: "market_news_items", endpoint: "/v2/datasets/market-news", source: "TWSE / TPEx / MOPS" },
      {
        title: "MOPS 重大訊息事件（Private Beta）",
        href: "/docs/api/preview/mops-material-events",
        topicId: "mops_material_events",
        tableName: "mops_*_v2",
        endpoint: "/v2/datasets/news/mops-material-events",
        source: "MOPS",
      },
    ],
  },
  {
    id: "dataset-factory",
    label: "Dataset Factory（Preview）",
    href: "/docs/api/dataset-factory",
    icon: "database",
    topics: [
      {
        title: "Institutional Flow（Preview）",
        href: "/docs/api/dataset-factory/institutional-flow",
        topicId: "dataset_factory_institutional_flow",
        tableName: "institutional_flow",
        endpoint: "/v2/datasets/institutional-flow",
        source: "TWSE / TPEx（contract-generated docs）",
      },
      {
        title: "Technical Indicators（Preview）",
        href: "/docs/api/dataset-factory/technical-indicators",
        topicId: "dataset_factory_technical_indicators",
        tableName: "technical_indicators",
        endpoint: "/v2/datasets/technical-indicators",
        source: "TWSE / TPEx（contract-generated docs）",
      },
      {
        title: "Valuation Data（Preview）",
        href: "/docs/api/dataset-factory/valuation-data",
        topicId: "dataset_factory_valuation_data",
        tableName: "valuation_data",
        endpoint: "/v2/datasets/valuation-data",
        source: "MOPS / TWSE / TPEx（contract-generated docs）",
      },
      {
        title: "Income Statement（Preview）",
        href: "/docs/api/dataset-factory/income-statement",
        topicId: "dataset_factory_income_statement",
        tableName: "fundamental_income_statements",
        endpoint: "/v2/datasets/income-statement",
        source: "MOPS（contract-generated docs）",
      },
      {
        title: "Balance Sheet（Preview）",
        href: "/docs/api/dataset-factory/balance-sheet",
        topicId: "dataset_factory_balance_sheet",
        tableName: "fundamental_balance_sheets",
        endpoint: "/v2/datasets/balance-sheet",
        source: "MOPS（contract-generated docs）",
      },
      {
        title: "Cash Flow（Preview）",
        href: "/docs/api/dataset-factory/cash-flow",
        topicId: "dataset_factory_cash_flow",
        tableName: "fundamental_cash_flows",
        endpoint: "/v2/datasets/cash-flow",
        source: "MOPS（contract-generated docs）",
      },
    ],
  },
];

const comingSoonTopics: Array<{ title: string; href: string; topicId: string }> = [
  { title: "持有結構", href: "/docs/coming-soon/ownership-distribution", topicId: "ownership_distribution" },
  { title: "主題資產流向", href: "/docs/coming-soon/etf-flow", topicId: "etf_flow" },
  { title: "分類擴充", href: "/docs/coming-soon/index-constituents", topicId: "index_constituents" },
  { title: "資金持有結構", href: "/docs/coming-soon/institutional-ownership", topicId: "institutional_ownership" },
  { title: "固定收益擴充", href: "/docs/coming-soon/convertible-bonds", topicId: "convertible_bonds" },
  { title: "進階市場資料", href: "/docs/coming-soon/derivatives-market", topicId: "derivatives_market" },
  { title: "產業關聯資料", href: "/docs/coming-soon/supply-chain", topicId: "supply_chain" },
];

function hrefToSlug(href: string) {
  return href.replace(/^\/docs\//, "").split("/");
}

const usageFocusedTopicIds = new Set([
  "features",
  "factor_data",
  "time_alignment",
  "financial_metrics",
  "monthly_revenue",
  "valuation_data",
  "institutional_flow",
  "margin_short",
  "total_margin_short",
  "search_api",
  "query_api",
  "query_fields",
  "query_examples",
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
  monthly_revenue: [
    { title: "查公司基本面", href: "/docs/workflows/company-fundamentals" },
  ],
  valuation_data: [
    { title: "查公司基本面", href: "/docs/workflows/company-fundamentals" },
  ],
  institutional_flow: [
    { title: "看籌碼", href: "/docs/workflows/capital-flow" },
  ],
  margin_short: [{ title: "看籌碼", href: "/docs/workflows/capital-flow" }],
  total_margin_short: [{ title: "看籌碼", href: "/docs/workflows/capital-flow" }],
  index_data: [{ title: "看市場狀態", href: "/docs/workflows/market-status" }],
  market_breadth: [{ title: "看市場狀態", href: "/docs/workflows/market-status" }],
  interest_rate_snapshot: [{ title: "看市場狀態", href: "/docs/workflows/market-status" }],
  search_api: [{ title: "快速查資料", href: "/docs/workflows/fast-data-access" }],
  query_api: [
    { title: "快速查資料", href: "/docs/workflows/fast-data-access" },
  ],
  query_fields: [{ title: "快速查資料", href: "/docs/workflows/fast-data-access" }],
  query_examples: [{ title: "快速查資料", href: "/docs/workflows/fast-data-access" }],
};

function buildSchemaReadyTopicSections(topic: SchemaReadyTopic): DocsContentSection[] {
  const planRequirement = topicPlanVisibility[topic.topicId];
  const mappingSection: DocsContentSection = {
    id: "topic-mapping",
    label: "資料對照",
    paragraphs: [],
    bullets: [
      `資料表：${topic.tableName}`,
      `文件路由：${topic.href}`,
      `API 路由：${topic.endpoint}`,
      `資料來源：${topic.source}`,
    ],
  };

  if (!usageFocusedTopicIds.has(topic.topicId)) {
    const out: DocsContentSection[] = [
      {
        id: "topic-summary",
        label: "主題說明",
        paragraphs: [
          `${topic.title}為台股決策資料平台的正式主題之一。`,
          "此頁用於產品化接線，確認主題在文件與路由中的識別方式。",
        ],
      },
      mappingSection,
      {
        id: "availability",
        label: "Availability",
        paragraphs: [
          "本主題已納入文件與 API 導覽結構。",
          "實際可用範圍請以目前公開 API 路由與帳號可用權限為準。",
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
        `${topic.title}用於台股決策流程中的核心資料查詢。`,
        "此主題已納入正式資料目錄，可作為系統辨識與資料治理節點。",
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
      id: "workflow-links",
      label: "延伸流程",
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
  const endpoint = "/v2/datasets/issuer-profile";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/issuer-profile",
    headers=headers,
    params={"ticker": "2330"},
)
print(response.json())`,
    javascript: `const response = await fetch(
  "https://api.twmarketdata.com/v2/datasets/issuer-profile?ticker=2330",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
);

const data = await response.json();
console.log(data);`,
    curl: `curl -G "https://api.twmarketdata.com/v2/datasets/issuer-profile" \\
  -H "X-API-Key: your_api_key_here" \\
  --data-urlencode "ticker=2330"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "issuer_profile",
      rows: [
        {
          symbol: "2330",
          company_name: "台灣積體電路製造股份有限公司",
          short_name: "台積電",
          market: "TWSE",
          exchange: "上市",
          industry: "半導體業",
          listing_status: "active",
        },
      ],
      count: 1,
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
      "再依需求加入 market、limit。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司。" },
      { name: "market", type: "string", required: false, description: "市場別（上市 / 上櫃；若後端已支持）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制（若後端支持）。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移（若後端支持）。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼（內部對應 ticker）。" },
      { path: "rows[].company_name", type: "string", description: "公司全名。" },
      { path: "rows[].short_name", type: "string", description: "公司簡稱。" },
      { path: "rows[].market", type: "string", description: "市場識別（例如 TWSE、TPEx）。" },
      { path: "rows[].exchange", type: "string", description: "上市櫃別。" },
      { path: "rows[].industry", type: "string", description: "主要產業分類。" },
      { path: "rows[].listing_status", type: "string", description: "掛牌狀態（例如 active）。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
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
                message: "目前方案未開放 issuer-profile，請升級方案後重試。",
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
              dataset: "issuer_profile",
              rows: [],
              count: 0,
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
    params={"symbol": "2330", "limit": 24}
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/monthly-revenue?symbol=2330&limit=24",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/monthly-revenue?symbol=2330&limit=24" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "monthly_revenue",
      rows: [
        {
          symbol: "2330",
          revenue_month: "2026-03",
          revenue: 210000000000,
          revenue_yoy: 0.18,
          revenue_mom: 0.05,
        },
      ],
      count: 1,
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
      "月營收 API 提供 TWSE 範圍的每月營收資料，來源為 mops_official，並以 canonical 形態供應。",
      "monthly_revenue 已通過 baseline freeze signoff；本頁內容以 freeze 審核結果為準。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "凍結覆蓋範圍：2023-06..2026-04",
      "總筆數：37,196",
      "涵蓋股票數：1,077",
      "重複鍵（ticker + revenue_month）：0",
      "市場範圍：TWSE only（不含 TPEx / OTC）",
      "來源：mops_official / canonical",
      "觀察營收成長趨勢",
      "提前判斷基本面變化",
      "建立營收動能策略",
      "與價格資料對照短期反應",
      "作為量化模型中的輸入特徵",
    ],
    gettingStarted: [
      "優先使用 symbol 查詢單一公司。",
      "若需要趨勢分析，建議拉取至少 12～24 個月資料。",
      "若做回測或策略，建議資料落地後再使用。",
      "若與財報整合，應保留月份與期間欄位。",
      "若遇到空值欄位，請保留空值語意，不建議自行補值。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（建議用於控制月份數）。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].revenue_month", type: "string", description: "營收月份（例如 2026-03）。" },
      { path: "rows[].revenue", type: "number", description: "當月營收。" },
      { path: "rows[].revenue_yoy", type: "number|null", description: "年增率（若目前 schema 有）。" },
      { path: "rows[].revenue_mom", type: "number|null", description: "月增率（若目前 schema 有）。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "使用 symbol + revenue_month 作為識別。",
      "若要分析成長，可搭配 yoy / mom（若該筆資料有提供）。",
      "若要做策略，建議與價格資料整合。",
      "若需要完整財務結構，應搭配財報資料。",
      "若做 ranking，可直接用 revenue 或 growth 指標。",
      "本資料非即時（non-real-time）服務，且覆蓋範圍限於已驗證 freeze 視窗。",
      "raw_payload / raw_report 與 forbidden content 在已審核凍結範圍內為未保留狀態。",
      "idempotency 結論來自既有 artifacts + DB state（0/0/37,196），未執行 live source 重算。",
      "本頁內容僅供資料工程與分析使用，不構成投資建議。",
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
              rows: [],
              count: 0,
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

function buildValuationDataApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/valuation-data";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/valuation-data",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 60
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/valuation-data?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=60",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/valuation-data?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=60" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "valuation_data",
      rows: [
        {
          symbol: "2330",
          date: "2026-04-22",
          market_cap: 21050000000000,
          pe_ratio: 25.3,
          pb_ratio: 6.7,
          dividend_yield: 0.018,
          enterprise_value: 20900000000000,
          ev_to_ebitda: 17.2,
          price_to_sales: 9.4,
        },
      ],
      count: 1,
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
      "估值資料 API 提供台股公司的估值相關指標，適合用於估值篩選、相對比較與研究流程。",
      "資料包含市值、估值比率與企業價值類欄位，可與價格與財報資料共同使用。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "建立估值篩選條件（例如本益比、股價淨值比、殖利率）。",
      "進行同產業或同市場公司的相對估值比較。",
      "搭配財報與價格資料做多維度研究分析。",
      "在策略或量化流程中加入估值因子。",
    ],
    gettingStarted: [
      "優先使用 symbol 查詢單一公司。",
      "若做趨勢觀察，建議搭配 start_date / end_date。",
      "若要控制資料量，可搭配 limit。",
      "若與其他資料整合，請保留 date 與 lineage 欄位。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].date", type: "string", description: "資料日期（交易日語意）。" },
      { path: "rows[].market_cap", type: "number|null", description: "市值。" },
      { path: "rows[].pe_ratio", type: "number|null", description: "本益比（PE）。" },
      { path: "rows[].pb_ratio", type: "number|null", description: "股價淨值比（PB）。" },
      { path: "rows[].dividend_yield", type: "number|null", description: "殖利率。" },
      { path: "rows[].enterprise_value", type: "number|null", description: "企業價值（EV）。" },
      { path: "rows[].ev_to_ebitda", type: "number|null", description: "EV / EBITDA。" },
      { path: "rows[].price_to_sales", type: "number|null", description: "市銷率（P/S）。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "估值欄位可能受價格波動與財報更新時點影響。",
      "跨標的比較前，建議固定同一日期區間。",
      "若欄位為 null，通常代表當期無法穩定計算，不建議直接補零。",
      "日期以 Asia/Taipei 交易日語意（YYYY-MM-DD）為準。",
      "Canonical 補充：`/v2/datasets/valuation-core-daily` 為較低層查詢面（ticker/date_from/date_to）。",
      "一般產品整合建議優先使用本頁主公開 endpoint `/v2/datasets/valuation-data`。",
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
          description: "成功回傳估值資料",
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
                message: "目前方案無法存取 valuation-data。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的估值資料",
          body: JSON.stringify(
            {
              dataset: "valuation_data",
              rows: [],
              count: 0,
              message: "查無符合條件的估值資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildValuationDataApiSections(): DocsContentSection[] {
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

function buildIncomeStatementApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/income-statement";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/income-statement",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2025-01-01",
        "end_date": "2026-12-31",
        "limit": 12
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/income-statement?symbol=2330&start_date=2025-01-01&end_date=2026-12-31&limit=12",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/income-statement?symbol=2330&start_date=2025-01-01&end_date=2026-12-31&limit=12" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "income_statement",
      rows: [
        {
          symbol: "2330",
          fiscal_year: 2025,
          fiscal_quarter: 4,
          period_type: "quarterly",
          period_end_date: "2025-12-31",
          report_date: "2026-03-08",
          source: "mops_official",
          revenue: 625000000000,
          gross_profit: 320000000000,
          operating_income: 250000000000,
          pretax_income: 246000000000,
          net_income: 210000000000,
          eps: 8.1,
        },
      ],
      count: 1,
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
      "此資料集為「財報資料」的一部分，建議搭配現金流量表一起使用（`/docs/api/financial-growth/cash-flow-statement`）。",
      "損益表 API 提供公司期間性的營收與獲利欄位，適合用於基本面分析與研究流程。",
      "資料來自公開揭露來源，並以結構化欄位回傳；本次為文件同步更新，不涉及 API 行為變更。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "追蹤公司季度與年度獲利表現。",
      "搭配估值資料做相對評價分析。",
      "建立財務因子與成長性模型。",
      "與月營收資料交叉驗證營運趨勢。",
    ],
    gettingStarted: [
      "使用 symbol 指定公司代碼。",
      "可透過 start_date / end_date 控制財報期間範圍。",
      "若只需近期資料，可降低 limit 以縮小回應。",
      "建議保留 period_type 與 fiscal_year 以利後續分組分析。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].fiscal_year", type: "integer", description: "財政年度。" },
      { path: "rows[].fiscal_quarter", type: "integer|null", description: "財政季度。" },
      { path: "rows[].period_type", type: "string", description: "期間類型（quarterly/annual/ttm）。" },
      { path: "rows[].period_end_date", type: "string", description: "財報期間結束日期。" },
      { path: "rows[].report_date", type: "string|null", description: "公告或報告日期。" },
      { path: "rows[].revenue", type: "number|null", description: "營收。" },
      { path: "rows[].gross_profit", type: "number|null", description: "毛利。" },
      { path: "rows[].operating_income", type: "number|null", description: "營業利益。" },
      { path: "rows[].pretax_income", type: "number|null", description: "稅前淨利。" },
      { path: "rows[].net_income", type: "number|null", description: "稅後淨利。" },
      { path: "rows[].eps", type: "number|null", description: "每股盈餘。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "Baseline freeze signoff 已通過（income_statement）：驗證視窗為 2023-06-30..2026-03-31。",
      "來源與主表：mops_official（12,268 筆），source-of-truth table 為 `fundamental_income_statements`。",
      "覆蓋統計：rows=12,268、distinct tickers=1,041、duplicate logical keys=0。",
      "資料治理：raw_payload 非空筆數=0（不保留 raw payload）。",
      "冪等性證據：would_insert=0、would_update=0、would_skip=12,268（high confidence）。",
      "財報資料互補：建議搭配現金流量表 `/v2/datasets/cash-flow-statement` 一起分析公司獲利與現金品質。",
      "欄位完整度會因公司與期間不同而有差異，缺值應以 null 處理。",
      "日期欄位以 Asia/Taipei 財報語意（YYYY-MM-DD）為準。",
      "若需三大表完整欄位，請搭配財報三表相關資料主題。",
      "Canonical 補充：`/v2/datasets/financials` 為較低層查詢面，支援 statement_type/period_type。",
      "一般產品整合建議優先使用本頁主公開 endpoint `/v2/datasets/income-statement`。",
      "限制聲明：本頁不宣稱即時資料（real-time）、不構成投資建議，且不額外主張 TPEx/OTC 完整覆蓋。",
      "範圍聲明：本頁僅陳述已驗證期間與統計，不主張超出 2023-06-30..2026-03-31 的完整歷史覆蓋。",
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
          description: "成功回傳損益表資料",
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
                message: "目前方案無法存取 income-statement。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的損益表資料",
          body: JSON.stringify(
            {
              dataset: "income_statement",
              rows: [],
              count: 0,
              message: "查無符合條件的損益表資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildIncomeStatementApiSections(): DocsContentSection[] {
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

function buildCashFlowStatementApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/cash-flow-statement";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/cash-flow-statement",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2025-01-01",
        "end_date": "2026-12-31",
        "limit": 12
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/cash-flow-statement?symbol=2330&start_date=2025-01-01&end_date=2026-12-31&limit=12",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/cash-flow-statement?symbol=2330&start_date=2025-01-01&end_date=2026-12-31&limit=12" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "cash_flow_statement",
      rows: [
        {
          symbol: "2330",
          fiscal_year: 2025,
          fiscal_quarter: 4,
          period_type: "quarterly",
          period_end_date: "2025-12-31",
          report_date: null,
          source: "official_mopsov_ajax_t163sb20",
          operating_cash_flow: 1320000000000,
          investing_cash_flow: -742000000000,
          financing_cash_flow: -221000000000,
          free_cash_flow: null,
        },
      ],
      count: 1,
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
      "此 endpoint 提供現金流量表資料，對應 backend `cash_flow_statement` / `fundamental_cash_flows`，來源為 `official_mopsov_ajax_t163sb20`。",
      "Cash Flow Phase A conservative baseline final freeze 已通過；目前 scope 僅限 TWSE（TYPEK=sii）且排除 TPEx / OTC。",
      "凍結覆蓋區間為 2023Q2..2026Q1，總筆數 12,685；此頁不代表完整歷史現金流覆蓋，也不是即時資料。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "檢查營運現金流與自由現金流的變化趨勢。",
      "搭配損益表交叉驗證獲利品質與現金轉換能力。",
      "做財務健康度與風險指標研究。",
      "與估值資料整合做資本效率分析。",
    ],
    gettingStarted: [
      "使用 symbol 指定公司代碼。",
      "可透過 start_date / end_date 控制財報期間範圍。",
      "若只需近期資料，可降低 limit 以縮小回應。",
      "建議保留 period_type 與 fiscal_year 以利後續分組分析。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].fiscal_year", type: "integer", description: "財政年度。" },
      { path: "rows[].fiscal_quarter", type: "integer|null", description: "財政季度。" },
      { path: "rows[].period_type", type: "string", description: "期間類型（quarterly/annual/ttm）。" },
      { path: "rows[].period_end_date", type: "string", description: "財報期間結束日期。" },
      { path: "rows[].report_date", type: "string|null", description: "報告日期；在目前 Phase A conservative baseline 屬 deferred，若無核准直接來源欄位則為 null。" },
      { path: "rows[].source", type: "string", description: "來源識別；目前 frozen baseline 為 `official_mopsov_ajax_t163sb20`。" },
      { path: "rows[].operating_cash_flow", type: "number|null", description: "營運活動現金流（來源可得時提供）。" },
      { path: "rows[].investing_cash_flow", type: "number|null", description: "投資活動現金流（來源可得時提供）。" },
      { path: "rows[].financing_cash_flow", type: "number|null", description: "籌資活動現金流（來源可得時提供）。" },
      { path: "rows[].free_cash_flow", type: "number|null", description: "自由現金流；目前 Phase A conservative baseline 屬 deferred，無核准直接來源欄位。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "Coverage（Phase A conservative baseline）：2026Q1=1044、2025Q4=1078、2025Q3=1079、2025Q2=1077、2025Q1=1060、2024Q4=1078、2024Q3=1043、2024Q2=1070、2024Q1=1026、2023Q4=1077、2023Q3=1008、2023Q2=1045（total=12,685）。",
      "Scope / exclusions：僅 TWSE（TYPEK=sii）Non-TPEx；2023Q1 excluded；TPEx / OTC excluded。",
      "欄位完整度會因公司與期間不同而有差異，缺值應以 null 處理；`free_cash_flow` 與 `report_date` 在目前 frozen baseline 為 deferred 欄位語意。",
      "Frozen baseline 不保留 raw_payload（raw_payload 非對外欄位，且不作為可查詢內容）。",
      "此 endpoint 不宣稱即時資料、不構成投資建議，且不代表 full historical cash flow coverage。",
      "財報資料互補：建議搭配損益表 `/v2/datasets/income-statement` 一起分析獲利與現金品質。",
      "Canonical 補充：`/v2/datasets/financials` 為較低層查詢面，支援 statement_type/period_type。",
      "一般產品整合建議優先使用本頁主公開 endpoint `/v2/datasets/cash-flow-statement`。",
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
          description: "成功回傳現金流量表資料",
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
                message: "目前方案無法存取 cash-flow-statement。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的現金流量表資料",
          body: JSON.stringify(
            {
              dataset: "cash_flow_statement",
              rows: [],
              count: 0,
              message: "查無符合條件的現金流量表資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildCashFlowStatementApiSections(): DocsContentSection[] {
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

function buildBalanceSheetApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/balance-sheet";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/balance-sheet",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2025-01-01",
        "end_date": "2026-12-31",
        "limit": 12
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/balance-sheet?symbol=2330&start_date=2025-01-01&end_date=2026-12-31&limit=12",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/balance-sheet?symbol=2330&start_date=2025-01-01&end_date=2026-12-31&limit=12" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "balance_sheet",
      rows: [
        {
          symbol: "2330",
          fiscal_year: 2025,
          fiscal_quarter: 4,
          period_type: "quarterly",
          period_end_date: "2025-12-31",
          report_date: "2026-03-08",
          source: "mops_official",
          total_assets: 7120000000000,
          total_liabilities: 2920000000000,
          total_equity: 4200000000000,
          cash_and_cash_equivalents: 1980000000000,
          inventory: 294000000000,
          accounts_receivable: 362000000000,
          updated_at: "2026-04-23T03:10:00+00:00",
        },
      ],
      count: 1,
      meta: {
        plan: "free",
        row_limit: 50,
        is_limited: false,
      },
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
      "此資料集為「財報資料」的一部分，建議搭配損益表與現金流量表一起使用。",
      "資產負債表 API 提供公司資產、負債與權益欄位，適合用於資本結構與償債能力分析。",
      "資料來自公開揭露來源，並以結構化欄位回傳；本次為文件同步更新，不涉及 API 行為變更。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "觀察公司資本結構與資產負債變化。",
      "搭配損益表與現金流量表評估財務穩健度。",
      "建立財務健康度與風險監控指標。",
      "在研究流程中做跨期比較分析。",
    ],
    gettingStarted: [
      "使用 symbol 指定公司代碼。",
      "可透過 start_date / end_date 控制財報期間範圍。",
      "若只需近期資料，可降低 limit 以縮小回應。",
      "回應包含 meta（plan/row_limit/is_limited），可辨識方案截斷狀態。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count，並附 meta（plan/row_limit/is_limited）。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].fiscal_year", type: "integer", description: "財政年度。" },
      { path: "rows[].fiscal_quarter", type: "integer|null", description: "財政季度。" },
      { path: "rows[].period_type", type: "string", description: "期間類型（quarterly/annual/ttm）。" },
      { path: "rows[].period_end_date", type: "string", description: "財報期間結束日期。" },
      { path: "rows[].report_date", type: "string|null", description: "公告或報告日期。" },
      { path: "rows[].source", type: "string", description: "來源識別。" },
      { path: "rows[].total_assets", type: "number|null", description: "總資產。" },
      { path: "rows[].total_liabilities", type: "number|null", description: "總負債。" },
      { path: "rows[].total_equity", type: "number|null", description: "股東權益總額。" },
      { path: "rows[].cash_and_cash_equivalents", type: "number|null", description: "現金及約當現金。" },
      { path: "rows[].inventory", type: "number|null", description: "存貨。" },
      { path: "rows[].accounts_receivable", type: "number|null", description: "應收帳款。" },
      { path: "rows[].updated_at", type: "string|null", description: "資料更新時間。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
      { path: "meta.plan", type: "string", description: "目前方案代碼。" },
      { path: "meta.row_limit", type: "integer", description: "方案每次請求可回傳上限。" },
      { path: "meta.is_limited", type: "boolean", description: "是否因方案限制而截斷資料。" },
    ],
    notes: [
      "Baseline freeze signoff 已通過（balance_sheet）：驗證視窗為 2023-06-30..2026-03-31。",
      "來源與主表：mops_official=12,685、official_mopsov_ajax_t163sb05=20，source-of-truth table 為 `fundamental_balance_sheets`。",
      "覆蓋統計：rows=12,705、distinct tickers=1,076、duplicate logical keys=0。",
      "資料治理：raw_payload 非空筆數=0（不保留 raw payload）。",
      "冪等性證據：would_insert=0、would_update=0、would_skip=12,705（high confidence）。",
      "財報資料互補：建議搭配損益表 `/v2/datasets/income-statement` 與現金流量表 `/v2/datasets/cash-flow-statement`。",
      "欄位完整度會因公司與期間不同而有差異，缺值應以 null 處理。",
      "日期欄位以 Asia/Taipei 財報語意（YYYY-MM-DD）為準。",
      "Canonical 補充：`/v2/datasets/financials` 為較低層查詢面，支援 statement_type/period_type。",
      "一般產品整合建議優先使用本頁主公開 endpoint `/v2/datasets/balance-sheet`。",
      "限制聲明：本頁不宣稱即時資料（real-time）、不構成投資建議，且不額外主張 TPEx/OTC 完整覆蓋。",
      "範圍聲明：本頁僅陳述已驗證期間與統計，不主張超出 2023-06-30..2026-03-31 的完整歷史覆蓋。",
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
          description: "成功回傳資產負債表資料",
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
                message: "目前方案無法存取 balance-sheet。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的資產負債表資料",
          body: JSON.stringify(
            {
              dataset: "balance_sheet",
              rows: [],
              count: 0,
              meta: {
                plan: "free",
                row_limit: 50,
                is_limited: false,
              },
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildBalanceSheetApiSections(): DocsContentSection[] {
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

function buildFinancialsCanonicalApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/financials";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/financials",
    headers=headers,
    params={
        "ticker": "2330",
        "statement_type": "income_statement",
        "period_type": "quarterly",
        "date_from": "2025-01-01",
        "date_to": "2026-12-31",
        "limit": 5
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/financials?ticker=2330&statement_type=income_statement&period_type=quarterly&date_from=2025-01-01&date_to=2026-12-31&limit=5",
  {
    headers: { "X-API-Key": "your_api_key_here" }
  }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/financials?ticker=2330&statement_type=income_statement&period_type=quarterly&date_from=2025-01-01&date_to=2026-12-31&limit=5" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/financials",
      request_id: "req_abc123def456",
      plan_id: "free",
      dataset: "financials",
      query: {
        ticker: "2330",
        statement_type: "income_statement",
        period_type: "quarterly",
        date_from: "2025-01-01",
        date_to: "2026-12-31",
        limit: 5,
      },
      meta: {
        rows_returned: 1,
        mandatory_contract_fields_present: [
          "api_version",
          "dataset",
          "dataset_version",
          "release_date",
          "release_version",
          "request_context",
          "data",
          "quality",
          "lineage",
          "error",
        ],
      },
      envelope: {
        api_version: "v2",
        dataset: "financials",
        dataset_version: "v2.0.0-preview",
        release_version: "v2.2026-04-23.preview",
        release_date: "2026-04-23",
        request_context: {
          ticker: "2330",
          as_of_date: "2026-12-31",
          family: "fundamentals",
          field_group_type: "fundamental_statement",
          dataset_view: "fundamental_statements_v1",
        },
        data: [
          {
            ticker: "2330",
            statement_type: "income_statement",
            period_type: "quarterly",
            fiscal_period_end: "2025-12-31",
            report_date: "2026-03-08",
            fiscal_year: 2025,
            fiscal_quarter: 4,
            currency: "TWD",
            source_id: "mops_official",
            fields: {
              revenue: 625000000000,
              gross_profit: 320000000000,
              operating_income: 250000000000,
              pretax_income: 246000000000,
              net_income: 210000000000,
              eps: 8.1,
            },
            quality_flag: "ok",
          },
        ],
        quality: {
          freshness_state: "fresh",
          freshness_as_of: "2026-12-31",
          completeness_ratio: 1,
          quality_status: "ready",
        },
        lineage: {
          source_role: "canonical",
          selected_source: "mops_official",
          fallback_chain: ["data_gov_mirror", "finmind_legacy"],
          policy_notes: ["official/public-first canonical"],
        },
        error: {
          error_code: null,
          error_message: null,
          dataset: "financials",
          request_id: "read-api-abc123def456",
          blocking_gate: null,
        },
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "財務與成長（Canonical）",
    endpoint,
    method: "GET",
    overview: [
      "financials 是 canonical/supplemental surface，提供較低階、可組合的財報結構資料。",
      "此 route 不是主公開產品頁；若要穩定對外整合，優先使用 `/v2/datasets/income-statement`。",
    ],
    requestDescription: ["使用此 endpoint 時，請注意它與 productized endpoint 契約不同。"],
    useCases: [
      "需要 statement_type（income/balance/cash flow）共用查詢入口時。",
      "內部或進階流程需直接讀 canonical envelope 時。",
      "做欄位映射或 schema 對照測試時。",
    ],
    gettingStarted: [
      "先用 ticker + statement_type + period_type 收斂資料範圍。",
      "再透過 date_from/date_to 控制期間。",
      "若是對外產品整合，建議改用 income-statement 主公開 endpoint。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: false, description: "股票代碼（canonical route 使用 ticker）。" },
      { name: "statement_type", type: "string", required: false, description: "income_statement / balance_sheet / cash_flow。" },
      { name: "period_type", type: "string", required: false, description: "quarterly / annual / ttm。" },
      { name: "date_from", type: "string", required: false, description: "期間起始（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "期間結束（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: [
      "回應為 canonical envelope payload，頂層包含 api_version/endpoint/request_id/plan_id/dataset/query/meta/envelope。",
      "實際資料列位於 `envelope.data[]`，非 productized endpoint 的 `rows`。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 financials。" },
      { path: "query.ticker", type: "string|null", description: "查詢 ticker。" },
      { path: "query.statement_type", type: "string|null", description: "查詢財報類型。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料列數。" },
      { path: "envelope.data[].ticker", type: "string", description: "股票代碼。" },
      { path: "envelope.data[].statement_type", type: "string", description: "財報類型。" },
      { path: "envelope.data[].period_type", type: "string", description: "期間類型。" },
      { path: "envelope.data[].fields", type: "object", description: "對應 statement 的欄位集合。" },
      { path: "envelope.quality.quality_status", type: "string", description: "資料品質狀態。" },
      { path: "envelope.lineage.source_role", type: "string", description: "來源角色（canonical/fallback/helper/legacy）。" },
    ],
    notes: [
      "此頁為 canonical/supplemental surface，非主產品 endpoint。",
      "主公開對外建議：`/v2/datasets/income-statement`（symbol + dataset/rows/count）。",
      "canonical endpoint 使用 `ticker` 參數，請勿視為主 endpoint 的替代叫法。",
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
        { status: "200", description: "成功回傳 canonical financials payload", body: successBody },
        { status: "400", description: "statement_type 或 period_type 不支援", body: `{"detail":"unsupported_statement_type"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"financials","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildFinancialsCanonicalApiSections(): DocsContentSection[] {
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

function buildValuationsCanonicalApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/valuation-core-daily";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/valuation-core-daily",
    headers=headers,
    params={
        "ticker": "2330",
        "date_from": "2026-01-01",
        "date_to": "2026-04-30",
        "limit": 10
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/valuation-core-daily?ticker=2330&date_from=2026-01-01&date_to=2026-04-30&limit=10",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/valuation-core-daily?ticker=2330&date_from=2026-01-01&date_to=2026-04-30&limit=10" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/valuation-core-daily",
      request_id: "req_def456ghi789",
      plan_id: "free",
      dataset: "valuation_core_daily",
      query: {
        ticker: "2330",
        date_from: "2026-01-01",
        date_to: "2026-04-30",
        limit: 10,
      },
      meta: { rows_returned: 1 },
      envelope: {
        api_version: "v2",
        dataset: "valuations",
        data: [
          {
            ticker: "2330",
            valuation_date: "2026-04-22",
            pe_ratio: 25.3,
            pb_ratio: 6.7,
            dividend_yield: 0.018,
            market_cap: 21050000000000,
            eps: null,
            currency: "TWD",
            source_id: "mops_official",
            quality_flag: "ok",
          },
        ],
        quality: {
          freshness_state: "fresh",
          freshness_as_of: "2026-04-30",
          completeness_ratio: 1,
          quality_status: "ready",
        },
        lineage: {
          source_role: "canonical",
          selected_source: "mops_official",
          fallback_chain: ["data_gov_mirror", "finmind_legacy"],
          policy_notes: ["official/public-first canonical"],
        },
        error: {
          error_code: null,
          error_message: null,
          dataset: "valuations",
          request_id: "read-api-def456ghi789",
          blocking_gate: null,
        },
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "財務與成長（Canonical）",
    endpoint,
    method: "GET",
    overview: [
      "valuations 是 canonical/supplemental surface，提供估值核心欄位的低階 envelope。",
      "此 route 不是主公開產品頁；對外整合優先使用 `/v2/datasets/valuation-data`。",
    ],
    requestDescription: ["本 route 採 canonical 契約，參數與回應格式與主公開 endpoint 不同。"],
    useCases: [
      "內部資料對齊與估值核心欄位驗證。",
      "需要直接讀取 canonical envelope 與 lineage 時。",
      "補充 productized endpoint 之外的低階資料查詢。",
    ],
    gettingStarted: [
      "使用 ticker 與日期區間控制查詢。",
      "limit 可限制回傳筆數。",
      "若是對外產品用途，建議改用 valuation-data 主公開 endpoint。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: false, description: "股票代碼（canonical route 使用 ticker）。" },
      { name: "date_from", type: "string", required: false, description: "起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: [
      "回應為 canonical envelope payload（api_version/endpoint/request_id/.../envelope）。",
      "估值資料列位於 `envelope.data[]`，非 productized endpoint 的 `rows`。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 valuations。" },
      { path: "query.ticker", type: "string|null", description: "查詢 ticker。" },
      { path: "envelope.data[].valuation_date", type: "string", description: "估值資料日期。" },
      { path: "envelope.data[].pe_ratio", type: "number|null", description: "本益比。" },
      { path: "envelope.data[].pb_ratio", type: "number|null", description: "股價淨值比。" },
      { path: "envelope.data[].dividend_yield", type: "number|null", description: "殖利率。" },
      { path: "envelope.data[].market_cap", type: "number|null", description: "市值。" },
      { path: "envelope.quality.quality_status", type: "string", description: "資料品質狀態。" },
      { path: "envelope.lineage.selected_source", type: "string", description: "選用來源。" },
    ],
    notes: [
      "此頁為 canonical/supplemental surface，非主產品 endpoint。",
      "主公開對外建議：`/v2/datasets/valuation-data`（symbol + dataset/rows/count）。",
      "canonical endpoint 使用 `ticker` 參數，請勿視為主 endpoint 的替代叫法。",
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
        { status: "200", description: "成功回傳 canonical valuations payload", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"valuations","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildValuationsCanonicalApiSections(): DocsContentSection[] {
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

function buildMarketPricesCanonicalApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/market-prices";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/market-prices",
    headers=headers,
    params={
        "ticker": "2330",
        "market": "TWSE",
        "date_from": "2026-01-01",
        "date_to": "2026-04-30",
        "limit": 10
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/market-prices?ticker=2330&market=TWSE&date_from=2026-01-01&date_to=2026-04-30&limit=10",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/market-prices?ticker=2330&market=TWSE&date_from=2026-01-01&date_to=2026-04-30&limit=10" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/market-prices",
      request_id: "req_xyz987uvw654",
      plan_id: "developer",
      dataset: "market_prices",
      query: {
        ticker: "2330",
        market: "TWSE",
        date_from: "2026-01-01",
        date_to: "2026-04-30",
        limit: 10,
      },
      meta: { rows_returned: 1 },
      envelope: {
        api_version: "v2",
        dataset: "market_prices",
        request_context: {
          ticker: "2330",
          as_of_date: "2026-04-30",
          family: "market_technical",
          field_group_type: "price_series",
        },
        data: [
          {
            ticker: "2330",
            market: "TWSE",
            trade_date: "2026-04-22",
            open: 812,
            high: 818,
            low: 808,
            close: 815,
            volume_shares: 18234000,
            turnover_value: 14856300000,
            trade_count: 37842,
            price_change: 6,
            price_change_sign: "+",
            source_canonical: "twse_official",
            source_name: "TWSE",
          },
        ],
        quality: {
          freshness_state: "fresh",
          freshness_as_of: "2026-04-30",
          completeness_ratio: 1,
          quality_status: "ready",
        },
        lineage: {
          source_role: "canonical",
          selected_source: "twse_official",
          fallback_chain: ["tpex_official", "data_gov_mirror", "yahoo_helper"],
          policy_notes: ["official/public-first canonical"],
        },
        error: {
          error_code: null,
          error_message: null,
          dataset: "market_prices",
          request_id: "read-api-xyz987uvw654",
          blocking_gate: null,
        },
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格（Canonical）",
    endpoint,
    method: "GET",
    overview: [
      "market-prices 是 canonical/supplemental surface，提供跨市場（TWSE/TPEx）的低階價格資料查詢。",
      "此 route 不是主公開產品頁；對外整合優先使用 `/v2/datasets/twse-daily-price` 或 `/v2/datasets/tpex-daily-price`。",
    ],
    requestDescription: ["本 route 為 canonical payload，回應與主公開 endpoint 不同。"],
    useCases: [
      "跨市場統一查詢（market + ticker + 日期範圍）。",
      "直接取得 canonical envelope 與來源鏈路。",
      "進階資料映射與內部工具整合。",
    ],
    gettingStarted: [
      "使用 ticker 與 market 控制查詢範圍。",
      "可搭配 date_from/date_to 與 limit。",
      "若是對外產品串接，優先使用 twse/tpex 日線主公開 endpoint。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: false, description: "股票代碼（canonical route 使用 ticker）。" },
      { name: "market", type: "string", required: false, description: "TWSE 或 TPEx。" },
      { name: "date_from", type: "string", required: false, description: "起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: [
      "回應為 canonical envelope payload（api_version/endpoint/request_id/.../envelope）。",
      "價格資料列位於 `envelope.data[]`，非 productized endpoint 的 `rows`。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 market_prices。" },
      { path: "query.market", type: "string|null", description: "查詢市場別。" },
      { path: "envelope.data[].ticker", type: "string", description: "股票代碼。" },
      { path: "envelope.data[].market", type: "string", description: "市場別。" },
      { path: "envelope.data[].trade_date", type: "string", description: "交易日期。" },
      { path: "envelope.data[].open/high/low/close", type: "number", description: "OHLC 欄位。" },
      { path: "envelope.data[].volume_shares", type: "number", description: "成交股數。" },
      { path: "envelope.quality.quality_status", type: "string", description: "資料品質狀態。" },
    ],
    notes: [
      "此頁為 canonical/supplemental surface，非主產品 endpoint。",
      "主公開對外建議：`/v2/datasets/twse-daily-price`、`/v2/datasets/tpex-daily-price`（symbol + dataset/rows/count）。",
      "canonical endpoint 使用 `ticker` 參數，與主公開 endpoint `symbol` 契約不同。",
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
        { status: "200", description: "成功回傳 canonical market-prices payload", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"market_prices","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildMarketPricesCanonicalApiSections(): DocsContentSection[] {
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

function buildAdjustedPricesCanonicalApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/adjusted-prices";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/adjusted-prices",
    headers=headers,
    params={
        "ticker": "2330",
        "market": "TWSE",
        "date_from": "2026-01-01",
        "date_to": "2026-04-30",
        "adjustment_basis": "price_only",
        "limit": 10
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/adjusted-prices?ticker=2330&market=TWSE&date_from=2026-01-01&date_to=2026-04-30&adjustment_basis=price_only&limit=10",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/adjusted-prices?ticker=2330&market=TWSE&date_from=2026-01-01&date_to=2026-04-30&adjustment_basis=price_only&limit=10" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/adjusted-prices",
      request_id: "req_hij321klm654",
      plan_id: "pro",
      dataset: "adjusted_prices",
      query: {
        ticker: "2330",
        market: "TWSE",
        date_from: "2026-01-01",
        date_to: "2026-04-30",
        adjustment_basis: "price_only",
        limit: 10,
      },
      meta: { rows_returned: 1 },
      envelope: {
        api_version: "v2",
        dataset: "adjusted_prices",
        request_context: {
          ticker: "2330",
          as_of_date: "2026-04-30",
          family: "market_technical",
          field_group_type: "adjusted_price_series",
          dataset_view: "adjusted_prices_v3",
          adjustment_basis: "price_only",
        },
        data: [
          {
            ticker: "2330",
            trade_date: "2026-04-22",
            market: "TWSE",
            close: 815,
            adjusted_close: 790.5,
            adjustment_factor: 0.97,
            adjusted_close_total_return: null,
            adjustment_factor_total_return: null,
            adjustment_factor_actions_v3: 0.97,
            dividend_component: null,
            actions_applied: ["split"],
            actions_excluded: [],
            adjustment_basis: "price_only",
            open: 812,
            high: 818,
            low: 808,
            adjusted_open: 787.64,
            adjusted_high: 793.46,
            adjusted_low: 783.76,
            volume_shares: 18234000,
            adjusted_volume: 18800000,
            source_id: "twse_official",
            quality_flag: "ok",
          },
        ],
        quality: {
          freshness_state: "fresh",
          freshness_as_of: "2026-04-30",
          completeness_ratio: 1,
          quality_status: "ready",
        },
        lineage: {
          source_role: "canonical",
          selected_source: "market_prices_plus_corporate_actions",
          fallback_chain: ["twse_official", "tpex_official", "data_gov_mirror"],
          policy_notes: ["official/public-first canonical"],
        },
        error: {
          error_code: null,
          error_message: null,
          dataset: "adjusted_prices",
          request_id: "read-api-hij321klm654",
          blocking_gate: null,
        },
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格（Canonical）",
    endpoint,
    method: "GET",
    overview: [
      "adjusted-prices 為 canonical/supplemental 實驗路徑，依賴 market-prices + corporate-actions。",
      "此 route 目前不在 public launch 可公開宣稱可用範圍；僅供契約設計與內部驗證參考。",
    ],
    requestDescription: ["本 route 為 canonical payload，且支援 adjustment_basis。"],
    useCases: [
      "比較未調整價格與調整後價格。",
      "驗證 split/dividend 等事件對價格序列影響。",
      "在內部流程中直接消費 adjusted canonical envelope。",
    ],
    gettingStarted: [
      "使用 ticker + market + 日期區間查詢。",
      "adjustment_basis 可選 `price_only` 或 `total_return`。",
      "若僅需主公開產品契約，建議使用 twse/tpex 日線主頁。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: false, description: "股票代碼（canonical route 使用 ticker）。" },
      { name: "market", type: "string", required: false, description: "TWSE 或 TPEx。" },
      { name: "date_from", type: "string", required: false, description: "起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "結束日期（YYYY-MM-DD）。" },
      { name: "adjustment_basis", type: "string", required: false, description: "price_only（預設）或 total_return。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: [
      "回應為 canonical envelope payload（api_version/endpoint/request_id/.../envelope）。",
      "調整後價格列位於 `envelope.data[]`，包含 adjustment_factor 與 actions_applied。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 adjusted_prices。" },
      { path: "query.adjustment_basis", type: "string", description: "調整基準。" },
      { path: "envelope.data[].ticker", type: "string", description: "股票代碼。" },
      { path: "envelope.data[].trade_date", type: "string", description: "交易日期。" },
      { path: "envelope.data[].close", type: "number", description: "原始收盤價。" },
      { path: "envelope.data[].adjusted_close", type: "number|null", description: "調整後收盤價。" },
      { path: "envelope.data[].adjustment_factor", type: "number", description: "調整係數。" },
      { path: "envelope.data[].actions_applied", type: "array", description: "已套用的公司行動類型。" },
      { path: "envelope.data[].actions_excluded", type: "array", description: "排除的行動類型與原因。" },
      { path: "envelope.quality.quality_status", type: "string", description: "資料品質狀態。" },
    ],
    notes: [
      "此頁為 canonical/supplemental surface，非主產品 endpoint。",
      "公開主張限制：目前不得宣稱 adjusted price 已可用於 production 或 full-market backtest。",
      "若需主公開產品契約，優先使用 twse/tpex 日線主公開 endpoint。",
      "canonical endpoint 使用 `ticker`，與主公開 endpoint `symbol` 命名不同。",
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
        { status: "200", description: "成功回傳 canonical adjusted-prices payload", body: successBody },
        { status: "400", description: "adjustment_basis 不支援", body: `{"detail":"unsupported_adjustment_basis"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"adjusted_prices","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildAdjustedPricesCanonicalApiSections(): DocsContentSection[] {
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

function buildTwseDailyPriceApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/twse-daily-price";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/twse-daily-price",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 5
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=5",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=5" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "twse_daily_price",
      rows: [
        {
          symbol: "2330",
          date: "2026-04-22",
          open: 812,
          high: 818,
          low: 808,
          close: 815,
          volume_shares: 18234000,
          turnover_value: 14856300000,
          trade_count: 37842,
          price_change: 6,
          price_change_sign: "+",
        },
      ],
      count: 1,
      meta: {
        plan: "free",
        row_limit: 50,
        is_limited: false,
      },
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格",
    endpoint,
    method: "GET",
    overview: [
      "TWSE 日線價格 API 提供上市股票的日線 OHLCV 與成交相關欄位，適合用於回測、價格研究與事件對照。",
      "資料以未還原（unadjusted）日線為主，日期語意採 Asia/Taipei 交易日。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "建立上市股票的歷史價格序列。",
      "與公告、事件、財報資料進行時間對齊分析。",
      "作為技術指標或特徵工程的基礎輸入。",
      "在研究流程中快速驗證單一標的近期價格行為。",
    ],
    gettingStarted: [
      "使用 symbol 指定標的（例如 2330）。",
      "可選擇 start_date / end_date 控制日期範圍。",
      "limit 預設 100，最大 5000。",
      "主公開 route 為本頁 endpoint；canonical 補充路徑請見 Notes。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count，並附 meta（plan/row_limit/is_limited）。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].date", type: "string", description: "交易日期（YYYY-MM-DD）。" },
      { path: "rows[].open", type: "number", description: "開盤價。" },
      { path: "rows[].high", type: "number", description: "最高價。" },
      { path: "rows[].low", type: "number", description: "最低價。" },
      { path: "rows[].close", type: "number", description: "收盤價。" },
      { path: "rows[].volume_shares", type: "number", description: "成交股數。" },
      { path: "rows[].turnover_value", type: "number|null", description: "成交金額。" },
      { path: "rows[].trade_count", type: "number|null", description: "成交筆數。" },
      { path: "rows[].price_change", type: "number|null", description: "漲跌價差。" },
      { path: "rows[].price_change_sign", type: "string|null", description: "漲跌符號（+/-）。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
      { path: "meta.plan", type: "string", description: "目前方案代碼。" },
      { path: "meta.row_limit", type: "integer", description: "方案每次請求可回傳上限。" },
      { path: "meta.is_limited", type: "boolean", description: "是否因方案限制而截斷資料。" },
    ],
    notes: [
      "此頁為主公開 endpoint 契約；不要與 legacy/canonical 回應格式混用。",
      "coverage 限制：TPEx 歷史深度目前仍為 deferred，不得視為完整歷史覆蓋。",
      "canonical/supplemental surface 補充：`/v2/datasets/market-prices`。",
      "若需要權值事件調整後序列，請改用對應 adjusted/canonical 路徑。",
      "若需要較低層 canonical payload（含 envelope 與 lineage），請參考「市場價格（Canonical）」與「調整價格（Canonical）」。",
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
        { status: "200", description: "成功回傳 TWSE 日線資料", body: successBody },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify({ error: { code: "BAD_REQUEST", message: "查詢參數錯誤。" } }, null, 2),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify({ error: { code: "UNAUTHORIZED", message: "缺少或無效 API key。" } }, null, 2),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify({ error: { code: "FORBIDDEN", message: "目前方案無法存取 twse-daily-price。" } }, null, 2),
        },
        {
          status: "404",
          description: "查無符合條件的 TWSE 日線資料",
          body: JSON.stringify({ dataset: "twse_daily_price", rows: [], count: 0, message: "查無符合條件的 TWSE 日線資料。" }, null, 2),
        },
      ],
    },
  };
}

function buildTwseDailyPriceApiSections(): DocsContentSection[] {
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

function buildTpexDailyPriceApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/tpex-daily-price";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/tpex-daily-price",
    headers=headers,
    params={
        "symbol": "8069",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 5
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/tpex-daily-price?symbol=8069&start_date=2026-01-01&end_date=2026-04-30&limit=5",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/tpex-daily-price?symbol=8069&start_date=2026-01-01&end_date=2026-04-30&limit=5" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "tpex_daily_price",
      rows: [
        {
          symbol: "8069",
          date: "2026-04-22",
          open: 32.1,
          high: 32.9,
          low: 31.8,
          close: 32.6,
          volume_shares: 2745000,
          turnover_value: 89340000,
          trade_count: 3241,
          price_change: 0.5,
          price_change_sign: "+",
        },
      ],
      count: 1,
      meta: {
        plan: "free",
        row_limit: 50,
        is_limited: false,
      },
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格",
    endpoint,
    method: "GET",
    overview: [
      "TPEx 日線價格 API 目前為 beta / limited，主要提供最新區間資料。",
      "資料以未還原（unadjusted）日線為主，日期語意採 Asia/Taipei 交易日。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "建立上櫃股票近期價格序列（非完整歷史）。",
      "觀察事件前後的價格與成交量變化。",
      "作為技術指標與特徵工程上游資料來源。",
      "與其他市場資料進行跨資料集對照分析。",
    ],
    gettingStarted: [
      "使用 symbol 指定標的（例如 8069）。",
      "可選擇 start_date / end_date 控制日期範圍。",
      "limit 預設 100，最大 5000。",
      "主公開 route 為本頁 endpoint；canonical 補充路徑請見 Notes。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count，並附 meta（plan/row_limit/is_limited）。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].date", type: "string", description: "交易日期（YYYY-MM-DD）。" },
      { path: "rows[].open", type: "number", description: "開盤價。" },
      { path: "rows[].high", type: "number", description: "最高價。" },
      { path: "rows[].low", type: "number", description: "最低價。" },
      { path: "rows[].close", type: "number", description: "收盤價。" },
      { path: "rows[].volume_shares", type: "number", description: "成交股數。" },
      { path: "rows[].turnover_value", type: "number|null", description: "成交金額。" },
      { path: "rows[].trade_count", type: "number|null", description: "成交筆數。" },
      { path: "rows[].price_change", type: "number|null", description: "漲跌價差。" },
      { path: "rows[].price_change_sign", type: "string|null", description: "漲跌符號（+/-）。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
      { path: "meta.plan", type: "string", description: "目前方案代碼。" },
      { path: "meta.row_limit", type: "integer", description: "方案每次請求可回傳上限。" },
      { path: "meta.is_limited", type: "boolean", description: "是否因方案限制而截斷資料。" },
    ],
    notes: [
      "此頁為主公開 endpoint 契約；不要與 legacy/canonical 回應格式混用。",
      "canonical/supplemental surface 補充：`/v2/datasets/market-prices`。",
      "若需要權值事件調整後序列，請改用對應 adjusted/canonical 路徑。",
      "若需要較低層 canonical payload（含 envelope 與 lineage），請參考「市場價格（Canonical）」與「調整價格（Canonical）」。",
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
        { status: "200", description: "成功回傳 TPEx 日線資料", body: successBody },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify({ error: { code: "BAD_REQUEST", message: "查詢參數錯誤。" } }, null, 2),
        },
        {
          status: "401",
          description: "缺少或無效 API key",
          body: JSON.stringify({ error: { code: "UNAUTHORIZED", message: "缺少或無效 API key。" } }, null, 2),
        },
        {
          status: "403",
          description: "目前方案無法存取此資料",
          body: JSON.stringify({ error: { code: "FORBIDDEN", message: "目前方案無法存取 tpex-daily-price。" } }, null, 2),
        },
        {
          status: "404",
          description: "查無符合條件的 TPEx 日線資料",
          body: JSON.stringify({ dataset: "tpex_daily_price", rows: [], count: 0, message: "查無符合條件的 TPEx 日線資料。" }, null, 2),
        },
      ],
    },
  };
}

function buildTpexDailyPriceApiSections(): DocsContentSection[] {
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

function buildTechnicalIndicatorsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/technical-indicators";

  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}

response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/technical-indicators",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2026-01-01",
        "end_date": "2026-04-30",
        "limit": 60
    },
)

print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/technical-indicators?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=60",
  {
    headers: {
      "X-API-Key": "your_api_key_here"
    }
  }
)

const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/technical-indicators?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=60" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "technical_indicators",
      rows: [
        {
          ticker: "2330",
          market: "TWSE",
          trade_date: "2026-04-22",
          close: 815,
          volume: 18234000,
          daily_return: 0.00492611,
          ma_5: 809.4,
          ma_20: 796.8,
          ma_60: 772.1,
          volume_avg_20: 16852340.2,
          return_5d: 0.01750000,
          return_20d: 0.05130000,
          volatility_20d: 0.01420000,
          provider: "twse",
          source_role: "derived_from_twse_price",
          indicator_basis: "close",
          feature_set: "stage0",
          formula_version: "stage0_v1",
        },
      ],
      count: 1,
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
      "Technical Indicators 目前文件對齊的是 Technical Stage0 approved baseline。",
      "此 baseline 為 TWSE only / Non-TPEx，範圍覆蓋至 2026-05-11，且不包含 Stage1 指標（RSI / MACD）。",
    ],
    requestDescription: ["使用此 endpoint 時，建議："],
    useCases: [
      "以 Stage0 欄位建立可重跑的日頻特徵流程。",
      "搭配價格資料做報酬、趨勢與波動分析。",
      "作為研究與回測前處理特徵層（非即時交易訊號）。",
    ],
    gettingStarted: [
      "建議以 ticker/symbol + 日期區間查詢，並保留 market 與 indicator_basis 以維持 key4 語意。",
      "本頁欄位說明以 Stage0 production baseline 為準，不包含 Stage1（RSI / MACD）。",
      "若你需要 lineage / data_gaps，請依目前路由實際回應欄位為準。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker / symbol", type: "string", required: true, description: "股票代碼（建議使用 ticker；若現有 SDK 使用 symbol，沿用現有命名）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "market", type: "string", required: false, description: "市場代碼（目前 Stage0 baseline 為 TWSE）。" },
      { name: "indicator_basis", type: "string", required: false, description: "指標基礎（目前 baseline 為 close）。" },
      { name: "provider", type: "string", required: false, description: "來源 provider（若現有路由支援，可作為輔助條件）。" },
      { name: "source_role", type: "string", required: false, description: "來源角色（若現有路由支援，可作為輔助條件）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
    ],
    responseSummary: [
      "回應結構固定為 dataset、rows、count。",
      "Stage0 approved baseline coverage（TWSE only）",
      "- Older: 2023-06-01..2024-03-31 = 176,750 rows",
      "- Main baseline: 2024-04-01..2025-03-31 = 220,997 rows",
      "- Newer recut: 2025-04-01..2026-05-11 = 217,890 rows",
      "- Total: 615,637 rows",
    ],
    responseFields: [
      { path: "rows[].ticker", type: "string", description: "股票代碼。" },
      { path: "rows[].market", type: "string", description: "市場代碼（目前 baseline 為 TWSE）。" },
      { path: "rows[].trade_date", type: "string", description: "資料日期（交易日語意，Asia/Taipei）。" },
      { path: "rows[].close", type: "number", description: "收盤價。" },
      { path: "rows[].volume", type: "number|null", description: "成交量。" },
      { path: "rows[].daily_return", type: "number|null", description: "單日報酬率。" },
      { path: "rows[].ma_5", type: "number|null", description: "5 日均線。" },
      { path: "rows[].ma_20", type: "number|null", description: "20 日均線。" },
      { path: "rows[].ma_60", type: "number|null", description: "60 日均線。" },
      { path: "rows[].volume_avg_20", type: "number|null", description: "20 日平均成交量。" },
      { path: "rows[].return_5d", type: "number|null", description: "5 日報酬率。" },
      { path: "rows[].return_20d", type: "number|null", description: "20 日報酬率。" },
      { path: "rows[].volatility_20d", type: "number|null", description: "20 日波動度。" },
      { path: "rows[].provider", type: "string", description: "資料 provider（baseline: twse）。" },
      { path: "rows[].source_role", type: "string", description: "資料來源角色（baseline: derived_from_twse_price）。" },
      { path: "rows[].indicator_basis", type: "string", description: "指標基礎（baseline: close）。" },
      { path: "rows[].feature_set", type: "string", description: "特徵集合版本（baseline: stage0）。" },
      { path: "rows[].formula_version", type: "string", description: "公式版本（baseline: stage0_v1）。" },
      { path: "rows[].lineage", type: "object|null", description: "資料血緣（若當前路由有回傳）。" },
      { path: "rows[].data_gaps", type: "object|null", description: "資料缺口描述（若當前路由有回傳）。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "Stage0 baseline 目前為 TWSE only / Non-TPEx，請勿將此頁解讀為 TPEx technical coverage。",
      "Deferred：RSI / MACD / Stage1 advanced indicators 尚未納入目前 Stage0 production baseline。",
      "Known gap：2026-05-12..2026-05-15（upstream price dependency gap），不計入目前 approved baseline coverage。",
      "本資料為日頻衍生資料，不應宣稱 real-time。",
      "技術欄位受 lookback 視窗影響，序列前段可能出現 null。",
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
          description: "成功回傳技術指標資料",
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
                message: "目前方案無法存取 technical-indicators。",
              },
            },
            null,
            2,
          ),
        },
        {
          status: "404",
          description: "查無符合條件的技術指標資料",
          body: JSON.stringify(
            {
              dataset: "technical_indicators",
              rows: [],
              count: 0,
              message: "查無符合條件的技術指標資料。",
            },
            null,
            2,
          ),
        },
      ],
    },
  };
}

function buildTechnicalIndicatorsApiSections(): DocsContentSection[] {
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
      api_version: "v2",
      endpoint: "/v2/datasets/issuer-announcements",
      request_id: "req_9af2d5b1c321",
      plan_id: "pro",
      dataset: "issuer_announcements",
      query: {
        ticker: "2330",
        date_from: "2026-04-01",
        date_to: "2026-04-22",
        category: "financial",
        limit: 20,
        offset: 0,
        sort_by: "announcement_date",
        sort_order: "desc",
      },
      meta: {
        rows_returned: 1,
      },
      envelope: {
        api_version: "v2",
        dataset: "issuer_announcements",
        release_date: "2026-04-22",
        request_context: {
          ticker: "2330",
          as_of_date: "2026-04-22",
          family: "issuer_official_news",
          dataset_view: "issuer_announcements_v1",
        },
        data: [
          {
            ticker: "2330",
            announcement_date: "2026-04-22",
            category: "financial",
            title: "公告本公司董事會通過第一季財務報告",
            source_url: "https://mops.twse.com.tw/...",
          },
        ],
        quality: {
          freshness_state: "fresh",
          freshness_as_of: "2026-04-22",
          completeness_ratio: 1,
          quality_status: "ready",
        },
        lineage: {
          source_role: "canonical",
          selected_source: "mops_official",
        },
        error: {
          error_code: null,
          error_message: null,
          blocking_gate: null,
        },
      },
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
      "公告資訊 API 提供公司對外揭露公告資料，適合用於事件追蹤、披露監控與研究流程。",
      "此 endpoint 為 productized public route，查詢參數與回應契約以 backend runtime 為準。",
    ],
    requestDescription: [
      "使用此 endpoint 時，建議：",
    ],
    useCases: [
      "追蹤單一公司的公告歷史",
      "建立重大揭露事件時間線",
      "搭配價格與財務資料做事件對照分析",
      "作為監控與研究流程的官方披露來源",
    ],
    gettingStarted: [
      "使用 ticker 查詢單一公司，並以 date_from/date_to 控制區間。",
      "sort_by 目前只支援 announcement_date。",
      "sort_order 僅支援 asc 或 desc。",
      "category 可用於過濾公告類型（若來源有提供）。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: true, description: "股票代碼，用於查詢單一公司公告資料。" },
      { name: "date_from", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "category", type: "string", required: false, description: "公告分類過濾。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
      { name: "sort_by", type: "string", required: false, description: "排序欄位，固定為 announcement_date。" },
      { name: "sort_order", type: "string", required: false, description: "排序方向：asc 或 desc。" },
    ],
    responseSummary: [
      "回應為 canonical envelope 格式，頂層包含 api_version、endpoint、dataset、query、meta、envelope。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "資料集識別，固定為 issuer_announcements。" },
      { path: "query.ticker", type: "string", description: "本次查詢使用的股票代碼。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料筆數。" },
      { path: "envelope.data[].ticker", type: "string", description: "股票代碼。" },
      { path: "envelope.data[].announcement_date", type: "string", description: "公告日期。" },
      { path: "envelope.data[].category", type: "string|null", description: "公告分類。" },
      { path: "envelope.data[].title", type: "string|null", description: "公告標題。" },
      { path: "envelope.data[].source_url", type: "string|null", description: "來源連結。" },
      { path: "envelope.lineage.source_role", type: "string", description: "來源角色（canonical）。" },
    ],
    notes: [
      "此頁為 productized endpoint，請勿與 legacy 回應格式混用。",
      "若要做事件整合分析，可搭配 `/v2/datasets/events` 與 `/v2/datasets/structured-events`。",
      "若需要較高頻價格對照，建議搭配 TWSE/TPEx 日線價格 endpoint。",
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
          description: "成功回傳公告資料",
          body: successBody,
        },
        {
          status: "400",
          description: "查詢參數錯誤",
          body: JSON.stringify(
            {
              detail: "unsupported_sort_by",
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
              detail: "missing_api_key",
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
              error: "dataset_not_entitled",
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
              api_version: "v2",
              dataset: "issuer_announcements",
              meta: { rows_returned: 0 },
              envelope: { data: [] },
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

function buildIndexDataApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/index-data";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/index-data",
    headers=headers,
    params={
        "index_code": "TAIEX",
        "date_from": "2026-04-01",
        "date_to": "2026-04-22",
        "limit": 30
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/index-data?index_code=TAIEX&date_from=2026-04-01&date_to=2026-04-22&limit=30",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/index-data?index_code=TAIEX&date_from=2026-04-01&date_to=2026-04-22&limit=30" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/index-data",
      request_id: "req_idx_1234abcd",
      plan_id: "pro",
      dataset: "index_data",
      query: {
        index_code: "TAIEX",
        market: null,
        as_of_date: null,
        date_from: "2026-04-01",
        date_to: "2026-04-22",
        limit: 30,
        offset: 0,
        sort_by: "as_of_date",
        sort_order: "desc",
      },
      meta: { rows_returned: 1 },
      envelope: {
        api_version: "v2",
        dataset: "index_data",
        request_context: {
          ticker: "TAIEX",
          as_of_date: "2026-04-22",
          family: "taiwan_macro",
          dataset_view: "index_data_v1",
        },
        data: [
          {
            index_code: "TAIEX",
            as_of_date: "2026-04-22",
            index_level: 20235.1,
            index_change: 132.4,
            index_return_pct: 0.66,
            turnover_value: 345600000000,
            volume_shares: 4123000000,
          },
        ],
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格",
    endpoint,
    method: "GET",
    overview: [
      "指數資料 API 提供指數層級的日度市場資料，適合做市場狀態追蹤與指數研究。",
      "此頁為 productized endpoint，採 canonical envelope 回應。",
    ],
    requestDescription: ["使用此 endpoint 時，至少需提供 index_code 或 market 其一。"],
    useCases: [
      "追蹤特定指數日度變化與成交狀態。",
      "建立指數時間序列分析流程。",
      "作為市場層級策略或風險監控輸入。",
    ],
    gettingStarted: [
      "以 index_code 或 market 做過濾。",
      "可用 as_of_date 指定單日，或 date_from/date_to 查區間。",
      "sort_by 固定為 as_of_date。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "index_code", type: "string", required: false, description: "指數代碼（index_code 或 market 至少其一）。" },
      { name: "market", type: "string", required: false, description: "市場代碼（index_code 或 market 至少其一）。" },
      { name: "as_of_date", type: "string", required: false, description: "指定單一資料日期（YYYY-MM-DD）。" },
      { name: "date_from", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
      { name: "sort_by", type: "string", required: false, description: "排序欄位，固定為 as_of_date。" },
      { name: "sort_order", type: "string", required: false, description: "排序方向：asc 或 desc。" },
    ],
    responseSummary: ["回應為 canonical envelope 格式，頂層包含 query/meta 與 envelope.data。"],
    responseFields: [
      { path: "dataset", type: "string", description: "資料集識別，固定為 index_data。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料筆數。" },
      { path: "envelope.data[].index_code", type: "string", description: "指數代碼。" },
      { path: "envelope.data[].as_of_date", type: "string", description: "資料日期。" },
      { path: "envelope.data[].index_level", type: "number|null", description: "指數點位。" },
      { path: "envelope.data[].index_change", type: "number|null", description: "點數變化。" },
      { path: "envelope.data[].index_return_pct", type: "number|null", description: "漲跌幅。" },
      { path: "envelope.data[].turnover_value", type: "number|null", description: "成交金額。" },
      { path: "envelope.data[].volume_shares", type: "number|null", description: "成交量。" },
    ],
    notes: [
      "此頁為 productized endpoint。",
      "若需更市場橫截面的漲跌家數資訊，請參考 `/v2/datasets/market-breadth`。",
      "若需較底層 canonical 價格面，請參考「市場價格（Canonical）」。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"] },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳指數資料", body: successBody },
        { status: "400", description: "參數錯誤或缺少必要 filter", body: `{"detail":"missing_required_filter"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"index_data","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildIndexDataApiSections(): DocsContentSection[] {
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

function buildMarketIndexApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/market-index";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/market-index",
    headers=headers,
    params={
        "index_code": "TWSE_TAIEX",
        "market": "TWSE",
        "start_date": "2026-05-22",
        "end_date": "2026-05-28",
        "limit": 5,
        "latest": "false",
        "include_data_gaps": "true"
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/market-index?index_code=TWSE_TAIEX&market=TWSE&start_date=2026-05-22&end_date=2026-05-28&limit=5&latest=false&include_data_gaps=true",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/market-index?index_code=TWSE_TAIEX&market=TWSE&start_date=2026-05-22&end_date=2026-05-28&limit=5&latest=false&include_data_gaps=true" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      dataset_id: "market-index",
      row_count: 1,
      items: [
        {
          index_identity: {
            index_code: "TWSE_TAIEX",
            index_name: "發行量加權股價指數",
            index_version: "v1",
            index_type: "price",
          },
          market_identity: {
            market: "TWSE",
            as_of_date: "2026-05-28",
            provider: "twse_official",
            source_role: "official_twse_mi_index",
          },
          index_level: { value: 21444.5 },
          daily_change: { points: 40.0, return_pct: 0.2 },
          turnover: { turnover_value: 1000000.0, volume_shares: 2000000.0 },
          source_lineage: { source: "TWSE_MI_INDEX", identity_rule: "exact_index_name_match" },
          data_gaps: [],
          safe_usage_notes: [
            "not_investment_advice",
            "twse_taiex_index_only_scope",
            "breadth_overview_sector_rows_are_held",
          ],
          available_tools_or_endpoints: {
            dataset_endpoint: "/v2/datasets/market-index",
            lookup_hint: "index_code=TWSE_TAIEX&market=TWSE",
            scope_note: "taiex_index_only_read_model",
          },
        },
      ],
      held_policy: {
        market_breadth_items: "held",
        market_overview_snapshots: "held",
        sector_or_unknown_index_rows: "held",
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格",
    endpoint,
    method: "GET",
    overview: [
      "市場指數 / Market Index API 提供 TAIEX read-only 視圖，使用官方 TWSE MI_INDEX exact identity mapping。",
      "目前為 private beta，僅開放 TWSE_TAIEX、TWSE、seed coverage 視窗。",
    ],
    useCases: [
      "查詢 TAIEX 最近可用日期點位與單日變化。",
      "在研究流程中對齊 index_identity / source_lineage / safe_usage_notes。",
      "作為後續 index-only controlled scope 的查詢入口。",
    ],
    gettingStarted: [
      "預設使用 index_code=TWSE_TAIEX 與 market=TWSE。",
      "可使用 latest=true 取得單筆最新資料。",
      "區間查詢可用 start_date/end_date 與 limit。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "index_code", type: "string", required: false, description: "預設 TWSE_TAIEX；目前僅支援此值。" },
      { name: "market", type: "string", required: false, description: "預設 TWSE；目前僅支援 TWSE。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制（max 500）。" },
      { name: "latest", type: "boolean|string", required: false, description: "true 時回傳單筆最新資料。" },
      { name: "include_data_gaps", type: "boolean|string", required: false, description: "是否回傳 data_gaps（預設 true）。" },
    ],
    responseSummary: ["回應包含 index_identity、market_identity、index_level、daily_change、turnover、source_lineage、data_gaps 等 section。"],
    responseFields: [
      { path: "items[].index_identity", type: "object", description: "指數身分欄位（index_code/index_name/index_version/index_type）。" },
      { path: "items[].market_identity", type: "object", description: "市場身分欄位（market/as_of_date/provider/source_role）。" },
      { path: "items[].index_level", type: "object", description: "指數點位資訊。" },
      { path: "items[].daily_change", type: "object", description: "單日點數變化與報酬率。" },
      { path: "items[].turnover", type: "object", description: "成交金額與成交股數。" },
      { path: "items[].source_lineage", type: "object", description: "來源與 identity mapping lineage。" },
      { path: "items[].data_gaps", type: "array", description: "資料缺口描述（可為空陣列）。" },
      { path: "items[].safe_usage_notes", type: "array", description: "安全使用備註（含 not_investment_advice）。" },
      { path: "items[].available_tools_or_endpoints", type: "object", description: "可用工具與 endpoint 提示。" },
    ],
    notes: [
      "MCP/tool plan：`market_index_lookup(index_code?, market?, latest?, start_date?, end_date?)`。",
      "目前只支援 TWSE_TAIEX。",
      "目前只支援 TWSE。",
      "seed coverage only：2026-05-22 ~ 2026-05-28。",
      "sector index rows held。",
      "unknown index rows held。",
      "market breadth not included。",
      "market overview not included。",
      "not full historical index coverage yet。",
      "非投資建議。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Private Beta（受限）"] },
    errorCases: ["200", "401", "404", "503"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳 market-index 範圍資料", body: successBody },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "404", description: "指定 index_code 查無資料", body: `{"status":"not_found","reason":"market_index_not_found"}` },
        { status: "503", description: "資料表未就緒", body: `{"status":"unavailable","reason":"index_data_items_table_missing"}` },
      ],
    },
  };
}

function buildMarketIndexApiSections(): DocsContentSection[] {
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

function buildMarketBreadthApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/market-breadth";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/market-breadth",
    headers=headers,
    params={
        "market": "TWSE",
        "start_date": "2026-05-04",
        "end_date": "2026-05-27",
        "limit": 5,
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/market-breadth?market=TWSE&start_date=2026-05-04&end_date=2026-05-27&limit=5",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/market-breadth?market=TWSE&start_date=2026-05-04&end_date=2026-05-27&limit=5" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/market-breadth",
      request_id: "req_breadth_7788",
      plan_id: "pro",
      dataset: "market_breadth",
      query: {
        market: "TWSE",
        start_date: "2026-05-04",
        end_date: "2026-05-27",
        limit: 5,
        offset: 0,
      },
      meta: { rows_returned: 1 },
      envelope: {
        dataset: "market_breadth",
        request_context: {
          family: "market_overview",
        },
        data: [
          {
            market: "TWSE",
            trade_date: "2026-05-27",
            advancing_count: 1280,
            declining_count: 1120,
            unchanged_count: 64,
            limit_up_count: 44,
            limit_down_count: 18,
            total_traded_count: 2368,
            turnover_value: 145380000,
            volume: 11234567,
            market_scope: "TWSE",
            calculation_basis: "TWSE market-overview source family",
            source_provider: "twse_official",
            source_role: "derived_market_breadth",
            source_lineage: ["derived_market_breadth", "official_twse_mi_index"],
            data_gaps: [],
            not_investment_advice: true,
          },
        ],
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格",
    endpoint,
    method: "GET",
    overview: [
      "市場廣度 API 提供 TWSE 市場的漲跌家數、漲跌停與市場總交易量資料，適合用於盤勢監控與結構觀察。",
      "此頁為 private beta 文件，不宣稱 TPEx/full-market 覆蓋，且未啟用每日 cron 寫入。",
    ],
    requestDescription: [
      "最少提供 `market=TWSE`，並可指定 `start_date`/`end_date`（YYYY-MM-DD）。",
      "回應為 canonical envelope，未命中時可透過 data_gaps 判讀。",
    ],
    useCases: ["觀察市場整體強弱與盤勢結構。", "搭配指數點位進行多維度盤勢分析。", "作為策略前置風險濾網。"],
    gettingStarted: [
      "可用 market + start_date / end_date 查詢一段時間的廣度資料。",
      "搭配 source_lineage、data_gaps 與 not_investment_advice 做可追溯治理。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "market", type: "string", required: false, description: "市場代碼，支援 TWSE。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["回應為 canonical envelope 格式，頂層包含 query/meta 與 envelope.data。"],
    responseFields: [
      { path: "dataset", type: "string", description: "資料集識別，固定為 market_breadth。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料筆數。" },
      { path: "envelope.data[].market", type: "string", description: "市場代碼（TWSE）。" },
      { path: "envelope.data[].trade_date", type: "string", description: "資料日期。" },
      { path: "envelope.data[].advancing_count", type: "integer", description: "上漲家數。" },
      { path: "envelope.data[].declining_count", type: "integer", description: "下跌家數。" },
      { path: "envelope.data[].unchanged_count", type: "integer", description: "平盤家數。" },
      { path: "envelope.data[].limit_up_count", type: "integer", description: "漲停家數。" },
      { path: "envelope.data[].limit_down_count", type: "integer", description: "跌停家數。" },
      { path: "envelope.data[].total_traded_count", type: "integer", description: "市場總交易筆數或總量（依欄位定義）。" },
      { path: "envelope.data[].turnover_value", type: "number|null", description: "成交金額（如有）。" },
      { path: "envelope.data[].volume", type: "number|null", description: "成交量（如有）。" },
      { path: "envelope.data[].market_scope", type: "string", description: "市場範圍（TWSE）。" },
      { path: "envelope.data[].calculation_basis", type: "string|null", description: "計算口徑描述。" },
      { path: "envelope.data[].source_provider", type: "string", description: "來源提供者。" },
      { path: "envelope.data[].source_role", type: "string", description: "來源角色。" },
      { path: "envelope.data[].source_lineage", type: "array", description: "來源脈絡清單。" },
      { path: "envelope.data[].data_gaps", type: "array", description: "缺漏標記（若有）。" },
      { path: "envelope.data[].not_investment_advice", type: "boolean", description: "固定為 true，不提供投資建議。" },
    ],
    notes: [
      "此頁為 productized endpoint。",
      "若需指數層級點位與成交資料，請參考 `/v2/datasets/index-data`。",
      "若需底層價格序列，請參考 `TWSE/TPEx 日線價格` 或 `市場價格（Canonical）`。",
      "TWSE-only private beta；無 TPEx 或 full-market claim；未啟用 daily write cron。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"] },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳市場廣度資料", body: successBody },
        { status: "400", description: "參數錯誤或缺少必要 filter", body: `{"detail":"missing_required_filter"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"market_breadth","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildMarketBreadthApiSections(): DocsContentSection[] {
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

function buildInterestRateApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/interest-rate-snapshot";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/interest-rate-snapshot",
    headers=headers,
    params={
        "date_from": "2026-01-01",
        "date_to": "2026-04-30",
        "limit": 30
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/interest-rate-snapshot?date_from=2026-01-01&date_to=2026-04-30&limit=30",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/interest-rate-snapshot?date_from=2026-01-01&date_to=2026-04-30&limit=30" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/interest-rate-snapshot",
      request_id: "req_rates_1a2b3c4d",
      plan_id: "developer",
      dataset: "interest_rate_snapshot",
      query: {
        as_of_date: null,
        date_from: "2026-01-01",
        date_to: "2026-04-30",
        limit: 30,
        offset: 0,
        sort_by: "as_of_date",
        sort_order: "desc",
      },
      meta: { rows_returned: 1 },
      envelope: {
        api_version: "v2",
        dataset: "interest_rate_snapshot",
        request_context: {
          ticker: "TWD_POLICY_RATE",
          as_of_date: "2026-04-22",
          family: "taiwan_macro",
          dataset_view: "interest_rate_snapshot_v1",
        },
        data: [
          {
            as_of_date: "2026-04-22",
            policy_rate_pct: 1.875,
            overnight_rate_pct: 1.61,
            source_name: "cbc_official",
          },
        ],
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "市場與價格",
    endpoint,
    method: "GET",
    overview: [
      "利率 API 提供台灣市場利率快照資料，可作為估值折現、風險參數與宏觀條件分析的基礎輸入。",
      "資料對應 canonical topic `interest_rate_snapshot`，對外路徑採 `/v2/datasets/interest-rate-snapshot`。",
    ],
    requestDescription: [
      "使用此 endpoint 時，建議以 as_of_date 查單日快照，或以 date_from/date_to 查歷史區間。若流程需要長期序列，建議先批次落地再下游使用。",
    ],
    useCases: [
      "設定折現率或資金成本參數。",
      "作為宏觀條件過濾器，搭配價格與財務資料做策略檢查。",
      "建立利率變動時間序列並觀察市場反應。",
    ],
    gettingStarted: [
      "在 header 帶入 X-API-Key。",
      "先用 as_of_date 查單日，再擴展到 date_from/date_to 區間。",
      "對長期流程建議搭配 limit/offset 做分批抓取。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "as_of_date", type: "string", required: false, description: "指定單一資料日期（YYYY-MM-DD）。" },
      { name: "date_from", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
    ],
    responseSummary: ["回應採 canonical envelope，頂層包含 query/meta，實際資料位於 envelope.data。"],
    responseFields: [
      { path: "dataset", type: "string", description: "資料集識別，固定為 interest_rate_snapshot。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料筆數。" },
      { path: "envelope.data[].as_of_date", type: "string", description: "資料日期。" },
      { path: "envelope.data[].policy_rate_pct", type: "number|null", description: "政策利率（百分比）。" },
      { path: "envelope.data[].overnight_rate_pct", type: "number|null", description: "隔夜利率（百分比）。" },
      { path: "envelope.data[].source_name", type: "string|null", description: "來源識別（例如 cbc_official）。" },
    ],
    notes: [
      "此頁使用 data-api-standard 版型，與技術指標、估值資料、TWSE/TPEx 日線價格頁一致。",
      "若要做跨資料集分析，建議保留 as_of_date 以便和 index-data、market-breadth 對齊。",
      "資料可用範圍會依帳號方案與 API key 權限而定，實際以控制台顯示為準。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Route：/v2/datasets/interest-rate-snapshot", "適用方案：實際可用範圍與配額以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳利率快照資料", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"invalid_query_params"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件的利率資料", body: `{"api_version":"v2","dataset":"interest_rate_snapshot","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildInterestRateApiSections(): DocsContentSection[] {
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

function buildThemeTaxonomyApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/theme-taxonomy";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/theme-taxonomy",
    headers=headers,
    params={
        "ticker": "2330",
        "limit": 20
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/theme-taxonomy?ticker=2330&limit=20",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/theme-taxonomy?ticker=2330&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/theme-taxonomy",
      request_id: "req_theme_1a2b3c4d",
      plan_id: "developer",
      dataset: "theme_taxonomy",
      query: {
        ticker: "2330",
        market: null,
        sector: null,
        industry: null,
        theme_primary: null,
        limit: 20,
        offset: 0,
        sort_by: "as_of_date",
        sort_order: "desc",
      },
      meta: { rows_returned: 1 },
      envelope: {
        dataset: "theme_taxonomy",
        ticker: "2330",
        as_of_date: "2026-04-22",
        release_date: "2026-04-22",
        data: [
          {
            ticker: "2330",
            market: "TWSE",
            as_of_date: "2026-04-22",
            sector: "半導體業",
            industry: "晶圓代工",
            subindustry: null,
            theme_primary: "AI基礎設施",
            theme_secondary: "高效能運算",
            classification_source: "issuer_classification_map+issuer_classification_taxonomy",
            provider: "twse_official",
            source_role: "canonical",
          },
        ],
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "分類與結構",
    endpoint,
    method: "GET",
    overview: [
      "公司分類 API 提供 deterministic 的公司分類與題材映射資料，來源為 `issuer_classification_map` 與 `issuer_classification_taxonomy`。",
      "這個 endpoint 屬於已對外開放的 live route，可用於產業分群、主題篩選與跨資料集分類對齊。",
    ],
    requestDescription: [
      "至少需要提供一個 filter（ticker、market、sector、industry、theme_primary 任一），未提供時會回傳 `missing_required_filter`。",
    ],
    useCases: [
      "依 ticker 取得公司當期 sector/industry/theme 分類。",
      "建立題材分群清單，作為篩選與監控條件。",
      "與價格或財務資料串接，建立分類維度的橫截面分析。",
    ],
    gettingStarted: [
      "先用 ticker 驗證單一公司分類資料。",
      "需要分群時可改用 sector/industry/theme_primary 作為 filter。",
      "排序僅支援 sort_by=as_of_date|ticker，sort_order=asc|desc。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: false, description: "股票代碼。" },
      { name: "market", type: "string", required: false, description: "市場代碼（例如 TWSE、TPEx）。" },
      { name: "sector", type: "string", required: false, description: "產業大類篩選。" },
      { name: "industry", type: "string", required: false, description: "產業細分類篩選。" },
      { name: "theme_primary", type: "string", required: false, description: "主題分類篩選。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制（1..1000）。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
      { name: "sort_by", type: "string", required: false, description: "排序欄位：as_of_date 或 ticker。" },
      { name: "sort_order", type: "string", required: false, description: "排序方向：asc 或 desc。" },
    ],
    responseSummary: [
      "回應採 canonical envelope，頂層包含 query/meta，分類資料位於 envelope.data。",
      "資料為 deterministic 映射結果，不包含 AI 推論分數或主觀標註欄位。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 theme_taxonomy。" },
      { path: "query", type: "object", description: "本次查詢條件。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料筆數。" },
      { path: "envelope.data[].ticker", type: "string", description: "股票代碼。" },
      { path: "envelope.data[].market", type: "string", description: "市場代碼。" },
      { path: "envelope.data[].as_of_date", type: "string", description: "分類資料日期。" },
      { path: "envelope.data[].sector", type: "string|null", description: "產業大類。" },
      { path: "envelope.data[].industry", type: "string|null", description: "產業細類。" },
      { path: "envelope.data[].theme_primary", type: "string|null", description: "主題主分類。" },
      { path: "envelope.data[].theme_secondary", type: "string|null", description: "主題次分類。" },
      { path: "envelope.data[].classification_source", type: "string|null", description: "分類映射來源識別。" },
      { path: "envelope.data[].source_role", type: "string|null", description: "來源角色。" },
    ],
    notes: [
      "此主題對外路由為 `/v2/datasets/theme-taxonomy`。",
      "若只查主題關鍵字入口，建議搭配 `/v2/search?type=theme`。",
      "若條件查不到資料，通常回傳 200 + 空資料集合，不代表 endpoint 不可用。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Route：/v2/datasets/theme-taxonomy", "實際可用範圍與配額以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳公司分類資料", body: successBody },
        { status: "400", description: "缺少必要 filter 或排序參數錯誤", body: `{"detail":"missing_required_filter"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildThemeTaxonomyApiSections(): DocsContentSection[] {
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

function buildIndexClassificationApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/index-classification";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/index-classification",
    headers=headers,
    params={
        "index_code": "TWSE_TAIEX",
        "limit": 20
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/index-classification?index_code=TWSE_TAIEX&limit=20",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/index-classification?index_code=TWSE_TAIEX&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/index-classification",
      request_id: "req_idxcls_9f8e7d6c",
      plan_id: "developer",
      dataset: "index_classification",
      query: {
        index_code: "TWSE_TAIEX",
        market: null,
        index_type: null,
        sector: null,
        industry: null,
        limit: 20,
        offset: 0,
        sort_by: "as_of_date",
        sort_order: "desc",
      },
      meta: { rows_returned: 1 },
      envelope: {
        dataset: "index_classification",
        ticker: "TWSE_TAIEX",
        as_of_date: "2026-04-22",
        data: [
          {
            index_code: "TWSE_TAIEX",
            market: "TWSE",
            as_of_date: "2026-04-22",
            classification_version: "v1",
            index_name: "發行量加權股價指數",
            index_type: "broad_market",
            sector: null,
            industry: null,
            parent_index_code: null,
            is_sector_index: false,
            is_broad_market_index: true,
            theme_primary: null,
            theme_secondary: null,
            classification_source: "index_code_mapping_v1",
            provider: "twse_official",
            source_role: "canonical",
          },
        ],
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "分類與結構",
    endpoint,
    method: "GET",
    overview: [
      "指數分類 API 提供指數層級的分類事實欄位（type/sector/industry/theme flags），適合做市場分類視角分析與索引維度整理。",
      "此 endpoint 對應 `index_classification` live route，不是 AI 分群或動態評分模型。",
    ],
    requestDescription: [
      "至少需要提供一個 filter（index_code、market、index_type、sector、industry 任一），未提供時會回傳 `missing_required_filter`。",
    ],
    useCases: [
      "查單一指數（index_code）分類屬性與旗標欄位。",
      "建立市場分類清單，作為 dashboard 或研究分群維度。",
      "搭配 index-data / market-breadth 進行市場結構與盤勢分析。",
    ],
    gettingStarted: [
      "先用 index_code 取得單一指數欄位結構。",
      "批量檢索時可改用 market 或 index_type 作篩選。",
      "排序僅支援 sort_by=as_of_date|index_code，sort_order=asc|desc。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "index_code", type: "string", required: false, description: "指數代碼。" },
      { name: "market", type: "string", required: false, description: "市場代碼。" },
      { name: "index_type", type: "string", required: false, description: "指數類型（如 broad_market / sector）。" },
      { name: "sector", type: "string", required: false, description: "產業分類條件。" },
      { name: "industry", type: "string", required: false, description: "產業細分類條件。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制（1..1000）。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移。" },
      { name: "sort_by", type: "string", required: false, description: "排序欄位：as_of_date 或 index_code。" },
      { name: "sort_order", type: "string", required: false, description: "排序方向：asc 或 desc。" },
    ],
    responseSummary: [
      "回應採 canonical envelope，頂層包含 query/meta，實際分類資料位於 envelope.data。",
      "contract 僅包含 deterministic 分類欄位，不包含信心分數與動態 ranking。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 index_classification。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳筆數。" },
      { path: "envelope.data[].index_code", type: "string", description: "指數代碼。" },
      { path: "envelope.data[].market", type: "string", description: "市場代碼。" },
      { path: "envelope.data[].as_of_date", type: "string", description: "資料日期。" },
      { path: "envelope.data[].index_name", type: "string|null", description: "指數名稱。" },
      { path: "envelope.data[].index_type", type: "string|null", description: "指數類型。" },
      { path: "envelope.data[].is_broad_market_index", type: "boolean|null", description: "是否為大盤型指數。" },
      { path: "envelope.data[].is_sector_index", type: "boolean|null", description: "是否為產業型指數。" },
      { path: "envelope.data[].theme_primary", type: "string|null", description: "主題主分類。" },
      { path: "envelope.data[].classification_source", type: "string|null", description: "分類映射來源。" },
      { path: "envelope.data[].source_role", type: "string|null", description: "來源角色。" },
    ],
    notes: [
      "此主題對外路由為 `/v2/datasets/index-classification`。",
      "若需要指數點位與漲跌等行情欄位，請搭配 `/v2/datasets/index-data`。",
      "查無資料通常回 200 空集合，建議依 `meta.rows_returned` 判斷結果。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Route：/v2/datasets/index-classification", "實際可用範圍與配額以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳指數分類資料", body: successBody },
        { status: "400", description: "缺少必要 filter 或排序參數錯誤", body: `{"detail":"missing_required_filter"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildIndexClassificationApiSections(): DocsContentSection[] {
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

function buildSearchApiReference(): ApiReferenceContent {
  const endpoint = "/v2/search";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/search",
    headers=headers,
    params={"q": "台積電", "type": "issuer", "limit": 20},
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/search?q=%E5%8F%B0%E7%A9%8D%E9%9B%BB&type=issuer&limit=20",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/search?q=%E5%8F%B0%E7%A9%8D%E9%9B%BB&type=issuer&limit=20" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/search",
      request_id: "req_search_5b7d9f1a",
      plan_id: "developer",
      dataset: "universal_search",
      query: { q: "台積電", type: "issuer", limit: 20, offset: 0 },
      meta: { rows_returned: 1, supported_types: ["all", "index", "issuer", "theme"] },
      results: [
        {
          entity_type: "issuer",
          ticker: "2330",
          market: "TWSE",
          company_name: "台灣積體電路製造股份有限公司",
          english_name: "Taiwan Semiconductor Manufacturing Co., Ltd.",
          matched_on: "company_name_contains",
          provider: "twse_official",
          source_role: "canonical",
        },
      ],
      errors: [],
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "查詢與工具",
    endpoint,
    method: "GET",
    overview: [
      "搜尋 API 提供 deterministic 的實體搜尋能力，可在 issuer/index/theme 三種實體之間統一查找。",
      "這是對外公開能力，路徑為 `/v2/search`，不使用向量檢索或 LLM 排名。",
    ],
    requestDescription: [
      "必填參數為 `q`；`type` 可選 `issuer | index | theme | all`。若 type 不支援，會回傳 `unsupported_search_type`。",
    ],
    useCases: [
      "輸入公司名稱或代碼，快速定位 ticker。",
      "在 index/theme 維度快速找可用實體。",
      "作為 query 前置步驟，先定位 entity 再提取欄位。",
    ],
    gettingStarted: [
      "先以 q + type=issuer 測試公司搜尋。",
      "需要跨實體搜尋時改為 type=all。",
      "大批量場景請以 limit/offset 分頁避免單次過大。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "q", type: "string", required: true, description: "搜尋字串。" },
      { name: "type", type: "string", required: false, description: "issuer | index | theme | all（預設 all）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制（1..100）。" },
      { name: "offset", type: "integer", required: false, description: "分頁偏移（>=0）。" },
    ],
    responseSummary: [
      "回應固定包含 `dataset=universal_search`、`query`、`meta`、`results`、`errors`。",
      "空結果以 200 + results=[] 回傳，不以 404 表示。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 universal_search。" },
      { path: "query", type: "object", description: "本次查詢參數回填。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳筆數。" },
      { path: "results[].entity_type", type: "string", description: "實體類型（issuer/index/theme）。" },
      { path: "results[].ticker", type: "string|null", description: "股票代碼（issuer 時常見）。" },
      { path: "results[].index_code", type: "string|null", description: "指數代碼（index 時常見）。" },
      { path: "results[].theme_primary", type: "string|null", description: "主題欄位（theme 時常見）。" },
      { path: "results[].matched_on", type: "string", description: "命中欄位/規則。" },
      { path: "results[].source_role", type: "string|null", description: "來源角色。" },
      { path: "results[].lineage", type: "object|string|null", description: "來源追溯資訊。" },
      { path: "errors[]", type: "array", description: "錯誤欄位（分支失敗或參數問題）。" },
    ],
    notes: [
      "排序策略是 deterministic 規則，不包含語意向量或模型 rerank。",
      "如果某個分支來源表為空，系統會回 200 空結果而不是 500。",
      "推薦流程：先 `/v2/search` 定位，再使用 `/v2/query` 擷取欄位。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Route：/v2/search", "實際可用範圍與配額以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳搜尋結果", body: successBody },
        { status: "400", description: "type 不支援或參數非法（含部分驗證錯誤）", body: `{"detail":"unsupported_search_type"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取搜尋能力", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildSearchApiSections(): DocsContentSection[] {
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

function buildQueryApiReference(): ApiReferenceContent {
  const endpoint = "/v2/query";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/query",
    headers=headers,
    params={
        "entity_id": "2330",
        "entity_type": "issuer",
        "fields": "company_name,pe_ratio,revenue_yoy_pct",
        "as_of_date": "2026-04-22"
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/query?entity_id=2330&entity_type=issuer&fields=company_name,pe_ratio,revenue_yoy_pct&as_of_date=2026-04-22",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/query?entity_id=2330&entity_type=issuer&fields=company_name,pe_ratio,revenue_yoy_pct&as_of_date=2026-04-22" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/query",
      request_id: "req_query_4e6a8c0d",
      plan_id: "developer",
      dataset: "field_query",
      entity_id: "2330",
      entity_type: "issuer",
      as_of_date: "2026-04-22",
      fields: ["company_name", "pe_ratio", "revenue_yoy_pct"],
      data: {
        company_name: "台灣積體電路製造股份有限公司",
        pe_ratio: 26.8,
        revenue_yoy_pct: 0.18,
      },
      explainability: {
        company_name: {
          source_topic: "issuer_profile",
          source_table_or_contract: "issuer_profiles",
          source_field: "company_name",
          attach_rule: "exact_entity_attach",
          formula: null,
          nullability_rule: "nullable_if_source_missing",
          freshness_basis: "latest_on_or_before(as_of_date)",
        },
      },
      errors: [],
      meta: { batch_mode: false, supported_entity_types: ["index", "issuer"] },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "查詢與工具",
    endpoint,
    method: "GET",
    overview: [
      "查詢 API 提供嚴格 allowlist 的欄位查詢能力，適合在固定契約下擷取跨資料主題欄位。",
      "回應預設附帶 explainability metadata，可直接用於來源驗證與欄位審計。",
    ],
    requestDescription: [
      "必填條件為 `entity_type`、`fields`，且必須提供 `entity_id` 或 `entity_ids[]` 其中之一。單次最多 10 個 entity。",
    ],
    useCases: [
      "以單一 issuer/index 抽取固定欄位，供策略與面板使用。",
      "批次查詢多標的並取得共享 explainability metadata。",
      "搭配 `/v2/query/fields` 先查 allowlist，再動態組裝查詢。",
    ],
    gettingStarted: [
      "先用單一 entity_id 驗證欄位與 explainability。",
      "確定欄位後再使用 entity_ids[] 進入 batch 模式。",
      "若只需要值可加 `minimal_fields=true` 減少 payload。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "entity_id", type: "string", required: false, description: "單一實體識別（ticker 或 index code）。" },
      { name: "entity_ids", type: "string", required: false, description: "逗號分隔的批次實體識別。" },
      { name: "entity_ids[]", type: "string[]", required: false, description: "重複 query 參數的批次實體識別。" },
      { name: "entity_type", type: "string", required: true, description: "issuer 或 index。" },
      { name: "fields", type: "string", required: true, description: "逗號分隔欄位清單。" },
      { name: "fields[]", type: "string[]", required: false, description: "重複 query 參數欄位清單。" },
      { name: "as_of_date", type: "string", required: false, description: "查詢基準日（YYYY-MM-DD）。" },
      { name: "minimal_fields", type: "boolean", required: false, description: "true 時省略 explainability payload。" },
    ],
    responseSummary: [
      "單筆模式回傳 `data + explainability`；批次模式回傳 `results + explainability_shared`。",
      "dataset 固定為 `field_query`，不支援任意 SQL passthrough。",
    ],
    responseFields: [
      { path: "dataset", type: "string", description: "固定為 field_query。" },
      { path: "entity_type", type: "string", description: "issuer 或 index。" },
      { path: "fields[]", type: "string[]", description: "實際解析後欄位清單。" },
      { path: "data", type: "object", description: "單筆模式欄位值映射。" },
      { path: "results[]", type: "array", description: "批次模式結果列。" },
      { path: "explainability", type: "object", description: "單筆模式欄位級解釋資訊。" },
      { path: "explainability_shared", type: "object", description: "批次模式共享 explainability 區塊。" },
      { path: "errors[]", type: "array", description: "欄位或請求錯誤資訊。" },
      { path: "meta.allowlist", type: "array", description: "目前 entity_type 可用欄位列表。" },
    ],
    notes: [
      "Companion endpoints：`/v2/query/fields`（欄位契約）與 `/v2/query/examples`（請求範例）。",
      "unsupported_field 會明確出現在 errors，不會默默忽略。",
      "Explainability 為 deterministic 映射，不包含 LLM 生成敘述。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Routes：/v2/query、/v2/query/fields、/v2/query/examples", "實際可用範圍與配額以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳欄位查詢結果", body: successBody },
        { status: "400", description: "缺少 entity/fields、entity_type 不支援，或超過 batch 限制", body: `{"detail":{"code":"missing_fields","message":"Provide fields or fields[]"}}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此能力", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildQueryApiSections(): DocsContentSection[] {
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

function buildExplainabilityApiReference(): ApiReferenceContent {
  const endpoint = "/v2/query/fields";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/query/fields",
    headers=headers,
    params={"entity_type": "issuer"},
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/query/fields?entity_type=issuer",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/query/fields?entity_type=issuer" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/query/fields",
      request_id: "req_explain_2c4e6a8b",
      plan_id: "developer",
      entity_type: "issuer",
      fields: [
        {
          entity_type: "issuer",
          field_name: "company_name",
          description: "Deterministic query field `company_name` for `issuer` entity_type.",
          source_topic: "issuer_profile",
          source_table_or_contract: "issuer_profiles",
          source_field: "company_name",
          attach_rule: "exact_entity_attach",
          formula: null,
          nullability_rule: "nullable_if_source_missing",
          freshness_basis: "latest_on_or_before(as_of_date)",
          status: "active",
          exclusion_reason: null,
        },
      ],
      meta: {
        supported_entity_types: ["index", "issuer"],
        active_field_count: 1,
        excluded_field_count: 0,
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "查詢與工具",
    endpoint,
    method: "GET",
    overview: [
      "Explainability 在 backend 中不是獨立 `/v2/query/explain` endpoint，而是由 `/v2/query` 內嵌欄位解釋資訊，並由 `/v2/query/fields` 提供 machine-readable 欄位契約。",
      "此頁聚焦 explainability 層的可用介面與資料結構，對齊 `search_query_explainability.py` 的 deterministic 規則。",
      "此端點屬於查詢能力與欄位契約工具，不代表任何單一資料集本身的 3 年覆蓋或全市場覆蓋聲明。",
    ],
    requestDescription: [
      "`/v2/query/fields` 可用 `entity_type` 篩選欄位；`/v2/query` 預設回傳 explainability（除非 `minimal_fields=true`）。",
    ],
    useCases: [
      "在程式端先拉欄位契約，再組裝 query 請求。",
      "把欄位來源、公式、attach rule 寫入審計與研究報表。",
      "在 batch 模式重用 `explainability_shared` 降低重複 payload。",
    ],
    gettingStarted: [
      "先查 `/v2/query/fields?entity_type=issuer` 取得可用欄位與 explainability metadata。",
      "再呼叫 `/v2/query` 取得資料值與 explainability。",
      "只需要值時可加 `minimal_fields=true`。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "entity_type", type: "string", required: false, description: "issuer 或 index；不帶則回傳全部。" },
    ],
    responseSummary: [
      "`/v2/query/fields` 回傳欄位定義與 explainability metadata；`/v2/query` 回傳資料值時可附 explainability / explainability_shared。",
      "Explainability payload key 固定為 source_topic、source_table_or_contract、source_field、attach_rule、formula、nullability_rule、freshness_basis。",
    ],
    responseFields: [
      { path: "fields[].entity_type", type: "string", description: "欄位所屬實體類型。" },
      { path: "fields[].field_name", type: "string", description: "可查詢欄位名稱。" },
      { path: "fields[].source_topic", type: "string|null", description: "來源 topic 識別。" },
      { path: "fields[].source_table_or_contract", type: "string|null", description: "來源 table/contract。" },
      { path: "fields[].attach_rule", type: "string|null", description: "欄位掛接規則。" },
      { path: "fields[].formula", type: "string|null", description: "公式描述（若有）。" },
      { path: "fields[].status", type: "string", description: "active 或 excluded。" },
      { path: "fields[].exclusion_reason", type: "string|null", description: "排除原因。" },
      { path: "meta.active_field_count", type: "integer", description: "可用欄位數量。" },
      { path: "meta.excluded_field_count", type: "integer", description: "排除欄位數量。" },
    ],
    notes: [
      "Explainability 層為 productized capability，但屬於 `/v2/query` 生態的一部分，不是獨立 dataset route。",
      "不提供模型生成敘述；所有欄位說明均來自 deterministic registry。",
      "可搭配 `/v2/query/examples` 作為客戶端快速接線樣板。",
      "實際資料覆蓋範圍仍以各資料集頁面的 coverage/limitation 註記與 API 回應為準。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Routes：/v2/query、/v2/query/fields、/v2/query/examples", "不提供獨立 `/v2/query/explain` endpoint"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳欄位 explainability 契約", body: successBody },
        { status: "400", description: "entity_type 不支援（含部分驗證錯誤）", body: `{"detail":"unsupported_entity_type"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此能力", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildExplainabilityApiSections(): DocsContentSection[] {
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

function buildQueryFieldsApiReference(): ApiReferenceContent {
  return buildExplainabilityApiReference();
}

function buildQueryFieldsApiSections(): DocsContentSection[] {
  return buildExplainabilityApiSections();
}

function buildQueryExamplesApiReference(): ApiReferenceContent {
  const endpoint = "/v2/query/examples";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/query/examples",
    headers=headers,
    params={"entity_type": "issuer", "limit": 5},
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/query/examples?entity_type=issuer&limit=5",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/query/examples?entity_type=issuer&limit=5" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/query/examples",
      request_id: "req_qex_91a2b3c4",
      plan_id: "developer",
      entity_type: "issuer",
      examples: [
        {
          id: "issuer_profile_basic",
          title: "Issuer 基本資料",
          description: "查詢公司名稱、交易所與產業欄位。",
          query_template: {
            entity_type: "issuer",
            entity_id: "2330",
            fields: ["company_name", "exchange", "industry"],
          },
        },
      ],
      meta: {
        rows_returned: 1,
      },
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "查詢與工具",
    endpoint,
    method: "GET",
    overview: [
      "Query Examples API 提供可重用的查詢範例模板，幫助快速組裝 `/v2/query` 請求。",
      "範例資料用於開發接線，不代表即時行情或投資建議。",
      "此端點提供 query pattern 參考，不代表單一資料集本身的 coverage 承諾。",
    ],
    requestDescription: [
      "可用 `entity_type` 先篩選 issuer/index 範例，再依 `id` 套用到查詢流程。",
    ],
    useCases: [
      "快速建立 query 請求 payload。",
      "作為團隊內欄位契約範本。",
      "搭配 `/v2/query/fields` 驗證欄位可用性。",
    ],
    gettingStarted: [
      "先呼叫 `/v2/query/examples` 取得可用範例。",
      "挑選模板後替換 entity_id 與日期條件。",
      "最後送到 `/v2/query` 執行正式查詢。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "entity_type", type: "string", required: false, description: "issuer 或 index。" },
      { name: "limit", type: "integer", required: false, description: "回傳範例筆數上限。" },
    ],
    responseSummary: [
      "回應含 examples 陣列，每個項目帶有 query_template，可直接套用到 `/v2/query`。",
    ],
    responseFields: [
      { path: "examples[].id", type: "string", description: "範例識別碼。" },
      { path: "examples[].title", type: "string", description: "範例標題。" },
      { path: "examples[].description", type: "string", description: "範例說明。" },
      { path: "examples[].query_template", type: "object", description: "可直接轉為 query 參數的模板。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳範例筆數。" },
    ],
    notes: [
      "此 endpoint 僅回傳範例模板，不回傳實際資料列。",
      "搭配 `/v2/query` 與 `/v2/query/fields` 使用可降低整合成本。",
      "實際可用欄位、期間與市場範圍，請以對應資料集文件與 API 回應為準。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Routes：/v2/query、/v2/query/fields、/v2/query/examples", "實際可用範圍與配額以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳查詢範例模板", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此能力", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildQueryExamplesApiSections(): DocsContentSection[] {
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

function buildCompanyNewsPreviewApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/company-news";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/company-news",
    headers=headers,
    params={"symbol": "2330", "limit": 10},
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/company-news?symbol=2330&limit=10",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/company-news?symbol=2330&limit=10" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      dataset: "company_news",
      rows: [
        {
          symbol: "2330",
          published_at: "2026-05-06T08:30:00+08:00",
          title: "公開資訊觀測站月營收資料更新摘要",
          source_name: "MOPS",
          news_type: "月營收",
        },
      ],
      count: 1,
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "Preview",
    endpoint,
    method: "GET",
    overview: [
      "公司新聞目前為 Preview 能力，提供可公開展示的摘要欄位。",
      "內容用於研究流程與資訊索引，不宣稱即時新聞。",
    ],
    requestDescription: ["可用 symbol 與日期範圍過濾。"],
    useCases: ["公司事件背景補充", "研究流程的文字摘要索引", "搭配公告與事件資料交叉檢視"],
    gettingStarted: ["先用 symbol 小範圍測試欄位，再擴大日期範圍查詢。"],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: false, description: "股票代碼。" },
      { name: "start_date", type: "string", required: false, description: "起始日期。" },
      { name: "end_date", type: "string", required: false, description: "結束日期。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數上限。" },
    ],
    responseSummary: ["回應僅包含 summary 欄位，用於前端展示與流程整合。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].published_at", type: "string", description: "發布時間。" },
      { path: "rows[].title", type: "string", description: "新聞標題摘要。" },
      { path: "rows[].source_name", type: "string", description: "來源標記。" },
      { path: "rows[].news_type", type: "string|null", description: "分類標記。" },
    ],
    notes: [
      "Preview 階段可能調整欄位與配額。",
      "若資料來源不可用，系統可能回傳空集合。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Preview 能力（受控開放）", "實際可用範圍以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳公司新聞摘要", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此能力", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildCompanyNewsPreviewApiSections(): DocsContentSection[] {
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

function buildMarketNewsPreviewApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/market-news";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/market-news",
    headers=headers,
    params={"limit": 10},
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/market-news?limit=10",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/market-news?limit=10" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      dataset: "market_news",
      rows: [
        {
          published_at: "2026-05-06T09:00:00+08:00",
          title: "市場指數與類股資料以快照方式整理",
          source_name: "TWSE",
          news_type: "市場概況",
          market: "TW",
        },
      ],
      count: 1,
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "Preview",
    endpoint,
    method: "GET",
    overview: [
      "市場新聞目前為 Preview 能力，提供市場層級摘要欄位。",
      "內容採 snapshot 摘要語氣，不宣稱即時新聞。",
    ],
    requestDescription: ["可依日期區間與市場別過濾。"],
    useCases: ["市場背景補充", "研究筆記與事件索引", "與市場指標資料交叉對照"],
    gettingStarted: ["先小範圍查詢確認欄位，再依需求擴展。"],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "start_date", type: "string", required: false, description: "起始日期。" },
      { name: "end_date", type: "string", required: false, description: "結束日期。" },
      { name: "market", type: "string", required: false, description: "市場代碼。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數上限。" },
    ],
    responseSummary: ["回應僅包含摘要欄位，不回傳 raw payload。"],
    responseFields: [
      { path: "rows[].published_at", type: "string", description: "發布時間。" },
      { path: "rows[].title", type: "string", description: "新聞標題摘要。" },
      { path: "rows[].source_name", type: "string", description: "來源標記。" },
      { path: "rows[].news_type", type: "string|null", description: "分類標記。" },
      { path: "rows[].market", type: "string|null", description: "市場代碼。" },
    ],
    notes: [
      "Preview 階段可能調整欄位與配額。",
      "資料來源不可用時，系統可能回傳空集合。",
    ],
    planRequirement: {
      title: "Plan Requirement",
      bullets: ["Preview 能力（受控開放）", "實際可用範圍以控制台方案顯示為準"],
    },
    errorCases: ["200", "400", "401", "403"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳市場新聞摘要", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此能力", body: `{"error":"dataset_not_entitled"}` },
      ],
    },
  };
}

function buildMarketNewsPreviewApiSections(): DocsContentSection[] {
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

function buildMopsMaterialEventsPreviewApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/news/mops-material-events";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
params = {
    "company_code": "8937",
    "date_from": "2026-05-24",
    "date_to": "2026-05-24",
    "limit": 50,
    "source_mode": "production_db_read",
    "include_detail_labels": "true",
}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/news/mops-material-events",
    headers=headers,
    params=params,
)
print(response.json())`,
    javascript: `const params = new URLSearchParams({
  company_code: "8937",
  date_from: "2026-05-24",
  date_to: "2026-05-24",
  limit: "50",
  source_mode: "production_db_read",
  include_detail_labels: "true",
})

const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/news/mops-material-events?" + params.toString(),
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/news/mops-material-events?company_code=8937&date_from=2026-05-24&date_to=2026-05-24&limit=50&source_mode=production_db_read&include_detail_labels=true" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      data: [
        {
          news_item_id: "mops:8937:2026-05-24:07:00:03:1",
          source_family: "mops_material_information",
          source_endpoint: "https://mops.twse.com.tw/mops/web/t05sr01_1",
          source_mode: "production_db_read",
          company_code: "8937",
          company_name: "合騏",
          event_date: "2026-05-24",
          event_time: "07:00:03",
          seq_no: "1",
          subject: "重大訊息範例（metadata-only）",
          event_type: "material_information",
          detail_available: false,
          detail_labels_present: true,
          full_body_stored: false,
          raw_html_stored: false,
          parser_status: "parsed",
          confidence: 0.99,
          data_gaps: {
            missing_fields: [],
          },
          lineage: {
            parser_version: "mops-v2",
            trace_id: "mops_8937_20260524_1",
          },
          not_investment_advice: true,
        },
      ],
      meta: {
        row_count: 1,
        production_ready: false,
        source_mode: "production_db_read",
        status: "private_beta_disabled_by_default",
      },
      source: {
        name: "MOPS",
        attribution_required: true,
      },
      not_investment_advice: true,
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "Preview / Private Beta",
    endpoint,
    method: "GET",
    overview: [
      "MOPS Material Events 提供公開資訊觀測站重大訊息的 metadata-only 事件資料，設計給事件情報流程與 API 工作流使用。",
      "目前為 private beta 候選，且 backend route 預設 disabled；在 final gate 前不屬於 production-ready 公開能力。",
    ],
    requestDescription: [
      "查詢必須為 bounded query，建議至少帶 company_code（或 ticker）與日期範圍。",
      "預設 limit=50，硬上限 limit<=100；不接受 TPEx/OTC 範圍。",
    ],
    useCases: [
      "重大訊息 metadata 索引與事件標記流程。",
      "跨資料集事件對齊（company events / market context）。",
      "保留 data_gaps / lineage 的審計與可追溯工作流。",
    ],
    gettingStarted: [
      "先用單一 company_code + 單日區間驗證欄位。",
      "確認 source_mode / data_gaps / lineage 後再擴大查詢。",
      "請勿假設有全文內容，回應僅提供 metadata 與 detail labels。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "company_code", type: "string", required: false, description: "公司代碼。建議與日期範圍搭配，避免 unbounded query。" },
      { name: "ticker", type: "string", required: false, description: "股票代碼，可替代 company_code。" },
      { name: "date_from", type: "string", required: true, description: "查詢起始日期（YYYY-MM-DD），需與 date_to 成對出現。" },
      { name: "date_to", type: "string", required: true, description: "查詢結束日期（YYYY-MM-DD），需與 date_from 成對出現。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數上限，預設 50，最大 100。" },
      { name: "source_mode", type: "string", required: false, description: "資料模式，規劃對外回傳 production_db_read 標記。" },
      { name: "include_detail_labels", type: "boolean", required: false, description: "是否包含 detail labels（不包含全文）。" },
    ],
    responseSummary: [
      "回應為 metadata-only，不包含 full body、raw HTML、cookie/session/token。",
      "`not_investment_advice=true`、`full_body_stored=false`、`raw_html_stored=false` 為固定安全語義。",
      "在最終 enablement gate 完成前，`meta.production_ready` 必須維持 false。",
    ],
    responseFields: [
      { path: "data[].news_item_id", type: "string", description: "事件唯一識別鍵。" },
      { path: "data[].source_family", type: "string", description: "來源家族，固定 mops_material_information。" },
      { path: "data[].source_endpoint", type: "string", description: "來源端點，用於 attribution。" },
      { path: "data[].source_mode", type: "string", description: "來源模式，例如 production_db_read。" },
      { path: "data[].company_code", type: "string", description: "公司代碼。" },
      { path: "data[].company_name", type: "string|null", description: "公司名稱（若可得）。" },
      { path: "data[].event_date", type: "string", description: "事件日期。" },
      { path: "data[].event_time", type: "string", description: "事件時間。" },
      { path: "data[].seq_no", type: "string", description: "重大訊息序號（non-empty）。" },
      { path: "data[].subject", type: "string", description: "重大訊息標題/主旨（metadata）。" },
      { path: "data[].event_type", type: "string", description: "事件型別，預設 material_information。" },
      { path: "data[].detail_available", type: "boolean", description: "是否有可解析 detail metadata。" },
      { path: "data[].detail_labels_present", type: "boolean", description: "是否有 detail labels。" },
      { path: "data[].full_body_stored", type: "boolean", description: "固定 false，不提供全文儲存。" },
      { path: "data[].raw_html_stored", type: "boolean", description: "固定 false，不提供 raw HTML 儲存。" },
      { path: "data[].parser_status", type: "string", description: "解析狀態標記。" },
      { path: "data[].confidence", type: "number", description: "欄位可信度分數。" },
      { path: "data[].data_gaps", type: "object", description: "缺漏欄位與資料品質標記。" },
      { path: "data[].lineage", type: "object", description: "資料血緣與 trace metadata。" },
      { path: "data[].not_investment_advice", type: "boolean", description: "固定 true，非投資建議聲明。" },
      { path: "meta.production_ready", type: "boolean", description: "在 route final gate 前固定 false。" },
    ],
    notes: [
      "Private beta / disabled：此 endpoint 已 wired but disabled，不可視為 production-ready。",
      "不提供：full body、raw HTML、cookies/session/token、買賣建議/目標價。",
      "目前 scope 不含 TPEx；僅支援 MOPS material information metadata 流程。",
      "來源引用請保留 source_family/source_endpoint 與 lineage。",
    ],
    planRequirement: {
      title: "Plan & Entitlement（Docs-only）",
      bullets: [
        "目前屬 internal/private beta，尚未 public commercial availability。",
        "未來啟用時需 API key + plan entitlement + rate limit gate。",
        "此頁不設定 pricing、不變更 billing/runtime 行為。",
      ],
    },
    errorCases: [
      "200",
      "400",
      "401",
      "403",
      "429",
      "503",
    ],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "啟用後且條件合法時，回傳 metadata-only 事件資料。", body: successBody },
        { status: "400", description: "查詢參數未 bounded、limit 超出範圍或缺少必要條件。", body: `{"detail":"validation_error","error_code":"unbounded_query_or_invalid_params"}` },
        { status: "401", description: "缺少 API key 或驗證失敗。", body: `{"detail":"missing_or_invalid_api_key"}` },
        { status: "403", description: "方案未授權或 dataset entitlement 不符合。", body: `{"detail":"plan_not_entitled"}` },
        { status: "429", description: "超過 rate limit。", body: `{"detail":"rate_limited"}` },
        { status: "503", description: "route disabled 或 emergency disabled。", body: `{"detail":"route_disabled","meta":{"production_ready":false}}` },
      ],
    },
  };
}

function buildMopsMaterialEventsPreviewApiSections(): DocsContentSection[] {
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

function buildChipFlowsApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/chip-flows";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/chip-flows",
    headers=headers,
    params={
        "ticker": "2330",
        "market": "tw",
        "participant_type": "foreign",
        "date_from": "2026-04-01",
        "date_to": "2026-04-22",
        "limit": 50
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/chip-flows?ticker=2330&market=tw&participant_type=foreign&date_from=2026-04-01&date_to=2026-04-22&limit=50",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/chip-flows?ticker=2330&market=tw&participant_type=foreign&date_from=2026-04-01&date_to=2026-04-22&limit=50" \\
  --header "X-API-Key: your_api_key_here"`,
  };
  const successBody = JSON.stringify(
    {
      api_version: "v2",
      endpoint: "/v2/datasets/chip-flows",
      request_id: "req_chip_4422",
      plan_id: "pro",
      dataset: "chip_flows",
      query: {
        ticker: "2330",
        market: "tw",
        flow_type: null,
        participant_type: "foreign",
        date_from: "2026-04-01",
        date_to: "2026-04-22",
        limit: 50,
      },
      meta: { rows_returned: 1 },
      envelope: {
        api_version: "v2",
        dataset: "chip_flows",
        request_context: {
          ticker: "2330",
          as_of_date: "2026-04-22",
          family: "chip_deep",
          dataset_view: "broker_trading_daily_agg_v2",
        },
        data: [
          {
            ticker: "2330",
            trade_date: "2026-04-22",
            participant_type: "foreign",
            net_volume: 1250000,
            net_value: 1024000000,
            source_dataset: "broker_trading_daily",
          },
        ],
      },
    },
    null,
    2,
  );
  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "籌碼與資金",
    endpoint,
    method: "GET",
    overview: [
      "籌碼流向 API 提供法人與參與者拆分的買賣超流向資料，適合做籌碼面研究與策略訊號。",
      "此頁為 productized endpoint，採 canonical envelope 回應。",
    ],
    requestDescription: ["可使用 ticker、participant_type、flow_type 與日期區間做條件查詢。"],
    useCases: ["追蹤外資/投信/自營商資金流向。", "建立籌碼動能訊號。", "與價格資料做事件對照。"],
    gettingStarted: [
      "以 ticker 指定標的，並用 date_from/date_to 控制區間。",
      "market 預設為 tw。",
      "participant_type 可篩選 foreign/investment_trust/dealer/institutional_total。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "ticker", type: "string", required: false, description: "股票代碼。" },
      { name: "market", type: "string", required: false, description: "市場代碼，預設 tw。" },
      { name: "flow_type", type: "string", required: false, description: "流向類型過濾。" },
      { name: "participant_type", type: "string", required: false, description: "參與者類型過濾。" },
      { name: "date_from", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "date_to", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數限制。" },
    ],
    responseSummary: ["回應為 canonical envelope 格式，頂層包含 query/meta 與 envelope.data。"],
    responseFields: [
      { path: "dataset", type: "string", description: "資料集識別，固定為 chip_flows。" },
      { path: "meta.rows_returned", type: "integer", description: "回傳資料筆數。" },
      { path: "envelope.data[].ticker", type: "string", description: "股票代碼。" },
      { path: "envelope.data[].trade_date", type: "string", description: "交易日期。" },
      { path: "envelope.data[].participant_type", type: "string|null", description: "參與者類型。" },
      { path: "envelope.data[].net_volume", type: "number|null", description: "買賣超張數。" },
      { path: "envelope.data[].net_value", type: "number|null", description: "買賣超金額。" },
      { path: "envelope.data[].source_dataset", type: "string|null", description: "來源資料集標記。" },
    ],
    notes: [
      "此頁為 productized endpoint。",
      "若需要融資融券補充面，請參考 `/v2/datasets/margin-short`。",
      "若需要法人淨買超寬表，請參考 `/v2/datasets/institutional-flow`。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"] },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳籌碼流向資料", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"api_version":"v2","dataset":"chip_flows","meta":{"rows_returned":0},"envelope":{"data":[]}}` },
      ],
    },
  };
}

function buildChipFlowsApiSections(): DocsContentSection[] {
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

function buildInstitutionalFlowApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/institutional-flow";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/institutional-flow",
    headers=headers,
    params={
        "symbol": "2330",
        "start_date": "2026-04-01",
        "end_date": "2026-04-22",
        "limit": 50
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/institutional-flow?symbol=2330&start_date=2026-04-01&end_date=2026-04-22&limit=50",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/institutional-flow?symbol=2330&start_date=2026-04-01&end_date=2026-04-22&limit=50" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "institutional_flow",
      rows: [
        {
          symbol: "2330",
          date: "2026-04-22",
          market: "TW",
          foreign_net_buy_sell: 1523000,
          investment_trust_net_buy_sell: -320000,
          dealer_net_buy_sell: 180000,
          total_institutional_net_buy_sell: 1383000,
          foreign_buy: 8123000,
          foreign_sell: 6600000,
          investment_trust_buy: 980000,
          investment_trust_sell: 1300000,
          dealer_buy: 650000,
          dealer_sell: 470000,
          foreign_holding_ratio: 0.741,
          institutional_participation_ratio: 0.684,
          provider: "twse_official",
          source_role: "canonical",
          lineage: {
            source_table: "institutional_flow_items",
          },
          updated_at: "2026-04-23T03:10:00+00:00",
        },
      ],
      count: 1,
      meta: {
        plan: "free",
        row_limit: 50,
        is_limited: false,
      },
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "籌碼與資金",
    endpoint,
    method: "GET",
    overview: [
      "法人買賣 API 提供三大法人買賣超資料，適合用於資金動能分析與籌碼監控。",
      "此頁為主公開 productized endpoint，回應固定為 dataset/rows/count + meta。",
    ],
    requestDescription: ["使用此 endpoint 時，symbol 為必要參數。"],
    useCases: ["追蹤外資/投信/自營商資金流向。", "建立法人動能與反轉訊號。", "搭配價格與融資融券做交叉分析。"],
    gettingStarted: [
      "使用 symbol 指定標的。",
      "可用 start_date/end_date 查詢日期區間。",
      "limit 預設 100，最大 5000；實際回傳會受方案 row_limit 限制。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼（內部對應 ticker）。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數（預設 100，最大 5000）。" },
    ],
    responseSummary: ["回應結構固定為 dataset、rows、count，並附 meta（plan/row_limit/is_limited）。"],
    responseFields: [
      { path: "rows[].symbol", type: "string", description: "股票代碼。" },
      { path: "rows[].date", type: "string", description: "交易日期（YYYY-MM-DD）。" },
      { path: "rows[].market", type: "string", description: "市場代碼。" },
      { path: "rows[].foreign_net_buy_sell", type: "number|null", description: "外資買賣超。" },
      { path: "rows[].investment_trust_net_buy_sell", type: "number|null", description: "投信買賣超。" },
      { path: "rows[].dealer_net_buy_sell", type: "number|null", description: "自營商買賣超。" },
      { path: "rows[].total_institutional_net_buy_sell", type: "number|null", description: "三大法人合計買賣超。" },
      { path: "rows[].foreign_buy", type: "number|null", description: "外資買進。" },
      { path: "rows[].foreign_sell", type: "number|null", description: "外資賣出。" },
      { path: "rows[].investment_trust_buy", type: "number|null", description: "投信買進。" },
      { path: "rows[].investment_trust_sell", type: "number|null", description: "投信賣出。" },
      { path: "rows[].dealer_buy", type: "number|null", description: "自營商買進。" },
      { path: "rows[].dealer_sell", type: "number|null", description: "自營商賣出。" },
      { path: "rows[].foreign_holding_ratio", type: "number|null", description: "外資持股比率。" },
      { path: "rows[].institutional_participation_ratio", type: "number|null", description: "法人參與比率。" },
      { path: "rows[].provider", type: "string", description: "來源供應者。" },
      { path: "rows[].source_role", type: "string", description: "來源角色。" },
      { path: "rows[].lineage", type: "object|string|null", description: "來源追溯資訊。" },
      { path: "rows[].updated_at", type: "string|null", description: "資料更新時間。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
      { path: "meta.plan", type: "string", description: "目前方案代碼。" },
      { path: "meta.row_limit", type: "integer", description: "方案每次請求可回傳上限。" },
      { path: "meta.is_limited", type: "boolean", description: "是否因方案限制而截斷資料。" },
    ],
    notes: [
      "本頁為主公開 route，已作為法人買賣超的正式查詢入口。",
      "若需融資融券補充資料，請搭配 `/v2/datasets/margin-short`。",
      "若需更底層籌碼流向面，請參考 `/v2/datasets/chip-flows`。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Free（限制）", "Developer", "Pro", "Enterprise"] },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳法人買賣資料", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"dataset":"institutional_flow","rows":[],"count":0}` },
      ],
    },
  };
}

function buildInstitutionalFlowApiSections(): DocsContentSection[] {
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

function buildMarginShortApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/margin-short";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/margin-short",
    headers=headers,
    params={
        "symbol": "0050",
        "market": "TWSE",
        "start_date": "2026-03-10",
        "end_date": "2026-05-28",
        "limit": 3
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/margin-short?symbol=0050&market=TWSE&start_date=2026-03-10&end_date=2026-05-28&limit=3",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \
  --url "https://api.twmarketdata.com/v2/datasets/margin-short?symbol=0050&market=TWSE&start_date=2026-03-10&end_date=2026-05-28&limit=3" \
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "margin_short",
      rows: [
        {
          ticker: "0050",
          market: "TWSE",
          trade_date: "2026-05-28",
          margin_purchase_buy: 15234,
          margin_purchase_sell: 14820,
          margin_purchase_balance: 285004,
          short_sale_buy: 3120,
          short_sale_sell: 3388,
          short_sale_balance: 41882,
          source_provider: "twse_official",
          source_role: "official_twse_mi_margn",
          source_lineage: {
            provider: "twse_official",
            family: "official_twse_mi_margn",
          },
          data_gaps: [],
          not_investment_advice: true,
          legacy_aliases: {
            symbol: "0050",
          },
        },
      ],
      count: 1,
      meta: {
        plan: "pro",
        row_limit: 3,
        is_limited: false,
      },
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "籌碼與資金",
    endpoint,
    method: "GET",
    overview: [
      "融資融券 API 目前以 TWSE-only private beta 方式提供，聚焦 official-first 的信用交易欄位。",
      "文件必須保留 source_lineage、data_gaps 與 not_investment_advice，且不得把此資料說成 TPEx/full-market 或已啟用 daily write cron。",
    ],
    requestDescription: ["使用此 endpoint 時，symbol 為必要參數，並建議明確指定 market=TWSE。"],
    useCases: ["監控融資融券餘額變化。", "建立信用交易風險濾網。", "與法人買賣資料做交叉分析。"],
    gettingStarted: [
      "使用 symbol 指定標的，建議搭配 market=TWSE。",
      "可用 start_date/end_date 查詢目前驗證 coverage 範圍（2026-03-10..2026-05-28）。",
      "網站文案需保留 private beta、TWSE-only、no TPEx claim、daily write cron not enabled。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "symbol", type: "string", required: true, description: "股票代碼；beta 相容請求參數。" },
      { name: "market", type: "string", required: false, description: "建議指定 TWSE；本頁不宣稱 TPEx 支援。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數。" },
    ],
    responseSummary: ["回應固定為 dataset、rows、count，加上 meta；欄位需保留 source_lineage、data_gaps 與 not_investment_advice。"],
    responseFields: [
      { path: "rows[].ticker", type: "string", description: "標的代碼。" },
      { path: "rows[].market", type: "string", description: "市場別；目前網站僅宣稱 TWSE。" },
      { path: "rows[].trade_date", type: "string", description: "交易日期（YYYY-MM-DD）。" },
      { path: "rows[].margin_purchase_buy", type: "number|null", description: "融資買進。" },
      { path: "rows[].margin_purchase_sell", type: "number|null", description: "融資賣出。" },
      { path: "rows[].margin_purchase_balance", type: "number|null", description: "融資餘額。" },
      { path: "rows[].short_sale_buy", type: "number|null", description: "融券買進（回補）。" },
      { path: "rows[].short_sale_sell", type: "number|null", description: "融券賣出。" },
      { path: "rows[].short_sale_balance", type: "number|null", description: "融券餘額。" },
      { path: "rows[].source_provider", type: "string", description: "來源提供者。" },
      { path: "rows[].source_role", type: "string", description: "來源角色。" },
      { path: "rows[].source_lineage", type: "object", description: "來源血緣；文件與網站文案必須保留。" },
      { path: "rows[].data_gaps", type: "array", description: "資料缺口訊號。" },
      { path: "rows[].not_investment_advice", type: "boolean", description: "非投資建議宣告。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "目前 coverage 為 2026-03-10..2026-05-28，總 rows 16,475、distinct tickers 1,272。",
      "TWSE-only、private beta、no TPEx claim。",
      "official-first 與 source_lineage/data_gaps 必須保留。",
      "ratio tolerance 為 1e-6。",
      "daily write cron not enabled。",
      "若需法人淨買賣超補充資料，請搭配 `/v2/datasets/institutional-flow`。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Private beta access", "Developer", "Pro", "Enterprise"] },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳融資融券資料", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此 private beta 資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"dataset":"margin_short","rows":[],"count":0}` },
      ],
    },
  };
}

function buildTotalMarginShortApiReference(): ApiReferenceContent {
  const endpoint = "/v2/datasets/total-margin-short";
  const codeExamples: ApiCodeExamples = {
    python: `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/total-margin-short",
    headers=headers,
    params={
        "market": "TWSE",
        "start_date": "2026-03-10",
        "end_date": "2026-05-14",
        "limit": 3
    },
)
print(response.json())`,
    javascript: `const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/total-margin-short?market=TWSE&start_date=2026-03-10&end_date=2026-05-14&limit=3",
  { headers: { "X-API-Key": "your_api_key_here" } }
)
const data = await res.json()
console.log(data)`,
    curl: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/total-margin-short?market=TWSE&start_date=2026-03-10&end_date=2026-05-14&limit=3" \\
  --header "X-API-Key: your_api_key_here"`,
  };

  const successBody = JSON.stringify(
    {
      dataset: "total_margin_short",
      rows: [
        {
          market: "TWSE",
          trade_date: "2026-05-14",
          margin_purchase_balance_total: 1234567,
          short_sale_balance_total: 78901,
          margin_purchase_buy_total: 3210,
          margin_purchase_sell_total: 2880,
          short_sale_buy_total: 420,
          short_sale_sell_total: 390,
          margin_purchase_amount_total: 6543210,
          currency: "TWD",
          market_scope: "TWSE",
          source_provider: "twse_official",
          source_role: "official_twse_mi_margn_summary",
          source_lineage: {
            provider: "twse_official",
            family: "official_twse_mi_margn_summary",
          },
          data_gaps: [],
          not_investment_advice: true,
        },
      ],
      count: 1,
      meta: {
        plan: "pro",
        row_limit: 3,
        is_limited: false,
      },
    },
    null,
    2,
  );

  return {
    layoutVariant: "data-api-standard",
    categoryLabel: "籌碼與資金",
    endpoint,
    method: "GET",
    overview: [
      "整體融資融券 API 以 TWSE-only private beta 方式提供，回報市場總體 credit aggregate 欄位。",
      "文件保留 source_lineage、data_gaps 與 not_investment_advice，不得誤述為 TPEx/full-market 或 daily write cron 已啟用。",
    ],
    requestDescription: ["使用時請指定 market，建議限制在 TWSE。"],
    useCases: ["觀察市場總量融資/融券買賣趨勢。", "配合籌碼面指標做風險情境判讀。", "對接私域研究流程時保留缺口欄位。"],
    gettingStarted: [
      "建議指定 market=TWSE。",
      "可用 start_date/end_date 查詢現有種子驗證範圍（2026-03-10..2026-05-14）。",
      "網站與 API 文案需保留 private beta、seed scope、no TPEx claim、not investment advice。",
    ],
    exampleRequestCurl: codeExamples.curl,
    queryParameters: [
      { name: "market", type: "string", required: false, description: "建議指定 TWSE；本頁面不宣稱 TPEx 支援。" },
      { name: "start_date", type: "string", required: false, description: "查詢起始日期（YYYY-MM-DD）。" },
      { name: "end_date", type: "string", required: false, description: "查詢結束日期（YYYY-MM-DD）。" },
      { name: "limit", type: "integer", required: false, description: "回傳筆數。" },
    ],
    responseSummary: [
      "回應固定為 dataset、rows、count，加上 meta；欄位需保留 source_lineage、data_gaps 與 not_investment_advice。",
    ],
    responseFields: [
      { path: "rows[].market", type: "string", description: "市場別；目前網站僅公開 TWSE。" },
      { path: "rows[].trade_date", type: "string", description: "交易日期（YYYY-MM-DD）。" },
      { path: "rows[].margin_purchase_balance_total", type: "number|null", description: "融資餘額總額。" },
      { path: "rows[].short_sale_balance_total", type: "number|null", description: "融券餘額總額。" },
      { path: "rows[].margin_purchase_buy_total", type: "number|null", description: "融資買入總額。" },
      { path: "rows[].margin_purchase_sell_total", type: "number|null", description: "融資賣出總額。" },
      { path: "rows[].short_sale_buy_total", type: "number|null", description: "融券買進（回補）總額。" },
      { path: "rows[].short_sale_sell_total", type: "number|null", description: "融券賣出總額。" },
      { path: "rows[].margin_purchase_amount_total", type: "number|null", description: "融資交易總金額。" },
      { path: "rows[].currency", type: "string", description: "幣別（如 TWD）。" },
      { path: "rows[].market_scope", type: "string", description: "市場範圍；本 dataset 限 TWSE。" },
      { path: "rows[].source_provider", type: "string", description: "來源提供者。" },
      { path: "rows[].source_role", type: "string", description: "來源角色。" },
      { path: "rows[].source_lineage", type: "object", description: "資料來源血緣；必須保留並於文案中說明。" },
      { path: "rows[].data_gaps", type: "array", description: "資料缺口訊號。" },
      { path: "rows[].not_investment_advice", type: "boolean", description: "非投資建議宣告。" },
      { path: "count", type: "integer", description: "回傳資料筆數。" },
    ],
    notes: [
      "目前 coverage 種子為 2026-03-10..2026-05-14，row_count=3（private beta seeded）。",
      "TWSE-only、seed scope，且 no TPEx claim。",
      "official-first 與 source_lineage/data_gaps 必須保留。",
      "ratio tolerance 為 1e-6。",
      "daily write cron not enabled。",
    ],
    planRequirement: { title: "Plan Requirement", bullets: ["Private beta access", "Developer", "Pro", "Enterprise"] },
    errorCases: ["200", "400", "401", "403", "404"],
    sidePanel: {
      requestExample: codeExamples.curl,
      codeExamples,
      statusExamples: [
        { status: "200", description: "成功回傳整體融資融券資料", body: successBody },
        { status: "400", description: "查詢參數錯誤", body: `{"detail":"bad_request"}` },
        { status: "401", description: "缺少或無效 API key", body: `{"detail":"missing_api_key"}` },
        { status: "403", description: "目前方案無法存取此 private beta 資料", body: `{"error":"dataset_not_entitled"}` },
        { status: "404", description: "查無符合條件資料", body: `{"dataset":"total_margin_short","rows":[],"count":0}` },
      ],
    },
  };
}

function buildMarginShortApiSections(): DocsContentSection[] {
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

function buildTotalMarginShortApiSections(): DocsContentSection[] {
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
    subtitle: "從月營收、損益表、資產負債表與估值資料建立可驗證的台股基本面研究流程。",
    sections: [
      {
        id: "who-this-guide-is-for",
        label: "這篇適合誰",
        paragraphs: [
          "這篇適合要建立台股基本面 API workflow 的開發者、研究員與 AI agent 整合者。",
          "若你希望從台股資料 API 快速建立可重跑、可驗證的研究流程，可先從本頁開始。",
        ],
      },
      {
        id: "fundamental-research-map",
        label: "基本面研究會用到哪些資料",
        paragraphs: [
          "常見的基本面資料包含月營收、損益表、資產負債表、現金流量表與估值資料。建議用統一的 ticker、日期與資料來源規則，避免 cross-dataset 對齊錯誤。",
        ],
        bullets: [
          "資料集介紹：/datasets/monthly-revenue、/datasets/income-statement、/datasets/balance-sheet、/datasets",
          "API 文件：/docs/api/financial-growth/monthly-revenue、/docs/api/financial-growth/income-statement、/docs/api/financial-growth/balance-sheet、/docs/api/financial-growth/valuation-data",
        ],
      },
      {
        id: "prerequisites",
        label: "Prerequisites",
        paragraphs: ["開始前請先準備："],
        bullets: [
          "Python 3.9+",
          "requests",
          "X-API-Key",
          "symbol（例如 2330）",
        ],
      },
      {
        id: "authentication",
        label: "Authentication",
        paragraphs: [
          "所有 request 都要帶 X-API-Key。下面示例會用同一個 helper 函式讀取不同 dataset。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {
    "X-API-Key": "your_api_key_here",
}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()`,
          },
        ],
      },
      {
        id: "issuer-profile",
        label: "查詢公司基本資料",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "your_api_key_here"}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()

profile = get_dataset(
    "/v2/datasets/issuer-profile",
    {"symbol": "2330"},
)

print(profile)`,
          },
        ],
      },
      {
        id: "monthly-revenue",
        label: "查詢月營收",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "your_api_key_here"}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()

monthly_revenue = get_dataset(
    "/v2/datasets/monthly-revenue",
    {
        "symbol": "2330",
        "limit": 12,
    },
)

print(monthly_revenue)`,
          },
        ],
      },
      {
        id: "income-statement",
        label: "查詢損益表",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "your_api_key_here"}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()

income_statement = get_dataset(
    "/v2/datasets/income-statement",
    {"symbol": "2330", "limit": 4},
)

print(income_statement)`,
          },
        ],
      },
      {
        id: "balance-sheet",
        label: "查詢資產負債表",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "your_api_key_here"}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()

balance_sheet = get_dataset(
    "/v2/datasets/balance-sheet",
    {"symbol": "2330", "limit": 4},
)

print(balance_sheet)`,
          },
        ],
      },
      {
        id: "cash-flow-statement",
        label: "查詢現金流量表",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "your_api_key_here"}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()

cash_flow = get_dataset(
    "/v2/datasets/cash-flow-statement",
    {"symbol": "2330", "limit": 4},
)

print(cash_flow)`,
          },
        ],
      },
      {
        id: "valuation-data",
        label: "查詢估值資料",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "your_api_key_here"}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()

valuation_data = get_dataset(
    "/v2/datasets/valuation-data",
    {"symbol": "2330", "limit": 4},
)

print(valuation_data)`,
          },
        ],
      },
      {
        id: "fundamentals-summary",
        label: "組合成基本面摘要",
        paragraphs: [
          "實務上建議先看月營收變化，再看損益表與資產負債表，最後用估值資料補上價格與基本面的相對關係。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `company_name = (profile.get("rows") or [{}])[0].get("company_name")
latest_revenue_yoy = (monthly_revenue.get("rows") or [{}])[0].get("yoy_growth_pct")
latest_eps = (income_statement.get("rows") or [{}])[0].get("eps")
latest_per = (valuation_data.get("rows") or [{}])[0].get("per")
latest_pbr = (valuation_data.get("rows") or [{}])[0].get("pbr")

summary = {
    "company_name": company_name,
    "latest_revenue_yoy": latest_revenue_yoy,
    "latest_eps": latest_eps,
    "latest_per": latest_per,
    "latest_pbr": latest_pbr,
}

print(summary)`,
          },
        ],
      },
      {
        id: "coverage-freshness-notes",
        label: "資料缺口與 freshness 注意事項",
        paragraphs: [
          "不同資料集的更新節奏與揭露時點不同。使用前請先確認各 API 回傳的時間欄位、資料範圍與 data_gaps 欄位。",
          "TW Market Data 會保留來源角色與資料缺口資訊，請不要假設任一資料集在所有日期與所有標的都完整覆蓋。",
        ],
      },
      {
        id: "next-steps",
        label: "Next Steps",
        paragraphs: ["完成基本面摘要後，可延伸到："],
        bullets: [
          "/docs/api/market-prices/twse-daily-price",
          "/docs/api/query-tools/query-api",
          "/docs/workflows/market-status",
          "/datasets/monthly-revenue",
          "/datasets/income-statement",
          "/datasets/balance-sheet",
        ],
      },
    ],
  },
  {
    slug: "capital-flow",
    navLabel: "看籌碼",
    title: "看籌碼",
    subtitle: "使用三大法人與融資融券資料，建立可驗證的台股籌碼觀察流程。",
    sections: [
      {
        id: "who-this-guide-is-for",
        label: "這篇適合誰",
        paragraphs: [
          "這篇適合要追蹤外資、投信、自營商與信用交易變化的研究者與開發者。",
          "若你想把籌碼面接入策略或 AI agent 研究流程，可從本頁的最小查詢流程開始。",
        ],
      },
      { id: "prerequisites", label: "Prerequisites", paragraphs: ["Python 3.9+、requests、X-API-Key、symbol（例如 2330）。"] },
      {
        id: "authentication",
        label: "Authentication",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {
    "X-API-Key": "your_api_key_here",
}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()`,
          },
        ],
      },
      {
        id: "institutional-flow",
        label: "查詢三大法人買賣",
        paragraphs: [
          "三大法人買賣超可用於觀察資金流向與籌碼變化。資料單位以 shares 為主，實際欄位請以 API 文件回應為準。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `flow = get_dataset(
    "/v2/datasets/institutional-flow",
    {
        "symbol": "2330",
        "limit": 10,
    },
)`,
          },
        ],
      },
      {
        id: "margin-short",
        label: "查詢融資融券",
        paragraphs: ["融資融券可補充信用交易與市場槓桿情緒，適合與法人流向一起判讀。"],
        codeBlocks: [
          {
            language: "python",
            code: `margin = get_dataset(
    "/v2/datasets/margin-short",
    {
        "symbol": "2330",
        "limit": 10,
    },
)`,
          },
        ],
      },
      {
        id: "issuer-announcements",
        label: "查詢公司公告",
        codeBlocks: [
          {
            language: "python",
            code: `announcements = get_dataset(
    "/v2/datasets/issuer-announcements",
    {
        "symbol": "2330",
        "limit": 5,
    },
)`,
          },
        ],
      },
      {
        id: "events",
        label: "查詢事件日曆",
        codeBlocks: [
          {
            language: "python",
            code: `events = get_dataset(
    "/v2/datasets/events",
    {
        "symbol": "2330",
        "limit": 5,
    },
)

structured_events = get_dataset(
    "/v2/datasets/structured-events",
    {
        "symbol": "2330",
        "limit": 5,
    },
)`,
          },
        ],
      },
      {
        id: "merge-flow-events",
        label: "合併籌碼與事件",
        codeBlocks: [
          {
            language: "python",
            code: `result = {
    "institutional_flow": flow.get("rows", []),
    "margin_short": margin.get("rows", []),
    "announcements": announcements.get("rows", []),
    "events": events.get("rows", []),
    "structured_events": structured_events.get("rows", []),
}

print(result)`,
          },
        ],
      },
      {
        id: "coverage-caveat",
        label: "coverage 注意事項",
        paragraphs: [
          "institutional-flow 資料集 coverage 仍在持續補齊中。請在 workflow 內保留 data_gaps 與缺值處理，不要直接把缺口當成 0。",
        ],
        bullets: [
          "資料集介紹：/datasets/institutional-flow、/datasets",
          "API 文件：/docs/api/capital-flow/institutional-flow、/docs/api/capital-flow/margin-short",
        ],
      },
      {
        id: "next-steps",
        label: "Next Steps",
        paragraphs: ["完成籌碼與事件整合後，可延伸到："],
        bullets: [
          "/docs/api/market-prices/twse-daily-price",
          "/docs/api/market-prices/technical-indicators",
          "/docs/workflows/market-status",
          "/datasets/institutional-flow",
        ],
      },
    ],
  },
  {
    slug: "market-status",
    navLabel: "看市場狀態",
    title: "取得台股價格與市場狀態",
    subtitle: "以台股價格、成交量、技術指標與市場廣度建立可重跑的市場狀態觀測流程。",
    sections: [
      {
        id: "who-this-guide-is-for",
        label: "這篇適合誰",
        paragraphs: [
          "這篇適合需要每日追蹤台股市場狀態、建立篩選流程或監控流程的開發者與研究團隊。",
        ],
      },
      { id: "prerequisites", label: "Prerequisites", paragraphs: ["Python 3.9+、requests、X-API-Key、symbol（例如 2330）。"] },
      {
        id: "authentication",
        label: "Authentication",
        codeBlocks: [
          {
            language: "python",
            code: `import requests

BASE_URL = "https://api.twmarketdata.com"
HEADERS = {
    "X-API-Key": "your_api_key_here",
}

def get_dataset(path, params):
    response = requests.get(
        f"{BASE_URL}{path}",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()
    return response.json()`,
          },
        ],
      },
      {
        id: "twse-daily-price",
        label: "查詢 TWSE 日線價格",
        codeBlocks: [
          {
            language: "python",
            code: `prices = get_dataset(
    "/v2/datasets/twse-daily-price",
    {
        "symbol": "2330",
        "limit": 20,
    },
)`,
          },
        ],
      },
      {
        id: "tpex-daily-price",
        label: "查詢 TPEx 日線價格",
        codeBlocks: [
          {
            language: "python",
            code: `tpex_prices = get_dataset(
    "/v2/datasets/tpex-daily-price",
    {
        "symbol": "5483",
        "limit": 20,
    },
)`,
          },
        ],
      },
      {
        id: "index-data",
        label: "查詢市場指數",
        codeBlocks: [
          {
            language: "python",
            code: `indices = get_dataset(
    "/v2/datasets/index-data",
    {
        "limit": 10,
    },
)`,
          },
        ],
      },
      {
        id: "technical-indicators",
        label: "查詢技術指標",
        codeBlocks: [
          {
            language: "python",
            code: `indicators = get_dataset(
    "/v2/datasets/technical-indicators",
    {
        "symbol": "2330",
        "limit": 20,
    },
)`,
          },
        ],
      },
      {
        id: "market-breadth",
        label: "查詢市場廣度",
        codeBlocks: [
          {
            language: "python",
            code: `breadth = get_dataset(
    "/v2/datasets/market-breadth",
    {
        "limit": 10,
    },
)`,
          },
        ],
      },
      {
        id: "market-summary",
        label: "組合成市場狀態摘要",
        paragraphs: [
          "市場狀態資料依 snapshot / ingestion cadence 更新，建議與交易日資料一起判讀。",
          "若 workflow 需要橫跨多資料集，請同步檢查 freshness 與 data_gaps，避免把不同更新時間的資料視為同一個時間點。",
        ],
        codeBlocks: [
          {
            language: "python",
            code: `summary = {
    "twse_prices": prices.get("rows", []),
    "tpex_prices": tpex_prices.get("rows", []),
    "indices": indices.get("rows", []),
    "technical_indicators": indicators.get("rows", []),
    "market_breadth": breadth.get("rows", []),
}

print(summary)`,
          },
        ],
      },
      {
        id: "dataset-links",
        label: "資料集與文件入口",
        bullets: [
          "資料集介紹：/datasets/twse-daily-price、/datasets",
          "API 文件：/docs/api/market-prices/twse-daily-price、/docs/api/market-prices/technical-indicators",
        ],
      },
      {
        id: "next-steps",
        label: "Next Steps",
        paragraphs: ["完成市場狀態摘要後，可延伸到："],
        bullets: [
          "/docs/api/market-prices/interest-rate",
          "/docs/api/financial-growth/monthly-revenue",
          "/docs/workflows/capital-flow",
        ],
      },
    ],
  },
  {
    slug: "fast-data-access",
    navLabel: "快速查資料",
    title: "快速查資料",
    subtitle: "用一致的查詢步驟，快速定位台股資料 API 並驗證資料來源與欄位意義。",
    sections: [
      {
        id: "problem",
        label: "這個 workflow 解決什麼問題",
        paragraphs: [
          "把查資料流程從『找不到資料』變成『可快速定位、可驗證、可落地』。",
          "這篇可作為 developer quickstart：先決定 ticker，再挑 dataset，再檢查 query parameters 與 response/data_gaps。",
        ],
      },
      { id: "datasets", label: "用到哪些 API / dataset", paragraphs: [], bullets: ["/v2/search", "/v2/query", "explainability layer"] },
      {
        id: "minimal-flow",
        label: "最小使用流程",
        paragraphs: [],
        bullets: ["用 Search API 先找標的與主題", "用 Query API 取回指定欄位", "用 Explainability 檢查來源角色與計算邏輯"],
      },
      { id: "order", label: "建議先後順序", paragraphs: ["先定位（search）再提取（query）最後驗證（explainability）。"] },
      {
        id: "quick-query-notes",
        label: "快速查詢重點",
        bullets: [
          "先確認 symbol 與市場別，避免 ticker 對不到資料集。",
          "比對 start_date/end_date 或 limit 參數，避免誤判資料缺漏。",
          "若回傳包含 data_gaps，請保留並進入後續分析流程，不要直接忽略。",
        ],
      },
      {
        id: "next",
        label: "可延伸搭配頁面",
        paragraphs: [
          "/docs/introduction、/docs/api/query-tools/search-api、/docs/api/query-tools/query-api、/docs/api/query-tools/explainability",
          "/datasets、/openapi.json、/llms.txt",
        ],
      },
    ],
  },
  {
    slug: "strategy-ai",
    navLabel: "做策略 / AI",
    title: "做策略 / AI",
    subtitle: "以結構化 market data 建立策略與 AI agent 研究流程，並保留資料缺口與可追溯證據。",
    sections: [
      {
        id: "problem",
        label: "這個 workflow 解決什麼問題",
        paragraphs: [
          "把策略研究與 AI workflow 的資料準備流程標準化，降低特徵口徑不一致風險。",
          "AI agent 應優先讀取 structured data、lineage 與 data_gaps，而不是只依賴單一自然語言摘要。",
        ],
      },
      { id: "datasets", label: "用到哪些 API / dataset", paragraphs: [], bullets: ["features", "factor_data", "time_alignment"] },
      {
        id: "minimal-flow",
        label: "最小使用流程",
        paragraphs: [],
        bullets: [
          "先用價格資料建立時間軸與交易日基準",
          "再接月營收與財報資料補上基本面脈絡",
          "接著加入 institutional-flow 與其他交易面資料",
          "最後保留 data_gaps / confidence / source attribution 供 agent 判讀",
        ],
      },
      { id: "order", label: "建議先後順序", paragraphs: ["先判讀、再建模、最後對齊；可降低回測與即時執行偏差。"] },
      {
        id: "ai-discoverability-entrypoints",
        label: "AI / Agent 可讀入口",
        paragraphs: [
          "若要讓 agent 程式化讀取文件與資料面，請優先使用 /llms.txt、/llms-full.txt 與 /openapi.json。",
          "MCP tools 目前為 preview / planned，不應假設為已上線的正式交易或投資建議系統。",
        ],
      },
      {
        id: "risk-and-disclaimer",
        label: "研究流程聲明",
        bullets: [
          "本 workflow 僅用於資料研究、策略分析與系統整合，不構成投資建議。",
          "請避免輸出 buy/sell/hold 或 target price 類型的交易行動指令。",
        ],
      },
      {
        id: "next",
        label: "可延伸搭配頁面",
        paragraphs: [
          "/docs/api/query-tools/query-api、/docs/api/query-tools/explainability、/docs/workflows/fast-data-access",
          "/datasets、/datasets/twse-daily-price、/datasets/institutional-flow、/llms.txt、/llms-full.txt、/openapi.json",
        ],
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
    navLabel: "資料血緣",
    category: "overview",
    icon: "chart",
    title: "資料血緣",
    subtitle: "以官方公開來源為優先，讓每筆台股資料都能回溯到來源、處理流程與對外 API 回應。",
    tier: "complete",
    sections: [
      {
        id: "docs-portals",
        label: "文件入口",
        paragraphs: [
          "你可以從左側導覽查看所有資料集，也可以先從 Quick Start 建立第一個 request。若要讓 agent 或內部工具讀取文件，後續可透過 OpenAPI spec、llms.txt 或 MCP tools 作為入口。",
        ],
      },
      {
        id: "why-provenance-matters",
        label: "為什麼資料血緣重要",
        bullets: [
          "台股研究、回測與 agent workflow 需要可驗證的資料來源。",
          "若資料來源不透明，模型輸出、策略訊號與財報分析很難除錯。",
          "TW Market Data 採 official/public-first 原則，以 TWSE、TPEx、MOPS 與官方公開資料作為 canonical source；公開主張目前以 TWSE-first verified baseline 為主。",
          "第三方公開網站可作為研究比對材料，但不視為 production canonical source。",
        ],
      },
      {
        id: "data-sources",
        label: "資料來源",
        paragraphs: [
          "市場價格：TWSE 日線價格為目前已驗證主路徑；TPEx 日線價格目前屬 beta / limited，歷史深度仍待補齊。還原價格（adjusted prices）目前不在可公開宣稱可用範圍。",
          "財務與成長：月營收、損益表、資產負債表、現金流量表主要來自 MOPS / 公開資訊觀測站；估值與財務指標則結合價格、股本、市值與財報資料派生。",
          "籌碼與資金：三大法人、融資融券以 TWSE / TPEx 官方公開資料為優先來源。",
          "公司與事件：公司基本資料、公司公告、事件日曆、結構化事件、公司行動、股利來自 TWSE / TPEx / MOPS 官方公開資訊與平台標準化流程。",
          "分類與策略層：主題分類、指數分類、features、factor-data、time-alignment、screener 為平台根據官方資料整理、映射或派生的資料層。",
        ],
      },
      {
        id: "processing-flow",
        label: "資料處理流程",
        bullets: [
          "source fetch",
          "raw capture / normalized table",
          "validation / schema check",
          "external read API",
          "response shaping",
          "lineage / source_role 標記",
        ],
      },
      {
        id: "provenance-guarantees",
        label: "資料血緣保證",
        bullets: [
          "官方來源優先。",
          "canonical / helper / fallback 角色區分。",
          "response 不回傳 raw payload。",
          "schema 與欄位穩定性優先。",
          "available-now / preview / not-yet-available 分級。",
          "controlled rollout，避免過度承諾。",
        ],
      },
      {
        id: "questions",
        label: "Questions",
        paragraphs: [
          "若需要資料來源、方法論或企業導入確認，請聯繫 TW Market Data 團隊或從儀表板提交需求。",
        ],
      },
    ],
  },
  {
    slug: ["tools-and-mcp"],
    href: "/docs/tools-and-mcp",
    navLabel: "Tools / MCP",
    category: "overview",
    icon: "braces",
    title: "Tools / MCP",
    subtitle: "讓 AI agent 與內部工具以結構化方式查詢台股資料。",
    tier: "complete",
    sections: [
      {
        id: "docs-portals",
        label: "文件入口",
        paragraphs: [
          "你可以從左側導覽查看所有 API 文件，也可以從 Quick Start 建立第一個 request。",
          "後續若要讓 agent 或內部工具讀取文件，可透過 OpenAPI spec、llms.txt 或 MCP tools 作為入口。",
          "目前 Tools / MCP 採 preview / controlled rollout 語義，正式可用範圍會依帳號方案與 API key 權限決定。",
        ],
      },
      {
        id: "overview",
        label: "Overview",
        paragraphs: [
          "TW Market Data 的 Tools / MCP 目標，是讓 AI agent、研究流程與內部資料產品可以透過穩定工具介面查詢台股資料。",
          "這些工具會包裝底層 dataset API，例如行情、月營收、財報、估值、技術指標、籌碼與公司事件。",
          "前端文件可以先展示工具設計與預期用法；正式 MCP server endpoint 仍以 controlled rollout 與帳號權限為準。",
        ],
      },
      {
        id: "authentication",
        label: "Authentication",
        paragraphs: [
          "Tools / MCP 建議同時理解 API key 與互動式 connector 兩種接入方向。",
          "API Key：用於 programmatic access。正式 request 使用 X-API-Key header。",
          "OAuth / hosted connector：可作為未來 interactive client 的接入方向，例如 Cursor、Claude、內部 agent console；目前以 rollout 狀態為準。",
          "若還沒有帳號，先前往儀表板建立 API key。API key 權限會限制可查詢 dataset、rate limit 與 monthly usage。",
        ],
      },
      {
        id: "getting-started",
        label: "Getting Started",
        paragraphs: [
          "以下示例用於展示 Tools / MCP 的預期接入方式；是否可直接連線，需依目前帳號權限與 rollout 狀態判斷。",
          "Internal agent workflow 建議採以下步驟：agent 先選工具、工具轉成 dataset query、回傳 normalized JSON，最後由 agent 進行摘要、篩選或比對。流程中不應直接讀 raw payload 或私有 token。",
        ],
        bullets: [
          "Cursor / IDE agent",
          "Python client",
          "Internal agent workflow",
        ],
        codeBlocks: [
          {
            language: "text",
            code: `# Cursor / IDE agent (sample config)
{
  "mcpServers": {
    "tw-market-data": {
      "url": "https://mcp.twmarketdata.com/"
    }
  }
}

Note:
- URL 為未來正式 MCP endpoint 範例，實際部署位址以帳號後台或內部部署設定為準。
- 若尚未開放 MCP server，可先用 REST API 或 OpenAPI spec。`,
          },
          {
            language: "python",
            code: `import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

API_KEY = "your_api_key_here"
SERVER_URL = "https://mcp.twmarketdata.com/api"

async def main():
    async with streamablehttp_client(
        SERVER_URL,
        headers={"X-API-Key": API_KEY},
    ) as streams:
        read_stream, write_stream, _ = streams
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            result = await session.call_tool(
                "get_twse_daily_price",
                {"symbol": "2330", "limit": 5},
            )
            print(result.content)

asyncio.run(main())`,
          },
        ],
      },
      {
        id: "mcp-tools",
        label: "MCP Tools",
        paragraphs: ["下列工具清單以目前台股資料能力為基礎，並區分正式能力與 preview。"],
        bullets: [
          "Market Prices：get_twse_daily_price、get_tpex_daily_price、get_adjusted_prices、get_market_indices、get_market_breadth",
          "Financials：get_monthly_revenue、get_income_statement、get_balance_sheet、get_cash_flow_statement、get_valuation_data",
          "Capital Flow：get_institutional_flow、get_margin_short",
          "Company & Events：get_issuer_profile、get_issuer_announcements、get_events、get_structured_events、get_dividends、get_corporate_actions",
          "Classification & Strategy：get_theme_taxonomy、get_index_classification、get_factor_data、screen_taiwan_stocks、list_screener_fields",
          "Preview：get_company_news、get_market_news",
        ],
      },
      {
        id: "example-usage",
        label: "Example Usage",
        paragraphs: ["以下是 agent 可直接提出的查詢需求範例："],
        bullets: [
          "查 2330 最近 20 個交易日的日線價格。",
          "比較 2330 與 2317 最近 12 個月營收 YoY。",
          "找出月營收 YoY 大於 20% 且 PER 低於 25 的股票。",
          "查 2454 最近一季損益表與 EPS。",
          "整理台積電最近公告與事件。",
          "列出台灣市場主要指數與類股表現。",
          "查三大法人最近一週買超最多的股票。",
          "用技術指標篩選 RSI 低於 30 的股票。",
          "Quick Start：/docs/quick-start",
          "OpenAPI / API Model：/docs/api-model",
          "Screener：/docs/api/strategy-quant/screener",
        ],
      },
    ],
  },
  {
    slug: ["sdk", "release-status"],
    href: "/docs/sdk/release-status",
    navLabel: "Release Status",
    category: "guides",
    icon: "braces",
    title: "SDK / MCP Release Status",
    subtitle: "清楚區分目前可用能力與尚未 GA 的功能，避免整合誤判。",
    tier: "complete",
    sections: [
      {
        id: "status-matrix",
        label: "Release Status Matrix",
        paragraphs: [
          "目前主要可用入口是 Public API Gateway（X-API-Key）。SDK、MCP、AI tools 相關能力仍以 preview 或 example 為主。",
        ],
        codeBlocks: [
          {
            language: "text",
            code: `| Component | Status | Intended Use | Not Yet |
|---|---|---|---|
| Public API Gateway | Beta / Live | Direct API calls with X-API-Key | Rate limits GA |
| Python SDK | Preview | Local/dev usage | PyPI publish, tests |
| JavaScript SDK | Preview | Local/dev usage | npm publish, dual build |
| MCP Server | Preview Skeleton | Local adapter exploration | stdio transport, hosted MCP |
| AI Tool Manifest | Preview | Tool calling registry seed | Official agent runtime |
| Agent Examples | Example | Workflow demo | Investment advice / trading |`,
          },
        ],
      },
      {
        id: "current-default-path",
        label: "Current Recommended Path",
        bullets: [
          "正式資料請求：Public API Gateway `/v2/datasets/*` + `X-API-Key`。",
          "SDK：目前僅建議 local/dev 使用。",
          "MCP：目前僅 skeleton，尚未正式 stdio server。",
          "Agent examples：僅示範 workflow，不是投資建議、個股推薦或交易訊號。",
        ],
      },
      {
        id: "notes",
        label: "Notes",
        paragraphs: [
          "Python SDK 尚未發布到 PyPI，JavaScript SDK 尚未發布到 npm。",
          "若需 production integration，請優先依 Public API Gateway 文件整合。",
        ],
      },
    ],
  },
  {
    slug: ["sdk", "python-sdk"],
    href: "/docs/sdk/python-sdk",
    navLabel: "Python SDK",
    category: "guides",
    icon: "braces",
    title: "Python SDK",
    subtitle: "使用 Python client 快速呼叫 TW Market Data public API，並取得 requestId 與 credits metadata。",
    tier: "complete",
    sections: [
      {
        id: "installation",
        label: "安裝",
        paragraphs: [
          "目前 Python SDK 為 local/dev preview，可用 editable 安裝方式在本機測試。",
        ],
        codeBlocks: [
          {
            language: "text",
            code: `cd /Volumes/DEV_USB/Projects/tw-market-data-website
pip install -e packages/python-sdk`,
          },
        ],
      },
      {
        id: "create-client",
        label: "建立 client",
        codeBlocks: [
          {
            language: "python",
            code: `from twmarketdata import TWMarketDataClient

client = TWMarketDataClient(
    api_key="twmd_live_xxx",
    base_url="https://twmarketdata.com",
    timeout=10,
)`,
          },
        ],
      },
      {
        id: "examples",
        label: "資料查詢範例",
        paragraphs: ["先從 twse_daily_price 與 issuer_profile 兩個常用工具開始。"],
        codeBlocks: [
          {
            language: "python",
            code: `price = client.twse_daily_price(symbol="2330", limit=1)
profile = client.issuer_profile(symbol="2330")

print(price.data)
print(profile.data)`,
          },
        ],
      },
      {
        id: "metadata",
        label: "requestId 與 credits metadata",
        codeBlocks: [
          {
            language: "python",
            code: `result = client.monthly_revenue(symbol="2330", limit=12)

print(result.meta.request_id)
print(result.meta.dry_run)
print(result.meta.credits_cost)
print(result.meta.credits_charged)
print(result.meta.plan)`,
          },
        ],
      },
      {
        id: "errors",
        label: "錯誤處理",
        codeBlocks: [
          {
            language: "python",
            code: `from twmarketdata import (
    AuthenticationError,
    EntitlementError,
    InsufficientCreditsError,
    DatasetNotFoundError,
    UpstreamError,
)

try:
    result = client.technical_indicators(symbol="2330", limit=20)
except AuthenticationError:
    print("API key 無效")
except EntitlementError:
    print("目前方案未開通此 dataset")
except InsufficientCreditsError:
    print("credits 不足")
except DatasetNotFoundError:
    print("dataset 不存在")
except UpstreamError:
    print("上游服務異常")`,
          },
        ],
      },
      {
        id: "env",
        label: "環境變數",
        paragraphs: ["建議在本機與 CI 使用環境變數管理金鑰與 base URL。"],
        codeBlocks: [
          {
            language: "text",
            code: `export TWMD_API_KEY=twmd_live_xxx
export TWMD_BASE_URL=https://twmarketdata.com`,
          },
        ],
      },
    ],
  },
  {
    slug: ["sdk", "javascript-sdk"],
    href: "/docs/sdk/javascript-sdk",
    navLabel: "JavaScript / TypeScript SDK",
    category: "guides",
    icon: "braces",
    title: "JavaScript / TypeScript SDK",
    subtitle: "使用 typed fetch wrapper 呼叫台股資料 API，內建 timeout 與錯誤碼映射。",
    tier: "complete",
    sections: [
      {
        id: "install",
        label: "安裝與使用",
        codeBlocks: [
          {
            language: "text",
            code: `npm install ./packages/js-sdk`,
          },
          {
            language: "javascript",
            code: `import { TWMarketDataClient } from "@twmarketdata/sdk";

const client = new TWMarketDataClient({
  apiKey: "twmd_live_xxx",
  baseUrl: "https://twmarketdata.com",
  timeoutMs: 10000,
});`,
          },
        ],
      },
      {
        id: "fetch-wrapper",
        label: "fetch wrapper + AbortController timeout",
        paragraphs: [
          "SDK 內建 AbortController timeout，避免長時間等待上游回應造成程序卡住。",
        ],
        codeBlocks: [
          {
            language: "javascript",
            code: `const result = await client.twseDailyPrice({
  symbol: "2330",
  limit: 1,
});`,
          },
        ],
      },
      {
        id: "typescript",
        label: "TypeScript typing",
        codeBlocks: [
          {
            language: "javascript",
            code: `const valuation = await client.valuationData({
  symbol: "2330",
  limit: 5,
});

console.log(valuation.status);
console.log(valuation.meta.requestId);
console.log(valuation.meta.creditsCost);`,
          },
        ],
      },
      {
        id: "credits-and-tracing",
        label: "requestId / credits headers",
        paragraphs: [
          "SDK 會把 X-Request-Id、X-TWMD-Dry-Run、X-TWMD-Credits-Cost、X-TWMD-Credits-Charged、X-TWMD-Plan 轉成 meta。",
        ],
      },
      {
        id: "error-handling",
        label: "錯誤處理",
        codeBlocks: [
          {
            language: "javascript",
            code: `import {
  AuthenticationError,
  EntitlementError,
  InsufficientCreditsError,
  DatasetNotFoundError,
  UpstreamError,
} from "@twmarketdata/sdk";

try {
  await client.monthlyRevenue({ symbol: "2330", limit: 12 });
} catch (error) {
  if (error instanceof AuthenticationError) console.error("API key 無效");
  else if (error instanceof EntitlementError) console.error("方案權限不足");
  else if (error instanceof InsufficientCreditsError) console.error("credits 不足");
  else if (error instanceof DatasetNotFoundError) console.error("dataset 不存在");
  else if (error instanceof UpstreamError) console.error("上游服務異常");
}`,
          },
        ],
      },
    ],
  },
  {
    slug: ["ai-agents", "mcp-server-preview"],
    href: "/docs/ai-agents/mcp-server-preview",
    navLabel: "MCP Server Preview",
    category: "guides",
    icon: "advanced",
    title: "MCP Server Preview",
    subtitle: "本地 MCP server skeleton，可把台股資料查詢能力轉成 agent 可調用工具。",
    tier: "complete",
    sections: [
      {
        id: "status",
        label: "狀態",
        paragraphs: [
          "此頁對應 `packages/mcp-server`，目前為 preview / local only。",
          "尚未提供 production hosted MCP endpoint。",
        ],
      },
      {
        id: "tools",
        label: "工具清單",
        bullets: [
          "get_twse_daily_price",
          "get_tpex_daily_price",
          "get_issuer_profile",
          "get_monthly_revenue",
          "get_valuation_data",
          "get_technical_indicators",
        ],
      },
      {
        id: "local-usage",
        label: "本機使用",
        codeBlocks: [
          {
            language: "text",
            code: `cd packages/mcp-server
npm install --ignore-scripts
npm run build

TWMD_API_KEY=twmd_live_xxx \\
node dist/index.js get_twse_daily_price '{"symbol":"2330","limit":1}'`,
          },
        ],
      },
      {
        id: "env",
        label: "環境變數",
        bullets: [
          "TWMD_API_KEY（required）",
          "TWMD_BASE_URL（optional，default: https://twmarketdata.com）",
        ],
      },
      {
        id: "roadmap",
        label: "Future roadmap",
        bullets: [
          "stdio transport",
          "Cursor integration",
          "Claude integration",
          "OpenAI tools wiring",
        ],
      },
    ],
  },
  {
    slug: ["ai-agents", "tool-manifest"],
    href: "/docs/ai-agents/tool-manifest",
    navLabel: "Tool Manifest",
    category: "guides",
    icon: "advanced",
    title: "Tool Manifest",
    subtitle: "透過 ai-tools/twmd_tools.json 讓 tool calling framework 讀取可用工具與 schema。",
    tier: "complete",
    sections: [
      {
        id: "overview",
        label: "用途",
        paragraphs: [
          "`ai-tools/twmd_tools.json` 提供工具名稱、輸入 schema、endpoint mapping、required plan、credits cost 與 example prompt。",
          "可用於 OpenAI tool calling、LangChain tools 與 custom agent registry。",
        ],
      },
      {
        id: "example",
        label: "範例結構",
        codeBlocks: [
          {
            language: "text",
            code: `{
  "name": "twse_daily_price",
  "endpoint": "/v2/datasets/twse-daily-price",
  "requiredPlan": "free",
  "creditsCost": 1
}`,
          },
        ],
      },
      {
        id: "credits-aware",
        label: "credits-aware 工具使用",
        paragraphs: [
          "agent 可利用 manifest 先估算成本，再決定是否呼叫高成本資料集。",
          "正式扣點仍以 gateway 回應與 server callback 規則為準。",
        ],
      },
    ],
  },
  {
    slug: ["ai-agents", "agent-workflow-examples"],
    href: "/docs/ai-agents/agent-workflow-examples",
    navLabel: "Agent Workflow Examples",
    category: "guides",
    icon: "advanced",
    title: "Agent Workflow Examples",
    subtitle: "以 simple research workflow 展示如何組合多個 dataset 查詢並輸出結構化研究上下文。",
    tier: "complete",
    sections: [
      {
        id: "what-it-is",
        label: "這是什麼",
        paragraphs: [
          "此範例不是 AI 模型本身，而是 financial data retrieval workflow。",
          "目標是示範 agent 如何把 TW Market Data 當資料工具層。",
        ],
      },
      {
        id: "included-examples",
        label: "範例檔案",
        bullets: [
          "examples/agents/simple_research_agent.ts",
          "examples/agents/simple_research_agent.py",
        ],
      },
      {
        id: "workflow",
        label: "流程",
        bullets: [
          "讀取 TWMD_API_KEY",
          "查 issuer_profile",
          "查 twse_daily_price",
          "查 monthly_revenue",
          "輸出 structured research context",
        ],
      },
      {
        id: "traceability",
        label: "追蹤能力",
        paragraphs: [
          "每一步都可取得 requestId 與 credits metadata，方便觀測與客服追查。",
        ],
      },
      {
        id: "run-locally",
        label: "本機執行",
        codeBlocks: [
          {
            language: "text",
            code: `TWMD_API_KEY=twmd_live_xxx node examples/agents/simple_research_agent.ts
TWMD_API_KEY=twmd_live_xxx python3 examples/agents/simple_research_agent.py`,
          },
        ],
      },
    ],
  },
  {
    slug: ["support"],
    href: "/docs/support",
    navLabel: "Support",
    category: "overview",
    icon: "support",
    title: "Support",
    subtitle: "需要 API、資料覆蓋、方案或導入協助時，可以聯繫 TW Market Data 團隊。",
    tier: "complete",
    sections: [
      {
        id: "contact",
        label: "聯繫方式",
        paragraphs: [
          "若你在使用資料、串接 API、建立 agent workflow 或評估企業導入時遇到問題，請來信至：",
          "avenra.platform@gmail.com",
          "我們會依方案與導入狀態提供支援。",
        ],
      },
      {
        id: "report-details",
        label: "回報時建議附上",
        paragraphs: ["你也可以在來信中附上："],
        bullets: [
          "帳號 email",
          "使用的 endpoint",
          "request id 或錯誤訊息",
          "想查詢的 ticker / dataset",
          "預期使用情境，例如量化研究、內部資料平台或 AI agent workflow",
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
  const isStrategyQuantGroup = group.id === "strategy-quant";
  const isDatasetFactoryGroup = group.id === "dataset-factory";
  const groupPage: DocsPageEntry = {
    slug: hrefToSlug(group.href),
    href: group.href,
    navLabel: group.label,
    category: "api",
    apiSection: group.id,
    icon: group.icon,
    title: group.label,
    subtitle: "本分類收錄台股決策資料平台的正式資料主題，可直接作為 Data APIs 導覽入口。",
    tier: "complete",
    sections: isStrategyQuantGroup
      ? [
          {
            id: "group-overview",
            label: "主題導覽",
            paragraphs: [
              `${group.label}頁是主題導覽入口，不是單一 endpoint 文件頁。`,
              "請由左側子項進入各資料主題頁查看 request / response / code example。",
            ],
          },
          {
            id: "topic-structure",
            label: "主題結構",
            paragraphs: ["本分類目前包含以下主題："],
            bullets: [
              "特徵資料（/v2/datasets/features）",
              "因子資料（/v2/datasets/factor-data）",
              "時間對齊資料（/v2/datasets/time-alignment）",
              "選股器（/v2/datasets/screener）",
            ],
          },
          {
            id: "integration",
            label: "使用方式",
            paragraphs: [
              "建議先從單一主題頁完成欄位與參數驗證，再串接跨主題策略流程。",
              "若需要整體流程示例，可搭配 Workflows / Use Cases 區塊。",
            ],
          },
        ]
      : isDatasetFactoryGroup
      ? [
          {
            id: "group-overview",
            label: "Preview 概覽",
            paragraphs: [
              "Dataset Factory 文件同步自 tw-feature-engine 的 registry/catalog contracts。",
              "此區塊僅為 website docs preview，同步展示契約資訊，不代表 production route 已正式上線。",
            ],
            bullets: [
              "release_label：private_beta_preview",
              "production_ready：false（需原樣保留）",
              "not_investment_advice：true",
            ],
          },
          {
            id: "sync-guardrails",
            label: "同步守則",
            paragraphs: ["網站文件必須保留來源契約語義，不得改寫為正式商售承諾。"],
            bullets: [
              "不可移除 data_gaps 與限制敘述",
              "不可新增交易行動建議語句",
              "不可聲稱覆蓋完整或時效保證",
            ],
          },
          {
            id: "source-of-truth",
            label: "Source Of Truth",
            paragraphs: [
              "source_repo：tw-feature-engine",
              "source_manifest：docs/generated/dataset_website_sync_manifest.json",
              "llms surfaces：/llms.txt、/llms-full.txt",
            ],
          },
        ]
      : [
      {
        id: "group-overview",
        label: "分類概覽",
        paragraphs: [
          `${group.label}為 Data APIs 主分類之一，對應可辨識的資料主題與文件路由。`,
          "本分類僅收錄目前已公開文件化的主題，不將規劃中項目標示為可用能力。",
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
          "本分類內主題皆有明確 route、欄位與回應契約說明。",
          "實際可用範圍與配額以控制台方案與目前公開 API 行為為準。",
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
        apiReferenceFactory: () => buildCompanyProfileApiReference(),
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
        apiReferenceFactory: () => buildIssuerAnnouncementsApiReference(),
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
        apiReferenceFactory: () => buildFinancialMetricsApiReference(),
      };
    }

    if (topic.topicId === "monthly_revenue") {
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
        apiReferenceFactory: () => buildMonthlyRevenueApiReference(),
      };
    }

    if (topic.topicId === "valuation_data") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "估值資料",
        subtitle: "提供台股公司估值相關指標，適合用於估值篩選、相對比較與研究流程。",
        tier: "complete",
        sections: buildValuationDataApiSections(),
        apiReferenceFactory: () => buildValuationDataApiReference(),
      };
    }

    if (topic.topicId === "income_statement") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "財報（損益表）",
        subtitle: "提供公司損益表關鍵欄位，適合用於基本面分析、估值研究與策略建模。",
        tier: "complete",
        sections: buildIncomeStatementApiSections(),
        apiReferenceFactory: () => buildIncomeStatementApiReference(),
      };
    }

    if (topic.topicId === "financial_statements_product") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "財報資料",
        subtitle: "將損益表與現金流量表作為同一組產品能力，適合完整財報分析與整合流程。",
        tier: "complete",
        sections: [
          {
            id: "overview",
            label: "Overview",
            paragraphs: [
              "財報資料目前由三個 productized endpoint 組成：損益表、現金流量表與資產負債表。",
              "一般整合建議先以本頁為入口，再依分析目的分別串接三張表。",
            ],
          },
          {
            id: "endpoints",
            label: "Endpoints",
            paragraphs: [],
            bullets: [
              "損益表：/v2/datasets/income-statement",
              "現金流量表：/v2/datasets/cash-flow-statement",
              "資產負債表：/v2/datasets/balance-sheet",
            ],
          },
          {
            id: "integration",
            label: "整合建議",
            paragraphs: [
              "若要評估獲利品質，建議同時使用淨利（損益表）與營運現金流（現金流量表）。",
              "若要分析資本結構與償債能力，建議搭配資產負債表。",
              "若需要 lower-level 查詢面，可再補充使用 canonical `/v2/datasets/financials`。",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "cash_flow_statement") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "財報（現金流量表）",
        subtitle: "提供公司現金流量表關鍵欄位，適合用於現金品質分析與基本面研究。",
        tier: "complete",
        sections: buildCashFlowStatementApiSections(),
        apiReferenceFactory: () => buildCashFlowStatementApiReference(),
      };
    }

    if (topic.topicId === "balance_sheet") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "財報（資產負債表）",
        subtitle: "提供公司資產負債表關鍵欄位，適合用於資本結構、償債能力與財務穩健度分析。",
        tier: "complete",
        sections: buildBalanceSheetApiSections(),
        apiReferenceFactory: () => buildBalanceSheetApiReference(),
      };
    }

    if (topic.topicId === "financials_canonical") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "財報資料（Canonical）",
        subtitle: "canonical/supplemental 財報查詢面，適用於低階契約與資料對齊流程。",
        tier: "complete",
        sections: buildFinancialsCanonicalApiSections(),
        apiReferenceFactory: () => buildFinancialsCanonicalApiReference(),
      };
    }

    if (topic.topicId === "valuations_canonical") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "估值資料（Canonical）",
        subtitle: "canonical/supplemental 估值查詢面，適用於低階契約與資料對齊流程。",
        tier: "complete",
        sections: buildValuationsCanonicalApiSections(),
        apiReferenceFactory: () => buildValuationsCanonicalApiReference(),
      };
    }

    if (topic.topicId === "technical_indicators") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "技術指標",
        subtitle: "Technical Stage0 baseline（TWSE only / Non-TPEx），覆蓋至 2026-05-11；Stage1（RSI / MACD）尚未納入 production baseline。",
        tier: "complete",
        sections: buildTechnicalIndicatorsApiSections(),
        apiReferenceFactory: () => buildTechnicalIndicatorsApiReference(),
      };
    }

    if (topic.topicId === "index_data") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "指數資料",
        subtitle: "提供指數層級日度資料，適合市場狀態追蹤與指數研究。",
        tier: "complete",
        sections: buildIndexDataApiSections(),
        apiReferenceFactory: () => buildIndexDataApiReference(),
      };
    }

    if (topic.topicId === "market_index") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "市場指數 / Market Index",
        subtitle: "TAIEX private beta read-only endpoint（TWSE_TAIEX exact mapping only）。",
        tier: "complete",
        sections: buildMarketIndexApiSections(),
        apiReferenceFactory: () => buildMarketIndexApiReference(),
      };
    }

    if (topic.topicId === "market_breadth") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "市場廣度",
        subtitle: "提供 TWSE 漲跌家數與漲跌停欄位，協助盤勢結構監看與風險濾波。",
        tier: "complete",
        sections: buildMarketBreadthApiSections(),
        apiReferenceFactory: () => buildMarketBreadthApiReference(),
      };
    }

    if (topic.topicId === "interest_rate_snapshot") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "利率",
        subtitle: "提供台灣市場利率快照資料，適合用於折現參數設定、宏觀條件對照與研究流程。",
        tier: "complete",
        sections: buildInterestRateApiSections(),
        apiReferenceFactory: () => buildInterestRateApiReference(),
      };
    }

    if (topic.topicId === "theme_taxonomy") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "公司分類",
        subtitle: "提供 deterministic 公司分類與題材映射資料，適合分群分析與跨資料集分類對齊。",
        tier: "complete",
        sections: buildThemeTaxonomyApiSections(),
        apiReferenceFactory: () => buildThemeTaxonomyApiReference(),
      };
    }

    if (topic.topicId === "index_classification") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "指數分類",
        subtitle: "提供 deterministic 指數分類欄位，適合市場結構分析與指數維度整理。",
        tier: "complete",
        sections: buildIndexClassificationApiSections(),
        apiReferenceFactory: () => buildIndexClassificationApiReference(),
      };
    }

    if (topic.topicId === "search_api") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "搜尋 API",
        subtitle: "提供 deterministic 實體搜尋能力，支援 issuer、index、theme 三類查找。",
        tier: "complete",
        sections: buildSearchApiSections(),
        apiReferenceFactory: () => buildSearchApiReference(),
      };
    }

    if (topic.topicId === "query_api") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "查詢 API",
        subtitle: "提供 allowlist 欄位查詢能力，適合固定契約資料提取與 explainability 驗證。",
        tier: "complete",
        sections: buildQueryApiSections(),
        apiReferenceFactory: () => buildQueryApiReference(),
      };
    }

    if (topic.topicId === "query_fields") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Query Fields",
        subtitle: "提供可查詢欄位與能力清單，協助建立穩定 allowlist 流程；不等同資料集 coverage 聲明。",
        tier: "complete",
        sections: buildQueryFieldsApiSections(),
        apiReferenceFactory: () => buildQueryFieldsApiReference(),
      };
    }

    if (topic.topicId === "query_examples") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Query Examples",
        subtitle: "提供 query 範例與常見 pattern，協助快速上手；實際 coverage 以各資料集頁面為準。",
        tier: "complete",
        sections: buildQueryExamplesApiSections(),
        apiReferenceFactory: () => buildQueryExamplesApiReference(),
      };
    }

    if (topic.topicId === "market_prices_canonical") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "市場價格（Canonical）",
        subtitle: "canonical/supplemental 價格查詢面，提供跨市場的低階 envelope 契約。",
        tier: "complete",
        sections: buildMarketPricesCanonicalApiSections(),
        apiReferenceFactory: () => buildMarketPricesCanonicalApiReference(),
      };
    }

    if (topic.topicId === "adjusted_prices_canonical" || topic.topicId === "adjusted_prices") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "還原股價",
        subtitle: "提供 read-time 調整後序列，適合歷史比較與總報酬分析。",
        tier: "complete",
        sections: buildAdjustedPricesCanonicalApiSections(),
        apiReferenceFactory: () => buildAdjustedPricesCanonicalApiReference(),
      };
    }

    if (topic.topicId === "chip_flows") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "籌碼流向",
        subtitle: "提供法人與參與者拆分的籌碼流向資料，適合籌碼面分析與策略研究。",
        tier: "complete",
        sections: buildChipFlowsApiSections(),
        apiReferenceFactory: () => buildChipFlowsApiReference(),
      };
    }

    if (topic.topicId === "institutional_flow") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "法人買賣",
        subtitle: "提供三大法人的買賣超資料，適合用於資金動能分析與籌碼監控。",
        tier: "complete",
        sections: buildInstitutionalFlowApiSections(),
        apiReferenceFactory: () => buildInstitutionalFlowApiReference(),
      };
    }

    if (topic.topicId === "margin_short") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "融資融券",
        subtitle: "提供 TWSE-only private beta 融資融券資料，適合用於籌碼風險監控與市場擁擠度觀察。",
        tier: "complete",
        sections: buildMarginShortApiSections(),
        apiReferenceFactory: () => buildMarginShortApiReference(),
      };
    }

    if (topic.topicId === "total_margin_short") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "整體融資融券",
        subtitle: "提供 TWSE-only private beta 總體融資融券彙總資料，適合用於市場風險背景觀測。",
        tier: "complete",
        sections: buildTotalMarginShortApiSections(),
        apiReferenceFactory: () => buildTotalMarginShortApiReference(),
      };
    }

    if (topic.topicId === "company_news") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "公司新聞",
        subtitle: "提供公司新聞摘要資料（Preview），用於事件研究與訊息監控流程。",
        tier: "complete",
        sections: buildCompanyNewsPreviewApiSections(),
        apiReferenceFactory: () => buildCompanyNewsPreviewApiReference(),
      };
    }

    if (topic.topicId === "market_news") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "市場新聞",
        subtitle: "提供市場新聞摘要資料（Preview），用於市場狀態追蹤與研究背景補充。",
        tier: "complete",
        sections: buildMarketNewsPreviewApiSections(),
        apiReferenceFactory: () => buildMarketNewsPreviewApiReference(),
      };
    }

    if (topic.topicId === "mops_material_events") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "MOPS Material Events（Private Beta）",
        subtitle: "公開資訊觀測站重大訊息事件 metadata-only API（Private Beta，預設 disabled）。",
        tier: "placeholder",
        sections: buildMopsMaterialEventsPreviewApiSections(),
        apiReferenceFactory: () => buildMopsMaterialEventsPreviewApiReference(),
      };
    }

    if (topic.topicId === "dataset_factory_institutional_flow") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Dataset Factory / Institutional Flow（Preview）",
        subtitle: "Private beta preview 文件；內容來自 contract-generated docs，同步保留 data_gaps 與 non-production 語義。",
        tier: "complete",
        sections: [
          {
            id: "status",
            label: "狀態與定位",
            paragraphs: [
              "dataset_id：institutional_flow",
              "release_label：private_beta_preview",
              "production_ready：false",
              "not_investment_advice：true",
            ],
          },
          {
            id: "endpoint-shape",
            label: "Endpoint 與欄位摘要",
            bullets: [
              "route_path：/v2/datasets/institutional-flow",
              "schema sample：symbol、date、foreign_net_buy_sell、total_institutional_net_buy_sell",
              "coverage metadata：coverage_start / coverage_end / row_count（來源契約值）",
            ],
          },
          {
            id: "limitations",
            label: "限制與資料缺口",
            paragraphs: ["本頁為文件預覽同步，不是產品上線宣告。"],
            bullets: [
              "data_gaps 必須可見（目前為 none_declared）",
              "不得宣稱覆蓋完整或時效保證",
              "不得新增投資建議語句",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "dataset_factory_technical_indicators") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Dataset Factory / Technical Indicators（Preview）",
        subtitle: "Private beta preview 文件；來源為 contract-generated metadata，保留限制與 data_gaps。",
        tier: "complete",
        sections: [
          {
            id: "status",
            label: "狀態與定位",
            paragraphs: [
              "dataset_id：technical_indicators",
              "release_label：private_beta_preview",
              "production_ready：false",
              "not_investment_advice：true",
            ],
          },
          {
            id: "endpoint-shape",
            label: "Endpoint 與欄位摘要",
            bullets: [
              "route_path：/v2/datasets/technical-indicators",
              "schema sample：symbol、as_of_date、ma_20、rsi_14",
              "coverage metadata：coverage_start / coverage_end / row_count（來源契約值）",
            ],
          },
          {
            id: "limitations",
            label: "限制與資料缺口",
            bullets: [
              "data_gaps 必須可見（目前為 none_declared）",
              "不得宣稱正式商售上線或完整覆蓋",
              "僅可描述文件契約，不可推導未宣告能力",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "dataset_factory_valuation_data") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Dataset Factory / Valuation Data（Preview）",
        subtitle: "Private beta preview 文件；同步自 registry/catalog contracts，維持 production_ready=false。",
        tier: "complete",
        sections: [
          {
            id: "status",
            label: "狀態與定位",
            paragraphs: [
              "dataset_id：valuation_data",
              "release_label：private_beta_preview",
              "production_ready：false",
              "not_investment_advice：true",
            ],
          },
          {
            id: "endpoint-shape",
            label: "Endpoint 與欄位摘要",
            bullets: [
              "route_path：/v2/datasets/valuation-data",
              "schema sample：symbol、as_of_date、pe_ratio、pb_ratio",
              "coverage metadata：coverage_start / coverage_end / row_count（來源契約值）",
            ],
          },
          {
            id: "limitations",
            label: "限制與資料缺口",
            bullets: [
              "資料僅作資料基礎設施用途，非投資建議",
              "保留 data_gaps 透明揭露（目前為 none_declared）",
              "不得宣稱時效保證或可交易指令",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "dataset_factory_income_statement") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Dataset Factory / Income Statement（Preview）",
        subtitle: "Private beta preview 文件；同步自 contract-generated metadata，保留已驗證季度區間與資料缺口。",
        tier: "complete",
        sections: [
          {
            id: "status",
            label: "狀態與定位",
            paragraphs: [
              "dataset_id：income_statement",
              "release_label：private_beta",
              "production_ready：false",
              "not_investment_advice：true",
            ],
          },
          {
            id: "coverage",
            label: "Coverage（已驗證視窗）",
            bullets: [
              "quarter_range：2023Q2..2026Q1",
              "latest_quarter：2026Q1",
              "row_count：12268",
              "route_path：/v2/datasets/income-statement",
            ],
          },
          {
            id: "gaps",
            label: "已知資料缺口",
            paragraphs: ["data_gaps：explicitly visible in preview docs and llms outputs."],
            bullets: [
              "revenue sparse nulls：10",
              "gross_profit sparse nulls：4",
              "operating_income sparse nulls：3",
              "coverage 僅限已驗證區間，不外推歷史完整性",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "dataset_factory_balance_sheet") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Dataset Factory / Balance Sheet（Preview）",
        subtitle: "Private beta preview 文件；保留 allowlisted unresolved gap 與欄位缺值可見性。",
        tier: "complete",
        sections: [
          {
            id: "status",
            label: "狀態與定位",
            paragraphs: [
              "dataset_id：balance_sheet",
              "release_label：private_beta",
              "production_ready：false",
              "not_investment_advice：true",
            ],
          },
          {
            id: "coverage",
            label: "Coverage（已驗證視窗）",
            bullets: [
              "quarter_range：2023Q2..2026Q1",
              "latest_quarter：2026Q1",
              "row_count：12689",
              "route_path：/v2/datasets/balance-sheet",
            ],
          },
          {
            id: "gaps",
            label: "已知資料缺口",
            paragraphs: ["data_gaps：explicitly visible in preview docs and llms outputs."],
            bullets: [
              "2882/2025/Q1..Q4：unresolved allowlisted cross-source gap",
              "total_assets / total_liabilities：sparse nulls",
              "cash_and_cash_equivalents：mostly null by current contract",
              "coverage 僅限已驗證區間，不外推歷史完整性",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "dataset_factory_cash_flow") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "Dataset Factory / Cash Flow（Preview）",
        subtitle: "Private beta preview 文件；同步 current contract data_gaps 與非 production 聲明。",
        tier: "complete",
        sections: [
          {
            id: "status",
            label: "狀態與定位",
            paragraphs: [
              "dataset_id：cash_flow",
              "release_label：private_beta",
              "production_ready：false",
              "not_investment_advice：true",
            ],
          },
          {
            id: "coverage",
            label: "Coverage（已驗證視窗）",
            bullets: [
              "quarter_range：2023Q2..2026Q1",
              "latest_quarter：2026Q1",
              "row_count：12685",
              "route_path：/v2/datasets/cash-flow",
            ],
          },
          {
            id: "gaps",
            label: "已知資料缺口",
            paragraphs: ["data_gaps：explicitly visible in preview docs and llms outputs."],
            bullets: [
              "free_cash_flow：deferred-null by current contract",
              "financing_cash_flow：sparse nulls",
              "net_cash_flow：column absent by current contract",
              "coverage 僅限已驗證區間，不外推歷史完整性",
            ],
          },
        ],
      };
    }

    if (topic.topicId === "twse_daily_price") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "TWSE 日線價格",
        subtitle: "提供上市股票日線價格資料，適合用於回測、研究與事件對照流程。",
        tier: "complete",
        sections: buildTwseDailyPriceApiSections(),
        apiReferenceFactory: () => buildTwseDailyPriceApiReference(),
      };
    }

    if (topic.topicId === "tpex_daily_price") {
      return {
        slug: hrefToSlug(topic.href),
        href: topic.href,
        navLabel: topic.title,
        category: "api",
        apiSection: group.id,
        icon: topic.icon ?? group.icon,
        title: "TPEx 日線價格",
        subtitle: "提供上櫃股票日線價格資料，適合用於回測、研究與事件對照流程。",
        tier: "complete",
        sections: buildTpexDailyPriceApiSections(),
        apiReferenceFactory: () => buildTpexDailyPriceApiReference(),
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
        apiReferenceFactory: () => buildEventsCalendarApiReference(),
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
        apiReferenceFactory: () => buildStructuredEventsApiReference(),
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
        apiReferenceFactory: () => buildCorporateActionsApiReference(),
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
        apiReferenceFactory: () => buildDividendsApiReference(),
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
      subtitle: "主題頁提供 topic、資料表、文件與 route 的對照資訊。",
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
          "待資料來源與路由準備完成後，將移入正式資料主題文件。",
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
    id: "market-prices",
    label: "市場與價格",
    groupIcon: "line-chart",
    items: [
      { title: "TWSE 日線價格", href: "/docs/api/market-prices/twse-daily-price", icon: "prices", status: "production" },
      { title: "TPEx 日線價格", href: "/docs/api/market-prices/tpex-daily-price", icon: "prices", status: "preview" },
      { title: "還原股價", href: "/docs/api/market-prices/adjusted-prices", icon: "prices", status: "preview" },
      { title: "技術指標", href: "/docs/api/market-prices/technical-indicators", icon: "prices", status: "normalized" },
      { title: "市場指數 / Market Index", href: "/docs/api/market-prices/market-index", icon: "prices", status: "preview" },
      { title: "市場指數", href: "/docs/api/market-prices/index-data", icon: "prices", status: "normalized" },
      { title: "市場廣度", href: "/docs/api/market-prices/market-breadth", icon: "prices", status: "normalized" },
      { title: "利率快照", href: "/docs/api/market-prices/interest-rate", icon: "rates", status: "normalized" },
    ],
  },
  {
    id: "financial-growth",
    label: "財務與成長",
    groupIcon: "file-spreadsheet",
    items: [
      { title: "月營收", href: "/docs/api/financial-growth/monthly-revenue", icon: "metrics", status: "normalized" },
      { title: "綜合損益表", href: "/docs/api/financial-growth/income-statement", icon: "statements", status: "normalized" },
      { title: "資產負債表", href: "/docs/api/financial-growth/balance-sheet", icon: "statements", status: "normalized" },
      { title: "現金流量表", href: "/docs/api/financial-growth/cash-flow-statement", icon: "statements", status: "normalized" },
      { title: "財務比率", href: "/docs/api/financial-growth/financial-metrics", icon: "metrics", status: "normalized" },
    ],
  },
  {
    id: "capital-flow",
    label: "籌碼與資金",
    groupIcon: "landmark",
    items: [
      { title: "三大法人買賣", href: "/docs/api/capital-flow/institutional-flow", icon: "holdings", status: "normalized" },
      { title: "融資融券", href: "/docs/api/capital-flow/margin-short", icon: "holdings", status: "normalized" },
      { title: "整體融資融券", href: "/docs/api/capital-flow/total-margin-short", icon: "holdings", status: "normalized" },
      { title: "外資持股", href: "/docs/api/institutional-holdings", icon: "holdings", status: "preview" },
      { title: "借券資料", href: "/docs/api/capital-flow/margin-short", icon: "holdings", status: "normalized" },
    ],
  },
  {
    id: "company-events",
    label: "公司與事件",
    groupIcon: "building-2",
    items: [
      { title: "公司主檔 / Security Master", href: "/docs/api/company/security-master", icon: "building", status: "normalized" },
      { title: "重大訊息", href: "/docs/api/company-events/issuer-announcements", icon: "filings", status: "normalized" },
      { title: "股利與公司行動", href: "/docs/api/company-events/corporate-actions", icon: "guide", status: "normalized" },
      { title: "注意 / 處置", href: "/docs/api/preview/mops-material-events", icon: "news", status: "preview" },
    ],
  },
  {
    id: "taxonomy",
    label: "分類與結構",
    groupIcon: "network",
    items: [
      { title: "產業分類", href: "/docs/api/taxonomy/theme-taxonomy", icon: "segments", status: "normalized" },
      { title: "題材分類", href: "/docs/api/segments", icon: "segments", status: "normalized" },
      { title: "指數分類", href: "/docs/api/taxonomy/index-classification", icon: "segments", status: "normalized" },
    ],
  },
  {
    id: "strategy-quant",
    label: "策略與量化",
    groupIcon: "activity",
    items: [
      { title: "特徵資料集", href: "/docs/api/strategy-quant/features", icon: "chart", status: "normalized" },
      { title: "AI 研究訊號", href: "/docs/api/strategy-quant/factor-data", icon: "chart", status: "normalized" },
      { title: "回測資料準備", href: "/docs/api/strategy-quant/time-alignment", icon: "chart", status: "normalized" },
    ],
  },
  {
    id: "query-tools",
    label: "查詢與工具",
    groupIcon: "search-code",
    items: [
      { title: "Dataset Factory", href: "/docs/api/dataset-factory", icon: "database", status: "preview" },
      { title: "Coverage Registry", href: "/docs/market-coverage", icon: "search", status: "production" },
      { title: "Release Status", href: "/docs/sdk/release-status", icon: "braces", status: "production" },
      { title: "Query Examples", href: "/docs/api/query-tools/query-examples", icon: "braces", status: "normalized" },
    ],
  },
];

export const docsSidebarOverviewItems: DocsSidebarNavItem[] = [
  { title: "總覽", href: "/docs/introduction", icon: "book", status: "production" },
  { title: "快速開始", href: "/docs/quick-start", icon: "rocket", status: "production" },
  { title: "認證", href: "/docs/authentication", icon: "shield", status: "production" },
  { title: "來源政策", href: "/docs/source-policy", icon: "shield", status: "production" },
  { title: "資料血緣", href: "/docs/data-freshness-lineage", icon: "chart", status: "production" },
  { title: "API 模型", href: "/docs/api-model", icon: "braces", status: "production" },
  { title: "Tools / MCP", href: "/docs/tools-and-mcp", icon: "braces", status: "production" },
];

export const docsSidebarGuideItems: DocsSidebarNavItem[] = [
  { title: "查看公司基本面", href: "/docs/workflows/company-fundamentals", icon: "guide", status: "production" },
  { title: "看籌碼", href: "/docs/workflows/capital-flow", icon: "guide", status: "production" },
  { title: "看市場狀態", href: "/docs/workflows/market-status", icon: "guide", status: "production" },
  { title: "快速查資料", href: "/docs/workflows/fast-data-access", icon: "guide", status: "production" },
  { title: "做策略 / AI", href: "/docs/workflows/strategy-ai", icon: "guide", status: "production" },
];

export const docsSidebarSdkItems: DocsSidebarNavItem[] = [
  { title: "Release Status", href: "/docs/sdk/release-status", icon: "braces", status: "production" },
  { title: "Python SDK", href: "/docs/sdk/python-sdk", icon: "braces", status: "production" },
  { title: "JavaScript / TypeScript SDK", href: "/docs/sdk/javascript-sdk", icon: "braces", status: "production" },
];

export const docsSidebarAiAgentItems: DocsSidebarNavItem[] = [
  { title: "MCP Server Preview", href: "/docs/ai-agents/mcp-server-preview", icon: "advanced", status: "preview" },
  { title: "Tool Manifest", href: "/docs/ai-agents/tool-manifest", icon: "advanced", status: "preview" },
  { title: "Agent Workflow Examples", href: "/docs/ai-agents/agent-workflow-examples", icon: "advanced", status: "preview" },
];

export const docsSidebarHelpItems: DocsSidebarNavItem[] = [
  { title: "幫助中心", href: "/help-center", icon: "support", status: "production" },
];

export const docsSidebarApiGroups: DocsSidebarNavGroup[] = docsSidebarNav;

export function cleanTocTitle(title: string) {
  return title.replace(/^\s*\d+[\.\、\)]\s*/, "").trim();
}

function slugifySectionTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

export function normalizeDocsSections<T extends DocSectionLike>(sections: T[]): Array<{ id: string; label: string; raw: T }> {
  const usedIds = new Map<string, number>();

  return sections.map((section) => {
    const cleanedLabel = cleanTocTitle(section.label);
    const preferredId = (section.id ?? "").trim();
    const baseId = preferredId || slugifySectionTitle(cleanedLabel) || "section";
    const duplicateIndex = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, duplicateIndex + 1);
    const resolvedId = duplicateIndex === 0 ? baseId : `${baseId}-${duplicateIndex + 1}`;

    return {
      id: resolvedId,
      label: cleanedLabel || section.label,
      raw: section,
    };
  });
}

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
  const slugKey = slug.join("/");
  const page = docsPages.find((entry) => entry.slug.join("/") === slugKey);
  if (!page) return undefined;

  if (page.apiReference || !page.apiReferenceFactory) {
    return page;
  }

  const cached = resolvedDocsPageCache.get(slugKey);
  if (cached) {
    return cached;
  }

  const resolvedPage: DocsPageEntry = {
    ...page,
    apiReference: page.apiReferenceFactory(),
  };
  resolvedDocsPageCache.set(slugKey, resolvedPage);
  return resolvedPage;
}

const resolvedDocsPageCache = new Map<string, DocsPageEntry>();
