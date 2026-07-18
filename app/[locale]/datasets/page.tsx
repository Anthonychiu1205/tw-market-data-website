import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { DatasetFamilyTabs } from "@/src/components/datasets/dataset-family-tabs";
import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";

// Bilingual page content data (spec §1.6): both languages live on the record; projected per locale
// at render. These families span more datasets than the catalog SSOT (datasets.ts) — TPEx / technical
// indicators / valuation / issuer profile / events have docs but no dedicated /datasets/[slug] page —
// so they carry their own *_en prose here rather than reading the catalog SSOT.
type DatasetFamilyItemSource = {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  href: string;
  overviewHref?: string;
  note?: string;
  noteEn?: string;
};

type DatasetFamilySource = {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  datasets: DatasetFamilyItemSource[];
};

const datasetFamiliesSource: DatasetFamilySource[] = [
  {
    id: "market-prices",
    label: "市場價格",
    labelEn: "Market prices",
    description: "以 TWSE 上市資料為核心，提供日線價格與衍生分析基礎資料。",
    descriptionEn:
      "Centered on TWSE-listed data, providing daily prices and foundational data for derived analysis.",
    datasets: [
      {
        name: "TWSE 日線價格",
        nameEn: "TWSE Daily Prices",
        description: "上市股票每日價格與成交資料，是價格分析、回測與技術指標的基礎。",
        descriptionEn:
          "Daily price and trading data for TWSE-listed stocks — the foundation for price analysis, backtesting, and technical indicators.",
        href: "/docs/api/market-prices/twse-daily-price",
        overviewHref: "/datasets/twse-daily-price",
      },
      {
        name: "TPEx 日線價格",
        nameEn: "TPEx Daily Prices",
        description: "上櫃股票日線資料目前為 beta / limited，歷史深度覆蓋仍在 deferred 狀態。",
        descriptionEn:
          "Daily data for TPEx-listed stocks is currently beta / limited; deep historical coverage is still deferred.",
        href: "/docs/api/market-prices/tpex-daily-price",
        note: "目前不宣稱 TPEx 歷史完整覆蓋。",
        noteEn: "No claim of complete TPEx historical coverage yet.",
      },
      {
        name: "技術指標",
        nameEn: "Technical Indicators",
        description: "由價格與成交量衍生的研究指標；目前 baseline 以 TWSE 為主。",
        descriptionEn:
          "Research indicators derived from price and volume; the current baseline is primarily TWSE.",
        href: "/docs/api/market-prices/technical-indicators",
      },
      {
        name: "市場廣度",
        nameEn: "Market Breadth",
        description: "TWSE 市場漲跌家數與漲跌停彙整，屬於 private beta。",
        descriptionEn:
          "An aggregation of TWSE advancer/decliner and limit-up/limit-down counts; private beta.",
        href: "/docs/api/market-prices/market-breadth",
        overviewHref: "/datasets/market-breadth",
      },
    ],
  },
  {
    id: "fundamentals",
    label: "財報與基本面",
    labelEn: "Financials & fundamentals",
    description: "追蹤月營收、損益表、資產負債表與公司營運體質。",
    descriptionEn:
      "Track monthly revenue, income statement, balance sheet, and company operating health.",
    datasets: [
      {
        name: "月營收",
        nameEn: "Monthly Revenue",
        description: "公司每月公告的營業收入資料，可用於追蹤成長趨勢與營運變化。",
        descriptionEn:
          "Companies' monthly reported operating revenue — for tracking growth trends and operating changes.",
        href: "/docs/api/financial-growth/monthly-revenue",
        overviewHref: "/datasets/monthly-revenue",
      },
      {
        name: "損益表",
        nameEn: "Income Statement",
        description: "公司季度營收、毛利、營業利益、淨利與 EPS，是獲利能力分析核心。",
        descriptionEn:
          "Companies' quarterly revenue, gross profit, operating income, net income, and EPS — the core of profitability analysis.",
        href: "/docs/api/financial-growth/income-statement",
        overviewHref: "/datasets/income-statement",
      },
      {
        name: "資產負債表",
        nameEn: "Balance Sheet",
        description: "公司資產、負債與股東權益資料，用於判斷財務體質與風險承受力。",
        descriptionEn:
          "Company asset, liability, and shareholders' equity data — for assessing financial health and risk tolerance.",
        href: "/docs/api/financial-growth/balance-sheet",
        overviewHref: "/datasets/balance-sheet",
      },
      {
        name: "現金流量表",
        nameEn: "Cash Flow Statement",
        description: "追蹤公司營業、投資與籌資現金流，用於觀察獲利品質與現金創造能力。",
        descriptionEn:
          "Track operating, investing, and financing cash flows — for observing earnings quality and cash-generation ability.",
        href: "/docs/api/financial-growth/cash-flow-statement",
        overviewHref: "/datasets/cash-flow-statement",
      },
      {
        name: "估值資料",
        nameEn: "Valuation Data",
        description: "整理本益比、股價淨值比、殖利率等資料，用於衡量價格與基本面的關係。",
        descriptionEn:
          "Organizes P/E, P/B, dividend yield, and similar data — for measuring the relationship between price and fundamentals.",
        href: "/docs/api/financial-growth/valuation-data",
      },
      {
        name: "公司基本資料",
        nameEn: "Company Profiles",
        description: "整理股票代號、公司名稱與產業分類；若涉及 survivorship-safe / PIT 用途，請先確認資料狀態。",
        descriptionEn:
          "Organizes ticker symbols, company names, and industry classification; for survivorship-safe / PIT uses, confirm the data status first.",
        href: "/docs/api/company/issuer-profile",
      },
    ],
  },
  {
    id: "trading-flow",
    label: "籌碼與交易",
    labelEn: "Positioning & trading",
    description: "觀察三大法人、融資融券與市場資金流向。",
    descriptionEn:
      "Observe the three major institutional investors, margin & short selling, and market fund flows.",
    datasets: [
      {
        name: "三大法人買賣超",
        nameEn: "Institutional Net Buy/Sell",
        description: "整理外資、投信、自營商每日買賣超，用於觀察台股籌碼與資金流向。",
        descriptionEn:
          "Organizes daily net buy/sell for foreign investors, investment trusts, and dealers — for observing Taiwan-stock positioning and fund flows.",
        href: "/docs/api/capital-flow/institutional-flow",
        overviewHref: "/datasets/institutional-flow",
        note: "此資料集 coverage 正在持續補齊中，請以實際回應與 data_gaps 訊號為準。",
        noteEn: "Coverage for this dataset is still being backfilled; rely on the actual response and data_gaps signals.",
      },
      {
        name: "融資融券",
        nameEn: "Margin Trading & Short Selling",
        description: "TWSE private beta 信用交易資料，整理融資/融券買賣、餘額、source lineage 與 data_gaps。",
        descriptionEn:
          "TWSE private-beta margin-credit data, organizing margin/short buys and sells, balances, source lineage, and data_gaps.",
        href: "/docs/api/capital-flow/margin-short",
        overviewHref: "/datasets/margin-short",
        note: "TWSE-only、private beta、no TPEx claim，且 daily write cron 尚未啟用。",
        noteEn: "TWSE-only, private beta, no TPEx claim, and the daily write cron is not yet enabled.",
      },
      {
        name: "借券資料",
        nameEn: "Securities Lending",
        description: "TWSE official TWT72U 借券資料，整理借券餘額、借入、還券、資料血緣與 known source gaps。",
        descriptionEn:
          "TWSE official TWT72U securities lending data, organizing lending balance, borrows, returns, data lineage, and known source gaps.",
        href: "/docs/api/capital-flow/securities-lending",
        overviewHref: "/datasets/securities-lending",
        note: "TWSE-only、no TPEx claim、known source gaps preserved，不宣稱 full-market 覆蓋。",
        noteEn: "TWSE-only, no TPEx claim, known source gaps preserved, no claim of full-market coverage.",
      },
      {
        name: "整體融資融券",
        nameEn: "Aggregate Margin & Short",
        description: "TWSE private beta 市場總體融資融券匯總資料，提供市場買賣總值與欄位。",
        descriptionEn:
          "TWSE private-beta market-wide aggregate margin & short data, providing market total buy/sell values and fields.",
        href: "/docs/api/capital-flow/total-margin-short",
        overviewHref: "/datasets/total-margin-short",
        note: "TWSE-only private beta seeded、seed scope only，且未啟用 daily write cron。",
        noteEn: "TWSE-only private-beta seeded, seed scope only, and the daily write cron is not enabled.",
      },
    ],
  },
  {
    id: "events-research",
    label: "事件與研究",
    labelEn: "Events & research",
    description: "整理公司事件、公告 metadata 與 AI research-ready evidence。",
    descriptionEn:
      "Organizes company events, disclosure metadata, and AI research-ready evidence.",
    datasets: [
      {
        name: "事件與公告 metadata",
        nameEn: "Events & Disclosure Metadata",
        description: "整理公司公告、注意股、處置股與事件分類 metadata，支援事件研究與風險監控。",
        descriptionEn:
          "Organizes company disclosures, alert stocks, disposition stocks, and event-classification metadata, supporting event research and risk monitoring.",
        href: "/docs/api/company-events/events-calendar",
      },
    ],
  },
];

