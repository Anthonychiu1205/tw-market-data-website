"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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

import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";
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


function monthLabel(key: string, locale: AppLocale) {
  const [year, month] = key.split("-");
  if (locale === "en") {
    return new Intl.DateTimeFormat("en", { year: "numeric", month: "long" }).format(
      new Date(Number(year), Number(month) - 1, 1),
    );
  }
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
  labelKey: string;
}> = [
  { id: "all", labelKey: "transactions.filter.all" },
  { id: "usage", labelKey: "transactions.filter.usage" },
  { id: "purchase", labelKey: "transactions.filter.purchase" },
  { id: "refund", labelKey: "transactions.filter.refund" },
  { id: "adjustment", labelKey: "transactions.filter.adjustment" },
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

const TRANSACTION_TYPE_KEY: Record<string, string> = {
  purchase: "purchase",
  refund: "refund",
  usage: "usage",
  adjustment: "adjustment",
};

const TRANSACTION_STATUS_KEY: Record<string, string> = {
  completed: "completed",
  pending: "pending",
  failed: "failed",
  cancelled: "cancelled",
  expired: "expired",
  simulated: "simulated",
};

function formatTransactionDate(value: string, locale: AppLocale) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "en" ? "en-CA" : "zh-TW", {
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
  const t = useTranslations("billing");
  const locale = useLocale() as AppLocale;
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
            ? t("credits.topup.errors.checkoutUnavailable")
            : result.error === "unauthenticated"
              ? t("credits.topup.errors.unauthenticated")
              : t("credits.topup.errors.default"),
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
      setPurchaseError(t("credits.topup.errors.checkoutUnavailable"));
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
              <p className="text-[15px] font-medium text-slate-900">{t("credits.balance.title")}</p>
              <p className="mt-1 text-sm text-slate-600">{t("credits.balance.subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              title={t("credits.balance.refresh")}
              aria-label={t("credits.balance.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-5 text-5xl font-semibold tracking-tight text-slate-900">{formatCredits(walletBalance)}</p>
          <p className="mt-2 text-xs text-slate-500">
            {latestTransactionAt
              ? t("credits.balance.lastActivity", { date: formatTransactionDate(latestTransactionAt, locale) })
              : t("credits.balance.lastActivityNone")}
          </p>
          {/* Empty-state hint only. The old block had three internal status lines, one with inverted
              logic (a non-zero balance showed "wallet 未建立、餘額預設 0"). Customers do not need the
              mode/description internals — show only the "0 is normal" note, and only when it is 0. */}
          {walletBalance === 0 ? (
            <p className="mt-1 text-xs text-slate-500">{t("credits.balance.zeroNote")}</p>
          ) : null}
        </DashboardCard>

        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <p className="text-[15px] font-medium text-slate-900">{t("credits.costTable.title")}</p>
          <p className="mt-1 text-sm text-slate-600">{t("credits.costTable.subtitle")}</p>

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
                  <th className="px-3 py-3 text-left font-medium">{t("credits.costTable.dataset")}</th>
                  <th className="px-3 py-3 text-left font-medium">{t("credits.costTable.endpoint")}</th>
                  <th className="px-3 py-3 text-left font-medium">{t("credits.costTable.cost")}</th>
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
            {t("credits.costTable.note", { mode: getCreditsModeLabel(creditsModeState, locale) })}
          </p>
        </DashboardCard>
      </section>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <p className="text-[15px] font-medium text-slate-900">{t("credits.billingMethod.title")}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>{t("credits.billingMethod.b1")}</li>
          <li>{t("credits.billingMethod.b2")}</li>
          <li>{t("credits.billingMethod.b3")}</li>
          <li>{t("credits.billingMethod.b4")}</li>
        </ul>
        {creditsModeState.mode === "dry_run" ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {t("credits.billingMethod.dryRunNote")}
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-500">{t("credits.billingMethod.enabledNote")}</p>
        )}
      </DashboardCard>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium text-slate-900">{t("credits.reconciliation.title", { days: usageReconciliation?.windowDays ?? 30 })}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t("credits.reconciliation.detail", {
                events: (usageReconciliation?.totalUsageEvents ?? 0).toLocaleString(),
                estimated: (usageReconciliation?.totalChargedCredits ?? 0).toLocaleString(),
                charged: (usageReconciliation?.totalTransactionCredits ?? 0).toLocaleString(),
                balance: formatCredits(usageReconciliation?.walletBalance ?? walletBalance),
              })}
            </p>
            {creditsModeState.mode === "dry_run" ? (
              <p className="mt-1 text-xs text-slate-500">{t("credits.reconciliation.dryRunHint")}</p>
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
            {!usageReconciliation
              ? t("credits.reconciliation.noData")
              : reconciliationMismatch
                ? t("credits.reconciliation.partial")
                : t("credits.reconciliation.ok")}
          </span>
        </div>
        {usageReconciliation && reconciliationMismatch ? (
          <p className="mt-3 text-xs text-slate-500">
            {t("credits.reconciliation.mismatch", {
              mismatched: usageReconciliation.mismatchedRequestIds.length.toLocaleString(),
              duplicate: usageReconciliation.duplicateUsageTransactions.length.toLocaleString(),
              orphan: usageReconciliation.orphanUsageTransactions.length.toLocaleString(),
            })}
          </p>
        ) : null}
      </DashboardCard>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <p className="text-[15px] font-medium text-slate-900">{t("credits.topup.title")}</p>
        <p className="mt-1 text-sm text-slate-600">{t("credits.topup.subtitle")}</p>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-slate-50/70">
          <table className="min-w-full text-sm">
            <thead className="text-sm font-medium text-slate-500">
              <tr>
                <th className="px-3 py-3 text-left font-medium">{t("credits.topup.plan")}</th>
                <th className="px-3 py-3 text-left font-medium">{t("credits.topup.amount")}</th>
                <th className="px-3 py-3 text-left font-medium">{t("credits.topup.creditsGranted")}</th>
                <th className="px-3 py-3 text-left font-medium">{t("credits.topup.unitPrice")}</th>
                <th className="px-3 py-3 text-right font-medium">{t("credits.topup.buy")}</th>
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
                        {t("credits.topup.bestValue")}
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
                      {pendingPack === pkg.code ? t("credits.topup.openingCheckout") : t("credits.topup.buy")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {purchaseError ? <p className="mt-3 text-xs text-red-600">{purchaseError}</p> : null}
        <p className="mt-3 text-xs text-slate-500">{t("credits.topup.note")}</p>
      </DashboardCard>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white px-6 py-5 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium text-slate-900">{t("credits.saveCard.title")}</p>
            <p className="mt-1 text-sm text-slate-600">{t("credits.saveCard.body")}</p>
          </div>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-10 rounded-xl px-5 text-sm")}>
            {t("credits.saveCard.cta")}
          </Link>
        </div>
      </DashboardCard>

      <section className="flex flex-col gap-6">
        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">{t("credits.spend.title")}</p>
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeMonthIndex === 0}
                aria-label={t("credits.spend.prevMonth")}
              >
                <span className="inline-block h-4 w-4">‹</span>
              </button>
              <span className="text-lg font-medium text-slate-700">{monthLabel(activeMonthKey, locale)}</span>
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.min(spendMonths.length - 1, prev + 1))}
                disabled={spendMonths.length === 0 || activeMonthIndex >= spendMonths.length - 1}
                aria-label={t("credits.spend.nextMonth")}
              >
                <span className="inline-block h-4 w-4">›</span>
              </button>
            </div>
          </div>
          {!hasSpendData ? (
            <p className="mt-6 text-sm text-slate-500">{t("credits.spend.empty")}</p>
          ) : null}
          {spendSeriesData.hasExcludedCurrencies ? (
            <p className="mt-2 text-xs text-amber-600">{t("credits.spend.usdOnly")}</p>
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
                    return [formatMoney(safeValue * 100, "USD"), t("credits.spend.title")];
                  }}
                  labelFormatter={(label) => t("credits.spend.tooltipDate", { date: String(label) })}
                />
                <Area type="monotone" dataKey="spend" stroke="#1f2937" strokeWidth={1.8} fill="url(#spendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[15px] font-medium text-slate-900">{t("credits.transactions.title")}</p>
            <button
              type="button"
              onClick={() => downloadTransactionsCsv(filteredTransactions, transactionFilter)}
              disabled={filteredTransactions.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <Download className="h-4 w-4" />
              {t("credits.transactions.exportCsv")}
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
                {t(`credits.${option.labelKey}`)}
              </button>
            ))}
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="px-2 py-3 text-left font-medium">{t("credits.transactions.type")}</th>
                  <th className="px-2 py-3 text-left font-medium">{t("credits.transactions.description")}</th>
                  <th className="px-2 py-3 text-left font-medium">{t("credits.transactions.creditsChange")}</th>
                  <th className="px-2 py-3 text-left font-medium">{t("credits.transactions.amount")}</th>
                  <th className="px-2 py-3 text-left font-medium">{t("credits.transactions.date")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0
                  ? filteredTransactions.map((transaction) => {
                      const usageMeta = extractUsageMetadata(transaction);
                      return (
                      <tr key={transaction.id} className="border-t border-slate-100">
                        <td className="px-2 py-3 text-sm text-slate-700">
                          {t(`credits.transactions.typeLabel.${TRANSACTION_TYPE_KEY[transaction.type] ?? "other"}`)}
                          <span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
                            {t(`credits.transactions.statusLabel.${TRANSACTION_STATUS_KEY[transaction.status] ?? "unconfirmed"}`)}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-slate-700">
                          {transaction.type === "usage" ? (
                            <div className="space-y-1">
                              <p>{usageMeta ? usageMeta.datasetSlug : "API usage"}</p>
                              <p className="text-xs text-slate-500">
                                {t("credits.transactions.request", { id: usageMeta ? toShortRequestId(usageMeta.requestId) : "—" })}
                              </p>
                            </div>
                          ) : null}
                          {transaction.type === "refund" ? (
                            <div className="space-y-1">
                              <p>{transaction.packageCode ? t("credits.transactions.refundWithPackage", { code: transaction.packageCode }) : t("credits.transactions.refund")}</p>
                              <p className="text-xs text-slate-500">{t("credits.transactions.creditsReturned")}</p>
                            </div>
                          ) : null}
                          {transaction.type === "purchase" ? (
                            <div className="space-y-1">
                              <p>{transaction.packageCode ? t("credits.transactions.packageLabel", { code: transaction.packageCode }) : t("credits.transactions.topup")}</p>
                              <p className="text-xs text-slate-500">{t("credits.transactions.provider", { provider: transaction.provider ?? "—" })}</p>
                            </div>
                          ) : null}
                          {transaction.type === "adjustment" ? (
                            <p>{transaction.description || t("credits.transactions.manualAdjustment")}</p>
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
                          {formatTransactionDate(transaction.createdAt, locale)}
                        </td>
                      </tr>
                    );
                  })
                  : null}
                {filteredTransactions.length === 0 ? (
                  <tr className="border-t border-slate-100">
                    <td colSpan={5} className="px-2 py-6 text-center text-slate-500">
                      {t("credits.transactions.empty")}
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
