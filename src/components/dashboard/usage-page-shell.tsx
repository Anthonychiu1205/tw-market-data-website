"use client";

import { Fragment, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { OverviewUsageChart } from "@/src/components/dashboard/overview-usage-chart";
import type { UsageRequestsSummary, UsageSummary } from "@/src/lib/backend-adapter";
import { trackEvent } from "@/src/lib/analytics/client";
import type { CreditsDeductionRuntimeState } from "@/src/lib/billing/credits-mode";
import { getCreditsAmountLabel, getCreditsModeDescription } from "@/src/lib/billing/credits-mode";

type UsagePageShellProps = {
  usageRequests: UsageRequestsSummary;
  usageSummary: UsageSummary;
  creditState: "normal" | "low" | "exhausted";
  creditsModeState: CreditsDeductionRuntimeState;
  usageReconciliation: {
    windowDays: number;
    totalUsageEvents: number;
    totalChargedCredits: number;
    totalTransactionCredits: number;
    mismatchedRequestIds: string[];
  } | null;
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
  return date.toLocaleString("zh-TW", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
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

function monthLabel(key: string, locale: string) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en" : "zh-TW", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, 1));
}

function buildMonthPoints(monthKey: string, rows: UsageRequestsSummary["rows"]): DailyRequestPoint[] {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  // Don't plot future days: for the current month stop at today; past months show all days.
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const lastDay = isCurrentMonth ? Math.min(daysInMonth, now.getDate()) : daysInMonth;
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

  return Array.from({ length: lastDay }, (_, index) => {
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

const USAGE_ROWS_LIMIT = 100;

export function UsagePageShell({ usageRequests, usageSummary, creditState, creditsModeState, usageReconciliation }: UsagePageShellProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const creditsLocale = locale === "en" ? "en" : "zh-TW";
  const rows = usageRequests.rows;

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
  const [copiedRequestId, setCopiedRequestId] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
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
    requestId: row.requestId || null,
    transactionLinked: row.transactionLinked ?? null,
    transactionStatus: row.transactionStatus ?? null,
    transactionCredits: row.transactionCredits ?? null,
  }));

  function getStatusLabel(status: number | string) {
    const value = typeof status === "number" ? status : Number(status);
    if (value === 200) return t("usagePage.status.success");
    if (value === 401 || value === 403) return t("usagePage.status.unauthorized");
    if (value === 402) return t("usagePage.status.insufficientCredits");
    if (value === 500 || value === 502 || value === 504) return t("usagePage.status.upstreamError");
    if (Number.isFinite(value)) return `${value}`;
    return t("usagePage.status.pending");
  }

  async function copyRequestId(requestId: string) {
    try {
      await navigator.clipboard.writeText(requestId);
      setCopiedRequestId(requestId);
      window.setTimeout(() => {
        setCopiedRequestId((prev) => (prev === requestId ? null : prev));
      }, 1600);
    } catch {
      // Ignore clipboard failures in read-only environments.
    }
  }

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
            <p className="text-xs text-slate-500">{t("usagePage.requestsToday")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{(usageSummary.requestsToday ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("usagePage.requests30d")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{(usageSummary.requests30d ?? usageSummary.monthlyUsed).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("usagePage.credits30d", { label: getCreditsAmountLabel(creditsModeState, creditsLocale) })}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {(creditsModeState.mode === "charged"
                ? usageSummary.chargedCreditsUsage30d ?? 0
                : usageSummary.estimatedCreditsUsage30d ?? 0
              ).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Top datasets</p>
            <p className="mt-1 text-sm text-slate-700">
              {usageSummary.topEndpoints.length ? usageSummary.topEndpoints.slice(0, 2).join("、") : t("usagePage.noData")}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">{getCreditsModeDescription(creditsModeState, creditsLocale)}</p>
        {usageReconciliation ? (
          <p className="mt-1 text-xs text-slate-500">
            {t("usagePage.reconcileLine", {
              days: usageReconciliation.windowDays,
              events: usageReconciliation.totalUsageEvents.toLocaleString(),
              charged: usageReconciliation.totalChargedCredits.toLocaleString(),
              actual: usageReconciliation.totalTransactionCredits.toLocaleString(),
            })}
            {usageReconciliation.mismatchedRequestIds.length > 0 ? t("usagePage.reconcilePending") : ""}
          </p>
        ) : null}
      </DashboardCard>

      {creditState === "exhausted" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">{t("usagePage.exhaustedTitle")}</p>
          <p className="mt-1 text-sm text-amber-800">{t("usagePage.exhaustedBody")}</p>
          <Link
            href="/billing/subscriptions"
            className={buttonClass("secondary", "mt-3 h-9 rounded-lg px-4 text-xs")}
            onClick={() => {
              void trackEvent(
                {
                  event: "pricing_upgrade_clicked",
                  properties: { source: "usage_exhausted_banner" },
                  context: { source: "client", page: "/usage" },
                },
                { dedupeKey: "usage-upgrade-clicked", dedupeMs: 2000 },
              );
            }}
          >
            {t("usagePage.upgradeCta")}
          </Link>
        </section>
      ) : null}

      {creditState === "low" ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">{t("usagePage.lowTitle")}</p>
          <p className="mt-1 text-sm text-slate-600">{t("usagePage.lowBody")}</p>
          <Link
            href="/billing/subscriptions"
            className={buttonClass("secondary", "mt-3 h-9 rounded-lg px-4 text-xs")}
            onClick={() => {
              void trackEvent(
                {
                  event: "pricing_upgrade_clicked",
                  properties: { source: "usage_low_credit_banner" },
                  context: { source: "client", page: "/usage" },
                },
                { dedupeKey: "usage-upgrade-clicked", dedupeMs: 2000 },
              );
            }}
          >
            {t("usagePage.upgradeCta")}
          </Link>
        </section>
      ) : null}

      <div className="flex flex-col gap-6">
        <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">{t("usagePage.dailyRequests")}</p>
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={resolvedMonthIndex === 0}
                aria-label={t("usagePage.prevMonth")}
              >
                <span className="inline-block h-4 w-4">‹</span>
              </button>
              <span className="text-lg font-medium text-slate-700">{monthLabel(activeMonthKey, locale)}</span>
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.min(monthKeys.length - 1, prev + 1))}
                disabled={resolvedMonthIndex === monthKeys.length - 1}
                aria-label={t("usagePage.nextMonth")}
              >
                <span className="inline-block h-4 w-4">›</span>
              </button>
            </div>
          </div>
          {/* Reuse the overview「活動與用量」smooth-line chart. It keys X on `date`, so map the
              MM/DD label onto that field. buildMonthPoints already trims future days. */}
          <div className="mt-6 h-[300px]">
            <OverviewUsageChart data={dailyRequests.map((point) => ({ date: point.label, requests: point.requests }))} />
          </div>
        </DashboardCard>

        <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
          <p className="text-2xl font-semibold text-slate-900">{t("usagePage.endpointUsage")}</p>
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
            <p className="mt-4 text-sm text-slate-500">{t("usagePage.noEndpointData")}</p>
          )}
        </DashboardCard>

        <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">{t("usagePage.requestLog")}</p>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              {t("usagePage.exportCsv")}
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">{t("usagePage.col.date")}</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">API</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">Symbol</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">{t("usagePage.col.endpoint")}</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">{t("usagePage.col.status")}</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">{getCreditsAmountLabel(creditsModeState, creditsLocale)}</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">Latency</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">Request ID</th>
                  <th className="whitespace-nowrap px-2 py-3 text-left font-medium">{t("usagePage.col.reconcile")}</th>
                </tr>
              </thead>
              <tbody>
                {requestRows.length ? (
                  requestRows.map((row, index) => {
                    const isExpanded = expandedRequestId === row.requestId;
                    return (
                      <Fragment key={`${row.date}-${row.endpoint}-${index}`}>
                        <tr className="border-t border-slate-100">
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">{row.date}</td>
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">{row.api}</td>
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">{row.symbol}</td>
                          <td className="px-2 py-3">
                            <span className="inline-flex whitespace-nowrap rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">{row.endpoint}</span>
                          </td>
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">
                            <span className="whitespace-nowrap">{getStatusLabel(row.status)}</span>
                            <span className="ml-2 whitespace-nowrap text-xs text-slate-400">({row.status})</span>
                            {row.errorCode ? (
                              <span className="ml-2 inline-flex whitespace-nowrap rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
                                {row.errorCode}
                              </span>
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">{row.credits.toLocaleString()}</td>
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">
                            {typeof row.latencyMs === "number" ? `${row.latencyMs} ms` : "—"}
                          </td>
                          <td className="whitespace-nowrap px-2 py-3 text-sm text-slate-700">
                            {row.requestId ? (
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => void copyRequestId(row.requestId!)}
                                  className="inline-flex items-center whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 transition hover:bg-slate-200"
                                  title={t("usagePage.copyRequestIdTitle")}
                                >
                                  {row.requestId.slice(0, 8)}
                                </button>
                                <button
                                  type="button"
                                  className="text-xs text-slate-500 underline-offset-2 hover:underline"
                                  onClick={() => setExpandedRequestId((prev) => (prev === row.requestId ? null : row.requestId))}
                                >
                                  {isExpanded ? t("usagePage.collapse") : t("usagePage.expand")}
                                </button>
                                {copiedRequestId === row.requestId ? <span className="text-[10px] text-slate-500">{t("usagePage.copied")}</span> : null}
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-600">
                            {row.transactionLinked ? (
                              <span className="inline-flex whitespace-nowrap rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">{t("usagePage.linked")}</span>
                            ) : (
                              <span className="inline-flex whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{t("usagePage.notCharged")}</span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && row.requestId ? (
                          <tr className="border-t border-slate-50 bg-slate-50/50">
                            <td colSpan={9} className="px-3 py-3 text-xs text-slate-600">
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                <p>requestId：<span className="font-mono text-slate-700">{row.requestId}</span></p>
                                <p>dataset：{row.api}</p>
                                <p>status：{getStatusLabel(row.status)}</p>
                                <p>latency：{typeof row.latencyMs === "number" ? `${row.latencyMs} ms` : "—"}</p>
                                <p>{`${getCreditsAmountLabel(creditsModeState, creditsLocale)}：${row.credits.toLocaleString()}`}</p>
                                <p>
                                  transaction：
                                  {row.transactionLinked
                                    ? `${row.transactionStatus ?? "completed"} (${row.transactionCredits ?? 0})`
                                    : t("usagePage.notChargedDetail")}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })
                ) : (
                  <tr className="border-t border-slate-100">
                    <td colSpan={9} className="px-2 py-6 text-center text-slate-500">{t("usagePage.noUsage")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination was fabricated: "第 1 頁，共 1 頁 / 顯示 100 筆" was hardcoded regardless of how
              many rows existed. Rather than fake a pager, state honestly what is shown and that the
              list is capped — a real server-side pager is a separate change. */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>{t("usagePage.showingRecent", { count: usageRequests.rows.length.toLocaleString() })}</span>
            <span>
              {usageRequests.rows.length >= USAGE_ROWS_LIMIT
                ? t("usagePage.cappedNote", { limit: USAGE_ROWS_LIMIT })
                : t("usagePage.showingAll")}
            </span>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
