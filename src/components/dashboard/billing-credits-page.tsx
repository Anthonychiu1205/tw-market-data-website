"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, RefreshCw } from "lucide-react";

import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

import { formatCredits, type CreditSpendSeries } from "@/src/lib/billing/credits";
import { DATASET_ACCESS_POLICIES } from "@/src/lib/gateway/dataset-policies";
import { formatMoney, formatMoneyOrFallback } from "@/src/lib/billing/money";
import { getCreditPackViews, getPricePerCredit, type CreditPackCode } from "@/src/lib/billing/credit-packs";
import { createCreditPackCheckout } from "@/src/lib/billing/checkout-actions";
import type { CreditsDeductionRuntimeState } from "@/src/lib/billing/credits-mode";
import { getCreditsModeLabel } from "@/src/lib/billing/credits-mode";

// Credit-cost table, DERIVED from the pricing SSOT (DATASET_ACCESS_POLICIES). Every billable dataset
// appears here with the exact cost the meter charges — there is no hand-maintained row list to drift.
// Grouped by the plan tier that unlocks the dataset. Analysis-line tools (features/time-alignment)
// are absent from the SSOT, so they never appear.
const COST_TABLE_TIERS: Array<{ id: string; label: string }> = [
  { id: "free", label: "Free" },
  { id: "starter", label: "Starter" },
  { id: "pro", label: "Pro" },
  { id: "max", label: "Max" },
];

type CostRow = { slug: string; cost: number };

const COST_ROWS_BY_TIER: Record<string, CostRow[]> = Object.values(DATASET_ACCESS_POLICIES).reduce(
  (acc, policy) => {
    (acc[policy.requiredPlan] ??= []).push({ slug: policy.datasetSlug, cost: policy.creditsCost });
    return acc;
  },
  {} as Record<string, CostRow[]>,
);
for (const rows of Object.values(COST_ROWS_BY_TIER)) {
  rows.sort((a, b) => a.cost - b.cost || a.slug.localeCompare(b.slug));
}

type SpendPoint = {
  date: string;
  label: string;
  spend: number;
};


function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${year}年${Number(month)}月`;
}

type BillingCreditsPageProps = {
  spendSeries: CreditSpendSeries;
  creditsModeState: CreditsDeductionRuntimeState;
  walletBalance: number;
  usageReconciliation: {
    windowDays: number;
    walletBalance: number;
    totalUsageEvents: number;
    totalChargedCredits: number;
    totalTransactionCredits: number;
    mismatchedRequestIds: string[];
    orphanUsageEvents: string[];
    orphanUsageTransactions: string[];
    duplicateUsageTransactions: string[];
  } | null;
  transactions: Array<{
    id: string;
    type: string;
    status: string;
    amountMinor: number | null;
    currency: string | null;
    credits: number;
    balanceAfter: number | null;
    provider: string | null;
    merchantTradeNo: string | null;
    providerTradeNo: string | null;
    packageCode: string | null;
    description: string | null;
    createdAt: string;
  }>;
};

const TRANSACTION_FILTER_OPTIONS: Array<{
  id: "all" | "usage" | "purchase" | "refund" | "adjustment";
  label: string;
}> = [
  { id: "all", label: "全部" },
  { id: "usage", label: "API 使用" },
  { id: "purchase", label: "儲值" },
  { id: "refund", label: "退款" },
  { id: "adjustment", label: "手動調整" },
];

// Export the transactions currently in view (i.e. the active filter). Values are quoted and inner
// quotes doubled so a description containing a comma cannot shift columns.
function toCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadTransactionsCsv(rows: BillingCreditsPageProps["transactions"], filterId: string) {
  const header = [
    "created_at", "type", "status", "credits", "balance_after",
    "amount_minor", "currency", "provider", "package_code", "reference", "description",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push([
      toCsvValue(row.createdAt),
      toCsvValue(row.type),
      toCsvValue(row.status),
      toCsvValue(row.credits),
      toCsvValue(row.balanceAfter),
      toCsvValue(row.amountMinor),
      toCsvValue(row.currency),
      toCsvValue(row.provider),
      toCsvValue(row.packageCode),
      toCsvValue(row.providerTradeNo ?? row.merchantTradeNo),
      toCsvValue(row.description),
    ].join(","));
  }
  // BOM so Excel opens UTF-8 (Chinese descriptions) without mojibake.
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `credit-transactions-${filterId}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getTransactionTypeLabel(type: string) {
  if (type === "purchase") return "儲值";
  if (type === "refund") return "退款";
  if (type === "usage") return "API 使用";
  if (type === "adjustment") return "手動調整";
  return "其他";
}

