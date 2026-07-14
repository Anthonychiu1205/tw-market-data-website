// 6-tier USD monthly plan model, aligned with the read API canonical plan ladder
// (free/starter/pro/max/developer/enterprise). The paid tiers map 1:1 to Polar
// subscription products; the read API's Polar webhook is the single source of truth
// for provisioning, so these codes must match it exactly.
// Authoritative per-tier values (monthly USD / api keys / RPM / monthly quota):
//   free       $0     1 key   RPM 60      500/mo        no financial_statements, non-commercial, 1mo history
//   starter    $20    2 keys  RPM 300     10,000/mo     no financial_statements, commercial, 1yr history
//   pro        $100   5 keys  RPM 1,200   100,000/mo    all datasets, 5yr history
//   max        $200   10 keys RPM 3,000   300,000/mo    all datasets, full history
//   developer  $2000  20 keys RPM 12,000  3,000,000/mo  all datasets, full history, webhook
//   enterprise contact custom custom      custom        all datasets, full_raw, dedicated
import { formatMoneyOrFallback, type CurrencyCode } from "@/src/lib/billing/money";

export type PlanCode = "starter" | "pro" | "max" | "developer" | "enterprise";
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
  // Money in integer MINOR units (USD cents) — never floats, and never a bare number whose currency
  // you have to infer from which formatter you called. Render with formatMoney(minor, currency).
  monthlyAmountMinor: number | null;
  // Annual price = monthly × 10 (i.e. "2 months free" vs paying monthly ×12).
  // null for contact-only tiers. Display-only for now — yearly Polar checkout is not
  // wired yet (no yearly price id), so the pricing UI treats annual as "coming soon".
  annualAmountMinor: number | null;
  currency: CurrencyCode;
  apiKeyLimit: number | null;
  // Included requests per month, and the per-key rate limit. These were previously only in the
  // header comment and in hand-written label strings, while the dashboard hardcoded 250,000/60 for
  // EVERY plan — so "月度剩餘" was wrong for every tier. Numbers are the SSOT; labels derive from them.
  // null = custom (enterprise).
  monthlyRequestQuota: number | null;
  rateLimitPerMin: number | null;
  datasetLimit: string;
  isContactOnly: boolean;
};

export type PricingPlanView = {
  planCode: PricingPlanCode;
  displayName: string;
  summary: string;
  monthlyAmountMinor: number | null;
  annualAmountMinor: number | null;
  currency: CurrencyCode;
  monthlyHint: string;
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
  starter: {
    planCode: "starter",
    displayName: "Starter",
    monthlyAmountMinor: 2000,
    annualAmountMinor: 20000,
    currency: "USD",
    apiKeyLimit: 2,
    monthlyRequestQuota: 10_000,
    rateLimitPerMin: 300,
    datasetLimit: "全部資料集（不含財報三表）",
    isContactOnly: false,
  },
  pro: {
    planCode: "pro",
    displayName: "Pro",
    monthlyAmountMinor: 10000,
    annualAmountMinor: 100000,
    currency: "USD",
    apiKeyLimit: 5,
    monthlyRequestQuota: 100_000,
    rateLimitPerMin: 1_200,
    datasetLimit: "全部資料集（含財報三表）",
    isContactOnly: false,
  },
  max: {
    planCode: "max",
    displayName: "Max",
    monthlyAmountMinor: 20000,
    annualAmountMinor: 200000,
    currency: "USD",
    apiKeyLimit: 10,
    monthlyRequestQuota: 300_000,
    rateLimitPerMin: 3_000,
    datasetLimit: "全部資料集（完整歷史）",
    isContactOnly: false,
  },
  developer: {
    planCode: "developer",
    displayName: "Developer",
    monthlyAmountMinor: 200000,
    annualAmountMinor: 2000000,
    currency: "USD",
    apiKeyLimit: 20,
    monthlyRequestQuota: 3_000_000,
    rateLimitPerMin: 12_000,
    datasetLimit: "全部資料集（含 webhook）",
    isContactOnly: false,
  },
  enterprise: {
    planCode: "enterprise",
    displayName: "Enterprise",
    monthlyAmountMinor: null,
    annualAmountMinor: null,
    currency: "USD",
    apiKeyLimit: null,
    monthlyRequestQuota: null,
    rateLimitPerMin: null,
    datasetLimit: "客製資料範圍",
    isContactOnly: true,
  },
};

