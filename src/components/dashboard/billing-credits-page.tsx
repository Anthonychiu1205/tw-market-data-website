"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";

import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { CreditPurchaseDialog } from "@/src/components/dashboard/credit-purchase-dialog";
import { formatCredits, formatTwd, getCreditPackageViews } from "@/src/lib/billing/credits";

type EndpointRow = {
  resource: string;
  path: string;
  usageCost: string;
  docLabel: string;
  docHref: string;
};

const ENDPOINT_ROWS: Record<"market" | "fundamentals" | "events", EndpointRow[]> = {
  market: [
    { resource: "TWSE Daily Price", path: "/v2/datasets/twse-daily-price", usageCost: "1 credit", docLabel: "查看文件", docHref: "/docs/api/twse-daily-price" },
    { resource: "TPEx Daily Price", path: "/v2/datasets/tpex-daily-price", usageCost: "1 credit", docLabel: "查看文件", docHref: "/docs/api/tpex-daily-price" },
    { resource: "Market Prices", path: "/v2/datasets/market-prices", usageCost: "1 credit", docLabel: "查看文件", docHref: "/docs/api/market-prices/market-prices" },
  ],
  fundamentals: [
    { resource: "Monthly Revenue", path: "/v2/datasets/monthly-revenue", usageCost: "2 credits", docLabel: "查看文件", docHref: "/docs/api/monthly-revenue" },
    { resource: "Income Statement", path: "/v2/datasets/income-statement", usageCost: "2 credits", docLabel: "查看文件", docHref: "/docs/api/income-statement" },
    { resource: "Valuation Data", path: "/v2/datasets/valuation-data", usageCost: "2 credits", docLabel: "查看文件", docHref: "/docs/api/valuation-data" },
  ],
  events: [
    { resource: "Issuer Profile", path: "/v2/datasets/issuer-profile", usageCost: "1 credit", docLabel: "查看文件", docHref: "/docs/api/company/issuer-profile" },
  ],
};

const TAB_LABELS: Array<{ id: "market" | "fundamentals" | "events"; label: string }> = [
  { id: "market", label: "市場資料" },
  { id: "fundamentals", label: "基本面" },
  { id: "events", label: "事件" },
];

type SpendPoint = {
  date: string;
  label: string;
  spend: number;
};

const SPEND_SERIES: Record<string, SpendPoint[]> = {
  "2026-03": [
    { date: "2026-03-01", label: "03/01", spend: 120 },
    { date: "2026-03-05", label: "03/05", spend: 260 },
    { date: "2026-03-09", label: "03/09", spend: 340 },
    { date: "2026-03-13", label: "03/13", spend: 510 },
    { date: "2026-03-17", label: "03/17", spend: 460 },
    { date: "2026-03-21", label: "03/21", spend: 620 },
    { date: "2026-03-25", label: "03/25", spend: 730 },
    { date: "2026-03-29", label: "03/29", spend: 680 },
  ],
  "2026-04": [
    { date: "2026-04-01", label: "04/01", spend: 180 },
    { date: "2026-04-05", label: "04/05", spend: 230 },
    { date: "2026-04-09", label: "04/09", spend: 420 },
    { date: "2026-04-13", label: "04/13", spend: 480 },
    { date: "2026-04-17", label: "04/17", spend: 560 },
    { date: "2026-04-21", label: "04/21", spend: 690 },
    { date: "2026-04-25", label: "04/25", spend: 820 },
    { date: "2026-04-29", label: "04/29", spend: 760 },
  ],
  "2026-05": [
    { date: "2026-05-01", label: "05/01", spend: 210 },
    { date: "2026-05-05", label: "05/05", spend: 300 },
    { date: "2026-05-09", label: "05/09", spend: 390 },
    { date: "2026-05-13", label: "05/13", spend: 520 },
    { date: "2026-05-17", label: "05/17", spend: 640 },
    { date: "2026-05-21", label: "05/21", spend: 780 },
    { date: "2026-05-25", label: "05/25", spend: 920 },
    { date: "2026-05-29", label: "05/29", spend: 860 },
  ],
};

