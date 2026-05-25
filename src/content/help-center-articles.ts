export type HelpArticleSlug =
  | "get-api-key"
  | "call-api"
  | "502-504-errors"
  | "401-unauthorized"
  | "429-rate-limit"
  | "data-gaps"
  | "credits"
  | "change-api-key"
  | "contact-support"
  | "query-twse-daily-price"
  | "query-monthly-revenue"
  | "no-data-returned"
  | "wrong-parameters"
  | "openapi-usage"
  | "mcp-preview";

export type HelpArticleSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  steps?: string[];
  notes?: string[];
};

export type HelpArticle = {
  slug: HelpArticleSlug;
  title: string;
  description: string;
  category: "快速開始" | "錯誤排查" | "資料與用量" | "帳號與安全" | "工具與 AI" | "聯絡支援";
  updatedAt?: string;
  sections: HelpArticleSection[];
  related: HelpArticleSlug[];
};

export const helpCenterMeta = {
  title: "幫助中心",
  description: "TW Market Data API key、API 呼叫、錯誤排查與資料使用說明。",
};

export const helpCenterCategories: Array<{
  id: "quick-start" | "troubleshooting" | "data-usage" | "security" | "tools-ai" | "contact";
  title: HelpArticle["category"];
  description: string;
}> = [
  {
    id: "quick-start",
    title: "快速開始",
    description: "先建立 API key，再用簡單查詢確認資料流程。",
  },
  {
    id: "troubleshooting",
    title: "錯誤排查",
    description: "針對 401、429、502/504 建立可重現、可回報的處理步驟。",
  },
  {
    id: "data-usage",
    title: "資料與用量",
    description: "看懂 data_gaps 與 credits，避免誤判資料與成本。",
  },
  {
    id: "security",
    title: "帳號與安全",
    description: "API key 外洩或更換時，如何安全處理。",
  },
  {
    id: "tools-ai",
    title: "工具與 AI",
    description: "了解 OpenAPI 與 MCP preview 該怎麼用，避免誤解為正式交易工具。",
  },
  {
    id: "contact",
    title: "聯絡支援",
    description: "整理回報資訊，讓支援團隊更快幫你定位問題。",
  },
];

