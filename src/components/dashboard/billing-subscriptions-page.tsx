import type { ComponentType } from "react";
import { useLocale, useTranslations } from "next-intl";
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

import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";
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
import {
  getCancellationApiKeyDowngradeWarning,
  getCancellationEffectiveAtPeriodEnd,
} from "@/src/lib/legal/cancellation-copy";
import { CancelSubscriptionButton } from "@/src/components/dashboard/cancel-subscription-button";
import { ResumeSubscriptionButton } from "@/src/components/dashboard/resume-subscription-button";
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
  const t = useTranslations("billing");
  const locale = useLocale() as AppLocale;
  const plans = getBillingSubscriptionPlanViews(locale);
  const freeLimits = getPlanRequestLimits("free");
  const freeSummary =
    freeLimits.monthlyRequestQuota !== null && freeLimits.rateLimitPerMin !== null
      ? t("subscriptions.free.summary", {
          quota: freeLimits.monthlyRequestQuota.toLocaleString("en-US"),
          rpm: freeLimits.rateLimitPerMin,
        })
      : t("subscriptions.free.tier");

  return (
    <div className="py-8">
      <section className="mx-auto mb-5 max-w-6xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{t("subscriptions.free.current")}</p>
        <p className="mt-1 text-sm text-slate-600">{t("subscriptions.free.upgradePrompt", { summary: freeSummary })}</p>
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
                    {formatPlanPrice(plan.monthlyAmountMinor, plan.currency, locale)}
                    <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400"> / {t("perMonth")}</span>
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
  const t = useTranslations("billing");
  const locale = useLocale() as AppLocale;
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

      {sub && !cancelPending ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">{t("subscriptions.cancelSection.title")}</h3>
          <p className="mt-1 text-sm text-slate-600">{t("subscriptions.cancelSection.body")}</p>
          <div className="mt-4">
            <CancelSubscriptionButton
              periodEndLabel={formatDateYmd(sub.currentPeriodEnd ?? sub.endsAt)}
              effectiveClause={getCancellationEffectiveAtPeriodEnd(locale)}
              apiKeyWarning={getCancellationApiKeyDowngradeWarning(locale)}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function CancelPendingBanner({ sub }: { sub: PolarSubscriptionDetail }) {
  const t = useTranslations("billing");
  const untilDate = formatDateYmd(sub.endsAt ?? sub.currentPeriodEnd);
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} strokeWidth={1.8} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">{t("subscriptions.cancelPending.title")}</p>
          <p className="mt-1 text-sm">{t("subscriptions.cancelPending.body", { date: untilDate })}</p>
          <ResumeSubscriptionButton />
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
  const t = useTranslations("billing");
  const locale = useLocale() as AppLocale;
  const plan = BILLING_PLANS[planId];
  const limits = getPlanRequestLimits(planId);
  const quotaSummary =
    limits.monthlyRequestQuota !== null && limits.rateLimitPerMin !== null
      ? t("subscriptions.current.quota", {
          quota: limits.monthlyRequestQuota.toLocaleString("en-US"),
          rpm: limits.rateLimitPerMin.toLocaleString("en-US"),
          keys: plan.apiKeyLimit ?? "—",
        })
      : t("subscriptions.current.customQuota");
  const periodEnd = sub?.currentPeriodEnd ?? sub?.endsAt ?? null;
  const statusValue = sub?.status ?? "active";
  const badgeLabel = getSubscriptionStatusLabel(statusValue, cancelPending, locale);
  const badgeTone = getSubscriptionStatusTone(statusValue, cancelPending);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("subscriptions.current.eyebrow")}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{plan.displayName}</h2>
            <span className="text-sm text-slate-500">
              {formatPlanPrice(plan.monthlyAmountMinor, plan.currency, locale)} / {t("perMonth")}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{quotaSummary}</p>
          <p className="mt-1 text-xs text-slate-500">{t("subscriptions.current.overageNote")}</p>
        </div>
        <span className={cn("shrink-0 rounded-full border px-3 py-1 text-xs font-medium", BADGE_TONE_CLASS[badgeTone])}>
          {badgeLabel}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <CalendarClock size={15} strokeWidth={1.8} className="text-slate-400" />
          {subError ? (
            <span className="text-slate-400">{t("subscriptions.current.billingUnavailable")}</span>
          ) : cancelPending ? (
            <span>{t("subscriptions.current.serviceUntil", { date: formatDateYmd(periodEnd) })}</span>
          ) : sub?.amountMinor != null ? (
            <span>
              {t("subscriptions.current.nextChargeAmount", {
                date: formatDateYmd(periodEnd),
                amount: formatMoney(sub.amountMinor, sub.currency),
              })}
            </span>
          ) : (
            <span>{t("subscriptions.current.nextCharge", { date: formatDateYmd(periodEnd) })}</span>
          )}
        </span>

        <Link
          href="/pricing"
          className="ml-auto inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {t("subscriptions.current.adjustPlan")}
        </Link>
      </div>
    </section>
  );
}

