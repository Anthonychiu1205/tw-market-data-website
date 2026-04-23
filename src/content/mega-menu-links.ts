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
      { title: "行情資料", description: "台股日線與歷史價格資料", href: "/docs/api/market-prices/price-data" },
      { title: "還原價格", description: "事件調整後的價格序列", href: "/docs/api/company-events/corporate-actions" },
      { title: "基本面資料", description: "月營收、財報與估值資料", href: "/docs/workflows/company-fundamentals" },
    ],
  },
  {
    title: "事件與籌碼",
    items: [
      { title: "公司事件", description: "股利、減資、增資等事件資料", href: "/docs/api/company-events/issuer-announcements" },
      { title: "籌碼流向", description: "法人與市場籌碼變化", href: "/docs/api/capital-flow/institutional-flow" },
      { title: "融資融券", description: "融資、融券與借券資料", href: "/docs/api/capital-flow/margin-short" },
    ],
  },
  {
    title: "平台能力",
    items: [
      { title: "API 存取", description: "REST API 與驗證方式", href: "/docs/authentication" },
      { title: "用量與配額", description: "請求限制與使用統計", href: "/docs/advanced/rate-limits" },
      { title: "資料來源與可追溯", description: "來源、lineage 與資料一致性", href: "/docs/data-freshness-lineage" },
    ],
  },
];
