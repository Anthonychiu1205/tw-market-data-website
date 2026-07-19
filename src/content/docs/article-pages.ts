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
];

export const ARTICLE_PAGES: Record<string, ArticlePage> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

export function getArticlePage(slugParts: string[]): ArticlePage | null {
  return ARTICLE_PAGES[slugParts.join("/")] ?? null;
}

export function articleSlugs(): string[][] {
  return ARTICLES.map((a) => a.slug.split("/"));
}
