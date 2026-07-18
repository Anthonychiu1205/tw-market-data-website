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
import type { AppLocale } from "@/src/i18n/locales";

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
  // English mirror of datasetLimit. Numbers/scope are identical — only the language differs.
  datasetLimitEn: string;
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
    datasetLimitEn: "All datasets (excludes the three financial statements)",
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
    datasetLimitEn: "All datasets (includes the three financial statements)",
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
    datasetLimitEn: "All datasets (full history)",
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
    datasetLimitEn: "All datasets (includes webhook)",
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
    datasetLimitEn: "Custom dataset scope",
    isContactOnly: true,
  },
};

// Display copy for each paid tier, in both languages. Numbers/RPM/quota are identical across
// languages (they carry no language). `*En` fields mirror the zh fields token-for-token.
type PlanPresentation = {
  summary: string;
  summaryEn: string;
  monthlyHint: string;
  usageMultiplier: string;
  highlights: PlanHighlight[];
  highlightsEn: PlanHighlight[];
  ctaLabel: string;
  ctaLabelEn: string;
  href: string;
  featured?: boolean;
};

const PLAN_PRESENTATION: Record<PlanCode, PlanPresentation> = {
  enterprise: {
    summary: "以已驗證資料集為核心，搭配客製化方案。",
    summaryEn: "Verified datasets at the core, paired with a custom plan.",
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
    highlightsEn: [
      { text: "All datasets (per coverage status)", icon: "database" },
      { text: "Custom API keys / quota / RPM", icon: "key" },
      { text: "Commercial use and advanced entitlements", icon: "shield" },
      { text: "Dedicated infrastructure and SLA available", icon: "server" },
      { text: "Webhook and historical backfill", icon: "workflow" },
      { text: "Dedicated support", icon: "headphones" },
    ],
    ctaLabel: "聯繫我們",
    ctaLabelEn: "Contact us",
    href: "/contact",
  },
  developer: {
    summary: "最高自助層級，高頻 production 與 webhook。",
    summaryEn: "Top self-serve tier for high-frequency production and webhooks.",
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
    highlightsEn: [
      { text: "All datasets (includes the three financial statements)", icon: "database" },
      { text: "20 API keys", icon: "key" },
      { text: "RPM 12,000", icon: "gauge" },
      { text: "3,000,000 included requests/month", icon: "activity" },
      { text: "Webhook enabled", icon: "workflow" },
      { text: "Full history and backfill", icon: "clock3" },
      { text: "Commercial use", icon: "shield" },
      { text: "Priority support", icon: "headphones" },
    ],
    ctaLabel: "選擇 Developer",
    ctaLabelEn: "Choose Developer",
    href: "/dashboard",
  },
  max: {
    summary: "高頻用量與完整歷史深度。",
    summaryEn: "High-frequency usage with full historical depth.",
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
    highlightsEn: [
      { text: "All datasets (includes the three financial statements)", icon: "database" },
      { text: "10 API keys", icon: "key" },
      { text: "RPM 3,000", icon: "gauge" },
      { text: "300,000 included requests/month", icon: "activity" },
      { text: "Full historical depth", icon: "clock3" },
      { text: "Commercial use", icon: "shield" },
      { text: "High-frequency API access", icon: "zap" },
      { text: "Priority support", icon: "headphones" },
    ],
    ctaLabel: "選擇 Max",
    ctaLabelEn: "Choose Max",
    href: "/dashboard",
    featured: true,
  },
  pro: {
    summary: "進階資料與正式商業使用。",
    summaryEn: "Advanced data for production commercial use.",
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
    highlightsEn: [
      { text: "All datasets (includes the three financial statements)", icon: "database" },
      { text: "5 API keys", icon: "key" },
      { text: "RPM 1,200", icon: "gauge" },
      { text: "100,000 included requests/month", icon: "activity" },
      { text: "Commercial use", icon: "shield" },
      { text: "5 years of historical depth", icon: "clock3" },
      { text: "Historical backfill", icon: "layers3" },
    ],
    ctaLabel: "選擇 Pro",
    ctaLabelEn: "Choose Pro",
    href: "/dashboard",
  },
  starter: {
    summary: "輕量整合與正式商業使用起點。",
    summaryEn: "A lightweight starting point for integration and commercial use.",
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
    highlightsEn: [
      { text: "All datasets (excludes the three financial statements)", icon: "database" },
      { text: "2 API keys", icon: "key" },
      { text: "RPM 300", icon: "gauge" },
      { text: "10,000 included requests/month", icon: "activity" },
      { text: "Commercial use", icon: "shield" },
      { text: "1 year of historical depth", icon: "clock3" },
    ],
    ctaLabel: "選擇 Starter",
    ctaLabelEn: "Choose Starter",
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

// English mirror of the free-tier display copy. Numbers (RPM 60, 500 requests) are identical.
const FREE_PLAN_VIEW_EN: PricingPlanView = {
  ...FREE_PLAN_VIEW,
  summary: "Free access for evaluation and testing — non-commercial use.",
  highlights: [
    { text: "Core datasets (excludes the three financial statements)", icon: "database" },
    { text: "1 API key, RPM 60", icon: "key" },
    { text: "500 included requests/month", icon: "activity" },
    { text: "Basic usage display", icon: "sparkles" },
  ],
  ctaLabel: "Get started",
  datasetLimit: "Core datasets (excludes the three financial statements)",
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
export function formatPlanPrice(
  amountMinor: number | null,
  currency: CurrencyCode = "USD",
  locale: AppLocale = "zh-TW",
) {
  return formatMoneyOrFallback(amountMinor, currency, locale === "en" ? "Contact us" : "聯繫我們");
}

export function getPricingPlanView(planCode: PricingPlanCode, locale: AppLocale = "zh-TW"): PricingPlanView {
  if (planCode === "free") {
    return locale === "en" ? FREE_PLAN_VIEW_EN : FREE_PLAN_VIEW;
  }

  const plan = BILLING_PLANS[planCode];
  const presentation = PLAN_PRESENTATION[planCode];
  const isEn = locale === "en";

  return {
    planCode,
    displayName: plan.displayName,
    monthlyAmountMinor: plan.monthlyAmountMinor,
    annualAmountMinor: plan.annualAmountMinor,
    currency: plan.currency,
    isContactOnly: plan.isContactOnly,
    apiKeyLimit: plan.apiKeyLimit,
    datasetLimit: isEn ? plan.datasetLimitEn : plan.datasetLimit,
    summary: isEn ? presentation.summaryEn : presentation.summary,
    monthlyHint: presentation.monthlyHint,
    usageMultiplier: presentation.usageMultiplier,
    highlights: isEn ? presentation.highlightsEn : presentation.highlights,
    ctaLabel: isEn ? presentation.ctaLabelEn : presentation.ctaLabel,
    href: presentation.href,
    featured: presentation.featured,
  };
}

export function getPricingPlanViews(locale: AppLocale = "zh-TW") {
  return PRICING_PLAN_ORDER.map((planCode) => getPricingPlanView(planCode, locale));
}

export function getBillingSubscriptionPlanViews(locale: AppLocale = "zh-TW") {
  return BILLING_SUBSCRIPTION_PLAN_ORDER.map((planCode) => getPricingPlanView(planCode, locale));
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
export function getRequestLimitLabel(planCode: string, locale: AppLocale = "zh-TW"): string {
  const limits = getPlanRequestLimits(planCode);
  if (limits.monthlyRequestQuota === null || limits.rateLimitPerMin === null) {
    return locale === "en" ? "Custom quota" : "客製配額";
  }
  const quota = limits.monthlyRequestQuota.toLocaleString("en-US");
  const rpm = limits.rateLimitPerMin.toLocaleString("en-US");
  return locale === "en"
    ? `${quota} included requests/month / RPM ${rpm}`
    : `每月 included ${quota} requests / RPM ${rpm}`;
}
