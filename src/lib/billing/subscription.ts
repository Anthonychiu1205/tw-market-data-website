import "server-only";

import { getAccountSummary } from "@/src/lib/backend-adapter";
import { BILLING_PLANS, type PlanCode } from "@/src/lib/billing/plans";

// "subscription" is retained for display compatibility; the website no longer stores
// subscriptions, so entitlements now resolve from the backend or fall back to free.
export type DashboardEntitlementSource = "subscription" | "backend" | "fallback";

export type DashboardEntitlement = {
  planCode: string;
  planName: string;
  source: DashboardEntitlementSource;
  subscriptionStatus?: string;
  isEntitled: boolean;
  apiKeyLimit?: number | null;
  datasetLimit?: string | null;
  requestLimitLabel?: string | null;
};

const REQUEST_LIMIT_LABELS: Record<string, string> = {
  free: "每月 included 500 requests / RPM 60",
  starter: "每月 included 10,000 requests / RPM 300",
  pro: "每月 included 100,000 requests / RPM 1,200",
  max: "每月 included 300,000 requests / RPM 3,000",
  developer: "每月 included 3,000,000 requests / RPM 12,000",
  enterprise: "客製配額",
};

function normalizePlanCode(input: string | null | undefined): string {
  const normalized = (input ?? "").trim().toLowerCase();
  if (!normalized) return "free";
  if (normalized.includes("enterprise")) return "enterprise";
  if (normalized.includes("developer")) return "developer";
  if (normalized.includes("max")) return "max";
  if (normalized.includes("pro")) return "pro";
  if (normalized.includes("starter")) return "starter";
  if (normalized.includes("free")) return "free";
  return "free";
}

function getPlanMeta(planCode: string) {
  const normalizedCode = normalizePlanCode(planCode);
  if (normalizedCode in BILLING_PLANS) {
    const billingPlan = BILLING_PLANS[normalizedCode as PlanCode];
    return {
      planCode: normalizedCode,
      planName: billingPlan.displayName,
      apiKeyLimit: billingPlan.apiKeyLimit,
      datasetLimit: billingPlan.datasetLimit,
      requestLimitLabel: REQUEST_LIMIT_LABELS[normalizedCode] ?? null,
    };
  }

  return {
    planCode: "free",
    planName: "Free",
    apiKeyLimit: 1,
    datasetLimit: "基礎資料集（不含財報三表）",
    requestLimitLabel: REQUEST_LIMIT_LABELS.free,
  };
}

/**
 * Resolve the dashboard entitlement (plan meta) for a user. The single source of
 * truth is the shared read API (fed by the Polar webhook); the website stores no
 * subscription of its own. `backendPlan` short-circuits the HTTP lookup when the
 * caller already has the plan; `skipBackendSummaryLookup` returns the free fallback
 * without any backend call (used for fast first paint).
 */
export async function getDashboardEntitlementForUser({
  email,
  backendPlan,
  skipBackendSummaryLookup = false,
}: {
  userId: string;
  email: string;
  backendPlan?: string;
  skipBackendSummaryLookup?: boolean;
}): Promise<DashboardEntitlement> {
  const resolveFromBackendPlan = (plan: string): DashboardEntitlement => {
    const backendPlanCode = normalizePlanCode(plan);
    const meta = getPlanMeta(backendPlanCode);
    return {
      ...meta,
      source: "backend",
      subscriptionStatus: undefined,
      isEntitled: backendPlanCode !== "free",
    };
  };

  const freeFallback = (): DashboardEntitlement => {
    const meta = getPlanMeta("free");
    return { ...meta, source: "fallback", subscriptionStatus: undefined, isEntitled: false };
  };

  if (backendPlan) {
    return resolveFromBackendPlan(backendPlan);
  }

  if (skipBackendSummaryLookup) {
    return freeFallback();
  }

  try {
    const accountSummary = await getAccountSummary(email);
    return resolveFromBackendPlan(accountSummary.plan);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[billing-entitlement] failed to resolve backend summary (${errorName})`);
  }

  return freeFallback();
}
