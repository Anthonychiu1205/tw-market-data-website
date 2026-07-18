import { PLAN_REQUEST_LIMITS, getPricingPlanView } from "@/src/lib/billing/plans";
import type { AppLocale } from "@/src/i18n/locales";

/**
 * Canonical cancellation copy — single source of truth (mirrors
 * src/lib/legal/disclaimer.ts). The /refund §四 clause and the in-app cancel-confirm
 * modal render THESE exact strings; do not paraphrase or copy a fifth variant
 * (CLAUDE.md 鐵律 #1: SSOT, no duplicate truth sources).
 */

/** The period-end / no-proration-refund clause. Rendered verbatim in /refund §四. */
export const CANCELLATION_EFFECTIVE_AT_PERIOD_END =
  "取消後通常自下一計費週期起停止收費；已生效期間不另行按比例退款（依法另有規定者除外）。";

/**
 * English mirror of the period-end clause. This is a LEGAL string — the zh above stays the
 * canonical byte-for-byte master; the EN below is a faithful translation pending owner legal
 * sign-off (same status as INVESTMENT_DISCLAIMER_EN in src/lib/legal/disclaimer.ts).
 */
export const CANCELLATION_EFFECTIVE_AT_PERIOD_END_EN =
  "Cancellation usually stops billing from the next billing cycle; the period already in effect is not refunded on a pro-rata basis (except where otherwise required by law).";

/** Locale-aware accessor for the period-end clause. Defaults to zh-TW so existing callers keep working. */
export function getCancellationEffectiveAtPeriodEnd(locale: AppLocale = "zh-TW") {
  return locale === "en" ? CANCELLATION_EFFECTIVE_AT_PERIOD_END_EN : CANCELLATION_EFFECTIVE_AT_PERIOD_END;
}

// Free-tier limits come from the pricing SSOT so the warning can never drift from the
// real numbers (CLAUDE.md 鐵律 #3: displayed numbers follow the source, never hardcoded).
const FREE_LIMITS = PLAN_REQUEST_LIMITS.free;
const FREE_KEY_LIMIT = getPricingPlanView("free").apiKeyLimit ?? 1;
const FREE_MONTHLY_QUOTA = FREE_LIMITS.monthlyRequestQuota ?? 0;

/** What happens to API keys once cancellation takes effect — shown in the confirm modal. */
export const CANCELLATION_API_KEY_DOWNGRADE_WARNING = `取消生效後，API 金鑰將降為免費層限制（${FREE_KEY_LIMIT} 把金鑰、RPM ${FREE_LIMITS.rateLimitPerMin}、每月 ${FREE_MONTHLY_QUOTA.toLocaleString("en-US")} 次）。`;

/** English mirror of the API-key downgrade warning. Free-tier numbers come from the same SSOT. */
export const CANCELLATION_API_KEY_DOWNGRADE_WARNING_EN = `After cancellation takes effect, API keys drop to the free-tier limits (${FREE_KEY_LIMIT} API key${FREE_KEY_LIMIT === 1 ? "" : "s"}, RPM ${FREE_LIMITS.rateLimitPerMin}, ${FREE_MONTHLY_QUOTA.toLocaleString("en-US")} requests/month).`;

/** Locale-aware accessor for the API-key downgrade warning. Defaults to zh-TW. */
export function getCancellationApiKeyDowngradeWarning(locale: AppLocale = "zh-TW") {
  return locale === "en" ? CANCELLATION_API_KEY_DOWNGRADE_WARNING_EN : CANCELLATION_API_KEY_DOWNGRADE_WARNING;
}