function getTransactionStatusLabel(status: string) {
  if (status === "completed") return "已完成";
  if (status === "pending") return "確認中";
  if (status === "failed") return "失敗";
  if (status === "cancelled") return "已取消";
  if (status === "expired") return "已逾時";
  if (status === "simulated") return "模擬";
  return "待確認";
}

function formatTransactionDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

function toShortRequestId(requestId: string) {
  return requestId.length > 8 ? requestId.slice(0, 8) : requestId;
}

function extractUsageMetadata(transaction: BillingCreditsPageProps["transactions"][number]) {
  const merchantTradeNo = transaction.merchantTradeNo ?? "";
  if (!merchantTradeNo.startsWith("usage:")) return null;
  const requestId = merchantTradeNo.slice("usage:".length);
  const matched = (transaction.description ?? "").match(/API usage\s+([^·]+)\s+·/);
  const datasetSlug = matched?.[1]?.trim() || "unknown";
  return { requestId, datasetSlug };
}

// Every row now carries amountMinor + currency (legacy TWD rows were backfilled with currency=TWD),
// so a row renders in the currency it was actually charged in — an old NT$ charge is not relabelled
// as USD. Rows with no recorded amount show "—" rather than a fabricated $0.
function formatTransactionAmount(transaction: { amountMinor: number | null; currency: string | null }) {
  return formatMoneyOrFallback(transaction.amountMinor, transaction.currency, "—");
}

