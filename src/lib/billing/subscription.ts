import "server-only";

import type { Subscription } from "@prisma/client";

import { prisma } from "@/src/lib/auth/prisma";
import { getAccountSummary } from "@/src/lib/backend-adapter";
import { BILLING_PLANS, type PlanCode } from "@/src/lib/billing/plans";

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
  free: "每日 100 / 每月 2,000 / RPM 10",
  developer: "每日 800 / 每月 20,000 / RPM 30",
  pro: "每日 4,000 / 每月 100,000 / RPM 120",
  team: "每日 20,000 / 每月 500,000 / RPM 600",
  enterprise: "客製配額",
};

function normalizePlanCode(input: string | null | undefined): string {
  const normalized = (input ?? "").trim().toLowerCase();
  if (!normalized) return "free";
  if (normalized.includes("enterprise")) return "enterprise";
  if (normalized.includes("team")) return "team";
  if (normalized.includes("pro")) return "pro";
  if (normalized.includes("developer")) return "developer";
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
    datasetLimit: "5 個資料集",
    requestLimitLabel: REQUEST_LIMIT_LABELS.free,
  };
}

export function isSubscriptionCurrentlyEntitled(subscription: Pick<Subscription, "status" | "currentPeriodEnd"> | null) {
  if (!subscription) {
    return false;
  }

  if (!subscription.currentPeriodEnd) {
    return false;
  }

  const periodEnd = subscription.currentPeriodEnd.getTime();
  if (Number.isNaN(periodEnd) || periodEnd <= Date.now()) {
    return false;
  }

  return subscription.status === "active" || subscription.status === "cancelled";
}

export async function getActiveSubscriptionForUser(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: {
        in: ["active", "cancelled"],
      },
    },
    orderBy: [{ currentPeriodEnd: "desc" }, { updatedAt: "desc" }],
  });

  return subscriptions.find((subscription) => isSubscriptionCurrentlyEntitled(subscription)) ?? null;
}

export async function getLatestSubscriptionForUser(userId: string) {
  return await prisma.subscription.findFirst({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getUserPlanCode(userId: string) {
  const subscription = await getActiveSubscriptionForUser(userId);
  return subscription?.planCode ?? null;
}

export async function getDashboardEntitlementForUser({
  userId,
  email,
  backendPlan,
}: {
  userId: string;
  email: string;
  backendPlan?: string;
}): Promise<DashboardEntitlement> {
  try {
    const subscription = await getActiveSubscriptionForUser(userId);
    if (subscription) {
      const meta = getPlanMeta(subscription.planCode);
      return {
        ...meta,
        source: "subscription",
        subscriptionStatus: subscription.status,
        isEntitled: true,
      };
    }
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[billing-entitlement] failed to resolve active subscription (${errorName})`);
  }

  const resolveFromBackendPlan = (plan: string): DashboardEntitlement => {
    const backendPlanCode = normalizePlanCode(plan);
    const meta = getPlanMeta(backendPlanCode);
    const isEntitled = backendPlanCode !== "free";

    return {
      ...meta,
      source: "backend",
      subscriptionStatus: undefined,
      isEntitled,
    };
  };

  if (backendPlan) {
    return resolveFromBackendPlan(backendPlan);
  }

  try {
    const accountSummary = await getAccountSummary(email);
    return resolveFromBackendPlan(accountSummary.plan);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[billing-entitlement] failed to resolve backend summary (${errorName})`);
  }

  const fallbackMeta = getPlanMeta("free");
  return {
    ...fallbackMeta,
    source: "fallback",
    subscriptionStatus: undefined,
    isEntitled: false,
  };
}
