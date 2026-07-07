"use client";

import { Fragment, useMemo, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
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

import { buttonClass } from "@/src/components/ui/button";
import {
  formatPlanCurrency,
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

type ComparisonRow = { label: string; values: Record<ComparisonTier, string> };
const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "價格 / 月", values: { enterprise: "聯繫我們", developer: "$2,000", max: "$200", pro: "$100", starter: "$20", free: "免費" } },
  { label: "API Keys", values: { enterprise: "Custom", developer: "20", max: "10", pro: "5", starter: "2", free: "1" } },
  { label: "RPM", values: { enterprise: "Custom", developer: "12,000", max: "3,000", pro: "1,200", starter: "300", free: "60" } },
  { label: "每月 included requests", values: { enterprise: "Custom", developer: "3,000,000", max: "300,000", pro: "100,000", starter: "10,000", free: "500" } },
  { label: "商業使用", values: { enterprise: "是", developer: "是", max: "是", pro: "是", starter: "是", free: "否" } },
  { label: "財報三表", values: { enterprise: "是", developer: "是", max: "是", pro: "是", starter: "否", free: "否" } },
  { label: "歷史深度", values: { enterprise: "完整 (raw)", developer: "完整", max: "完整", pro: "5 年", starter: "1 年", free: "1 個月" } },
  { label: "Webhook", values: { enterprise: "是", developer: "是", max: "reserved", pro: "reserved", starter: "否", free: "否" } },
];

const CARD_CTA_CLASS = buttonClass("primary", "h-14 w-full rounded-2xl px-5 text-base font-medium leading-none");
const SECONDARY_CTA_CLASS = buttonClass("secondary", "h-12 rounded-2xl px-5 text-sm font-medium");

export function PricingShell() {
  const planViews = useMemo(() => getPricingPlanViews(), []);
  const paidPlans = useMemo(
    () => planViews.filter((plan) => plan.planCode !== "free" && !plan.isContactOnly),
    [planViews],
  );
  const freePlan = getPricingPlanView("free");
  const enterprisePlan = getPricingPlanView("enterprise");

  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [errorPlan, setErrorPlan] = useState<string | null>(null);

  async function handleUpgrade(planCode: string) {
    if (pendingPlan) return;
    setPendingPlan(planCode);
    setErrorPlan(null);

    void trackEvent(
      {
        event: "pricing_upgrade_clicked",
        properties: { planCode, billingCycle: "monthly", contactOnly: false },
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
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">選擇你的方案</h2>
          <p className="mt-2 text-sm text-slate-500">月繳、以 USD 計價，站內完成結帳。</p>
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
                  {plan.planCode === "pro" ? (
                    <span className="mb-3 inline-flex w-fit items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      最受歡迎
                    </span>
                  ) : null}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[1.65rem] font-medium tracking-tight text-slate-900">{plan.displayName}</h3>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{plan.usageMultiplier}</span>
                  </div>

                  <div className="mt-10 min-h-[64px]">
                    <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">
                      {formatPlanCurrency(plan.monthlyAmount)}
                      <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400"> / 月</span>
                    </p>
                  </div>

                  <p className="mt-6 text-sm font-normal leading-6 text-slate-600">{plan.summary}</p>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      className={cn(CARD_CTA_CLASS, "disabled:cursor-not-allowed disabled:opacity-60")}
                      disabled={pendingPlan === plan.planCode}
                      onClick={() => handleUpgrade(plan.planCode)}
                    >
                      {pendingPlan === plan.planCode ? "開啟結帳中…" : plan.ctaLabel}
                    </button>
                    {errorPlan === plan.planCode ? (
                      <p className="mt-2 text-xs text-red-600">結帳暫時無法開啟，請稍後再試或聯繫我們。</p>
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

                <p className="mt-6 text-xs text-slate-500">信用卡定期扣款，可於帳務頁 Customer Portal 取消。</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-medium text-slate-900">{freePlan.displayName}</p>
              <p className="mt-1 text-sm text-slate-600">{freePlan.summary}</p>
            </div>
            <Link href={freePlan.href} className={SECONDARY_CTA_CLASS}>{freePlan.ctaLabel}</Link>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-medium text-slate-900">{enterprisePlan.displayName}</p>
              <p className="mt-1 text-sm text-slate-600">{enterprisePlan.summary}</p>
            </div>
            <Link
              href={enterprisePlan.href}
              className={SECONDARY_CTA_CLASS}
              onClick={() => {
                void trackEvent(
                  {
                    event: "pricing_upgrade_clicked",
                    properties: { planCode: "enterprise", billingCycle: "monthly", contactOnly: true },
                    context: { source: "client", page: "/pricing" },
                  },
                  { dedupeKey: "pricing-upgrade:enterprise", dedupeMs: 2000 },
                );
              }}
            >
              {enterprisePlan.ctaLabel}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          本服務提供資料 API、工具與文件，不提供投資建議、個股推薦或交易訊號。
        </p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Comparison Table</h2>
          <p className="mt-2 text-sm text-slate-600">各層級的價格、配額與存取差異。實際資料集可用範圍請以 docs 的 coverage/status 註記為準。</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] table-fixed text-sm leading-5">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-[22%] border-b border-slate-200 px-4 py-3 text-left align-middle font-semibold">功能</th>
                {COMPARISON_TIERS.map((tier) => (
                  <th key={tier.key} className="border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">{tier.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <Fragment key={row.label}>
                  <tr className="text-slate-700">
                    <td className="border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-slate-900">{row.label}</td>
                    {COMPARISON_TIERS.map((tier) => (
                      <td key={tier.key} className="border-b border-slate-100 px-4 py-3 text-center align-middle">{row.values[tier.key]}</td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">
          註：TPEx 日線歷史深度目前仍為 deferred；adjusted prices、survivorship-safe universe、backtest-grade full-market baseline 皆不在目前可公開宣稱範圍。
        </p>
      </section>
    </div>
  );
}
