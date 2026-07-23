import type { AppLocale } from "@/src/i18n/locales";

// Structured content data (spec §1.6): both languages live on the record; a selector projects the
// locale at render time. hrefs are locale-agnostic — the locale-aware <Link> adds the prefix.
type MegaMenuItemSource = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  href: string;
};

type MegaMenuColumnSource = {
  title: string;
  titleEn: string;
  items: MegaMenuItemSource[];
};

export type ProductMegaMenuItem = {
  title: string;
  description: string;
  href: string;
};

export type ProductMegaMenuColumn = {
  title: string;
  items: ProductMegaMenuItem[];
};

const megaMenuSource: MegaMenuColumnSource[] = [
  {
    title: "核心資料",
    titleEn: "Core data",
    items: [
      {
        title: "市場與價格",
        titleEn: "Market & prices",
        description: "TWSE / TPEx 日線、還原價格、指數與市場廣度",
        descriptionEn: "TWSE / TPEx daily bars, adjusted prices, indices, and market breadth",
        href: "/docs/api/market-prices/twse-daily-price",
      },
      {
        title: "財務與成長",
        titleEn: "Financials & growth",
        description: "月營收、財報三表、財務指標與估值資料",
        descriptionEn:
          "Monthly revenue, the three financial statements, financial metrics, and valuation data",
        href: "/docs/api/financial-growth/monthly-revenue",
      },
      {
        title: "籌碼與資金",
        titleEn: "Flows & positioning",
        description: "三大法人與融資融券資料",
        descriptionEn: "Institutional investors and margin & short-selling data",
        href: "/docs/api/capital-flow/institutional-flow",
      },
    ],
  },
  {
    title: "公司與結構",
    titleEn: "Company & structure",
    items: [
      {
        title: "公司與事件",
        titleEn: "Company & events",
        description: "公司基本資料、公告、事件、公司行動與股利",
        descriptionEn: "Company profiles, disclosures, events, corporate actions, and dividends",
        href: "/docs/api/company/issuer-profile",
      },
      {
        title: "分類與結構",
        titleEn: "Taxonomy & structure",
        description: "主題分類、指數分類與跨資料集 mapping",
        descriptionEn: "Theme taxonomy, index classification, and cross-dataset mapping",
        href: "/docs/api/structure-reference/theme-taxonomy",
      },
      {
        title: "策略與量化",
        titleEn: "Strategy & quant",
        description: "Features、Factor Data、Time Alignment 與 Screener",
        descriptionEn: "Features, factor data, time alignment, and screener",
        href: "/docs/api/structure-reference/factor-library",
      },
    ],
  },
  {
    title: "平台能力",
    titleEn: "Platform capabilities",
    items: [
      {
        title: "API 存取",
        titleEn: "API access",
        description: "REST API、認證與第一個 request",
        descriptionEn: "REST API, authentication, and your first request",
        href: "/docs/quick-start",
      },
      {
        title: "查詢與工具",
        titleEn: "Query & tools",
        description: "Search API、Query API、欄位清單與查詢範例",
        descriptionEn: "Search API, Query API, field lists, and query examples",
        href: "/docs/api/query-tools/search-api",
      },
      {
        title: "Tools / MCP",
        titleEn: "Tools / MCP",
        description: "Agent workflow、MCP tools 與 OpenAPI 入口",
        descriptionEn: "Agent workflows, MCP tools, and the OpenAPI entry point",
        href: "/docs/tools-and-mcp",
      },
    ],
  },
];

// Project the mega-menu into a single locale. English falls back to zh only if an EN string is empty
// (never happens here) — coverage is complete.
export function getProductMegaMenuColumns(locale: AppLocale): ProductMegaMenuColumn[] {
  const en = locale === "en";
  return megaMenuSource.map((column) => ({
    title: en ? column.titleEn : column.title,
    items: column.items.map((item) => ({
      title: en ? item.titleEn : item.title,
      description: en ? item.descriptionEn : item.description,
      href: item.href,
    })),
  }));
}
