import Link from "next/link";

import { SectionHeading } from "@/src/components/docs/section-heading";
import { coverageFacts } from "@/src/content/coverage-facts";

// hub-and-spoke: every dataset name links to its real docs page. Numbers come from the DB-verified
// coverage SSOT (coverage-facts.ts). Status stated honestly (TPEx deferred, MCP preview elsewhere).
const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

const twse = coverageFacts.twseDailyPrice;
const twseYear = twse.earliestDate.slice(0, 4);
const revenueYear = coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4);

const DATASETS: { href: string; name: string; desc: string }[] = [
  { href: "/docs/api/market-prices/twse-daily-price", name: "上市日線價格", desc: `TWSE 日頻 OHLCV，自 ${twseYear}，含已停止交易股票。` },
  { href: "/docs/api/financial-growth/monthly-revenue", name: "月營收", desc: `MOPS 月頻營收，含 YoY / MoM，自 ${revenueYear}。` },
  { href: "/docs/api/financial-growth/income-statement", name: "財報三表", desc: "損益表、資產負債表、現金流量表。" },
  { href: "/docs/api/capital-flow/institutional-flow", name: "三大法人", desc: "外資、投信、自營日頻買賣超（對比 13F 45 日延遲）。" },
  { href: "/docs/api/financial-growth/valuation-data", name: "估值指標", desc: "本益比、股價淨值比、殖利率，逐日。" },
  { href: "/docs/api/market-prices/technical-indicators", name: "技術指標", desc: "常用技術指標，逐日。" },
  { href: "/docs/api/capital-flow/margin-short", name: "融資融券", desc: "信用交易餘額。" },
  { href: "/docs/api/company-events/issuer-announcements", name: "重大訊息", desc: "上市櫃公司重大訊息與公告。" },
];

const DATA_FORMAT: { term: string; desc: string }[] = [
  { term: "結構化", desc: "一致欄位命名的 typed JSON，跨端點一致。" },
  { term: "標準化", desc: "科目對應一致 taxonomy，跨公司、跨期間可比。" },
  { term: "原始揭露", desc: "保留官方原始標籤與值，不做臆測性標準化。" },
  { term: "來源 lineage", desc: "每筆帶來源與 knowledge_date，支援 point-in-time。" },
];

const DESIGN_PRINCIPLES: { term: string; desc: string }[] = [
  { term: "官方第一手", desc: "直接收錄 TWSE / TPEx / MOPS / TAIFEX，不經二手。" },
  { term: "誠實覆蓋", desc: "coverage window、來源與限制逐一標示，不假設全覆蓋。" },
  { term: "Point-in-time 安全", desc: "保留 knowledge_date，回測不前視。" },
  { term: "Machine-first", desc: "為程式化消費最佳化，而非人工瀏覽。" },
];

export function DocsLandingContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <p className="text-[15px] leading-7 text-slate-700">
          TW Market Data 以<strong className="font-semibold text-slate-900">官方第一手</strong>台股資料為核心，透過一致、可預測的 REST API 提供。TWSE、TPEx、MOPS、TAIFEX 的原始檔由我們直接收錄、解析、供應——是{" "}
          <Link href="/docs/data-provenance" className={linkClass}>官方來源整理者</Link>，不經二手。
        </p>
        <p className="text-[15px] leading-7 text-slate-700">
          每筆回應都附帶來源 lineage，並如實保留已揭露的 data_gaps，不以推測值補洞。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="what-you-can-access">可存取的資料</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          上市個股日線自 <strong className="font-semibold text-slate-900">{twseYear} 年</strong>，含{" "}
          <strong className="font-semibold text-slate-900">{twse.stoppedTradingStocks} 檔</strong>已停止交易（下市 / 長期停牌）個股的完整價史（反存活者）。核心資料集：
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
          TPEx 上櫃日線與 adjusted price 目前為 beta / deferred，狀態逐集標示。
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
          <li>AI 金融 agent 與 LLM pipeline</li>
          <li>量化研究平台</li>
          <li>回測與自動化交易基礎設施</li>
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
          準備好了？→{" "}
          <Link href="/docs/quick-start" className={linkClass}>快速開始</Link>
        </p>
      </section>
    </div>
  );
}
