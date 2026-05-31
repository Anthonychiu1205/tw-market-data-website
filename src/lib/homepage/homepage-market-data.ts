import "server-only";

type SourceMode = "live_api" | "fallback_static" | "unavailable";
type Trend = "up" | "down" | "neutral";

type AnyRecord = Record<string, unknown>;

export type HomepageMarketItem = {
  id: string;
  name: string;
  metric: string;
  value: string;
  change: string;
  percent: string;
  trend: Trend;
  asOf: string;
  sourceMode: SourceMode;
};

export type HomepageMarketSnapshot = {
  items: HomepageMarketItem[];
  sourceMode: SourceMode;
  statusLabel: string;
  updatedAt: string | null;
};

export type HomepageTickerTape = {
  items: HomepageMarketItem[];
  sourceMode: SourceMode;
  statusLabel: string;
  updatedAt: string | null;
};

export type HomepageCoverageMetric = {
  key: "twse_first" | "low_latency" | "official_first" | "clear_boundary";
  value: string;
  evidence: string;
};

const REVALIDATE_SECONDS = 86400;
const FETCH_TIMEOUT_MS = 4500;
const FALLBACK_AS_OF = "2026-05-28";

const FALLBACK_MARKET_ITEMS: HomepageMarketItem[] = [
  {
    id: "twse_taiex",
    name: "加權指數",
    metric: "TAIEX",
    value: "23,481.52",
    change: "+128.44",
    percent: "+0.55%",
    trend: "up",
    asOf: FALLBACK_AS_OF,
    sourceMode: "fallback_static",
  },
  {
    id: "tpex_otci",
    name: "櫃買指數",
    metric: "TPEx",
    value: "258.32",
    change: "-1.14",
    percent: "-0.44%",
    trend: "down",
    asOf: FALLBACK_AS_OF,
    sourceMode: "fallback_static",
  },
  {
    id: "twii_0050",
    name: "台灣50",
    metric: "Index",
    value: "18,920.10",
    change: "+92.30",
    percent: "+0.49%",
    trend: "up",
    asOf: FALLBACK_AS_OF,
    sourceMode: "fallback_static",
  },
  {
    id: "sector_ele",
    name: "電子類股",
    metric: "Sector Index",
    value: "1,284.62",
    change: "+8.91",
    percent: "+0.70%",
    trend: "up",
    asOf: FALLBACK_AS_OF,
    sourceMode: "fallback_static",
  },
  {
    id: "sector_fin",
    name: "金融保險",
    metric: "Sector Index",
    value: "2,132.45",
    change: "-6.18",
    percent: "-0.29%",
    trend: "down",
    asOf: FALLBACK_AS_OF,
    sourceMode: "fallback_static",
  },
];

const FALLBACK_TICKER_ITEMS: HomepageMarketItem[] = [
  ...FALLBACK_MARKET_ITEMS,
  {
    id: "monthly_revenue_yoy",
    name: "月營收 YoY",
    metric: "Fundamentals",
    value: "+34.7%",
    change: "MOPS 月營收",
    percent: "",
    trend: "up",
    asOf: "2026-04",
    sourceMode: "fallback_static",
  },
];

function isRecord(v: unknown): v is AnyRecord {
  return !!v && typeof v === "object";
}

function getRows(payload: unknown): AnyRecord[] {
  if (!isRecord(payload)) return [];
  const envelope = isRecord(payload.envelope) ? payload.envelope : null;
  const candidates = [payload.rows, payload.data, payload.items, payload.results, envelope?.rows, envelope?.data];
  for (const item of candidates) {
    if (Array.isArray(item)) return item.filter(isRecord);
  }
  return [];
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,%\s]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function pickNumber(row: AnyRecord, keys: string[]): number | null {
  for (const key of keys) {
    const n = toNumber(row[key]);
    if (n !== null) return n;
  }
  return null;
}

function pickDate(row: AnyRecord): string {
  const keys = ["trade_date", "date", "as_of_date", "updated_at"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  }
  return FALLBACK_AS_OF;
}

