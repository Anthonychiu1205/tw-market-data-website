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
};

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
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
