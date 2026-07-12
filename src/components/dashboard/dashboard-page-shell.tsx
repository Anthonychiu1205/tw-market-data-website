import { Suspense } from "react";

import { AuthRuntimeUnavailableError } from "@/src/auth/session";
import { getRequiredSession } from "@/src/lib/auth/session";
import { renderSection } from "@/src/components/dashboard/dashboard-console";
import { DashboardSidebar } from "@/src/components/dashboard/dashboard-sidebar";
import { type DashboardSection } from "@/src/content/dashboard";
import type {
  ApiKeysSummary,
  BillingSummary,
  UsageRequestsSummary,
  UsageSummary,
} from "@/src/lib/backend-adapter";
import { getBillingSummary } from "@/src/lib/backend-adapter";
import { getDashboardEntitlementForUser } from "@/src/lib/billing/subscription";
import { getCreditTransactionsForUser, getCreditWalletForUser } from "@/src/lib/billing/credits";
import { assertCreditsDeductionRuntimeSafe } from "@/src/lib/billing/credits-mode";
import { getUsageCreditReconciliationForUser } from "@/src/lib/billing/reconciliation";
import { getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";
import { getRecentApiUsageForUser, getUsageSummaryForUser } from "@/src/lib/gateway/usage";

function nowMs() {
  return Date.now();
}

function parseRenewalDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return null;
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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

type DashboardSectionDataProps = {
  session: Awaited<ReturnType<typeof getRequiredSession>>;
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
  entitlement: Awaited<ReturnType<typeof getDashboardEntitlementForUser>>;
  creditsModeState: ReturnType<typeof assertCreditsDeductionRuntimeSafe>;
};

function SectionSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

export async function DashboardPageShell({ section, currentPath, currentHref }: DashboardPageShellProps) {
  const creditsModeState = assertCreditsDeductionRuntimeSafe();

  let session: Awaited<ReturnType<typeof getRequiredSession>>;
  try {
    session = await getRequiredSession();
  } catch (error) {
    if (error instanceof AuthRuntimeUnavailableError) {
      return (
        <div className="h-[calc(100dvh-73px)] overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
          <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="min-h-0 h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">控制台</p>
              <p className="mt-1 text-xs text-slate-500">服務狀態</p>
            </aside>
            <main className="min-h-0 min-w-0 h-full overflow-y-auto pr-1">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h1 className="text-lg font-semibold tracking-tight text-slate-900">登入服務暫時不可用，請稍後再試。</h1>
                <p className="mt-2 text-sm text-slate-600">如果問題持續發生，請聯繫我們協助排查。</p>
              </section>
            </main>
          </div>
        </div>
      );
    }
    throw error;
  }

  // The entitlement drives the sidebar plan label and must reflect the user's REAL tier
  // on every section (previously overview skipped the backend and hard-defaulted to Free,
  // so a paid user saw "Free" on the landing page). Resolve it for all sections; the
  // backend summary is memoized (~10s) + fail-open to free, so it is one cheap call.
  // The heavy per-section data streams in below.
  const entitlement = await getDashboardEntitlementForUser({
    userId: session.id,
    email: session.email,
    skipBackendSummaryLookup: false,
  }).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to resolve entitlement (${errorName})`);
    return {
      planCode: "free",
      planName: "Free",
      source: "fallback" as const,
      isEntitled: false,
      apiKeyLimit: 1,
      datasetLimit: "基礎資料集（不含財報三表）",
      requestLimitLabel: "每月 included 500 requests / RPM 60",
    };
  });

  // Static frame (sidebar + plan) renders immediately; the data-heavy section content
  // streams in via Suspense so first paint no longer waits for every backend call.
  return (
    <div className="h-[calc(100dvh-73px)] overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-h-0 h-full overflow-hidden">
          <DashboardSidebar
            email={session.email}
            section={section}
            plan={entitlement.planName}
            currentPath={currentPath}
            currentHref={currentHref}
          />
        </aside>
        <main className="min-h-0 min-w-0 h-full overflow-y-auto pr-1">
          <Suspense fallback={<SectionSkeleton />}>
            <DashboardSectionData
              session={session}
              section={section}
              currentPath={currentPath}
              currentHref={currentHref}
              entitlement={entitlement}
              creditsModeState={creditsModeState}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function DashboardSectionData({
  session,
  section,
  currentPath,
  currentHref,
  entitlement,
  creditsModeState,
}: DashboardSectionDataProps) {
  const dashboardLoadStartedAt = nowMs();
  const usageIsDryRun = !creditsModeState.enabled;

  const needsApiKeys = section === "overview" || section === "keys";
  const needsUsageSummary = section === "overview" || section === "usage";
  const needsUsageRows = section === "usage";
  const needsBillingDisplaySubscription = section === "billing";
  const needsWallet = section === "billing" || section === "overview" || currentPath === "/billing/credits";
  const needsCreditTransactions = currentPath === "/billing/credits";
  const needsReconciliation = section === "usage" || currentPath === "/billing/credits";

  try {

    const apiKeysPromise: Promise<ApiKeysSummary> = needsApiKeys
      ? timedStage("apiKeys", () => getApiKeysSummaryForUser(session.email)).catch((error) => {
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

    const billingSummaryPromise: Promise<BillingSummary | null> = needsBillingDisplaySubscription
      ? timedStage("billingSummary", () => getBillingSummary(session.email)).catch((error) => {
          const errorName = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[dashboard] failed to fetch billing summary (${errorName})`);
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
      apiKeys,
      localUsageSummary,
      localUsageRows,
      billingSummary,
      creditWallet,
      creditTransactions,
      reconciliation,
    ] = await Promise.all([
      apiKeysPromise,
      localUsageSummaryPromise,
      localUsageRowsPromise,
      billingSummaryPromise,
      creditWalletPromise,
      creditTransactionsPromise,
      reconciliationPromise,
    ]);

    // Build the billing display subscription from the backend (single source of
    // truth). No subscription is stored locally; cancellation is via Customer Portal.
    const isBillingEntitled = entitlement.isEntitled && entitlement.planCode !== "free";
    const renewalDate = parseRenewalDate(billingSummary?.renewalDate);
    const billingDisplaySubscription = isBillingEntitled
      ? {
          id: "polar",
          planCode: entitlement.planCode,
          status: (billingSummary?.subscriptionStatus ?? "active").toLowerCase(),
          billingCycle: "monthly",
          currentPeriodEnd: renewalDate,
          cancelAtPeriodEnd: false,
          cancelReason: null as string | null,
          cancelReasonDetail: null as string | null,
        }
      : null;

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

    return renderSection(section, {
      email: session.email,
      section,
      currentPath,
      currentHref,
      billing: FALLBACK_BILLING,
      usage: resolvedUsage,
      usageRequests: resolvedUsageRequests,
      apiKeys,
      entitlement,
      subscription: billingDisplaySubscription
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
        : null,
      creditWalletBalance: creditWallet?.balance ?? 0,
      creditsModeState,
      usageReconciliation: reconciliation
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
        : null,
      creditTransactions: creditTransactions.map((item) => ({
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
      })),
    });
  } catch (error) {
    logStageDuration("total", dashboardLoadStartedAt, false);
    throw error;
  }
}
