import type { Metadata } from "next";

import {
  FactsStatPage,
  factsStatMetadata,
  fmt,
  monthLabel,
  type FactsStatPageConfig,
} from "@/src/components/facts/facts-stat-page";

const config: FactsStatPageConfig = {
  pageSlug: "seasonality",
  endpointSlug: "seasonality",
  jsonLdName: { en: "Taiwan market monthly seasonality", zh: "台股月度季節性" },
  title: {
    en: "Taiwan market monthly seasonality",
    zh: "台股月度季節性",
  },
  intro: {
    en: "Average monthly behaviour of the Taiwan market since 2003 — mean total return, the share of years each calendar month closed positive, and average traded volume. Descriptive statistics only, not a forecast.",
    zh: "台股自 2003 年以來的各月平均表現——平均總報酬、各日曆月收正的年數比例,以及平均成交量。純描述統計,非預測。",
  },
  methodologyEn:
    "Monthly return is the month-over-month change in the TAIEX Total Return index (dividends reinvested) at month-end; the up-year ratio is the share of years in which that calendar month was positive; volume is the average monthly traded share count.",
  coverageEn:
    "TAIEX Total Return index from 2003 (~23 years — not 30); volume (normalized, TWSE) from 2004.",
  columns: [
    { source: "dimension", key: "month", label: { en: "Month", zh: "月份" }, format: monthLabel },
    { source: "metrics", key: "avg_return", label: { en: "Avg return", zh: "平均報酬" }, align: "right", format: fmt.pctSigned },
    { source: "metrics", key: "up_year_ratio", label: { en: "Up-year %", zh: "上漲年比例" }, align: "right", format: fmt.pct0 },
    { source: "metrics", key: "n_years", label: { en: "Years", zh: "樣本年數" }, align: "right", format: fmt.int },
    { source: "metrics", key: "avg_monthly_volume_shares", label: { en: "Avg volume", zh: "月均量(股)" }, align: "right", format: fmt.billions },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return factsStatMetadata(config, locale);
}

export default function SeasonalityPage() {
  return <FactsStatPage config={config} />;
}
