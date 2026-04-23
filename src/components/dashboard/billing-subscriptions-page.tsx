"use client";

import { useState } from "react";
import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
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

const CURRENT_PLAN: PlanId = "developer";

const PLANS: PlanItem[] = [
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
    cta: "Contact us",
    href: "/contact",
  },
] ;

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

export function BillingSubscriptionsPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingMode>("monthly");

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Billing · Subscriptions</h1>
            <p className="mt-2 text-sm text-slate-600">選擇適合的方案並管理訂閱週期。</p>
            <p className="mt-1 text-sm font-medium text-slate-800">當資料被限制時，升級即可取得完整資料</p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`rounded-lg px-3 py-1.5 text-sm ${billingPeriod === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              月付
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={`rounded-lg px-3 py-1.5 text-sm ${billingPeriod === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              年付
            </button>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-900">每次請求資料筆數</p>
          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-500">Free</p>
              <p className="font-medium text-slate-900">50</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-500">Developer / Pro</p>
              <p className="font-medium text-slate-900">5000</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs text-slate-500">Enterprise</p>
              <p className="font-medium text-slate-900">5000+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-4">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={cn("h-full", plan.featured ? "border-slate-900" : "border-slate-200")}>
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <p className="text-2xl font-semibold tracking-tight text-slate-900">{plan.name}</p>
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
                      {getDisplayPrice(plan, billingPeriod)}
                      <span className="text-base font-medium text-slate-500">{getUnit(plan, billingPeriod)}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{getHint(plan, billingPeriod)}</p>
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
                {plan.id === CURRENT_PLAN ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-6 text-sm font-medium text-slate-500"
                  >
                    你目前訂閱的方案
                  </button>
                ) : (
                  <Link href={plan.href} className={buttonClass("secondary", "w-full")}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
