import { getRequiredSession } from "@/src/lib/auth/session";
import { DashboardConsole } from "@/src/components/dashboard/dashboard-console";
import { type DashboardSection } from "@/src/content/dashboard";
import {
  getAccountSummary,
  getBillingSummary,
  getUsageRequestRows,
  getUsageSummary,
  type UsageRequestsSummary,
  type UsageSummary,
} from "@/src/lib/backend-adapter";
import {
  getBillingDisplaySubscriptionForUser,
  getDashboardEntitlementForUser,
} from "@/src/lib/billing/subscription";
import { getCreditTransactionsForUser, getCreditWalletForUser } from "@/src/lib/billing/credits";
import { getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";
import { getRecentApiUsageForUser, getUsageSummaryForUser } from "@/src/lib/gateway/usage";

const TRUTHY = new Set(["1", "true", "yes", "on"]);

function isCreditsDeductionEnabled() {
  return TRUTHY.has(String(process.env.PUBLIC_API_CREDITS_DEDUCTION_ENABLED ?? "").trim().toLowerCase());
}

function toDashboardUsageSummary(
  localSummary: Awaited<ReturnType<typeof getUsageSummaryForUser>>,
  isDryRun: boolean,
): UsageSummary {
  return {
    monthlyUsed: localSummary.requests30d,
    monthlyQuota: 250000,
    rateLimitPerMin: 60,
    topEndpoints: localSummary.topDatasets.map((item) => item.dataset),
    dailyUsage: localSummary.dailyUsage,
    integrationMode: "live",
    requestsToday: localSummary.requestsToday,
    requests30d: localSummary.requests30d,
    estimatedCreditsUsage30d: localSummary.estimatedCreditsUsage30d,
    recentErrors: localSummary.recentErrors,
    isDryRun,
  };
}

function toDashboardUsageRequests(
  localRows: Awaited<ReturnType<typeof getRecentApiUsageForUser>>,
  isDryRun: boolean,
): UsageRequestsSummary {
  return {
    rows: localRows.map((item) => ({
      requestTimestamp: item.requestTimestamp,
      dataset: item.dataset,
      endpoint: item.endpoint,
      statusCode: item.statusCode,
      rowCount: null,
      planCode: "-",
      symbol: item.symbol,
      creditsCharged: item.creditsCharged,
      latencyMs: item.latencyMs,
      errorCode: item.errorCode,
      requestId: item.requestId,
    })),
    integrationMode: "live",
    insufficientCredits: false,
    isDryRun,
  };
}

type DashboardPageShellProps = {
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
};

export async function DashboardPageShell({ section, currentPath, currentHref }: DashboardPageShellProps) {
  const usageIsDryRun = !isCreditsDeductionEnabled();
  const session = await getRequiredSession();

  const billingDisplaySubscriptionPromise = getBillingDisplaySubscriptionForUser(session.id).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to fetch billing display subscription (${errorName})`);
    return null;
  });

  const creditWalletPromise = getCreditWalletForUser(session.id).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to fetch credit wallet (${errorName})`);
    return null;
  });

  const creditTransactionsPromise = getCreditTransactionsForUser(session.id, 10).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to fetch credit transactions (${errorName})`);
    return [];
  });

  const localUsageSummaryPromise = getUsageSummaryForUser(session.id).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to fetch local usage summary (${errorName})`);
    return null;
  });

  const localUsageRowsPromise = getRecentApiUsageForUser(session.id, 100).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to fetch local usage rows (${errorName})`);
    return [];
  });

  const [account, billing, usage, usageRequests, apiKeys, billingDisplaySubscription, creditWallet, creditTransactions, localUsageSummary, localUsageRows] = await Promise.all([
    getAccountSummary(session.email),
    getBillingSummary(session.email),
    getUsageSummary(session.email),
    getUsageRequestRows(session.email),
    getApiKeysSummaryForUser(session.id),
    billingDisplaySubscriptionPromise,
    creditWalletPromise,
    creditTransactionsPromise,
    localUsageSummaryPromise,
    localUsageRowsPromise,
  ]);

  const hasLocalUsage = Boolean(localUsageSummary && localUsageSummary.requests30d > 0) || localUsageRows.length > 0;
  const resolvedUsage = hasLocalUsage && localUsageSummary
    ? toDashboardUsageSummary(localUsageSummary, usageIsDryRun)
    : {
        ...usage,
        isDryRun: usageIsDryRun,
      };
  const resolvedUsageRequests = hasLocalUsage
    ? toDashboardUsageRequests(localUsageRows, usageIsDryRun)
    : {
        ...usageRequests,
        isDryRun: usageIsDryRun,
      };

  const entitlement = await getDashboardEntitlementForUser({
    userId: session.id,
    email: session.email,
    backendPlan: account.plan,
  });

  return (
    <div className="h-[calc(100dvh-73px)] overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      <DashboardConsole
        email={session.email}
        section={section}
        currentPath={currentPath}
        currentHref={currentHref}
        billing={billing}
        usage={resolvedUsage}
        usageRequests={resolvedUsageRequests}
        apiKeys={apiKeys}
        entitlement={entitlement}
        subscription={
          billingDisplaySubscription
            ? {
                id: billingDisplaySubscription.id,
                planCode: billingDisplaySubscription.planCode,
                status: billingDisplaySubscription.status,
                billingCycle: billingDisplaySubscription.billingCycle,
                currentPeriodEnd: billingDisplaySubscription.currentPeriodEnd,
                cancelAtPeriodEnd: billingDisplaySubscription.cancelAtPeriodEnd,
                cancelReason: billingDisplaySubscription.cancelReason,
                cancelReasonDetail: billingDisplaySubscription.cancelReasonDetail,
              }
            : null
        }
        creditWalletBalance={creditWallet?.balance ?? 0}
        creditTransactions={creditTransactions.map((item) => ({
          id: item.id,
          type: item.type,
          status: item.status,
          amountTwd: item.amountTwd,
          credits: item.credits,
          balanceAfter: item.balanceAfter,
          packageCode: item.packageCode,
          description: item.description,
          createdAt: item.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
