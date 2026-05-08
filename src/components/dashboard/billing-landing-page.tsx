import Link from "next/link";

import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { buttonClass } from "@/src/components/ui/button";
import { CancelSubscriptionDialog } from "@/src/components/dashboard/cancel-subscription-dialog";
import { BILLING_PLANS, type PlanCode } from "@/src/lib/billing/plans";

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
  if (planCode in BILLING_PLANS) {
    return BILLING_PLANS[planCode as PlanCode].displayName;
  }
  return planCode;
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
            <p>狀態：{subscription.status}</p>
            <p>週期：{subscription.billingCycle === "yearly" ? "年繳" : "月繳"}</p>
            <p>目前區間結束：{formatDate(subscription.currentPeriodEnd)}</p>
            <p>期末取消：{subscription.cancelAtPeriodEnd ? "已排定" : "未排定"}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">目前尚未啟用付費訂閱方案。</p>
        )}
        {subscription ? <CancelSubscriptionDialog subscription={subscription} /> : null}
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
