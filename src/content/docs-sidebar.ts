import type { AppLocale } from "@/src/i18n/locales";

// Projected shapes consumed by the docs shell (a single locale resolved at render time).
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

// Structured content data (spec §1.6): both languages live on the record; getDocsSidebar() projects
// the locale at render time (mirrors mega-menu-links.ts). hrefs/ids are locale-agnostic — the
// locale-aware <Link> adds the prefix. English falls back to zh only if an EN string is empty.
export type DocsSidebarNavItemSource = {
  title: string;
  titleEn: string;
  href: string;
  children?: DocsSidebarNavItemSource[];
};

export type DocsSidebarNavGroupSource = {
  id: string;
  label: string;
  labelEn: string;
  groupIcon: DocsSidebarNavGroup["groupIcon"];
  items: DocsSidebarNavItemSource[];
};

export const docsSidebarApiGroups: DocsSidebarNavGroupSource[] = [
  {
    id: "market-prices",
    label: "市場與價格",
    labelEn: "Market & prices",
    groupIcon: "line-chart",
    items: [
      { title: "TWSE 日線價格", titleEn: "TWSE daily price", href: "/docs/api/market-prices/twse-daily-price" },
      { title: "TPEx 日線價格", titleEn: "TPEx daily price", href: "/docs/api/market-prices/tpex-daily-price" },
      { title: "還原股價", titleEn: "Adjusted prices", href: "/docs/api/market-prices/adjusted-prices" },
      { title: "技術指標", titleEn: "Technical indicators", href: "/docs/api/market-prices/technical-indicators" },
      { title: "市場指數 / Market Index", titleEn: "Market Index", href: "/docs/api/market-prices/market-index" },
      { title: "報酬指數 / Return Index Daily", titleEn: "Return Index Daily", href: "/docs/api/market-prices/return-index-daily" },
      { title: "市場指數", titleEn: "Index data", href: "/docs/api/market-prices/index-data" },
      { title: "市場廣度", titleEn: "Market breadth", href: "/docs/api/market-prices/market-breadth" },
      { title: "利率快照", titleEn: "Interest rate snapshot", href: "/docs/api/market-prices/interest-rate" },
    ],
  },
  {
    id: "financial-growth",
    label: "財務與成長",
    labelEn: "Financials & growth",
    groupIcon: "file-spreadsheet",
    items: [
      { title: "月營收", titleEn: "Monthly revenue", href: "/docs/api/financial-growth/monthly-revenue" },
      { title: "綜合損益表", titleEn: "Income statement", href: "/docs/api/financial-growth/income-statement" },
      { title: "資產負債表", titleEn: "Balance sheet", href: "/docs/api/financial-growth/balance-sheet" },
      { title: "現金流量表", titleEn: "Cash flow statement", href: "/docs/api/financial-growth/cash-flow-statement" },
      { title: "財務比率", titleEn: "Financial ratios", href: "/docs/api/financial-growth/financial-metrics" },
    ],
  },
  {
    id: "capital-flow",
    label: "籌碼與資金",
    labelEn: "Flows & positioning",
    groupIcon: "landmark",
    items: [
      { title: "三大法人買賣", titleEn: "Institutional trades", href: "/docs/api/capital-flow/institutional-flow" },
      { title: "融資融券", titleEn: "Margin & short", href: "/docs/api/capital-flow/margin-short" },
      { title: "整體融資融券", titleEn: "Total margin & short", href: "/docs/api/capital-flow/total-margin-short" },
      { title: "外資持股", titleEn: "Foreign holdings", href: "/docs/api/institutional-holdings" },
      { title: "借券資料", titleEn: "Securities lending", href: "/docs/api/capital-flow/securities-lending" },
    ],
  },
  {
    id: "company-events",
    label: "公司與事件",
    labelEn: "Company & events",
    groupIcon: "building-2",
    items: [
      { title: "公司主檔 / Security Master", titleEn: "Security Master", href: "/docs/api/company/security-master" },
      { title: "重大訊息", titleEn: "Material announcements", href: "/docs/api/company-events/issuer-announcements" },
      { title: "股利與公司行動", titleEn: "Dividends & corporate actions", href: "/docs/api/company-events/corporate-actions" },
      { title: "注意 / 處置", titleEn: "Alert / disposition", href: "/docs/api/preview/mops-material-events" },
    ],
  },
  {
    id: "query-tools",
    label: "查詢與工具",
    labelEn: "Query & tools",
    groupIcon: "search-code",
    items: [
      { title: "Dataset Factory", titleEn: "Dataset Factory", href: "/docs/api/dataset-factory" },
      { title: "Coverage Registry", titleEn: "Coverage Registry", href: "/docs/market-coverage" },
      { title: "Release Status", titleEn: "Release Status", href: "/docs/sdk/release-status" },
    ],
  },
];

