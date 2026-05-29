export type DocsSidebarNavItem = {
  title: string;
  href: string;
  children?: DocsSidebarNavItem[];
};

export type DocsSidebarNavGroup = {
  id: string;
  label: string;
  groupIcon:
    | "line-chart"
    | "file-spreadsheet"
    | "landmark"
    | "building-2"
    | "network"
    | "activity"
    | "search-code"
    | "book-open";
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
      { title: "綜合損益表", href: "/docs/api/financial-growth/income-statement" },
      { title: "資產負債表", href: "/docs/api/financial-growth/balance-sheet" },
      { title: "現金流量表", href: "/docs/api/financial-growth/cash-flow-statement" },
      { title: "財務比率", href: "/docs/api/financial-growth/financial-metrics" },
    ],
  },
  {
    id: "capital-flow",
    label: "籌碼與資金",
    groupIcon: "landmark",
    items: [
      { title: "三大法人買賣", href: "/docs/api/capital-flow/institutional-flow" },
      { title: "融資融券", href: "/docs/api/capital-flow/margin-short" },
      { title: "外資持股", href: "/docs/api/institutional-holdings" },
      { title: "借券資料", href: "/docs/api/capital-flow/margin-short" },
    ],
  },
  {
    id: "company-events",
    label: "公司與事件",
    groupIcon: "building-2",
    items: [
      { title: "公司主檔 / Security Master", href: "/docs/api/company/issuer-profile" },
      { title: "重大訊息", href: "/docs/api/company-events/issuer-announcements" },
      { title: "股利與公司行動", href: "/docs/api/company-events/corporate-actions" },
      { title: "注意 / 處置", href: "/docs/api/preview/mops-material-events" },
    ],
  },
  {
    id: "taxonomy",
    label: "分類與結構",
    groupIcon: "network",
    items: [
      { title: "產業分類", href: "/docs/api/taxonomy/theme-taxonomy" },
      { title: "題材分類", href: "/docs/api/segments" },
      { title: "指數成分", href: "/docs/api/taxonomy/index-classification" },
    ],
  },
  {
    id: "strategy-quant",
    label: "策略與量化",
    groupIcon: "activity",
    items: [
      { title: "特徵資料集", href: "/docs/api/strategy-quant/features" },
      { title: "AI 研究訊號", href: "/docs/api/strategy-quant/factor-data" },
      { title: "回測資料準備", href: "/docs/api/strategy-quant/time-alignment" },
    ],
  },
  {
    id: "query-tools",
    label: "查詢與工具",
    groupIcon: "book-open",
    items: [
      { title: "Dataset Factory", href: "/docs/api/dataset-factory" },
      { title: "Coverage Registry", href: "/docs/market-coverage" },
      { title: "Release Status", href: "/docs/sdk/release-status" },
      { title: "Query Examples", href: "/docs/api/query-tools/query-examples" },
    ],
  },
];

export const docsSidebarOverviewItems: DocsSidebarNavItem[] = [
  { title: "總覽", href: "/docs/introduction" },
  { title: "快速開始", href: "/docs/quick-start" },
  { title: "認證", href: "/docs/authentication" },
  { title: "來源政策", href: "/docs/source-policy" },
  { title: "資料血緣", href: "/docs/data-freshness-lineage" },
  { title: "API 模型", href: "/docs/api-model" },
  { title: "Tools / MCP", href: "/docs/tools-and-mcp" },
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

export const docsSidebarHelpItems: DocsSidebarNavItem[] = [
  { title: "幫助中心", href: "/help-center" },
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
