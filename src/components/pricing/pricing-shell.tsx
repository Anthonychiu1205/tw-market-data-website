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

import { buttonClass } from "@/src/components/ui/button";
import {
  formatPlanCurrency,
  getPlanAmountByCycle,
  getPricingPlanView,
  getPricingPlanViews,
  type BillingCycle,
  type PlanHighlightIcon,
  type PricingPlanView,
} from "@/src/lib/billing/plans";
import { cn } from "@/src/lib/cn";
import { trackEvent } from "@/src/lib/analytics/client";

type BillingMode = BillingCycle;

type ComparisonRow = {
  feature: string;
  enterprise: ComparisonValue;
  team: ComparisonValue;
  pro: ComparisonValue;
  developer: ComparisonValue;
  free: ComparisonValue;
};

type ComparisonSection = {
  title: string;
  rows: ComparisonRow[];
};

type ExpandableDatasetCell = {
  kind: "dataset-list";
  items: string[];
  note?: string;
};

type ComparisonValue = string | ExpandableDatasetCell;
const DATASET_LIST_FEATURE = "可用資料集清單";
const ENTERPRISE_PLAN = getPricingPlanView("enterprise");
const TEAM_PLAN = getPricingPlanView("team");
const PRO_PLAN = getPricingPlanView("pro");
const DEVELOPER_PLAN = getPricingPlanView("developer");
const TEAM_API_KEY_LIMIT = TEAM_PLAN.apiKeyLimit?.toString() ?? "—";
const PRO_API_KEY_LIMIT = PRO_PLAN.apiKeyLimit?.toString() ?? "—";
const DEVELOPER_API_KEY_LIMIT = DEVELOPER_PLAN.apiKeyLimit?.toString() ?? "—";