export const docsSidebarOverviewItems: DocsSidebarNavItemSource[] = [
  { title: "總覽", titleEn: "Overview", href: "/docs/introduction" },
  { title: "快速開始", titleEn: "Quick start", href: "/docs/quick-start" },
  { title: "認證", titleEn: "Authentication", href: "/docs/authentication" },
  { title: "來源政策", titleEn: "Source policy", href: "/docs/source-policy" },
  { title: "資料血緣", titleEn: "Data lineage", href: "/docs/data-freshness-lineage" },
  { title: "API 模型", titleEn: "API model", href: "/docs/api-model" },
  { title: "Tools / MCP", titleEn: "Tools / MCP", href: "/docs/tools-and-mcp" },
];

export const docsSidebarGuideItems: DocsSidebarNavItemSource[] = [
  { title: "查看公司基本面", titleEn: "Company fundamentals", href: "/docs/workflows/company-fundamentals" },
  { title: "看籌碼", titleEn: "Capital flow", href: "/docs/workflows/capital-flow" },
  { title: "看市場狀態", titleEn: "Market status", href: "/docs/workflows/market-status" },
  { title: "快速查資料", titleEn: "Fast data access", href: "/docs/workflows/fast-data-access" },
  { title: "做策略 / AI", titleEn: "Strategy / AI", href: "/docs/workflows/strategy-ai" },
];

export const docsSidebarSdkItems: DocsSidebarNavItemSource[] = [
  { title: "Release Status", titleEn: "Release Status", href: "/docs/sdk/release-status" },
  { title: "Python SDK", titleEn: "Python SDK", href: "/docs/sdk/python-sdk" },
  { title: "JavaScript / TypeScript SDK", titleEn: "JavaScript / TypeScript SDK", href: "/docs/sdk/javascript-sdk" },
];

export const docsSidebarAiAgentItems: DocsSidebarNavItemSource[] = [
  { title: "MCP Server Preview", titleEn: "MCP Server Preview", href: "/docs/ai-agents/mcp-server-preview" },
  { title: "Tool Manifest", titleEn: "Tool Manifest", href: "/docs/ai-agents/tool-manifest" },
  { title: "Agent Workflow Examples", titleEn: "Agent Workflow Examples", href: "/docs/ai-agents/agent-workflow-examples" },
];

export const docsSidebarHelpItems: DocsSidebarNavItemSource[] = [
  { title: "幫助中心", titleEn: "Help center", href: "/help-center" },
];

function projectItem(item: DocsSidebarNavItemSource, en: boolean): DocsSidebarNavItem {
  return {
    title: en ? item.titleEn || item.title : item.title,
    href: item.href,
    ...(item.children?.length
      ? { children: item.children.map((child) => projectItem(child, en)) }
      : {}),
  };
}

function projectGroup(group: DocsSidebarNavGroupSource, en: boolean): DocsSidebarNavGroup {
  return {
    id: group.id,
    label: en ? group.labelEn || group.label : group.label,
    groupIcon: group.groupIcon,
    items: group.items.map((item) => projectItem(item, en)),
  };
}

export type DocsSidebar = {
  apiGroups: DocsSidebarNavGroup[];
  overviewItems: DocsSidebarNavItem[];
  guideItems: DocsSidebarNavItem[];
  sdkItems: DocsSidebarNavItem[];
  aiAgentItems: DocsSidebarNavItem[];
  helpItems: DocsSidebarNavItem[];
};

// Project the whole docs sidebar into a single locale (mirrors getProductMegaMenuColumns).
export function getDocsSidebar(locale: AppLocale): DocsSidebar {
  const en = locale === "en";
  return {
    apiGroups: docsSidebarApiGroups.map((group) => projectGroup(group, en)),
    overviewItems: docsSidebarOverviewItems.map((item) => projectItem(item, en)),
    guideItems: docsSidebarGuideItems.map((item) => projectItem(item, en)),
    sdkItems: docsSidebarSdkItems.map((item) => projectItem(item, en)),
    aiAgentItems: docsSidebarAiAgentItems.map((item) => projectItem(item, en)),
    helpItems: docsSidebarHelpItems.map((item) => projectItem(item, en)),
  };
}

function getFirstLeafHref(item: DocsSidebarNavItemSource): string | null {
  if (!item.children?.length) {
    return item.href;
  }

  for (const child of item.children) {
    const href = getFirstLeafHref(child);
    if (href) return href;
  }

  return null;
}

function findSidebarItemByHref(items: DocsSidebarNavItemSource[], href: string): DocsSidebarNavItemSource | null {
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
