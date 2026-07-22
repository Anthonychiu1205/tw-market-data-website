// DOCS-01 bilingual "article" pages — the Phase-1 overview pages + task guides. Same honesty rules as
// the dataset pages: real numbers only (grade counts are computed from the catalog, coverage totals
// come from the coverage-facts SSOT), and honest limitations are listed rather than hidden.

import { DOCS_DATASET_CATALOG } from "@/src/content/docs/dataset-catalog";
import { DATASET_GRADE_LABELS, type DatasetGrade } from "@/src/lib/docs/dataset-grade";
import { COVERAGE_FACTS_SNAPSHOT_DATE, coverageFacts } from "@/src/content/coverage-facts";
import type { Bi } from "@/src/content/docs/dataset-pages";
import type { CodeBlockLanguage } from "@/src/components/docs/code-block";

export type ArticleSection = {
  id: string;
  heading: Bi;
  paragraphs?: Bi[];
  bullets?: Bi[];
  code?: { language: CodeBlockLanguage; code: string };
};

export type ArticlePage = {
  slug: string; // path under /docs, e.g. "data-grades" or "guides/financial-statements"
  pageLabel: Bi; // eyebrow
  title: Bi;
  subtitle: Bi;
  sections: ArticleSection[];
};

const gradeCount = (g: DatasetGrade) => DOCS_DATASET_CATALOG.filter((d) => d.grade === g).length;
const total = DOCS_DATASET_CATALOG.length;
const fmt = (n: number) => n.toLocaleString("en-US");
const twse = coverageFacts.twseDailyPrice;
const tpex = coverageFacts.tpexDailyPrice;
const rev = coverageFacts.monthlyRevenue;

function gradeBullet(g: DatasetGrade, meaningEn: string, meaningZh: string): Bi {
  const label = DATASET_GRADE_LABELS[g];
  return {
    en: `${label.en} (${gradeCount(g)}) — ${meaningEn}`,
    zh: `${label.zh}（${gradeCount(g)}）— ${meaningZh}`,
  };
}