const PLAN_PRESENTATION: Record<PlanCode, Omit<PricingPlanView, "planCode" | "displayName" | "monthlyAmountMinor" | "annualAmountMinor" | "currency" | "isContactOnly" | "apiKeyLimit" | "datasetLimit">> = {
  enterprise: {
    summary: "以已驗證資料集為核心，搭配客製化方案。",
    monthlyHint: "客製合約",
    usageMultiplier: "Custom",
    highlights: [
      { text: "全部資料集（依 coverage 狀態）", icon: "database" },
      { text: "API key / 配額 / RPM 可客製", icon: "key" },
      { text: "商業使用與進階權限", icon: "shield" },
      { text: "專屬基礎設施與 SLA 可談", icon: "server" },
      { text: "Webhook 與歷史回補", icon: "workflow" },
      { text: "專屬支援", icon: "headphones" },
    ],
    ctaLabel: "聯繫我們",
    href: "/contact",
  },
  developer: {
    summary: "最高自助層級，高頻 production 與 webhook。",
    monthlyHint: "月付方案",
    usageMultiplier: "200 req/s",
    highlights: [
      { text: "全部資料集（含財報三表）", icon: "database" },
      { text: "API Keys 20", icon: "key" },
      { text: "RPM 12,000", icon: "gauge" },
      { text: "每月 included 3,000,000 requests", icon: "activity" },
      { text: "Webhook 開通", icon: "workflow" },
      { text: "完整歷史與回補", icon: "clock3" },
      { text: "商業使用", icon: "shield" },
      { text: "優先支援", icon: "headphones" },
    ],
    ctaLabel: "選擇 Developer",
    href: "/dashboard",
  },
  max: {
    summary: "高頻用量與完整歷史深度。",
    monthlyHint: "月付方案",
    usageMultiplier: "50 req/s",
    highlights: [
      { text: "全部資料集（含財報三表）", icon: "database" },
      { text: "API Keys 10", icon: "key" },
      { text: "RPM 3,000", icon: "gauge" },
      { text: "每月 included 300,000 requests", icon: "activity" },
      { text: "完整歷史深度", icon: "clock3" },
      { text: "商業使用", icon: "shield" },
      { text: "高頻 API 存取", icon: "zap" },
      { text: "優先支援", icon: "headphones" },
    ],
    ctaLabel: "選擇 Max",
    href: "/dashboard",
    featured: true,
  },
  pro: {
    summary: "進階資料與正式商業使用。",
    monthlyHint: "月付方案",
    usageMultiplier: "20 req/s",
    highlights: [
      { text: "全部資料集（含財報三表）", icon: "database" },
      { text: "API Keys 5", icon: "key" },
      { text: "RPM 1,200", icon: "gauge" },
      { text: "每月 included 100,000 requests", icon: "activity" },
      { text: "商業使用", icon: "shield" },
      { text: "5 年歷史深度", icon: "clock3" },
      { text: "歷史回補", icon: "layers3" },
    ],
    ctaLabel: "選擇 Pro",
    href: "/dashboard",
  },
  starter: {
    summary: "輕量整合與正式商業使用起點。",
    monthlyHint: "月付方案",
    usageMultiplier: "5 req/s",
    highlights: [
      { text: "全部資料集（不含財報三表）", icon: "database" },
      { text: "API Keys 2", icon: "key" },
      { text: "RPM 300", icon: "gauge" },
      { text: "每月 included 10,000 requests", icon: "activity" },
      { text: "商業使用", icon: "shield" },
      { text: "1 年歷史深度", icon: "clock3" },
    ],
    ctaLabel: "選擇 Starter",
    href: "/dashboard",
  },
};

