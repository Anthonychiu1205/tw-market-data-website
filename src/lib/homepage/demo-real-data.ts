import "server-only";

import { getTwFeatureEngineBaseUrl } from "@/src/lib/homepage/homepage-market-data";
import { pickServableLastGood } from "@/src/lib/homepage/homepage-market-lkg";
import { tickerDisplayName } from "@/src/lib/homepage/ticker-names";
import {
  DEMO_CACHE_TAG,
  type ApiDemoRealData,
  type DemoResponse,
  type HomepageDemoData,
} from "@/src/lib/homepage/demo-real-data-types";
import type { AgentWorkflowDemoConfig } from "@/src/components/home/agent-workflow-demo";

// DEMO-01: the homepage demo panels must show REAL own-API values, never fabricated numbers on real
// tickers (rule 2). This adapter fetches the actual `/v2/datasets/<slug>?symbol=<ticker>` row at
// build-time (daily ISR) with the service token, shows the real row verbatim (noise fields stripped)
// so no field is ever invented, and — like the hero market card — keeps a last-known-good per
// (slug,ticker) so a transient upstream blip does not blank the panel. Every panel carries the row's
// real as_of date; a panel with no real row (and no servable LKG) is simply omitted (never faked).

type AnyRecord = Record<string, unknown>;

// Cost-hardening: the demo panels don't need intraday freshness, and every fetch to a KEYED dataset
// could cost credits (if the entitled key is a metered key). `false` = cache in Vercel's shared Data
// Cache until the next deploy, so a (dataset,ticker) is fetched ~once per DEPLOY instead of
// per-24h-per-region — cost/freshness profile of a build-time bake, without duplicating the fetch +
// config logic into a separate script (rule 1). Deploys refresh the data; each row still shows its
// own real as_of date.
const DEMO_FETCH_REVALIDATE: number | false = false;
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

// Candidate keys (most-specific first) for the row's real as_of / data date. Broad on purpose: each
// dataset names its date differently (daily prices → trade_date; monthly revenue → revenue_month /
// data_as_of / period; financials → period_end_date / fiscal_period). Missing the real date used to
// make getDemoDatasetRow return null → the panel fell back to its FABRICATED code (the monthly_revenue
// "period 2026-03" regression). `ingested_at`/`updated_at` are last resorts (pipeline time, not data
// time).
const AS_OF_KEYS = [
  "trade_date",
  "date",
  "period_end_date",
  "as_of_date",
  "as_of",
  "data_as_of",
  "revenue_month",
  "period",
  "fiscal_period",
  "report_date",
  "announcement_date",
  "month",
  "updated_at",
  "ingested_at",
];

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  // Entitled key for the metered /v2/datasets/* endpoints (DEMO-FIX). Deliberately NOT
  // BACKEND_API_TOKEN — that is the homepage-only service token and the metered dataset endpoints
  // REJECT it with 401 (which silently broke every demo panel). Set DEMO_DATASETS_API_KEY (or the
  // existing TW_FEATURE_ENGINE_API_KEY) to a service key that carries dataset entitlement.
  //
  // When no entitled key is set we send NO auth: the keyless demo endpoints (twse-daily-price,
  // monthly-revenue, market-index) still return real data, while keyed datasets 401 and their panel
  // degrades honestly (never fabricates). The moment the key is provisioned, every panel goes real.
  const key = process.env.DEMO_DATASETS_API_KEY?.trim() || process.env.TW_FEATURE_ENGINE_API_KEY?.trim();
  if (key) headers["x-api-key"] = key;
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

