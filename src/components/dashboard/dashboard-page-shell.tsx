import { getRequiredSession } from "@/src/lib/auth/session";
import { DashboardConsole } from "@/src/components/dashboard/dashboard-console";
import { type DashboardSection } from "@/src/content/dashboard";
import type {
  ApiKeysSummary,
  BillingSummary,
  UsageRequestsSummary,
  UsageSummary,
} from "@/src/lib/backend-adapter";
import {
  getBillingDisplaySubscriptionForUser,
  getDashboardEntitlementForUser,
} from "@/src/lib/billing/subscription";
import { getCreditTransactionsForUser, getCreditWalletForUser } from "@/src/lib/billing/credits";
import { assertCreditsDeductionRuntimeSafe } from "@/src/lib/billing/credits-mode";
import { getUsageCreditReconciliationForUser } from "@/src/lib/billing/reconciliation";
import { getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";
import { getRecentApiUsageForUser, getUsageSummaryForUser } from "@/src/lib/gateway/usage";

function nowMs() {
  return Date.now();
}

function logStageDuration(stage: string, startedAt: number, ok: boolean) {
  const durationMs = Math.max(0, nowMs() - startedAt);
  console.info(`[dashboard-load] stage=${stage} durationMs=${durationMs} ok=${ok ? "true" : "false"}`);
}

async function timedStage<T>(stage: string, action: () => Promise<T>) {
  const startedAt = nowMs();
  try {
    const result = await action();
    logStageDuration(stage, startedAt, true);
    return result;
  } catch (error) {
    logStageDuration(stage, startedAt, false);
    throw error;
  }
}

function buildFallbackDailyUsage() {
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (34 - index));
    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
    };
  });
}

const FALLBACK_BILLING: BillingSummary = {
  subscriptionStatus: "trial",
  renewalDate: "-",
  currentBalance: "NT$0",
  portalAvailable: false,
  checkoutAvailable: false,
  integrationMode: "fallback",
};

const FALLBACK_API_KEYS: ApiKeysSummary = {
  keys: [],
  canCreate: true,
  canRevoke: true,
  integrationMode: "live",
};

const FALLBACK_USAGE_SUMMARY: UsageSummary = {
  monthlyUsed: 0,
  monthlyQuota: 250000,
  rateLimitPerMin: 60,
  topEndpoints: [],
  dailyUsage: buildFallbackDailyUsage(),
  integrationMode: "fallback",
  requestsToday: 0,
  requests30d: 0,
  estimatedCreditsUsage30d: 0,
  recentErrors: [],
};

