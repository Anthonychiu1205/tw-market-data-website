import { getRequiredSession } from "@/src/lib/auth/session";
import { DashboardConsole } from "@/src/components/dashboard/dashboard-console";
import { type DashboardSection } from "@/src/content/dashboard";
import {
  getAccountSummary,
  getApiKeysSummary,
  getBillingSummary,
  getUsageRequestRows,
  getUsageSummary,
} from "@/src/lib/backend-adapter";
import {
  getDashboardEntitlementForUser,
  getLatestSubscriptionForUser,
} from "@/src/lib/billing/subscription";

type DashboardPageShellProps = {
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
};

export async function DashboardPageShell({ section, currentPath, currentHref }: DashboardPageShellProps) {
  const session = await getRequiredSession();

  const latestSubscriptionPromise = getLatestSubscriptionForUser(session.id).catch((error) => {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[dashboard] failed to fetch latest subscription (${errorName})`);
    return null;
  });

  const [account, billing, usage, usageRequests, apiKeys, subscription] = await Promise.all([
    getAccountSummary(session.email),
    getBillingSummary(session.email),
    getUsageSummary(session.email),
    getUsageRequestRows(session.email),
    getApiKeysSummary(session.email),
    latestSubscriptionPromise,
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
          subscription
            ? {
                id: subscription.id,
                planCode: subscription.planCode,
                status: subscription.status,
                billingCycle: subscription.billingCycle,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                cancelReason: subscription.cancelReason,
                cancelReasonDetail: subscription.cancelReasonDetail,
              }
            : null
        }
      />
    </div>
  );
}
