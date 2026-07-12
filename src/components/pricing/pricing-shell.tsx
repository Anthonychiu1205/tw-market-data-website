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
type ComparisonGroup = { title: string; rows: ComparisonRow[] };

// Data-access rows lead the table (financialdatasets.ai-style): what datasets + how much coverage
// each plan gets. The "可用資料集範圍" row is built at render time from the plan entitlement SSOT
// (datasetLimit) so it never drifts. Per-dataset coverage numbers are NOT invented here — the
// catalog link + docs-coverage note carry the honest, verifiable specifics.
const DATA_ACCESS_ROWS: ComparisonRow[] = [
  { label: "財報三表（損益／資產負債／現金流）", values: { enterprise: "是", developer: "是", max: "是", pro: "是", starter: "否", free: "否" } },
  { label: "歷史深度 / 覆蓋度", values: { enterprise: "完整 (raw)", developer: "完整", max: "完整", pro: "5 年", starter: "1 年", free: "1 個月" } },
  { label: "Webhook", values: { enterprise: "是", developer: "是", max: "reserved", pro: "reserved", starter: "否", free: "否" } },
];

const QUOTA_ROWS: ComparisonRow[] = [
  { label: "價格 / 月", values: { enterprise: "聯繫我們", developer: "$2,000", max: "$200", pro: "$100", starter: "$20", free: "免費" } },
  { label: "API Keys", values: { enterprise: "Custom", developer: "20", max: "10", pro: "5", starter: "2", free: "1" } },
  { label: "RPM", values: { enterprise: "Custom", developer: "12,000", max: "3,000", pro: "1,200", starter: "300", free: "60" } },
  { label: "每月 included requests", values: { enterprise: "Custom", developer: "3,000,000", max: "300,000", pro: "100,000", starter: "10,000", free: "500" } },
  { label: "商業使用", values: { enterprise: "是", developer: "是", max: "是", pro: "是", starter: "是", free: "否" } },
];

const CARD_CTA_CLASS = buttonClass("primary", "h-14 w-full rounded-2xl px-5 text-base font-medium leading-none");

export function PricingShell() {
  const planViews = useMemo(() => getPricingPlanViews(), []);
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
      label: "可用資料集範圍",
      values: Object.fromEntries(
        COMPARISON_TIERS.map((tier) => [tier.key, getPricingPlanView(tier.key).datasetLimit]),
      ) as Record<ComparisonTier, string>,
    };
    return [
      { title: "資料集存取", rows: [datasetScopeRow, ...DATA_ACCESS_ROWS] },
      { title: "配額與計費", rows: QUOTA_ROWS },
    ];
  }, []);

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
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">選擇你的方案</h2>
          <p className="mt-2 text-sm text-slate-500">以 USD 計價，站內完成結帳。</p>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1" role="group" aria-label="計費週期">
              <button
                type="button"
                aria-pressed={!isAnnual}
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  !isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
                )}
              >
                月繳
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
                年繳
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">送 2 個月</span>
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
                        最受歡迎
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[1.65rem] font-medium tracking-tight text-slate-900">{plan.displayName}</h3>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{plan.usageMultiplier}</span>
                  </div>

                  <div className="mt-10 min-h-[64px]">
                    <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">
                      {formatPlanCurrency(isAnnual ? plan.annualAmount : plan.monthlyAmount)}
                      <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400"> / {isAnnual ? "年" : "月"}</span>
                    </p>
                    {isAnnual ? (
                      <p className="mt-1 text-xs font-medium text-emerald-700">年繳 = 月價 ×10，等於送 2 個月。</p>
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
                        ? "年繳即將開放"
                        : pendingPlan === plan.planCode
                          ? "開啟結帳中…"
                          : plan.ctaLabel}
                    </button>
                    {isAnnual ? (
                      <p className="mt-2 text-xs text-slate-500">年繳結帳即將開放；如需立即開通請先切換為月繳。</p>
                    ) : errorPlan === plan.planCode ? (
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

        {/* B-11 enterprise self-serve note (FRICTION-01 §C-1): keep contact, don't block self-serve. */}
        <p className="text-center text-sm text-slate-600">
          企業 / 客製：<span className="font-medium text-slate-900">標準方案可直接刷卡開通</span>；需要專屬額度、發票或 SLA 再「聯繫我們」。
        </p>

        <p className="text-center text-xs text-slate-500">
          本服務提供資料 API、工具與文件，不提供投資建議、個股推薦或交易訊號。
        </p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">方案比較：可用資料集與覆蓋度</h2>
          <p className="mt-2 text-sm text-slate-600">
            一眼看出各方案的資料集範圍與歷史覆蓋度。完整資料集清單見{" "}
            <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4">資料集目錄</Link>
            ；各資料集實際 coverage 與更新狀態以{" "}
            <Link href="/docs/market-coverage" className="font-medium text-slate-900 underline underline-offset-4">docs coverage</Link>
            {" "}為準（不逐格編造覆蓋數字）。
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] table-fixed text-sm leading-5">
            <thead className="text-slate-600">
              <tr>
                <th className="w-[24%] border-b border-slate-200 px-4 py-3 text-left align-middle font-semibold" aria-label="功能" />
                {COMPARISON_TIERS.map((tier) => (
                  <th key={tier.key} className="border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold text-slate-900">{tier.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonGroups.map((group) => (
                <Fragment key={group.title}>
                  <tr>
                    <td
                      colSpan={COMPARISON_TIERS.length + 1}
                      className="border-b border-slate-200 px-4 pb-2 pt-6 text-left align-middle text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="text-slate-700">
                      <td className="border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-slate-900">{row.label}</td>
                      {COMPARISON_TIERS.map((tier) => (
                        <td key={tier.key} className="border-b border-slate-100 px-4 py-3 text-center align-middle">{row.values[tier.key]}</td>
                      ))}
                    </tr>
                  ))}
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