const FALLBACK_USAGE_REQUESTS: UsageRequestsSummary = {
  rows: [],
  integrationMode: "fallback",
  insufficientCredits: false,
};

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
  linkedByRequestId: Map<string, { linked: boolean; transactionStatus: string | null; transactionCredits: number }>,
  isDryRun: boolean,
): UsageRequestsSummary {
  return {
    rows: localRows.map((item) => {
      const linkage = linkedByRequestId.get(item.requestId);
      return {
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
        transactionLinked: linkage?.linked ?? null,
        transactionStatus: linkage?.transactionStatus ?? null,
        transactionCredits: linkage?.transactionCredits ?? null,
      };
    }),
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
  const dashboardLoadStartedAt = nowMs();
  const creditsModeState = assertCreditsDeductionRuntimeSafe();
  const usageIsDryRun = !creditsModeState.enabled;

  const needsApiKeys = section === "overview" || section === "keys";
  const needsUsageSummary = section === "overview" || section === "usage";
  const needsUsageRows = section === "usage";
  const needsBillingDisplaySubscription = section === "billing";
  const needsWallet = section === "billing" || section === "overview" || currentPath === "/billing/credits";
  const needsCreditTransactions = currentPath === "/billing/credits";
  const needsReconciliation = section === "usage" || currentPath === "/billing/credits";

  try {
    const session = await timedStage("auth/session", () => getRequiredSession());

    // API keys in dashboard currently use local Prisma source, not backend self-serve list.
    console.info("[dashboard-load] stage=backendApiKeys durationMs=0 ok=true");
    // Backend account/usage fallback intentionally deferred in P1 to avoid blocking first paint.
    console.info("[dashboard-load] stage=backendAccountSummary durationMs=0 ok=true");
    console.info("[dashboard-load] stage=backendUsageSummary durationMs=0 ok=true");
    console.info("[dashboard-load] stage=backendUsageRequests durationMs=0 ok=true");

    const entitlementPromise = timedStage("entitlement/subscription", () =>
      getDashboardEntitlementForUser({
        userId: session.id,
        email: session.email,
        skipBackendSummaryLookup: true,
      }),
    ).catch((error) => {
      const errorName = error instanceof Error ? error.name : "UnknownError";
      console.warn(`[dashboard] failed to resolve entitlement (${errorName})`);
      return {
        planCode: "free",
        planName: "Free",
        source: "fallback" as const,
        isEntitled: false,
        apiKeyLimit: 1,
        datasetLimit: "5 個資料集",
        requestLimitLabel: "每日上限 100 credits / 每月 included 2,000 credits / RPM 10",
      };
    });

    const apiKeysPromise: Promise<ApiKeysSummary> = needsApiKeys
      ? timedStage("apiKeys", () => getApiKeysSummaryForUser(session.id)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch api keys (${errorName})`);
          return FALLBACK_API_KEYS;
        })
      : Promise.resolve(FALLBACK_API_KEYS);

    const localUsageSummaryPromise: Promise<Awaited<ReturnType<typeof getUsageSummaryForUser>> | null> = needsUsageSummary
      ? timedStage("usageSummary", () => getUsageSummaryForUser(session.id)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch local usage summary (${errorName})`);
          return null;
        })
      : Promise.resolve(null);

    const localUsageRowsPromise: Promise<Awaited<ReturnType<typeof getRecentApiUsageForUser>>> = needsUsageRows
      ? timedStage("recentUsageEvents", () => getRecentApiUsageForUser(session.id, 100)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch local usage rows (${errorName})`);
          return [];
        })
      : Promise.resolve([]);

    const billingDisplaySubscriptionPromise = needsBillingDisplaySubscription
      ? timedStage("billingDisplaySubscription", () => getBillingDisplaySubscriptionForUser(session.id)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch billing display subscription (${errorName})`);
          return null;
        })
      : Promise.resolve(null);

    const creditWalletPromise = needsWallet
      ? timedStage("wallet", () => getCreditWalletForUser(session.id)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch credit wallet (${errorName})`);
          return null;
        })
      : Promise.resolve(null);

    const creditTransactionsPromise = needsCreditTransactions
      ? timedStage("creditTransactions", () => getCreditTransactionsForUser(session.id, 10)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch credit transactions (${errorName})`);
          return [];
        })
      : Promise.resolve([]);

    const reconciliationPromise = needsReconciliation
      ? timedStage("creditsReconciliation", () => getUsageCreditReconciliationForUser(session.id, 30)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch reconciliation (${errorName})`);
          return null;
        })
      : Promise.resolve(null);

    const [
      entitlement,
      apiKeys,
      localUsageSummary,
      localUsageRows,
      billingDisplaySubscription,
      creditWallet,
      creditTransactions,
      reconciliation,
    ] = await Promise.all([
      entitlementPromise,
      apiKeysPromise,
      localUsageSummaryPromise,
      localUsageRowsPromise,
      billingDisplaySubscriptionPromise,
      creditWalletPromise,
      creditTransactionsPromise,
      reconciliationPromise,
    ]);

    const linkedByRequestId = new Map<string, { linked: boolean; transactionStatus: string | null; transactionCredits: number }>();
    if (reconciliation?.recentRows) {
      for (const row of reconciliation.recentRows) {
        linkedByRequestId.set(row.requestId, {
          linked: row.linked,
          transactionStatus: row.transactionStatus,
          transactionCredits: row.transactionCredits,
        });
      }
    }

    const resolvedUsage = localUsageSummary
      ? toDashboardUsageSummary(localUsageSummary, usageIsDryRun)
      : {
          ...FALLBACK_USAGE_SUMMARY,
          isDryRun: usageIsDryRun,
        };

    const resolvedUsageRequests = localUsageRows.length
      ? toDashboardUsageRequests(localUsageRows, linkedByRequestId, usageIsDryRun)
      : {
          ...FALLBACK_USAGE_REQUESTS,
          isDryRun: usageIsDryRun,
        };

    logStageDuration("total", dashboardLoadStartedAt, true);

    return (
      <div className="h-[calc(100dvh-73px)] overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
        <DashboardConsole
          email={session.email}
          section={section}
          currentPath={currentPath}
          currentHref={currentHref}
          billing={FALLBACK_BILLING}
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
          creditsModeState={creditsModeState}
          usageReconciliation={
            reconciliation
              ? {
                  windowDays: reconciliation.windowDays,
                  walletBalance: reconciliation.walletBalance,
                  totalUsageEvents: reconciliation.totalUsageEvents,
                  totalChargedCredits: reconciliation.totalChargedCredits,
                  totalTransactionCredits: reconciliation.totalTransactionCredits,
                  mismatchedRequestIds: reconciliation.mismatchedRequestIds,
                  orphanUsageEvents: reconciliation.orphanUsageEvents,
                  orphanUsageTransactions: reconciliation.orphanUsageTransactions,
                  duplicateUsageTransactions: reconciliation.duplicateUsageTransactions,
                }
              : null
          }
          creditTransactions={creditTransactions.map((item) => ({
            id: item.id,
            type: item.type,
            status: item.status,
            amountTwd: item.amountTwd,
            credits: item.credits,
            balanceAfter: item.balanceAfter,
            provider: item.provider,
            merchantTradeNo: item.merchantTradeNo,
            providerTradeNo: item.providerTradeNo,
            packageCode: item.packageCode,
            description: item.description,
            createdAt: item.createdAt.toISOString(),
          }))}
        />
      </div>
    );
  } catch (error) {
    logStageDuration("total", dashboardLoadStartedAt, false);
    throw error;
  }
}