type AnalysisUsageSource = {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
};

const analysisUsageSource: AnalysisUsageSource[] = [
  {
    title: "價格資料",
    titleEn: "Price data",
    description: "判斷市場定價、波動、趨勢與回測條件。",
    descriptionEn: "Assess market pricing, volatility, trends, and backtest conditions.",
  },
  {
    title: "基本面資料",
    titleEn: "Fundamental data",
    description: "追蹤營收、獲利能力、財務體質與成長變化。",
    descriptionEn: "Track revenue, profitability, financial health, and growth changes.",
  },
  {
    title: "籌碼資料",
    titleEn: "Positioning data",
    description: "觀察法人、信用交易與資金流向對價格的影響。",
    descriptionEn: "Observe how institutions, margin credit, and fund flows affect price.",
  },
  {
    title: "事件資料",
    titleEn: "Event data",
    description: "補足財報與價格無法即時反映的公司事件與風險訊號。",
    descriptionEn: "Fill in company events and risk signals that financials and prices cannot reflect in real time.",
  },
];

function projectDatasetFamilies(locale: AppLocale) {
  const en = locale === "en";
  return datasetFamiliesSource.map((family) => ({
    id: family.id,
    label: en ? family.labelEn : family.label,
    description: en ? family.descriptionEn : family.description,
    datasets: family.datasets.map((dataset) => ({
      name: en ? dataset.nameEn : dataset.name,
      description: en ? dataset.descriptionEn : dataset.description,
      href: dataset.href,
      ...(dataset.overviewHref ? { overviewHref: dataset.overviewHref } : {}),
      ...(dataset.note ? { note: en ? dataset.noteEn : dataset.note } : {}),
    })),
  }));
}

