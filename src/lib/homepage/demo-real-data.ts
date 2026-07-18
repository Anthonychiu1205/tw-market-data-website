import "server-only";

import { getTwFeatureEngineBaseUrl } from "@/src/lib/homepage/homepage-market-data";
import { pickServableLastGood } from "@/src/lib/homepage/homepage-market-lkg";
import type {
  ApiDemoRealData,
  DemoResponse,
  HomepageDemoData,
} from "@/src/lib/homepage/demo-real-data-types";

// DEMO-01: the homepage demo panels must show REAL own-API values, never fabricated numbers on real
// tickers (rule 2). This adapter fetches the actual `/v2/datasets/<slug>?symbol=<ticker>` row at
// build-time (daily ISR) with the service token, shows the real row verbatim (noise fields stripped)
// so no field is ever invented, and — like the hero market card — keeps a last-known-good per
// (slug,ticker) so a transient upstream blip does not blank the panel. Every panel carries the row's
// real as_of date; a panel with no real row (and no servable LKG) is simply omitted (never faked).

type AnyRecord = Record<string, unknown>;

const REVALIDATE_SECONDS = 86400; // daily ISR
const FETCH_TIMEOUT_MS = 4500;

// Fields that are backend bookkeeping / noise, not part of the data a caller cares to see. Stripped
// from the displayed row so the demo response stays clean without inventing anything.
const NOISE_KEYS = new Set([
  "id",
  "raw_payload",
  "created_at",
  "updated_at",
  "ingested_at",
  "source_canonical",
  "source_name",
  "no_trade",
  "market",
]);

// Candidate keys (most-specific first) for the row's real as_of / trade date.
const AS_OF_KEYS = [
  "trade_date",
  "date",
  "period_end_date",
  "as_of_date",
  "as_of",
  "period",
  "announcement_date",
  "updated_at",
];

function authHeaders(): Record<string, string> {
  const token = process.env.BACKEND_API_TOKEN ?? process.env.BACKEND_API_KEY ?? undefined;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) {
    // Backend accepts either; send both to match the marquee helper that already works in prod.
    headers["x-api-key"] = token;
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function getRows(payload: unknown): AnyRecord[] {
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload)) return payload.filter((r): r is AnyRecord => !!r && typeof r === "object");
  for (const key of ["rows", "data", "items", "results"]) {
    const value = (payload as AnyRecord)[key];
    if (Array.isArray(value)) return value.filter((r): r is AnyRecord => !!r && typeof r === "object");
  }
  return [];
}

function pickAsOf(row: AnyRecord): string {
  for (const key of AS_OF_KEYS) {
    const value = row[key];
    if (typeof value === "string" && value.length >= 7) return value.slice(0, 10);
  }
  return "";
}

// Strip noise keys and null/empty values so the displayed row is clean but 100% real.
function cleanRow(row: AnyRecord): AnyRecord {
  const out: AnyRecord = {};
  for (const [key, value] of Object.entries(row)) {
    if (NOISE_KEYS.has(key)) continue;
    if (value === null || value === undefined || value === "") continue;
    out[key] = value;
  }
  return out;
}

export type DemoDatasetRow = { row: AnyRecord; asOf: string };

// Per-(slug,ticker) last-known-good, held in module memory (per warm instance) — same rationale as the
// hero card LKG: a transient upstream failure must not blank a panel that had real data seconds ago.
const lastGoodByKey = new Map<string, { items: [AnyRecord]; asOf: string }>();