const FREE_PLAN_VIEW: PricingPlanView = {
  planCode: "free",
  displayName: "Free",
  summary: "免費接入與測試，非商業使用。",
  monthlyAmountMinor: 0,
  annualAmountMinor: 0,
  currency: "USD",
  monthlyHint: "免費方案",
  usageMultiplier: "1 req/s",
  highlights: [
    { text: "基礎資料集（不含財報三表）", icon: "database" },
    { text: "API Keys 1、RPM 60", icon: "key" },
    { text: "每月 included 500 requests", icon: "activity" },
    { text: "基本 usage 顯示", icon: "sparkles" },
  ],
  ctaLabel: "開始使用",
  href: "/dashboard",
  isContactOnly: false,
  apiKeyLimit: 1,
  datasetLimit: "基礎資料集（不含財報三表）",
};

export const PRICING_PLAN_ORDER: PricingPlanCode[] = ["enterprise", "developer", "max", "pro", "starter", "free"];
export const BILLING_SUBSCRIPTION_PLAN_ORDER: Exclude<PlanCode, "enterprise">[] = ["starter", "pro", "max", "developer"];
export const PAID_PLAN_CODES: Exclude<PlanCode, "enterprise">[] = ["starter", "pro", "max", "developer"];

export function isPlanCode(value: string): value is PlanCode {
  return Object.prototype.hasOwnProperty.call(BILLING_PLANS, value);
}

export function isPaidPlanCode(value: string): value is Exclude<PlanCode, "enterprise"> {
  return PAID_PLAN_CODES.includes(value as Exclude<PlanCode, "enterprise">);
}

export function getPlanByCode(planCode: PlanCode) {
  return BILLING_PLANS[planCode];
}

/**
 * Plan price for display. Contact-only tiers have no amount — say so rather than printing "$0".
 * Delegates to the central currency-aware formatter; this module no longer hardcodes a symbol.
 */
export function formatPlanPrice(amountMinor: number | null, currency: CurrencyCode = "USD") {
  return formatMoneyOrFallback(amountMinor, currency, "聯繫我們");
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
    monthlyAmountMinor: plan.monthlyAmountMinor,
    annualAmountMinor: plan.annualAmountMinor,
    currency: plan.currency,
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

// Included quota / rate limit for EVERY plan code, including free (which is not a BILLING_PLAN).
// This is the number the dashboard must use — it previously hardcoded 250,000/60 for all tiers.
export const PLAN_REQUEST_LIMITS: Record<PlanCode | "free", { monthlyRequestQuota: number | null; rateLimitPerMin: number | null }> = {
  free: { monthlyRequestQuota: 500, rateLimitPerMin: 60 },
  starter: { monthlyRequestQuota: 10_000, rateLimitPerMin: 300 },
  pro: { monthlyRequestQuota: 100_000, rateLimitPerMin: 1_200 },
  max: { monthlyRequestQuota: 300_000, rateLimitPerMin: 3_000 },
  developer: { monthlyRequestQuota: 3_000_000, rateLimitPerMin: 12_000 },
  enterprise: { monthlyRequestQuota: null, rateLimitPerMin: null },
};

export function getPlanRequestLimits(planCode: string) {
  const key = planCode.trim().toLowerCase();
  return PLAN_REQUEST_LIMITS[key as keyof typeof PLAN_REQUEST_LIMITS] ?? PLAN_REQUEST_LIMITS.free;
}

/** Human label, DERIVED from the numbers above so the two can never drift apart. */
export function getRequestLimitLabel(planCode: string): string {
  const limits = getPlanRequestLimits(planCode);
  if (limits.monthlyRequestQuota === null || limits.rateLimitPerMin === null) return "客製配額";
  return `每月 included ${limits.monthlyRequestQuota.toLocaleString("en-US")} requests / RPM ${limits.rateLimitPerMin.toLocaleString("en-US")}`;
}
