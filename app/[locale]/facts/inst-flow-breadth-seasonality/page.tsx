import type { Metadata } from "next";

import {
  FactsStatPage,
  factsStatMetadata,
  fmt,
  monthLabel,
  type FactsStatPageConfig,
} from "@/src/components/facts/facts-stat-page";

const config: FactsStatPageConfig = {
  pageSlug: "inst-flow-breadth-seasonality",
  endpointSlug: "inst-flow-breadth-seasonality",
  jsonLdName: {
    en: "Taiwan institutional-flow breadth seasonality",
    zh: "台股法人買氣廣度月度季節性",
  },
  title: {
    en: "Taiwan institutional-flow breadth seasonality",
    zh: "台股法人買氣廣度月度季節性",
  },
  intro: {
    en: "By calendar month, the average share of stocks the three institutional groups were net buyers of versus net sellers of, since 2012 — a market-breadth read on institutional appetite. The signal is mild (~2pp): only December's net-buy share edges above net-sell. Descriptive statistics only, not a forecast.",
    zh: "各曆月三大法人淨買個股比例對淨賣個股比例的平均值,2012 年起——法人買氣的市場廣度觀察。訊號溫和(~2pp):僅 12 月淨買略高於淨賣。純描述統計,非預測。",
  },
  methodologyEn:
    "Daily breadth = the count of stocks the three institutional groups net-bought that day (net_total > 0) divided by the count of stocks with any net position that day, ×100. The monthly seasonal averages each calendar month's daily breadth within the month, then across years. Placeholder days are excluded; the measure is unit-free (heterogeneous share counts are not summed).",
  coverageEn:
    "From institutional_flow_items 2012-05 to 2026-06 (~14 years; the floor is 2012-05), latest real month 2026-06 (placeholders excluded). Direction is judged by net share count, not amount. The signal is mild (~2pp): only December's net-buy share exceeds net-sell, October–November are weakest. An amount (NT$) version is a separate wave-2 derived stat.",
  columns: [
    { source: "dimension", key: "month", label: { en: "Month", zh: "月份" }, format: monthLabel },
    {
      source: "metrics",
      key: "avg_pct_net_bought",
      label: { en: "Net-buy breadth", zh: "淨買廣度" },
      align: "right",
      // Already a percent value from the API (e.g. 48.4) — append the sign, don't rescale.
      format: (v) => (typeof v === "number" ? `${v}%` : "—"),
    },
    {
      source: "metrics",
      key: "avg_pct_net_sold",
      label: { en: "Net-sell breadth", zh: "淨賣廣度" },
      align: "right",
      format: (v) => (typeof v === "number" ? `${v}%` : "—"),
    },
    { source: "metrics", key: "years_bought_gt50", label: { en: "Years buy>50%", zh: "買氣>50% 年數" }, align: "right", format: fmt.int },
    { source: "metrics", key: "n_years", label: { en: "Years", zh: "樣本年數" }, align: "right", format: fmt.int },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return factsStatMetadata(config, locale);
}

export default function InstFlowBreadthSeasonalityPage() {
  return <FactsStatPage config={config} />;
}