async function fetchRawRow(slug: string, ticker: string): Promise<AnyRecord | null> {
  const baseUrl = getTwFeatureEngineBaseUrl();
  if (!baseUrl) {
    console.warn(`[demo-real-data] no BACKEND_API_BASE_URL — ${slug}/${ticker} panel will use LKG or be omitted`);
    return null;
  }
  const path = `/v2/datasets/${slug}?symbol=${encodeURIComponent(ticker)}&limit=1`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: authHeaders(),
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.warn(`[demo-real-data] ${slug}/${ticker} upstream responded ${res.status}`);
      return null;
    }
    const rows = getRows(await res.json());
    return rows[0] ?? null;
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[demo-real-data] ${slug}/${ticker} fetch failed: ${name}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Fetch one real dataset row for a ticker (daily ISR). On success returns the cleaned real row + its
// real as_of and refreshes the LKG. On failure falls back to a recent LKG (real value + real date).
// Returns null only when there is neither live data nor a servable cache — caller omits the panel.
export async function getDemoDatasetRow(slug: string, ticker: string): Promise<DemoDatasetRow | null> {
  const raw = await fetchRawRow(slug, ticker);
  if (raw) {
    const asOf = pickAsOf(raw);
    const cleaned = cleanRow(raw);
    if (asOf && Object.keys(cleaned).length > 0) {
      lastGoodByKey.set(`${slug}:${ticker}`, { items: [cleaned], asOf });
      return { row: cleaned, asOf };
    }
  }
  const lkg = pickServableLastGood(lastGoodByKey.get(`${slug}:${ticker}`), Date.now());
  if (lkg) {
    console.warn(`[demo-real-data] ${slug}/${ticker} serving last-known-good as_of ${lkg.asOf}`);
    return { row: lkg.items[0], asOf: lkg.asOf };
  }
  return null;
}

// ─── Orchestration: real data for the two PR-A demo panels ───────────────────────────────────────
// Both panels resolve 2330's daily price through the SAME getDemoDatasetRow("twse-daily-price","2330")
// call, so the value can never diverge between them again (rule 1 — the old dual-892 bug).

// api-demo endpoint id → backend dataset slug. Ids match endpointOptions in api-demo-section.tsx.
const API_DEMO_ENDPOINTS: { id: string; slug: string }[] = [
  { id: "monthlyRevenue", slug: "monthly-revenue" },
  { id: "twseDailyPrice", slug: "twse-daily-price" },
  { id: "incomeStatement", slug: "income-statement" },
  { id: "technicalIndicators", slug: "technical-indicators" },
];
const API_DEMO_TICKERS: { symbol: string; name: string }[] = [
  { symbol: "2330", name: "台積電" },
  { symbol: "2317", name: "鴻海" },
  { symbol: "2454", name: "聯發科" },
  { symbol: "2308", name: "台達電" },
];

// source-of-truth item id (home-source-of-truth.ts) → backend dataset slug, all for 2330.
const SOURCE_OF_TRUTH_SLUGS: Record<string, string> = {
  monthly_revenue: "monthly-revenue",
  twse_daily_price: "twse-daily-price",
  financial_statements: "income-statement",
  technical_indicators: "technical-indicators",
  valuation: "valuation-data",
  institutional_flow: "institutional-flow",
  issuer_announcements: "issuer-announcements",
  day_trading_suspension: "day-trading-suspension",
};

// Types (DemoResponse / ApiDemoRealData / HomepageDemoData) live in demo-real-data-types.ts so client
// components can import them without touching this server-only module.

function toResponse(slug: string, symbol: string, row: DemoDatasetRow | null): DemoResponse {
  if (!row) return null;
  return { dataset: slug.replace(/-/g, "_"), symbol, asOf: row.asOf, data: [row.row] };
}

// Server-only. Fetches every (endpoint × ticker) and (source-of-truth dataset) real row for the two
// PR-A panels, daily ISR. All values are real or the panel degrades honestly. NEVER imported by a
// "use client" file — the caller is the server page, which passes only the resulting serialized data.
export async function getHomepageDemoData(): Promise<HomepageDemoData> {
  const responses: Record<string, Record<string, DemoResponse>> = {};
  const sotById: Record<string, { code: string; asOf: string }> = {};

  await Promise.all([
    ...API_DEMO_ENDPOINTS.map(async (ep) => {
      responses[ep.id] = {};
      await Promise.all(
        API_DEMO_TICKERS.map(async (tk) => {
          const row = await getDemoDatasetRow(ep.slug, tk.symbol);
          responses[ep.id][tk.symbol] = toResponse(ep.slug, tk.symbol, row);
        }),
      );
    }),
    ...Object.entries(SOURCE_OF_TRUTH_SLUGS).map(async ([id, slug]) => {
      const row = await getDemoDatasetRow(slug, "2330");
      const response = toResponse(slug, "2330", row);
      if (response) {
        sotById[id] = { code: JSON.stringify(response, null, 2), asOf: response.asOf };
      }
    }),
  ]);

  return { apiDemo: { responses }, sourceOfTruth: { byId: sotById } };
}