function PaymentMethodCard({ result }: { result: PolarReadResult<PolarPaymentMethod | null> | null }) {
  const t = useTranslations("billing");
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <CreditCard size={16} strokeWidth={1.8} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">{t("subscriptions.paymentMethod.title")}</h3>
      </div>
      <div className="mt-3 text-sm">
        {result === null || !result.ok ? (
          <p className="text-slate-400">{t("subscriptions.paymentMethod.unavailable")}</p>
        ) : result.data === null ? (
          <p className="text-slate-500">{t("subscriptions.paymentMethod.none")}</p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
            <span className="font-medium capitalize">{result.data.brand}</span>
            <span className="tracking-widest text-slate-500">•••• {result.data.last4}</span>
            <span className="text-slate-400">
              {t("subscriptions.paymentMethod.expires", {
                value: `${String(result.data.expMonth).padStart(2, "0")}/${result.data.expYear}`,
              })}
            </span>
            {result.data.isDefault ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                {t("subscriptions.paymentMethod.default")}
              </span>
            ) : null}
          </div>
        )}
      </div>
      {result?.ok ? (
        <div className="mt-3">
          <a
            href="/api/billing/portal"
            className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {result.data ? t("subscriptions.paymentMethod.change") : t("subscriptions.paymentMethod.set")}
          </a>
        </div>
      ) : null}
    </section>
  );
}

const INVOICE_STATUS_KEY: Record<string, string> = {
  paid: "paid",
  pending: "pending",
  refunded: "refunded",
  partially_refunded: "partiallyRefunded",
  void: "void",
  draft: "draft",
};

function InvoicesCard({ result }: { result: PolarReadResult<PolarInvoice[]> | null }) {
  const t = useTranslations("billing");
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <ReceiptText size={16} strokeWidth={1.8} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">{t("subscriptions.invoices.title")}</h3>
      </div>
      <div className="mt-3 text-sm">
        {result === null || !result.ok ? (
          <p className="text-slate-400">{t("subscriptions.invoices.unavailable")}</p>
        ) : result.data.length === 0 ? (
          <p className="text-slate-500">{t("subscriptions.invoices.none")}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {result.data.map((invoice) => {
              const statusKey = INVOICE_STATUS_KEY[invoice.status.toLowerCase()];
              return (
                <li key={invoice.id} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-slate-800">{formatDateYmd(invoice.createdAt)}</p>
                    {invoice.invoiceNumber ? (
                      <p className="truncate text-xs text-slate-400">{t("subscriptions.invoices.number", { number: invoice.invoiceNumber })}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-slate-700">{formatMoney(invoice.amountMinor, invoice.currency)}</span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                      {statusKey ? t(`subscriptions.invoiceStatus.${statusKey}`) : invoice.status}
                    </span>
                    <a
                      href={`/api/billing/invoice/${invoice.id}`}
                      className="text-xs font-medium text-slate-500 underline underline-offset-2 transition hover:text-slate-800"
                    >
                      {t("subscriptions.invoices.invoiceLink")}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
