export type BlogCategory =
  | "產品更新"
  | "資料工程"
  | "API 教學"
  | "量化研究"
  | "AI Agent"
  | "產品化";

export type BlogBodyBlock =
  | { type: "heading"; level: 2 | 3; text: string; id?: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "callout"; title: string; text: string }
  | { type: "list"; style: "bullet" | "ordered"; items: string[] }
  | { type: "code"; language: "text" | "bash" | "json" | "typescript"; code: string };

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  keywords: string[];
  keyTakeaways?: string[];
  body: BlogBodyBlock[];
  disclaimer: string;
  // Parallel English fields (I18N-FIX-03 B). When present + locale==="en", the post renders in English
  // and the §2.5 "coming soon" notice is dropped. Absent → /en keeps the zh body + §2.5 fallback.
  title_en?: string;
  seoTitle_en?: string;
  excerpt_en?: string;
  description_en?: string;
  keyTakeaways_en?: string[];
  tags_en?: string[];
  body_en?: BlogBodyBlock[];
  disclaimer_en?: string;
  keywords_en?: string[];
};

// Locale selector: returns the English fields when locale is "en" and a translation exists, else the
// zh fields. `hasEnglish` drives dropping the §2.5 notice.
export function getLocalizedBlogPost(post: BlogPost, locale: string) {
  const en = locale === "en" && post.body_en != null;
  return {
    hasEnglish: en,
    title: en ? post.title_en ?? post.title : post.title,
    excerpt: en ? post.excerpt_en ?? post.excerpt : post.excerpt,
    description: en ? post.description_en ?? post.description : post.description,
    keyTakeaways: en ? post.keyTakeaways_en ?? post.keyTakeaways : post.keyTakeaways,
    tags: en ? post.tags_en ?? post.tags : post.tags,
    body: en ? post.body_en ?? post.body : post.body,
    disclaimer: en ? post.disclaimer_en ?? post.disclaimer : post.disclaimer,
    keywords: en ? post.keywords_en ?? post.keywords : post.keywords,
  };
}

