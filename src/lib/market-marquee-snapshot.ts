import { promises as fs } from "node:fs";
import path from "node:path";

import { indexDisplayName } from "@/src/lib/homepage/index-names";

const MARKET_INDEX_ITEMS = [
  { label: "加權指數", metric: "TAIEX", symbol: "TAIEX" },
  { label: "櫃買指數", metric: "TPEx", symbol: "OTCI" },
  { label: "台灣50", metric: "Index", symbol: "0050" },
  { label: "電子類股", metric: "Sector Index", symbol: "TWBETR" },
  { label: "金融保險", metric: "Sector Index", symbol: "TWBFIN" },
] as const;

const SNAPSHOT_STALE_HOURS = 36;
const SNAPSHOT_PATH = process.env.MARKET_MARQUEE_SNAPSHOT_PATH
  ? path.resolve(process.env.MARKET_MARQUEE_SNAPSHOT_PATH)
  : path.join(process.cwd(), "data", "market-marquee-snapshot.json");

type Trend = "up" | "down" | "neutral";
type AnyRecord = Record<string, unknown>;

export type MarketStatus = "open" | "closed";

export type MarketMarqueeSnapshotItem = {
  label: string;
  value: string;
  changePct: string;
  tone: Trend;
  metric?: string;
  change?: string;
  asOf?: string;
};

export type MarketMarqueeCoverage = {
  mopsMonthlyRevenue: boolean;
  twseTpexIndexes: boolean;
  technicalIndicators: boolean;
  valuationFinancials: boolean;
};

export type MarketMarqueeNewsItem = {
  title: string;
  source: string;
  category: string;
  href: string;
};

export type MarketSnapshotNewsItem = MarketMarqueeNewsItem;

export type MarketMarqueeSnapshot = {
  asOf: string;
  updatedAt: string;
  marketStatus: MarketStatus;
  items: MarketMarqueeSnapshotItem[];
  summary: string[];
  news: MarketMarqueeNewsItem[];
  source?: string;
  coverage?: Partial<MarketMarqueeCoverage>;
};

export type MarketMarqueeViewItem = {
  id: string;
  name: string;
  metric: string;
  value: string;
  change: string;
  percent: string;
  trend: Trend;
  asOf: string;
};

export type MarketMarqueeViewPayload = {
  items: MarketMarqueeViewItem[];
  summary: string[];
  news: MarketMarqueeNewsItem[];
  marketStatus: MarketStatus;
  updatedAt: string | null;
  asOfDate: string | null;
  isFallback: boolean;
  isStale: boolean;
  note?: string;
};

// `href` is a PUBLIC, crawlable destination only. Curated snapshot rows describe data
// availability rather than a specific public article, so they carry no href — the homepage
// renders them as plain, non-clickable rows. Never point these at /login: a login wall is a
// dead end for visitors and, for crawlers, an indexable auth page (GSC flags it). Backend feeds
// may still supply a real public source_url (MOPS/TWSE), which is honored as an external link.
// Curated SAMPLE news (shown when the backend feed has none). Sample prose must follow locale
// (I18N-FIX-03 ③) — real backend news titles are passed through untranslated. `category` is also
// bilingual so nothing zh reaches /en.
const CURATED_FALLBACK_NEWS_I18N: {
  zh: string;
  en: string;
  source: string;
  categoryZh: string;
  categoryEn: string;
}[] = [
  {
    zh: "公開資訊觀測站月營收資料陸續更新，市場關注營收成長動能",
    en: "MOPS monthly-revenue disclosures rolling in; focus on revenue-growth momentum",
    source: "MOPS",
    categoryZh: "月營收",
    categoryEn: "Monthly revenue",
  },
  {
    zh: "電子類股成交比重維持高檔，AI 供應鏈仍為盤面焦點",
    en: "Electronics keep a high share of turnover; the AI supply chain stays in focus",
    source: "TWSE",
    categoryZh: "市場概況",
    categoryEn: "Market overview",
  },
  {
    zh: "上市櫃公司重大訊息與公告資料可供事件研究流程使用",
    en: "Listed-company material announcements available for event-study workflows",
    source: "MOPS",
    categoryZh: "公司事件",
    categoryEn: "Company events",
  },
  {
    zh: "技術指標、估值與財報資料可供 API 查詢與模型分析",
    en: "Technicals, valuation and financials available via API for model analysis",
    source: "TWMD",
    categoryZh: "資料集",
    categoryEn: "Datasets",
  },
];

