import Link from "next/link";
import type { ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarClock,
  Clock3,
  Cpu,
  CreditCard,
  Database,
  Gauge,
  KeyRound,
  Layers3,
  ReceiptText,
  Shield,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { cn } from "@/src/lib/cn";
import { formatMoney } from "@/src/lib/billing/money";
import {
  BILLING_PLANS,
  formatPlanPrice,
  getBillingSubscriptionPlanViews,
  getPlanRequestLimits,
  type PlanCode,
  type PlanHighlightIcon,
} from "@/src/lib/billing/plans";
import {
  getSubscriptionStatusLabel,
  getSubscriptionStatusTone,
  type SubscriptionStatusTone,
} from "@/src/lib/billing/status";
import type {
  PolarBillingSnapshot,
  PolarInvoice,
  PolarPaymentMethod,
  PolarReadResult,
  PolarSubscriptionDetail,
} from "@/src/lib/billing/polar-subscription";

type PaidPlanCode = Exclude<PlanCode, "enterprise">;

const ICON_MAP: Record<PlanHighlightIcon, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  database: Database,
  key: KeyRound,
  gauge: Gauge,
  activity: Activity,
  layers3: Layers3,
  shield: Shield,
  barChart3: BarChart3,
  clock3: Clock3,
  users: Users,
  cpu: Cpu,
  workflow: Workflow,
  zap: Zap,
  sparkles: Sparkles,
  briefcase: Users,
  headphones: Shield,
  server: Cpu,
};

const CARD_CTA_BASE_CLASS =
  "inline-flex h-12 w-full items-center justify-center rounded-2xl border px-5 text-sm font-medium transition-colors duration-150";
const CARD_CTA_CLASS = `${CARD_CTA_BASE_CLASS} border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100`;

const BADGE_TONE_CLASS: Record<SubscriptionStatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
};

type BillingSubscriptionsPageProps = {
  /** Paid plan the user is entitled to (from the read API), or null when on the free tier. */
  currentPlanId: PaidPlanCode | null;
  /** Live Polar snapshot; null when the user is on the free tier (not fetched). */
  polar: PolarBillingSnapshot | null;
};

