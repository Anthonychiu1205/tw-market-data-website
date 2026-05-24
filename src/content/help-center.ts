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
          "請先登入 dashboard，進入 API 金鑰區塊建立新金鑰，建立後會顯示完整金鑰一次，請立即複製並存放到安全的密鑰管理工具。建議依環境（dev/staging/prod）分開建立，避免共用同一把金鑰造成排查困難。若發現外洩風險，請先撤銷舊金鑰，再更新服務設定為新金鑰。",
      },
      {
        id: "how-to-call-api",
        question: "如何呼叫 API？",
        answer:
          "使用 HTTPS GET 呼叫 `/v2/datasets/*` 端點，並在 request header 帶 `X-API-Key`。建議先照 `/docs/quick-start` 的範例確認最小可行請求，再逐步加入 `symbol`、`start_date`、`end_date`、`limit` 等參數。若收到 401，先檢查金鑰拼寫、空白字元與是否誤用撤銷過的 key。",
      },
      {
        id: "query-price",
        question: "如何查詢台股價格？",
        answer:
          "可從 `/v2/datasets/twse-daily-price` 或 `/v2/datasets/tpex-daily-price` 開始，先用小範圍參數測試（例如 `symbol` + `limit`），確認欄位後再擴大日期區間。若要做研究流程，建議同時保留 `requestId` 與查詢參數，方便日後重現結果。若資料時間範圍較大，建議分批查詢，避免單次請求過重。",
      },
      {
        id: "request-id-meaning",
        question: "requestId 是什麼？",
        answer:
          "`requestId` 是每次 API 呼叫的追蹤識別，通常會出現在 `X-Request-Id` header 或 response meta。當你遇到資料異常、timeout、或對帳問題時，請先記錄 requestId，再提供給支援團隊。這能顯著縮短定位時間，因為可以直接對應後端記錄與 usage 流程。",
      },
      {
        id: "credits-calc",
        question: "credits 怎麼計算？",
        answer:
          "不同 dataset endpoint 可能對應不同 credits 成本，實際成本可從回應 header（例如 `X-TWMD-Credits-Cost`）與 usage 畫面交叉確認。若目前環境仍在 dry-run/試算模式，系統會顯示估算成本，但不一定立即扣除 wallet。建議以 dashboard 與 billing 顯示為準，並把 requestId 一起保存做對帳。",
      },
      {
        id: "why-502-504",
        question: "為什麼會出現 502 / 504？",
        answer:
          "502/504 多半是上游服務暫時不可用、timeout、或冷啟動延遲導致。建議先記錄 endpoint、參數、發生時間與 requestId，然後做有限次重試（含退避）。若同一查詢持續失敗，請把上述資訊提供給支援團隊，能更快判斷是否為上游波動或特定資料路徑問題。",
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
          "先設定 `TWMD_API_KEY`，再建立 client 並呼叫 dataset 方法，例如 `twse_daily_price` 或 `issuer_profile`。建議先用少量參數驗證回應格式，再把查詢整合進 notebook 或 pipeline。若要正式上線，請同時實作錯誤處理與 requestId 記錄，詳細範例見 `/docs/sdk/python-sdk`。",
      },
      {
        id: "js-sdk",
        question: "JavaScript SDK 怎麼用？",
        answer:
          "建立 `TWMarketDataClient` 並注入 apiKey 後，可用 `getDataset` 或專用 helper 呼叫資料。建議在 server-side 或受保護環境使用 SDK，不要把金鑰放在公開前端。若你要做 SSR 或 API route 串接，請將 key 放在安全環境變數並加上錯誤重試策略。",
      },
      {
        id: "what-is-mcp",
        question: "MCP 是什麼？",
        answer:
          "MCP 是讓 AI agent 以工具協議存取資料服務的介面層。TW Market Data 目前是 preview/skeleton 階段，目的在驗證工具鏈與 contract，而非宣稱 production 完整可用。建議先以 OpenAPI 與現有 docs 為主要依據，MCP 相關流程再按版本狀態逐步導入。",
      },
      {
        id: "agent-workflow",
        question: "AI agent workflow 怎麼運作？",
        answer:
          "常見流程是：先查公司主檔（識別與分類），再查價格與基本面，再把結果整理成可追溯的研究上下文。每一步請保留 query 參數、requestId、以及資料時間欄位，避免 agent 產生不可重現結論。可先參考 `/docs/ai-agents/agent-workflow-examples` 的流程模板，再依你的場景擴充。",
      },
      {
        id: "request-tracing",
        question: "request tracing 怎麼看？",
        answer:
          "在 SDK response meta 或 API header 取得 requestId 後，可到 `/usage` 與 billing/credits 交叉比對同一筆請求。若你有多個服務或 worker，建議把 requestId 一路寫入應用日誌，才能快速定位問題發生在哪個節點。遇到不一致時，請附上 requestId 與時間範圍給支援。",
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
          "先確認瀏覽器允許必要 cookie、沒有擋掉第三方登入流程，並使用同一個登入視窗完成授權。若失敗持續，請嘗試無痕模式或更換瀏覽器以排除插件干擾。仍無法登入時，請提供發生時間與畫面錯誤訊息給支援團隊。",
      },
      {
        id: "set-email-password",
        question: "如何設定 Email/password？",
        answer:
          "可透過註冊流程建立 Email/password 帳號，並完成信箱驗證後啟用登入。若是既有帳號補設密碼，請依畫面引導完成驗證與重設流程。建議啟用後立即測試登入與密碼重設流程，確保緊急情況可快速取回帳號。",
      },
      {
        id: "dashboard-loading",
        question: "dashboard 一直 loading 怎麼辦？",
        answer:
          "先重新整理並重新登入一次，確認 session 是否已更新；同時檢查網路是否有代理或防火牆影響。若僅特定頁面卡住，請記錄路徑與時間點，方便比對伺服器日誌。持續發生時，請附上瀏覽器版本與錯誤訊息回報。",
      },
      {
        id: "session-problem",
        question: "session 常見問題有哪些？",
        answer:
          "常見情況包含 session 過期、網路抖動導致 session 查詢失敗、或多分頁狀態不同步。建議在關鍵操作前先確認登入狀態，並避免過久閒置後直接提交敏感操作。若你在程式端整合，請加上 401/403 的重新登入或刷新機制。",
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
          "credits 是 API 請求計價單位，會依 endpoint 與查詢類型計算成本。你可以透過方案 included credits 或額外儲值來支應用量。建議固定檢查 usage 與 credits 變化，避免在高峰時段突然觸及限制。",
      },
      {
        id: "what-is-dry-run",
        question: "dry-run 是什麼？",
        answer:
          "dry-run 代表系統只計算估算成本與 entitlement，不會真正扣點。回應通常會標示 `X-TWMD-Dry-Run: true`，方便你先驗證成本與流程。若要切換成實扣模式，請以平台設定與正式流程為準。",
      },
      {
        id: "when-deduction-enabled",
        question: "正式扣點何時啟用？",
        answer:
          "正式扣點需要在 production 端明確啟用對應安全旗標與流程，預設通常不會直接開啟。這個設計是為了避免誤扣與風險擴散。建議先在試算模式確認流量模型，再與團隊確認切換時機。",
      },
      {
        id: "why-no-deduction",
        question: "為什麼目前看不到扣點？",
        answer:
          "若平台目前是試算模式，usage 會記錄 estimated credits，但 wallet 餘額不會下降。也可能是請求未達扣點條件或流程仍在回傳 dry-run。請同時檢查 response header、usage 明細與 billing 頁面狀態。",
      },
      {
        id: "view-usage",
        question: "如何查看 usage？",
        answer:
          "你可以在 `/usage` 查看每筆請求紀錄、狀態碼與 requestId，在 `/billing/credits` 查看 credits 交易與對帳資訊。建議把 requestId 作為跨系統追蹤主鍵，方便快速對照 API 呼叫與帳務變化。若有差異，請整理時間範圍與樣本 requestId 後回報。",
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
          "第一步先撤銷疑似外洩金鑰，阻止後續未授權請求；第二步建立新金鑰並更新所有部署環境。建議同步檢查版本庫、CI 日誌與前端 bundle 是否曾曝光金鑰。完成後請保留事件時間軸，便於後續稽核與風險追蹤。",
      },
      {
        id: "revoke-api-key",
        question: "如何 revoke API key？",
        answer:
          "進入 dashboard 的 API keys 清單，找到目標金鑰後執行撤銷或刪除操作。撤銷後舊 key 應立即失效，請盡快把新 key 更新到服務端環境。建議在更新完成後做一次最小 API 請求驗證，確保服務不中斷。",
      },
      {
        id: "why-show-once",
        question: "為什麼 key 只顯示一次？",
        answer:
          "金鑰只顯示一次是安全設計，避免日後在介面被重複讀取或截圖外流。系統通常只保存 hash 或加密版本，不會長期保存可直接複製的明文。請在建立當下安全保存，若遺失則以重建取代查回。",
      },
      {
        id: "requestid-use",
        question: "requestId 有什麼用途？",
        answer:
          "requestId 是支援排查與稽核最重要的上下文之一，可把一筆請求串到 API 回應、usage 明細與後端日志。當你回報問題時，附上 requestId 能快速縮小範圍。建議把 requestId 納入你的系統 log 與告警內容。",
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
          "在低流量時段，後端服務可能進入冷狀態，第一筆請求需要額外喚醒時間。這通常會反映在首次延遲上升，但後續暖機請求會恢復。若你的流程對延遲敏感，建議在尖峰前先做健康檢查或暖機請求。",
      },
      {
        id: "first-request-slow",
        question: "為什麼第一次 request 比較慢？",
        answer:
          "常見原因包含服務冷啟動、資料庫連線池喚醒、上游快取未建立。可先比較第一筆與後續請求的延遲差異，判斷是否屬於暖機現象。若連續多筆都偏慢，請附上 requestId 與時間範圍進一步排查。",
      },
      {
        id: "how-to-report",
        question: "如何回報問題？",
        answer:
          "請提供發生時間（含時區）、endpoint、HTTP 狀態碼、requestId、以及可重現參數範圍，再寄到 `avenra.platform@gmail.com`。若是間歇性問題，建議附上成功與失敗樣本各一筆，便於比較差異。資訊越完整，排查速度越快。",
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
  subtitle: "TW Market Data API 使用、API key、credits、錯誤排查、SDK 與 AI agent 常見問題。",
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
    href: "/help#api-data",
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