const comparisonSections: ComparisonSection[] = [
  {
    title: "PRICING & ACCESS",
    rows: [
      {
        feature: "價格",
        enterprise: "聯繫我們",
        team: `${formatPlanCurrency(TEAM_PLAN.monthlyAmount)} / 月`,
        pro: `${formatPlanCurrency(PRO_PLAN.monthlyAmount)} / 月`,
        developer: `${formatPlanCurrency(DEVELOPER_PLAN.monthlyAmount)} / 月`,
        free: "免費",
      },
      {
        feature: "可用資料集數量",
        enterprise: ENTERPRISE_PLAN.datasetLimit,
        team: TEAM_PLAN.datasetLimit,
        pro: PRO_PLAN.datasetLimit,
        developer: DEVELOPER_PLAN.datasetLimit,
        free: "5 個資料集",
      },
      {
        feature: "可用資料集清單",
        enterprise: {
          kind: "dataset-list",
          items: [
            "TWSE 日線價格",
            "TPEx 日線價格（beta / historical deferred）",
            "還原股價（deferred）",
            "公司基本資料（coverage-limited）",
            "月營收",
            "估值資料",
            "技術指標",
            "公司公告",
            "指數市場概況",
            "利率快照",
            "損益表",
            "現金流量表",
            "資產負債表",
            "法人資金流向",
            "融資融券",
            "市場指數",
            "市場廣度",
            "事件日曆",
            "公司行動",
            "結構化事件",
            "公司新聞",
            "市場新聞",
            "主題分類",
            "指數分類",
            "Features / Factor Data",
            "Search / Query / Screener",
          ],
          note: "另可客製擴充",
        },
        team: {
          kind: "dataset-list",
          items: [
            "TWSE 日線價格",
            "TPEx 日線價格（beta / historical deferred）",
            "還原股價（deferred）",
            "公司基本資料（coverage-limited）",
            "月營收",
            "估值資料",
            "技術指標",
            "公司公告",
            "指數市場概況",
            "利率快照",
            "損益表",
            "現金流量表",
            "資產負債表",
            "法人資金流向",
            "融資融券",
            "市場指數",
            "市場廣度",
            "事件日曆",
            "公司行動",
            "結構化事件",
            "公司新聞",
            "市場新聞",
            "主題分類",
            "指數分類",
            "Features / Factor Data",
            "Search / Query / Screener",
          ],
        },
        pro: {
          kind: "dataset-list",
          items: [
            "TWSE 日線價格",
            "TPEx 日線價格（beta / historical deferred）",
            "還原股價（deferred）",
            "公司基本資料（coverage-limited）",
            "月營收",
            "估值資料",
            "技術指標",
            "公司公告",
            "指數市場概況",
            "利率快照",
            "損益表",
            "現金流量表",
            "資產負債表",
            "法人資金流向",
            "融資融券",
            "市場指數",
            "市場廣度",
            "事件日曆",
            "公司行動",
            "結構化事件",
          ],
        },
        developer: {
          kind: "dataset-list",
          items: [
            "TWSE 日線價格",
            "TPEx 日線價格（beta / historical deferred）",
            "還原股價（deferred）",
            "公司基本資料（coverage-limited）",
            "月營收",
            "估值資料",
            "技術指標",
            "公司公告",
            "指數市場概況",
            "利率快照",
          ],
        },
        free: {
          kind: "dataset-list",
          items: [
            "TWSE 日線價格",
            "TPEx 日線價格（beta / historical deferred）",
            "還原股價（deferred）",
            "公司基本資料（coverage-limited）",
            "月營收",
          ],
        },
      },
    ],
  },
  {
    title: "LIMITS",
    rows: [
      { feature: "API Keys", enterprise: "Custom", team: TEAM_API_KEY_LIMIT, pro: PRO_API_KEY_LIMIT, developer: DEVELOPER_API_KEY_LIMIT, free: "1" },
      { feature: "每日配額", enterprise: "Custom", team: "20,000", pro: "4,000", developer: "800", free: "100" },
      { feature: "每月配額", enterprise: "Custom", team: "500,000", pro: "100,000", developer: "20,000", free: "2,000" },
      { feature: "RPM", enterprise: "Custom", team: "600", pro: "120", developer: "30", free: "10" },
      { feature: "使用量倍數", enterprise: "Custom", team: TEAM_PLAN.usageMultiplier, pro: PRO_PLAN.usageMultiplier, developer: DEVELOPER_PLAN.usageMultiplier, free: "—" },
      { feature: "商業使用", enterprise: "是", team: "是", pro: "是", developer: "否", free: "否" },
    ],
  },
  {
    title: "USAGE & BILLING",
    rows: [
      { feature: "使用量總覽", enterprise: "完整", team: "完整", pro: "完整", developer: "基本", free: "基本" },
      { feature: "Dataset breakdown", enterprise: "有", team: "有", pro: "有", developer: "簡化", free: "無" },
      { feature: "API key usage breakdown", enterprise: "完整", team: "完整", pro: "基本", developer: "無", free: "無" },
      { feature: "歷史保留天數", enterprise: "Custom", team: "90 天", pro: "30 天", developer: "7 天", free: "7 天" },
      { feature: "Billing preview", enterprise: "客製", team: "完整", pro: "完整", developer: "預覽", free: "無 / 極簡" },
    ],
  },
];

const creditsRows = [
  { dataset: "TWSE 日線價格", endpoint: "/v2/datasets/twse-daily-price", cost: "1 credit / request" },
  { dataset: "損益表", endpoint: "/v2/datasets/income-statement", cost: "2 credits / request" },
  { dataset: "資產負債表", endpoint: "/v2/datasets/balance-sheet", cost: "2 credits / request" },
  { dataset: "現金流量表", endpoint: "/v2/datasets/cash-flow-statement", cost: "2 credits / request" },
  { dataset: "技術指標", endpoint: "/v2/datasets/technical-indicators", cost: "2 credits / request" },
  { dataset: "法人買賣", endpoint: "/v2/datasets/institutional-flow", cost: "2 credits / request" },
  { dataset: "市場指數", endpoint: "/v2/datasets/index-data", cost: "2 credits / request" },
  { dataset: "公司新聞", endpoint: "/v2/datasets/company-news", cost: "2 credits / request" },
  { dataset: "主題分類", endpoint: "/v2/datasets/theme-taxonomy", cost: "1 credit / request" },
];

function getDisplayPrice(plan: PricingPlanView, mode: BillingMode) {
  if (plan.planCode === "free") return "免費";
  return formatPlanCurrency(getPlanAmountByCycle(plan, mode));
}

function getUnit(plan: PricingPlanView, mode: BillingMode) {
  if (plan.planCode === "free" || plan.isContactOnly) return "";
  return mode === "monthly" ? " / 月" : " / 年";
}

function normalizeComparisonValue(value: string) {
  const normalized = value.trim();
  if (normalized === "❌" || normalized === "✕" || normalized === "✖") {
    return "—";
  }
  return value;
}

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