/** Stable UTC YYYY-MM-DD so the displayed date does not shift with server timezone. */
function formatDateYmd(date: Date | null): string {
  if (!date) return "—";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BillingSubscriptionsPage({ currentPlanId, polar }: BillingSubscriptionsPageProps) {
  if (!currentPlanId) {
    return <FreeUpgradeView />;
  }
  return <PaidBillingView planId={currentPlanId} polar={polar} />;
}

// ---------------------------------------------------------------------------
// State A — free user: current-tier strip + the four upgrade cards.
// ---------------------------------------------------------------------------

function FreeUpgradeView() {
  const plans = getBillingSubscriptionPlanViews();
  const freeLimits = getPlanRequestLimits("free");
  const freeSummary =
    freeLimits.monthlyRequestQuota !== null && freeLimits.rateLimitPerMin !== null
      ? `每月 ${freeLimits.monthlyRequestQuota.toLocaleString("en-US")} 次・RPM ${freeLimits.rateLimitPerMin}・1 把 API 金鑰`
      : "免費層";

  return (
    <div className="py-8">
      <section className="mx-auto mb-5 max-w-6xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-medium text-slate-900">目前：免費層</p>
        <p className="mt-1 text-sm text-slate-600">{freeSummary}。升級以取得更高配額、更多資料集與 API 金鑰。</p>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article
            key={plan.planCode}
            className={cn(
              "h-full min-h-[600px] rounded-2xl border bg-white p-6 sm:p-7",
              plan.featured ? "border-slate-900" : "border-slate-200",
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[1.65rem] font-medium tracking-tight text-slate-900">{plan.displayName}</h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {plan.usageMultiplier}
                  </span>
                </div>

                <div className="pt-1">
                  <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">
                    {formatPlanPrice(plan.monthlyAmountMinor, plan.currency)}
                    <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400"> / 月</span>
                  </p>
                </div>

                <p className="min-h-[3rem] text-sm font-normal leading-6 text-slate-600">{plan.summary}</p>

                <div className="pt-2">
                  <Link href="/pricing" className={CARD_CTA_CLASS}>
                    {plan.ctaLabel}
                  </Link>
                </div>

                <ul className="space-y-3.5 pt-2 text-[13px] text-slate-600">
                  {plan.highlights.map((item) => {
                    const Icon = ICON_MAP[item.icon];
                    return (
                      <li key={`${plan.planCode}-${item.text}`} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-slate-400">
                          <Icon size={15} strokeWidth={1.65} />
                        </span>
                        <span className="leading-6">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// State B / C — paid user: current-plan card + payment method + invoices.
// (Cancel button + confirm modal + resume button ship in PR2 with their action.)
// ---------------------------------------------------------------------------

function PaidBillingView({ planId, polar }: { planId: PaidPlanCode; polar: PolarBillingSnapshot | null }) {
  const subResult = polar?.subscription ?? null;
  const sub = subResult?.ok ? subResult.data : null;
  const subError = subResult !== null && !subResult.ok;
  const cancelPending = sub?.cancelAtPeriodEnd ?? false;

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      {cancelPending && sub ? <CancelPendingBanner sub={sub} /> : null}

      <CurrentPlanCard planId={planId} sub={sub} subError={subError} cancelPending={cancelPending} />

      <PaymentMethodCard result={polar?.paymentMethod ?? null} />

      <InvoicesCard result={polar?.invoices ?? null} />
    </div>
  );
}

function CancelPendingBanner({ sub }: { sub: PolarSubscriptionDetail }) {
  const untilDate = formatDateYmd(sub.endsAt ?? sub.currentPeriodEnd);
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} strokeWidth={1.8} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">已排定取消</p>
          <p className="mt-1 text-sm">服務可使用至 {untilDate}，之後不再自動扣款。</p>
        </div>
      </div>
    </section>
  );
}

function CurrentPlanCard({
  planId,
  sub,
  subError,
  cancelPending,
}: {
  planId: PaidPlanCode;
  sub: PolarSubscriptionDetail | null;
  subError: boolean;
  cancelPending: boolean;
}) {
  const plan = BILLING_PLANS[planId];
  const limits = getPlanRequestLimits(planId);
  const quotaSummary =
    limits.monthlyRequestQuota !== null && limits.rateLimitPerMin !== null
      ? `每月 ${limits.monthlyRequestQuota.toLocaleString("en-US")} 次・RPM ${limits.rateLimitPerMin.toLocaleString("en-US")}・${plan.apiKeyLimit ?? "—"} 把 API 金鑰`
      : "客製配額";
  const periodEnd = sub?.currentPeriodEnd ?? sub?.endsAt ?? null;
  const statusValue = sub?.status ?? "active";
  const badgeLabel = getSubscriptionStatusLabel(statusValue, cancelPending);
  const badgeTone = getSubscriptionStatusTone(statusValue, cancelPending);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">目前方案</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{plan.displayName}</h2>
            <span className="text-sm text-slate-500">
              {formatPlanPrice(plan.monthlyAmountMinor, plan.currency)} / 月
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{quotaSummary}</p>
        </div>
        <span className={cn("shrink-0 rounded-full border px-3 py-1 text-xs font-medium", BADGE_TONE_CLASS[badgeTone])}>
          {badgeLabel}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <CalendarClock size={15} strokeWidth={1.8} className="text-slate-400" />
          {subError ? (
            <span className="text-slate-400">扣款資訊暫時無法讀取</span>
          ) : cancelPending ? (
            <span>服務可用至 {formatDateYmd(periodEnd)}</span>
          ) : (
            <span>
              下次扣款日 {formatDateYmd(periodEnd)}
              {sub?.amountMinor != null ? `（${formatMoney(sub.amountMinor, sub.currency)}）` : ""}
            </span>
          )}
        </span>

        <Link
          href="/pricing"
          className="ml-auto inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          調整方案
        </Link>
      </div>
    </section>
  );
}

function PaymentMethodCard({ result }: { result: PolarReadResult<PolarPaymentMethod | null> | null }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <CreditCard size={16} strokeWidth={1.8} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">付款方式</h3>
      </div>
      <div className="mt-3 text-sm">
        {result === null || !result.ok ? (
          <p className="text-slate-400">付款方式暫時無法讀取，請稍後再試。</p>
        ) : result.data === null ? (
          <p className="text-slate-500">尚未綁定付款方式。</p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
            <span className="font-medium capitalize">{result.data.brand}</span>
            <span className="tracking-widest text-slate-500">•••• {result.data.last4}</span>
            <span className="text-slate-400">
              到期 {String(result.data.expMonth).padStart(2, "0")}/{result.data.expYear}
            </span>
            {result.data.isDefault ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                預設
              </span>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

const INVOICE_STATUS_LABEL: Record<string, string> = {
  paid: "已付款",
  pending: "處理中",
  refunded: "已退款",
  partially_refunded: "部分退款",
  void: "已作廢",
  draft: "草稿",
};

function InvoicesCard({ result }: { result: PolarReadResult<PolarInvoice[]> | null }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <ReceiptText size={16} strokeWidth={1.8} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">扣款紀錄</h3>
      </div>
      <div className="mt-3 text-sm">
        {result === null || !result.ok ? (
          <p className="text-slate-400">扣款紀錄暫時無法讀取，請稍後再試。</p>
        ) : result.data.length === 0 ? (
          <p className="text-slate-500">尚無扣款紀錄。</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {result.data.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between gap-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-slate-800">{formatDateYmd(invoice.createdAt)}</p>
                  {invoice.invoiceNumber ? (
                    <p className="truncate text-xs text-slate-400">發票 {invoice.invoiceNumber}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-slate-700">{formatMoney(invoice.amountMinor, invoice.currency)}</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                    {INVOICE_STATUS_LABEL[invoice.status.toLowerCase()] ?? invoice.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