export const helpCenterArticles: HelpArticle[] = [
  {
    slug: "get-api-key",
    title: "如何取得 API key？",
    description: "從建立金鑰到安全保存，完整說明常見操作與風險防護。",
    category: "快速開始",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "what-is-key",
        heading: "API key 是什麼",
        paragraphs: [
          "API key 可以理解成你的服務通行證。系統會用這組字串確認「這個請求是不是你的」。",
          "每次呼叫資料 API，都要在 request header 帶上 X-API-Key。若沒帶，系統通常會拒絕請求。",
          "這組 key 請當成密碼一樣保管，不要貼在公開頁面、截圖或可被別人看到的地方。",
        ],
      },
      {
        id: "how-to-create",
        heading: "建立 API key 步驟",
        steps: [
          "登入 dashboard，進到 API key 管理區。",
          "建立新 key，建立後先複製保存。",
          "把 key 放在安全環境（例如後端環境變數）。",
          "用最小查詢做一次測試，確認 key 可用。",
        ],
      },
      {
        id: "security-practices",
        heading: "安全使用建議",
        notes: [
          "建議 dev、staging、production 分開使用不同 key。",
          "不要把 key 放在前端程式碼或公開 repo。",
          "若懷疑外洩，先撤銷舊 key，再建立新 key。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/docs/quick-start", "/docs/openapi-spec", "/help-center/call-api"],
      },
    ],
    related: ["call-api", "401-unauthorized", "change-api-key"],
  },
  {
    slug: "call-api",
    title: "如何呼叫 API？",
    description: "用白話步驟帶你完成第一次請求，並避免常見錯誤。",
    category: "快速開始",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "request-basics",
        heading: "先理解最基本流程",
        paragraphs: [
          "呼叫 API 的意思，就是你的程式對資料服務送出請求，再拿回結果。",
          "TW Market Data 主要使用 HTTPS GET。你可以先從 /v2/datasets/* 路徑開始。",
          "每次請求都要帶 X-API-Key。建議先做最小查詢，成功後再擴大範圍。",
        ],
      },
      {
        id: "query-strategy",
        heading: "建議查詢方式",
        steps: [
          "先用單一標的與小範圍，例如 symbol + limit。",
          "確認欄位和格式都正確後，再加 start_date、end_date。",
          "大範圍資料請分批查，避免一次請求太重。",
          "保留 requestId，方便後續排查。",
        ],
      },
      {
        id: "error-checklist",
        heading: "遇到錯誤先看這裡",
        notes: [
          "401：常見是 key 錯誤或沒帶。",
          "429：請求太密集，先放慢速度。",
          "400：通常是參數格式或必填欄位有問題。",
        ],
      },
      {
        id: "support-ready",
        heading: "需要支援時要留什麼",
        notes: ["endpoint", "完整參數", "HTTP 狀態碼", "requestId", "發生時間（含時區）"],
      },
    ],
    related: ["wrong-parameters", "query-twse-daily-price", "contact-support"],
  },
  {
    slug: "502-504-errors",
    title: "為什麼會出現 502 / 504？",
    description: "理解 502/504 常見原因，並用簡單步驟縮短排查時間。",
    category: "錯誤排查",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "meaning",
        heading: "502 / 504 是什麼意思",
        paragraphs: [
          "這兩個狀態通常代表服務在中間環節暫時卡住或逾時，不一定是你做錯。",
          "它常出現在查詢範圍過大、上游資料源暫時慢、或短時間流量波動時。",
          "請先把它當成「暫時性問題」，不要直接當成資料不存在。",
        ],
      },
      {
        id: "first-response",
        heading: "你可以先做的事",
        steps: [
          "縮小查詢範圍，例如縮短日期、降低 limit。",
          "稍等幾秒後重試，不要立即連續狂打。",
          "若是批次任務，先分段重跑失敗區塊。",
          "同時記錄 requestId 和發生時間。",
        ],
      },
      {
        id: "what-to-record",
        heading: "回報前請整理這些資訊",
        notes: ["endpoint", "查詢參數", "symbol / ticker", "HTTP 狀態碼", "requestId", "發生時間"],
      },
      {
        id: "contact-support",
        heading: "什麼時候要找支援",
        paragraphs: [
          "如果你已縮小查詢且重試後仍持續出現 502/504，就建議聯絡支援。",
          "若回應裡有 data_gaps，請一併保留，這能幫助判斷是資料缺口還是請求路徑問題。",
          "回報時不要附 API key 全碼，只需要 requestId 與請求上下文。",
        ],
      },
    ],
    related: ["data-gaps", "contact-support", "call-api"],
  },
  {
    slug: "401-unauthorized",
    title: "為什麼會出現 401？",
    description: "401 多半與 API key 驗證失敗有關，本文用白話帶你快速排查。",
    category: "錯誤排查",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "what-is-401",
        heading: "401 代表什麼",
        paragraphs: [
          "401 可以理解成「系統目前無法確認你是誰」。在 API 場景裡，通常就是 key 驗證沒有成功。",
          "這不代表你帳號一定壞掉，很多時候只是 header 寫錯、key 複製不完整，或用了錯環境的 key。",
        ],
      },
      {
        id: "common-reasons",
        heading: "最常見原因",
        notes: [
          "請求沒有帶 X-API-Key。",
          "key 複製錯誤，含多餘空白或換行。",
          "key 已撤銷或已替換。",
          "把 key 放在 query string 而不是 header。",
          "dev 環境誤用了 production key（或反過來）。",
        ],
      },
      {
        id: "how-to-fix",
        heading: "建議處理步驟",
        steps: [
          "從 dashboard 重新複製 key。",
          "確認 header 名稱是 X-API-Key，且值沒有前後空白。",
          "用最簡單的 endpoint 做一次最小查詢測試。",
          "若仍 401，建立新 key 再測一次。",
        ],
      },
      {
        id: "support-info",
        heading: "需要支援時怎麼回報",
        paragraphs: [
          "不要提供完整 API key，也不要貼任何密碼。",
          "請提供 requestId、發生時間、endpoint、狀態碼，以及你已嘗試的步驟。",
          "這些資訊通常就足夠讓支援團隊快速定位。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/get-api-key", "/help-center/call-api", "/help-center/contact-support"],
      },
    ],
    related: ["get-api-key", "call-api", "contact-support"],
  },
  {
    slug: "429-rate-limit",
    title: "為什麼會出現 429？",
    description: "429 通常是請求太密集或超出方案限制，本文提供不複雜的處理方式。",
    category: "錯誤排查",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "what-is-429",
        heading: "429 代表什麼",
        paragraphs: [
          "429 的意思是：你在短時間送了太多請求，系統先請你慢一點。",
          "可以把它想成排隊機制，避免某個使用者瞬間把服務打滿。",
          "這個狀態通常是暫時的，不是永久封鎖。",
        ],
      },
      {
        id: "common-reasons",
        heading: "常見原因",
        notes: [
          "同時發太多請求。",
          "重試策略太積極，失敗後立即重打。",
          "批次任務沒有分段。",
          "目前方案上限已接近或達到。",
        ],
      },
      {
        id: "how-to-fix",
        heading: "你可以怎麼做",
        steps: [
          "降低請求頻率，不要瞬間大量併發。",
          "加入重試間隔（例如逐步增加等待秒數）。",
          "把大批查詢拆成小批次。",
          "到 dashboard 檢查當前方案限制與用量。",
        ],
      },
      {
        id: "support-info",
        heading: "什麼時候要聯絡支援",
        paragraphs: [
          "若你已經降低頻率、加上間隔，仍長時間 429，請聯絡支援。",
          "回報時提供發生時間、endpoint、大致請求量與 requestId。",
          "不用提供 API key 全碼。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/credits", "/help-center/call-api", "/help-center/contact-support"],
      },
    ],
    related: ["credits", "call-api", "contact-support"],
  },
  {
    slug: "data-gaps",
    title: "data_gaps 是什麼？",
    description: "data_gaps 是資料缺口提示，不等於系統壞掉；本文說明如何正確處理。",
    category: "資料與用量",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "what-is-data-gaps",
        heading: "先用白話理解 data_gaps",
        paragraphs: [
          "data_gaps 可以理解成「資料缺口提醒」。系統在告訴你：這筆資料目前不完整或有條件限制。",
          "它不一定是錯誤，有時是來源尚未公布，有時是該日期本來就沒有資料。",
          "所以看到 data_gaps 時，重點不是忽略它，而是把它當成結果的一部分。",
        ],
      },
      {
        id: "possible-reasons",
        heading: "常見出現原因",
        notes: [
          "官方來源尚未公布該欄位或該期間資料。",
          "該公司在該日期本來就沒有對應資料。",
          "資料覆蓋仍在補齊中。",
          "某些欄位暫時不可用或尚未標準化完成。",
        ],
      },
      {
        id: "how-to-use",
        heading: "你可以怎麼做",
        steps: [
          "不要把缺口直接當成 0。",
          "在報表或模型中保留 data_gaps 訊號。",
          "確認 freshness 與 coverage 說明。",
          "必要時縮小查詢範圍，確認問題是資料缺口還是查詢設定。",
        ],
      },
      {
        id: "agent-note",
        heading: "如果你用 AI agent",
        paragraphs: [
          "請不要忽略 data_gaps，也不要自動補不存在的數字。",
          "比較安全的做法是把缺口一起輸出，讓下游或使用者知道哪裡仍有不確定性。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/call-api", "/help-center/502-504-errors", "/help-center/contact-support"],
      },
    ],
    related: ["no-data-returned", "query-monthly-revenue", "contact-support"],
  },
  {
    slug: "credits",
    title: "credits 怎麼計算？",
    description: "用簡單方式理解 credits，並降低不必要的用量消耗。",
    category: "資料與用量",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "what-is-credits",
        heading: "credits 是什麼",
        paragraphs: [
          "credits 可以理解成 API 使用量的計算單位。",
          "不同資料端點可能有不同成本，查詢範圍越大，通常越容易提高用量。",
          "你不需要先記一堆複雜規則，先從小查詢開始，就能快速掌握用量節奏。",
        ],
      },
      {
        id: "what-affects-usage",
        heading: "什麼會影響用量",
        notes: [
          "使用哪個 endpoint。",
          "查詢範圍大小（日期、筆數、批次數）。",
          "是否重複查同一批資料。",
          "當前方案的限制與可用額度。",
        ],
      },
      {
        id: "how-to-manage",
        heading: "降低用量壓力的做法",
        steps: [
          "先用小範圍查詢驗證欄位。",
          "批次任務分段跑，避免一次拉太大。",
          "把已抓過且不常變動的資料做快取。",
          "固定查看 dashboard 或回應 header 的用量訊號。",
        ],
      },
      {
        id: "when-to-contact",
        heading: "如果你覺得用量不合理",
        paragraphs: [
          "請整理 endpoint、發生時間、requestId 與實際查詢參數後聯絡支援。",
          "這些資訊足夠做對照，不需要提供完整 API key。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/429-rate-limit", "/help-center/call-api", "/help-center/contact-support"],
      },
    ],
    related: ["429-rate-limit", "call-api", "contact-support"],
  },
  {
    slug: "change-api-key",
    title: "API key 外洩或想更換怎麼辦？",
    description: "當你懷疑 key 外洩或要輪替時，這份流程可幫你安全完成更換。",
    category: "帳號與安全",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "when-to-change",
        heading: "什麼情況要換 key",
        paragraphs: [
          "只要你懷疑 key 可能被看到、被分享到不該出現的地方，就建議更換。",
          "即使不確定是否外洩，提早輪替通常比放著不管更安全。",
        ],
      },
      {
        id: "change-steps",
        heading: "建議更換步驟",
        steps: [
          "先建立新 key。",
          "把服務環境改用新 key。",
          "確認主要流程都正常後，再撤銷舊 key。",
          "最後做一次最小查詢測試並記錄結果。",
        ],
      },
      {
        id: "security-rules",
        heading: "要避免的風險",
        notes: [
          "不要把 key 放在前端公開程式碼。",
          "不要在截圖、聊天、issue、公開 repo 貼 key。",
          "團隊內建議按環境與用途拆分 key，避免共用。",
        ],
      },
      {
        id: "contact-support",
        heading: "何時找支援",
        paragraphs: [
          "若更換後仍連續 401，請附 requestId、endpoint、時間與你已做過的步驟聯絡支援。",
          "不需要提供完整 key，避免二次風險。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/get-api-key", "/help-center/401-unauthorized", "/help-center/contact-support"],
      },
    ],
    related: ["get-api-key", "401-unauthorized", "contact-support"],
  },
  {
    slug: "contact-support",
    title: "聯絡支援前要準備什麼？",
    description: "先把資訊整理好，通常能大幅縮短來回確認時間。",
    category: "聯絡支援",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "why-prepare",
        heading: "為什麼要先準備資訊",
        paragraphs: [
          "支援團隊需要足夠上下文，才能快速定位問題。",
          "如果只有一句「我壞掉了」，通常要來回問很多次，處理時間會變長。",
        ],
      },
      {
        id: "what-to-prepare",
        heading: "建議準備清單",
        notes: [
          "問題發生時間（含時區）",
          "endpoint",
          "查詢參數",
          "HTTP status code",
          "requestId",
          "是否可重現",
          "你已嘗試過哪些步驟",
        ],
      },
      {
        id: "what-not-to-send",
        heading: "不要提供的敏感資訊",
        notes: [
          "完整 API key",
          "密碼",
          "資料庫連線字串",
          "付款敏感資料",
        ],
      },
      {
        id: "safe-evidence",
        heading: "可以提供的證據",
        steps: [
          "附上遮蔽後的錯誤截圖。",
          "提供簡化後的 request example。",
          "列出你預期的結果與實際結果差異。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        paragraphs: [
          "把上面資訊整理好後，再寄到 avenra.platform@gmail.com，通常可以更快得到可執行的排查建議。",
          "若是間歇性問題，請提供成功與失敗各一筆樣本，幫助比對。",
        ],
      },
    ],
    related: ["502-504-errors", "401-unauthorized", "429-rate-limit"],
  },
  {
    slug: "query-twse-daily-price",
    title: "如何查詢台股日線價格？",
    description: "從股票代號、日期區間到資料檢查，用最實用的方式完成日線查詢。",
    category: "快速開始",
    updatedAt: "2026-05-25",
    sections: [
      {
        id: "what-it-means",
        heading: "日線價格是什麼",
        paragraphs: [
          "日線價格可以理解成「每天收盤後整理的一天資料」。它通常包含開盤、最高、最低、收盤和成交量。",
          "這類資料適合看趨勢、比對不同日期表現，也常用在報表或策略測試前的資料準備。",
        ],
      },
      {
        id: "how-to-query",
        heading: "建議查詢步驟",
        steps: [
          "先確認股票代號是否正確。",
          "依標的選對市場資料集（TWSE 或 TPEx）。",
          "先用小範圍查詢，例如幾天資料，不要一開始就查太長區間。",
          "帶入 symbol、start_date、end_date、limit 後送出請求。",
          "拿到結果後，確認欄位完整，並檢查有沒有 data_gaps 提示。",
        ],
      },
      {
        id: "common-problems",
        heading: "常見查不到資料原因",
        notes: [
          "日期剛好是非交易日。",
          "股票代號填錯，或用了不對的市場資料集。",
          "資料尚未更新到你查的時段。",
        ],
      },
      {
        id: "support-prep",
        heading: "如果還是不行，回報前請準備",
        paragraphs: [
          "請準備 requestId、endpoint、查詢參數和發生時間，再聯絡支援。",
          "不需要提供完整 API key。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/docs/api/market-prices/twse-daily-price", "/docs/api/market-prices/tpex-daily-price", "/help-center/wrong-parameters"],
      },
    ],
    related: ["wrong-parameters", "no-data-returned", "data-gaps"],
  },
  {
    slug: "query-monthly-revenue",
    title: "如何查詢月營收？",
    description: "用簡單流程查公司每月營收，並避免把缺資料誤判成 0。",
    category: "快速開始",
    updatedAt: "2026-05-25",
    sections: [
      {
        id: "what-it-means",
        heading: "月營收資料是什麼",
        paragraphs: [
          "月營收是公司按月公布的營收數字，不是每天都會更新。",
          "所以你查最新月份時，若公司還沒公告，結果可能暫時沒有資料。",
        ],
      },
      {
        id: "how-to-query",
        heading: "建議查詢步驟",
        steps: [
          "先查單一公司，確認代號正確。",
          "確認月份格式符合文件要求。",
          "先看幾個月資料，確認欄位都能正常回傳。",
          "若要比年增率或月增率，先檢查是否有缺口再做比較。",
        ],
      },
      {
        id: "common-problems",
        heading: "常見問題",
        notes: [
          "最新月份尚未公告。",
          "查詢月份格式不符合要求。",
          "把缺資料誤當成 0，導致後續計算失真。",
        ],
      },
      {
        id: "support-prep",
        heading: "如果結果看起來不合理",
        paragraphs: [
          "請保留 requestId、公司代號、查詢月份和錯誤狀態碼，再回報支援。",
          "不要傳完整 API key。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/docs/api/financial-growth/monthly-revenue", "/help-center/data-gaps", "/help-center/no-data-returned"],
      },
    ],
    related: ["no-data-returned", "data-gaps", "wrong-parameters"],
  },
  {
    slug: "no-data-returned",
    title: "為什麼查不到資料？",
    description: "查不到資料不一定是系統壞掉，這篇幫你快速找出最常見原因。",
    category: "錯誤排查",
    updatedAt: "2026-05-25",
    sections: [
      {
        id: "what-it-means",
        heading: "先理解「查不到資料」",
        paragraphs: [
          "查不到資料不一定代表 API 故障。有時候是條件太嚴格，有時候是該期間本來就沒有資料。",
          "先分清楚是「請求失敗」還是「請求成功但資料為空」，可以省下很多排查時間。",
        ],
      },
      {
        id: "common-reasons",
        heading: "常見原因",
        notes: [
          "股票代號錯誤。",
          "日期不是交易日或公司尚未公告。",
          "該公司在該期間本來就沒有資料。",
          "資料尚在更新中或 coverage 尚未補齊。",
          "方案或權限限制。",
        ],
      },
      {
        id: "how-to-fix",
        heading: "你可以怎麼做",
        steps: [
          "先縮小查詢範圍，用最小條件測一次。",
          "用已知一定有資料的代號做對照測試。",
          "查看回應中的 data_gaps 與 status code。",
          "保留 requestId，方便後續比對。",
        ],
      },
      {
        id: "important-note",
        heading: "不要自行補數字",
        paragraphs: [
          "若結果是空或有缺口，不要直接補 0 或猜測數值。",
          "先確認資料條件與可用性，再決定是否要改查詢範圍或改資料來源。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/data-gaps", "/help-center/wrong-parameters", "/help-center/contact-support"],
      },
    ],
    related: ["data-gaps", "wrong-parameters", "contact-support"],
  },
  {
    slug: "wrong-parameters",
    title: "參數填錯怎麼辦？",
    description: "參數錯誤是最常見問題之一，這篇用最直覺的方式幫你快速修正。",
    category: "錯誤排查",
    updatedAt: "2026-05-25",
    sections: [
      {
        id: "what-it-means",
        heading: "參數是什麼",
        paragraphs: [
          "參數就是你送給 API 的查詢條件，例如股票代號、日期區間、筆數上限。",
          "只要格式或欄位名稱不對，系統就可能回 400 或拿不到你預期資料。",
        ],
      },
      {
        id: "common-mistakes",
        heading: "常見填錯方式",
        notes: [
          "symbol / ticker 用錯欄位名稱。",
          "日期格式不是 YYYY-MM-DD。",
          "start_date 晚於 end_date。",
          "limit 設太大。",
          "header 沒帶 API key。",
        ],
      },
      {
        id: "how-to-fix",
        heading: "建議修正步驟",
        steps: [
          "先對照 API 文件的 Query Parameters。",
          "先用最小必要參數測一次。",
          "日期統一用 YYYY-MM-DD。",
          "不要一開始就查太大範圍。",
          "若回 400，先看錯誤訊息再修正。",
        ],
      },
      {
        id: "support-prep",
        heading: "還是不行時要準備什麼",
        paragraphs: [
          "請附上 endpoint、參數、status code、requestId 和你已嘗試的修正方式。",
          "不需要提供完整 API key。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/call-api", "/help-center/no-data-returned", "/docs/openapi-spec"],
      },
    ],
    related: ["call-api", "401-unauthorized", "no-data-returned"],
  },
  {
    slug: "openapi-usage",
    title: "OpenAPI 規格可以怎麼用？",
    description: "用白話理解 OpenAPI，幫你更快接 API、測試請求與檢查回傳格式。",
    category: "工具與 AI",
    updatedAt: "2026-05-25",
    sections: [
      {
        id: "what-is-openapi",
        heading: "OpenAPI 是什麼",
        paragraphs: [
          "OpenAPI 可以把它想成「給工具讀的 API 說明書」。",
          "它會告訴你：有哪些路徑、要帶哪些參數、可能回哪些格式與狀態碼。",
          "你不一定要手動讀完整檔案，很多工具可以直接匯入使用。",
        ],
      },
      {
        id: "common-uses",
        heading: "常見用途",
        notes: [
          "匯入 Postman 或 Insomnia 來快速測試。",
          "讓 AI 工具理解 API 可呼叫範圍。",
          "產生 SDK 或型別定義，減少手寫錯誤。",
          "檢查 request / response 是否符合預期。",
        ],
      },
      {
        id: "important-reminders",
        heading: "使用時要注意",
        paragraphs: [
          "OpenAPI 是輔助文件，不是保證每個欄位在所有時間都一定有值。",
          "實際可用資料仍會受 coverage、方案限制與更新時間影響。",
          "OpenAPI 也不是用來提供買賣判斷的工具，請把它當成技術整合說明。",
        ],
      },
      {
        id: "support-prep",
        heading: "如果匯入或解析有問題",
        paragraphs: [
          "請保留你使用的工具名稱、錯誤畫面、requestId（若有）與發生時間，再聯絡支援。",
          "不需要提供完整 API key。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/docs/openapi-spec", "/help-center/call-api", "/help-center/mcp-preview"],
      },
    ],
    related: ["call-api", "mcp-preview", "data-gaps"],
  },
  {
    slug: "mcp-preview",
    title: "MCP Server Preview 是什麼？",
    description: "MCP preview 是讓 AI 工具接資料服務的試驗入口，目前不是正式 production 服務。",
    category: "工具與 AI",
    updatedAt: "2026-05-25",
    sections: [
      {
        id: "what-is-mcp",
        heading: "先用白話理解 MCP",
        paragraphs: [
          "MCP 是讓 AI 工具接外部資料服務的一種溝通方式，可以想成「工具對工具的標準接口」。",
          "目前 TW Market Data 的 MCP 狀態是 preview / planned，不是正式 production-ready server。",
        ],
      },
      {
        id: "what-to-use-now",
        heading: "現階段建議先用什麼",
        steps: [
          "先用 API 文件確認端點與參數。",
          "用 OpenAPI 規格做工具整合與測試。",
          "需要給 AI 閱讀時，可參考 llms.txt / llms-full.txt。",
        ],
      },
      {
        id: "what-is-needed-later",
        heading: "正式化前還需要什麼",
        notes: [
          "穩定的 API contract（接口不再頻繁變動）。",
          "完整的 coverage audit（資料覆蓋稽核）。",
          "明確的權限與用量控制。",
          "正式產品化批准流程。",
        ],
      },
      {
        id: "important-safety-note",
        heading: "重要提醒",
        paragraphs: [
          "請不要把 preview MCP 當成可直接做交易或投資決策的正式系統。",
          "即使是 AI 流程，也要保留 data_gaps 與 coverage 限制，避免模型誤判。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/help-center/openapi-usage", "/help-center/data-gaps", "/help-center/contact-support"],
      },
    ],
    related: ["openapi-usage", "data-gaps", "contact-support"],
  },
];

export function getHelpArticleBySlug(slug: string) {
  return helpCenterArticles.find((article) => article.slug === slug);
}