const ARTICLES: ArticlePage[] = [
  // ── Overview 1: Data grades (the 4-tier system, live counts from the catalog) ──
  {
    slug: "data-grades",
    pageLabel: { en: "Overview", zh: "總覽" },
    title: { en: "Data grades", zh: "資料分級" },
    subtitle: {
      en: "Every dataset carries one of four grades, derived from its real availability and source — not hand-set.",
      zh: "每個資料集都帶四級之一,由其真實可用狀態與來源動態推導,而非手動設定。",
    },
    sections: [
      {
        id: "the-four-grades",
        heading: { en: "The four grades", zh: "四個分級" },
        paragraphs: [
          {
            en: `Across the ${total} sellable datasets, each is graded so you can tell at a glance how finished and how directly-sourced it is.`,
            zh: `在 ${total} 個可用資料集中,每個都經分級,讓你一眼看出它的完成度與來源直接程度。`,
          },
        ],
        bullets: [
          gradeBullet("verified", "official source, available, coverage confirmed.", "官方來源、現值可用、涵蓋已確認。"),
          gradeBullet("derived", "computed from official data (e.g. ratios, indicators).", "由官方資料計算(如比率、指標)。"),
          gradeBullet("reference", "lookup / master data with no verifiable time series.", "查表／主檔資料,無可驗證時間序列。"),
          gradeBullet("building", "roadmap — shown for transparency, not yet callable.", "規劃中——為透明而顯示,尚不可呼叫。"),
        ],
      },
      {
        id: "how-derived",
        heading: { en: "How a grade is derived", zh: "分級如何推導" },
        paragraphs: [
          {
            en: "A grade is computed from the dataset's availability status and its canonical source role. It is not frozen in copy: when a dataset's real status changes, its grade — and its colour in the sidebar — changes with it.",
            zh: "分級由資料集的可用狀態與正規來源角色計算而得,不寫死於文案:當資料集的真實狀態改變,其分級——以及側欄的顏色——會隨之改變。",
          },
        ],
      },
      {
        id: "verified-vs-reconciliation",
        heading: { en: "Verified grade vs value-level reconciliation", zh: "已驗證分級 vs 逐值對帳" },
        paragraphs: [
          {
            en: "\"Verified\" here means official + available + coverage-confirmed. It is not the stronger per-value / per-symbol reconciliation claim — that verification surface is still being built and is intentionally not shown until it produces real verified dates.",
            zh: "此處的「已驗證」意指官方＋可用＋涵蓋已確認,並非更強的逐值／逐標的對帳主張——該對帳能力仍在建置中,在產出真實驗證日期前刻意不顯示。",
          },
        ],
      },
    ],
  },

  // ── Overview 2: Source policy + honest limitations ──
  {
    slug: "source-policy",
    pageLabel: { en: "Overview", zh: "總覽" },
    title: { en: "Source policy", zh: "來源政策" },
    subtitle: {
      en: "Official-first, with source roles separated and lineage kept on every row.",
      zh: "官方優先,來源角色分離,每一列保留血緣。",
    },
    sections: [
      {
        id: "policy",
        heading: { en: "The policy", zh: "政策" },
        bullets: [
          { en: "TWSE / TPEx / MOPS / TAIFEX first — official / public-first.", zh: "TWSE／TPEx／MOPS／TAIFEX 優先——官方／公開優先。" },
          { en: "Canonical, fallback and helper source roles are kept separate, never silently blended.", zh: "正規、備援與輔助來源角色分離,絕不無聲混用。" },
          { en: "Lineage, freshness, completeness and auditability are treated as core capabilities.", zh: "血緣、新鮮度、完整性與可稽核性視為核心能力。" },
        ],
      },
      {
        id: "limitations",
        heading: { en: "What we do NOT claim", zh: "我方不主張的範圍" },
        paragraphs: [
          {
            en: "Being honest about the edges is part of the product. Current boundaries:",
            zh: "誠實面對邊界是產品的一部分。目前的界線:",
          },
        ],
        bullets: [
          { en: "Value-level reconciliation dates are not published yet — the verification surface is still being built.", zh: "逐值對帳日期尚未發佈——驗證能力仍在建置中。" },
          { en: "Some datasets are private-beta / preview with partial coverage; they are graded Reference, not Verified.", zh: "部分資料集為 private-beta／preview、涵蓋不完整;它們被分為「參考」而非「已驗證」。" },
          { en: "Master / reference datasets are active snapshots and are not survivorship-safe for point-in-time backtests.", zh: "主檔／參考資料集為現用快照,對 point-in-time 回測不具倖存者偏誤安全性。" },
          { en: "We do not blend unofficial third-party sources into an official-labelled field.", zh: "我方不會把非官方第三方來源混入標示為官方的欄位。" },
        ],
      },
    ],
  },

  // ── Overview 3: Coverage at a glance (real numbers + honest limitations) ──
  {
    slug: "coverage-overview",
    pageLabel: { en: "Overview", zh: "總覽" },
    title: { en: "Coverage at a glance", zh: "市場覆蓋一覽" },
    subtitle: {
      en: "Real coverage numbers from a measured database snapshot — with the limits stated plainly.",
      zh: "來自量測資料庫快照的真實涵蓋數字——並清楚列出限制。",
    },
    sections: [
      {
        id: "numbers",
        heading: { en: "Measured coverage", zh: "量測涵蓋" },
        paragraphs: [
          {
            en: `The figures below are a database snapshot measured on ${COVERAGE_FACTS_SNAPSHOT_DATE}. The live feeds advance continuously, so the latest available date is newer than the snapshot.`,
            zh: `以下數字為 ${COVERAGE_FACTS_SNAPSHOT_DATE} 量測的資料庫快照。即時資料持續推進,故實際最新日期會新於快照。`,
          },
        ],
        bullets: [
          { en: `TWSE daily prices — ${fmt(twse.rows)} rows, ${fmt(twse.stocks)} stocks, from ${twse.earliestDate}.`, zh: `上市日線價格——${fmt(twse.rows)} 列、${fmt(twse.stocks)} 檔,自 ${twse.earliestDate} 起。` },
          { en: `TPEx daily prices — ${fmt(tpex.rows)} rows, ${fmt(tpex.stocks)} stocks, from ${tpex.earliestDate}.`, zh: `上櫃日線價格——${fmt(tpex.rows)} 列、${fmt(tpex.stocks)} 檔,自 ${tpex.earliestDate} 起。` },
          { en: `Monthly revenue — ${fmt(rev.rows)} rows, ${fmt(rev.stocks)} companies, ${rev.earliestPeriod} → ${rev.latestPeriod}.`, zh: `月營收——${fmt(rev.rows)} 列、${fmt(rev.stocks)} 家公司,${rev.earliestPeriod} → ${rev.latestPeriod}。` },
        ],
      },
      {
        id: "limitations",
        heading: { en: "Limitations", zh: "限制" },
        bullets: [
          { en: "Full-table row counts for most datasets are not yet exposed via a live endpoint; per-dataset pages mark those as TODO rather than estimate.", zh: "多數資料集的全表列數尚未經即時端點揭露;各資料集頁面標記為 TODO 而非估算。" },
          { en: "Some datasets require an entitled plan key; their live numbers are shown only where the doc build could measure them.", zh: "部分資料集需具權限的方案金鑰;其即時數字僅在文件建置能量測時顯示。" },
        ],
      },
    ],
  },

  // ── Guide: How to get the 3 financial statements ──
  {
    slug: "guides/financial-statements",
    pageLabel: { en: "Guide", zh: "指南" },
    title: { en: "How to get the 3 financial statements", zh: "如何取得財報三表" },
    subtitle: {
      en: "Pull income statement, balance sheet and cash-flow for a company, then narrow by period.",
      zh: "抓取一家公司的損益表、資產負債表與現金流量表,再依期間篩選。",
    },
    sections: [
      {
        id: "prerequisites",
        heading: { en: "Prerequisites", zh: "前置需求" },
        bullets: [
          { en: "A dashboard-issued API key (sk_live_…).", zh: "儀表板核發的 API 金鑰（sk_live_…）。" },
          { en: "Python with the requests library.", zh: "Python 與 requests 套件。" },
          { en: "The three statement datasets are on the Pro plan.", zh: "三張報表資料集屬 Pro 方案。" },
        ],
      },
      {
        id: "step-1-auth",
        heading: { en: "Step 1 — Authenticate", zh: "步驟 1 — 認證" },
        paragraphs: [{ en: "Send your key in the X-API-Key header on every request.", zh: "每次請求都在 X-API-Key 標頭帶上你的金鑰。" }],
        code: {
          language: "python",
          code: `import requests

BASE = "https://api.twmarketdata.com"
HEADERS = {"X-API-Key": "sk_live_..."}`,
        },
      },
      {
        id: "step-2-fetch",
        heading: { en: "Step 2 — Fetch the three statements", zh: "步驟 2 — 抓取三張報表" },
        code: {
          language: "python",
          code: `for slug in ["income-statement", "balance-sheet", "cash-flow-statement"]:
    resp = requests.get(
        f"{BASE}/v2/datasets/{slug}",
        params={"symbol": "2330"},
        headers=HEADERS,
    )
    resp.raise_for_status()
    print(slug, "->", len(resp.json()["data"]), "rows")`,
        },
      },
      {
        id: "step-3-filter",
        heading: { en: "Step 3 — Narrow by period", zh: "步驟 3 — 依期間篩選" },
        paragraphs: [{ en: "Add start_date / end_date to limit the range.", zh: "加上 start_date／end_date 限制範圍。" }],
        code: {
          language: "python",
          code: `resp = requests.get(
    f"{BASE}/v2/datasets/income-statement",
    params={"symbol": "2330", "start_date": "2024-01-01", "end_date": "2026-06-30"},
    headers=HEADERS,
)
print(resp.json()["data"])`,
        },
      },
      {
        id: "next-steps",
        heading: { en: "Next steps", zh: "下一步" },
        bullets: [
          { en: "See the monthly-revenue dataset for the freshest top-line growth signal.", zh: "查看 monthly-revenue 資料集取得最即時的營收成長訊號。" },
          { en: "For backtests, pass as_of so you only see figures public at that date.", zh: "回測時帶 as_of,只會看到當日已公開的數字。" },
        ],
      },
    ],
  },

  // ── Guide: How to read institutional flows (三大法人籌碼) ──
  // Response fields / values below are a REAL capture (2330, 2026-07-17) from the live API — the field
  // names are the actual response keys (foreign_net_buy_sell, not the shorthand foreign_net).
  {
    slug: "guides/institutional-flows",
    pageLabel: { en: "Guide", zh: "指南" },
    title: { en: "How to read institutional flows", zh: "如何查三大法人籌碼" },
    subtitle: {
      en: "Get one stock's daily foreign / investment-trust / dealer net buy-sell, then count a buying streak.",
      zh: "查一檔股票每日的外資／投信／自營淨買賣超,再算連續買超天數。",
    },
    sections: [
      {
        id: "goal",
        heading: { en: "Goal", zh: "目標" },
        paragraphs: [
          {
            en: "Pull the daily institutional flow for one stock — how many shares foreign investors, investment trusts and dealers each net-bought or net-sold. The source is the official TWSE T86 report; it is on the Starter plan.",
            zh: "抓一檔股票每日的三大法人籌碼——外資、投信、自營各淨買或淨賣多少。來源為官方 TWSE T86 報表,屬 Starter 方案。",
          },
        ],
      },
      {
        id: "step-1-key",
        heading: { en: "Step 1 — Get a key", zh: "步驟 1 — 取得金鑰" },
        paragraphs: [
          { en: "Issue an API key in the dashboard and send it in the X-API-Key header on every request.", zh: "在儀表板核發 API 金鑰,每次請求都在 X-API-Key 標頭帶上。" },
        ],
      },
      {
        id: "step-2-request",
        heading: { en: "Step 2 — Request one stock's flow", zh: "步驟 2 — 請求單檔籌碼" },
        paragraphs: [
          { en: "Filter by symbol and a date range. This is a real request for TSMC (2330):", zh: "以 symbol 與日期範圍篩選。以下是台積電（2330）的真實請求:" },
        ],
        code: {
          language: "bash",
          code: `curl -H "X-API-Key: sk_live_..." \\
  "https://api.twmarketdata.com/v2/datasets/institutional-flow?symbol=2330&start_date=2026-07-14&end_date=2026-07-18"`,
        },
      },
      {
        id: "step-3-response",
        heading: { en: "Step 3 — Read the response", zh: "步驟 3 — 讀回應" },
        paragraphs: [
          { en: "A real 200 response (one row shown, 2330 on 2026-07-17). The envelope is { dataset, count, rows }:", zh: "真實 200 回應（顯示一列,2330 於 2026-07-17）。信封為 { dataset, count, rows }:" },
        ],
        code: {
          language: "json",
          code: `{
  "dataset": "institutional_flow",
  "count": 4,
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-07-17",
      "foreign_net_buy_sell": -44183964.0,
      "investment_trust_net_buy_sell": 1488520.0,
      "dealer_net_buy_sell": 2759348.0,
      "total_institutional_net_buy_sell": -39936096.0,
      "source_role": "official_twse_t86",
      "lineage": { "endpoint_name": "T86", "source_authority": "TWSE T86", "payload_date": "20260717" }
    }
  ]
}`,
        },
      },
      {
        id: "fields",
        heading: { en: "The fields you want", zh: "你要看的欄位" },
        bullets: [
          { en: "foreign_net_buy_sell — foreign investors' net buy/sell (negative = net sell). On 2026-07-17 this was -44,183,964.", zh: "foreign_net_buy_sell — 外資淨買賣（負值＝賣超）。2026-07-17 為 -44,183,964。" },
          { en: "investment_trust_net_buy_sell — investment trusts' net (here +1,488,520, a net buy).", zh: "investment_trust_net_buy_sell — 投信淨買賣（此處 +1,488,520,為買超）。" },
          { en: "dealer_net_buy_sell — dealers' net (here +2,759,348).", zh: "dealer_net_buy_sell — 自營商淨買賣（此處 +2,759,348）。" },
          { en: "total_institutional_net_buy_sell — the three summed (-39,936,096). source_role + lineage trace every row back to the TWSE T86 report.", zh: "total_institutional_net_buy_sell — 三者合計（-39,936,096）。source_role 與 lineage 讓每列可回溯官方 TWSE T86 報表。" },
        ],
      },
      {
        id: "use-case",
        heading: { en: "Use it — a foreign buying streak", zh: "用途 — 外資連續買超天數" },
        paragraphs: [
          { en: "Sort rows by date and count consecutive days where foreign_net_buy_sell > 0. A break resets the count.", zh: "把 rows 依 date 排序,數 foreign_net_buy_sell > 0 的連續天數;中斷即歸零。" },
        ],
        code: {
          language: "python",
          code: `import requests

rows = requests.get(
    "https://api.twmarketdata.com/v2/datasets/institutional-flow",
    params={"symbol": "2330", "start_date": "2026-06-01", "end_date": "2026-07-18"},
    headers={"X-API-Key": "sk_live_..."},
).json()["rows"]

streak = 0
for r in sorted(rows, key=lambda x: x["date"]):
    streak = streak + 1 if r["foreign_net_buy_sell"] > 0 else 0
print("current foreign buying streak:", streak, "days")`,
        },
      },
    ],
  },

  // ── Guide: How to check market status (大盤狀態) ──
  // market-index is a REAL capture (TAIEX, 2026-07-17). market-breadth returns empty for the windows
  // tried against the live API, so it is honestly marked TODO rather than shown with a fabricated body.
  {
    slug: "guides/market-status",
    pageLabel: { en: "Guide", zh: "指南" },
    title: { en: "How to check market status", zh: "如何看市場狀態" },
    subtitle: {
      en: "Read the day's benchmark index level and change from the official TWSE index feed.",
      zh: "從官方 TWSE 指數資料讀當日大盤點位與漲跌。",
    },
    sections: [
      {
        id: "goal",
        heading: { en: "Goal", zh: "目標" },
        paragraphs: [
          { en: "See where the market closed today: the TAIEX level and its daily change, from the official TWSE index feed.", zh: "看今天大盤收在哪:加權指數（TAIEX）點位與當日漲跌,來自官方 TWSE 指數資料。" },
        ],
      },
      {
        id: "step-1-index",
        heading: { en: "Step 1 — Fetch the benchmark index", zh: "步驟 1 — 取大盤指數" },
        paragraphs: [
          { en: "Request market-index filtered to the TAIEX. A real request:", zh: "請求 market-index 並篩選 TAIEX。真實請求:" },
        ],
        code: {
          language: "bash",
          code: `curl -H "X-API-Key: sk_live_..." \\
  "https://api.twmarketdata.com/v2/datasets/market-index?symbol=TAIEX&start_date=2026-07-14&end_date=2026-07-18"`,
        },
      },
      {
        id: "step-2-response",
        heading: { en: "Step 2 — Read the level and change", zh: "步驟 2 — 讀點位與漲跌" },
        paragraphs: [
          { en: "A real 200 response (one item, TAIEX on 2026-07-17). Note this dataset's envelope is { dataset_id, row_count, items } and the fields are nested (the Chinese index name is omitted here to keep the sample ASCII — index_code identifies it):", zh: "真實 200 回應（一筆,TAIEX 於 2026-07-17）。注意此資料集信封為 { dataset_id, row_count, items },欄位為巢狀（此處省略中文指數名以保持範例純 ASCII,index_code 即可識別）:" },
        ],
        code: {
          language: "json",
          code: `{
  "dataset_id": "market_index",
  "row_count": 4,
  "items": [
    {
      "index_identity": { "index_code": "TWSE_TAIEX", "index_type": "price" },
      "market_identity": { "as_of_date": "2026-07-17", "source_role": "official_twse_mi_index" },
      "index_level": { "value": 42671.27 },
      "daily_change": { "points": -2953.71, "return_pct": -6.47 }
    }
  ]
}`,
        },
        bullets: [
          { en: "index_level.value — the index level (42,671.27).", zh: "index_level.value — 指數點位（42,671.27）。" },
          { en: "daily_change.points / daily_change.return_pct — the day's move (-2,953.71 points, -6.47%).", zh: "daily_change.points／daily_change.return_pct — 當日漲跌（-2,953.71 點,-6.47%）。" },
          { en: "index_identity.index_code is TWSE_TAIEX (the response also carries the Chinese index_name — see the zh page).", zh: "index_identity.index_code 為 TWSE_TAIEX（回應另含中文 index_name「發行量加權股價指數」）。" },
        ],
      },
      {
        id: "breadth-todo",
        heading: { en: "Advancers / decliners (breadth)", zh: "漲跌家數（市場廣度）" },
        paragraphs: [
          { en: "TODO — the market-breadth endpoint requires a market filter and returned no rows for the windows tested against the live API, so a real example is not shown here yet rather than a fabricated one. It will be filled once the dataset is re-verified.", zh: "TODO — market-breadth 端點需要 market 過濾,且對實測窗口回空,故此處先不放範例（不編造),待資料集復驗後補真回應。" },
        ],
      },
    ],
  },

  // ── Guide: How to wire a strategy / AI agent (策略・AI Agent) ──
  // The empty-result body is a REAL capture: {dataset, rows:[], count:0}. count:0 is the anti-
  // hallucination signal an agent must honour. /meta/boundaries (A2) is not live yet — marked as such.
  {
    slug: "guides/strategy-ai-agent",
    pageLabel: { en: "Guide", zh: "指南" },
    title: { en: "How to wire a strategy / AI agent", zh: "如何接策略・AI Agent" },
    subtitle: {
      en: "Let an agent use TW Market Data without hallucinating — read the index, trust empty results, know the gaps.",
      zh: "讓 agent 用 TW Market Data 而不幻覺——讀索引、相信空結果、知道缺口。",
    },
    sections: [
      {
        id: "step-1-index",
        heading: { en: "Step 1 — Read the index first", zh: "步驟 1 — 先讀索引" },
        paragraphs: [
          { en: "Point the agent at /llms.txt — the machine-readable index of datasets, rules and OpenAPI links. Fetch it once, then work only from the dataset ids it lists.", zh: "讓 agent 先讀 /llms.txt——資料集、規則與 OpenAPI 連結的機器可讀索引。抓一次,之後只用它列出的 dataset id 作業。" },
        ],
        code: {
          language: "bash",
          code: `curl "https://twmarketdata.com/llms.txt"`,
        },
      },
      {
        id: "step-2-call",
        heading: { en: "Step 2 — Call datasets with your key", zh: "步驟 2 — 用金鑰打資料集" },
        paragraphs: [
          { en: "Every data call carries X-API-Key. The envelope is { rows / items, count }; read count before touching the rows.", zh: "每次資料呼叫帶 X-API-Key。信封為 { rows／items, count };先看 count 再讀 rows。" },
        ],
      },
      {
        id: "step-3-empty",
        heading: { en: "Step 3 — Trust an empty result", zh: "步驟 3 — 相信空結果" },
        paragraphs: [
          { en: "When a range has no data, the API returns an honest empty result — not an error, not a guess. This is a real response:", zh: "當範圍內無資料,API 回誠實的空結果——不是錯誤,也不是猜測。這是真實回應:" },
        ],
        code: {
          language: "json",
          code: `{
  "dataset": "institutional_flow",
  "rows": [],
  "count": 0
}`,
        },
      },
      {
        id: "step-3b-rule",
        heading: { en: "The rule for the agent", zh: "給 agent 的規則" },
        bullets: [
          { en: "count == 0 means CONFIRMED no data in range. The agent must say \"no data in that range\" — never invent a number to fill the gap.", zh: "count == 0 代表「範圍內確認查無」。agent 必須回「該範圍無資料」——絕不編數字填空。" },
          { en: "This is the single most important anti-hallucination check: read count, then decide.", zh: "這是最重要的反幻覺檢查:先讀 count,再決定。" },
        ],
      },
      {
        id: "step-4-boundaries",
        heading: { en: "Step 4 — Know the permanent gaps", zh: "步驟 4 — 知道永久缺口" },
        paragraphs: [
          { en: "Some data is deliberately not offered (copyright, no source). A /meta/boundaries endpoint that declares these permanent gaps is in preview and not live yet — until it ships, treat the not_available list in /llms.txt as the source of truth for what is intentionally absent.", zh: "部分資料刻意不提供（版權、無來源）。宣告這些永久缺口的 /meta/boundaries 端點仍在 preview、尚未上線——上線前,以 /llms.txt 的 not_available 清單為「刻意不提供」的真相來源。" },
        ],
      },
      {
        id: "disclaimer",
        heading: { en: "Disclaimer", zh: "免責" },
        paragraphs: [
          { en: "TW Market Data provides data only — not investment advice, not stock recommendations, not trading signals. An agent built on it must not present its output as any of those.", zh: "TW Market Data 僅提供資料——非投資建議、非個股推薦、非交易訊號。基於它建置的 agent 不得把輸出呈現為上述任何一種。" },
        ],
      },
    ],
  },

  // ── For AI agents: OpenAPI spec ──
  // Links the REAL generated spec at /openapi.{json,yaml} (single source, regenerated at build) rather
  // than re-listing endpoints here (which would drift). Server / version read from that spec.
  {
    slug: "ai-agents/openapi-spec",
    pageLabel: { en: "For AI agents", zh: "為 AI Agent" },
    title: { en: "OpenAPI spec", zh: "OpenAPI 規格" },
    subtitle: {
      en: "A machine-readable description of the dataset endpoints, for agents and code generators.",
      zh: "資料集端點的機器可讀描述,供 agent 與程式碼產生器使用。",
    },
    sections: [
      {
        id: "where",
        heading: { en: "Where it lives", zh: "位置" },
        paragraphs: [
          { en: "The spec is served at the domain root in both formats, generated from the same source as the docs so it cannot drift:", zh: "規格以兩種格式提供於網域根層,與文件同源生成,故不會漂移:" },
        ],
        code: {
          language: "bash",
          code: `curl "https://twmarketdata.com/openapi.json"
curl "https://twmarketdata.com/openapi.yaml"`,
        },
        bullets: [
          { en: "Title: TW Market Data API. Server: https://twmarketdata.com.", zh: "標題:TW Market Data API。伺服器:https://twmarketdata.com。" },
          { en: "It describes the /v2/datasets/* dataset endpoints as a machine-readable summary; per-field detail lives on each dataset's docs page.", zh: "它以機器可讀摘要描述 /v2/datasets/* 資料集端點;逐欄位細節在各資料集的文件頁。" },
        ],
      },
      {
        id: "use",
        heading: { en: "Use it", zh: "怎麼用" },
        bullets: [
          { en: "Import the JSON into an OpenAPI client / SDK generator to get typed request builders.", zh: "把 JSON 匯入 OpenAPI client／SDK 產生器,取得型別化的請求建構器。" },
          { en: "All calls still need your X-API-Key header — the spec documents the shape, not your credentials.", zh: "所有呼叫仍需 X-API-Key 標頭——規格描述的是結構,不含你的憑證。" },
        ],
      },
    ],
  },

  // ── For AI agents: llms.txt ──
  {
    slug: "ai-agents/llms-txt",
    pageLabel: { en: "For AI agents", zh: "為 AI Agent" },
    title: { en: "llms.txt", zh: "llms.txt" },
    subtitle: {
      en: "A single machine-readable index an agent reads first to know what exists — and what deliberately does not.",
      zh: "agent 先讀的單一機器可讀索引——知道有什麼、以及刻意沒有什麼。",
    },
    sections: [
      {
        id: "what",
        heading: { en: "What it is", zh: "它是什麼" },
        paragraphs: [
          { en: "/llms.txt is the site's machine-readable index for agents: the allowed dataset ids, the not_available list (data deliberately not offered), the usage rules, and links to the OpenAPI spec.", zh: "/llms.txt 是給 agent 的全站機器可讀索引:允許的 dataset id、not_available 清單(刻意不提供的資料)、使用規則,以及 OpenAPI 規格連結。" },
        ],
        code: {
          language: "bash",
          code: `curl "https://twmarketdata.com/llms.txt"`,
        },
      },
      {
        id: "urls",
        heading: { en: "The two files", zh: "兩個檔案" },
        bullets: [
          { en: "/llms.txt — the compact index (dataset ids, rules, not_available, OpenAPI links).", zh: "/llms.txt — 精簡索引(dataset id、規則、not_available、OpenAPI 連結)。" },
          { en: "/llms-full.txt — the full bundle: every guide + endpoint page + coverage.", zh: "/llms-full.txt — 完整包:每個 guide＋端點頁＋涵蓋。" },
          { en: "Both live at the domain root (they are not localized); a /zh-TW/llms.txt request redirects to the root.", zh: "兩者皆位於網域根層(不 localize);/zh-TW/llms.txt 會轉址到根路徑。" },
        ],
      },
      {
        id: "how",
        heading: { en: "How an agent uses it", zh: "agent 如何使用" },
        bullets: [
          { en: "Fetch it once at the start, then work only from the dataset ids it lists — do not guess ids.", zh: "開始時抓一次,之後只用它列出的 dataset id——不要猜 id。" },
          { en: "Treat not_available as authoritative: if data is listed there, tell the user it is intentionally not offered rather than inventing it.", zh: "把 not_available 視為權威:若某資料列在其中,告訴使用者它刻意不提供,而非編造。" },
        ],
      },
    ],
  },

  // ── For AI agents: MCP server (BETA — live + connectable, not GA) ──
  // Corrected from the earlier "Preview Skeleton" draft: the hosted MCP is verifiably LIVE (2026-07-22:
  // v1.28.1, 4 tools) but BETA. Neither "no hosted MCP" (false) nor "已上線 GA" (overclaim). owner ruling.
  {
    slug: "ai-agents/mcp-server",
    pageLabel: { en: "For AI agents", zh: "為 AI Agent" },
    title: { en: "MCP Server", zh: "MCP Server" },
    subtitle: {
      en: "Beta — the hosted MCP server is live and connectable, but not yet GA.",
      zh: "Beta——hosted MCP 伺服器已上線可連,但尚非正式版(GA)。",
    },
    sections: [
      {
        id: "status",
        heading: { en: "Status — Beta", zh: "狀態 — Beta" },
        paragraphs: [
          { en: "The hosted MCP server is live at mcp.twmarketdata.com/mcp and connectable today. It is beta, not GA — the surface may change before general availability, and the REST API remains the stable path.", zh: "hosted MCP 伺服器已上線於 mcp.twmarketdata.com/mcp,今天即可連。它是 beta、非 GA——介面在正式版前可能調整,穩定路徑仍請用 REST API。" },
        ],
      },
      {
        id: "connect",
        heading: { en: "Connect", zh: "連上" },
        paragraphs: [
          { en: "It speaks streamable-HTTP MCP and authenticates with your X-API-Key. With Claude Code:", zh: "它使用 streamable-HTTP MCP,以你的 X-API-Key 認證。以 Claude Code 為例:" },
        ],
        code: {
          language: "bash",
          code: `claude mcp add --transport http tw-market-data \\
  https://mcp.twmarketdata.com/mcp \\
  --header "X-API-Key: sk_live_..."`,
        },
      },
      {
        id: "tools",
        heading: { en: "The tools it exposes", zh: "它提供的工具" },
        paragraphs: [
          { en: "Server tw-market-data (v1.28.1) exposes four tools; an agent discovers them automatically after connecting:", zh: "伺服器 tw-market-data(v1.28.1)提供四個工具;agent 連上後會自動探索:" },
        ],
        bullets: [
          { en: "list_datasets — discovery entry point. Lists the available datasets (id / name / category / tier / one-line description). Use this first to find the right data.", zh: "list_datasets — 探索入口。列出可用資料集(id／中文名／category／tier／一句描述)。先用它找對的資料。" },
          { en: "describe_dataset — full semantics of one dataset: grain (what a row is), field meanings + units, time-correctness rules (point-in-time safety — read before backtesting), relations and agent hints.", zh: "describe_dataset — 一個資料集的完整語意:grain(一列代表什麼)、欄位意義＋單位、時間正確性規則(point-in-time 安全,回測前先讀)、關聯與 agent 提示。" },
          { en: "query_dataset — query rows with built-in look-ahead protection. Pass as_of (YYYY-MM-DD) for backtesting: rows are filtered by disclosure date ≤ as_of, so the agent only sees what was public then.", zh: "query_dataset — 取資料,內建未來函數防護。回測帶 as_of(YYYY-MM-DD):依揭露日 ≤ as_of 過濾,agent 只看到當時已公開的內容。" },
          { en: "find_related — traverse the knowledge graph for cross-table / supply-chain reasoning: dataset_id returns join-able datasets; ticker returns its industry value-chain node + peers.", zh: "find_related — 走知識圖譜做跨表／產業鏈推理:dataset_id 回傳可 join 的資料集;ticker 回傳其產業鏈節點與同節點同業。" },
          { en: "Same official data and same credits as REST — the MCP tools are a protocol wrapper, not a separate dataset. (Descriptions above are pulled from the live server, not paraphrased.)", zh: "與 REST 同一份官方資料、同一套扣點——MCP 工具是協定封裝,非另一份資料。(上述描述取自 live server,非改寫。)" },
        ],
      },
    ],
  },
];

export const ARTICLE_PAGES: Record<string, ArticlePage> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

export function getArticlePage(slugParts: string[]): ArticlePage | null {
  return ARTICLE_PAGES[slugParts.join("/")] ?? null;
}

export function articleSlugs(): string[][] {
  return ARTICLES.map((a) => a.slug.split("/"));
}
