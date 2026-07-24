import type { Metadata } from "next";

import {
  FactsStatPage,
  factsStatMetadata,
  fmt,
  type FactsStatPageConfig,
} from "@/src/components/facts/facts-stat-page";

const config: FactsStatPageConfig = {
  pageSlug: "limit-events",
  endpointSlug: "limit-events",
  jsonLdName: { en: "Taiwan limit-up / limit-down events per year", zh: "台股歷年漲跌停家數" },
  title: {
    en: "Taiwan limit-up / limit-down events per year",
    zh: "台股歷年漲跌停家數",
  },
  intro: {
    en: "How many stocks closed locked at their daily price limit each year — up versus down — since 2004, with the up-share and up/down ratio. Limit hits are detected from the era's price-limit band, not an official confirmed flag. Descriptive statistics only, not a forecast.",
    zh: "台股逐年收盤鎖住漲跌停的個股家數(漲對跌),2004 年起,含漲停占比與漲跌停比。漲跌停以各時期漲跌幅帶偵測,非官方確認旗標。純描述統計,非預測。",
  },
  methodologyEn:
    "Count of stocks that closed locked at their daily price limit, tallied by trading calendar year and split into up and down (with the TWSE / TPEx breakdown in the CSV). Limit hits are DETECTED using the price-limit band in force each era (±7% before 2015-06-01, ±10% after) — an approximate method, not an official confirmed flag.",
  coverageEn:
    "From 2004 (pre-2004 excluded: the TWSE price spine starts in 2004 and earlier years are TPEx-only and incomplete). Grade: approximate — detected via era bands, not officially confirmed.",
  columns: [
    { source: "dimension", key: "year", label: { en: "Year", zh: "年份" } },
    { source: "metrics", key: "limit_up", label: { en: "Limit-up", zh: "漲停家數" }, align: "right", format: fmt.int },
    { source: "metrics", key: "limit_down", label: { en: "Limit-down", zh: "跌停家數" }, align: "right", format: fmt.int },
    {
      source: "metrics",
      key: "up_share_pct",
      label: { en: "Up share", zh: "漲停占比" },
      align: "right",
      // Already a percent value from the API (e.g. 53, 72.3) — append the sign, don't rescale.
      format: (v) => (typeof v === "number" ? `${v}%` : "—"),
    },
    {
      source: "metrics",
      key: "up_down_ratio",
      label: { en: "Up/down ratio", zh: "漲跌停比" },
      align: "right",
      format: (v) => (typeof v === "number" ? v.toFixed(2) : "—"),
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return factsStatMetadata(config, locale);
}

export default function LimitEventsPage() {
  return <FactsStatPage config={config} />;
}
