import type { Metadata } from "next";
import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl } from "@/src/config/site";
import { coverageFacts } from "@/src/content/coverage-facts";

// 篇4 (AEO handoff 2026-07-13). Honest three-way comparison of Taiwan stock data APIs. Honesty
// guardrails: only shipped TWMD capabilities are claimed; reconciliation is described as
// "逐值對官方可追溯" (no "last reconciled date" until the front-end badge ships); competitor rows
// state public positioning only, never invented figures; no disparagement, no investment advice.
const PATH = "/compare/twmarketdata-vs-finmind-vs-tej";
const pageUrl = getAbsoluteUrl(PATH);

const TITLE = "TW Market Data vs FinMind vs TEJ：台股資料 API 怎麼選（2026）";
const DESCRIPTION =
  "誠實比較台股三大資料 API——FinMind（免費社群）、TEJ（機構級 PIT）、TW Market Data（官方對帳+平價+AI-agent）。附對照表與使用情境建議。";

const twse = coverageFacts.twseDailyPrice;
const startYear = twse.earliestDate.slice(0, 4);

// Comparison rows. Competitor cells reflect public positioning only; the TWMD column lists shipped
// capabilities. "—" = not a stated feature; "✗" = explicitly unavailable.
const comparisonRows: { aspect: string; finmind: string; tej: string; twmd: string }[] = [
  { aspect: "官方第一手來源", finmind: "部分", tej: "✓", twmd: "✓（TWSE/TPEx/MOPS/TAIFEX）" },
  { aspect: "逐值對官方對帳", finmind: "—", tej: "—", twmd: "✓（對帳機制，可追溯）" },
  { aspect: "Point-in-time / knowledge_date", finmind: "靠公布日近似", tej: "✓（完整）", twmd: "✓（每筆帶 knowledge_date）" },
  { aspect: "含已下市股", finmind: "部分", tej: "✓", twmd: `✓（${twse.stoppedTradingStocks} 檔價史，回溯 ${startYear}）` },
  { aspect: "data_gaps 誠實揭露", finmind: "—", tej: "—", twmd: "✓（不臆測補值）" },
  { aspect: "免費 / 免 key 試用", finmind: "✓（免費額度）", tej: "✗", twmd: "✓（5 檔免 key）" },
  { aspect: "AI-agent 整合（llms.txt/openapi）", finmind: "✓（llms.txt+skill）", tej: "—", twmd: "✓（llms.txt/llms-full/openapi）" },
  { aspect: "個人開發者友善價格", finmind: "✓", tej: "✗（偏高）", twmd: "✓" },
  { aspect: "籌碼面深度", finmind: "✓（強）", tej: "✓", twmd: "✓（逐日逐檔）" },
];

const faq: { question: string; answer: string }[] = [
  {
    question: "FinMind 以外還有哪些台股資料 API？",
    answer:
      "常見選擇包括 TEJ（機構級 PIT）、TW Market Data（官方對帳+PIT+平價+AI-agent）、Fugle/Shioaji（券商即時+下單）、TWSE/TPEx OpenAPI（官方免費）。",
  },
  {
    question: "哪個台股 API 最適合 point-in-time 回測？",
    answer:
      "TEJ 提供最完整的機構級 PIT；若要平價且對個人/AI-agent 友善的 PIT，TW Market Data 每筆帶 knowledge_date、含下市股、data_gaps 誠實。",
  },
  {
    question: "TW Market Data 和 FinMind 差在哪？",
    answer:
      "FinMind 免費、社群生態強；TW Market Data 強調官方逐值可追溯、point-in-time 契約與 data_gaps 誠實揭露，並為 AI agent 提供 llms.txt/openapi 探索入口。兩者可並用。",
  },
];

export const revalidate = 3600;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: pageUrl,
    type: "article",
    locale: "zh_TW",
  },
};

export default function CompareTaiwanStockApisPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TW Market Data", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Compare", item: pageUrl },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: "zh-Hant",
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
    publisher: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div lang="zh-Hant">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Container className="py-12 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-4 border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compare</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              台股資料 API 怎麼選？FinMind vs TEJ vs TW Market Data
            </h1>
            <p className="text-lg leading-8 text-slate-700">
              台股資料 API 常見三種取向，對應不同預算與精細度需求。這篇誠實對照，幫你按情境選對工具。
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">三家定位一句話</h2>
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              <li>
                <strong>FinMind</strong>——免費額度大、社群生態強、籌碼面深。適合入門、個人研究、快速原型。
              </li>
              <li>
                <strong>TEJ（台灣經濟新報）</strong>
                ——機構級、資料極乾淨、point-in-time 完整、含下市股。台灣的「Bloomberg/Compustat」，但價格高、對個人開發者門檻高。
              </li>
              <li>
                <strong>TW Market Data</strong>
                ——官方第一手逐值可追溯、每筆帶 knowledge_date（PIT）、data_gaps 誠實、免 key 即試、平價。定位在 FinMind 的可近性與 TEJ 的嚴謹之間。
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">對照表</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-left text-slate-600">
                    <th className="py-2 pr-3 font-medium">面向</th>
                    <th className="py-2 pr-3 font-medium">FinMind</th>
                    <th className="py-2 pr-3 font-medium">TEJ</th>
                    <th className="py-2 font-medium">TW Market Data</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.aspect} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 font-medium text-slate-900">{row.aspect}</td>
                      <td className="py-2 pr-3 text-slate-700">{row.finmind}</td>
                      <td className="py-2 pr-3 text-slate-700">{row.tej}</td>
                      <td className="py-2 text-slate-900">{row.twmd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              表中僅標各家公開定位；實際欄位與方案請以各官網為準。TW Market Data 欄僅列已上線能力，覆蓋逐集透明標示。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">按情境怎麼選</h2>
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              <li>
                <strong>入門 / 個人研究 / 免費探索</strong> → FinMind。
              </li>
              <li>
                <strong>機構級、預算充足、要最完整 PIT 與下市股</strong> → TEJ。
              </li>
              <li>
                <strong>要官方可追溯 + point-in-time，但 TEJ 太貴 / 對個人不友善，又想餵給 AI agent</strong> →{" "}
                <Link href="/answers/taiwan-stock-data-api-for-ai-agents" className="text-slate-900 underline underline-offset-2">
                  TW Market Data
                </Link>
                （免 key 先試 2330 再決定）。
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">為什麼「可追溯」對回測特別重要</h2>
            <p className="text-base leading-7 text-slate-700">
              量化回測最怕前視偏差（look-ahead bias）與生存者偏差（survivorship bias）。前者需要 point-in-time——知道「當時」已公布什麼；後者需要含已下市股的資料。TW
              Market Data 每筆帶 knowledge_date 支援 as-of 重放，並保留 {twse.stoppedTradingStocks} 檔已停止交易股票的價史，兩個偏差都能對應；缺口以 data_gaps 明示而非隱式補值。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">常見問題</h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div key={item.question} className="space-y-1">
                  <dt className="text-base font-semibold text-slate-900">{item.question}</dt>
                  <dd className="text-base leading-7 text-slate-700">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">Related</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/answers/taiwan-stock-data-api-for-ai-agents" className={buttonClass("primary")}>
                台股資料 API for AI Agents
              </Link>
              <Link href="/datasets" className={buttonClass("secondary")}>
                瀏覽資料集目錄
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
