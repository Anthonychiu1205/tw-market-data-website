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

import type { AppLocale } from "@/src/i18n/locales";

// Structured content data (spec §1.6): both languages live on the record; a selector projects the
// locale at render time. ids / hrefs / anchors are locale-agnostic and never change.

type HelpTopicSource = {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  tags?: string[];
};

type HelpCategorySource = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: LucideIcon;
  topics: HelpTopicSource[];
};

// Projected (single-locale) shapes consumed by the view. Kept identical to the pre-i18n public API.
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

const helpCategoriesSource: HelpCategorySource[] = [
  {
    id: "api-data",
    title: "API 與資料",
    titleEn: "API & data",
    description: "API 呼叫方式、資料查詢與常見回應問題。",
    descriptionEn: "How to call the API, query datasets, and resolve common response issues.",
    icon: Database,
    topics: [
      {
        id: "how-to-get-api-key",
        question: "如何取得 API key？",
        questionEn: "How do I get an API key?",
        answer:
          "登入 dashboard 後進入 API 金鑰區塊，建立新金鑰並立即複製。請妥善保存，若外洩請立即撤銷並重建。",
        answerEn:
          "Sign in to the dashboard, open the API keys section, create a new key, and copy it immediately. Store it securely; if it leaks, revoke it and create a new one right away.",
      },
      {
        id: "how-to-call-api",
        question: "如何呼叫 API？",
        questionEn: "How do I call the API?",
        answer:
          "使用 HTTPS GET 呼叫 /v2/datasets/* 端點，並在 header 帶入 X-API-Key。可先參考 /docs/quick-start 的範例。",
        answerEn:
          "Send an HTTPS GET request to the /v2/datasets/* endpoints with your key in the X-API-Key header. See /docs/quick-start for examples.",
      },
      {
        id: "query-price",
        question: "如何查詢台股價格？",
        questionEn: "How do I query Taiwan stock prices?",
        answer:
          "可從 /v2/datasets/twse-daily-price 或 /v2/datasets/tpex-daily-price 開始，帶入 symbol 與 limit 等查詢參數。",
        answerEn:
          "Start from /v2/datasets/twse-daily-price or /v2/datasets/tpex-daily-price, passing query parameters such as symbol and limit.",
      },
      {
        id: "request-id-meaning",
        question: "requestId 是什麼？",
        questionEn: "What is requestId?",
        answer:
          "每次請求都會回傳 X-Request-Id，方便追蹤錯誤、對帳與客服排查。",
        answerEn:
          "Every request returns an X-Request-Id, which makes it easier to trace errors, reconcile records, and let support investigate.",
      },
      {
        id: "credits-calc",
        question: "credits 怎麼計算？",
        questionEn: "How are credits calculated?",
        answer:
          "每個 dataset endpoint 會對應固定成本，回應 header 會帶 X-TWMD-Credits-Cost（試算或實扣依模式而定）。",
        answerEn:
          "Each dataset endpoint maps to a fixed cost, and the response header carries X-TWMD-Credits-Cost (estimated or actually charged depending on the mode).",
      },
      {
        id: "why-502-504",
        question: "為什麼會出現 502 / 504？",
        questionEn: "Why do I get 502 / 504 errors?",
        answer:
          "多半是上游 backend timeout、冷啟動或暫時性服務波動。可記錄 requestId，稍後重試或聯繫我們。",
        answerEn:
          "These usually come from an upstream backend timeout, a cold start, or a temporary service fluctuation. Record the requestId, retry later, or contact us.",
      },
    ],
  },
  {
    id: "sdk-agent",
    title: "SDK / AI Agent",
    titleEn: "SDK / AI agent",
    description: "SDK 使用、MCP 預覽與 agent workflow 說明。",
    descriptionEn: "Using the SDKs, the MCP preview, and how agent workflows work.",
    icon: Bot,
    topics: [
      {
        id: "python-sdk",
        question: "Python SDK 怎麼用？",
        questionEn: "How do I use the Python SDK?",
        answer:
          "先設定 TWMD_API_KEY，建立 client 後呼叫 twse_daily_price、issuer_profile 等方法。詳見 /docs/sdk/python-sdk。",
        answerEn:
          "Set TWMD_API_KEY, create a client, then call methods such as twse_daily_price and issuer_profile. See /docs/sdk/python-sdk.",
      },
      {
        id: "js-sdk",
        question: "JavaScript SDK 怎麼用？",
        questionEn: "How do I use the JavaScript SDK?",
        answer:
          "建立 TWMarketDataClient 並帶入 apiKey，可用 getDataset 或 dataset 專用 helper。詳見 /docs/sdk/javascript-sdk。",
        answerEn:
          "Create a TWMarketDataClient with your apiKey, then use getDataset or the dataset-specific helpers. See /docs/sdk/javascript-sdk.",
      },
      {
        id: "what-is-mcp",
        question: "MCP 是什麼？",
        questionEn: "What is MCP?",
        answer:
          "MCP 是讓 agent 以工具方式呼叫資料服務的介面。TW Market Data 目前提供 MCP skeleton（preview）。",
        answerEn:
          "MCP is an interface that lets agents call data services as tools. TW Market Data currently ships an MCP skeleton (preview).",
      },
      {
        id: "agent-workflow",
        question: "AI agent workflow 怎麼運作？",
        questionEn: "How does an AI agent workflow work?",
        answer:
          "常見流程是先查公司主檔，再查價格與營收，最後整合為研究上下文。可參考 /docs/ai-agents/agent-workflow-examples。",
        answerEn:
          "A common flow is to look up the company profile first, then prices and revenue, and finally combine them into research context. See /docs/ai-agents/agent-workflow-examples.",
      },
      {
        id: "request-tracing",
        question: "request tracing 怎麼看？",
        questionEn: "How do I inspect request tracing?",
        answer:
          "在 SDK response meta 或 API response header 取得 requestId，再對照 usage/credits 記錄進行追查。",
        answerEn:
          "Get the requestId from the SDK response meta or the API response header, then cross-reference it against your usage/credits records.",
      },
    ],
  },
  {
    id: "account-login",
    title: "帳號與登入",
    titleEn: "Account & sign-in",
    description: "Google 登入、Email/password 與 session 常見問題。",
    descriptionEn: "Common questions about Google sign-in, email/password, and sessions.",
    icon: UserRound,
    topics: [
      {
        id: "google-login-fail",
        question: "Google 登入失敗怎麼辦？",
        questionEn: "What if Google sign-in fails?",
        answer:
          "請先確認瀏覽器 cookie 與第三方登入流程可用；若持續失敗，回報發生時間與 requestId 協助排查。",
        answerEn:
          "First confirm that browser cookies and third-party sign-in flows are enabled; if it keeps failing, report the time it occurred and the requestId so we can investigate.",
      },
      {
        id: "set-email-password",
        question: "如何設定 Email/password？",
        questionEn: "How do I set up email/password?",
        answer:
          "可使用註冊流程建立並驗證 Email，或在已存在帳號上完成驗證後設定密碼。",
        answerEn:
          "Use the registration flow to create and verify your email, or set a password after verifying an existing account.",
      },
      {
        id: "dashboard-loading",
        question: "dashboard 一直 loading 怎麼辦？",
        questionEn: "What if the dashboard keeps loading?",
        answer:
          "通常與 session 或 backend 暫時波動有關。請重新整理、重新登入，或稍後再試。若持續發生請聯繫我們。",
        answerEn:
          "This is usually related to a session or a temporary backend fluctuation. Refresh, sign in again, or try later. If it persists, contact us.",
      },
      {
        id: "session-problem",
        question: "session 常見問題有哪些？",
        questionEn: "What are common session issues?",
        answer:
          "若出現短暫未登入狀態，可能是 session 查詢失敗或網路波動。請以穩定網路重試，並保留時間點供排查。",
        answerEn:
          "A brief signed-out state can be caused by a failed session lookup or a network fluctuation. Retry on a stable connection and keep the timestamp for investigation.",
      },
    ],
  },
  {
    id: "billing-credits",
    title: "Billing / Credits",
    titleEn: "Billing / credits",
    description: "方案、credits、試算模式與 usage 對應關係。",
    descriptionEn: "Plans, credits, dry-run mode, and how usage maps to them.",
    icon: CreditCard,
    topics: [
      {
        id: "what-is-credits",
        question: "credits 是什麼？",
        questionEn: "What are credits?",
        answer:
          "credits 用於 API 請求計價。可透過訂閱方案 included credits 或單次儲值補充。",
        answerEn:
          "Credits are used to price API requests. Top them up through a subscription plan's included credits or a one-time top-up.",
      },
      {
        id: "what-is-dry-run",
        question: "dry-run 是什麼？",
        questionEn: "What is dry-run?",
        answer:
          "dry-run 代表只計算估算成本，不真正扣除 wallet。回應會顯示 X-TWMD-Dry-Run: true。",
        answerEn:
          "Dry-run only calculates the estimated cost without actually deducting from your wallet. The response shows X-TWMD-Dry-Run: true.",
      },
      {
        id: "when-deduction-enabled",
        question: "正式扣點何時啟用？",
        questionEn: "When does live deduction take effect?",
        answer:
          "正式扣點需由 production 安全旗標明確開啟，預設不啟用，避免誤扣。",
        answerEn:
          "Live deduction must be explicitly enabled by a production safety flag; it is off by default to prevent accidental charges.",
      },
      {
        id: "why-no-deduction",
        question: "為什麼目前看不到扣點？",
        questionEn: "Why don't I see any deduction yet?",
        answer:
          "若平台仍在試算模式，usage 會記錄 estimated credits，但 wallet 不會下降。",
        answerEn:
          "While the platform is still in dry-run mode, usage records estimated credits, but the wallet balance does not decrease.",
      },
      {
        id: "view-usage",
        question: "如何查看 usage？",
        questionEn: "How do I view usage?",
        answer:
          "可在 /usage 查看請求紀錄與 requestId，在 /billing/credits 查看交易與對帳資訊。",
        answerEn:
          "Check request records and requestId at /usage, and transaction and reconciliation details at /billing/credits.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    titleEn: "Security",
    description: "API key 安全與資料追蹤防護建議。",
    descriptionEn: "Recommendations for API key security and request traceability.",
    icon: ShieldCheck,
    topics: [
      {
        id: "api-key-leak",
        question: "API key 外洩怎麼辦？",
        questionEn: "What if my API key leaks?",
        answer:
          "請立即在 dashboard 撤銷該 key，並建立新的 key 替換。",
        answerEn:
          "Revoke that key in the dashboard immediately, then create and swap in a new one.",
      },
      {
        id: "revoke-api-key",
        question: "如何 revoke API key？",
        questionEn: "How do I revoke an API key?",
        answer:
          "在 API keys 表格按刪除/撤銷圖示即可。撤銷後該 key 立即失效。",
        answerEn:
          "Click the delete/revoke icon in the API keys table. The key stops working immediately after revocation.",
      },
      {
        id: "why-show-once",
        question: "為什麼 key 只顯示一次？",
        questionEn: "Why is the key shown only once?",
        answer:
          "建立當下會顯示完整值，系統只儲存 hash 與加密版本，避免明文金鑰暴露。",
        answerEn:
          "The full value is shown at creation time; the system stores only a hash and an encrypted version to avoid exposing the plaintext key.",
      },
      {
        id: "requestid-use",
        question: "requestId 有什麼用途？",
        questionEn: "What is requestId used for?",
        answer:
          "requestId 可用於問題追蹤、對帳核對、客服協助定位單筆請求。",
        answerEn:
          "requestId helps with issue tracing, reconciliation, and letting support locate a single request.",
      },
    ],
  },
  {
    id: "system-status",
    title: "系統狀態",
    titleEn: "System status",
    description: "冷啟動、延遲與問題回報指引。",
    descriptionEn: "Guidance on cold starts, latency, and reporting issues.",
    icon: Activity,
    topics: [
      {
        id: "render-cold-start",
        question: "什麼是 Render cold start？",
        questionEn: "What is a Render cold start?",
        answer:
          "低流量時後端服務可能進入冷狀態，首次請求會比較慢，後續暖機請求通常明顯加速。",
        answerEn:
          "During low traffic the backend services can go cold, so the first request is slower; subsequent warm requests are usually noticeably faster.",
      },
      {
        id: "first-request-slow",
        question: "為什麼第一次 request 比較慢？",
        questionEn: "Why is the first request slower?",
        answer:
          "常見原因是 backend cold start、DB pool 喚醒或上游快取尚未建立。",
        answerEn:
          "Common causes are a backend cold start, a DB pool waking up, or an upstream cache that hasn't been built yet.",
      },
      {
        id: "how-to-report",
        question: "如何回報問題？",
        questionEn: "How do I report an issue?",
        answer:
          "請附上發生時間、端點、HTTP 狀態碼與 requestId，寄信至 avenra.platform@gmail.com。",
        answerEn:
          "Include the time it occurred, the endpoint, the HTTP status code, and the requestId, and email avenra.platform@gmail.com.",
      },
    ],
  },
];

// Project the FAQ catalog into a single locale (mirror mega-menu-links getProductMegaMenuColumns).
export function getHelpCategories(locale: AppLocale): HelpCategory[] {
  const en = locale === "en";
  return helpCategoriesSource.map((category) => ({
    id: category.id,
    title: en ? category.titleEn : category.title,
    description: en ? category.descriptionEn : category.description,
    icon: category.icon,
    topics: category.topics.map((topic) => ({
      id: topic.id,
      question: en ? topic.questionEn : topic.question,
      answer: en ? topic.answerEn : topic.answer,
      tags: topic.tags,
    })),
  }));
}

export type HelpSearchResult = {
  categoryId: string;
  categoryTitle: string;
  topicId: string;
  question: string;
};

export function searchHelpTopics(keyword: string, locale: AppLocale): HelpSearchResult[] {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];

  const results: HelpSearchResult[] = [];

  for (const category of getHelpCategories(locale)) {
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
  return helpCategoriesSource.reduce((sum, category) => sum + category.topics.length, 0);
}

// Quick-link labels mirror the category titles; hrefs are anchors and stay locale-agnostic.
type HelpQuickLinkSource = { label: string; labelEn: string; href: string };

const helpCenterQuickLinksSource: HelpQuickLinkSource[] = [
  { label: "API 與資料", labelEn: "API & data", href: "#api-data" },
  { label: "SDK / AI Agent", labelEn: "SDK / AI agent", href: "#sdk-agent" },
  { label: "帳號與登入", labelEn: "Account & sign-in", href: "#account-login" },
  { label: "Billing / Credits", labelEn: "Billing / credits", href: "#billing-credits" },
  { label: "Security", labelEn: "Security", href: "#security" },
  { label: "系統狀態", labelEn: "System status", href: "#system-status" },
];

export type HelpCenterQuickLink = { label: string; href: string };

export function getHelpCenterQuickLinks(locale: AppLocale): HelpCenterQuickLink[] {
  const en = locale === "en";
  return helpCenterQuickLinksSource.map((item) => ({
    label: en ? item.labelEn : item.label,
    href: item.href,
  }));
}

type HelpStatusItemSource = { text: string; textEn: string };

const helpCenterStatusItemsSource: HelpStatusItemSource[] = [
  {
    text: "API key 與資料存取以 requestId 可追蹤為主",
    textEn: "API key and data access are traceable primarily via requestId",
  },
  {
    text: "冷啟動時第一筆請求可能較慢，後續通常恢復",
    textEn: "On a cold start the first request may be slower; it usually recovers afterward",
  },
  {
    text: "如遇 502/504，請附上 requestId 聯繫支援",
    textEn: "For 502/504 errors, include the requestId and contact support",
  },
];

export function getHelpCenterStatusItems(locale: AppLocale): string[] {
  const en = locale === "en";
  return helpCenterStatusItemsSource.map((item) => (en ? item.textEn : item.text));
}

type HelpFooterCtaSource = { label: string; labelEn: string; href: string };

const helpCenterFooterCtasSource: HelpFooterCtaSource[] = [
  { label: "查看 API 文件", labelEn: "View API docs", href: "/docs" },
  { label: "前往 SDK 文件", labelEn: "Go to SDK docs", href: "/docs/sdk/python-sdk" },
  { label: "聯繫我們", labelEn: "Contact us", href: "mailto:avenra.platform@gmail.com" },
];

export type HelpCenterFooterCta = { label: string; href: string };

export function getHelpCenterFooterCtas(locale: AppLocale): HelpCenterFooterCta[] {
  const en = locale === "en";
  return helpCenterFooterCtasSource.map((cta) => ({
    label: en ? cta.labelEn : cta.label,
    href: cta.href,
  }));
}

type HelpEntryCardSource = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  href: string;
  icon: LucideIcon;
};

const helpCenterEntryCardsSource: HelpEntryCardSource[] = [
  {
    id: "faq",
    title: "常見問題",
    titleEn: "FAQ",
    description: "快速查看 API、登入、billing、security 常見問題。",
    descriptionEn: "Quick answers on API, sign-in, billing, and security.",
    href: "/help-center#api-data",
    icon: CircleHelp,
  },
  {
    id: "docs",
    title: "API 文件",
    titleEn: "API docs",
    description: "查看 datasets、SDK 與 request/response 範例。",
    descriptionEn: "Browse datasets, SDKs, and request/response examples.",
    href: "/docs",
    icon: Braces,
  },
  {
    id: "status",
    title: "系統狀態指引",
    titleEn: "System-status guide",
    description: "了解冷啟動、timeout 與回報流程。",
    descriptionEn: "Understand cold starts, timeouts, and the reporting flow.",
    href: "#system-status",
    icon: Activity,
  },
  {
    id: "security",
    title: "金鑰安全",
    titleEn: "Key security",
    description: "API key 建立、複製、撤銷與外洩處置。",
    descriptionEn: "Creating, copying, revoking, and handling leaked API keys.",
    href: "#security",
    icon: KeyRound,
  },
];

export type HelpCenterEntryCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function getHelpCenterEntryCards(locale: AppLocale): HelpCenterEntryCard[] {
  const en = locale === "en";
  return helpCenterEntryCardsSource.map((card) => ({
    id: card.id,
    title: en ? card.titleEn : card.title,
    description: en ? card.descriptionEn : card.description,
    href: card.href,
    icon: card.icon,
  }));
}

// Page meta. The zh `title` / `subtitle` remain the source used by the (untouched) route `metadata`;
// the selectors project the on-page display copy.
export const helpCenterPageMeta = {
  title: "幫助中心",
  titleEn: "Help center",
  subtitle: "自助查找 API、SDK、帳務與系統狀態的常見問題。",
  subtitleEn: "Self-serve answers for API, SDK, billing, and system-status questions.",
};

export const faqPageMeta = {
  title: "常見問題",
  titleEn: "FAQ",
  subtitle: "快速找到最常被詢問的問題與排查建議。",
  subtitleEn: "Quickly find the most common questions and troubleshooting tips.",
};

export type HelpPageMeta = { title: string; subtitle: string };

export function getHelpCenterPageMeta(locale: AppLocale): HelpPageMeta {
  const en = locale === "en";
  return {
    title: en ? helpCenterPageMeta.titleEn : helpCenterPageMeta.title,
    subtitle: en ? helpCenterPageMeta.subtitleEn : helpCenterPageMeta.subtitle,
  };
}

export function getFaqPageMeta(locale: AppLocale): HelpPageMeta {
  const en = locale === "en";
  return {
    title: en ? faqPageMeta.titleEn : faqPageMeta.title,
    subtitle: en ? faqPageMeta.subtitleEn : faqPageMeta.subtitle,
  };
}
