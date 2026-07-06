import Link from "next/link";

import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { buttonClass } from "@/src/components/ui/button";
import { CancelSubscriptionDialog } from "@/src/components/dashboard/cancel-subscription-dialog";
import { formatPlanCurrency, getPlanByCode, isPlanCode } from "@/src/lib/billing/plans";
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

function formatPlanAmount(planCode: string) {
  if (!isPlanCode(planCode)) return "—";
  const plan = getPlanByCode(planCode);
  if (plan.monthlyAmount === null) return "聯繫我們";
  return `${formatPlanCurrency(plan.monthlyAmount)} / 月`;
}

function getToneClass(tone: ReturnType<typeof getSubscriptionStatusTone>) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "info") return "border-sky-200 bg-sky-50 text-sky-700";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  if (tone === "danger") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function BillingLandingPage({ subscription }: BillingLandingPageProps) {
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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">帳務</h1>
        <p className="mt-2 text-sm text-slate-600">管理訂閱方案、credits 與付款相關資訊。</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">目前方案</h2>
        {subscription ? (
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>方案：{formatPlanName(subscription.planCode)}</p>
            <p>方案價格：{formatPlanAmount(subscription.planCode)}</p>
            {statusLabel && statusDescription && statusTone ? (
              <div className={`rounded-xl border px-3 py-2 ${getToneClass(statusTone)}`}>
                <p className="text-sm font-medium">狀態：{statusLabel}</p>
                <p className="mt-1 text-sm">{statusDescription}</p>
              </div>
            ) : null}
            <p>週期：{subscription.billingCycle === "yearly" ? "年繳" : "月繳"}</p>
            <p>目前區間結束：{formatDate(subscription.currentPeriodEnd)}</p>
            <p>期末取消：{subscription.cancelAtPeriodEnd ? "已排定" : "未排定"}</p>

            {showPendingHint ? (
              <div className="pt-1">
                <Link href="/pricing" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                  返回方案價格
                </Link>
              </div>
            ) : null}

            {showRetryAction ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/pricing" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                  重新選擇方案
                </Link>
                <Link href="/contact" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                  聯繫我們
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">目前尚未啟用付費訂閱方案。</p>
        )}
        {subscription && canCancel ? <CancelSubscriptionDialog subscription={subscription} /> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-lg font-semibold text-slate-900">訂閱方案</p>
          <p className="mt-2 text-sm text-slate-600">查看方案、切換月繳/年繳，並選擇最適合的訂閱層級。</p>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "mt-5")}>前往訂閱方案</Link>
        </DashboardCard>
        <DashboardCard>
          <p className="text-lg font-semibold text-slate-900">Credits</p>
          <p className="mt-2 text-sm text-slate-600">查看 credit balance、端點計價與交易紀錄。</p>
          <Link href="/billing/credits" className={buttonClass("secondary", "mt-5")}>前往 Credits</Link>
        </DashboardCard>
      </section>
    </div>
  );
}
