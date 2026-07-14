// Pure dataset policy data — the SSOT for which plan may call a dataset and what it COSTS.
//
// Deliberately NOT "server-only": the billing dashboard renders the credit-cost table, and it used to
// keep its own hand-maintained copy of these numbers, which had already drifted (it showed monthly
// revenue at 2 credits while the gateway actually charged 3). One table, one truth.
//
// src/lib/gateway/policies.ts re-exports all of this and adds the server-only helpers.

export type GatewayPlanCode = "free" | "starter" | "pro" | "max" | "developer" | "enterprise";

export type DatasetPolicy = {
  datasetSlug: string;
  backendPath: string;
  requiredPlan: GatewayPlanCode;
  creditsCost: number;
};

export const PLAN_LEVEL: Record<GatewayPlanCode, number> = {
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
