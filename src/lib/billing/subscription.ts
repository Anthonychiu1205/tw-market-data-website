import "server-only";

import { getAccountSummary } from "@/src/lib/backend-adapter";
import { BILLING_PLANS, getRequestLimitLabel, type PlanCode } from "@/src/lib/billing/plans";

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

// Labels are DERIVED from the numeric SSOT (plans.ts PLAN_REQUEST_LIMITS) — no hand-written copy.

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
      requestLimitLabel: getRequestLimitLabel(normalizedCode),
    };
  }

  return {
    planCode: "free",
    planName: "Free",
    apiKeyLimit: 1,
    datasetLimit: "基礎資料集（不含財報三表）",
    requestLimitLabel: getRequestLimitLabel("free"),
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