function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatSigned(value: number, digits = 2): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatNumber(Math.abs(value), digits)}`;
}

function inferTrend(change: number): Trend {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "neutral";
}

function isLikelyPlaceholderApiKey(value: string): boolean {
  const v = value.trim().toLowerCase();
  return !v || v.includes("your_api_key") || v.includes("placeholder") || v.includes("demo");
}

export function getTwFeatureEngineBaseUrl(): string | null {
  const base =
    process.env.TW_FEATURE_ENGINE_API_BASE ??
    process.env.FEATURE_ENGINE_API_BASE_URL ??
    process.env.NEXT_PUBLIC_FEATURE_ENGINE_API_BASE_URL ??
    process.env.BACKEND_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL;
  return base ? base.replace(/\/$/, "") : null;
}

async function safeFetchJson(path: string): Promise<{ ok: boolean; payload: unknown | null }> {
  const baseUrl = getTwFeatureEngineBaseUrl();
  if (!baseUrl) return { ok: false, payload: null };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const apiKey = process.env.TW_FEATURE_ENGINE_API_KEY ?? process.env.BACKEND_API_TOKEN ?? process.env.BACKEND_API_KEY ?? "";
  const headers: Record<string, string> = {};
  if (apiKey && !isLikelyPlaceholderApiKey(apiKey)) headers["x-api-key"] = apiKey;

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers,
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return { ok: false, payload: null };
    const payload = await res.json();
    return { ok: true, payload };
  } catch {
    return { ok: false, payload: null };
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeTaiExRow(row: AnyRecord): HomepageMarketItem | null {
  const value = pickNumber(row, ["index_value", "close", "value", "last"]);
  if (value === null) return null;
  const change = pickNumber(row, ["change", "change_value", "point_change", "delta"]) ?? 0;
  const changePct = pickNumber(row, ["change_pct", "change_percent", "pct_change", "percent"]);
  return {
    id: "twse_taiex",
    name: "加權指數",
    metric: "TAIEX",
    value: formatNumber(value),
    change: formatSigned(change),
    percent: changePct === null ? "" : `${formatSigned(changePct)}%`,
    trend: inferTrend(change),
    asOf: pickDate(row),
    sourceMode: "live_api",
  };
}

export async function getHomepageMarketSnapshot(): Promise<HomepageMarketSnapshot> {
  const result = await safeFetchJson("/v2/datasets/market-index?index_code=TWSE_TAIEX&market=TWSE&latest=true&limit=1&include_data_gaps=true");
  if (result.ok) {
    const rows = getRows(result.payload);
    const taiex = rows.length > 0 ? normalizeTaiExRow(rows[0]) : null;
    if (taiex) {
      const items = [taiex, ...FALLBACK_MARKET_ITEMS.filter((item) => item.id !== taiex.id)];
      return {
        items,
        sourceMode: "live_api",
        statusLabel: "每日更新 · 資料來源：TW Feature Engine（TAIEX 即時，其他為展示資料）",
        updatedAt: taiex.asOf,
      };
    }
  }

  return {
    items: FALLBACK_MARKET_ITEMS,
    sourceMode: "fallback_static",
    statusLabel: "每日更新 · fallback demo（非完整 live 指標）",
    updatedAt: FALLBACK_AS_OF,
  };
}

export async function getHomepageTickerTape(): Promise<HomepageTickerTape> {
  const [marketRes, chipRes] = await Promise.all([
    safeFetchJson("/v2/datasets/market-index?index_code=TWSE_TAIEX&market=TWSE&latest=true&limit=1&include_data_gaps=true"),
    safeFetchJson("/v2/datasets/institutional-flow-market-aggregate?market=TWSE&latest=true&limit=1"),
  ]);

  const items = [...FALLBACK_TICKER_ITEMS];
  let sourceMode: SourceMode = "fallback_static";
  let updatedAt: string | null = FALLBACK_AS_OF;

  if (marketRes.ok) {
    const rows = getRows(marketRes.payload);
    const taiex = rows.length > 0 ? normalizeTaiExRow(rows[0]) : null;
    if (taiex) {
      const idx = items.findIndex((item) => item.id === taiex.id);
      if (idx >= 0) items[idx] = taiex;
      sourceMode = "live_api";
      updatedAt = taiex.asOf;
    }
  }

  if (chipRes.ok) {
    const rows = getRows(chipRes.payload);
    if (rows.length > 0) {
      const netBuySell = pickNumber(rows[0], ["total_institutional_net_buy_sell", "net_buy_sell"]);
      if (netBuySell !== null) {
        const tone = inferTrend(netBuySell);
        items.push({
          id: "inst_flow_agg",
          name: "三大法人淨買賣",
          metric: "Market Aggregate",
          value: `${formatSigned(netBuySell, 0)} 張`,
          change: "市場聚合",
          percent: "",
          trend: tone,
          asOf: pickDate(rows[0]),
          sourceMode: "live_api",
        });
        sourceMode = "live_api";
      }
    }
  }

  return {
    items,
    sourceMode,
    statusLabel:
      sourceMode === "live_api"
        ? "每日更新 · 資料來源：TW Feature Engine（部分欄位 fallback）"
        : "每日更新 · fallback demo（非完整 live 跑馬）",
    updatedAt,
  };
}

export async function getHomepageCoverageMetrics(): Promise<HomepageCoverageMetric[]> {
  return [
    {
      key: "twse_first",
      value: "1,080 檔主檔（TWSE）",
      evidence:
        "/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/P1_SECURITY_MASTER_TWSE_OFFICIAL_CONTROLLED_WRITE_20260530T172524Z.md",
    },
    {
      key: "low_latency",
      value: "11,870 列籌碼 closeout",
      evidence: "/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/registry.py",
    },
    {
      key: "official_first",
      value: "37,196 筆月營收",
      evidence: "/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/llms-full.txt",
    },
    {
      key: "clear_boundary",
      value: "12,268 / 12,689 / 12,685 財報列",
      evidence:
        "/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/P1_FUNDAMENTALS_CORE_DAILY_READINESS_AND_AI_ALIGNMENT_20260531T164229Z.md",
    },
  ];
}

export const HOMEPAGE_REVALIDATE_SECONDS = REVALIDATE_SECONDS;
