"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type BillingMode = "monthly" | "yearly";
type PlanId = "free" | "developer" | "pro" | "enterprise";

type PlanItem = {
  id: PlanId;
  name: string;
  summary: string;
  monthly: string;
  yearly: string;
  monthlyHint: string;
  yearlyHint: string;
  highlights: string[];
  persona?: string;
  cta: string;
  href: string;
  featured?: boolean;
};

type ComparisonRow = {
  feature: string;
  free: string;
  developer: string;
  pro: string;
  enterprise: string;
};

type ComparisonSection = {
  title: string;
  rows: ComparisonRow[];
};

const plans: PlanItem[] = [
  {
    id: "free",
    name: "Free",
    summary: "用於測試與初步整合",
    monthly: "免費",
    yearly: "免費",
    monthlyHint: "試用方案",
    yearlyHint: "試用方案",
    highlights: ["基本資料集（部分）", "API 存取（低速）", "開發測試用", "不適用生產系統"],
    cta: "開始使用",
    href: "/dashboard",
  },
  {
    id: "developer",
    name: "Developer",
    summary: "適合個人開發與策略驗證",
    monthly: "NT$1,500",
    yearly: "NT$16,500",
    monthlyHint: "月付方案",
    yearlyHint: "年付方案（平均約 NT$1,375 / 月）",
    highlights: ["8 個資料集（完整）", "標準 API 存取", "中等速率限制", "API 金鑰管理", "基本用量統計"],
    persona: "適用：開發、測試、研究",
    cta: "選擇開發者方案",
    href: "/dashboard",
  },
  {
    id: "pro",
    name: "Pro",
    summary: "適合量化系統與自動化策略",
    monthly: "NT$6,000",
    yearly: "NT$66,000",
    monthlyHint: "月付方案",
    yearlyHint: "年付方案（平均約 NT$5,500 / 月）",
    highlights: ["高速 API 存取（高頻）", "完整歷史資料（backfill）", "資料一致性保證（跨 dataset 對齊）", "優先更新（低延遲）", "高併發請求支援", "進階用量與監控"],
    persona: "適用：正式交易系統 / production 環境",
    cta: "選擇專業方案",
    href: "/dashboard",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    summary: "適合企業級與高可靠需求",
    monthly: "聯繫我們",
    yearly: "聯繫我們",
    monthlyHint: "",
    yearlyHint: "",
    highlights: ["無限制 API", "SLA 保證", "專用基礎設施", "自訂資料供應", "專屬支援與顧問"],
    cta: "聯繫我們",
    href: "/contact",
  },
];

const comparisonSections: ComparisonSection[] = [
  {
    title: "PLAN",
    rows: [
      { feature: "API 存取", free: "✔", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "API 金鑰", free: "1", developer: "2", pro: "5", enterprise: "多組" },
      { feature: "儀表板", free: "✔", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "商業使用", free: "❌", developer: "❌", pro: "✔", enterprise: "✔" },
    ],
  },
  {
    title: "API",
    rows: [
      { feature: "請求速率", free: "低", developer: "中", pro: "高", enterprise: "自訂" },
      { feature: "並發請求", free: "—", developer: "限制", pro: "✔", enterprise: "✔" },
      { feature: "API 穩定性", free: "基本", developer: "標準", pro: "高", enterprise: "SLA" },
      { feature: "使用量統計", free: "✔", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "高頻請求支援", free: "—", developer: "—", pro: "✔", enterprise: "✔" },
    ],
  },
  {
    title: "DATA",
    rows: [
      { feature: "行情資料", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "還原價格", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "月營收", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "財報資料", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "估值資料", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "公司事件", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "籌碼流向", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "融資融券", free: "✔（限制）", developer: "✔", pro: "✔", enterprise: "✔" },
    ],
  },
  {
    title: "DATA QUALITY",
    rows: [
      { feature: "歷史資料深度", free: "短", developer: "中", pro: "完整", enterprise: "完整" },
      { feature: "官方來源覆蓋", free: "✔", developer: "✔", pro: "✔", enterprise: "✔" },
      { feature: "資料一致性", free: "基本", developer: "標準", pro: "✔", enterprise: "✔" },
      { feature: "跨 dataset 對齊", free: "—", developer: "—", pro: "✔", enterprise: "✔" },
      { feature: "更新優先級", free: "低", developer: "標準", pro: "高", enterprise: "最高" },
    ],
  },
  {
    title: "FEATURES",
    rows: [
      { feature: "歷史回補（backfill）", free: "—", developer: "—", pro: "✔", enterprise: "✔" },
      { feature: "Webhook（預留）", free: "—", developer: "—", pro: "預留", enterprise: "✔" },
      { feature: "自訂資料集", free: "—", developer: "—", pro: "—", enterprise: "✔" },
      { feature: "SLA", free: "—", developer: "—", pro: "基本", enterprise: "✔" },
      { feature: "專用基礎設施", free: "—", developer: "—", pro: "—", enterprise: "✔" },
      { feature: "進階安全控制", free: "—", developer: "—", pro: "—", enterprise: "✔" },
      { feature: "Audit / 稽核能力", free: "—", developer: "—", pro: "—", enterprise: "✔" },
    ],
  },
];

