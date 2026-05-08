export type BillingCycle = "monthly" | "yearly";
export type PlanCode = "developer" | "pro" | "team" | "enterprise";
export type PricingPlanCode = PlanCode | "free";

export type PlanHighlightIcon =
  | "database"
  | "key"
  | "gauge"
  | "activity"
  | "shield"
  | "users"
  | "zap"
  | "clock3"
  | "layers3"
  | "workflow"
  | "briefcase"
  | "sparkles"
  | "headphones"
  | "server"
  | "barChart3"
  | "cpu";

export type PlanHighlight = {
  text: string;
  icon: PlanHighlightIcon;
};

export type BillingPlan = {
  planCode: PlanCode;
  displayName: string;
  monthlyAmount: number | null;
  yearlyAmount: number | null;
  apiKeyLimit: number | null;
  datasetLimit: string;
  isContactOnly: boolean;
};

export type PricingPlanView = {
  planCode: PricingPlanCode;
  displayName: string;
  summary: string;
  monthlyAmount: number | null;
  yearlyAmount: number | null;
  monthlyHint: string;
  yearlyHint: string;
  usageMultiplier: string;
  highlights: PlanHighlight[];
  ctaLabel: string;
  href: string;
  featured?: boolean;
  isContactOnly: boolean;
  apiKeyLimit: number | null;
  datasetLimit: string;
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

const PLAN_PRESENTATION: Record<PlanCode, Omit<PricingPlanView, "planCode" | "displayName" | "monthlyAmount" | "yearlyAmount" | "isContactOnly" | "apiKeyLimit" | "datasetLimit">> = {
  enterprise: {
    summary: "全量 available-now 能力與客製化方案。",
    monthlyHint: "客製合約",
    yearlyHint: "客製合約",
    usageMultiplier: "Custom",
    highlights: [
      { text: "available-now datasets 完整可用", icon: "database" },
      { text: "API key / 配額 / RPM 可客製", icon: "key" },
      { text: "商業使用與進階權限", icon: "shield" },
      { text: "SLA 與專屬支援可談", icon: "headphones" },
      { text: "客製資料供應", icon: "layers3" },
      { text: "高頻 production 支援", icon: "server" },
      { text: "專屬導入協助", icon: "briefcase" },
    ],
    ctaLabel: "聯繫我們",
    href: "/contact",
  },
  team: {
    summary: "全量資料與團隊級用量。",
    monthlyHint: "月付方案",
    yearlyHint: "年付方案",
    usageMultiplier: "20x",
    highlights: [
      { text: "available-now datasets 完整可用", icon: "database" },
      { text: "API Keys 10", icon: "key" },
      { text: "RPM 600", icon: "gauge" },
      { text: "每日上限 20,000 credits / 每月 included 500,000 credits", icon: "activity" },
      { text: "高頻 API 存取", icon: "zap" },
      { text: "團隊協作支援", icon: "users" },
      { text: "多 API key 管理", icon: "workflow" },
      { text: "低延遲資料更新", icon: "clock3" },
      { text: "優先支援", icon: "headphones" },
    ],
    ctaLabel: "選擇團隊方案",
    href: "/dashboard",
    featured: true,
  },
  pro: {
    summary: "進階資料與正式商業使用。",
    monthlyHint: "月付方案",
    yearlyHint: "年付方案",
    usageMultiplier: "5x",
    highlights: [
      { text: "20 個資料集可用", icon: "database" },
      { text: "API Keys 5", icon: "key" },
      { text: "RPM 120", icon: "gauge" },
      { text: "每日上限 4,000 credits / 每月 included 100,000 credits", icon: "activity" },
      { text: "商業使用", icon: "shield" },
      { text: "API key usage insights", icon: "layers3" },
      { text: "歷史資料存取", icon: "clock3" },
    ],
    ctaLabel: "選擇專業方案",
    href: "/dashboard",
  },
  developer: {
    summary: "開發驗證與輕量整合。",
    monthlyHint: "月付方案",
    yearlyHint: "年付方案",
    usageMultiplier: "1x",
    highlights: [
      { text: "10 個資料集可用", icon: "database" },
      { text: "API Keys 2", icon: "key" },
      { text: "RPM 30", icon: "gauge" },
      { text: "每日上限 800 credits / 每月 included 20,000 credits", icon: "activity" },
      { text: "基本用量總覽", icon: "sparkles" },
    ],
    ctaLabel: "選擇開發者方案",
    href: "/dashboard",
  },
};

const FREE_PLAN_VIEW: PricingPlanView = {
  planCode: "free",
  displayName: "Free",
  summary: "5 個資料集，快速接入與測試。",
  monthlyAmount: null,
  yearlyAmount: null,
  monthlyHint: "免費方案",
  yearlyHint: "免費方案",
  usageMultiplier: "—",
  highlights: [
    { text: "5 個資料集：twse_daily_price、tpex_daily_price、adjusted_prices、issuer_profile、monthly_revenue", icon: "database" },
    { text: "API Keys 1 把、RPM 10", icon: "key" },
    { text: "基本 usage 顯示", icon: "sparkles" },
  ],
  ctaLabel: "開始使用",
  href: "/dashboard",
  isContactOnly: false,
  apiKeyLimit: 1,
  datasetLimit: "5 個資料集",
};

export const PRICING_PLAN_ORDER: PricingPlanCode[] = ["enterprise", "team", "pro", "developer", "free"];
export const BILLING_SUBSCRIPTION_PLAN_ORDER: Exclude<PlanCode, "enterprise">[] = ["team", "pro", "developer"];
export const PAID_PLAN_CODES: Exclude<PlanCode, "enterprise">[] = ["developer", "pro", "team"];

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

export function formatPlanCurrency(amount: number | null) {
  if (amount === null) return "聯繫我們";
  return `NT$${new Intl.NumberFormat("en-US").format(amount)}`;
}

export function getPlanAmountByCycle(plan: Pick<PricingPlanView, "monthlyAmount" | "yearlyAmount">, billingCycle: BillingCycle) {
  return billingCycle === "monthly" ? plan.monthlyAmount : plan.yearlyAmount;
}

export function getPricingPlanView(planCode: PricingPlanCode): PricingPlanView {
  if (planCode === "free") {
    return FREE_PLAN_VIEW;
  }

  const plan = BILLING_PLANS[planCode];
  const presentation = PLAN_PRESENTATION[planCode];

  return {
    planCode,
    displayName: plan.displayName,
    monthlyAmount: plan.monthlyAmount,
    yearlyAmount: plan.yearlyAmount,
    isContactOnly: plan.isContactOnly,
    apiKeyLimit: plan.apiKeyLimit,
    datasetLimit: plan.datasetLimit,
    ...presentation,
  };
}

export function getPricingPlanViews() {
  return PRICING_PLAN_ORDER.map((planCode) => getPricingPlanView(planCode));
}

export function getBillingSubscriptionPlanViews() {
  return BILLING_SUBSCRIPTION_PLAN_ORDER.map((planCode) => getPricingPlanView(planCode));
}
