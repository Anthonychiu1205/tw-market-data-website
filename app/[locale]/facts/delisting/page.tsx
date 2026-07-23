import type { Metadata } from "next";

import {
  FactsStatPage,
  factsStatMetadata,
  fmt,
  type FactsStatPageConfig,
} from "@/src/components/facts/facts-stat-page";

const config: FactsStatPageConfig = {
  pageSlug: "delisting",
  endpointSlug: "delisting-yearly",
  jsonLdName: { en: "Taiwan delistings per year", zh: "台股歷年下市家數" },
  title: {
    en: "Taiwan delistings per year",
    zh: "台股歷年下市家數",
  },
  intro: {
    en: "The number of companies delisted from the Taiwan market each year since 2001. Counts only — reason breakdown and listing tenure are not sourced. Descriptive statistics only, not a forecast.",
    zh: "台股自 2001 年起每年下市(終止上市)的公司家數。僅家數——原因分布與上市年限未取源。純描述統計,非預測。",
  },
  methodologyEn: "Count of companies whose delisting date falls in each calendar year.",
  coverageEn:
    "Annual delisting counts, 2001–2026 (source: delisting lifecycle records). Reason breakdown is not built (the source field is entirely NULL) and listing tenure is not included — these are omitted rather than approximated.",
  columns: [
    // Year is a plain identifier — no thousands separator (default String render).
    { source: "dimension", key: "year", label: { en: "Year", zh: "年份" } },
    { source: "metrics", key: "delist_count", label: { en: "Delistings", zh: "下市家數" }, align: "right", format: fmt.int },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return factsStatMetadata(config, locale);
}

export default function DelistingPage() {
  return <FactsStatPage config={config} />;
}
