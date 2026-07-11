// AEO-01 §2.3 — Answer-shaped pages. Each page's title IS a question an AI/user actually asks; the
// first 2–3 sentences answer it, then the body expands. Every page carries FAQPage schema and a CTA.
//
// Content discipline (SEO-01 §3 / AEO-01 / C-6):
//   - Every coverage NUMBER comes from src/content/coverage-facts.ts (D's DB-verified marketing-safe
//     facts). Anything not listed there is not written. "Weekly official reconciliation" and a
//     production hosted MCP endpoint are explicitly NOT claimable yet (roadmap / preview only).
//   - English copy follows docs/seo/en-terminology-glossary.md.
//   - FAQPage schema is emitted only from populated `faq` entries (real Q&A) — never placeholder.

import { coverageFacts } from "@/src/content/coverage-facts";

const twse = coverageFacts.twseDailyPrice;
const twseStocks = twse.stocks.toLocaleString("en-US");
//
// Verified SSOT facts used below:
//   - REST: `GET https://api.twmarketdata.com/v2/datasets/<slug>?symbol=2330&limit=10`, header
//     `X-API-Key` (src/content/docs-pages.ts).
//   - Dataset slugs: twse-daily-price, monthly-revenue, institutional-flow, ... (src/content/datasets.ts).
//   - Free plan: basic datasets excl. financial statements, 1 key, quota-limited (src/lib/billing/plans.ts).
//   - MCP: "production hosted MCP endpoint not yet provided" — MCP Server *Preview* only (docs-pages.ts).
//   - Positioning: TWSE-first verified baseline; TPEx historical depth deferred; no full-market claim.

export type AnswerPageLocale = "en" | "zh-Hant";
export type AnswerPageStatus = "draft" | "published";

export type AnswerFaqItem = {
  question: string;
  answer: string;
};

export type AnswerPageSection = {
  heading: string;
  /** A prose paragraph. */
  body?: string;
  /** A bullet list. */
  bullets?: string[];
  /** A fenced code block (rendered monospace, pre-wrapped). */
  code?: string;
  /** Content slot note for Cowork (rendered as an amber marker off-production, omitted in prod). */
  slot?: string;
};

export type AnswerPageEntry = {
  slug: string;
  locale: AnswerPageLocale;
  /** Page title == the question (answer-shaped). */
  question: string;
  description: string;
  /** The 2–3 sentence lead answer. Real text when published; empty (slot) while draft. */
  shortAnswer: string;
  sections: AnswerPageSection[];
  faq: AnswerFaqItem[];
  cta: { label: string; href: string };
  status: AnswerPageStatus;
};