const CARD_CTA_CLASS = buttonClass("primary", "h-14 w-full rounded-2xl px-5 text-base font-medium leading-none");

export function PricingShell() {
  const [mode, setMode] = useState<BillingMode>("monthly");
  const [datasetListExpanded, setDatasetListExpanded] = useState(false);
  const pricingPlanViews = useMemo(() => getPricingPlanViews(), []);

  const planRows = useMemo(
    () =>
      pricingPlanViews.map((plan) => ({
        ...plan,
        displayPrice: getDisplayPrice(plan, mode),
        unit: getUnit(plan, mode),
      })),
    [mode, pricingPlanViews],
  );
  const cardPlanRows = useMemo(() => planRows.filter((plan) => plan.planCode !== "free"), [planRows]);

  function isExpandableCell(value: ComparisonValue): value is ExpandableDatasetCell {
    return typeof value === "object" && value !== null && value.kind === "dataset-list";
  }

  function renderComparisonCell(value: ComparisonValue) {
    if (!isExpandableCell(value)) {
      return <>{normalizeComparisonValue(value)}</>;
    }
    return null;
  }

  function getDatasetItems(value: ComparisonValue) {
    if (!isExpandableCell(value)) return [];
    return value.items;
  }

  function hasDataset(value: ComparisonValue, datasetName: string) {
    return getDatasetItems(value).includes(datasetName);
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">選擇你的方案</h2>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1.5">
            <button
              className={cn(
                "h-10 rounded-full px-8 text-sm font-medium transition",
                mode === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
              )}
              onClick={() => setMode("monthly")}
              type="button"
              aria-pressed={mode === "monthly"}
            >
              月繳
            </button>
            <button
              className={cn(
                "h-10 rounded-full px-8 text-sm font-medium transition",
                mode === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
              )}
              onClick={() => setMode("yearly")}
              type="button"
              aria-pressed={mode === "yearly"}
            >
              年繳
            </button>
          </div>
        </div>

        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cardPlanRows.map((plan) => (
            <article
              key={plan.planCode}
              className={cn(
                "h-full min-h-[600px] rounded-2xl border bg-white p-6 sm:p-7",
                plan.featured ? "border-slate-900" : "border-slate-200",
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex min-h-[320px] flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[1.65rem] font-medium tracking-tight text-slate-900">{plan.displayName}</h3>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{plan.usageMultiplier}</span>
                  </div>

                <div className="mt-10 min-h-[64px]">
                    {plan.isContactOnly ? (
                      <>
                        <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">聯繫我們</p>
                        <p className="mt-2 text-xs text-slate-400">客製合約</p>
                      </>
                    ) : (
                      <p className="whitespace-nowrap text-4xl font-medium tracking-tight text-slate-900">
                        {plan.displayPrice}
                        <span className="ml-1.5 inline-block align-baseline text-sm font-normal text-slate-400">{plan.unit}</span>
                      </p>
                    )}
                  </div>

                  <p className="mt-6 text-sm font-normal leading-6 text-slate-600">{plan.summary}</p>

                  <div className="mt-auto pt-4">
                    {plan.isContactOnly ? (
                      <Link
                        href={plan.href}
                        className={CARD_CTA_CLASS}
                        onClick={() => {
                          void trackEvent(
                            {
                              event: "pricing_upgrade_clicked",
                              properties: {
                                planCode: plan.planCode,
                                billingCycle: mode,
                                contactOnly: true,
                              },
                              context: { source: "client", page: "/pricing" },
                            },
                            { dedupeKey: `pricing-upgrade:${plan.planCode}:${mode}`, dedupeMs: 2000 },
                          );
                        }}
                      >
                        {plan.ctaLabel}
                      </Link>
                    ) : (
                      <form action="/api/billing/ecpay/checkout" method="post">
                        <input type="hidden" name="planCode" value={plan.planCode} />
                        <input type="hidden" name="billingCycle" value={mode} />
                        <button
                          type="submit"
                          className={CARD_CTA_CLASS}
                          onClick={() => {
                            void trackEvent(
                              {
                                event: "pricing_upgrade_clicked",
                                properties: {
                                  planCode: plan.planCode,
                                  billingCycle: mode,
                                  contactOnly: false,
                                },
                                context: { source: "client", page: "/pricing" },
                              },
                              { dedupeKey: `pricing-upgrade:${plan.planCode}:${mode}`, dedupeMs: 2000 },
                            );
                          }}
                        >
                          {plan.ctaLabel}
                        </button>
                      </form>
                    )}
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

                {plan.isContactOnly ? (
                  <p className="mt-6 text-xs text-slate-500">可依團隊需求客製資料、配額與支援層級。</p>
                ) : (
                  <p className="mt-6 text-xs text-slate-500">信用卡定期扣款，可於帳務頁取消。</p>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500">
          本服務提供資料 API、工具與文件，不提供投資建議、個股推薦或交易訊號。
        </p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Comparison Table</h2>
          <p className="mt-2 text-sm text-slate-600">同版型比較價格、資料廣度、配額與使用層級差異。各資料集實際可用範圍請以 docs 的 coverage/status 註記為準。</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[1220px] table-fixed text-sm leading-5">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-[30%] border-b border-slate-200 px-4 py-3 text-left align-middle font-semibold">功能</th>
                <th className="w-[14%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Enterprise</th>
                <th className="w-[14%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Team</th>
                <th className="w-[14%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Pro</th>
                <th className="w-[14%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Developer</th>
                <th className="w-[14%] border-b border-slate-200 px-4 py-3 text-center align-middle font-semibold">Free</th>
              </tr>
            </thead>
            <tbody>
              {comparisonSections.map((section) => (
                <Fragment key={section.title}>
                  <tr>
                    <td colSpan={6} className="border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {section.title}
                    </td>
                  </tr>
                  {section.rows.map((row) => (
                    <Fragment key={`${section.title}-${row.feature}`}>
                      <tr className="text-slate-700">
                        <td className="border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-slate-900">
                          {row.feature === DATASET_LIST_FEATURE ? (
                            <button
                              type="button"
                              onClick={() => setDatasetListExpanded((prev) => !prev)}
                              className="inline-flex items-center gap-2.5 text-left text-sm font-medium text-slate-900"
                            >
                              <span>{row.feature}</span>
                              <span
                                className={cn(
                                  "text-base leading-none text-slate-600 transition-transform",
                                  datasetListExpanded ? "rotate-180" : "rotate-0",
                                )}
                                aria-hidden="true"
                              >
                                ▾
                              </span>
                            </button>
                          ) : (
                            row.feature
                          )}
                        </td>
                        {row.feature === DATASET_LIST_FEATURE ? (
                          <>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle text-center text-slate-400">—</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle text-center text-slate-400">—</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle text-center text-slate-400">—</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle text-center text-slate-400">—</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle text-center text-slate-400">—</td>
                          </>
                        ) : (
                          <>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle">{renderComparisonCell(row.enterprise)}</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle">{renderComparisonCell(row.team)}</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle">{renderComparisonCell(row.pro)}</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle">{renderComparisonCell(row.developer)}</td>
                            <td className="border-b border-slate-100 px-4 py-3 align-middle">{renderComparisonCell(row.free)}</td>
                          </>
                        )}
                      </tr>
                      {row.feature === DATASET_LIST_FEATURE && datasetListExpanded ? (
                        <>
                          {getDatasetItems(row.team).map((datasetName) => (
                            <tr key={`${row.feature}-${datasetName}`} className="bg-slate-50/20 text-slate-700">
                              <td className="border-b border-slate-100 px-4 py-2.5 text-left align-middle text-sm text-slate-700">{datasetName}</td>
                              <td className="border-b border-slate-100 px-4 py-2.5 text-center align-middle">
                                {hasDataset(row.enterprise, datasetName) ? <span className="text-sm text-slate-700">✓</span> : <span className="text-slate-300">—</span>}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-2.5 text-center align-middle">
                                {hasDataset(row.team, datasetName) ? <span className="text-sm text-slate-700">✓</span> : <span className="text-slate-300">—</span>}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-2.5 text-center align-middle">
                                {hasDataset(row.pro, datasetName) ? <span className="text-sm text-slate-700">✓</span> : <span className="text-slate-300">—</span>}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-2.5 text-center align-middle">
                                {hasDataset(row.developer, datasetName) ? <span className="text-sm text-slate-700">✓</span> : <span className="text-slate-300">—</span>}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-2.5 text-center align-middle">
                                {hasDataset(row.free, datasetName) ? <span className="text-sm text-slate-700">✓</span> : <span className="text-slate-300">—</span>}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : null}
                    </Fragment>
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
