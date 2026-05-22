import type { Metadata } from "next";
import Link from "next/link";

import { DatasetFamilyTabs } from "@/src/components/datasets/dataset-family-tabs";
import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";

const datasetFamilies = [
  {
    id: "market-prices",
    label: "市場價格",
    description: "追蹤上市櫃股票每日價格、成交量與技術分析基礎資料。",
    datasets: [
      {
        name: "TWSE 日線價格",
        description: "上市股票每日價格與成交資料，是價格分析、回測與技術指標的基礎。",
        href: "/docs/api/market-prices/twse-daily-price",
        overviewHref: "/datasets/twse-daily-price",
      },
      {
        name: "TPEx 日線價格",
        description: "上櫃股票每日價格與成交資料，用於觀察中小型股與櫃買市場變化。",
        href: "/docs/introduction",
      },
      {
        name: "技術指標",
        description: "由價格與成交量衍生的研究指標，可用於趨勢、動能與風險分析。",
        href: "/docs/introduction",
      },
    ],
  },
  {
    id: "fundamentals",
    label: "財報與基本面",
    description: "追蹤月營收、損益表、資產負債表與公司營運體質。",
    datasets: [
      {
        name: "月營收",
        description: "公司每月公告的營業收入資料，可用於追蹤成長趨勢與營運變化。",
        href: "/docs/api/financial-growth/monthly-revenue",
        overviewHref: "/datasets/monthly-revenue",
      },
      {
        name: "損益表",
        description: "公司季度營收、毛利、營業利益、淨利與 EPS，是獲利能力分析核心。",
        href: "/docs/api/financial-growth/income-statement",
        overviewHref: "/datasets/income-statement",
      },
      {
        name: "資產負債表",
        description: "公司資產、負債與股東權益資料，用於判斷財務體質與風險承受力。",
        href: "/docs/api/financial-growth/balance-sheet",
        overviewHref: "/datasets/balance-sheet",
      },
      {
        name: "現金流量表",
        description: "追蹤公司營業、投資與籌資現金流，用於觀察獲利品質與現金創造能力。",
        href: "/docs/introduction",
      },
      {
        name: "估值資料",
        description: "整理本益比、股價淨值比、殖利率等資料，用於衡量價格與基本面的關係。",
        href: "/docs/api/financial-growth/valuation-data",
      },
      {
        name: "公司基本資料",
        description: "整理股票代號、公司名稱、產業分類與上市櫃資訊，是資料串接與分組研究基礎。",
        href: "/docs/api/company/issuer-profile",
      },
    ],
  },
  {
    id: "trading-flow",
    label: "籌碼與交易",
    description: "觀察三大法人、融資融券與市場資金流向。",
    datasets: [
      {
        name: "三大法人買賣超",
        description: "整理外資、投信、自營商每日買賣超，用於觀察台股籌碼與資金流向。",
        href: "/docs/api/capital-flow/institutional-flow",
        overviewHref: "/datasets/institutional-flow",
        note: "此資料集 coverage 正在持續補齊中，請以實際回應與 data_gaps 訊號為準。",
      },
      {
        name: "融資融券",
        description: "整理信用交易資料，用於觀察市場槓桿、散戶情緒與短線風險。",
        href: "/docs/api/capital-flow/margin-short",
      },
    ],
  },
  {
    id: "events-research",
    label: "事件與研究",
    description: "整理公司事件、公告 metadata 與 AI research-ready evidence。",
    datasets: [
      {
        name: "事件與公告 metadata",
        description: "整理公司公告、注意股、處置股與事件分類 metadata，支援事件研究與風險監控。",
        href: "/docs/api/company-events/events-calendar",
      },
    ],
  },
] as const;

const analysisUsage = [
  {
    title: "價格資料",
    description: "判斷市場定價、波動、趨勢與回測條件。",
  },
  {
    title: "基本面資料",
    description: "追蹤營收、獲利能力、財務體質與成長變化。",
  },
  {
    title: "籌碼資料",
    description: "觀察法人、信用交易與資金流向對價格的影響。",
  },
  {
    title: "事件資料",
    description: "補足財報與價格無法即時反映的公司事件與風險訊號。",
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
  const datasetItemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TW Market Data 核心資料集目錄",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TWSE 日線價格", url: "https://twmarketdata.com/datasets/twse-daily-price" },
      { "@type": "ListItem", position: 2, name: "TPEx 日線價格", url: "https://twmarketdata.com/docs/introduction" },
      { "@type": "ListItem", position: 3, name: "技術指標", url: "https://twmarketdata.com/docs/introduction" },
      { "@type": "ListItem", position: 4, name: "月營收", url: "https://twmarketdata.com/datasets/monthly-revenue" },
      { "@type": "ListItem", position: 5, name: "損益表", url: "https://twmarketdata.com/datasets/income-statement" },
      { "@type": "ListItem", position: 6, name: "資產負債表", url: "https://twmarketdata.com/datasets/balance-sheet" },
      { "@type": "ListItem", position: 7, name: "現金流量表", url: "https://twmarketdata.com/docs/introduction" },
      { "@type": "ListItem", position: 8, name: "三大法人買賣超", url: "https://twmarketdata.com/datasets/institutional-flow" },
      { "@type": "ListItem", position: 9, name: "融資融券", url: "https://twmarketdata.com/docs/api/capital-flow/margin-short" },
      { "@type": "ListItem", position: 10, name: "估值資料", url: "https://twmarketdata.com/docs/api/financial-growth/valuation-data" },
      { "@type": "ListItem", position: 11, name: "公司基本資料", url: "https://twmarketdata.com/docs/api/company/issuer-profile" },
      { "@type": "ListItem", position: 12, name: "事件與公告 metadata", url: "https://twmarketdata.com/docs/api/company-events/events-calendar" },
    ],
  };

  return (
    <Container className="py-12 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetItemListLd) }}
      />
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

        <DatasetFamilyTabs families={datasetFamilies} />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">股票分析如何使用這些資料</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analysisUsage.map((item) => (
              <article key={item.title} className="rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </Container>
  );
}