function curatedFallbackNews(locale: string): MarketMarqueeNewsItem[] {
  const en = locale === "en";
  return CURATED_FALLBACK_NEWS_I18N.map((n) => ({
    title: en ? n.en : n.zh,
    source: n.source,
    category: en ? n.categoryEn : n.categoryZh,
    href: "",
  }));
}


// Real news only (valid rows, deduped). Used for STORAGE so the zh sample is never baked into a
// stored snapshot — the sample is a view-only, locale-aware fallback.
function cleanNews(news: MarketMarqueeNewsItem[]): MarketMarqueeNewsItem[] {
  // href is optional (public source URL only); rows without one still render as text.
  const cleaned = news.filter((item) => item.title && item.source && item.category);
  return Array.from(new Map(cleaned.map((item) => [item.title, item])).values());
}

// View list: real news padded up to 4 with the LOCALIZED sample (so /en never shows the zh sample).
function buildNewsList(news: MarketMarqueeNewsItem[], locale: string): MarketMarqueeNewsItem[] {
  const candidates = [...cleanNews(news), ...curatedFallbackNews(locale)];
  return Array.from(new Map(candidates.map((item) => [item.title, item])).values()).slice(0, 4);
}

function getNewsRows(payload: unknown): AnyRecord[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as AnyRecord;
  const envelope = root.envelope && typeof root.envelope === "object" ? (root.envelope as AnyRecord) : null;

  const candidates = [
    root.rows,
    root.data,
    root.items,
    root.results,
    envelope?.data,
    envelope?.rows,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is AnyRecord => !!item && typeof item === "object");
    }
  }

  return [];
}

