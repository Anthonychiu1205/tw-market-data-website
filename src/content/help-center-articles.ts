export type HelpArticleSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  steps?: string[];
  notes?: string[];
};

export type HelpArticle = {
  slug: "get-api-key" | "call-api" | "502-504-errors";
  title: string;
  description: string;
  category: "快速開始" | "錯誤排查";
  updatedAt?: string;
  sections: HelpArticleSection[];
  related: Array<"get-api-key" | "call-api" | "502-504-errors">;
};

export const helpCenterMeta = {
  title: "幫助中心",
  description: "TW Market Data API key、API 呼叫、錯誤排查與資料使用說明。",
};

export const helpCenterCategories: Array<{
  id: "quick-start" | "troubleshooting";
  title: "快速開始" | "錯誤排查";
  description: string;
}> = [
  {
    id: "quick-start",
    title: "快速開始",
    description: "先建立 API key，再用最小請求完成第一次資料查詢。",
  },
  {
    id: "troubleshooting",
    title: "錯誤排查",
    description: "針對 502 / 504 等常見錯誤建立可重現、可回報的排查流程。",
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
          "API key 是呼叫 TW Market Data API 的授權憑證。每次請求都應在 header 帶上 X-API-Key，系統才會判斷權限與方案限制。",
          "請把 API key 視為機密資料，不要放在公開前端程式碼、截圖或可公開存取的文件中。",
        ],
      },
      {
        id: "how-to-create",
        heading: "建立 API key 步驟",
        steps: [
          "登入 dashboard，進入 API 金鑰管理區塊。",
          "建立新的 API key，建立完成後立即複製。",
          "把 key 儲存在受保護的環境變數或密鑰管理工具。",
          "先用最小查詢測試 key 是否可用，再導入正式流程。",
        ],
      },
      {
        id: "security-practices",
        heading: "安全使用建議",
        notes: [
          "建議依環境分開建立 key（dev/staging/prod），避免共用同一把 key。",
          "若 key 疑似外洩，先撤銷舊 key，再建立新 key 並更新所有服務。",
          "撤銷與替換後，請用 requestId 做一筆驗證請求，確認新 key 流程正常。",
        ],
      },
      {
        id: "next-step",
        heading: "下一步",
        notes: ["/docs/quick-start", "/docs/openapi-spec", "/docs/introduction"],
      },
    ],
    related: ["call-api", "502-504-errors"],
  },
  {
    slug: "call-api",
    title: "如何呼叫 API？",
    description: "從 endpoint、header、query parameter 到錯誤排查，逐步建立可重現的呼叫流程。",
    category: "快速開始",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "request-basics",
        heading: "基本呼叫方式",
        paragraphs: [
          "TW Market Data 主要以 HTTPS GET 方式提供查詢，常見路徑格式為 /v2/datasets/*。",
          "每次請求都要帶 X-API-Key；若缺少或無效，通常會回傳 401。",
        ],
      },
      {
        id: "query-strategy",
        heading: "查詢參數建議",
        steps: [
          "先用小範圍查詢測試，例如 symbol + limit。",
          "確認欄位語意後，再加入 start_date / end_date 等條件。",
          "大範圍查詢建議分批執行，並保留每批 requestId 方便追蹤。",
        ],
      },
      {
        id: "error-checklist",
        heading: "常見錯誤快速檢查",
        notes: [
          "401：檢查 key 拼寫、空白字元、是否誤用已撤銷 key。",
          "429：檢查短時間流量、方案限制、重試退避策略。",
          "400：檢查參數名稱、型別、日期格式、必填欄位。",
        ],
      },
      {
        id: "operational-traceability",
        heading: "建議保留的排查資訊",
        notes: [
          "endpoint 路徑",
          "完整 query 參數",
          "requestId",
          "發生時間（含時區）",
        ],
      },
    ],
    related: ["get-api-key", "502-504-errors"],
  },
  {
    slug: "502-504-errors",
    title: "為什麼會出現 502 / 504？",
    description: "理解 502/504 的常見成因，並用可操作的流程縮短排查時間。",
    category: "錯誤排查",
    updatedAt: "2026-05-24",
    sections: [
      {
        id: "meaning",
        heading: "502 / 504 代表什麼",
        paragraphs: [
          "502 / 504 通常代表上游暫時不可用、查詢逾時，或單次查詢範圍過大造成延遲。",
          "這不等於資料一定不存在，也不等於帳號權限失效，通常屬於可恢復的暫時性問題。",
        ],
      },
      {
        id: "first-response",
        heading: "第一時間處理步驟",
        steps: [
          "先縮小查詢範圍（縮短 date range、降低 limit、先查單一 symbol）。",
          "使用有限次重試，並加入退避間隔。",
          "若是批次流程，先切分失敗批次重跑，避免整批中斷。",
        ],
      },
      {
        id: "what-to-record",
        heading: "回報前請先記錄",
        notes: [
          "endpoint",
          "symbol / ticker 與 date range",
          "完整查詢參數",
          "requestId",
          "發生時間（含時區）",
        ],
      },
      {
        id: "contact-support",
        heading: "何時聯絡支援",
        paragraphs: [
          "若同一查詢在縮小範圍與退避重試後仍持續發生 502/504，請把上述資訊提供給支援團隊。",
          "若 response 同時有 data_gaps，請一併附上原始回應與 requestId，避免關鍵上下文遺失。",
        ],
      },
    ],
    related: ["call-api", "get-api-key"],
  },
];

export function getHelpArticleBySlug(slug: string) {
  return helpCenterArticles.find((article) => article.slug === slug);
}
