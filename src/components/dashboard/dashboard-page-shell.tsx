import { getRequiredSession } from "@/src/lib/auth/session";
import { DashboardConsole } from "@/src/components/dashboard/dashboard-console";
import { type DashboardSection } from "@/src/content/dashboard";
import {
  getAccountSummary,
  getBillingSummary,
  getUsageRequestRows,
  getUsageSummary,
} from "@/src/lib/backend-adapter";
import {
  getBillingDisplaySubscriptionForUser,
  getDashboardEntitlementForUser,
} from "@/src/lib/billing/subscription";
import { getCreditTransactionsForUser, getCreditWalletForUser } from "@/src/lib/billing/credits";
import { getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";

type DashboardPageShellProps = {
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
};

export async function DashboardPageShell({ section, currentPath, currentHref }: DashboardPageShellProps) {
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

  const [account, billing, usage, usageRequests, apiKeys, billingDisplaySubscription, creditWallet, creditTransactions] = await Promise.all([
    getAccountSummary(session.email),
    getBillingSummary(session.email),
    getUsageSummary(session.email),
    getUsageRequestRows(session.email),
    getApiKeysSummaryForUser(session.id),
    billingDisplaySubscriptionPromise,
    creditWalletPromise,
    creditTransactionsPromise,
  ]);

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
        usage={usage}
        usageRequests={usageRequests}
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
