import Link from "next/link";

import { SectionHeading } from "@/src/components/docs/section-heading";
import { coverageFacts } from "@/src/content/coverage-facts";

// hub-and-spoke: every dataset name links to its real docs page (verified slugs, do not change).
// Numbers come from the DB-verified coverage SSOT (coverage-facts.ts). Status stated honestly
// (TPEx deferred/beta). Delisted count uses the honest "已停止交易（下市/長期停牌）" wording per
// MARKETING_SAFE_COVERAGE_FACTS (311 stopped trading; 262 with an official delisting date).
const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

const twse = coverageFacts.twseDailyPrice;
const twseYear = twse.earliestDate.slice(0, 4);
const revenueYear = coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4);

const DATASETS: { href: string; name: string; desc: string }[] = [
  { href: "/docs/api/market-prices/twse-daily-price", name: "上市日線價格", desc: `TWSE 個股日 OHLCV，含已停止交易股票，自 ${twseYear} 年。` },
  { href: "/docs/api/financial-growth/monthly-revenue", name: "月營收", desc: `每月營收與 YoY／MoM，自 ${revenueYear} 年；台股獨有的月頻基本面。` },
  { href: "/docs/api/financial-growth/income-statement", name: "財報三表", desc: "損益表、資產負債表、現金流量表。" },
  { href: "/docs/api/capital-flow/institutional-flow", name: "三大法人", desc: "外資、投信、自營每日買賣超，逐檔。美股 13F 要等 45 天，這裡是每天。" },
  { href: "/docs/api/financial-growth/valuation-data", name: "估值指標", desc: "本益比、股價淨值比、殖利率，逐日。" },
  { href: "/docs/api/market-prices/technical-indicators", name: "技術指標", desc: "常見技術指標，逐日。" },
  { href: "/docs/api/capital-flow/margin-short", name: "融資融券", desc: "每日信用交易餘額。" },
  { href: "/docs/api/company-events/issuer-announcements", name: "重大訊息", desc: "上市櫃公司重大訊息與公告。" },
];

const DATA_FORMAT: { term: string; desc: string }[] = [
  { term: "結構化 JSON", desc: "欄位命名一致，每個端點接起來都一樣。" },
  { term: "標準化", desc: "會計科目對到同一套分類，不同公司、不同期間可以直接比較。" },
  { term: "保留原貌", desc: "也提供公司原始申報的數字與標籤，不做任何臆測性調整。" },
  { term: "可追溯", desc: "每筆都帶來源與 knowledge_date，支援 point-in-time 回放。" },
];

const DESIGN_PRINCIPLES: { term: string; desc: string }[] = [
  { term: "只用官方第一手", desc: "直接接 TWSE／TPEx／MOPS／TAIFEX，中間不經二手。" },
  { term: "覆蓋範圍透明", desc: "每個資料集清楚標示涵蓋期間、來源與限制，不假裝全都有。" },
  { term: "不偷看未來", desc: "保留 knowledge_date，回測只看得到當下已知的資料。" },
  { term: "給機器讀的", desc: "為程式呼叫最佳化，不是給人瀏覽的網頁。" },
];

export function DocsLandingContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <p className="text-[15px] leading-7 text-slate-700">
          TW Market Data 把 TWSE、TPEx、MOPS、TAIFEX 的官方資料，整理成一致、好串接的 REST API。所有資料都由我們直接從官方來源收錄、解析後供應，不經二手。
        </p>
        <p className="text-[15px] leading-7 text-slate-700">
          每一筆回應都附上來源與 knowledge_date；資料有缺就如實標記，絕不用推估值把洞補起來。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="what-you-can-access">可存取的資料</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          上市個股日線最早回溯到 <strong className="font-semibold text-slate-900">{twseYear} 年</strong>，並保留{" "}
          <strong className="font-semibold text-slate-900">{twse.stoppedTradingStocks} 檔</strong>已停止交易（下市／長期停牌）股票的完整價史，讓回測不被存活者偏差灌水。目前提供：
        </p>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {DATASETS.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className={linkClass}>{d.name}</Link>
              {" — "}
              {d.desc}
            </li>
          ))}
        </ul>
        <p className="text-sm leading-7 text-slate-500">
          上櫃（TPEx）日線與還原股價目前為 beta，覆蓋範圍逐集標示。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="data-format">資料格式</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {DATA_FORMAT.map((item) => (
            <li key={item.term}>
              <strong className="font-semibold text-slate-900">{item.term}</strong>
              {" — "}
              {item.desc}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="built-for">為誰而建</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700 marker:text-slate-400">
          <li>需要餵資料的 AI 金融 agent 與 LLM 流程</li>
          <li>量化研究與因子開發</li>
          <li>回測與自動化交易系統</li>
          <li>fintech 產品的內部資料層</li>
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading id="design-principles">設計原則</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {DESIGN_PRINCIPLES.map((item) => (
            <li key={item.term}>
              <strong className="font-semibold text-slate-900">{item.term}</strong>
              {" — "}
              {item.desc}
            </li>
          ))}
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          準備好了嗎？→{" "}
          <Link href="/docs/quick-start" className={linkClass}>快速開始</Link>
        </p>
      </section>
    </div>
  );
}
