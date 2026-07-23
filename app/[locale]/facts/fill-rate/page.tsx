import type { Metadata } from "next";

import {
  FactsStatPage,
  factsStatMetadata,
  fmt,
  type FactsStatPageConfig,
} from "@/src/components/facts/facts-stat-page";

const config: FactsStatPageConfig = {
  pageSlug: "fill-rate",
  endpointSlug: "fill-rate",
  jsonLdName: { en: "Taiwan dividend fill rate", zh: "台股填息基率" },
  title: {
    en: "Taiwan dividend fill rate",
    zh: "台股填息基率",
  },
  intro: {
    en: "The share of ex-dividend events in the Taiwan market that closed the price gap ('filled') within 5, 10, 20, and 60 trading days, grouped into dividend-yield buckets. Descriptive statistics only, not a forecast.",
    zh: "台股除息事件在 5、10、20、60 個交易日內完成填息的比例,依殖利率分層統計。純描述統計,非預測。",
  },
  methodologyEn:
    "A dividend is 'filled' when the post-ex closing price returns to at least the pre-ex close; N is measured in trading days; implied yield = (pre-ex close − ex reference price) / pre-ex close; the fill window is 95 calendar days.",
  coverageEn:
    "From price-adjustment-factor items, 2004 onward (~22 years); includes a small number of combined rights-and-dividend events.",
  columns: [
    { source: "dimension", key: "yield_bucket", label: { en: "Yield bucket", zh: "殖利率區間" } },
    { source: "metrics", key: "fill_5d", label: { en: "5-day", zh: "5 日" }, align: "right", format: fmt.pct1 },
    { source: "metrics", key: "fill_10d", label: { en: "10-day", zh: "10 日" }, align: "right", format: fmt.pct1 },
    { source: "metrics", key: "fill_20d", label: { en: "20-day", zh: "20 日" }, align: "right", format: fmt.pct1 },
    { source: "metrics", key: "fill_60d", label: { en: "60-day", zh: "60 日" }, align: "right", format: fmt.pct1 },
    { source: "metrics", key: "n_events", label: { en: "Events", zh: "事件數" }, align: "right", format: fmt.int },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return factsStatMetadata(config, locale);
}

export default function FillRatePage() {
  return <FactsStatPage config={config} />;
}
