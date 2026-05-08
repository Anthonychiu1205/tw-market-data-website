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
  getBillingDisplaySubscriptionForUser,
  getDashboardEntitlementForUser,
} from "@/src/lib/billing/subscription";

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

  const [account, billing, usage, usageRequests, apiKeys, billingDisplaySubscription] = await Promise.all([
    getAccountSummary(session.email),
    getBillingSummary(session.email),
    getUsageSummary(session.email),
    getUsageRequestRows(session.email),
    getApiKeysSummary(session.email),
    billingDisplaySubscriptionPromise,
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
      />
    </div>
  );
}
