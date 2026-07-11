// AEO-01 §2.3 — Answer-shaped pages. Each page's title IS a question an AI/user actually asks; the
// first 3 sentences answer it, then the body expands. Every page carries FAQPage schema and a CTA
// to the matching dataset page.
//
// Content discipline (SEO-01 §3 / AEO-01 / C-6):
//   - English body copy is produced by Cowork per docs/seo/en-terminology-glossary.md — NOT machine
//     translated. English entries ship as SHELLS with `status: "draft"` and content slots; they are
//     noindex until content is filled and status flips to "published".
//   - Only real, verifiable content. No fabricated numbers, no hidden instructions to models.
//   - FAQPage schema is emitted only from populated `faq` entries (real Q&A), so a draft never
//     ships thin/placeholder FAQ markup.

export type AnswerPageLocale = "en" | "zh-Hant";
export type AnswerPageStatus = "draft" | "published";

export type AnswerFaqItem = {
  question: string;
  answer: string;
};

export type AnswerPageSection = {
  heading: string;
  /** Content slot note for Cowork; rendered as a draft marker off-production. */
  slot: string;
};

export type AnswerPageEntry = {
  slug: string;
  locale: AnswerPageLocale;
  /** Page title == the question (answer-shaped). */
  question: string;
  description: string;
  /** The 3-sentence lead answer. Real text when published; empty (slot) while draft. */
  shortAnswer: string;
  sections: AnswerPageSection[];
  faq: AnswerFaqItem[];
  cta: { label: string; datasetSlug: string };
  status: AnswerPageStatus;
};

