"use client";

import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewUsagePoint = {
  date: string;
  requests: number;
};

type OverviewUsageChartProps = {
  data: OverviewUsagePoint[];
};

export function OverviewUsageChart({ data }: OverviewUsageChartProps) {
  const t = useTranslations("dashboard");
  const maxValue = Math.max(...data.map((item) => item.requests), 1);
  const yAxisTicks = (() => {
    if (maxValue <= 1) return [0, 1];
    if (maxValue <= 2) return [0, 1, 2];

    const step = Math.max(1, Math.ceil(maxValue / 4));
    const ticks: number[] = [0];
    for (let value = step; value < maxValue; value += step) {
      ticks.push(value);
    }
    ticks.push(maxValue);
    return ticks;
  })();
  const yAxisMax = yAxisTicks[yAxisTicks.length - 1] ?? 2;

  return (
    <div
      className="h-full w-full select-none outline-none focus:outline-none focus-visible:outline-none"
      style={{ userSelect: "none", outline: "none", WebkitUserSelect: "none" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          ticks={yAxisTicks}
          tickFormatter={(value) => String(Math.round(Number(value)))}
          domain={[0, yAxisMax]}
          width={44}
        />
        <Tooltip
          cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
          contentStyle={{
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            fontSize: "12px",
            color: "#334155",
          }}
          formatter={(value) => {
            const rawValue = Array.isArray(value) ? value[0] : value;
            const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0);
            const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
            return [safeValue.toLocaleString(), t("chart.requests")];
          }}
          labelFormatter={(label) => t("chart.dateLabel", { label })}
        />
        <Line
          type="monotone"
          dataKey="requests"
          stroke="#1f2937"
          strokeWidth={1.8}
          dot={false}
          activeDot={{ r: 3, fill: "#111827" }}
        />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
