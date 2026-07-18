import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { buttonClass } from "@/src/components/ui/button";
import { CancelSubscriptionDialog } from "@/src/components/dashboard/cancel-subscription-dialog";
import { formatPlanPrice, getPlanByCode, isPlanCode } from "@/src/lib/billing/plans";
import {
  getSubscriptionStatusDescription,
  getSubscriptionStatusLabel,
  getSubscriptionStatusTone,
  isPendingAuthorization,
  isSubscriptionCancelable,
  needsPlanRetryAction,
} from "@/src/lib/billing/status";

type BillingLandingPageProps = {
  subscription: {
    id: string;
    planCode: string;
    status: string;
    billingCycle: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    cancelReason: string | null;
    cancelReasonDetail: string | null;
  } | null;
};

function formatPlanName(planCode: string) {
  if (isPlanCode(planCode)) {
    return getPlanByCode(planCode).displayName;
  }
  return planCode;
}

function formatPlanAmount(planCode: string, locale: AppLocale, contactUsLabel: string, perMonthLabel: string) {
  if (!isPlanCode(planCode)) return "—";
  const plan = getPlanByCode(planCode);
  if (plan.monthlyAmountMinor === null) return contactUsLabel;
  return `${formatPlanPrice(plan.monthlyAmountMinor, plan.currency, locale)} / ${perMonthLabel}`;
}

function getToneClass(tone: ReturnType<typeof getSubscriptionStatusTone>) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "info") return "border-sky-200 bg-sky-50 text-sky-700";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  if (tone === "danger") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatDate(date: Date | null, locale: AppLocale) {
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale === "en" ? "en-CA" : "zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function BillingLandingPage({ subscription }: BillingLandingPageProps) {
  const t = useTranslations("billing");
  const locale = useLocale() as AppLocale;
  const statusLabel = subscription
    ? getSubscriptionStatusLabel(subscription.status, subscription.cancelAtPeriodEnd, locale)
    : null;
  const statusDescription = subscription
    ? getSubscriptionStatusDescription(
        {
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          currentPeriodEnd: subscription.currentPeriodEnd,
        },
        locale,
      )
    : null;
  const statusTone = subscription
    ? getSubscriptionStatusTone(subscription.status, subscription.cancelAtPeriodEnd)
    : null;
  const canCancel = subscription
    ? isSubscriptionCancelable({
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      })
    : false;
  const showRetryAction = subscription ? needsPlanRetryAction(subscription.status) : false;
  const showPendingHint = subscription ? isPendingAuthorization(subscription.status) : false;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("landing.title")}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("landing.subtitle")}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t("landing.currentPlanHeading")}</h2>
        {subscription ? (
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>{t("landing.planLine", { plan: formatPlanName(subscription.planCode) })}</p>
            <p>{t("landing.planPriceLine", { price: formatPlanAmount(subscription.planCode, locale, t("contactUs"), t("perMonth")) })}</p>
            {statusLabel && statusDescription && statusTone ? (
              <div className={`rounded-xl border px-3 py-2 ${getToneClass(statusTone)}`}>
                <p className="text-sm font-medium">{t("landing.statusLine", { status: statusLabel })}</p>
                <p className="mt-1 text-sm">{statusDescription}</p>
              </div>
            ) : null}
            <p>{t("landing.cycleLine", { cycle: subscription.billingCycle === "yearly" ? t("landing.cycleYearly") : t("landing.cycleMonthly") })}</p>
            <p>{t("landing.periodEndLine", { date: formatDate(subscription.currentPeriodEnd, locale) })}</p>
            <p>{t("landing.cancelAtPeriodEndLine", { state: subscription.cancelAtPeriodEnd ? t("landing.scheduled") : t("landing.notScheduled") })}</p>

            {showPendingHint ? (
              <div className="pt-1">
                <Link href="/pricing" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                  {t("landing.backToPricing")}
                </Link>
              </div>
            ) : null}

            {showRetryAction ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/pricing" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                  {t("landing.chooseAgain")}
                </Link>
                <Link href="/contact" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                  {t("contactUs")}
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">{t("landing.noPaidPlan")}</p>
        )}
        {subscription && canCancel ? <CancelSubscriptionDialog subscription={subscription} /> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-lg font-semibold text-slate-900">{t("landing.subscriptionsCardTitle")}</p>
          <p className="mt-2 text-sm text-slate-600">{t("landing.subscriptionsCardBody")}</p>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "mt-5")}>{t("landing.subscriptionsCardCta")}</Link>
        </DashboardCard>
        <DashboardCard>
          <p className="text-lg font-semibold text-slate-900">{t("landing.creditsCardTitle")}</p>
          <p className="mt-2 text-sm text-slate-600">{t("landing.creditsCardBody")}</p>
          <Link href="/billing/credits" className={buttonClass("secondary", "mt-5")}>{t("landing.creditsCardCta")}</Link>
        </DashboardCard>
      </section>
    </div>
  );
}