export const answerPages: readonly AnswerPageEntry[] = [
  {
    slug: "best-taiwan-stock-market-data-api",
    locale: "en",
    question: "Best Taiwan stock market data API",
    description:
      "An honest comparison of Taiwan stock market data APIs, including free alternatives and TW Market Data's own limitations.",
    shortAnswer: "",
    sections: [
      { heading: "The honest short answer", slot: "3-sentence answer naming the real options (incl. free alternatives like TWSE/TPEx open data & FinMind) and where TW Market Data fits: TWSE-first, lineage + disclosed data_gaps. Balanced, not salesy — AI prefers balanced comparison pages." },
      { heading: "Free and official options first", slot: "Describe TWSE/TPEx/MOPS open data and community sources honestly, with their real trade-offs (no lineage, manual reconciliation, gaps)." },
      { heading: "When a paid API is worth it", slot: "Reproducibility, source lineage, preserved data_gaps, unified schema. State TW Market Data's own limits (TWSE-first, TPEx historical depth deferred)." },
    ],
    faq: [],
    cta: { label: "Browse the dataset catalog", datasetSlug: "twse-daily-price" },
    status: "draft",
  },
  {
    slug: "how-to-get-twse-data-python",
    locale: "en",
    question: "How to get TWSE data programmatically (Python / API)",
    description:
      "How to fetch TWSE (Taiwan Stock Exchange) daily price and fundamentals data from Python via a REST API.",
    shortAnswer: "",
    sections: [
      { heading: "The 3-sentence answer", slot: "Answer: authenticate with an API key, call the dataset endpoint, parse JSON rows. Mention 5-symbols-free-no-key once BENCH-01 is live." },
      { heading: "Python quick start", slot: "3-line requests example hitting a real public endpoint (e.g. twse-daily-price). Keep it runnable; link /en/docs/quick-start." },
      { heading: "Handling coverage and data gaps", slot: "Explain reading freshness / data_gaps signals rather than assuming completeness." },
    ],
    faq: [],
    cta: { label: "TWSE daily price dataset", datasetSlug: "twse-daily-price" },
    status: "draft",
  },
  {
    slug: "taiwan-monthly-revenue-data",
    locale: "en",
    question: "Taiwan monthly revenue data — the monthly fundamental US markets don't have",
    description:
      "Taiwan-listed companies publish monthly revenue via MOPS — an early fundamental signal most markets lack. How to access it via API.",
    shortAnswer: "",
    sections: [
      { heading: "Why Taiwan monthly revenue is special", slot: "3-sentence answer: MOPS-mandated monthly revenue disclosure gives a pre-quarterly growth signal (YoY/MoM) that US markets don't provide." },
      { heading: "What the dataset contains", slot: "Fields (symbol, period, revenue, yoy/mom growth). Honest coverage window; no fabricated counts." },
      { heading: "Using it in research", slot: "Growth tracking, sector comparison, event studies. Link monthly-revenue dataset + docs." },
    ],
    faq: [],
    cta: { label: "Monthly revenue dataset", datasetSlug: "monthly-revenue" },
    status: "draft",
  },
  {
    slug: "survivorship-bias-free-taiwan-equity-data",
    locale: "en",
    question: "Survivorship-bias-free Taiwan equity data",
    description:
      "Why delisted-stock price history matters for backtests, and how to get survivorship-bias-free Taiwan equity data.",
    shortAnswer: "",
    sections: [
      { heading: "What survivorship bias is and why it distorts backtests", slot: "3-sentence answer defining survivorship bias and its effect on Taiwan equity backtests." },
      { heading: "How TW Market Data handles delisted names", slot: "Describe delisted-stock coverage HONESTLY — only claim what the delisting-lifecycle dataset actually covers; disclose gaps. Do NOT invent a specific delisted count." },
      { heading: "Building a cleaner backtest universe", slot: "Practical guidance; link twse-daily-price + delisting dataset." },
    ],
    faq: [],
    cta: { label: "TWSE daily price dataset", datasetSlug: "twse-daily-price" },
    status: "draft",
  },
  {
    slug: "taiwan-institutional-investor-flow-data",
    locale: "en",
    question: "Taiwan institutional investor (three major investors) daily flow data explained",
    description:
      "What Taiwan's three major institutional investors (foreign, investment trust, dealer) net-buy/sell data is, and how to access it.",
    shortAnswer: "",
    sections: [
      { heading: "The 3-sentence answer", slot: "Define the three major institutional investors (foreign investors, investment trust, dealer) and what daily net buy/sell tells you." },
      { heading: "Fields and interpretation", slot: "foreign_net_buy / investment_trust_net_buy / dealer_net_buy / total. Honest coverage." },
      { heading: "Combining with margin/short data", slot: "Cross-reference chip datasets; link institutional-flow." },
    ],
    faq: [],
    cta: { label: "Institutional flow dataset", datasetSlug: "institutional-flow" },
    status: "draft",
  },
  {
    // Chinese counterpart (AEO-01 §2.3 item 6). Seeded with real, honest zh copy; still draft/noindex
    // until boss review. FAQPage schema is populated from real Q&A here to demonstrate the wiring.
    slug: "taiwan-stock-api-python-guide",
    locale: "zh-Hant",
    question: "台股資料 API 怎麼選、如何用 Python 抓台股歷史資料",
    description:
      "選台股資料 API 的重點與用 Python 抓台股歷史資料的作法：認證、呼叫 dataset 端點、解析 JSON，並讀 freshness / data_gaps 訊號。",
    shortAnswer:
      "選台股資料 API 先看三件事：資料來源是否第一手（TWSE / MOPS）、是否附來源 lineage、是否誠實揭露 coverage 與 data_gaps。" +
      "用 Python 抓歷史資料的基本流程是：帶 API key 呼叫對應 dataset 端點、拿到 JSON rows、再依 freshness 與 data_gaps 訊號判讀完整度。" +
      "TW Market Data 為 TWSE-first verified baseline，公開揭露限制（例如 TPEx 歷史深度尚未開放），不宣稱 full-market。",
    sections: [
      { heading: "選 API 的判斷準則", slot: "展開：第一手來源、lineage、coverage 誠實揭露、schema 一致、可重跑。對照免費/官方替代方案的取捨。" },
      { heading: "用 Python 抓歷史資料（quick start）", slot: "3 行 requests 範例打真實公開端點（twse-daily-price），連結 /docs/quick-start。" },
      { heading: "如何正確判讀 coverage 與 data_gaps", slot: "說明讀 freshness / data_gaps，不假設完整；保留缺口不推測。" },
    ],
    faq: [
      {
        question: "台股資料 API 怎麼選？",
        answer:
          "重點看資料是否第一手（TWSE / MOPS）、每筆回應是否附來源 lineage、以及是否誠實揭露 coverage 與 data_gaps。避免會用推測值補洞、或宣稱 full-market 卻無法佐證的來源。",
      },
      {
        question: "可以用 Python 抓台股歷史資料嗎？",
        answer:
          "可以。帶 API key 呼叫對應 dataset 端點（例如日線價格），取得 JSON rows 後即可寫入 DataFrame；使用前先讀回應中的 freshness 與 data_gaps 訊號以判讀完整度。",
      },
      {
        question: "TW Market Data 有涵蓋 TPEx（上櫃）歷史嗎？",
        answer:
          "目前公開定位為 TWSE-first verified baseline，TPEx 歷史深度尚未開放，且不宣稱 full-market。實際可用範圍以各 dataset 文件與回應中的 data_gaps 為準。",
      },
    ],
    cta: { label: "台股日線價格資料集", datasetSlug: "twse-daily-price" },
    status: "draft",
  },
];

export function getAnswerPageBySlug(slug: string): AnswerPageEntry | undefined {
  return answerPages.find((page) => page.slug === slug);
}

/** Only pages with real content should be indexed / listed in the sitemap. */
export function getPublishedAnswerPages(): AnswerPageEntry[] {
  return answerPages.filter((page) => page.status === "published");
}
