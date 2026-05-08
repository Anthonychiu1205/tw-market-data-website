import "server-only";

import { getActiveSubscriptionForUser } from "@/src/lib/billing/subscription";
import { GatewayHttpError, sanitizeGatewayErrorMessage } from "@/src/lib/gateway/errors";
import { isPlanAllowed, normalizePlanCode, type DatasetPolicy, type GatewayPlanCode } from "@/src/lib/gateway/policies";

export type GatewayEntitlementResult = {
  planCode: GatewayPlanCode;
  isEntitled: boolean;
  datasetAllowed: boolean;
  source: "subscription" | "fallback";
};

function isPublicApiFreeTierEnabled() {
  const raw = process.env.PUBLIC_API_FREE_TIER_ENABLED?.trim().toLowerCase();
  if (!raw) {
    return true;
  }
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

export async function resolveUserPlanCode(userId: string): Promise<{ planCode: GatewayPlanCode; source: "subscription" | "fallback" }> {
  try {
    const activeSubscription = await getActiveSubscriptionForUser(userId);
    if (activeSubscription) {
      return {
        planCode: normalizePlanCode(activeSubscription.planCode),
        source: "subscription",
      };
    }
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const message = sanitizeGatewayErrorMessage(error);
    console.warn("[gateway]", {
      requestId: "n/a",
      stage: "entitlement",
      errorName,
      message,
    });
    // Fail-open to free tier for gateway reads; avoids internal errors when subscription storage is unavailable.
  }

  return {
    planCode: "free",
    source: "fallback",
  };
}

export async function assertDatasetEntitlement(input: {
  userId: string;
  datasetPolicy: DatasetPolicy;
}): Promise<GatewayEntitlementResult> {
  const resolved = await resolveUserPlanCode(input.userId);
  if (resolved.planCode === "free" && !isPublicApiFreeTierEnabled()) {
    throw new GatewayHttpError(403, "plan_not_entitled");
  }

  const datasetAllowed = isPlanAllowed(resolved.planCode, input.datasetPolicy.requiredPlan);

  if (!datasetAllowed) {
    throw new GatewayHttpError(403, "plan_not_entitled");
  }

  return {
    planCode: resolved.planCode,
    isEntitled: resolved.planCode !== "free",
    datasetAllowed: true,
    source: resolved.source,
  };
}
