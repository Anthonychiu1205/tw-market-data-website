import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { coverageFacts } from "@/src/content/coverage-facts";

// hub-and-spoke: every dataset name links to its real docs page (verified slugs, do not change).
// Numbers come from the DB-verified coverage SSOT (coverage-facts.ts). Status stated honestly
// (TPEx deferred/beta). Delisted count uses the honest "已停止交易（下市/長期停牌）" wording per
// MARKETING_SAFE_COVERAGE_FACTS (311 stopped trading; 262 with an official delisting date).
// I18N-01: the DATASETS / DATA_FORMAT / DESIGN_PRINCIPLES arrays are structured content data (spec
// §1.6) — bilingual *_en fields + a locale switch in render. The zh fields stay the single source
// for introductionLlmsMarkdown() (/llms-full.txt, zh-only). Free-standing prose lives in the
// `docsContent` messages namespace. Numbers are shared (coverage SSOT), never restated per-locale.
const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

const twse = coverageFacts.twseDailyPrice;
const twseYear = twse.earliestDate.slice(0, 4);
const revenueYear = coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4);

const DATASETS: { href: string; name: string; name_en: string; desc: string; desc_en: string }[] = [
  {
    href: "/docs/api/market-prices/twse-daily-price",
    name: "上市日線價格",
    name_en: "TWSE daily prices",
    desc: `TWSE 個股日 OHLCV，含已停止交易股票，自 ${twseYear} 年。`,
    desc_en: `Daily OHLCV for individual TWSE-listed stocks, including stocks that have stopped trading, from ${twseYear}.`,
  },
  {
    href: "/docs/api/financial-growth/monthly-revenue",
    name: "月營收",
    name_en: "Monthly revenue",
    desc: `每月營收與 YoY／MoM，自 ${revenueYear} 年；台股獨有的月頻基本面。`,
    desc_en: `Monthly revenue with YoY/MoM, from ${revenueYear} — the monthly-frequency fundamentals unique to Taiwan equities.`,
  },
  {
    href: "/docs/api/financial-growth/income-statement",
    name: "財報三表",
    name_en: "Financial statements",
    desc: "損益表、資產負債表、現金流量表。",
    desc_en: "Income statement, balance sheet, and cash flow statement.",
  },
  {
    href: "/docs/api/capital-flow/institutional-flow",
    name: "三大法人",
    name_en: "Institutional investors",
    desc: "外資、投信、自營每日買賣超，逐檔。美股 13F 要等 45 天，這裡是每天。",
    desc_en: "Daily net buy/sell by foreign investors, investment trusts, and dealers, per stock. US 13F filings lag 45 days; here it is daily.",
  },
  {
    href: "/docs/api/financial-growth/valuation-data",
    name: "估值指標",
    name_en: "Valuation metrics",
    desc: "本益比、股價淨值比、殖利率，逐日。",
    desc_en: "P/E, P/B, and dividend yield, daily.",
  },
  {
    href: "/docs/api/market-prices/technical-indicators",
    name: "技術指標",
    name_en: "Technical indicators",
    desc: "常見技術指標，逐日。",
    desc_en: "Common technical indicators, daily.",
  },
  {
    href: "/docs/api/capital-flow/margin-short",
    name: "融資融券",
    name_en: "Margin trading & short selling",
    desc: "每日信用交易餘額。",
    desc_en: "Daily margin and short balances.",
  },
  {
    href: "/docs/api/company-events/issuer-announcements",
    name: "重大訊息",
    name_en: "Material announcements",
    desc: "上市櫃公司重大訊息與公告。",
    desc_en: "Material information and announcements from TWSE- and TPEx-listed companies.",
  },
];

const DATA_FORMAT: { term: string; term_en: string; desc: string; desc_en: string }[] = [
  {
    term: "結構化 JSON",
    term_en: "Structured JSON",
    desc: "欄位命名一致，每個端點接起來都一樣。",
    desc_en: "Consistent field naming — every endpoint integrates the same way.",
  },
  {
    term: "標準化",
    term_en: "Standardized",
    desc: "會計科目對到同一套分類，不同公司、不同期間可以直接比較。",
    desc_en: "Accounting line items map to one taxonomy, so different companies and periods compare directly.",
  },
  {
    term: "保留原貌",
    term_en: "Original values preserved",
    desc: "也提供公司原始申報的數字與標籤，不做任何臆測性調整。",
    desc_en: "The company's originally reported figures and labels are also provided, with no speculative adjustments.",
  },
  {
    term: "可追溯",
    term_en: "Traceable",
    desc: "每筆都帶來源與 knowledge_date，支援 point-in-time 回放。",
    desc_en: "Every record carries its source and knowledge_date, supporting point-in-time replay.",
  },
];