function projectAnalysisUsage(locale: AppLocale) {
  const en = locale === "en";
  return analysisUsageSource.map((item) => ({
    title: en ? item.titleEn : item.title,
    description: en ? item.descriptionEn : item.description,
  }));
}

export const metadata: Metadata = {
  title: "台股資料集總覽 | TW Market Data",
  description:
    "TWSE-first 資料集總覽：價格、財報、月營收與籌碼資料的 coverage、freshness 與 productization 狀態。",
  alternates: {
    canonical: "/datasets",
  },
  openGraph: {
    title: "台股資料集 | TW Market Data",
    description:
      "探索 TW Market Data 的 TWSE-first 台股資料集，查看各資料集 coverage / freshness 與限制狀態。",
    url: "/datasets",
    siteName: "TW Market Data",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "台股資料集 | TW Market Data",
    description:
      "探索 TWSE-first 台股資料集，查看各資料集 coverage / freshness 與限制狀態。",
  },
};

export default async function DatasetsPage() {
  const locale = await getLocale();
  const appLocale: AppLocale = locale === "en" ? "en" : "zh-TW";
  const t = await getTranslations("datasets");

  const datasetFamilies = projectDatasetFamilies(appLocale);
  const analysisUsage = projectAnalysisUsage(appLocale);

  // JSON-LD ItemList is SEO structured data (canonical zh names + absolute URLs); localizing it is
  // SEO PR4's scope, so it stays untouched here.
  const datasetItemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TW Market Data 核心資料集目錄",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TWSE 日線價格", url: "https://twmarketdata.com/datasets/twse-daily-price" },
      { "@type": "ListItem", position: 2, name: "TPEx 日線價格", url: "https://twmarketdata.com/docs/api/market-prices/tpex-daily-price" },
      { "@type": "ListItem", position: 3, name: "技術指標", url: "https://twmarketdata.com/docs/api/market-prices/technical-indicators" },
      { "@type": "ListItem", position: 4, name: "月營收", url: "https://twmarketdata.com/datasets/monthly-revenue" },
      { "@type": "ListItem", position: 5, name: "損益表", url: "https://twmarketdata.com/datasets/income-statement" },
      { "@type": "ListItem", position: 6, name: "資產負債表", url: "https://twmarketdata.com/datasets/balance-sheet" },
      { "@type": "ListItem", position: 7, name: "現金流量表", url: "https://twmarketdata.com/datasets/cash-flow-statement" },
      { "@type": "ListItem", position: 8, name: "三大法人買賣超", url: "https://twmarketdata.com/datasets/institutional-flow" },
      { "@type": "ListItem", position: 9, name: "融資融券", url: "https://twmarketdata.com/datasets/margin-short" },
      { "@type": "ListItem", position: 10, name: "借券資料", url: "https://twmarketdata.com/datasets/securities-lending" },
      { "@type": "ListItem", position: 11, name: "整體融資融券", url: "https://twmarketdata.com/datasets/total-margin-short" },
      { "@type": "ListItem", position: 12, name: "市場廣度", url: "https://twmarketdata.com/datasets/market-breadth" },
      { "@type": "ListItem", position: 13, name: "估值資料", url: "https://twmarketdata.com/docs/api/financial-growth/valuation-data" },
      { "@type": "ListItem", position: 14, name: "公司基本資料", url: "https://twmarketdata.com/docs/api/company/issuer-profile" },
      { "@type": "ListItem", position: 15, name: "事件與公告 metadata", url: "https://twmarketdata.com/docs/api/company-events/events-calendar" },
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("listEyebrow")}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            {t("heroTitle")}
          </h1>
          {/* Citable fact sentence (AEO 1.3): subject-led, verifiable scope + honest boundary. */}
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {t("heroBody")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/docs/introduction" className={buttonClass("primary")}>{t("viewApiDocs")}</Link>
            <Link href="/pricing" className={buttonClass("secondary")}>{t("viewPricing")}</Link>
          </div>
        </section>

        <DatasetFamilyTabs families={datasetFamilies} />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t("usageTitle")}</h2>
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