export const answerPages: readonly AnswerPageEntry[] = [
  {
    slug: "best-taiwan-stock-market-data-api",
    locale: "en",
    question: "Best Taiwan stock market data API",
    description:
      "An honest comparison of Taiwan stock market data APIs, including free official portals and TW Market Data's own limitations.",
    shortAnswer:
      "The best Taiwan stock market data API depends on what you need. If you want free raw data and can handle parsing and gaps yourself, the official TWSE and TPEx open-data portals are the first-party source. If you want that official data cleaned, joined into a unified schema, delivered over a REST API or an MCP server, with coverage and data gaps disclosed rather than hidden, TW Market Data is built for that.",
    sections: [
      {
        heading: "Free and official options first",
        bullets: [
          "Official portals (TWSE / TPEx / MOPS OpenAPI) — free and authoritative, but fragmented across endpoints, rate-limited, and without a unified schema. Best for a one-off pull when you don't mind the plumbing.",
          "Community datasets — useful for research, with variable coverage and freshness, and usually no SLA.",
        ],
      },
      {
        heading: "Where TW Market Data fits",
        bullets: [
          "First-party TWSE / TPEx / MOPS / TAIFEX data in a unified schema, over REST (X-API-Key header) and an MCP server (preview), with a free tier to start.",
          "Every response carries source lineage and preserves disclosed data gaps instead of inferring missing values.",
        ],
      },
      {
        heading: "Our honest limits",
        body:
          "TW Market Data is a TWSE-first verified baseline: TPEx historical depth is still being expanded and we make no full-market claim. We focus on end-of-day and fundamental data — real-time quotes, intraday bars and crypto are out of scope. If your strategy needs tick or minute data or live quotes, we are not the right tool today.",
      },
    ],
    faq: [
      {
        question: "Is the data official / first-hand?",
        answer:
          "Yes — it is sourced first-party from TWSE, TPEx, MOPS and TAIFEX, and every response carries source lineage. Disclosed data gaps are preserved rather than filled with inferred values.",
      },
      {
        question: "Is there a free tier?",
        answer:
          "Yes. The free plan includes the basic datasets (excluding financial statements) with a monthly request quota, so you can test end-to-end before upgrading. Financial statements and deeper history are unlocked on paid plans.",
      },
      {
        question: "Do you offer real-time or intraday data?",
        answer:
          "No. TW Market Data focuses on end-of-day and fundamental Taiwan data; real-time quotes, intraday bars and crypto are out of scope.",
      },
    ],
    cta: { label: "Browse the dataset catalog", href: "/datasets" },
    status: "published",
  },
  {
    slug: "how-to-get-twse-data-python",
    locale: "en",
    question: "How to get TWSE data programmatically (Python / API)",
    description:
      "How to fetch TWSE (Taiwan Stock Exchange) daily price data from Python via a REST API, with a runnable example.",
    shortAnswer:
      "You can get TWSE data programmatically in three ways: call the official TWSE OpenAPI and parse the JSON yourself, use a data provider's REST API, or let an AI agent fetch it over an MCP server. With TW Market Data you sign up for a free API key and make a single HTTP request with an X-API-Key header, and the response is clean JSON.",
    sections: [
      {
        heading: "Python quick start",
        body: "Request the TWSE daily price dataset and read the JSON rows:",
        code:
          'import requests\n\nheaders = {"X-API-Key": "your_api_key_here"}\nurl = "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=10"\nprint(requests.get(url, headers=headers).json())',
      },
      {
        heading: "Read coverage and data gaps before you rely on a series",
        body:
          "Check the freshness and data_gaps signals in the response and on the dataset page rather than assuming full history. TW Market Data is TWSE-first; TPEx historical depth is disclosed per dataset.",
      },
      {
        heading: "Free tier for testing",
        body:
          "The free plan includes the basic datasets with a monthly request quota so you can validate your integration end-to-end before upgrading. A Python SDK (pip install) is planned but not yet published.",
      },
    ],
    faq: [
      {
        question: "How do I authenticate?",
        answer:
          "Send your key in the X-API-Key request header. Get a free key by signing up at twmarketdata.com.",
      },
      {
        question: "What does a request look like?",
        answer:
          "GET https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=10 with an X-API-Key header returns JSON daily price rows.",
      },
    ],
    cta: { label: "Read the quick start", href: "/docs/quick-start" },
    status: "published",
  },
  {
    slug: "taiwan-monthly-revenue-data",
    locale: "en",
    question: "Taiwan monthly revenue data — the monthly fundamental the US doesn't have",
    description:
      "Taiwan-listed companies publish monthly revenue via MOPS — an early monthly-frequency fundamental most markets lack. How to access it via API.",
    shortAnswer:
      "Taiwan-listed companies are required to report monthly revenue, generally by the 10th of the following month — a monthly-frequency fundamental signal that most markets, including the US, do not publish. TW Market Data provides this monthly revenue series back to January 2010, with the statutory filing timeline captured, so you can build point-in-time features without look-ahead bias.",
    sections: [
      {
        heading: "Why it matters",
        body:
          "Monthly revenue is an early, high-frequency read on a company's momentum, arriving weeks before quarterly financials. For factor research and nowcasting it is a genuinely differentiated Taiwan dataset.",
      },
      {
        heading: "Point-in-time handling",
        body:
          "Where an exact announcement timestamp is unavailable, the statutory filing deadline is used as the knowledge date and labeled as such, so backtests stay point-in-time-safe.",
      },
    ],
    faq: [
      {
        question: "Why is Taiwan monthly revenue special?",
        answer:
          "Taiwan mandates monthly revenue disclosure (generally by the 10th of the following month), giving a monthly-frequency growth signal that markets like the US — which report fundamentals quarterly — do not provide.",
      },
      {
        question: "Is it point-in-time safe?",
        answer:
          "Where an exact announcement timestamp is unavailable, the statutory filing deadline is used as the knowledge date and labeled, so backtests avoid look-ahead bias.",
      },
    ],
    cta: { label: "See the monthly revenue dataset", href: "/datasets/monthly-revenue" },
    status: "published",
  },
  {
    // Coverage figures are DB-verified (coverage-facts.ts): 311 stopped-trading TWSE stocks with
    // full price history (262 with an official delisting date), history since 2004-02-11.
    slug: "survivorship-bias-free-taiwan-equity-data",
    locale: "en",
    question: "Survivorship-bias-free Taiwan equity data",
    description:
      "Why delisted-stock price history matters for backtests, and how to build a survivorship-bias-free Taiwan equity universe.",
    shortAnswer:
      "Most Taiwan price datasets silently drop companies once they stop trading, which inflates backtest returns through survivorship bias. " +
      `TW Market Data keeps the full daily price history of the TWSE universe — ${twseStocks} stocks and ${twse.rowsDisplay} daily rows since ${twse.earliestDate} — including ${twse.stoppedTradingStocks} stocks that have since stopped trading (delisted or long-suspended), ${twse.delistedWithOfficialDate} of them with an official delisting date. ` +
      "So your universe as-of any past date reflects what was actually tradable then, not just today's survivors.",
    sections: [
      {
        heading: "What survivorship bias is and why it distorts backtests",
        body:
          "Survivorship bias occurs when a dataset silently drops companies that stopped trading, so a backtest only sees today's survivors. That inflates returns and understates risk, because the failures that would have hurt the strategy are missing from the historical universe.",
      },
      {
        heading: "What you need for a point-in-time universe",
        body:
          "Reconstructing the universe as-of a past date requires the price history of stocks that later stopped trading, plus a last-trading-date / delisting reference, so the universe reflects what was actually tradable then rather than what still trades today.",
      },
      {
        heading: "How TW Market Data handles stopped-trading names",
        body:
          `The TWSE daily price series retains ${twse.stoppedTradingStocks} stocks that have stopped trading (delisted or long-suspended for more than 90 days), ${twse.delistedWithOfficialDate} of them carrying an official delisting date. Coverage runs from ${twse.earliestDate}, and TPEx daily prices go back to ${coverageFacts.tpexDailyPrice.earliestDate}, so you can reconstruct a point-in-time universe rather than only today's survivors.`,
      },
    ],
    faq: [
      {
        question: "Do you include delisted / stopped-trading stocks?",
        answer:
          `Yes. The TWSE daily price history retains ${twse.stoppedTradingStocks} stocks that have stopped trading (delisted or long-suspended), ${twse.delistedWithOfficialDate} of them with an official delisting date, so backtests can be survivorship-bias-free.`,
      },
      {
        question: "How far back does the Taiwan price history go?",
        answer:
          `TWSE daily prices go back to ${twse.earliestDate} (${twse.rowsDisplay} rows across ${twseStocks} stocks); TPEx daily prices go back to ${coverageFacts.tpexDailyPrice.earliestDate}.`,
      },
    ],
    cta: { label: "TWSE daily price dataset", href: "/datasets/twse-daily-price" },
    status: "published",
  },
  {
    slug: "taiwan-institutional-investor-flow-data",
    locale: "en",
    question: "Taiwan institutional investor (three major investors) daily flow data explained",
    description:
      "What Taiwan's three major institutional investors (foreign, investment trust, dealer) daily net buy/sell data is, and how to access it.",
    shortAnswer:
      "Taiwan publishes the daily net buy/sell of its three major institutional investors — foreign investors, investment trusts, and dealers (三大法人) — for each stock on every trading day. TW Market Data delivers this as a clean daily series, in contrast to US 13F filings, which are quarterly and arrive with a 45-day delay.",
    sections: [
      {
        heading: "Fields and interpretation",
        bullets: [
          "foreign_net_buy, investment_trust_net_buy, dealer_net_buy and the total net buy/sell, per stock per trading day.",
          "Because it is daily and per-stock rather than quarterly and delayed, it supports far more responsive research than 13F-style data.",
        ],
      },
      {
        heading: "Coverage",
        body:
          "TWSE-listed detail is the verified baseline; TPEx per-stock coverage is disclosed on the dataset page. Every response carries source lineage and preserves disclosed data gaps.",
      },
    ],
    faq: [
      {
        question: "Who are Taiwan's three major institutional investors?",
        answer:
          "Foreign investors, investment trusts, and dealers — collectively the 三大法人. TW Market Data provides their daily net buy/sell per stock.",
      },
      {
        question: "How is this different from US 13F data?",
        answer:
          "13F filings are quarterly and lag by about 45 days. Taiwan's institutional flow is published daily and per-stock, enabling far more responsive analysis.",
      },
    ],
    cta: { label: "See the institutional flow dataset", href: "/datasets/institutional-flow" },
    status: "published",
  },
  {
    // Chinese counterpart (AEO-01 §2.3 item 6). Real, SSOT-safe zh copy; published.
    slug: "taiwan-stock-api-python-guide",
    locale: "zh-Hant",
    question: "台股資料 API 怎麼選、如何用 Python 抓台股歷史資料",
    description:
      "選台股資料 API 的重點與用 Python 抓台股歷史資料的作法：認證、呼叫 /v2/datasets 端點、解析 JSON，並讀 freshness / data_gaps 訊號。",
    shortAnswer:
      "選台股資料 API 先看三件事：資料是否第一手（TWSE / TPEx / MOPS / TAIFEX）、每筆回應是否附來源 lineage、以及是否誠實揭露 coverage 與 data_gaps。" +
      "用 Python 抓歷史資料的基本流程是：在 header 帶 X-API-Key 呼叫對應 dataset 端點、拿到 JSON rows、再依 freshness 與 data_gaps 訊號判讀完整度。" +
      "TW Market Data 為 TWSE-first verified baseline，公開揭露限制（例如 TPEx 歷史深度尚未完整開放），不宣稱 full-market。",
    sections: [
      {
        heading: "用 Python 抓台股日線（quick start）",
        body: "帶 X-API-Key 呼叫日線價格 dataset，讀取 JSON rows：",
        code:
          'import requests\n\nheaders = {"X-API-Key": "your_api_key_here"}\nurl = "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=10"\nprint(requests.get(url, headers=headers).json())',
      },
      {
        heading: "如何正確判讀 coverage 與 data_gaps",
        body:
          "使用前先讀回應與 dataset 頁上的 freshness、data_gaps 訊號，不要假設歷史完整；缺口會被標示、不以推測值補洞。",
      },
      {
        heading: "免費層可以先測到什麼程度",
        body:
          "免費方案包含基礎資料集（不含財報三表）並有每月請求額度，可先把整條串接跑通再升級。Python SDK（pip install）為規劃中、尚未發布。",
      },
    ],
    faq: [
      {
        question: "台股資料 API 怎麼選？",
        answer:
          "看資料是否第一手（TWSE / TPEx / MOPS / TAIFEX）、每筆回應是否附來源 lineage、以及是否誠實揭露 coverage 與 data_gaps。避免會用推測值補洞、或宣稱 full-market 卻無法佐證的來源。",
      },
      {
        question: "可以用 Python 抓台股歷史資料嗎？",
        answer:
          "可以。在 header 帶 X-API-Key 呼叫對應 dataset 端點（例如 /v2/datasets/twse-daily-price?symbol=2330&limit=10），取得 JSON rows 後即可寫入 DataFrame；使用前先讀 freshness 與 data_gaps 訊號。",
      },
      {
        question: "有涵蓋 TPEx（上櫃）歷史嗎？",
        answer:
          "目前公開定位為 TWSE-first verified baseline，TPEx 歷史深度尚未完整開放，且不宣稱 full-market。實際可用範圍以各 dataset 文件與回應中的 data_gaps 為準。",
      },
    ],
    cta: { label: "台股日線價格資料集", href: "/datasets/twse-daily-price" },
    status: "published",
  },
];

export function getAnswerPageBySlug(slug: string): AnswerPageEntry | undefined {
  return answerPages.find((page) => page.slug === slug);
}

/** Only pages with real content should be indexed / listed in the sitemap. */
export function getPublishedAnswerPages(): AnswerPageEntry[] {
  return answerPages.filter((page) => page.status === "published");
}
