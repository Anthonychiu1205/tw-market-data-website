import type { Metadata } from "next";
import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";

const datasetFamilies = [
  {
    title: "市場價格",
    description:
      "提供台股日線與衍生指標資料，作為價格研究與策略流程的基礎輸入。",
    items: [
      {
        name: "TWSE 日線價格",
        status: "Production-ready",
        href: "/docs/api/market-prices/twse-daily-price",
        intro: "提供上市股票每日開盤、最高、最低、收盤、成交量與成交金額。",
        useCase: "可用於價格走勢、報酬率、波動率、回測與技術指標計算。",
        importance: "日線價格是股票研究的基礎資料，用來判斷趨勢、風險與市場定價變化。",
      },
      {
        name: "TPEx 日線價格",
        status: "Coverage limited by source rollout",
        href: "/docs/introduction",
        intro: "提供上櫃股票每日價格與成交資訊。",
        useCase: "可用於觀察中小型股、櫃買市場與不同板塊的價格變化。",
        importance: "上櫃股票常包含成長型與中小型公司，對完整台股研究不可缺少。",
      },
      {
        name: "技術指標",
        status: "Derived dataset",
        href: "/docs/introduction",
        intro: "由價格與成交量資料衍生出均線、報酬率、波動率等指標。",
        useCase: "可用於趨勢判斷、動能分析、回測條件與風險監控。",
        importance: "技術指標可補充基本面分析，協助觀察市場情緒與價格行為。",
      },
    ],
  },
  {
    title: "財報與基本面",
    description:
      "涵蓋月營收、財報三表與估值欄位，支援企業體質與獲利能力分析。",
    items: [
      {
        name: "月營收",
        status: "Available",
        href: "/docs/api/financial-growth/monthly-revenue",
        intro: "整理公司每月公告的營業收入資料。",
        useCase: "可用於追蹤營收年增率、月增率與成長趨勢。",
        importance: "月營收是台股最即時的基本面資料之一，能提前反映營運變化。",
      },
      {
        name: "損益表",
        status: "Available",
        href: "/docs/api/financial-growth/income-statement",
        intro: "提供季度營收、成本、毛利、營業利益、稅後淨利與 EPS 等資訊。",
        useCase: "可用於分析獲利能力、毛利率、營業利益率與盈餘變化。",
        importance: "損益表能判斷公司是否真正創造獲利，是基本面研究核心。",
      },
      {
        name: "資產負債表",
        status: "Available",
        href: "/docs/api/financial-growth/balance-sheet",
        intro: "整理公司資產、負債與股東權益等財務結構資料。",
        useCase: "可用於觀察負債比、資本結構、現金水位與財務穩定性。",
        importance: "資產負債表有助判斷公司體質與抗風險能力。",
      },
      {
        name: "現金流量表",
        status: "Deferred (source contract under review)",
        href: "/docs/introduction",
        intro: "追蹤公司營業、投資與籌資活動產生的現金流。",
        useCase: "可用於判斷獲利品質、資本支出與現金創造能力。",
        importance:
          "此資料集將作為財務品質分析的重要模組，實際 coverage 會依資料狀態逐步開放。",
      },
      {
        name: "估值資料",
        status: "Available",
        href: "/docs/api/financial-growth/valuation-data",
        intro: "整理本益比、股價淨值比、殖利率等估值指標。",
        useCase: "可用於比較公司價格與基本面之間的相對關係。",
        importance: "估值資料能協助判斷股價是否已反映成長預期。",
      },
    ],
  },
  {
    title: "籌碼資料",
    description:
      "聚焦法人與信用交易資料，補足價格與財報以外的資金面觀察。",
    items: [
      {
        name: "三大法人買賣超",
        status: "Backfill in progress",
        href: "/docs/api/capital-flow/institutional-flow",
        intro: "整理外資、投信、自營商每日買賣超資料。",
        useCase: "可用於追蹤法人資金流向、籌碼集中度與短中期市場偏好。",
        importance: "法人買賣超是台股籌碼分析的重要資料，可補充價格與基本面訊號。",
      },
      {
        name: "融資融券",
        status: "Planned / next",
        href: "/docs/api/capital-flow/margin-short",
        intro: "整理融資、融券與信用交易相關資料。",
        useCase: "可用於觀察散戶槓桿、信用餘額變化與市場風險情緒。",
        importance: "融資融券可反映市場過熱或偏空情緒，對風險控管與短線分析有幫助。",
      },
    ],
  },
  {
    title: "公司、分類與事件",
    description:
      "提供公司主檔、分類與事件 metadata，作為跨資料集串接與研究流程的骨幹。",
    items: [
      {
        name: "公司基本資料 / 發行人資料",
        status: "Available",
        href: "/docs/api/company/issuer-profile",
        intro: "整理股票代號、公司名稱、產業分類與上市櫃資訊。",
        useCase: "可用於資料關聯、篩選、分組與產業比較。",
        importance: "公司基本資料是各資料表串接與分類研究的基礎。",
      },
      {
        name: "市場事件 / News Intelligence metadata",
        status: "Metadata-first, source approval gated",
        href: "/docs/api/company-events/events-calendar",
        intro: "整理公司公告、注意股、處置股、重大訊息與事件分類等 metadata。",
        useCase: "可用於追蹤公司事件、監控風險訊號與建立事件研究流程。",
        importance:
          "事件資料可補充價格與財報以外的即時資訊，並以 metadata-first 模式逐步擴充。",
      },
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
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                        <p><span className="font-medium text-slate-800">簡介：</span>{item.intro}</p>
                        <p><span className="font-medium text-slate-800">用途：</span>{item.useCase}</p>
                        <p><span className="font-medium text-slate-800">為什麼重要：</span>{item.importance}</p>
                      </div>
                      <Link
                        href={item.href}
                        className="mt-3 inline-block text-xs font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
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