export const BLOG_CATEGORIES: Array<"全部" | BlogCategory> = [
  "全部",
  "產品更新",
  "資料工程",
  "API 教學",
  "量化研究",
  "AI Agent",
  "產品化",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "verifiable-tw-market-data-for-ai-agents",
    title: "為什麼 AI Agent 需要可驗證的台股資料",
    seoTitle: "為什麼 AI Agent 需要可驗證的台股資料 | TW Market Data",
    excerpt:
      "AI 投資研究的品質，取決於資料能否追溯、重跑與驗證。",
    description:
      "AI 投資研究的品質取決於資料是否可追溯、可重跑與可驗證。本文說明台股資料 API、source attribution、coverage、freshness 與 data gaps 對 AI agent 和量化研究流程的重要性。",
    category: "AI Agent",
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-19",
    readingTime: "6 min read",
    author: "TW Market Data Team",
    coverImage: "/blog/covers/trusted-data-infrastructure.png",
    coverAlt: "Trusted data infrastructure abstract market data cover",
    tags: ["AI Agent", "台股資料", "資料驗證", "資料工程"],
    keywords: [
      "AI Agent",
      "台股資料 API",
      "資料可追溯",
      "可重跑研究",
      "data gaps",
      "freshness",
    ],
    keyTakeaways: [
      "AI 投資研究的品質，首先取決於資料是否可追溯、可重跑、可驗證，而不是模型或提示詞本身。",
      "台股資料產品化需要處理來源、欄位契約、coverage、freshness、缺口標記與重複資料稽核。",
      "TW Market Data 的方向是 official/public-first，先把可信資料層與 API contract 做穩，再把 AI research workflow 接上去。",
      "AI agent 應讀取 structured data、evidence、confidence 與 data_gaps，而不是直接輸出交易動作或保證價格。",
    ],
    body: [
      {
        type: "heading",
        level: 2,
        id: "before-models-verify-data",
        text: "模型之前，先確認資料",
      },
      {
        type: "paragraph",
        text:
          "在 AI Agent、量化研究與研究自動化流程裡，模型通常是最吸睛的一層，但它不是最先應該優化的一層。對多數台股研究場景來說，結論品質真正的上限，來自輸入資料是否可靠。當研究流程同時使用價格、月營收、財報、法人買賣超、技術指標與事件資料時，如果來源、欄位語意與更新節奏沒有對齊，模型再強也只能在不穩定地基上輸出看似完整的摘要。",
      },
      {
        type: "paragraph",
        text:
          "很多團隊會把「可讀」誤認為「可信」。一份文字流暢的研究報告，若無法回溯到原始資料、無法確認該資料是否為最新版本、無法說明缺漏欄位與補值規則，就很難支撐真正的決策流程。尤其在台股資料工程中，TWSE、TPEx、MOPS 與其他公開揭露系統的節奏不同、欄位命名不同、發布時點也不同，如果缺少 normalized schema 與 source attribution，後續比對與除錯成本會快速上升。",
      },
      {
        type: "paragraph",
        text:
          "因此，若要把 AI Agent 放進研究 workflow，第一步不是先做更複雜的提示編排，而是先建立能被驗證的 market data contract。這包含明確定義資料欄位、來源、更新時間、缺口狀態與可重跑證據。只有當資料工程層可被檢查，模型層的優化才有意義，否則每一次輸出都可能只是一次不可重現的猜測。",
      },
      {
        type: "heading",
        level: 2,
        id: "what-is-verifiable-market-data",
        text: "什麼是可驗證的台股資料",
      },
      {
        type: "paragraph",
        text:
          "可驗證的台股資料 API，不是「有 endpoint」就算完成，也不是「可以回 JSON」就代表可用。真正可驗證，代表任何一筆研究輸入都可以回答：來源是哪裡、欄位怎麼定義、更新到什麼時間、覆蓋到哪些股票、缺漏在哪裡、是否能重跑得到同一批結果。這些問題看似工程細節，實際上是研究品質與產品可信度的核心。",
      },
      {
        type: "list",
        style: "bullet",
        items: [
          "source attribution：每筆資料必須能回溯到官方或公開來源，以及擷取時間點。",
          "normalized schema：跨資料集欄位語意一致，避免同名不同義或同義不同名。",
          "coverage：可量化 ticker、日期、季度等覆蓋範圍，而不是只看單點成功案例。",
          "freshness：可追蹤最後更新時間、延遲狀態與資料新鮮度。",
          "data gaps：對缺漏採明示策略，不用補零假裝完整，不隱藏 unavailable 狀態。",
          "duplicate audit：可檢查邏輯主鍵是否重複，避免 downstream 指標失真。",
          "reproducible artifacts：重要 backfill、validation、gate decision 有可追溯紀錄。",
        ],
      },
      {
        type: "paragraph",
        text:
          "這些能力共同構成可信資料底座。當資料層可被驗證，AI Agent 才能把重心放在研究框架整理、情境比對與風險揭露，而不是不斷替不一致的資料做補救。對資料產品公司來說，這也是從 internal tool 走向可商業化 API 的必要條件。",
      },
      {
        type: "heading",
        level: 2,
        id: "why-tw-market-needs-source-first",
        text: "為什麼台股資料特別需要 source-first",
      },
      {
        type: "paragraph",
        text:
          "台股資料有明確的公開揭露規則，也有不同來源各自的格式與節奏。價格資料、月營收、財報、法人買賣超、事件資料，雖然都能被歸類為 market data，但它們的來源契約與更新週期不完全相同。若在資料層就把來源語意打平，研究流程會失去可檢查性，最終難以判斷問題是出在資料、映射還是模型。",
      },
      {
        type: "paragraph",
        text:
          "source-first 的價值不在於聲稱資料最多，而在於如實揭露狀態：哪些資料可穩定供應、哪些資料仍在補 coverage、哪些資料只能先以 beta 或 deferred 形式對外。這種策略對使用 API 的開發者更友善，因為可以在設計 workflow 時提早處理 data gaps、建立 fallback 路徑，避免把不確定性延後到正式環境才暴露。",
      },
      {
        type: "heading",
        level: 2,
        id: "what-ai-agent-should-read",
        text: "AI Agent 應該讀到什麼",
      },
      {
        type: "paragraph",
        text:
          "AI Agent 在研究流程中的角色，應該是整理與比較，而不是憑空生成結論。要達到這個目標，輸入必須從純文字摘要升級為結構化 research packet。對台股研究來說，常見的可用資料模組包括 prices、monthly revenue、income statement、balance sheet、institutional flow、technical indicators、valuation scenario，以及事件層的 news metadata / official events。",
      },
      {
        type: "paragraph",
        text:
          "除了原始數值，研究流程還需要 evidence、confidence 與 data_gaps。evidence 讓每一段敘述能被回溯，confidence 讓使用者理解不確定性，data_gaps 讓缺漏被正確揭露。這比生成一個看似完整的結論更重要。若缺少這些欄位，AI Agent 很容易把未知包裝成確定，導致研究輸出在表面上完整、實務上卻不可用。",
      },
      {
        type: "heading",
        level: 2,
        id: "tw-market-data-product-direction",
        text: "TW Market Data 的產品方向",
      },
      {
        type: "paragraph",
        text:
          "目前的產品順序是先把資料層做穩，再擴展研究層能力。第一優先是 TWSE daily price、monthly revenue、income statement、balance sheet、institutional flow 等核心資料集的 coverage 與契約一致性。這些資料是大多數研究任務的最小共同集，穩定性提升後，才能讓 API 與 dashboard 在不同使用情境下維持一致輸出。",
      },
      {
        type: "paragraph",
        text:
          "第二層是逐步補齊 margin-short、valuation source proof、technical indicators，以及 News Intelligence metadata-first。對尚未穩定的資料，我們會保持狀態透明而非強行包裝。文件與 API 範例也必須和 backend contract 對齊，避免產品說明與實際輸出出現偏差。至於 AI report viewer，會在資料 coverage 與主線能力穩定後，回到 dashboard 進行正式規劃，而不是先追求展示效果。",
      },
      {
        type: "heading",
        level: 2,
        id: "from-api-to-research-workflow",
        text: "從資料 API 到研究流程",
      },
      {
        type: "paragraph",
        text:
          "對開發者而言，好的台股資料 API 不是 endpoint 數量，而是能否回答關鍵問題：這個欄位代表什麼、來源是哪裡、更新到哪一天、目前 coverage 到哪裡、缺漏如何表示、同一份結果能否重跑。這些問題若有清楚答案，AI Agent、量化研究與內部分析工具就能共享同一套資料語意，降低重工與風險。",
      },
      {
        type: "paragraph",
        text:
          "當資料層穩定後，研究 workflow 可以更專注在情境比較與假設管理。例如，將同一組 ticker 的結構化資料映射到 evidence-oriented packet，再由 agent 產生可審閱的研究草稿；整個流程保留來源、置信度與缺漏，而不是只留下結論。這樣的設計更適合產品化，因為它讓每一次輸出都能被追蹤、被驗證、被迭代。",
      },
      {
        type: "heading",
        level: 2,
        id: "conclusion",
        text: "結語",
      },
      {
        type: "paragraph",
        text:
          "TW Market Data 的優先順序很明確：第一是資料可信，第二是 API 好用，第三是文件對齊，第四是 dashboard 可觀測，第五才是 AI workflow 的深度接入。這條路不追求短期炫技，而是把可驗證性放在第一位。對需要長期維護研究流程的團隊來說，這種節奏更慢，但也更可持續。",
      },
      {
        type: "paragraph",
        text:
          "如果 market data 要成為工程能力而非一次性素材，資料品質治理就不能被視為附屬工作。當 source attribution、coverage、freshness、data gaps 與 normalized schema 成為預設能力，AI Agent 與量化研究才會有穩定的輸入基礎，整個產品也更接近可長期運行的資料平台。本文僅說明資料產品與研究流程，不構成投資建議。",
      },
    ],
    disclaimer: "本文僅說明資料產品與研究流程，不構成投資建議。",
    title_en: "Why Verifiable Data Beats a Better Model in Taiwan Market Research",
    seoTitle_en: "Why Verifiable Data Beats a Better Model in Taiwan Market Research | TW Market Data",
    excerpt_en:
      "The quality of AI-driven investment research is capped by one thing — whether your data can be traced, replayed, and verified.",
    description_en:
      "AI investment research is only as reliable as its inputs. Here's why source attribution, coverage, freshness, and explicit data gaps in a Taiwan stock market data API matter more to AI agents and quant workflows than any model or prompt.",
    tags_en: ["AI Agent", "Taiwan market data", "Data verification", "Data engineering"],
    keywords_en: ["AI agent", "Taiwan market data API", "traceable data", "reproducible research", "data gaps", "freshness"],
    disclaimer_en: "This article describes a data product and research workflow only and does not constitute investment advice.",
    keyTakeaways_en: [
      "The ceiling on AI research quality is set by whether the data is traceable, replayable, and verifiable — not by the model or the prompt.",
      "Productizing Taiwan market data means solving for sources, field contracts, coverage, freshness, gap disclosure, and duplicate auditing — not just shipping endpoints.",
      "TW Market Data is official/public-first by design: get the trusted data layer and the API contract right first, then wire in the AI research workflow.",
      "An AI agent should consume structured data, evidence, confidence, and data_gaps — not emit trade actions or guaranteed prices.",
    ],
    body_en: [
      { type: "heading", level: 2, id: "before-models-verify-data", text: "Verify the data before you reach for a model" },
      {
        type: "paragraph",
        text:
          "In AI agents, quantitative research, and research-automation pipelines, the model is the part that gets the attention — but it's rarely the part you should optimize first. For most Taiwan-market use cases, the real ceiling on your conclusions is the reliability of the inputs. The moment a workflow pulls prices, monthly revenue, financial statements, institutional flow, technical indicators, and event data together, a strong model can't save you if the sources, field semantics, and update cadences don't line up — it will just produce a fluent-sounding summary on shaky ground.",
      },
      {
        type: "paragraph",
        text:
          "Plenty of teams mistake “readable” for “trustworthy.” A cleanly written research note that can't be traced back to its source, can't confirm whether the data is the latest revision, and can't explain its missing fields or imputation rules is a poor foundation for a real decision. That's especially true in Taiwan, where TWSE, TPEx, MOPS, and the other public-disclosure systems each move on their own schedule, name their fields differently, and publish at different times. Without a normalized schema and clear source attribution, the cost of downstream comparison and debugging climbs fast.",
      },
      {
        type: "paragraph",
        text:
          "So if you're putting an AI agent into a research workflow, the first move isn't more elaborate prompt orchestration — it's a market-data contract you can actually verify: explicitly defined fields, source, update time, gap status, and the evidence needed to replay a result. Only once the data-engineering layer is inspectable does optimizing the model layer mean anything. Otherwise every output is just an unreproducible guess.",
      },
      { type: "heading", level: 2, id: "what-is-verifiable-market-data", text: "What “verifiable” actually means" },
      {
        type: "paragraph",
        text:
          "A verifiable Taiwan market data API isn't “done” because it has endpoints, and it isn't usable just because it returns JSON. Truly verifiable means any single research input can answer: where did this come from, how is the field defined, how current is it, which tickers does it cover, where are the gaps, and can I replay it and get the same result? These look like engineering details. They're actually the core of both research quality and product trust.",
      },
      {
        type: "list",
        style: "bullet",
        items: [
          "Source attribution: every record traces back to an official or public source, with the time it was captured.",
          "Normalized schema: field semantics stay consistent across datasets, so you never hit same-name/different-meaning (or the reverse).",
          "Coverage: tickers, dates, and quarters are quantified, not represented by a single happy-path example.",
          "Freshness: last-updated time, latency, and staleness are all trackable.",
          "Data gaps: missing data is stated explicitly; nothing is zero-filled to fake completeness, and “unavailable” is never hidden.",
          "Duplicate audit: logical primary keys can be checked for duplication, so downstream metrics don't drift.",
          "Reproducible artifacts: meaningful backfills, validations, and gate decisions leave a traceable record.",
        ],
      },
      {
        type: "paragraph",
        text:
          "Together these make a trustworthy data foundation. When the data layer is verifiable, the agent can spend its effort framing the research, comparing scenarios, and surfacing risk — instead of endlessly patching over inconsistent inputs. For a data company, this is also the line between an internal tool and an API you can actually sell.",
      },
      { type: "heading", level: 2, id: "why-tw-market-needs-source-first", text: "Why Taiwan market data specifically needs to be source-first" },
      {
        type: "paragraph",
        text:
          "Taiwan market data comes with well-defined public-disclosure rules and with sources that each carry their own format and cadence. Prices, monthly revenue, financial statements, institutional flow, and event data all sit under the “market data” umbrella, but their source contracts and refresh cycles aren't the same. Flatten those source semantics at the data layer and the workflow loses its inspectability — you can no longer tell whether a problem lives in the data, the mapping, or the model.",
      },
      {
        type: "paragraph",
        text:
          "The value of source-first isn't claiming you have the most data — it's disclosing status honestly: which datasets ship reliably, which are still filling out coverage, and which can only go out as beta or deferred for now. That's friendlier to the developers building on the API, because they can design around data gaps and build fallback paths up front, instead of letting uncertainty surface only in production.",
      },
      { type: "heading", level: 2, id: "what-ai-agent-should-read", text: "What an AI agent should actually read" },
      {
        type: "paragraph",
        text:
          "An AI agent's job in a research workflow is to organize and compare — not to invent conclusions. To get there, the input has to graduate from plain-text summaries to a structured research packet. For Taiwan research, the common building blocks are prices, monthly revenue, income statement, balance sheet, institutional flow, technical indicators, and valuation scenarios, plus an event layer of news metadata and official events.",
      },
      {
        type: "paragraph",
        text:
          "Beyond the raw numbers, the workflow needs evidence, confidence, and data_gaps. Evidence lets every statement be traced back; confidence tells the user how much uncertainty is in play; data_gaps make the missing pieces visible. That matters more than producing a conclusion that merely looks complete. Without those fields, an agent will happily package the unknown as certainty — and the output ends up complete on the surface but unusable in practice.",
      },
      { type: "heading", level: 2, id: "tw-market-data-product-direction", text: "Where TW Market Data is headed" },
      {
        type: "paragraph",
        text:
          "The current order of operations is to get the data layer solid first, then extend the research layer. Priority one is coverage and contract consistency for the core datasets — TWSE daily price, monthly revenue, income statement, balance sheet, institutional flow. These are the smallest common set behind most research tasks; only once they're stable can the API and dashboard stay consistent across use cases.",
      },
      {
        type: "paragraph",
        text:
          "The second layer fills in margin and short-interest data, valuation source proof, and technical indicators, plus a planned metadata-first News Intelligence layer (roadmap, not yet live). For anything not yet stable, we keep the status transparent rather than dressing it up — and the docs and API examples have to match the backend contract, so the product description never drifts from the actual output. An AI report viewer is on the roadmap too: it returns to the dashboard for real planning once coverage and the core capabilities are stable, rather than shipping as a demo-first flourish.",
      },
      { type: "heading", level: 2, id: "from-api-to-research-workflow", text: "From data API to research workflow" },
      {
        type: "paragraph",
        text:
          "For a developer, a good Taiwan market data API isn't about endpoint count — it's whether it can answer the questions that matter: what does this field mean, where's it from, how current is it, how far does coverage go, how are gaps represented, and can the same result be replayed. When those have clear answers, AI agents, quant research, and internal analysis tools can share one set of data semantics — which cuts both rework and risk.",
      },
      {
        type: "paragraph",
        text:
          "Once the data layer is stable, the research workflow can focus on scenario comparison and hypothesis management. You might map a ticker's structured data into an evidence-oriented packet and let an agent draft a reviewable research note — with source, confidence, and gaps preserved end to end, not just the conclusion. That productizes far better, because every output can be traced, verified, and iterated.",
      },
      { type: "heading", level: 2, id: "conclusion", text: "Closing" },
      {
        type: "paragraph",
        text:
          "TW Market Data's priorities are explicit: trustworthy data first, a usable API second, docs that match third, an observable dashboard fourth, and deep AI-workflow integration only fifth. It's a road that doesn't chase short-term spectacle; it puts verifiability first. For teams maintaining a research workflow over the long run, this cadence is slower — but more sustainable.",
      },
      {
        type: "paragraph",
        text:
          "If market data is going to be an engineering capability rather than one-off material, data-quality governance can't be a side task. When source attribution, coverage, freshness, data gaps, and a normalized schema are default capabilities, AI agents and quant research finally have a stable input base — and the product moves closer to a data platform you can run for the long haul. This article describes a data product and research workflow only; it is not investment advice.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