const creditsRows = [
  { dataset: "行情資料", endpoint: "/v2/datasets/market-prices", cost: "1 credit / request" },
  { dataset: "月營收", endpoint: "/v2/datasets/monthly-revenue", cost: "1 credit / request" },
  { dataset: "財報資料", endpoint: "/v2/datasets/financials", cost: "2 credits / request" },
  { dataset: "估值資料", endpoint: "/v2/datasets/valuations", cost: "1 credit / request" },
  { dataset: "公司事件", endpoint: "/v2/datasets/corporate-actions", cost: "1 credit / request" },
  { dataset: "籌碼流向", endpoint: "/v2/datasets/chip-flows", cost: "2 credits / request" },
  { dataset: "還原價格", endpoint: "/v2/datasets/adjusted-prices", cost: "2 credits / request" },
  { dataset: "融資融券", endpoint: "/v2/datasets/margin-short", cost: "2 credits / request" },
];

function getDisplayPrice(plan: PlanItem, mode: BillingMode) {
  if (plan.id === "free") return "免費";
  if (plan.id === "enterprise") return "聯繫我們";
  return mode === "monthly" ? plan.monthly : plan.yearly;
}

function getUnit(plan: PlanItem, mode: BillingMode) {
  if (plan.id === "free" || plan.id === "enterprise") return "";
  return mode === "monthly" ? " / 月" : " / 年";
}

function getHint(plan: PlanItem, mode: BillingMode) {
  return mode === "monthly" ? plan.monthlyHint : plan.yearlyHint;
}

function normalizeComparisonValue(value: string) {
  const normalized = value.trim();
  if (normalized === "❌" || normalized === "✕" || normalized === "✖") {
    return "—";
  }
  return value;
}

export function PricingShell() {
  const [mode, setMode] = useState<BillingMode>("monthly");

  const planRows = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        displayPrice: getDisplayPrice(plan, mode),
        unit: getUnit(plan, mode),
        hint: getHint(plan, mode),
      })),
    [mode],
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          <button
            className={cn(
              "h-11 rounded-xl px-6 text-sm font-medium transition",
              mode === "monthly" ? "bg-slate-950 text-white hover:text-white" : "text-slate-600 hover:bg-slate-100",
            )}
            onClick={() => setMode("monthly")}
            type="button"
          >
            月付
          </button>
          <button
            className={cn(
              "h-11 rounded-xl px-6 text-sm font-medium transition",
              mode === "yearly" ? "bg-slate-950 text-white hover:text-white" : "text-slate-600 hover:bg-slate-100",
            )}
            onClick={() => setMode("yearly")}
            type="button"
          >
            年付
          </button>
        </div>
      </div>

      <section className="grid items-stretch gap-4 xl:grid-cols-4">
        {planRows.map((plan) => (
          <article
            key={plan.id}
            className={cn(
              "h-full min-h-[390px] rounded-xl border bg-white p-6",
              plan.featured ? "border-slate-900" : "border-slate-200",
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{plan.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{plan.summary}</p>

                {plan.id === "enterprise" ? (
                  <>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900" aria-hidden="true">
                      <span className="invisible">
                        NT$0
                        <span className="text-base font-medium text-slate-500"> / 月</span>
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500" aria-hidden="true">
                      <span className="invisible">月付方案</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
                      {plan.displayPrice}
                      <span className="text-base font-medium text-slate-500">{plan.unit}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{plan.hint}</p>
                  </>
                )}

                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="pt-[3px] text-slate-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {plan.persona ? <p className="mt-4 text-xs text-slate-500">{plan.persona}</p> : null}
              </div>

              <div className="pt-5">
                <Link
                  href={plan.href}
                  className={buttonClass("primary", "w-full")}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Comparison Table</h2>
          <p className="mt-2 text-sm text-slate-600">依使用模式、API 能力、資料深度與平台功能比較四個方案。</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[980px] table-fixed text-sm leading-5">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-[32%] border-b border-slate-200 px-4 py-3 text-left align-middle font-semibold">功能</th>
                <th className="w-[17%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Free</th>
                <th className="w-[17%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Developer</th>
                <th className="w-[17%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Pro</th>
                <th className="w-[17%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonSections.map((section) => (
                <Fragment key={section.title}>
                  <tr>
                    <td colSpan={5} className="border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {section.title}
                    </td>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={`${section.title}-${row.feature}`} className="h-12 text-slate-700">
                      <td className="border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-slate-900">{row.feature}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center align-middle">{normalizeComparisonValue(row.free)}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center align-middle">{normalizeComparisonValue(row.developer)}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center align-middle">{normalizeComparisonValue(row.pro)}</td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center align-middle">{normalizeComparisonValue(row.enterprise)}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Credits</h2>
          <p className="mt-2 text-sm text-slate-600">適合測試、驗證與低量存取的參考用量模型。</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">資料類型</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">Endpoint</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">參考成本</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {creditsRows.map((row) => (
                <tr key={row.endpoint}>
                  <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-900">{row.dataset}</td>
                  <td className="border-b border-slate-100 px-4 py-3 font-mono text-xs text-slate-600">{row.endpoint}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">此區塊為 pricing / usage reference，不代表已上線完整 credits billing engine。</p>
      </section>
    </div>
  );
}