async function fetchRawRows(slug: string, ticker: string, limit: number): Promise<AnyRecord[]> {
  const baseUrl = getTwFeatureEngineBaseUrl();
  if (!baseUrl) {
    console.warn(`[demo-real-data] no BACKEND_API_BASE_URL — ${slug}/${ticker} panel will use LKG or be omitted`);
    return [];
  }
  const path = `/v2/datasets/${slug}?symbol=${encodeURIComponent(ticker)}&limit=${limit}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: authHeaders(),
      signal: controller.signal,
      next: { revalidate: DEMO_FETCH_REVALIDATE, tags: [DEMO_CACHE_TAG] },
    });
    if (!res.ok) {
      console.warn(`[demo-real-data] ${slug}/${ticker} upstream responded ${res.status}`);
      return [];
    }
    return getRows(await res.json());
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[demo-real-data] ${slug}/${ticker} fetch failed: ${name}`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// Fetch one real dataset row for a ticker (daily ISR). On success returns the cleaned real row + its
// real as_of and refreshes the LKG. On failure falls back to a recent LKG (real value + real date).
// Returns null only when there is neither live data nor a servable cache — caller omits the panel.
export async function getDemoDatasetRow(slug: string, ticker: string): Promise<DemoDatasetRow | null> {
  const raw = (await fetchRawRows(slug, ticker, 1))[0] ?? null;
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

// Multi-row variant (e.g. last N quarters of financials) with the same per-key LKG safety. Returns
// cleaned rows newest-first + the as_of of the newest row, or null when neither live nor cached.
const lastGoodRowsByKey = new Map<string, { items: AnyRecord[]; asOf: string }>();

export async function getDemoDatasetRows(slug: string, ticker: string, limit: number): Promise<{ rows: AnyRecord[]; asOf: string } | null> {
  const raw = await fetchRawRows(slug, ticker, limit);
  const cleaned = raw.map(cleanRow).filter((r) => Object.keys(r).length > 0);
  const asOf = cleaned.length > 0 ? pickAsOf(raw[0]) : "";
  if (cleaned.length > 0 && asOf) {
    lastGoodRowsByKey.set(`${slug}:${ticker}:${limit}`, { items: cleaned, asOf });
    return { rows: cleaned, asOf };
  }
  const lkg = pickServableLastGood(lastGoodRowsByKey.get(`${slug}:${ticker}:${limit}`), Date.now());
  if (lkg) {
    console.warn(`[demo-real-data] ${slug}/${ticker} (rows) serving last-known-good as_of ${lkg.asOf}`);
    return { rows: lkg.items, asOf: lkg.asOf };
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

// ─── PR-B: real config for the agent-workflow + market-coverage demo tables ───────────────────────

function num(row: AnyRecord, keys: string[]): number | null {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v.replace(/[,%\s]/g, ""));
      if (v.trim() !== "" && Number.isFinite(n)) return n;
    }
  }
  return null;
}

// MOPS financial-statement amounts are in THOUSANDS of TWD (verified against the dataset: 2330
// quarterly revenue ≈ 1,134,103,440 thousand ≈ NT$1.13T, matching TSMC's real ~1T/quarter). Rendered
// in T / B TWD to mirror the previous display scale. Owner sanity-checks magnitude at acceptance.
function fmtAmountTWD(thousands: number): string {
  const billions = thousands / 1e6; // thousands → billions
  if (billions >= 1000) return `$${(billions / 1000).toFixed(2)}T`;
  return `$${billions.toFixed(1)}B`;
}
function fmtPct(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

// Quarter label like "25Q4" from the row's fiscal fields (fallback: derive from the period date).
function quarterLabel(row: AnyRecord): string {
  const y = num(row, ["fiscal_year"]);
  const q = num(row, ["fiscal_quarter"]);
  if (y && q) return `${String(y).slice(2)}Q${q}`;
  const d = pickAsOf(row);
  if (d.length >= 7) {
    const [yy, mm] = d.split("-");
    return `${yy.slice(2)}Q${Math.ceil(Number(mm) / 3)}`;
  }
  return "—";
}

const AGENT_WORKFLOW_TICKER = "2330";
const AGENT_WORKFLOW_QUARTERS = 8;

// Bilingual demo labels (I18N-FIX-03 ①). Real data VALUES + stock names (e.g. "2330 台積電") stay as
// they are; only headers / row labels / the query prompt follow locale.
const DEMO_L = {
  agentPrompt: { en: "TSMC revenue & gross margin, last 8 quarters", zh: "分析台積電近 8 季營收與毛利率變化" },
  coveragePrompt: { en: "Screen: stable YoY revenue growth & gross margin", zh: "找出近一年營收成長與毛利率穩定的股票" },
  revenue: { en: "Revenue", zh: "營收" },
  grossProfit: { en: "Gross Profit", zh: "營業毛利" },
  grossMargin: { en: "Gross Margin", zh: "毛利率" },
  operatingIncome: { en: "Operating Income", zh: "營業利益" },
  stock: { en: "Stock", zh: "股票" },
  revenueGrowth: { en: "Revenue Growth", zh: "營收成長" },
} as const;
const L = (label: { en: string; zh: string }, locale: string) => (locale === "en" ? label.en : label.zh);

// TSMC last-8-quarters real income table (approved redesign: quarterly, no fabricated R&D row).
export async function buildAgentWorkflowConfig(locale: string): Promise<AgentWorkflowDemoConfig | null> {
  const result = await getDemoDatasetRows("income-statement", AGENT_WORKFLOW_TICKER, AGENT_WORKFLOW_QUARTERS);
  if (!result || result.rows.length === 0) return null;
  const rows = result.rows; // newest-first
  const amount = (r: AnyRecord, keys: string[]) => {
    const v = num(r, keys);
    return v === null ? "—" : fmtAmountTWD(v);
  };
  return {
    queryPrompt: L(DEMO_L.agentPrompt, locale),
    statusLead: "Agent: searching",
    statusPill: "TW Market Data",
    tableHeaders: ["Item", ...rows.map(quarterLabel)],
    tableRows: [
      [L(DEMO_L.revenue, locale), ...rows.map((r) => amount(r, ["revenue", "net_revenue", "total_revenue"]))],
      [L(DEMO_L.grossProfit, locale), ...rows.map((r) => amount(r, ["gross_profit"]))],
      [L(DEMO_L.grossMargin, locale), ...rows.map((r) => {
        const rev = num(r, ["revenue", "net_revenue", "total_revenue"]);
        const gp = num(r, ["gross_profit"]);
        return rev && gp !== null ? fmtPct(gp / rev) : "—";
      })],
      [L(DEMO_L.operatingIncome, locale), ...rows.map((r) => amount(r, ["operating_income"]))],
      ["EPS", ...rows.map((r) => {
        const v = num(r, ["eps"]);
        return v === null ? "—" : v.toFixed(2);
      })],
    ],
    completionLabel: "Agent: analysis complete.",
    tableGridTemplateColumns: `1.2fr repeat(${rows.length},minmax(0,1fr))`,
    asOf: result.asOf,
  };
}

const COVERAGE_TICKERS: { symbol: string; zhName: string }[] = [
  { symbol: "2330", zhName: "台積電" },
  { symbol: "2454", zhName: "聯發科" },
  { symbol: "2317", zhName: "鴻海" },
  { symbol: "2308", zhName: "台達電" },
  { symbol: "3711", zhName: "日月光" },
  { symbol: "3231", zhName: "緯創" },
];

// Per-ticker real screen: TTM revenue, latest gross margin, YoY revenue growth (latest quarter vs the
// same quarter a year ago). Each metric is real or "—"; a ticker with no usable data is dropped.
export async function buildMarketCoverageConfig(locale: string): Promise<AgentWorkflowDemoConfig | null> {
  const results = await Promise.all(
    COVERAGE_TICKERS.map(async (tk) => ({ tk, data: await getDemoDatasetRows("income-statement", tk.symbol, 8) })),
  );
  const tableRows: string[][] = [];
  let latestAsOf = "";
  for (const { tk, data } of results) {
    if (!data || data.rows.length === 0) continue;
    const q = data.rows; // newest-first
    const rev0 = num(q[0], ["revenue", "net_revenue", "total_revenue"]);
    const gp0 = num(q[0], ["gross_profit"]);
    const rev4 = q.length > 4 ? num(q[4], ["revenue", "net_revenue", "total_revenue"]) : null;
    const ttm = q.slice(0, 4).reduce((sum, r) => {
      const v = num(r, ["revenue", "net_revenue", "total_revenue"]);
      return v === null ? sum : sum + v;
    }, 0);
    const growth = rev0 !== null && rev4 ? fmtPct((rev0 - rev4) / rev4) : "—";
    const margin = rev0 && gp0 !== null ? fmtPct(gp0 / rev0) : "—";
    const revenue = ttm > 0 ? fmtAmountTWD(ttm) : "—";
    tableRows.push([String(tableRows.length + 1), tickerDisplayName(tk.symbol, tk.zhName, locale), growth, margin, revenue]);
    if (data.asOf > latestAsOf) latestAsOf = data.asOf;
  }
  if (tableRows.length === 0) return null;
  return {
    queryPrompt: L(DEMO_L.coveragePrompt, locale),
    statusLead: "Agent: searching",
    statusPill: "TW Market Data",
    tableHeaders: ["ID", L(DEMO_L.stock, locale), L(DEMO_L.revenueGrowth, locale), L(DEMO_L.grossMargin, locale), L(DEMO_L.revenue, locale)],
    tableRows,
    completionLabel: "Agent: screen complete.",
    tableGridTemplateColumns: "0.6fr 1.2fr repeat(3,minmax(0,1fr))",
    asOf: latestAsOf,
  };
}
