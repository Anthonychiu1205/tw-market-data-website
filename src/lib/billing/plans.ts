export type BillingCycle = "monthly" | "yearly";
export type PlanCode = "developer" | "pro" | "team" | "enterprise";

export type BillingPlan = {
  planCode: PlanCode;
  displayName: string;
  monthlyAmount: number | null;
  yearlyAmount: number | null;
  apiKeyLimit: number | null;
  datasetLimit: string;
  isContactOnly: boolean;
};

export const BILLING_PLANS: Record<PlanCode, BillingPlan> = {
  developer: {
    planCode: "developer",
    displayName: "Developer",
    monthlyAmount: 690,
    yearlyAmount: 8280,
    apiKeyLimit: 2,
    datasetLimit: "10 個資料集",
    isContactOnly: false,
  },
  pro: {
    planCode: "pro",
    displayName: "Pro",
    monthlyAmount: 1490,
    yearlyAmount: 17880,
    apiKeyLimit: 5,
    datasetLimit: "20 個資料集",
    isContactOnly: false,
  },
  team: {
    planCode: "team",
    displayName: "Team",
    monthlyAmount: 6000,
    yearlyAmount: 72000,
    apiKeyLimit: 10,
    datasetLimit: "available-now 全量資料集",
    isContactOnly: false,
  },
  enterprise: {
    planCode: "enterprise",
    displayName: "Enterprise",
    monthlyAmount: null,
    yearlyAmount: null,
    apiKeyLimit: null,
    datasetLimit: "客製資料範圍",
    isContactOnly: true,
  },
};

export const PAID_PLAN_CODES: PlanCode[] = ["developer", "pro", "team"];

export function isPlanCode(value: string): value is PlanCode {
  return Object.prototype.hasOwnProperty.call(BILLING_PLANS, value);
}

export function isPaidPlanCode(value: string): value is Exclude<PlanCode, "enterprise"> {
  return PAID_PLAN_CODES.includes(value as Exclude<PlanCode, "enterprise">);
}

export function getPlanByCode(planCode: PlanCode) {
  return BILLING_PLANS[planCode];
}

export function getPlanAmount(planCode: Exclude<PlanCode, "enterprise">, billingCycle: BillingCycle) {
  const plan = BILLING_PLANS[planCode];
  return billingCycle === "monthly" ? plan.monthlyAmount : plan.yearlyAmount;
}

export function getPeriodConfig(billingCycle: BillingCycle) {
  if (billingCycle === "yearly") {
    return {
      periodType: "Y",
      frequency: 1,
      execTimes: 99,
    } as const;
  }

  return {
    periodType: "M",
    frequency: 1,
    execTimes: 999,
  } as const;
}

export function normalizeBillingCycle(input: string | null | undefined): BillingCycle | null {
  if (input === "monthly" || input === "yearly") {
    return input;
  }
  return null;
}

export function getPlanDisplayLabel(planCode: Exclude<PlanCode, "enterprise">, billingCycle: BillingCycle) {
  const plan = BILLING_PLANS[planCode];
  return `${plan.displayName} ${billingCycle === "monthly" ? "Monthly" : "Yearly"}`;
}
