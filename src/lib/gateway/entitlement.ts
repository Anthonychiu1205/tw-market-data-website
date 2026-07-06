import "server-only";

import { prisma } from "@/src/lib/auth/prisma";
import { getAccountSummary } from "@/src/lib/backend-adapter";
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

export async function resolveUserPlanCode(
  userId: string,
  requestId = "n/a",
): Promise<{ planCode: GatewayPlanCode; source: "subscription" | "fallback" }> {
  try {
    // Single source of truth = the shared read API (fed by the Polar webhook). Resolve
    // the user's email, then read the backend plan; no local subscription is stored.
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (user?.email) {
      const summary = await getAccountSummary(user.email);
      const planCode = normalizePlanCode(summary.plan);
      if (planCode !== "free") {
        return { planCode, source: "subscription" };
      }
    }
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const message = sanitizeGatewayErrorMessage(error);
    console.warn("[gateway]", {
      requestId,
      stage: "entitlement",
      errorName,
      message,
    });
    // Fail-open to free tier for gateway reads; avoids internal errors when the backend is unavailable.
  }

  return {
    planCode: "free",
    source: "fallback",
  };
}

export async function assertDatasetEntitlement(input: {
  userId: string;
  datasetPolicy: DatasetPolicy;
  requestId?: string;
}): Promise<GatewayEntitlementResult> {
  const resolved = await resolveUserPlanCode(input.userId, input.requestId);
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
