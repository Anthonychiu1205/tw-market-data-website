import "server-only";

import { getCatalogStats } from "@/src/lib/catalog/catalog-stats";
import { COVERAGE_FACTS_SNAPSHOT_DATE, coverageFacts } from "@/src/content/coverage-facts";

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

// Display metadata only — NO index values are hardcoded here. Every number on the homepage comes from
// the single live source (/v2/homepage/market-indices → market_index / index_data_items latest close
// + as_of). The old hardcoded "fallback demo" values are gone: a stale demo 加權指數 (23,481.52) was
// rendering next to the live one (47,018.99) on the same page, i.e. two different values for the same
// index. If the source has no data we now render NOTHING rather than a fabricated number.
// Unknown keys returned by the API still render, using the name the API supplies.
const INDEX_META: Record<string, { name: string; metric: string }> = {
  twse_taiex: { name: "加權指數", metric: "TAIEX" },
  tpex_otci: { name: "櫃買指數", metric: "TPEx" },
  twii_0050: { name: "台灣50", metric: "Index" },
  sector_ele: { name: "電子類股", metric: "Sector Index" },
  sector_fin: { name: "金融保險", metric: "Sector Index" },
};

function isRecord(v: unknown): v is AnyRecord {
  return !!v && typeof v === "object";
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

// Returns "" when the row carries no date — there is no fallback date to substitute.
function pickDate(row: AnyRecord): string {
  const keys = ["trade_date", "date", "as_of_date", "updated_at"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  }
  return "";
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



// Service-token call for the curated homepage indices endpoint. Uses BACKEND_API_TOKEN
// (server-side only) so the homepage does not depend on a data api key.
async function safeFetchServiceJson(path: string): Promise<{ ok: boolean; payload: unknown | null }> {
  const baseUrl = getTwFeatureEngineBaseUrl();
  const token = process.env.BACKEND_API_TOKEN;
  if (!baseUrl || !token) {
    // Observability: when config is missing the homepage market card renders NOTHING (rule 2 — never
    // fabricate). Log WHICH piece is missing so a silent empty card is diagnosable from Vercel logs
    // instead of guessed at. No token value is ever logged.
    console.warn(
      `[homepage-market] fetch skipped for ${path}: missing ${!baseUrl ? "BACKEND_API_BASE_URL" : ""}${!baseUrl && !token ? " + " : ""}${!token ? "BACKEND_API_TOKEN" : ""}`,
    );
    return { ok: false, payload: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      // Upstream returned non-2xx → card renders nothing this request. Log the status (not the body,
      // which may carry sensitive detail) so a transient outage is visible rather than silent.
      console.warn(`[homepage-market] upstream ${path} responded ${res.status} ${res.statusText}`);
      return { ok: false, payload: null };
    }
    return { ok: true, payload: await res.json() };
  } catch (error) {
    // Timeout (AbortError after FETCH_TIMEOUT_MS) or network failure → card renders nothing. Log the
    // error name/message (never the token or full request) so intermittent disappearances are traceable.
    const name = error instanceof Error ? error.name : "UnknownError";
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[homepage-market] fetch ${path} failed: ${name}: ${message}`);
    return { ok: false, payload: null };
  } finally {
    clearTimeout(timeout);
  }
}

// Build a homepage index row from a live /v2/homepage/market-indices row. Returns null when the row
// carries no usable value — we never substitute a placeholder number.
function itemFromApiRow(row: AnyRecord): HomepageMarketItem | null {
  const key = typeof row.key === "string" ? row.key : "";
  const value = pickNumber(row, ["value", "index_value", "close", "last"]);
  if (!key || value === null) return null;

  const meta = INDEX_META[key];
  const name = meta?.name ?? (typeof row.name === "string" && row.name ? row.name : key);
  const change = toNumber(row.change) ?? 0;
  const changePct = toNumber(row.change_pct);
  const asOf = typeof row.as_of === "string" && row.as_of.length >= 10 ? row.as_of.slice(0, 10) : pickDate(row);

  return {
    id: key,
    name,
    metric: meta?.metric ?? "Index",
    value: formatNumber(value),
    change: formatSigned(change),
    percent: changePct === null ? "" : `${formatSigned(changePct)}%`,
    trend: inferTrend(changePct ?? change),
    asOf,
    sourceMode: "live_api",
  };
}

// THE single index source for the whole homepage. Both the hero panel and the marquee read this, so
// the same index can never render two different values again.
export async function getHomepageMarketSnapshot(): Promise<HomepageMarketSnapshot> {
  const result = await safeFetchServiceJson("/v2/homepage/market-indices");

  if (result.ok && isRecord(result.payload) && Array.isArray(result.payload.indices)) {
    const rawCount = result.payload.indices.length;
    const items = result.payload.indices
      .filter(isRecord)
      .map(itemFromApiRow)
      .filter((item): item is HomepageMarketItem => item !== null);

    // Observability: upstream answered 200 but nothing survived parsing — the card renders NOTHING.
    // This is the schema-drift signature (e.g. the API renamed `key`/`value`), which reads as a
    // persistent empty card. Log it (with the raw row count) so it is not mistaken for "no data".
    if (items.length === 0) {
      console.warn(`[homepage-market] upstream returned ${rawCount} row(s) but 0 parsed into usable indices — card will render nothing (possible schema drift)`);
    }

    if (items.length > 0) {
      const asOf =
        typeof result.payload.as_of === "string" && result.payload.as_of.length >= 10
          ? result.payload.as_of.slice(0, 10)
          : items[0].asOf;
      return {
        items,
        sourceMode: "live_api",
        // User-facing status only — no internal terms (no "fallback demo" / "live 跑馬").
        statusLabel: asOf ? `資料日期 ${asOf}` : "",
        updatedAt: asOf || null,
      };
    }
  }

  // Upstream succeeded but the payload was not the expected `{ indices: [...] }` shape — another
  // silent way the card ends up empty. safeFetchServiceJson already logged fetch-level failures; this
  // covers the "200 but wrong shape" case so every empty-card cause is traceable.
  if (result.ok && !(isRecord(result.payload) && Array.isArray(result.payload.indices))) {
    console.warn("[homepage-market] upstream 200 but payload has no `indices` array — unexpected shape, card will render nothing");
  }

  // No live data → render nothing. Showing a stale demo index is worse than showing none.
  return { items: [], sourceMode: "unavailable", statusLabel: "", updatedAt: null };
}

// The marquee mirrors the hero's snapshot exactly (same source, same values, same as_of). It used to
// call a different endpoint and carry its own hardcoded fallback list, which is what produced the
// second, contradictory 加權指數 on the homepage.
export async function getHomepageTickerTape(): Promise<HomepageTickerTape> {
  const snapshot = await getHomepageMarketSnapshot();
  return {
    items: snapshot.items,
    sourceMode: snapshot.sourceMode,
    statusLabel: snapshot.statusLabel,
    updatedAt: snapshot.updatedAt,
  };
}

// Coverage proof-points. Every number here comes from the coverage-facts SSOT (DB-verified). Slots
// with no verified fact emit NO number — the caller's non-numeric default renders instead. The old
// values (1,080 主檔 / 11,870 籌碼 / 37,196 月營收 / 12,268 財報列) were hardcoded and stale: the real
// monthly-revenue figure is 331,109 rows. Financial-statement row counts and a chip/master count are
// not in the SSOT yet, so they are intentionally omitted rather than hardcoded — wire them here once
// A台's stats endpoint (or a coverage-facts update) provides them.
export async function getHomepageCoverageMetrics(): Promise<HomepageCoverageMetric[]> {
  const twse = coverageFacts.twseDailyPrice;
  const revenue = coverageFacts.monthlyRevenue;

  // Live counts from A台's /v2/data-catalog/stats, when the flag is on AND the endpoint returns
  // usable rows. Today it 404s, so this map is always empty and every figure below comes from the
  // coverage-facts SSOT exactly as before — wiring is in place, switched off. Per-metric fallback:
  // a live count is used only for the specific metric it covers, never partially applied.
  const stats = await getCatalogStats();
  const ssot = `coverage-facts SSOT (DB-verified ${COVERAGE_FACTS_SNAPSHOT_DATE})`;
  const live = "live /v2/data-catalog/stats";

  const liveTwseStocks = stats.get("twse_daily_price")?.distinctTickers;
  const liveRevenueRows = stats.get("monthly_revenue")?.rows;

  return [
    {
      key: "twse_first",
      value: `${(liveTwseStocks ?? twse.stocks).toLocaleString("en-US")} 檔上市個股（TWSE）`,
      evidence: liveTwseStocks !== undefined ? live : ssot,
    },
    {
      key: "official_first",
      value: `月營收 ${(liveRevenueRows ?? revenue.rows).toLocaleString("en-US")} 列（自 ${revenue.earliestPeriod.slice(0, 4)}）`,
      evidence: liveRevenueRows !== undefined ? live : ssot,
    },
  ];
}

export const HOMEPAGE_REVALIDATE_SECONDS = REVALIDATE_SECONDS;
