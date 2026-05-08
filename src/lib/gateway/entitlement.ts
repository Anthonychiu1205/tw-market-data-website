import "server-only";

import { getActiveSubscriptionForUser } from "@/src/lib/billing/subscription";
import { GatewayHttpError } from "@/src/lib/gateway/errors";
import { isPlanAllowed, normalizePlanCode, type DatasetPolicy, type GatewayPlanCode } from "@/src/lib/gateway/policies";

export type GatewayEntitlementResult = {
  planCode: GatewayPlanCode;
  isEntitled: boolean;
  datasetAllowed: boolean;
  source: "subscription" | "fallback";
};

export async function resolveUserPlanCode(userId: string): Promise<{ planCode: GatewayPlanCode; source: "subscription" | "fallback" }> {
  const activeSubscription = await getActiveSubscriptionForUser(userId);
  if (activeSubscription) {
    return {
      planCode: normalizePlanCode(activeSubscription.planCode),
      source: "subscription",
    };
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

