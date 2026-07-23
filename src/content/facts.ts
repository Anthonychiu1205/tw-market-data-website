// Market Facts (統計資料室) — the single source of truth for the /facts statistics section index.
// Each topic is a pipeline-fed public mini data-product (NOT an article): its page's numbers are
// generated from a real API/table at build time, never hand-filled. A topic is only `published` once
// its data source has been confirmed queryable (audit-first) — until then the overview lists it as
// "coming soon" (non-linked), so the section never points at a page that does not exist yet.

export type FactsTopic = {
  slug: string;
  title: { en: string; zh: string };
  /** One-line description of what the page reports — coverage-honest, no statistics stated here. */
  blurb: { en: string; zh: string };
  /** Update cadence / coverage window shown on the card (kept truthful, e.g. seasonality is ~2003+). */
  coverage: { en: string; zh: string };
  /** false → listed as "coming soon" (non-linked) until the /facts/<slug> page ships. */
  published: boolean;
};

export const factsTopics: readonly FactsTopic[] = [
  {
    slug: "rules-history",
    title: { en: "Rules history", zh: "制度沿革" },
    blurb: {
      en: "A human-readable timeline of Taiwan market rule changes: price limits, day trading, intraday odd-lot, and tick sizing.",
      zh: "台股制度變更的人讀時間軸:漲跌幅、當沖、盤中零股與 tick 規則的沿革。",
    },
    coverage: { en: "Updated per rule revision", zh: "隨制度版本更新" },
    published: true,
  },
  {
    slug: "seasonality",
    title: { en: "Monthly seasonality", zh: "月度季節性" },
    blurb: {
      en: "Month-by-month market statistics: average return, share of up-years, and volume distribution.",
      zh: "台股逐月統計:各月平均報酬、上漲年比例與量能分布。",
    },
    coverage: { en: "From ~2003", zh: "約 2003 年起" },
    published: false,
  },
  {
    slug: "delisting",
    // Scope is deliberately narrow: annual delisting counts only. Reason breakdown and listing-tenure
    // are NOT sourced yet, so they are omitted rather than approximated (the page's methodology says so).
    title: { en: "Delistings per year", zh: "歷年下市家數" },
    blurb: {
      en: "Delisted-company counts by year across the market. Reason breakdown and listing tenure are not sourced yet, so they are omitted.",
      zh: "全市場歷年下市家數。原因分布與上市年限:源未提供,暫不列。",
    },
    coverage: { en: "Quarterly", zh: "季更" },
    published: false,
  },
  {
    slug: "fill-rate",
    title: { en: "Dividend fill rate", zh: "填息基率" },
    blurb: {
      en: "The share of ex-dividend events that close the price gap within N days, in five dividend-yield layers.",
      zh: "全市場除息後 N 日填息率,依殖利率分五層統計。",
    },
    coverage: { en: "From 2004", zh: "2004 年起" },
    published: false,
  },
];
