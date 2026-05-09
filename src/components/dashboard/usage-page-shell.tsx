"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import type { UsageRequestsSummary, UsageSummary } from "@/src/lib/backend-adapter";

type UsagePageShellProps = {
  usageRequests: UsageRequestsSummary;
  usageSummary: UsageSummary;
  creditState: "normal" | "low" | "exhausted";
};

type DailyRequestPoint = {
  date: string;
  label: string;
  requests: number;
};

function formatTimestamp(raw: string) {
  if (!raw || raw === "-") return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString("en-US", {
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function monthKeyFromTimestamp(raw: string): string | null {
  if (!raw || raw === "-") return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${year}年${Number(month)}月`;
}

function buildMonthPoints(monthKey: string, rows: UsageRequestsSummary["rows"]): DailyRequestPoint[] {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyCount = new Map<string, number>();

  for (const row of rows) {
    const key = monthKeyFromTimestamp(row.requestTimestamp);
    if (key !== monthKey) continue;
    const date = new Date(row.requestTimestamp);
    if (Number.isNaN(date.getTime())) continue;
    const day = `${date.getDate()}`.padStart(2, "0");
    const dateKey = `${monthKey}-${day}`;
    dailyCount.set(dateKey, (dailyCount.get(dateKey) ?? 0) + 1);
  }

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = `${index + 1}`.padStart(2, "0");
    const dateKey = `${monthKey}-${day}`;
    return {
      date: dateKey,
      label: `${month.toString().padStart(2, "0")}/${day}`,
      requests: dailyCount.get(dateKey) ?? 0,
    };
  });
}

function inferApiLabel(dataset: string, endpoint: string): string {
  if (dataset && dataset !== "-") return dataset;
  const parts = endpoint.split("/").filter(Boolean);
  return parts.at(-1) ?? "-";
}

export function UsagePageShell({ usageRequests, usageSummary, creditState }: UsagePageShellProps) {
  const rows = usageRequests.rows;
  const isDryRun = usageSummary.isDryRun !== false;

  const monthKeys = useMemo(() => {
    const fromRows = Array.from(
      new Set(rows.map((row) => monthKeyFromTimestamp(row.requestTimestamp)).filter((key): key is string => Boolean(key))),
    ).sort();

    if (fromRows.length) return fromRows;

    const current = new Date();
    const key = `${current.getFullYear()}-${`${current.getMonth() + 1}`.padStart(2, "0")}`;
    return [key];
  }, [rows]);

  const [activeMonthIndex, setActiveMonthIndex] = useState(monthKeys.length - 1);
  const resolvedMonthIndex = Math.min(activeMonthIndex, monthKeys.length - 1);
  const activeMonthKey = monthKeys[resolvedMonthIndex];

  const dailyRequests = useMemo(() => buildMonthPoints(activeMonthKey, rows), [activeMonthKey, rows]);

  const requestRows = rows.map((row) => ({
    date: formatTimestamp(row.requestTimestamp),
    api: inferApiLabel(row.dataset, row.endpoint),
    endpoint: row.endpoint || "-",
    symbol: row.symbol || "—",
    status: row.statusCode ?? "-",
    credits: row.creditsCharged ?? 0,
    latencyMs: row.latencyMs,
    errorCode: row.errorCode || null,
  }));

  const endpointUsageRows = useMemo(() => {
    const usageMap = new Map<string, number>();
    for (const row of rows) {
      const name = inferApiLabel(row.dataset, row.endpoint);
      usageMap.set(name, (usageMap.get(name) ?? 0) + 1);
    }

    const list = Array.from(usageMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const total = list.reduce((sum, item) => sum + item.count, 0);

    return list.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.count / total) * 100 : 0,
    }));
  }, [rows]);

  return (
    <div className="space-y-4">
      <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-none">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">今日 request</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{(usageSummary.requestsToday ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">30 天 request</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{(usageSummary.requests30d ?? usageSummary.monthlyUsed).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{isDryRun ? "30 天 dry-run credits" : "30 天 credits charged"}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{(usageSummary.estimatedCreditsUsage30d ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Top datasets</p>
            <p className="mt-1 text-sm text-slate-700">
              {usageSummary.topEndpoints.length ? usageSummary.topEndpoints.slice(0, 2).join("、") : "尚無資料"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {isDryRun
            ? "目前為 dry-run usage：僅記錄估算成本，尚未正式扣點。"
            : "目前已啟用正式扣點：僅成功請求會扣除 credits。"}
        </p>
      </DashboardCard>

      {creditState === "exhausted" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">您的使用額度已用完</p>
          <p className="mt-1 text-sm text-amber-800">請升級方案或購買 credits。</p>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "mt-3 h-9 rounded-lg px-4 text-xs")}>
            升級方案
          </Link>
        </section>
      ) : null}

      {creditState === "low" ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">您的使用額度即將用完</p>
          <p className="mt-1 text-sm text-slate-600">建議先升級方案或購買 credits，避免請求中斷。</p>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "mt-3 h-9 rounded-lg px-4 text-xs")}>
            升級方案
          </Link>
        </section>
      ) : null}

      <div className="flex flex-col gap-6">
        <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">每日請求</p>
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={resolvedMonthIndex === 0}
                aria-label="上個月"
              >
                <span className="inline-block h-4 w-4">‹</span>
              </button>
              <span className="text-lg font-medium text-slate-700">{monthLabel(activeMonthKey)}</span>
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.min(monthKeys.length - 1, prev + 1))}
                disabled={resolvedMonthIndex === monthKeys.length - 1}
                aria-label="下個月"
              >
                <span className="inline-block h-4 w-4">›</span>
              </button>
            </div>
          </div>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRequests} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                <defs>
                  <linearGradient id="dailyRequestsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748b" stopOpacity={0.14} />
                    <stop offset="100%" stopColor="#64748b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} ticks={[0, 1, 2]} domain={[0, 2]} width={32} />
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
                    return [safeValue.toLocaleString(), "請求數"];
                  }}
                  labelFormatter={(label) => `日期 ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#1f2937"
                  strokeWidth={1.8}
                  fill="url(#dailyRequestsFill)"
                  dot={{ r: 2.5, strokeWidth: 0, fill: "#334155" }}
                  activeDot={{ r: 3.5, fill: "#111827" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
          <p className="text-2xl font-semibold text-slate-900">端點使用</p>
          {endpointUsageRows.length ? (
            <div className="mt-5 space-y-4">
              {endpointUsageRows.map((row) => (
                <div key={row.name} className="grid grid-cols-[180px_minmax(0,1fr)_72px] items-center gap-4">
                  <p className="text-sm text-slate-700">{row.name}</p>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-slate-700" style={{ width: `${row.percentage}%` }} />
                  </div>
                  <p className="text-right text-sm text-slate-600">{row.percentage.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">尚無端點使用資料</p>
          )}
        </DashboardCard>

        <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">請求記錄</p>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              匯出 CSV
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="px-2 py-3 text-left font-medium">日期</th>
                  <th className="px-2 py-3 text-left font-medium">API</th>
                  <th className="px-2 py-3 text-left font-medium">Symbol</th>
                  <th className="px-2 py-3 text-left font-medium">端點</th>
                  <th className="px-2 py-3 text-left font-medium">狀態</th>
                  <th className="px-2 py-3 text-left font-medium">dry-run credits</th>
                  <th className="px-2 py-3 text-left font-medium">Latency</th>
                </tr>
              </thead>
              <tbody>
                {requestRows.length ? (
                  requestRows.map((row, index) => (
                    <tr key={`${row.date}-${row.endpoint}-${index}`} className="border-t border-slate-100">
                      <td className="px-2 py-3 text-sm text-slate-700">{row.date}</td>
                      <td className="px-2 py-3 text-sm text-slate-700">{row.api}</td>
                      <td className="px-2 py-3 text-sm text-slate-700">{row.symbol}</td>
                      <td className="px-2 py-3">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">{row.endpoint}</span>
                      </td>
                      <td className="px-2 py-3 text-sm text-slate-700">
                        {row.status}
                        {row.errorCode ? (
                          <span className="ml-2 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
                            {row.errorCode}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-3 text-sm text-slate-700">{row.credits.toLocaleString()}</td>
                      <td className="px-2 py-3 text-sm text-slate-700">
                        {typeof row.latencyMs === "number" ? `${row.latencyMs} ms` : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-slate-100">
                    <td colSpan={7} className="px-2 py-6 text-center text-slate-500">尚無 API request usage。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>第 1 頁，共 1 頁</span>
            <span>顯示 100 筆</span>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
