export type DocsSidebarNavItem = {
  title: string;
  href: string;
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

export const docsSidebarApiGroups: DocsSidebarNavGroup[] = [
  {
    id: "market-prices",
    label: "市場與價格",
    groupIcon: "line-chart",
    items: [
      { title: "TWSE 日線價格", href: "/docs/api/market-prices/twse-daily-price" },
      { title: "TPEx 日線價格", href: "/docs/api/market-prices/tpex-daily-price" },
      { title: "還原股價", href: "/docs/api/market-prices/adjusted-prices" },
      { title: "技術指標", href: "/docs/api/market-prices/technical-indicators" },
      { title: "市場指數", href: "/docs/api/market-prices/index-data" },
      { title: "市場廣度", href: "/docs/api/market-prices/market-breadth" },
      { title: "利率快照", href: "/docs/api/market-prices/interest-rate" },
    ],
  },
  {
    id: "financial-growth",
    label: "財務與成長",
    groupIcon: "file-spreadsheet",
    items: [
      { title: "月營收", href: "/docs/api/financial-growth/monthly-revenue" },
      { title: "損益表", href: "/docs/api/financial-growth/income-statement" },
      { title: "資產負債表", href: "/docs/api/financial-growth/balance-sheet" },
      { title: "現金流量表", href: "/docs/api/financial-growth/cash-flow-statement" },
      { title: "財務指標", href: "/docs/api/financial-growth/financial-metrics" },
      { title: "估值資料", href: "/docs/api/financial-growth/valuation-data" },
    ],
  },
  {
    id: "capital-flow",
    label: "籌碼與資金",
    groupIcon: "landmark",
    items: [
      { title: "三大法人", href: "/docs/api/capital-flow/institutional-flow" },
      { title: "融資融券", href: "/docs/api/capital-flow/margin-short" },
    ],
  },
  {
    id: "company-events",
    label: "公司與事件",
    groupIcon: "building-2",
    items: [
      { title: "公司基本資料", href: "/docs/api/company/issuer-profile" },
      { title: "公司公告", href: "/docs/api/company-events/issuer-announcements" },
      { title: "事件日曆", href: "/docs/api/company-events/events-calendar" },
      { title: "結構化事件", href: "/docs/api/company-events/structured-events" },
      { title: "公司行動", href: "/docs/api/company-events/corporate-actions" },
      { title: "股利", href: "/docs/api/company-events/dividends" },
    ],
  },
  {
    id: "taxonomy",
    label: "分類與結構",
    groupIcon: "network",
    items: [
      { title: "主題分類", href: "/docs/api/taxonomy/theme-taxonomy" },
      { title: "指數分類", href: "/docs/api/taxonomy/index-classification" },
    ],
  },
  {
    id: "strategy-quant",
    label: "策略與量化",
    groupIcon: "activity",
    items: [
      { title: "特徵資料", href: "/docs/api/strategy-quant/features" },
      { title: "因子資料", href: "/docs/api/strategy-quant/factor-data" },
      { title: "時間對齊", href: "/docs/api/strategy-quant/time-alignment" },
      { title: "條件篩選", href: "/docs/api/strategy-quant/screener" },
    ],
  },
  {
    id: "query-tools",
    label: "查詢與工具",
    groupIcon: "search-code",
    items: [
      { title: "搜尋 API", href: "/docs/api/query-tools/search-api" },
      { title: "查詢 API", href: "/docs/api/query-tools/query-api" },
      { title: "查詢欄位", href: "/docs/api/query-tools/query-fields" },
      { title: "查詢範例", href: "/docs/api/query-tools/query-examples" },
    ],
  },
  {
    id: "preview",
    label: "預覽",
    groupIcon: "eye",
    items: [
      { title: "公司新聞", href: "/docs/api/preview/company-news" },
      { title: "市場新聞", href: "/docs/api/preview/market-news" },
    ],
  },
];

export const docsSidebarOverviewItems: DocsSidebarNavItem[] = [
  { title: "總覽", href: "/docs/introduction" },
  { title: "快速開始", href: "/docs/quick-start" },
  { title: "認證", href: "/docs/authentication" },
  { title: "來源政策", href: "/docs/source-policy" },
  { title: "資料血緣", href: "/docs/data-freshness-lineage" },
];

export const docsSidebarIntegrationItems: DocsSidebarNavItem[] = [
  { title: "API 模型", href: "/docs/api-model" },
  { title: "OpenAPI 規格", href: "/docs/openapi-spec" },
  { title: "Tools / MCP", href: "/docs/tools-and-mcp" },
];

export const docsSidebarSupportItems: DocsSidebarNavItem[] = [
  { title: "Support", href: "/docs/support" },
  { title: "幫助中心", href: "/help" },
];

export const docsSidebarGuideItems: DocsSidebarNavItem[] = [
  { title: "查看公司基本面", href: "/docs/workflows/company-fundamentals" },
  { title: "看籌碼", href: "/docs/workflows/capital-flow" },
  { title: "看市場狀態", href: "/docs/workflows/market-status" },
  { title: "快速查資料", href: "/docs/workflows/fast-data-access" },
  { title: "做策略 / AI", href: "/docs/workflows/strategy-ai" },
];

export const docsSidebarSdkItems: DocsSidebarNavItem[] = [
  { title: "Release Status", href: "/docs/sdk/release-status" },
  { title: "Python SDK", href: "/docs/sdk/python-sdk" },
  { title: "JavaScript / TypeScript SDK", href: "/docs/sdk/javascript-sdk" },
];

export const docsSidebarAiAgentItems: DocsSidebarNavItem[] = [
  { title: "MCP Server Preview", href: "/docs/ai-agents/mcp-server-preview" },
  { title: "Tool Manifest", href: "/docs/ai-agents/tool-manifest" },
  { title: "Agent Workflow Examples", href: "/docs/ai-agents/agent-workflow-examples" },
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
  for (const group of docsSidebarApiGroups) {
    const item = findSidebarItemByHref(group.items, href);
    if (!item || !item.children?.length) continue;

    const firstLeafHref = getFirstLeafHref(item);
    if (firstLeafHref && firstLeafHref !== item.href) {
      return firstLeafHref;
    }
  }

  return null;
}