export function BillingCreditsPage({ creditsModeState, walletBalance, spendSeries: spendSeriesData, usageReconciliation, transactions }: BillingCreditsPageProps) {
  const router = useRouter();
  const mountedAtRef = useRef<number>(0);
  const lastFocusRefreshAtRef = useRef<number>(0);
  const [activeTab, setActiveTab] = useState<string>("free");
  // Month selector is driven by months that ACTUALLY have transactions — no fabricated buckets.
  const spendMonths = spendSeriesData.months;
  const [activeMonthIndex, setActiveMonthIndex] = useState(Math.max(0, spendMonths.length - 1));
  const [transactionFilter, setTransactionFilter] = useState<"all" | "usage" | "purchase" | "refund" | "adjustment">("all");
  const activeMonth = spendMonths[activeMonthIndex] ?? null;
  const activeMonthKey = activeMonth?.key ?? "";
  const spendSeries = activeMonth?.points ?? [];
  const hasSpendData = spendSeries.length > 0;
  const spendAxisMax = useMemo(() => {
    const max = spendSeries.reduce((acc, point) => Math.max(acc, point.spend), 0);
    if (max <= 0) return 2;
    return Math.max(2, Math.ceil((max * 1.15) / 2) * 2);
  }, [spendSeries]);
  const packages = useMemo(() => getCreditPackViews(), []);
  const [pendingPack, setPendingPack] = useState<CreditPackCode | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  // Revenue-integrity display rule (④/③): a top-up only appears once payment is confirmed. A
  // purchase that is pending / failed / expired was never added to the wallet, so showing it — as a
  // green "+N credits" row — would imply credits the customer does not have. Hide it from the list
  // (usage/refund/adjustment are only ever written as completed, so they are unaffected).
  const visibleTransactions = useMemo(
    () => transactions.filter((item) => item.type !== "purchase" || item.status === "completed"),
    [transactions],
  );
  const latestTransactionAt = visibleTransactions.length > 0 ? visibleTransactions[0]?.createdAt ?? null : null;
  const filteredTransactions = useMemo(() => {
    if (transactionFilter === "all") return visibleTransactions;
    return visibleTransactions.filter((item) => item.type === transactionFilter);
  }, [transactionFilter, visibleTransactions]);
  async function handleBuyPack(packCode: CreditPackCode) {
    if (pendingPack) return;
    setPendingPack(packCode);
    setPurchaseError(null);

    try {
      const result = await createCreditPackCheckout(packCode);
      if (!result.ok) {
        setPurchaseError(
          result.error === "checkout_unavailable"
            ? "目前無法開啟結帳，請稍後再試。"
            : result.error === "unauthenticated"
              ? "請先登入後再購買。"
              : "此儲值方案暫時無法購買。",
        );
        return;
      }
      // Inline overlay — the user never leaves the dashboard. Credits are granted by the Polar
      // webhook once payment settles, so we refresh the wallet after the overlay closes.
      const checkout = await PolarEmbedCheckout.create(result.url, { theme: "light" });
      checkout.addEventListener("close", () => {
        router.refresh();
      });
    } catch {
      setPurchaseError("目前無法開啟結帳，請稍後再試。");
    } finally {
      setPendingPack(null);
    }
  }

  // A mismatch is a REAL problem only: a linked event whose credits differ from its deduction, a
  // duplicate deduction, or a deduction with no usage event. The old code also flagged
  // totalChargedCredits !== totalTransactionCredits, but that difference is EXPECTED whenever dry_run
  // usage events exist (they record an estimated cost but never deduct), so it produced a permanent
  // false "未對帳". Estimate ≠ deducted is not, by itself, a fault.
  const reconciliationMismatch =
    usageReconciliation &&
    (usageReconciliation.mismatchedRequestIds.length > 0 ||
      usageReconciliation.duplicateUsageTransactions.length > 0 ||
      usageReconciliation.orphanUsageTransactions.length > 0);

  useEffect(() => {
    if (mountedAtRef.current === 0) {
      mountedAtRef.current = Date.now();
    }

    const MIN_MOUNT_AGE_MS = 3000;
    const FOCUS_REFRESH_THROTTLE_MS = 20_000;

    function handleFocus() {
      const now = Date.now();
      if (now - mountedAtRef.current < MIN_MOUNT_AGE_MS) {
        return;
      }
      if (now - lastFocusRefreshAtRef.current < FOCUS_REFRESH_THROTTLE_MS) {
        return;
      }
      lastFocusRefreshAtRef.current = now;
      router.refresh();
    }

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-medium text-slate-900">餘額</p>
              <p className="mt-1 text-sm text-slate-600">可用 credits 餘額</p>
            </div>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              title="刷新餘額"
              aria-label="刷新餘額"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-5 text-5xl font-semibold tracking-tight text-slate-900">{formatCredits(walletBalance)}</p>
          <p className="mt-2 text-xs text-slate-500">
            {latestTransactionAt ? `最近異動：${formatTransactionDate(latestTransactionAt)}` : "最近異動：尚無紀錄"}
          </p>
          {/* Empty-state hint only. The old block had three internal status lines, one with inverted
              logic (a non-zero balance showed "wallet 未建立、餘額預設 0"). Customers do not need the
              mode/description internals — show only the "0 is normal" note, and only when it is 0. */}
          {walletBalance === 0 ? (
            <p className="mt-1 text-xs text-slate-500">目前尚無可用 credits，餘額為 0 屬正常狀態；儲值或訂閱後即會顯示。</p>
          ) : null}
        </DashboardCard>

        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <p className="text-[15px] font-medium text-slate-900">API 端點</p>
          <p className="mt-1 text-sm text-slate-600">每次 API 呼叫的 credits 成本</p>

          <div className="-mx-1 mt-5 overflow-x-auto px-1">
            <div className="inline-flex min-w-max rounded-xl bg-slate-100 p-1">
              {COST_TABLE_TIERS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 rounded-lg px-4 text-sm font-medium transition ${activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl bg-slate-50/70">
            <table className="min-w-full text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="px-3 py-3 text-left font-medium">資料集</th>
                  <th className="px-3 py-3 text-left font-medium">端點</th>
                  <th className="px-3 py-3 text-left font-medium">使用成本</th>
                </tr>
              </thead>
              <tbody>
                {(COST_ROWS_BY_TIER[activeTab] ?? []).map((row) => (
                  <tr
                    key={row.slug}
                    className="border-t border-slate-200/70 transition hover:bg-white/70"
                  >
                    <td className="px-3 py-3 text-sm text-slate-700">{row.slug}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-md bg-slate-100/70 px-2 py-1 font-mono text-xs text-slate-500 ring-1 ring-slate-200/70">
                        /v2/datasets/{row.slug}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">{row.cost === 1 ? "1 credit" : `${row.cost} credits`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            credits 使用量取決於端點成本與請求量（目前顯示：{getCreditsModeLabel(creditsModeState)}）。
          </p>
        </DashboardCard>
      </section>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium text-slate-900">使用量 / Credits 對帳（近 {usageReconciliation?.windowDays ?? 30} 天）</p>
            <p className="mt-1 text-sm text-slate-600">
              使用事件：{(usageReconciliation?.totalUsageEvents ?? 0).toLocaleString()} ·
              預估用量成本（含試算）：{(usageReconciliation?.totalChargedCredits ?? 0).toLocaleString()} ·
              實際扣點 credits：{(usageReconciliation?.totalTransactionCredits ?? 0).toLocaleString()} ·
              錢包餘額：{formatCredits(usageReconciliation?.walletBalance ?? walletBalance)}
            </p>
            {creditsModeState.mode === "dry_run" ? (
              <p className="mt-1 text-xs text-slate-500">目前為試算模式，部分請求尚未進入正式扣點流程。</p>
            ) : null}
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              !usageReconciliation
                ? "bg-slate-100 text-slate-600"
                : reconciliationMismatch
                  ? "bg-slate-100 text-slate-600"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {!usageReconciliation ? "尚無對帳資料" : reconciliationMismatch ? "部分 request 尚未完成對帳" : "對帳正常"}
          </span>
        </div>
        {usageReconciliation ? (
          <p className="mt-3 text-xs text-slate-500">
            待比對 request：{usageReconciliation.mismatchedRequestIds.length.toLocaleString()} ·
            尚待串接請求：{usageReconciliation.orphanUsageEvents.length.toLocaleString()} ·
            未連結交易：{usageReconciliation.orphanUsageTransactions.length.toLocaleString()} ·
            重複交易檢查：{usageReconciliation.duplicateUsageTransactions.length.toLocaleString()}
          </p>
        ) : null}
      </DashboardCard>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <p className="text-[15px] font-medium text-slate-900">儲值方案</p>
        <p className="mt-1 text-sm text-slate-600">彈性補充用量，價格高於訂閱 included credits，適合短期尖峰需求。</p>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-slate-50/70">
          <table className="min-w-full text-sm">
            <thead className="text-sm font-medium text-slate-500">
              <tr>
                <th className="px-3 py-3 text-left font-medium">方案</th>
                <th className="px-3 py-3 text-left font-medium">金額</th>
                <th className="px-3 py-3 text-left font-medium">入帳 credits</th>
                <th className="px-3 py-3 text-left font-medium">單價 / credit</th>
                <th className="px-3 py-3 text-right font-medium">購買</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr
                  key={pkg.code}
                  className="border-t border-slate-200/70 transition hover:bg-white/70"
                >
                  <td className="px-3 py-3 text-sm font-medium text-slate-700">
                    {pkg.label}
                    {pkg.highlight === "best_value" ? (
                      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        最划算
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatMoney(pkg.priceMinor, pkg.currency)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCredits(pkg.credits)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">${getPricePerCredit(pkg).toFixed(5)}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => void handleBuyPack(pkg.code)}
                      disabled={pendingPack !== null}
                      className={buttonClass("primary", "h-9 rounded-lg px-4 text-xs")}
                    >
                      {pendingPack === pkg.code ? "開啟結帳…" : "購買"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {purchaseError ? <p className="mt-3 text-xs text-red-600">{purchaseError}</p> : null}
        <p className="mt-3 text-xs text-slate-500">
          付款完成後由 Polar 通知入帳，credits 會自動加進錢包；若尚未顯示，稍候重新整理即可。
        </p>
      </DashboardCard>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white px-6 py-5 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium text-slate-900">使用訂閱方案節省成本</p>
            <p className="mt-1 text-sm text-slate-600">改用訂閱方案可降低單次呼叫成本，並取得更高穩定性與配額。</p>
          </div>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-10 rounded-xl px-5 text-sm")}>
            查看方案
          </Link>
        </div>
      </DashboardCard>

      <section className="flex flex-col gap-6">
        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">花費</p>
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeMonthIndex === 0}
                aria-label="上個月"
              >
                <span className="inline-block h-4 w-4">‹</span>
              </button>
              <span className="text-lg font-medium text-slate-700">{monthLabel(activeMonthKey)}</span>
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.min(spendMonths.length - 1, prev + 1))}
                disabled={spendMonths.length === 0 || activeMonthIndex >= spendMonths.length - 1}
                aria-label="下個月"
              >
                <span className="inline-block h-4 w-4">›</span>
              </button>
            </div>
          </div>
          {!hasSpendData ? (
            <p className="mt-6 text-sm text-slate-500">目前沒有花費紀錄。儲值或訂閱後,這裡會顯示實際交易。</p>
          ) : null}
          {spendSeriesData.hasExcludedCurrencies ? (
            <p className="mt-2 text-xs text-amber-600">
              圖表僅計 USD。你有以新台幣計價的歷史交易,未併入此圖(不同幣別不可直接相加)。
            </p>
          ) : null}
          <div className="mt-6 h-[260px]" hidden={!hasSpendData}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendSeries} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748b" stopOpacity={0.16} />
                    <stop offset="100%" stopColor="#64748b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatMoney(Number(value) * 100, "USD")}
                  ticks={[0, spendAxisMax / 2, spendAxisMax]}
                  domain={[0, spendAxisMax]}
                  width={58}
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
                    return [formatMoney(safeValue * 100, "USD"), "花費"];
                  }}
                  labelFormatter={(label) => `日期 ${label}`}
                />
                <Area type="monotone" dataKey="spend" stroke="#1f2937" strokeWidth={1.8} fill="url(#spendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[15px] font-medium text-slate-900">交易記錄</p>
            <button
              type="button"
              onClick={() => downloadTransactionsCsv(filteredTransactions, transactionFilter)}
              disabled={filteredTransactions.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <Download className="h-4 w-4" />
              匯出 CSV
            </button>
          </div>
          <div className="mt-4 inline-flex rounded-xl bg-slate-100 p-1">
            {TRANSACTION_FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTransactionFilter(option.id)}
                className={`h-8 rounded-lg px-3 text-xs font-medium transition ${
                  transactionFilter === option.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="px-2 py-3 text-left font-medium">類型</th>
                  <th className="px-2 py-3 text-left font-medium">說明</th>
                  <th className="px-2 py-3 text-left font-medium">credits 變化</th>
                  <th className="px-2 py-3 text-left font-medium">金額</th>
                  <th className="px-2 py-3 text-left font-medium">日期</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0
                  ? filteredTransactions.map((transaction) => {
                      const usageMeta = extractUsageMetadata(transaction);
                      return (
                      <tr key={transaction.id} className="border-t border-slate-100">
                        <td className="px-2 py-3 text-sm text-slate-700">
                          {getTransactionTypeLabel(transaction.type)}
                          <span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
                            {getTransactionStatusLabel(transaction.status)}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-slate-700">
                          {transaction.type === "usage" ? (
                            <div className="space-y-1">
                              <p>{usageMeta ? usageMeta.datasetSlug : "API usage"}</p>
                              <p className="text-xs text-slate-500">
                                request {usageMeta ? toShortRequestId(usageMeta.requestId) : "—"}
                              </p>
                            </div>
                          ) : null}
                          {transaction.type === "refund" ? (
                            <div className="space-y-1">
                              <p>{transaction.packageCode ? `退款：方案 ${transaction.packageCode}` : "退款"}</p>
                              <p className="text-xs text-slate-500">credits 已扣回</p>
                            </div>
                          ) : null}
                          {transaction.type === "purchase" ? (
                            <div className="space-y-1">
                              <p>{transaction.packageCode ? `方案 ${transaction.packageCode}` : "儲值"}</p>
                              <p className="text-xs text-slate-500">provider：{transaction.provider ?? "—"}</p>
                            </div>
                          ) : null}
                          {transaction.type === "adjustment" ? (
                            <p>{transaction.description || "manual adjustment"}</p>
                          ) : null}
                          {transaction.type !== "usage" && transaction.type !== "purchase" && transaction.type !== "adjustment" ? (
                            <p>{transaction.description || "—"}</p>
                          ) : null}
                          {transaction.description ? (
                            <p className="mt-1 text-xs text-slate-400">{transaction.description}</p>
                          ) : null}
                        </td>
                        <td className="px-2 py-3 text-sm text-slate-700">
                          <span className={`${transaction.credits >= 0 ? "text-emerald-700" : "text-slate-800"}`}>
                            {transaction.credits >= 0
                              ? `+${formatCredits(transaction.credits)} credits`
                              : `${formatCredits(transaction.credits)} credits`}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-slate-700">{formatTransactionAmount(transaction)}</td>
                        <td className="px-2 py-3 text-sm text-slate-700">
                          {formatTransactionDate(transaction.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                  : null}
                {filteredTransactions.length === 0 ? (
                  <tr className="border-t border-slate-100">
                    <td colSpan={5} className="px-2 py-6 text-center text-slate-500">
                      尚無交易紀錄。
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}
