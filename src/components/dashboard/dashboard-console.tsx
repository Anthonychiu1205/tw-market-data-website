import Link from "next/link";

import type {
  ApiKeysSummary,
  BillingSummary,
  UsageRequestsSummary,
  UsageSummary,
} from "@/src/lib/backend-adapter";
import { DashboardSection } from "@/src/content/dashboard";
import { cn } from "@/src/lib/cn";

import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { ApiKeysManager } from "@/src/components/dashboard/api-keys-manager";
import { BillingLandingPage } from "@/src/components/dashboard/billing-landing-page";
import { BillingSubscriptionsPage } from "@/src/components/dashboard/billing-subscriptions-page";
import { BillingCreditsPage } from "@/src/components/dashboard/billing-credits-page";
import { UsagePageShell } from "@/src/components/dashboard/usage-page-shell";
import { RequestResponsePlayground } from "@/src/components/dashboard/request-response-playground";
import { OverviewUsageChart } from "@/src/components/dashboard/overview-usage-chart";
import { AccountProfileForm } from "@/src/components/dashboard/account-profile-form";
import { ResearchTerminalEntryCard } from "@/src/components/dashboard/research-terminal-entry-card";
import type { CreditsDeductionRuntimeState } from "@/src/lib/billing/credits-mode";
import { getCreditsModeDescription, getCreditsModeLabel } from "@/src/lib/billing/credits-mode";

type DashboardConsoleProps = {
  email: string;
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
  billing: BillingSummary;
  usage: UsageSummary;
  usageRequests: UsageRequestsSummary;
  apiKeys: ApiKeysSummary;
  entitlement: {
    planCode: string;
    planName: string;
    source: "subscription" | "backend" | "fallback";
    subscriptionStatus?: string;
    isEntitled: boolean;
    apiKeyLimit?: number | null;
    datasetLimit?: string | null;
    requestLimitLabel?: string | null;
  };
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
  creditWalletBalance: number;
  creditsModeState: CreditsDeductionRuntimeState;
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
  creditTransactions: Array<{
    id: string;
    type: string;
    status: string;
    amountTwd: number | null;
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

type CreditState = "normal" | "low" | "exhausted";

function modeLabel(mode: "live" | "fallback") {
  return mode === "live" ? "已連接" : "簡化模式";
}

function PanelTitle({ title, description, mode }: { title: string; description: string; mode: "live" | "fallback" }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            mode === "live" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
          )}
        >
          {modeLabel(mode)}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </section>
  );
}

function usageHasEvents(usage: UsageSummary) {
  return usage.dailyUsage.some((item) => item.count > 0);
}

function getLatestActiveUsage(usage: UsageSummary) {
  const latest = [...usage.dailyUsage]
    .reverse()
    .find((item) => item.count > 0);
  return latest ?? null;
}

