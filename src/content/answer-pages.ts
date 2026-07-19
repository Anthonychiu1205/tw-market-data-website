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
import type { AppLocale } from "@/src/i18n/locales";

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
  /** Page title == the question (answer-shaped). Used as the <h1>. */
  question: string;
  /** Optional <title>/OG title when it should differ from the visible H1 (e.g. keyword-rich meta). */
  metaTitle?: string;
  description: string;
  /** The 2–3 sentence lead answer. Real text when published; empty (slot) while draft. */
  shortAnswer: string;
  sections: AnswerPageSection[];
  faq: AnswerFaqItem[];
  cta: { label: string; href: string };
  /** Extra internal links rendered in the "Related" block (in addition to the primary CTA). */
  relatedLinks?: { label: string; href: string }[];
  /** When true, the page also emits SoftwareApplication + Dataset JSON-LD (AI-agent API pages). */
  aiAgentApiSchema?: boolean;
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
      "Taiwan publishes the daily net buy/sell of its three major institutional investors — foreign investors, investment trusts, and dealers — for each stock on every trading day. TW Market Data delivers this as a clean daily series, in contrast to US 13F filings, which are quarterly and arrive with a 45-day delay.",
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
          "Foreign investors, investment trusts, and dealers — collectively the three major institutional investors. TW Market Data provides their daily net buy/sell per stock.",
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
  {
    // 篇3 (AEO handoff 2026-07-13). AI-agent-oriented positioning ("台版 financialdatasets.ai").
    // Every claim is an already-shipped TWMD capability; coverage figures are SSOT (coverage-facts).
    slug: "taiwan-stock-data-api-for-ai-agents",
    locale: "zh-Hant",
    question: "為 AI Agent 打造的台股資料 API",
    metaTitle: "台股資料 API for AI Agents｜為 LLM 與量化流程打造（台版 financialdatasets.ai）",
    description:
      "為 AI agent 與量化研究打造的台股資料 API——結構化 JSON、每筆帶 knowledge_date 與來源、缺漏不臆測，附 openapi.json 與 llms.txt 供 agent 探索，免 key 即試。",
    shortAnswer:
      "如果你在幫 AI agent、LLM workflow 或量化系統找台股資料源——要的是「機器好讀、可追溯、接得穩」而不是給人瀏覽的網頁——TW Market Data 就是為此而建。可以把它理解為台股版的 financialdatasets.ai：官方第一手、結構一致、point-in-time 可追溯。",
    sections: [
      {
        heading: "為什麼適合 AI agent",
        bullets: [
          "結構化 JSON，欄位命名一致：每個端點 GET /v2/datasets/{dataset} 回傳同一套 typed JSON，agent 接一個就會接全部。",
          "每筆帶來源與 knowledge_date：回應含 source_role（canonical/fallback/helper）、lineage、freshness，支援 point-in-time 重放——回測不偷看未來。",
          "缺漏如實標，不臆測補值：data_gaps 是保留的訊號，不會把缺口偷偷補成 0，agent 可據此做可靠判斷。",
          "agent 探索入口齊全：/openapi.json（OpenAPI 3.x）、/llms.txt（精簡索引）、/llms-full.txt（完整文件），讓 agent 自己發現可用端點與規則。",
          "只給事實、不給建議：not_investment_advice=true 是硬規則；被問「會不會漲」不會亂猜，適合放進受規範的自動化流程。",
        ],
      },
      {
        heading: "30 秒試一筆（免 API key）",
        body:
          "這 5 檔免金鑰可直接打：2330 台積電 / 2317 鴻海 / 2454 聯發科 / 0050 / 2603。其他股票或資料集，到 /dashboard 自建 API key，放進 X-API-Key 標頭即可。",
        code:
          'curl "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=1"',
      },
      {
        heading: "涵蓋什麼",
        body:
          `上市個股日線（回溯 ${twse.earliestDate.slice(0, 4)}、含 ${twse.stoppedTradingStocks} 檔已停止交易股票的完整價史）、月營收（自 ${coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4)}，台股獨有月頻）、財報三表、三大法人逐日逐檔、估值（PE/PB/殖利率）、技術指標、融資融券／借券、重大訊息、公司主檔與產業分類。TWSE 為 verified baseline；TPEx 與部分主題逐集標示 beta，覆蓋範圍透明。`,
      },
      {
        heading: "和 FinMind / open-data 的差異",
        body:
          "FinMind 等 open-data 方案免費、社群生態強，適合入門與探索。TW Market Data 的定位不同：強調官方逐值可追溯、point-in-time 契約、與 data_gaps 誠實揭露——為需要「可驗證、可審計」資料的 quant 流程與 AI agent 而生。兩者可並用。",
      },
    ],
    faq: [
      {
        question: "有沒有台股版的 financialdatasets.ai？",
        answer:
          "TW Market Data 直接對標這個定位——為 AI agent 與量化流程設計的結構化台股資料 API，官方第一手、每筆帶 knowledge_date，附 openapi.json 與 llms.txt 供 agent 探索。",
      },
      {
        question: "AI agent 怎麼串 TW Market Data？",
        answer:
          "讀 /llms.txt 或 /openapi.json 探索端點，呼叫 GET /v2/datasets/{dataset}，用 X-API-Key 帶金鑰；免 key 可先試 2330/2317/2454/0050/2603。",
      },
      {
        question: "資料可以做 point-in-time 回測嗎？",
        answer:
          "可以。每筆帶 knowledge_date 與 lineage，支援 as-of 重放；data_gaps 保留缺口訊號，不臆測補值。",
      },
      {
        question: "要付費才能用嗎？",
        answer: "5 檔免 key 即試；其他標的與資料集在 dashboard 自建金鑰，依方案計量。",
      },
    ],
    cta: { label: "讀 Quick Start", href: "/docs/quick-start" },
    relatedLinks: [
      { label: "瀏覽資料集目錄", href: "/datasets" },
      { label: "方案與定價", href: "/pricing" },
    ],
    aiAgentApiSchema: true,
    status: "published",
  },
  {
    // 篇6 (AEO handoff 2026-07-13). Leads with income statement + monthly revenue (self-check green).
    // Balance sheet / cash flow are NOT claimed in detail (balance self-check amber) — only noted as a
    // transparent rollout, per the honesty guardrail.
    slug: "taiwan-financial-statements-monthly-revenue-api",
    locale: "zh-Hant",
    question: "台股月營收與財報 API —— 官方對帳、跨期可比",
    metaTitle: "台股財報 API｜月營收、損益表，MOPS 官方對帳、跨期可比",
    description:
      "台股月營收（自 2010，YoY/MoM）與財報，來源 MOPS 官方、逐值對帳、欄位標準化跨期可比，每筆帶 knowledge_date。",
    shortAnswer:
      "找台股月營收、EPS、財報的程式化來源？TW Market Data 直接接 MOPS 公開資訊觀測站，欄位標準化、逐值對帳、每筆可追溯。",
    sections: [
      {
        heading: "月營收 —— 台股獨有的月頻基本面",
        body:
          `台股每月公告營收，是美股沒有的高頻基本面訊號。TW Market Data 的月營收自 ${coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4)} 年，含 YoY/MoM，對 MOPS 官方對帳。做「營收動能」選股或回測，每筆帶公告 knowledge_date，可對齊 as-of 不偷看未來。`,
        code:
          'curl "https://api.twmarketdata.com/v2/datasets/monthly-revenue?symbol=2330" \\\n  -H "X-API-Key: $TWMD_API_KEY"',
      },
      {
        heading: "財報（損益表）—— 標準化、可比較",
        body:
          "損益表欄位對到同一套分類，不同公司、不同期間可直接比較；來源 MOPS，source_role=canonical，並保留公司原始申報數字。EPS、毛利、營業利益等核心欄位可查。（資產負債表與現金流量表逐步上線，覆蓋逐集透明標示——見 /datasets。）",
      },
      {
        heading: "為什麼強調「對帳」與「knowledge_date」",
        body:
          "財報資料最怕兩件事：數字對不上官方、以及回測時用了「當時還沒公布」的財報。TW Market Data 對每個值做官方對帳（可追溯），並以 knowledge_date 標記知識日戳，兩個問題都處理。",
      },
    ],
    faq: [
      {
        question: "台股月營收 API 哪裡有？",
        answer:
          `TW Market Data 提供自 ${coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4)} 年的月營收（YoY/MoM），來源 MOPS 官方、逐值對帳，每筆帶公告 knowledge_date。`,
      },
      {
        question: "台積電 EPS、財報怎麼用程式抓？",
        answer:
          "呼叫 /v2/datasets/income-statement?symbol=2330，回傳標準化損益欄位含 EPS，來源 MOPS canonical。要最近四季滾動（TTM）口徑加 &period=ttm——伺服器端加總最近 4 完整季，附 ttm_window；回測可加 &as_of=<date> 做 PIT 過濾。",
      },
      {
        question: "有沒有 TTM（滾動四季）EPS／營收？",
        answer:
          "有。?period=ttm 由伺服器端加總最近 4 個完整季（revenue/net_income/eps 等），附加總窗與 knowledge_date；是 PIT-aware（以 report_date 為準、缺則退 period_end_date）。",
      },
      {
        question: "財報資料能對齊 as-of 做回測嗎？",
        answer:
          "可以，每筆帶 knowledge_date；月營收有公告日，回測可避免前視偏差。",
      },
    ],
    cta: { label: "月營收資料集", href: "/datasets/monthly-revenue" },
    relatedLinks: [
      { label: "損益表資料集", href: "/datasets/income-statement" },
      { label: "讀 Quick Start", href: "/docs/quick-start" },
    ],
    status: "published",
  },
];

export function getAnswerPageBySlug(slug: string): AnswerPageEntry | undefined {
  return answerPages.find((page) => page.slug === slug);
}

/** Map the app locale (en / zh-TW) to the content locale used by answer entries. */
function toAnswerPageLocale(locale: AppLocale): AnswerPageLocale {
  return locale === "en" ? "en" : "zh-Hant";
}

/**
 * Only pages with real content should be indexed / listed. Pass a locale to return just the entries
 * authored for that locale (each entry is already per-locale content); omit it (e.g. sitemap) to get
 * every published entry across locales.
 */
export function getPublishedAnswerPages(locale?: AppLocale): AnswerPageEntry[] {
  const published = answerPages.filter((page) => page.status === "published");
  if (!locale) return published;
  const answerLocale = toAnswerPageLocale(locale);
  return published.filter((page) => page.locale === answerLocale);
}