const MONTH_KEYS = Object.keys(SPEND_SERIES).sort();

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${year}年${Number(month)}月`;
}

export function BillingCreditsPage() {
  const [activeTab, setActiveTab] = useState<"market" | "fundamentals" | "events">("market");
  const [activeMonthIndex, setActiveMonthIndex] = useState(MONTH_KEYS.length - 1);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const activeMonthKey = MONTH_KEYS[activeMonthIndex];
  const spendSeries = SPEND_SERIES[activeMonthKey] ?? [];
  const packages = getCreditPackageViews();

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <p className="text-[15px] font-medium text-slate-900">餘額</p>
          <p className="mt-1 text-sm text-slate-600">可用 credits 餘額</p>
          <p className="mt-5 text-5xl font-semibold tracking-tight text-slate-900">0</p>
          <p className="mt-2 text-xs text-slate-500">尚未建立 wallet 時，餘額預設顯示為 0。</p>
          <button
            type="button"
            onClick={() => setIsPurchaseDialogOpen(true)}
            className={buttonClass("primary", "mt-6 h-12 rounded-2xl px-5 text-sm font-semibold")}
          >
            購買 credits
          </button>
        </DashboardCard>

        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <p className="text-[15px] font-medium text-slate-900">API 端點</p>
          <p className="mt-1 text-sm text-slate-600">每次 API 呼叫的 credits 成本</p>

          <div className="-mx-1 mt-5 overflow-x-auto px-1">
            <div className="inline-flex min-w-max rounded-xl bg-slate-100 p-1">
              {TAB_LABELS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 rounded-lg px-4 text-sm font-medium transition ${activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl bg-slate-50/70">
            <table className="min-w-full text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="px-3 py-3 text-left font-medium">資源</th>
                  <th className="px-3 py-3 text-left font-medium">Path</th>
                  <th className="px-3 py-3 text-left font-medium">使用成本</th>
                  <th className="px-3 py-3 text-left font-medium">文件</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINT_ROWS[activeTab].map((row) => (
                  <tr
                    key={`${row.resource}-${row.path}`}
                    className="border-t border-slate-200/70 transition hover:bg-white/70"
                  >
                    <td className="px-3 py-3 text-sm text-slate-700">{row.resource}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-md bg-slate-100/70 px-2 py-1 font-mono text-xs text-slate-500 ring-1 ring-slate-200/70">
                        {row.path}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">{row.usageCost}</td>
                    <td className="px-3 py-3">
                      <Link
                        href={row.docHref}
                        className="text-sm font-medium text-slate-700 underline-offset-4 transition hover:text-black hover:underline"
                      >
                        {row.docLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">credits 使用量取決於端點成本與請求量。</p>
        </DashboardCard>
      </section>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <p className="text-[15px] font-medium text-slate-900">儲值方案</p>
        <p className="mt-1 text-sm text-slate-600">彈性補充用量，價格高於訂閱 included credits，適合短期尖峰需求。</p>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-slate-50/70">
          <table className="min-w-full text-sm">
            <thead className="text-sm font-medium text-slate-500">
              <tr>
                <th className="px-3 py-3 text-left font-medium">方案</th>
                <th className="px-3 py-3 text-left font-medium">金額</th>
                <th className="px-3 py-3 text-left font-medium">入帳 credits</th>
                <th className="px-3 py-3 text-left font-medium">額外加值</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr
                  key={pkg.packageCode}
                  className="border-t border-slate-200/70 transition hover:bg-white/70"
                >
                  <td className="px-3 py-3 text-sm font-medium text-slate-700">
                    {pkg.label}
                    {pkg.highlight === "best_value" ? (
                      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        最划算
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatTwd(pkg.priceTwd)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCredits(pkg.credits)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {pkg.bonusCredits > 0 ? `${formatCredits(pkg.bonusCredits)} credits` : "標準入帳"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white px-6 py-5 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium text-slate-900">使用訂閱方案節省成本</p>
            <p className="mt-1 text-sm text-slate-600">改用訂閱方案可降低單次呼叫成本，並取得更高穩定性與配額。</p>
          </div>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-10 rounded-xl px-5 text-sm")}>
            查看方案
          </Link>
        </div>
      </DashboardCard>

      <section className="flex flex-col gap-6">
        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900">花費</p>
            <div className="flex items-center gap-4 text-sm text-slate-700">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeMonthIndex === 0}
                aria-label="上個月"
              >
                <span className="inline-block h-4 w-4">‹</span>
              </button>
              <span className="text-lg font-medium text-slate-700">{monthLabel(activeMonthKey)}</span>
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                onClick={() => setActiveMonthIndex((prev) => Math.min(MONTH_KEYS.length - 1, prev + 1))}
                disabled={activeMonthIndex === MONTH_KEYS.length - 1}
                aria-label="下個月"
              >
                <span className="inline-block h-4 w-4">›</span>
              </button>
            </div>
          </div>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendSeries} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748b" stopOpacity={0.16} />
                    <stop offset="100%" stopColor="#64748b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `NT$${value}`}
                  ticks={[0, 500, 1000]}
                  domain={[0, 1000]}
                  width={58}
                />
                <Tooltip
                  cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    fontSize: "12px",
                    color: "#334155",
                  }}
                  formatter={(value) => {
                    const rawValue = Array.isArray(value) ? value[0] : value;
                    const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0);
                    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
                    return [`NT$${safeValue.toLocaleString()}`, "花費"];
                  }}
                  labelFormatter={(label) => `日期 ${label}`}
                />
                <Area type="monotone" dataKey="spend" stroke="#1f2937" strokeWidth={1.8} fill="url(#spendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[15px] font-medium text-slate-900">交易記錄</p>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              匯出 CSV
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-sm font-medium text-slate-500">
                <tr>
                  <th className="px-2 py-3 text-left font-medium">Description</th>
                  <th className="px-2 py-3 text-left font-medium">金額</th>
                  <th className="px-2 py-3 text-left font-medium">日期</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td colSpan={3} className="px-2 py-6 text-center text-slate-500">No transactions yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </section>

      <CreditPurchaseDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen} />
    </div>
  );
}