function UsageActivityCard({
  usage,
  creditsModeState,
}: {
  usage: UsageSummary;
  creditsModeState: CreditsDeductionRuntimeState;
}) {
  const hasEvents = usageHasEvents(usage);
  const latestActive = getLatestActiveUsage(usage);

  const monthlyUsed = Math.max(usage.monthlyUsed, 0);
  const monthlyQuota = Math.max(usage.monthlyQuota, 1);
  const monthlyRemaining = Math.max(monthlyQuota - monthlyUsed, 0);
  const monthlyUsedPct = Math.max(0, Math.min(100, (monthlyUsed / monthlyQuota) * 100));

  const now = new Date();
  const monthResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  const dayResetAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);

  function formatReset(date: Date) {
    return new Intl.DateTimeFormat("zh-TW", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  const monthlyResetLabel = formatReset(monthResetAt);
  const dailyResetLabel = formatReset(dayResetAt);
  const chartData = usage.dailyUsage.slice(-14).map((item) => ({
    date: item.date.slice(5),
    requests: item.count,
  }));
  const requestsToday = usage.requestsToday ?? 0;
  const requests30d = usage.requests30d ?? monthlyUsed;
  const estimatedCreditsUsage30d = usage.estimatedCreditsUsage30d ?? 0;
  const recentErrors = usage.recentErrors ?? [];

  return (
    <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
      <h2 className="text-base font-semibold text-slate-900">活動與用量</h2>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-slate-600">
            月度剩餘 {monthlyRemaining.toLocaleString()} / {monthlyQuota.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">
            已使用 {monthlyUsed.toLocaleString()}（{monthlyUsedPct.toFixed(1)}%）・重置於 {monthlyResetLabel}
          </p>
        </div>
        <p className="text-xs text-slate-500">速率限制 {usage.rateLimitPerMin} / 分鐘 ・日視窗參考重置於 {dailyResetLabel}</p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-700" style={{ width: `${monthlyUsedPct}%` }} />
      </div>

      <div className="mt-5 h-[220px]">
        <OverviewUsageChart data={chartData} />
      </div>

      <div className="mt-4 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
        <p>今日請求：{requestsToday.toLocaleString()}</p>
        <p>30 天請求：{requests30d.toLocaleString()}</p>
        <p>{`30 天${getCreditsModeLabel(creditsModeState)}：${estimatedCreditsUsage30d.toLocaleString()}`}</p>
      </div>

      {recentErrors.length > 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          最近錯誤：{recentErrors.slice(0, 3).map((item) => `${item.code} (${item.count})`).join("、")}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-slate-500">
        {hasEvents ? `最近活躍：${latestActive?.date} · ${latestActive?.count.toLocaleString()} 次` : "目前尚無足夠活動資料。"}
      </p>
      <p className="mt-1 text-xs text-slate-500">{getCreditsModeDescription(creditsModeState)}</p>
    </DashboardCard>
  );
}

function OverviewPanel({
  entitlement,
  usage,
  apiKeys,
  creditState,
  creditWalletBalance,
  creditsModeState,
}: {
  entitlement: DashboardConsoleProps["entitlement"];
  usage: UsageSummary;
  apiKeys: ApiKeysSummary;
  creditState: CreditState;
  creditWalletBalance: number;
  creditsModeState: CreditsDeductionRuntimeState;
}) {
  const activeKeysCount = apiKeys.keys.filter((item) => item.status !== "revoked").length;
  const requestsToday = usage.requestsToday ?? 0;
  const requests30d = usage.requests30d ?? usage.monthlyUsed;
  const entitlementSourceCopy =
    entitlement.source === "subscription"
      ? "方案資料已同步"
      : entitlement.source === "backend"
        ? "方案資料暫以帳戶摘要顯示"
        : "目前尚未啟用付費方案";

  return (
    <div className="space-y-3">
      <DashboardCard className="border-slate-200/80 bg-slate-50/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">
            目前方案：{entitlement.planName}
            {entitlement.isEntitled ? "（使用中）" : ""}
          </p>
          <p className="text-xs text-slate-500">{entitlementSourceCopy}</p>
        </div>
      </DashboardCard>

      <DashboardCard className="border-slate-200/80 bg-slate-50/60">
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-4">
          <p>
            API keys
            <span className="ml-2 font-semibold text-slate-900">{activeKeysCount}</span>
          </p>
          <p>
            今日請求
            <span className="ml-2 font-semibold text-slate-900">{requestsToday.toLocaleString()}</span>
          </p>
          <p>
            30 天請求
            <span className="ml-2 font-semibold text-slate-900">{requests30d.toLocaleString()}</span>
          </p>
          <p>
            可用 credits
            <span className="ml-2 font-semibold text-slate-900">{creditWalletBalance.toLocaleString()}</span>
          </p>
        </div>
        <p className="mt-2 text-xs text-slate-500">目前模式：{getCreditsModeLabel(creditsModeState)}</p>
      </DashboardCard>

      {creditState === "exhausted" ? (
        <DashboardCard className="border-amber-200 bg-amber-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">您的使用額度已用完</p>
              <p className="mt-1 text-sm text-amber-800">請升級方案或購買 credits，恢復資料查詢。</p>
            </div>
            <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
              升級方案
            </Link>
          </div>
        </DashboardCard>
      ) : null}

      <DashboardCard>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">API 金鑰</h2>
        <p className="text-xs text-slate-500">啟用中 {activeKeysCount} 把</p>
        </div>
        <div className="mt-3">
          <ApiKeysManager
            initialKeys={apiKeys.keys}
            canCreate={apiKeys.canCreate}
            canRevoke={apiKeys.canRevoke}
            keyLimit={apiKeys.keyLimit}
            createDisabledReason={apiKeys.createDisabledReason}
          />
        </div>
      </DashboardCard>

      <UsageActivityCard usage={usage} creditsModeState={creditsModeState} />

      <RequestResponsePlayground
        apiKeys={apiKeys.keys}
        planCode={entitlement.planCode}
        isEntitled={entitlement.isEntitled}
        planName={entitlement.planName}
      />
    </div>
  );
}

function KeysPanel({ apiKeys }: { apiKeys: ApiKeysSummary }) {
  return (
    <div className="space-y-4">
      <PanelTitle title="API 金鑰" description="管理金鑰與最近使用時間。" mode={apiKeys.integrationMode} />

      <DashboardCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">金鑰清單</h2>
        </div>
        <div className="mt-3">
          <ApiKeysManager
            initialKeys={apiKeys.keys}
            canCreate={apiKeys.canCreate}
            canRevoke={apiKeys.canRevoke}
            keyLimit={apiKeys.keyLimit}
            createDisabledReason={apiKeys.createDisabledReason}
          />
        </div>
      </DashboardCard>
    </div>
  );
}

function SettingsPanel({
  email,
  entitlement,
}: {
  email: string;
  entitlement: DashboardConsoleProps["entitlement"];
}) {
  return (
    <div className="space-y-5">

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">方案</h2>
        <DashboardCard className="border-slate-200/80 bg-slate-50/70 p-0 shadow-none">
          <div className="space-y-2 px-5 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                目前方案：{entitlement.planName}
                {entitlement.isEntitled ? "（使用中）" : ""}
              </p>
              <p className="text-xs text-slate-500">
                {entitlement.source === "subscription"
                  ? "方案資料已同步"
                  : entitlement.source === "backend"
                    ? "方案資料暫以帳戶摘要顯示"
                    : "目前尚未啟用付費方案"}
              </p>
            </div>
            <div>
              <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                管理方案
              </Link>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">帳戶資料</h2>
        <DashboardCard className="border-slate-200/80 bg-slate-50/70 p-0 shadow-none">
          <div className="px-5 py-4">
            <AccountProfileForm email={email} />
          </div>
        </DashboardCard>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">其他</h2>
        <DashboardCard className="border-slate-200/80 bg-slate-50/70 p-0 shadow-none">
          <div className="divide-y divide-slate-200">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">登出</p>
              <form action="/api/auth/logout" method="post">
                <button className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>登出</button>
              </form>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">刪除帳號</p>
              <button className={buttonClass("danger-secondary", "h-9 rounded-lg px-4 text-xs")}>刪除</button>
            </div>
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}

function DocsPanel() {
  return (
    <div className="space-y-4">
      <PanelTitle title="文件" description="快速進入導入文件與 API 參考。" mode="fallback" />
      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["快速上手", "/docs"],
            ["API 參考", "/api"],
            ["資料集目錄", "/datasets"],
            ["來源政策", "/about"],
          ].map(([label, href]) => (
            <Link
              key={String(label)}
              href={String(href)}
              className={buttonClass("secondary")}
            >
              {String(label)}
            </Link>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function SupportPanel() {
  return (
    <div className="space-y-4">
      <PanelTitle title="支援" description="商務洽詢、資料需求與整合協助。" mode="fallback" />

      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["商務洽詢", "方案與採購流程"],
            ["資料需求", "欄位或覆蓋範圍"],
            ["整合支援", "API 導入與用量問題"],
          ].map(([title, text]) => (
            <div key={String(title)} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-sm font-medium text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/contact" className={buttonClass("secondary", "mt-4")}>
          前往聯絡頁
        </Link>
      </DashboardCard>
    </div>
  );
}

export function renderSection(section: DashboardSection, props: DashboardConsoleProps) {
  const quotaRatio = props.usage.monthlyQuota > 0 ? props.usage.monthlyUsed / props.usage.monthlyQuota : 0;
  const creditState: CreditState = props.usageRequests.insufficientCredits
    ? "exhausted"
    : quotaRatio >= 0.85
      ? "low"
      : "normal";

  if (section === "overview") {
    return (
      <div className="space-y-6">
        <ResearchTerminalEntryCard />
        <OverviewPanel
          entitlement={props.entitlement}
          usage={props.usage}
          apiKeys={props.apiKeys}
          creditState={creditState}
          creditWalletBalance={props.creditWalletBalance}
          creditsModeState={props.creditsModeState}
        />
      </div>
    );
  }
  if (section === "billing") {
    if (props.currentPath === "/billing/subscriptions") {
      const currentPlanId = props.subscription?.planCode;
      if (
        currentPlanId === "starter" ||
        currentPlanId === "pro" ||
        currentPlanId === "max" ||
        currentPlanId === "developer"
      ) {
        return (
          <BillingSubscriptionsPage
            currentPlanId={currentPlanId}
            subscription={
              props.subscription
                ? {
                    status: props.subscription.status,
                    cancelAtPeriodEnd: props.subscription.cancelAtPeriodEnd,
                    currentPeriodEnd: props.subscription.currentPeriodEnd,
                  }
                : null
            }
          />
        );
      }
      return (
        <BillingSubscriptionsPage
          currentPlanId={null}
          subscription={
            props.subscription
              ? {
                  status: props.subscription.status,
                  cancelAtPeriodEnd: props.subscription.cancelAtPeriodEnd,
                  currentPeriodEnd: props.subscription.currentPeriodEnd,
                }
              : null
          }
        />
      );
    }
    if (props.currentPath === "/billing/credits") {
      return (
        <BillingCreditsPage
          creditsModeState={props.creditsModeState}
          walletBalance={props.creditWalletBalance}
          transactions={props.creditTransactions}
          usageReconciliation={props.usageReconciliation}
        />
      );
    }
    return <BillingLandingPage subscription={props.subscription} />;
  }
  if (section === "usage")
    return (
      <UsagePageShell
        usageRequests={props.usageRequests}
        usageSummary={{ ...props.usage, isDryRun: props.creditsModeState.mode !== "charged" }}
        creditState={creditState}
        creditsModeState={props.creditsModeState}
        usageReconciliation={props.usageReconciliation}
      />
    );
  if (section === "keys") return <KeysPanel apiKeys={props.apiKeys} />;
  if (section === "settings") return <SettingsPanel email={props.email} entitlement={props.entitlement} />;
  if (section === "docs") return <DocsPanel />;
  if (section === "support") return <SupportPanel />;
  return (
    <OverviewPanel
      entitlement={props.entitlement}
      usage={props.usage}
      apiKeys={props.apiKeys}
      creditState={creditState}
      creditWalletBalance={props.creditWalletBalance}
      creditsModeState={props.creditsModeState}
    />
  );
}

