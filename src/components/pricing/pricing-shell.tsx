"use client";

import { Fragment, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Activity,
  BarChart3,
  Briefcase,
  Clock3,
  Cpu,
  Database,
  Gauge,
  Headphones,
  KeyRound,
  Layers3,
  Server,
  Shield,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";
import { buttonClass } from "@/src/components/ui/button";
import {
  formatPlanPrice,
  getPricingPlanView,
  getPricingPlanViews,
  type PlanHighlightIcon,
} from "@/src/lib/billing/plans";
import { createCheckoutSession } from "@/src/lib/billing/checkout-actions";
import { cn } from "@/src/lib/cn";
import { trackEvent } from "@/src/lib/analytics/client";

const HIGHLIGHT_ICON_MAP = {
  database: Database,
  key: KeyRound,
  gauge: Gauge,
  activity: Activity,
  shield: Shield,
  users: Users,
  zap: Zap,
  clock3: Clock3,
  layers3: Layers3,
  workflow: Workflow,
  briefcase: Briefcase,
  sparkles: Sparkles,
  headphones: Headphones,
  server: Server,
  barChart3: BarChart3,
  cpu: Cpu,
} satisfies Record<PlanHighlightIcon, ComponentType<{ size?: number; strokeWidth?: number }>>;

// Comparison values sourced from the read API plan_entitlement_model (the single
// source of truth for entitlements). Columns run high → low.
type ComparisonTier = "enterprise" | "developer" | "max" | "pro" | "starter" | "free";
const COMPARISON_TIERS: { key: ComparisonTier; label: string }[] = [
  { key: "enterprise", label: "Enterprise" },
  { key: "developer", label: "Developer" },
  { key: "max", label: "Max" },
  { key: "pro", label: "Pro" },
  { key: "starter", label: "Starter" },
  { key: "free", label: "Free" },
];

type ComparisonRow = { labelKey: string; values: Record<ComparisonTier, string> };
type ComparisonGroup = { titleKey: string; rows: ComparisonRow[] };

// Cell values are kept as the canonical zh/data tokens here and localized at render via the
// pricing.values catalog; numeric cells ($2,000, 12,000, …) and plan-derived values pass through
// untouched (they carry no language). Row LABELS use i18n keys (pricing.rows.*).
const CELL_VALUE_KEY: Record<string, string> = {
  是: "yes",
  否: "no",
  完整: "full",
  "完整 (raw)": "fullRaw",
  reserved: "reserved",
  聯繫我們: "contactUs",
  免費: "free",
  Custom: "custom",
  "5 年": "years5",
  "1 年": "year1",
  "1 個月": "month1",
};

// Data-access rows lead the table (financialdatasets.ai-style): what datasets + how much coverage
// each plan gets. The dataset-scope row is built at render time from the plan entitlement SSOT
// (datasetLimit) so it never drifts. Per-dataset coverage numbers are NOT invented here — the
// catalog link + docs-coverage note carry the honest, verifiable specifics.
const DATA_ACCESS_ROWS: ComparisonRow[] = [
  { labelKey: "rows.financialStatements", values: { enterprise: "是", developer: "是", max: "是", pro: "是", starter: "否", free: "否" } },
  { labelKey: "rows.historyDepth", values: { enterprise: "完整 (raw)", developer: "完整", max: "完整", pro: "5 年", starter: "1 年", free: "1 個月" } },
  { labelKey: "rows.webhook", values: { enterprise: "是", developer: "是", max: "reserved", pro: "reserved", starter: "否", free: "否" } },
];

const QUOTA_ROWS: ComparisonRow[] = [
  { labelKey: "rows.price", values: { enterprise: "聯繫我們", developer: "$2,000", max: "$200", pro: "$100", starter: "$20", free: "免費" } },
  { labelKey: "rows.apiKeys", values: { enterprise: "Custom", developer: "20", max: "10", pro: "5", starter: "2", free: "1" } },
  { labelKey: "rows.rpm", values: { enterprise: "Custom", developer: "12,000", max: "3,000", pro: "1,200", starter: "300", free: "60" } },
  { labelKey: "rows.includedRequests", values: { enterprise: "Custom", developer: "3,000,000", max: "300,000", pro: "100,000", starter: "10,000", free: "500" } },
  { labelKey: "rows.commercialUse", values: { enterprise: "是", developer: "是", max: "是", pro: "是", starter: "是", free: "否" } },
];

const CARD_CTA_CLASS = buttonClass("primary", "h-14 w-full rounded-2xl px-5 text-base font-medium leading-none");

export function PricingShell() {
  const t = useTranslations("pricing");
  const locale = useLocale() as AppLocale;
  // Localize a comparison-table cell: known zh/data tokens go through the pricing.values catalog;
  // numeric / plan-derived cells pass through unchanged.
  const translateCell = (value: string): string => {
    const key = CELL_VALUE_KEY[value];
    return key ? t(`values.${key}`) : value;
  };
  const planViews = useMemo(() => getPricingPlanViews(locale), [locale]);
  const paidPlans = useMemo(
    () => planViews.filter((plan) => plan.planCode !== "free" && !plan.isContactOnly),
    [planViews],
  );

  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [errorPlan, setErrorPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const isAnnual = billingCycle === "annual";

  // Lead the comparison with dataset access. The dataset-scope row is derived from the entitlement
  // SSOT (datasetLimit) so it can't drift from the plan model.
  const comparisonGroups = useMemo<ComparisonGroup[]>(() => {
    const datasetScopeRow: ComparisonRow = {
      labelKey: "rows.datasetScope",
      values: Object.fromEntries(
        COMPARISON_TIERS.map((tier) => [tier.key, getPricingPlanView(tier.key, locale).datasetLimit]),
      ) as Record<ComparisonTier, string>,
    };
    return [
      { titleKey: "groups.datasetAccess", rows: [datasetScopeRow, ...DATA_ACCESS_ROWS] },
      { titleKey: "groups.quotaBilling", rows: QUOTA_ROWS },
    ];
  }, [locale]);

  async function handleUpgrade(planCode: string) {
    if (pendingPlan) return;
    setPendingPlan(planCode);
    setErrorPlan(null);

    void trackEvent(
      {
        event: "pricing_upgrade_clicked",
        properties: { planCode, billingCycle, contactOnly: false },
        context: { source: "client", page: "/pricing" },
      },
      { dedupeKey: `pricing-upgrade:${planCode}`, dedupeMs: 2000 },
    );

    try {
      const result = await createCheckoutSession(planCode);
      if (!result.ok) {
        if (result.error === "unauthenticated") {
          window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
          return;
        }
        setErrorPlan(planCode);
        return;
      }

      const checkout = await PolarEmbedCheckout.create(result.url, { theme: "light" });
      checkout.addEventListener("success", () => {
        window.location.href = "/billing?checkout=success";
      });
    } catch {
      setErrorPlan(planCode);
    } finally {
      setPendingPlan(null);
    }
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{t("choosePlan")}</h2>
          <p className="mt-2 text-sm text-slate-500">{t("pricedUsd")}</p>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1" role="group" aria-label={t("billingCycleAria")}>
              <button
                type="button"
                aria-pressed={!isAnnual}
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  !isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
                )}
              >
                {t("monthly")}
              </button>
              <button
                type="button"
                aria-pressed={isAnnual}
                onClick={() => setBillingCycle("annual")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
                )}
              >
                {t("annual")}
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{t("save2Months")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {paidPlans.map((plan) => (
            <article
              key={plan.planCode}
              className={cn(
                "h-full min-h-[600px] rounded-2xl border bg-white p-6 sm:p-7",
                plan.featured ? "border-slate-900" : "border-slate-200",
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex min-h-[300px] flex-col">
                  {/* Reserve the badge row height on EVERY card so the "最受歡迎" badge (Pro only)
                      never pushes Pro's content — and thus its CTA — lower than the other cards.
                      Non-Pro cards render an equal-height empty placeholder. This keeps the button
                      tops on one line in both the monthly and annual toggles. */}
                  <div className="mb-3 h-[26px]">
                    {plan.planCode === "pro" ? (
                      <span className="inline-flex w-fit items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {t("mostPopular")}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[1.65rem] font-medium tracking-tight text-slate-900">{plan.displayName}</h3>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{plan.usageMultiplier}</span>
                  </div>

                  <div className="mt-10 min-h-[64px]">
                    <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">
                      {formatPlanPrice(isAnnual ? plan.annualAmountMinor : plan.monthlyAmountMinor, plan.currency, locale)}
                      <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400"> / {isAnnual ? t("perYear") : t("perMonth")}</span>
                    </p>
                    {isAnnual ? (
                      <p className="mt-1 text-xs font-medium text-emerald-700">{t("annualEquals")}</p>
                    ) : null}
                  </div>

                  {/* Fixed min-height so the CTA (pushed down by mt-auto) sits at the same y across
                      all cards — otherwise varying summary length misaligns the "年繳即將開放" buttons. */}
                  <p className="mt-6 min-h-[72px] text-sm font-normal leading-6 text-slate-600">{plan.summary}</p>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      className={cn(CARD_CTA_CLASS, "disabled:cursor-not-allowed disabled:opacity-60")}
                      disabled={isAnnual || pendingPlan === plan.planCode}
                      onClick={() => handleUpgrade(plan.planCode)}
                    >
                      {isAnnual
                        ? t("annualComingSoon")
                        : pendingPlan === plan.planCode
                          ? t("openingCheckout")
                          : plan.ctaLabel}
                    </button>
                    {isAnnual ? (
                      <p className="mt-2 text-xs text-slate-500">{t("annualCheckoutNote")}</p>
                    ) : errorPlan === plan.planCode ? (
                      <p className="mt-2 text-xs text-red-600">{t("checkoutError")}</p>
                    ) : null}
                  </div>
                </div>

                <ul className="mt-10 space-y-5 text-[13px] text-slate-600">
                  {plan.highlights.map((item) => {
                    const Icon = HIGHLIGHT_ICON_MAP[item.icon];
                    return (
                      <li key={item.text} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-slate-400">
                          <Icon size={15} strokeWidth={1.65} />
                        </span>
                        <span className="leading-6">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-6 text-xs text-slate-500">{t("cardRecurringNote")}</p>
              </div>
            </article>
          ))}
        </div>

        {/* B-11 enterprise self-serve note (FRICTION-01 §C-1): keep contact, don't block self-serve. */}
        <p className="text-center text-sm text-slate-600">
          {t.rich("enterpriseNote", {
            b: (chunks) => <span className="font-medium text-slate-900">{chunks}</span>,
          })}
        </p>

        <p className="text-center text-xs text-slate-500">{t("notAdvice")}</p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("comparisonHeading")}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.rich("comparisonIntro", {
              catalog: (chunks) => (
                <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4">{chunks}</Link>
              ),
              coverage: (chunks) => (
                <Link href="/docs/market-coverage" className="font-medium text-slate-900 underline underline-offset-4">{chunks}</Link>
              ),
            })}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] table-fixed text-sm leading-5">
            <thead className="text-slate-600">
              <tr>
                <th scope="col" className="w-[24%] border-b border-slate-200 px-4 py-3 text-left align-middle font-semibold" aria-label={t("featureColumnAria")} />
                {COMPARISON_TIERS.map((tier) => (
                  <th key={tier.key} scope="col" className="border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold text-slate-900">{tier.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonGroups.map((group) => (
                <Fragment key={group.titleKey}>
                  <tr>
                    <td
                      colSpan={COMPARISON_TIERS.length + 1}
                      className="border-b border-slate-200 px-4 pb-2 pt-6 text-left align-middle text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {t(group.titleKey)}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.labelKey} className="text-slate-700">
                      <th scope="row" className="border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-slate-900">{t(row.labelKey)}</th>
                      {COMPARISON_TIERS.map((tier) => (
                        <td key={tier.key} className="border-b border-slate-100 px-4 py-3 text-center align-middle">{translateCell(row.values[tier.key])}</td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">{t("comparisonFootnote")}</p>
      </section>
    </div>
  );
}
