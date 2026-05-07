export type ProductMegaMenuItem = {
  title: string;
  description: string;
  href: string;
};

export type ProductMegaMenuColumn = {
  title: string;
  items: ProductMegaMenuItem[];
};

export const productMegaMenuColumns: ProductMegaMenuColumn[] = [
  {
    title: "核心資料",
    items: [
      {
        title: "市場與價格",
        description: "TWSE / TPEx 日線、還原價格、指數與市場廣度",
        href: "/docs/api/market-prices/twse-daily-price",
      },
      {
        title: "財務與成長",
        description: "月營收、財報三表、財務指標與估值資料",
        href: "/docs/api/financial-growth/monthly-revenue",
      },
      {
        title: "籌碼與資金",
        description: "三大法人與融資融券資料",
        href: "/docs/api/capital-flow/institutional-flow",
      },
    ],
  },
  {
    title: "公司與結構",
    items: [
      {
        title: "公司與事件",
        description: "公司基本資料、公告、事件、公司行動與股利",
        href: "/docs/api/company/issuer-profile",
      },
      {
        title: "分類與結構",
        description: "主題分類、指數分類與跨資料集 mapping",
        href: "/docs/api/taxonomy/theme-taxonomy",
      },
      {
        title: "策略與量化",
        description: "Features、Factor Data、Time Alignment 與 Screener",
        href: "/docs/api/strategy-quant/features",
      },
    ],
  },
  {
    title: "平台能力",
    items: [
      {
        title: "API 存取",
        description: "REST API、認證與第一個 request",
        href: "/docs/quick-start",
      },
      {
        title: "查詢與工具",
        description: "Search API、Query API、欄位清單與查詢範例",
        href: "/docs/api/query-tools/search-api",
      },
      {
        title: "Tools / MCP",
        description: "Agent workflow、MCP tools 與 OpenAPI 入口",
        href: "/docs/tools-and-mcp",
      },
    ],
  },
];
