import type { Metadata } from "next";
import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";

const datasetFamilies = [
  {
    title: "市場價格",
    description:
      "提供台股日線與衍生指標查詢，適合行情監控、回測前置資料整理與研究流程接入。",
    items: [
      { name: "TWSE 日線價格", status: "Production-ready", href: "/docs/api/market-prices/twse-daily-price" },
      { name: "TPEx 日線價格", status: "Coverage limited by source rollout", href: "/docs/introduction" },
      { name: "技術指標", status: "Derived dataset", href: "/docs/introduction" },
    ],
  },
  {
    title: "財報與基本面",
    description:
      "涵蓋月營收與核心財報欄位，支援季度追蹤、成長分析與研究上下文建立。",
    items: [
      { name: "月營收", status: "Available", href: "/docs/api/financial-growth/monthly-revenue" },
      { name: "損益表", status: "Available", href: "/docs/api/financial-growth/income-statement" },
      { name: "資產負債表", status: "Available", href: "/docs/api/financial-growth/balance-sheet" },
      { name: "現金流量表", status: "Deferred (source contract under review)", href: "/docs/introduction" },
    ],
  },
  {
    title: "籌碼資料",
    description:
      "聚焦法人與資金面資料，讓策略流程可把價格與資金流向一起看。",
    items: [
      { name: "法人買賣超", status: "Backfill in progress", href: "/docs/api/capital-flow/institutional-flow" },
      { name: "融資融券", status: "Planned / next", href: "/docs/introduction" },
    ],
  },
  {
    title: "公司、分類與事件",
    description:
      "從公司主檔、分類結構到事件 metadata，讓資料查詢與 downstream mapping 更穩定。",
    items: [
      { name: "Issuer Profile", status: "Available", href: "/docs/api/company/issuer-profile" },
      { name: "Sector / Theme taxonomy", status: "Beta / planned expansion", href: "/docs/introduction" },
      { name: "News Intelligence", status: "Metadata-first, source approval gated", href: "/docs/introduction" },
    ],
  },
] as const;

const coverageSnapshot = [
  { dataset: "TWSE daily price", status: "Production-ready", note: "High coverage" },
  { dataset: "Income statement", status: "Available", note: "12Q complete" },
  { dataset: "Balance sheet", status: "Available", note: "12Q complete" },
  { dataset: "Monthly revenue", status: "Available", note: "Coverage in progress, derived metrics planned" },
  { dataset: "Institutional flow", status: "In progress", note: "Backfill in progress" },
  { dataset: "Cash flow", status: "Deferred", note: "Source contract not confirmed" },
  { dataset: "News Intelligence", status: "Metadata-first", note: "Source approval gated" },
] as const;

const principles = [
  {
    title: "Official / public-first source policy",
    description: "優先官方或公開來源，保留來源角色與可追溯脈絡。",
  },
  {
    title: "Freshness and data gaps are explicit",
    description: "更新狀態與資料缺口會明確標示，不把缺漏包裝成完整覆蓋。",
  },
  {
    title: "API contract aligns with docs",
    description: "文件與後端行為需要對齊，確保實際 request/response 可重現。",
  },
] as const;

export const metadata: Metadata = {
  title: "台股資料集總覽 | TW Market Data",
  description:
    "台股資料集商業總覽：價格、財報、月營收與籌碼資料的 coverage、freshness 與 productization 狀態。",
  alternates: {
    canonical: "/datasets",
  },
  openGraph: {
    title: "台股資料集 | TW Market Data",
    description:
      "探索 TW Market Data 的台股資料集，包含 TWSE 日線價格、月營收、財報、法人買賣超與資料 coverage / freshness 狀態。",
    url: "/datasets",
    siteName: "TW Market Data",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "台股資料集 | TW Market Data",
    description:
      "探索 TW Market Data 的台股資料集，包含 TWSE 日線價格、月營收、財報、法人買賣超與資料 coverage / freshness 狀態。",
  },
};

export default function DatasetsPage() {
  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Datasets</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            台股資料集，為 API 與研究流程設計
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            從價格、財報、月營收到法人買賣超，TW Market Data 將台股資料整理成可追溯、可重跑、可接入 workflow 的 API 產品。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/docs/introduction" className={buttonClass("primary")}>查看 API 文件</Link>
            <Link href="/pricing" className={buttonClass("secondary")}>查看方案</Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">資料集家族</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {datasetFamilies.map((family) => (
              <article key={family.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">{family.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{family.description}</p>
                <ul className="mt-4 space-y-3">
                  {family.items.map((item) => (
                    <li key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <span className="rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-600">
                          {item.status}
                        </span>
                      </div>
                      <Link
                        href={item.href}
                        className="mt-2 inline-block text-xs font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                      >
                        查看文件
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Coverage / Freshness Snapshot</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            以下為目前公開資料產品狀態摘要，實際可用範圍以 API contract 與權限設定為準。
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="border-b border-slate-200 py-2 pr-4">Dataset</th>
                  <th className="border-b border-slate-200 py-2 pr-4">Status</th>
                  <th className="border-b border-slate-200 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {coverageSnapshot.map((row) => (
                  <tr key={row.dataset}>
                    <td className="border-b border-slate-100 py-3 pr-4 font-medium text-slate-900">{row.dataset}</td>
                    <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{row.status}</td>
                    <td className="border-b border-slate-100 py-3 text-slate-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Productization Principles</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {principles.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">從已驗證的資料集開始接入</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            若你要先建立資料 API workflow，建議從 docs 入口確認 request/response contract，再依使用量與資料需求選擇方案。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/docs/introduction" className={buttonClass("primary")}>閱讀 API 文件</Link>
            <Link href="/pricing" className={buttonClass("secondary")}>查看 Pricing</Link>
            <Link href="/register" className={buttonClass("ghost")}>建立帳號開始使用</Link>
          </div>
        </section>
      </div>
    </Container>
  );
}
