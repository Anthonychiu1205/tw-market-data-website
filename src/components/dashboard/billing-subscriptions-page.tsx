"use client";

import Link from "next/link";
import {
  Activity,
  BarChart3,
  Clock3,
  Cpu,
  Database,
  Gauge,
  KeyRound,
  Layers3,
  Shield,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { cn } from "@/src/lib/cn";

type PlanId = "team" | "pro" | "developer";

type PlanItem = {
  id: PlanId;
  name: string;
  summary: string;
  monthly: string;
  usageMultiplier: string;
  highlights: Array<{
    text: string;
    icon:
      | "database"
      | "key"
      | "gauge"
      | "activity"
      | "layers3"
      | "shield"
      | "barChart3"
      | "clock3"
      | "users"
      | "cpu"
      | "workflow"
      | "zap"
      | "sparkles";
  }>;
  cta: string;
  href: string;
  featured?: boolean;
};

const CURRENT_PLAN: PlanId = "developer";

const plans: PlanItem[] = [
  {
    id: "team",
    name: "Team",
    summary: "全量資料與團隊級用量。",
    monthly: "NT$6,000",
    usageMultiplier: "20x",
    highlights: [
      { text: "全部 26 個資料集", icon: "database" },
      { text: "API Keys 10", icon: "key" },
      { text: "RPM 600", icon: "gauge" },
      { text: "每日 20,000 / 每月 500,000", icon: "activity" },
      { text: "高頻 API 存取", icon: "zap" },
      { text: "團隊協作支援", icon: "users" },
      { text: "多 API key 管理", icon: "workflow" },
      { text: "低延遲資料更新", icon: "clock3" },
      { text: "團隊 usage 管理", icon: "layers3" },
      { text: "優先支援", icon: "shield" },
      { text: "進階監控", icon: "cpu" },
    ],
    cta: "選擇團隊方案",
    href: "/billing/subscriptions",
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    summary: "進階資料與正式商業使用。",
    monthly: "NT$1,490",
    usageMultiplier: "5x",
    highlights: [
      { text: "20 個資料集可用", icon: "database" },
      { text: "API Keys 5", icon: "key" },
      { text: "RPM 120", icon: "gauge" },
      { text: "每日 4,000 / 每月 100,000", icon: "activity" },
      { text: "商業使用", icon: "shield" },
      { text: "API key usage insights", icon: "barChart3" },
      { text: "歷史資料存取", icon: "clock3" },
      { text: "優先更新頻率", icon: "sparkles" },
    ],
    cta: "選擇專業方案",
    href: "/billing/subscriptions",
  },
  {
    id: "developer",
    name: "Developer",
    summary: "開發驗證與輕量整合。",
    monthly: "NT$690",
    usageMultiplier: "1x",
    highlights: [
      { text: "10 個資料集可用", icon: "database" },
      { text: "API Keys 2", icon: "key" },
      { text: "RPM 30", icon: "gauge" },
      { text: "每日 800 / 每月 20,000", icon: "activity" },
      { text: "基本使用量監控", icon: "barChart3" },
      { text: "簡化 dataset breakdown", icon: "layers3" },
    ],
    cta: "選擇開發者方案",
    href: "/billing/subscriptions",
  },
];

const ICON_MAP = {
  database: Database,
  key: KeyRound,
  gauge: Gauge,
  activity: Activity,
  layers3: Layers3,
  shield: Shield,
  barChart3: BarChart3,
  clock3: Clock3,
  users: Users,
  cpu: Cpu,
  workflow: Workflow,
  zap: Zap,
  sparkles: Sparkles,
} as const;

const CARD_CTA_BASE_CLASS = "inline-flex h-12 w-full items-center justify-center rounded-2xl border px-5 text-sm font-medium transition-colors duration-150";
const CARD_CTA_CLASS = `${CARD_CTA_BASE_CLASS} border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100`;

export function BillingSubscriptionsPage() {
  return (
    <div className="py-8">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 xl:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={cn(
              "h-full min-h-[600px] rounded-2xl border bg-white p-6 sm:p-7",
              plan.featured ? "border-slate-900" : "border-slate-200",
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[1.65rem] font-medium tracking-tight text-slate-900">{plan.name}</h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {plan.usageMultiplier}
                  </span>
                </div>

                <div className="pt-1">
                  <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">
                    {plan.monthly}
                    <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400"> / 月</span>
                  </p>
                </div>

                <p className="text-sm font-normal leading-6 text-slate-600">{plan.summary}</p>

                <div className="pt-2">
                  {plan.id === CURRENT_PLAN ? (
                    <button
                      type="button"
                      disabled
                      className={cn(
                        CARD_CTA_BASE_CLASS,
                        "cursor-default border-slate-200 bg-slate-100 text-slate-500",
                      )}
                    >
                      目前方案
                    </button>
                  ) : (
                    <Link href={plan.href} className={CARD_CTA_CLASS}>
                      {plan.cta}
                    </Link>
                  )}
                </div>

                <ul className="space-y-3.5 pt-2 text-[13px] text-slate-600">
                  {plan.highlights.map((item) => {
                    const Icon = ICON_MAP[item.icon];
                    return (
                      <li key={`${plan.id}-${item.text}`} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-slate-400">
                          <Icon size={15} strokeWidth={1.65} />
                        </span>
                        <span className="leading-6">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
