import "server-only";

export {
  DATASET_ACCESS_POLICIES,
  DATASET_CREDIT_COSTS,
  PLAN_LEVEL,
  type DatasetPolicy,
  type GatewayPlanCode,
} from "@/src/lib/gateway/dataset-policies";

import { DATASET_ACCESS_POLICIES, PLAN_LEVEL, type GatewayPlanCode } from "@/src/lib/gateway/dataset-policies";

export function normalizePlanCode(input: string | null | undefined): GatewayPlanCode {
  const normalized = (input ?? "").trim().toLowerCase();
  if (normalized === "enterprise") return "enterprise";
  if (normalized === "developer") return "developer";
  if (normalized === "max") return "max";
  if (normalized === "pro") return "pro";
  if (normalized === "starter") return "starter";
  return "free";
}

export function isPlanAllowed(userPlan: GatewayPlanCode, requiredPlan: GatewayPlanCode) {
  return PLAN_LEVEL[userPlan] >= PLAN_LEVEL[requiredPlan];
}

export function resolveDatasetPolicy(datasetSlug: string) {
  return DATASET_ACCESS_POLICIES[datasetSlug] ?? null;
}