const DESIGN_PRINCIPLES: { term: string; term_en: string; desc: string; desc_en: string }[] = [
  {
    term: "只用官方第一手",
    term_en: "Official first-party sources only",
    desc: "直接接 TWSE／TPEx／MOPS／TAIFEX，中間不經二手。",
    desc_en: "Wired directly to TWSE/TPEx/MOPS/TAIFEX, with no second-hand intermediaries.",
  },
  {
    term: "覆蓋範圍透明",
    term_en: "Transparent coverage",
    desc: "每個資料集清楚標示涵蓋期間、來源與限制，不假裝全都有。",
    desc_en: "Every dataset clearly states its coverage period, source, and limits — no pretending everything is available.",
  },
  {
    term: "不偷看未來",
    term_en: "No look-ahead",
    desc: "保留 knowledge_date，回測只看得到當下已知的資料。",
    desc_en: "knowledge_date is preserved, so backtests see only the data known at the time.",
  },
  {
    term: "給機器讀的",
    term_en: "Built for machines",
    desc: "為程式呼叫最佳化，不是給人瀏覽的網頁。",
    desc_en: "Optimized for programmatic calls, not for human web browsing.",
  },
];

// Plain-text version for /llms-full.txt (auto-generated docs bundle). Reuses the same data arrays
// as the component (zh fields); the few lead sentences mirror the JSX below — keep in sync.
export function introductionLlmsMarkdown(): string {
  const lines: string[] = [
    "TW Market Data 把 TWSE、TPEx、MOPS、TAIFEX 的官方資料，整理成一致、好串接的 REST API。所有資料都由我們直接從官方來源收錄、解析後供應，不經二手。",
    "每一筆回應都附上來源與 knowledge_date；資料有缺就如實標記，絕不用推估值把洞補起來。",
    "",
    "### 可存取的資料",
    `上市個股日線最早回溯到 ${twseYear} 年，並保留 ${twse.stoppedTradingStocks} 檔已停止交易（下市／長期停牌）股票的完整價史。`,
    ...DATASETS.map((d) => `- ${d.name} — ${d.desc} (${d.href})`),
    "上櫃（TPEx）日線與還原股價目前為 beta，覆蓋範圍逐集標示。",
    "",
    "### 資料格式",
    ...DATA_FORMAT.map((f) => `- ${f.term} — ${f.desc}`),
    "",
    "### 為誰而建",
    "- 需要餵資料的 AI 金融 agent 與 LLM 流程",
    "- 量化研究與因子開發",
    "- 回測與自動化交易系統",
    "- fintech 產品的內部資料層",
    "",
    "### 設計原則",
    ...DESIGN_PRINCIPLES.map((p) => `- ${p.term} — ${p.desc}`),
  ];
  return lines.join("\n");
}

export async function DocsLandingContent() {
  const t = await getTranslations("docsContent");
  const en = (await getLocale()) !== "zh-TW";

  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <p className="text-[15px] leading-7 text-slate-700">{t("landing.intro1")}</p>
        <p className="text-[15px] leading-7 text-slate-700">{t("landing.intro2")}</p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="what-you-can-access">{t("landing.access.heading")}</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          {t.rich("landing.access.intro", {
            year: twseYear,
            count: twse.stoppedTradingStocks,
            y: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
            c: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
          })}
        </p>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {DATASETS.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className={linkClass}>{en ? d.name_en : d.name}</Link>
              {" — "}
              {en ? d.desc_en : d.desc}
            </li>
          ))}
        </ul>
        <p className="text-sm leading-7 text-slate-500">{t("landing.access.betaNote")}</p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="data-format">{t("landing.dataFormat.heading")}</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {DATA_FORMAT.map((item) => (
            <li key={item.term}>
              <strong className="font-semibold text-slate-900">{en ? item.term_en : item.term}</strong>
              {" — "}
              {en ? item.desc_en : item.desc}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="built-for">{t("landing.builtFor.heading")}</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700 marker:text-slate-400">
          <li>{t("landing.builtFor.b1")}</li>
          <li>{t("landing.builtFor.b2")}</li>
          <li>{t("landing.builtFor.b3")}</li>
          <li>{t("landing.builtFor.b4")}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading id="design-principles">{t("landing.designPrinciples.heading")}</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {DESIGN_PRINCIPLES.map((item) => (
            <li key={item.term}>
              <strong className="font-semibold text-slate-900">{en ? item.term_en : item.term}</strong>
              {" — "}
              {en ? item.desc_en : item.desc}
            </li>
          ))}
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          {t.rich("landing.ready", {
            link: (chunks) => (
              <Link href="/docs/quick-start" className={linkClass}>{chunks}</Link>
            ),
          })}
        </p>
      </section>
    </div>
  );
}
