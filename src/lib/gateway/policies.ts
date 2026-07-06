import "server-only";

export type GatewayPlanCode = "free" | "starter" | "pro" | "max" | "developer" | "enterprise";

export type DatasetPolicy = {
  datasetSlug: string;
  backendPath: string;
  requiredPlan: GatewayPlanCode;
  creditsCost: number;
};

const PLAN_LEVEL: Record<GatewayPlanCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  max: 3,
  developer: 4,
  enterprise: 5,
};

export const DATASET_ACCESS_POLICIES: Record<string, DatasetPolicy> = {
  "twse-daily-price": {
    datasetSlug: "twse-daily-price",
    backendPath: "/v2/datasets/twse-daily-price",
    requiredPlan: "free",
    creditsCost: 1,
  },
  "tpex-daily-price": {
    datasetSlug: "tpex-daily-price",
    backendPath: "/v2/datasets/tpex-daily-price",
    requiredPlan: "free",
    creditsCost: 1,
  },
  "adjusted-prices": {
    datasetSlug: "adjusted-prices",
    backendPath: "/v2/datasets/adjusted-prices",
    requiredPlan: "free",
    creditsCost: 2,
  },
  "technical-indicators": {
    datasetSlug: "technical-indicators",
    backendPath: "/v2/datasets/technical-indicators",
    requiredPlan: "starter",
    creditsCost: 3,
  },
  "monthly-revenue": {
    datasetSlug: "monthly-revenue",
    backendPath: "/v2/datasets/monthly-revenue",
    requiredPlan: "starter",
    creditsCost: 3,
  },
  "income-statement": {
    datasetSlug: "income-statement",
    backendPath: "/v2/datasets/income-statement",
    requiredPlan: "pro",
    creditsCost: 2,
  },
  "balance-sheet": {
    datasetSlug: "balance-sheet",
    backendPath: "/v2/datasets/balance-sheet",
    requiredPlan: "pro",
    creditsCost: 2,
  },
  "cash-flow-statement": {
    datasetSlug: "cash-flow-statement",
    backendPath: "/v2/datasets/cash-flow-statement",
    requiredPlan: "pro",
    creditsCost: 2,
  },
  "institutional-flow": {
    datasetSlug: "institutional-flow",
    backendPath: "/v2/datasets/institutional-flow",
    requiredPlan: "pro",
    creditsCost: 2,
  },
  "securities-lending": {
    datasetSlug: "securities-lending",
    backendPath: "/v2/datasets/chip-deep-securities-lending-daily",
    requiredPlan: "pro",
    creditsCost: 2,
  },
  "valuation-data": {
    datasetSlug: "valuation-data",
    backendPath: "/v2/datasets/valuation-data",
    requiredPlan: "starter",
    creditsCost: 2,
  },
  "issuer-profile": {
    datasetSlug: "issuer-profile",
    backendPath: "/v2/datasets/issuer-profile",
    requiredPlan: "free",
    creditsCost: 1,
  },
};

export const DATASET_CREDIT_COSTS = Object.fromEntries(
  Object.entries(DATASET_ACCESS_POLICIES).map(([datasetSlug, policy]) => [datasetSlug, policy.creditsCost]),
);

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
