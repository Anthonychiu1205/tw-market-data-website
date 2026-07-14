import Link from "next/link";
import type { ComponentType } from "react";
import {
  Activity,
  BarChart3,
  Clock3,
  Cpu,
  Database,
  Gauge,
  KeyRound,
  Layers3,
  Shield,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { cn } from "@/src/lib/cn";
import {
  formatPlanPrice,
  getBillingSubscriptionPlanViews,
  type PlanCode,
  type PlanHighlightIcon,
} from "@/src/lib/billing/plans";
import {
  getSubscriptionStatusDescription,
  getSubscriptionStatusLabel,
  getSubscriptionStatusTone,
  isPendingAuthorization,
  needsPlanRetryAction,
} from "@/src/lib/billing/status";

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

const CARD_CTA_BASE_CLASS = "inline-flex h-12 w-full items-center justify-center rounded-2xl border px-5 text-sm font-medium transition-colors duration-150";
const CARD_CTA_CLASS = `${CARD_CTA_BASE_CLASS} border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100`;

type BillingSubscriptionsPageProps = {
  currentPlanId: Exclude<PlanCode, "enterprise"> | null;
  subscription: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
  } | null;
};

function getToneClass(tone: ReturnType<typeof getSubscriptionStatusTone>) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "info") return "border-sky-200 bg-sky-50 text-sky-700";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  if (tone === "danger") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function BillingSubscriptionsPage({ currentPlanId, subscription }: BillingSubscriptionsPageProps) {
  const plans = getBillingSubscriptionPlanViews();
  const statusLabel = subscription
    ? getSubscriptionStatusLabel(subscription.status, subscription.cancelAtPeriodEnd)
    : null;
  const statusDescription = subscription
    ? getSubscriptionStatusDescription({
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        currentPeriodEnd: subscription.currentPeriodEnd,
      })
    : null;
  const statusTone = subscription
    ? getSubscriptionStatusTone(subscription.status, subscription.cancelAtPeriodEnd)
    : null;
  const showPendingHint = subscription ? isPendingAuthorization(subscription.status) : false;
  const showRetryAction = subscription ? needsPlanRetryAction(subscription.status) : false;

  return (
    <div className="py-8">
      {subscription && statusLabel && statusDescription && statusTone ? (
        <section className={`mb-5 rounded-2xl border px-4 py-3 ${getToneClass(statusTone)}`}>
          <p className="text-sm font-medium">目前狀態：{statusLabel}</p>
          <p className="mt-1 text-sm">{statusDescription}</p>
          {showPendingHint ? (
            <Link
              href="/billing"
              className="mt-3 inline-flex h-9 items-center rounded-lg border border-current/20 px-3 text-xs font-medium transition hover:bg-white/50"
            >
              付款確認中，請稍候
            </Link>
          ) : null}
          {showRetryAction ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/pricing"
                className="inline-flex h-9 items-center rounded-lg border border-current/20 px-3 text-xs font-medium transition hover:bg-white/50"
              >
                重新選擇方案
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-9 items-center rounded-lg border border-current/20 px-3 text-xs font-medium transition hover:bg-white/50"
              >
                聯繫我們
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

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
                  {plan.planCode === currentPlanId ? (
                    <button
                      type="button"
                      disabled
                      className={cn(
                        CARD_CTA_BASE_CLASS,
                        "cursor-default border-slate-200 bg-slate-100 text-slate-500",
                      )}
                    >
                      目前方案
                    </button>
                  ) : (
                    <Link href="/pricing" className={CARD_CTA_CLASS}>
                      {plan.ctaLabel}
                    </Link>
                  )}
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
