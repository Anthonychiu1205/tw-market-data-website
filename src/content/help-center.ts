import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  Braces,
  CircleHelp,
  CreditCard,
  Database,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export type HelpTopic = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  topics: HelpTopic[];
};

export const helpCategories: HelpCategory[] = [
  {
    id: "api-data",
    title: "API 與資料",
    description: "API 呼叫方式、資料查詢與常見回應問題。",
    icon: Database,
    topics: [
      {
        id: "how-to-get-api-key",
        question: "如何取得 API key？",
        answer:
          "登入 dashboard 後進入 API 金鑰區塊，建立新金鑰並立即複製。請妥善保存，若外洩請立即撤銷並重建。",
      },
      {
        id: "how-to-call-api",
        question: "如何呼叫 API？",
        answer:
          "使用 HTTPS GET 呼叫 /v2/datasets/* 端點，並在 header 帶入 X-API-Key。可先參考 /docs/quick-start 的範例。",
      },
      {
        id: "query-price",
        question: "如何查詢台股價格？",
        answer:
          "可從 /v2/datasets/twse-daily-price 或 /v2/datasets/tpex-daily-price 開始，帶入 symbol 與 limit 等查詢參數。",
      },
      {
        id: "request-id-meaning",
        question: "requestId 是什麼？",
        answer:
          "每次請求都會回傳 X-Request-Id，方便追蹤錯誤、對帳與客服排查。",
      },
      {
        id: "credits-calc",
        question: "credits 怎麼計算？",
        answer:
          "每個 dataset endpoint 會對應固定成本，回應 header 會帶 X-TWMD-Credits-Cost（試算或實扣依模式而定）。",
      },
      {
        id: "why-502-504",
        question: "為什麼會出現 502 / 504？",
        answer:
          "多半是上游 backend timeout、冷啟動或暫時性服務波動。可記錄 requestId，稍後重試或聯繫我們。",
      },
    ],
  },
  {
    id: "sdk-agent",
    title: "SDK / AI Agent",
    description: "SDK 使用、MCP 預覽與 agent workflow 說明。",
    icon: Bot,
    topics: [
      {
        id: "python-sdk",
        question: "Python SDK 怎麼用？",
        answer:
          "先設定 TWMD_API_KEY，建立 client 後呼叫 twse_daily_price、issuer_profile 等方法。詳見 /docs/sdk/python-sdk。",
      },
      {
        id: "js-sdk",
        question: "JavaScript SDK 怎麼用？",
        answer:
          "建立 TWMarketDataClient 並帶入 apiKey，可用 getDataset 或 dataset 專用 helper。詳見 /docs/sdk/javascript-sdk。",
      },
      {
        id: "what-is-mcp",
        question: "MCP 是什麼？",
        answer:
          "MCP 是讓 agent 以工具方式呼叫資料服務的介面。TW Market Data 目前提供 MCP skeleton（preview）。",
      },
      {
        id: "agent-workflow",
        question: "AI agent workflow 怎麼運作？",
        answer:
          "常見流程是先查公司主檔，再查價格與營收，最後整合為研究上下文。可參考 /docs/ai-agents/agent-workflow-examples。",
      },
      {
        id: "request-tracing",
        question: "request tracing 怎麼看？",
        answer:
          "在 SDK response meta 或 API response header 取得 requestId，再對照 usage/credits 記錄進行追查。",
      },
    ],
  },
  {
    id: "account-login",
    title: "帳號與登入",
    description: "Google 登入、Email/password 與 session 常見問題。",
    icon: UserRound,
    topics: [
      {
        id: "google-login-fail",
        question: "Google 登入失敗怎麼辦？",
        answer:
          "請先確認瀏覽器 cookie 與第三方登入流程可用；若持續失敗，回報發生時間與 requestId 協助排查。",
      },
      {
        id: "set-email-password",
        question: "如何設定 Email/password？",
        answer:
          "可使用註冊流程建立並驗證 Email，或在已存在帳號上完成驗證後設定密碼。",
      },
      {
        id: "dashboard-loading",
        question: "dashboard 一直 loading 怎麼辦？",
        answer:
          "通常與 session 或 backend 暫時波動有關。請重新整理、重新登入，或稍後再試。若持續發生請聯繫我們。",
      },
      {
        id: "session-problem",
        question: "session 常見問題有哪些？",
        answer:
          "若出現短暫未登入狀態，可能是 session 查詢失敗或網路波動。請以穩定網路重試，並保留時間點供排查。",
      },
    ],
  },
  {
    id: "billing-credits",
    title: "Billing / Credits",
    description: "方案、credits、試算模式與 usage 對應關係。",
    icon: CreditCard,
    topics: [
      {
        id: "what-is-credits",
        question: "credits 是什麼？",
        answer:
          "credits 用於 API 請求計價。可透過訂閱方案 included credits 或單次儲值補充。",
      },
      {
        id: "what-is-dry-run",
        question: "dry-run 是什麼？",
        answer:
          "dry-run 代表只計算估算成本，不真正扣除 wallet。回應會顯示 X-TWMD-Dry-Run: true。",
      },
      {
        id: "when-deduction-enabled",
        question: "正式扣點何時啟用？",
        answer:
          "正式扣點需由 production 安全旗標明確開啟，預設不啟用，避免誤扣。",
      },
      {
        id: "why-no-deduction",
        question: "為什麼目前看不到扣點？",
        answer:
          "若平台仍在試算模式，usage 會記錄 estimated credits，但 wallet 不會下降。",
      },
      {
        id: "view-usage",
        question: "如何查看 usage？",
        answer:
          "可在 /usage 查看請求紀錄與 requestId，在 /billing/credits 查看交易與對帳資訊。",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    description: "API key 安全與資料追蹤防護建議。",
    icon: ShieldCheck,
    topics: [
      {
        id: "api-key-leak",
        question: "API key 外洩怎麼辦？",
        answer:
          "請立即在 dashboard 撤銷該 key，並建立新的 key 替換。",
      },
      {
        id: "revoke-api-key",
        question: "如何 revoke API key？",
        answer:
          "在 API keys 表格按刪除/撤銷圖示即可。撤銷後該 key 立即失效。",
      },
      {
        id: "why-show-once",
        question: "為什麼 key 只顯示一次？",
        answer:
          "建立當下會顯示完整值，系統只儲存 hash 與加密版本，避免明文金鑰暴露。",
      },
      {
        id: "requestid-use",
        question: "requestId 有什麼用途？",
        answer:
          "requestId 可用於問題追蹤、對帳核對、客服協助定位單筆請求。",
      },
    ],
  },
  {
    id: "system-status",
    title: "系統狀態",
    description: "冷啟動、延遲與問題回報指引。",
    icon: Activity,
    topics: [
      {
        id: "render-cold-start",
        question: "什麼是 Render cold start？",
        answer:
          "低流量時後端服務可能進入冷狀態，首次請求會比較慢，後續暖機請求通常明顯加速。",
      },
      {
        id: "first-request-slow",
        question: "為什麼第一次 request 比較慢？",
        answer:
          "常見原因是 backend cold start、DB pool 喚醒或上游快取尚未建立。",
      },
      {
        id: "how-to-report",
        question: "如何回報問題？",
        answer:
          "請附上發生時間、端點、HTTP 狀態碼與 requestId，寄信至 avenra.platform@gmail.com。",
      },
    ],
  },
];

export type HelpSearchResult = {
  categoryId: string;
  categoryTitle: string;
  topicId: string;
  question: string;
};

export function searchHelpTopics(keyword: string): HelpSearchResult[] {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];

  const results: HelpSearchResult[] = [];

  for (const category of helpCategories) {
    for (const topic of category.topics) {
      const haystack = `${topic.question}\n${topic.answer}\n${topic.tags?.join(" ") ?? ""}`.toLowerCase();
      if (!haystack.includes(normalized)) continue;
      results.push({
        categoryId: category.id,
        categoryTitle: category.title,
        topicId: topic.id,
        question: topic.question,
      });
    }
  }

  return results;
}

export function getFaqTopicCount() {
  return helpCategories.reduce((sum, category) => sum + category.topics.length, 0);
}

export const helpCenterQuickLinks = [
  { label: "API 與資料", href: "#api-data" },
  { label: "SDK / AI Agent", href: "#sdk-agent" },
  { label: "帳號與登入", href: "#account-login" },
  { label: "Billing / Credits", href: "#billing-credits" },
  { label: "Security", href: "#security" },
  { label: "系統狀態", href: "#system-status" },
];

export const helpCenterStatusItems = [
  "API key 與資料存取以 requestId 可追蹤為主",
  "冷啟動時第一筆請求可能較慢，後續通常恢復",
  "如遇 502/504，請附上 requestId 聯繫支援",
];

export const helpCenterFooterCtas = [
  { label: "查看 API 文件", href: "/docs" },
  { label: "前往 SDK 文件", href: "/docs/sdk/python-sdk" },
  { label: "聯繫我們", href: "mailto:avenra.platform@gmail.com" },
];

export const helpCenterPageMeta = {
  title: "幫助中心",
  subtitle: "自助查找 API、SDK、帳務與系統狀態的常見問題。",
};

export const faqPageMeta = {
  title: "常見問題",
  subtitle: "快速找到最常被詢問的問題與排查建議。",
};

export const helpSearchPlaceholder = "搜尋問題、API、SDK、帳單、錯誤碼…";

export const helpEmptyStateMessage = "找不到相符結果，請換個關鍵字或直接聯繫我們。";

export const helpStatusBadgeLabel = "Self-serve support";

export const helpPrimaryHeading = "幫助中心";
export const faqPrimaryHeading = "常見問題";

export const helpSearchHint = "可直接搜尋 401、502、requestId、credits、SDK、MCP 等關鍵字";

export const helpFaqSectionTitle = "常見問題分類";
export const helpTopicSectionTitle = "問題清單";

export const helpCenterEntryCards = [
  {
    id: "faq",
    title: "常見問題",
    description: "快速查看 API、登入、billing、security 常見問題。",
    href: "/help-center#api-data",
    icon: CircleHelp,
  },
  {
    id: "docs",
    title: "API 文件",
    description: "查看 datasets、SDK 與 request/response 範例。",
    href: "/docs",
    icon: Braces,
  },
  {
    id: "status",
    title: "系統狀態指引",
    description: "了解冷啟動、timeout 與回報流程。",
    href: "#system-status",
    icon: Activity,
  },
  {
    id: "security",
    title: "金鑰安全",
    description: "API key 建立、複製、撤銷與外洩處置。",
    href: "#security",
    icon: KeyRound,
  },
];