function pickNewsTitle(row: AnyRecord): string | null {
  const keys = ["title", "headline", "subject", "announcement_title", "event_title", "summary_title"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function pickNewsSource(row: AnyRecord, fallbackSource: string): string {
  const keys = ["source", "provider", "exchange", "source_name"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallbackSource;
}

function pickNewsHref(row: AnyRecord): string {
  const keys = ["source_url", "url", "link", "document_url", "announcement_url"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  // No public source URL — leave empty so the row renders as non-clickable text (never /login).
  return "";
}

function normalizeNewsItem(row: AnyRecord, defaults: { source: string; category: string }): MarketSnapshotNewsItem | null {
  const title = pickNewsTitle(row);
  if (!title) return null;

  return {
    title,
    source: pickNewsSource(row, defaults.source),
    category: defaults.category,
    href: pickNewsHref(row),
  };
}

async function fetchBackendNewsByEndpoint(options: {
  baseUrl: string;
  path: string;
  source: string;
  category: string;
  token?: string;
}): Promise<MarketSnapshotNewsItem[]> {
  const headers = options.token
    ? {
        "x-api-key": options.token,
      }
    : getAuthHeaders();

  const response = await fetch(`${options.baseUrl}${options.path}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) return [];

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    return [];
  }

  const rows = getNewsRows(payload);
  if (rows.length === 0) return [];

  return rows
    .map((row) => normalizeNewsItem(row, { source: options.source, category: options.category }))
    .filter((item): item is MarketSnapshotNewsItem => item !== null);
}

export async function fetchBackendNewsSnapshot(options: {
  baseUrl: string;
  token?: string;
}): Promise<MarketSnapshotNewsItem[]> {
  const endpointConfigs = [
    {
      path: "/v2/datasets/market-news?limit=8",
      source: "TWSE",
      category: "市場概況",
    },
    {
      path: "/v2/datasets/company-news?limit=8",
      source: "TWSE",
      category: "公司新聞",
    },
    {
      path: "/v2/datasets/issuer-announcements?limit=8",
      source: "MOPS",
      category: "公司事件",
    },
  ] as const;

  const results = await Promise.allSettled(
    endpointConfigs.map((config) =>
      fetchBackendNewsByEndpoint({
        baseUrl: options.baseUrl,
        path: config.path,
        source: config.source,
        category: config.category,
        token: options.token,
      }),
    ),
  );

  const merged = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  return cleanNews(merged);
}

const CURATED_FALLBACK_SNAPSHOT: MarketMarqueeSnapshot = {
  asOf: "2026-05-06",
  updatedAt: "2026-05-06T15:20:00+08:00",
  marketStatus: "closed",
  source: "curated_public_snapshot",
  coverage: {
    mopsMonthlyRevenue: true,
    twseTpexIndexes: true,
    technicalIndicators: true,
    valuationFinancials: true,
  },
  items: [
    { label: "加權指數", metric: "TAIEX", value: "23,481.52", change: "+128.44", changePct: "+0.55%", tone: "up", asOf: "2026-05-06" },
    { label: "櫃買指數", metric: "TPEx", value: "258.32", change: "-1.14", changePct: "-0.44%", tone: "down", asOf: "2026-05-06" },
    { label: "台灣50", metric: "Index", value: "18,920.10", change: "+92.30", changePct: "+0.49%", tone: "up", asOf: "2026-05-06" },
    { label: "電子類股", metric: "Sector Index", value: "1,284.62", change: "+8.91", changePct: "+0.70%", tone: "up", asOf: "2026-05-06" },
    { label: "金融保險", metric: "Sector Index", value: "2,132.45", change: "-6.18", changePct: "-0.29%", tone: "down", asOf: "2026-05-06" },
    { label: "月營收 YoY", metric: "Fundamentals", value: "+34.7%", change: "公開資訊觀測站月營收", changePct: "", tone: "up", asOf: "2026-03" },
    { label: "市場估值", metric: "PER / PBR", value: "PER 21.4", change: "PBR 2.38", changePct: "", tone: "neutral", asOf: "2026-05-06" },
    { label: "技術指標", metric: "MA20 / RSI", value: "MA20 上方", change: "RSI 58.2", changePct: "", tone: "neutral", asOf: "2026-05-06" },
  ],
  summary: [
    "公開資訊觀測站月營收資料已納入展示快照",
    "市場指數與類股指標以每日快照方式呈現",
    "技術指標、估值與財報資料可供 API 查詢",
    "前端僅展示 summary snapshot，不暴露 raw payload",
  ],
  news: [],
};

let memorySnapshot: MarketMarqueeSnapshot | null = null;

function getBaseUrl() {
  const base =
    process.env.BACKEND_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.FEATURE_ENGINE_API_BASE_URL ??
    process.env.NEXT_PUBLIC_FEATURE_ENGINE_API_BASE_URL;
  return base?.replace(/\/$/, "") ?? null;
}

function getAuthHeaders() {
  const apiKey = process.env.BACKEND_API_TOKEN ?? process.env.BACKEND_API_KEY ?? process.env.STAGING_BACKEND_API_TOKEN ?? null;
  const bearer = process.env.BACKEND_BEARER_TOKEN ?? null;
  return {
    ...(apiKey ? { "x-api-key": apiKey } : {}),
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
  };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,%\s]/g, "");
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function getRows(payload: unknown): AnyRecord[] {
  if (!payload || typeof payload !== "object") return [];
  const rowKeys = ["rows", "data", "items", "results"];
  for (const key of rowKeys) {
    const value = (payload as AnyRecord)[key];
    if (Array.isArray(value)) return value.filter((item): item is AnyRecord => !!item && typeof item === "object");
  }
  return [];
}

function pickValue(row: AnyRecord): number | null {
  const keys = ["index_value", "value", "close", "last", "price", "points", "index"];
  for (const key of keys) {
    const parsed = toNumber(row[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function pickChange(row: AnyRecord): number | null {
  const keys = ["change", "change_value", "diff", "delta", "point_change"];
  for (const key of keys) {
    const parsed = toNumber(row[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function pickPercent(row: AnyRecord): number | null {
  const keys = ["change_percent", "pct_change", "change_pct", "percent", "return_pct"];
  for (const key of keys) {
    const parsed = toNumber(row[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function pickAsOfDate(row: AnyRecord): string | null {
  const keys = ["date", "trade_date", "as_of_date", "updated_at", "asOf", "updatedAt"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  }
  return null;
}

function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat("zh-TW", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

function formatSigned(value: number, digits = 2) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatNumber(Math.abs(value), digits)}`;
}

function normalizeTone(value: unknown): Trend {
  if (value === "up" || value === "down" || value === "neutral") return value;
  return "neutral";
}

function toTrend(change: number): Trend {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "neutral";
}

function toSnapshotItemFromRow(config: (typeof MARKET_INDEX_ITEMS)[number], row: AnyRecord): MarketMarqueeSnapshotItem | null {
  const value = pickValue(row);
  if (value === null) return null;
  const change = pickChange(row) ?? 0;
  const changePercent = pickPercent(row) ?? 0;

  return {
    label: config.label,
    metric: config.metric,
    value: formatNumber(value, 2),
    change: formatSigned(change, 2),
    changePct: `${formatSigned(changePercent, 2)}%`,
    tone: toTrend(change),
    asOf: pickAsOfDate(row) ?? getTaipeiDateString(new Date()),
  };
}

async function fetchMarketItem(baseUrl: string, config: (typeof MARKET_INDEX_ITEMS)[number]): Promise<MarketMarqueeSnapshotItem | null> {
  const pathName = `/v2/datasets/index-market-context?symbol=${encodeURIComponent(config.symbol)}&limit=1`;
  const response = await fetch(`${baseUrl}${pathName}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) return null;

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    return null;
  }

  const rows = getRows(payload);
  if (rows.length === 0) return null;

  return toSnapshotItemFromRow(config, rows[0]);
}

function getTaipeiClock(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    weekday: map.weekday ?? "",
    year: map.year ?? "1970",
    month: map.month ?? "01",
    day: map.day ?? "01",
    hour: Number(map.hour ?? "0"),
    minute: Number(map.minute ?? "0"),
  };
}

function getTaipeiDateString(now: Date) {
  const clock = getTaipeiClock(now);
  return `${clock.year}-${clock.month}-${clock.day}`;
}

function isWeekday(weekday: string) {
  return ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
}

function isWithinMarketRefreshWindow(hour: number, minute: number) {
  if (hour < 9 || hour > 13) return false;
  if (hour === 13 && minute > 30) return false;
  return true;
}

export function shouldRefreshMarketMarqueeNow(now = new Date()): {
  allowed: boolean;
  reason: "market_open" | "market_closed" | "non_trading_day";
  marketStatus: MarketStatus;
} {
  const clock = getTaipeiClock(now);

  if (!isWeekday(clock.weekday)) {
    return { allowed: false, reason: "non_trading_day", marketStatus: "closed" };
  }

  if (!isWithinMarketRefreshWindow(clock.hour, clock.minute)) {
    return { allowed: false, reason: "market_closed", marketStatus: "closed" };
  }

  return { allowed: true, reason: "market_open", marketStatus: "open" };
}

export function shouldRefreshNewsSnapshotNow(now = new Date()): {
  allowed: boolean;
  reason: "after_close_window" | "outside_after_close_window" | "non_trading_day";
} {
  const clock = getTaipeiClock(now);
  if (!isWeekday(clock.weekday)) {
    return { allowed: false, reason: "non_trading_day" };
  }

  const inAfterCloseWindow =
    (clock.hour === 15 && clock.minute >= 30) ||
    clock.hour === 16 ||
    clock.hour === 17 ||
    (clock.hour === 18 && clock.minute === 0);

  if (!inAfterCloseWindow) {
    return { allowed: false, reason: "outside_after_close_window" };
  }

  return { allowed: true, reason: "after_close_window" };
}

function inferCoverage(snapshot: MarketMarqueeSnapshot): MarketMarqueeCoverage {
  const labels = new Set(snapshot.items.map((item) => item.label));
  const summaryText = snapshot.summary.join(" ");

  return {
    mopsMonthlyRevenue:
      snapshot.coverage?.mopsMonthlyRevenue ??
      (labels.has("月營收 YoY") || summaryText.includes("月營收")),
    twseTpexIndexes:
      snapshot.coverage?.twseTpexIndexes ?? (labels.has("加權指數") && labels.has("櫃買指數")),
    technicalIndicators:
      snapshot.coverage?.technicalIndicators ??
      (labels.has("技術指標") || summaryText.includes("技術指標")),
    valuationFinancials:
      snapshot.coverage?.valuationFinancials ??
      (labels.has("市場估值") || summaryText.includes("財報") || summaryText.includes("估值")),
  };
}

function buildSnapshotSummary(snapshot: MarketMarqueeSnapshot, stale: boolean): string[] {
  const coverage = inferCoverage(snapshot);

  const revenueLine = coverage.mopsMonthlyRevenue
    ? "公開資訊觀測站月營收資料已納入展示快照"
    : "公開資訊觀測站月營收資料尚未納入本次展示快照";

  const marketLine = coverage.twseTpexIndexes
    ? snapshot.marketStatus === "open"
      ? "TWSE / TPEx 指數於開盤時段採每小時快照更新"
      : "TWSE / TPEx 指數於收盤後保留最後一次快照"
    : "TWSE / TPEx 指數目前顯示最近一次公開快照";

  const coverageLine = coverage.technicalIndicators && coverage.valuationFinancials
    ? "技術指標、估值與財報資料可供 API 查詢"
    : coverage.technicalIndicators
      ? "技術指標資料已納入展示快照，估值與財報資料可由 API 延伸查詢"
      : coverage.valuationFinancials
        ? "估值與財報資料已納入展示快照，技術指標資料可由 API 延伸查詢"
        : "技術指標、估值與財報資料可由 API 查詢";

  const freshnessLine = stale
    ? "目前顯示較舊快照，將於下一次有效排程更新"
    : "前端僅展示 summary snapshot，不暴露 raw payload";

  return [revenueLine, marketLine, coverageLine, freshnessLine];
}

function asView(snapshot: MarketMarqueeSnapshot | null, isFallback: boolean, locale: string): MarketMarqueeViewPayload {
  const normalized = snapshot ?? CURATED_FALLBACK_SNAPSHOT;
  const stale = isSnapshotStale(normalized);
  const summary = normalized.summary.length > 0 ? normalized.summary : buildSnapshotSummary(normalized, stale);
  // I18N-FIX-03 ③: real backend news (any language) passes through; the sample padding/fallback is
  // filled in here at the VIEW layer, LOCALIZED — so /en never shows the zh sample. (The sample is
  // never baked into the stored snapshot; `normalized.news` is real-or-empty.)
  const news = buildNewsList(normalized.news, locale);

  const items: MarketMarqueeViewItem[] = normalized.items.map((item) => ({
    id: `${item.metric ?? "market"}-${item.label}`,
    // Index display name via the shared SSOT (I18N-FIX-03 ②); unknown labels degrade to the zh name.
    name: indexDisplayName(item.label, locale),
    metric: item.metric ?? "Market",
    value: item.value,
    change: item.change ?? "",
    percent: item.changePct,
    trend: item.tone,
    asOf: item.asOf ?? normalized.asOf,
  }));

  return {
    items,
    summary,
    news,
    marketStatus: normalized.marketStatus,
    updatedAt: normalized.updatedAt,
    asOfDate: normalized.asOf,
    isFallback,
    isStale: stale,
    note: isFallback ? "顯示公開展示快照" : undefined,
  };
}

function normalizeSnapshot(value: unknown): MarketMarqueeSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as AnyRecord;

  const asOf = typeof raw.asOf === "string" ? raw.asOf : typeof raw.as_of_date === "string" ? raw.as_of_date : null;
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : typeof raw.updated_at === "string" ? raw.updated_at : null;
  if (!asOf || !updatedAt || !Array.isArray(raw.items)) return null;

  const parsedItems = raw.items
    .filter((item): item is AnyRecord => !!item && typeof item === "object")
    .map((row) => {
      if (typeof row.label !== "string" || typeof row.value !== "string") return null;
      const parsed: MarketMarqueeSnapshotItem = {
        label: row.label,
        value: row.value,
        changePct: typeof row.changePct === "string" ? row.changePct : "",
        tone: normalizeTone(row.tone),
      };

      if (typeof row.metric === "string") {
        parsed.metric = row.metric;
      }
      if (typeof row.change === "string") {
        parsed.change = row.change;
      }
      if (typeof row.asOf === "string") {
        parsed.asOf = row.asOf;
      } else if (typeof row.as_of_date === "string") {
        parsed.asOf = row.as_of_date;
      }

      return parsed;
    })
    .filter((item): item is MarketMarqueeSnapshotItem => item !== null);

  if (parsedItems.length === 0) return null;

  const summary = Array.isArray(raw.summary) ? raw.summary.filter((item): item is string => typeof item === "string") : [];
  const news = Array.isArray(raw.news)
    ? raw.news
        .filter((item): item is AnyRecord => !!item && typeof item === "object")
        .map((item) => {
          if (typeof item.title !== "string" || typeof item.source !== "string" || typeof item.category !== "string") return null;
          return {
            title: item.title,
            source: item.source,
            category: item.category,
            href: typeof item.href === "string" ? item.href : "",
          } satisfies MarketMarqueeNewsItem;
        })
        .filter((item): item is MarketMarqueeNewsItem => item !== null)
    : [];
  const coverageRaw = raw.coverage && typeof raw.coverage === "object" ? (raw.coverage as AnyRecord) : null;
  const coverage = coverageRaw
    ? {
        ...(typeof coverageRaw.mopsMonthlyRevenue === "boolean" ? { mopsMonthlyRevenue: coverageRaw.mopsMonthlyRevenue } : {}),
        ...(typeof coverageRaw.twseTpexIndexes === "boolean" ? { twseTpexIndexes: coverageRaw.twseTpexIndexes } : {}),
        ...(typeof coverageRaw.technicalIndicators === "boolean" ? { technicalIndicators: coverageRaw.technicalIndicators } : {}),
        ...(typeof coverageRaw.valuationFinancials === "boolean" ? { valuationFinancials: coverageRaw.valuationFinancials } : {}),
      }
    : undefined;

  const marketStatus: MarketStatus = raw.marketStatus === "open" || raw.marketStatus === "closed" ? raw.marketStatus : "closed";

  return {
    asOf,
    updatedAt,
    marketStatus,
    source: typeof raw.source === "string" ? raw.source : undefined,
    items: parsedItems,
    summary,
    news,
    coverage,
  };
}

async function readSnapshotFromDisk(): Promise<MarketMarqueeSnapshot | null> {
  try {
    const file = await fs.readFile(SNAPSHOT_PATH, "utf8");
    return normalizeSnapshot(JSON.parse(file));
  } catch {
    return null;
  }
}

async function writeSnapshotToDisk(snapshot: MarketMarqueeSnapshot): Promise<void> {
  const dir = path.dirname(SNAPSHOT_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

export function isSnapshotStale(snapshot: MarketMarqueeSnapshot): boolean {
  const updatedMs = Date.parse(snapshot.updatedAt);
  if (!Number.isFinite(updatedMs)) return true;
  return Date.now() - updatedMs > SNAPSHOT_STALE_HOURS * 60 * 60 * 1000;
}

export async function getMarketMarqueeSnapshotRaw(): Promise<MarketMarqueeSnapshot | null> {
  if (memorySnapshot) return memorySnapshot;
  const disk = await readSnapshotFromDisk();
  if (disk) {
    memorySnapshot = disk;
    return disk;
  }
  return null;
}

export async function getMarketMarqueeSnapshotView(locale = "zh-TW"): Promise<MarketMarqueeViewPayload> {
  const snapshot = await getMarketMarqueeSnapshotRaw();
  if (!snapshot || snapshot.items.length === 0) {
    return asView(CURATED_FALLBACK_SNAPSHOT, true, locale);
  }
  return asView(snapshot, false, locale);
}

export async function getMarketMarqueePublicSnapshot() {
  const rawSnapshot = await getMarketMarqueeSnapshotRaw();
  const snapshot = rawSnapshot ?? CURATED_FALLBACK_SNAPSHOT;
  const stale = isSnapshotStale(snapshot);
  const summary = snapshot.summary.length > 0 ? snapshot.summary : buildSnapshotSummary(snapshot, stale);
  // Public JSON API (not rendered on /en); default the sample padding to zh.
  const news = buildNewsList(snapshot.news, "zh");

  return {
    asOf: snapshot.asOf,
    updatedAt: snapshot.updatedAt,
    marketStatus: snapshot.marketStatus,
    stale,
    fallback: rawSnapshot === null,
    items: snapshot.items.map((item) => ({
      label: item.label,
      value: item.value,
      changePct: item.changePct,
      tone: item.tone,
    })),
    summary,
    news: news.map((item) => ({
      title: item.title,
      source: item.source,
      category: item.category,
      href: item.href,
    })),
  };
}

export async function refreshMarketMarqueeSnapshot(options?: {
  refreshMarketIndicators?: boolean;
  refreshNews?: boolean;
}): Promise<{
  ok: boolean;
  snapshot: MarketMarqueeSnapshot | null;
  usedPreviousSnapshot: boolean;
  error?: string;
}> {
  const refreshMarketIndicators = options?.refreshMarketIndicators ?? true;
  const refreshNews = options?.refreshNews ?? true;
  const baseUrl = getBaseUrl();
  const previous = (await getMarketMarqueeSnapshotRaw()) ?? CURATED_FALLBACK_SNAPSHOT;

  if (!refreshMarketIndicators && !refreshNews) {
    return {
      ok: true,
      snapshot: previous,
      usedPreviousSnapshot: true,
    };
  }

  if (!baseUrl) {
    return {
      ok: false,
      snapshot: previous,
      usedPreviousSnapshot: true,
      error: "missing BACKEND_API_BASE_URL",
    };
  }

  const fetchedItems: MarketMarqueeSnapshotItem[] = refreshMarketIndicators
    ? (
        await Promise.allSettled(MARKET_INDEX_ITEMS.map((item) => fetchMarketItem(baseUrl, item)))
      )
        .map((result) => (result.status === "fulfilled" ? result.value : null))
        .filter((item): item is MarketMarqueeSnapshotItem => item !== null)
    : [];

  if (refreshMarketIndicators && fetchedItems.length === 0) {
    return {
      ok: false,
      snapshot: previous,
      usedPreviousSnapshot: true,
      error: "all market item requests failed",
    };
  }

  const currentMap = new Map(previous.items.map((item) => [item.label, item]));
  for (const item of fetchedItems) {
    currentMap.set(item.label, item);
  }

  const marketStatus = shouldRefreshMarketMarqueeNow().marketStatus;
  const now = new Date();
  const asOf = (refreshMarketIndicators ? fetchedItems.find((item) => item.asOf)?.asOf : previous.asOf) ?? getTaipeiDateString(now);
  const backendNews = refreshNews
    ? await fetchBackendNewsSnapshot({
        baseUrl,
        token: process.env.BACKEND_API_TOKEN ?? process.env.BACKEND_API_KEY ?? undefined,
      })
    : [];

  const snapshot: MarketMarqueeSnapshot = {
    asOf,
    updatedAt: now.toISOString(),
    marketStatus,
    source: "/v2/datasets/index-market-context",
    coverage: previous.coverage,
    items: refreshMarketIndicators
      ? CURATED_FALLBACK_SNAPSHOT.items.map((fallbackItem) => currentMap.get(fallbackItem.label) ?? fallbackItem)
      : previous.items,
    summary: [],
    news: cleanNews(refreshNews && backendNews.length > 0 ? backendNews : previous.news),
  };

  snapshot.summary = buildSnapshotSummary(snapshot, false);

  try {
    await writeSnapshotToDisk(snapshot);
    memorySnapshot = snapshot;
    return { ok: true, snapshot, usedPreviousSnapshot: false };
  } catch {
    memorySnapshot = snapshot;
    return {
      ok: false,
      snapshot: previous,
      usedPreviousSnapshot: true,
      error: "snapshot persisted in memory only",
    };
  }
}
