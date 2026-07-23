import "server-only";

// Market Facts (/facts) data layer. Every number a Facts page shows is fetched from the live TWMD API
// here at build time (ISR) — NEVER hand-filled (a hardcoded stat is a drift landmine). If the upstream
// is unreachable or empty, the fetcher returns null and the page renders an honest "unavailable" state
// rather than fabricating data (rule 2: 假不了就不顯示).

// Server-side fetch base (may be an internal alias); PUBLIC_API is what we SHOW users (keyless, stable).
const FETCH_BASE = (process.env.BACKEND_API_BASE_URL ?? "https://api.twmarketdata.com").replace(/\/$/, "");
export const PUBLIC_API = "https://api.twmarketdata.com";

// 6h ISR: the rules timeline changes rarely, but this keeps the page in lock-step with the dataset
// without a redeploy (B-3: pages follow the source automatically).
const REVALIDATE_SECONDS = 60 * 60 * 6;
const FETCH_TIMEOUT_MS = 8000;

function apiHeaders(): HeadersInit {
  // The public v2 API is keyless; send the key when present (harmless either way, and covers any
  // environment where the edge requires it).
  const key = process.env.TWMD_API_KEY;
  return key ? { "X-API-Key": key } : {};
}

export type RuleChange = {
  rule_domain: string;
  rule_key: string;
  effective_date: string;
  end_date: string | null;
  prior_value: string | null;
  new_value: string | null;
  market: string;
  description: string | null;
  source_authority: string | null;
  source_url?: string | null;
};

export type FactsDataset<T> = {
  rows: T[];
  /** Data-through date derived from the rows themselves (max effective_date) — the page's as_of. */
  asOf: string | null;
  coverageStart: string | null;
  coverageEnd: string | null;
  rowCount: number;
  /** Keyless, user-facing URLs (carry the source declaration on the page). */
  csvUrl: string;
  jsonUrl: string;
};

async function fetchDataRows(slug: string): Promise<Record<string, unknown>[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${FETCH_BASE}/v2/datasets/${slug}?limit=500`, {
      headers: apiHeaders(),
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.warn(`[facts] upstream ${slug} responded ${res.status}`);
      return null;
    }
    const json = (await res.json()) as { data?: unknown; rows?: unknown };
    const rows = (json.data ?? json.rows) as Record<string, unknown>[] | undefined;
    return Array.isArray(rows) ? rows : null;
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[facts] fetch ${slug} failed: ${name}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// rules-history — Taiwan market-microstructure rule-change timeline (trading_rules_reference).
export async function getRulesHistory(): Promise<FactsDataset<RuleChange> | null> {
  const slug = "trading-rules-reference";
  const rows = (await fetchDataRows(slug)) as RuleChange[] | null;
  if (!rows || rows.length === 0) return null;

  const dates = rows.map((r) => r.effective_date).filter(Boolean).sort();
  return {
    // newest change first — a timeline reads most-recent-at-top.
    rows: [...rows].sort((a, b) => (b.effective_date ?? "").localeCompare(a.effective_date ?? "")),
    asOf: dates[dates.length - 1] ?? null,
    coverageStart: dates[0] ?? null,
    coverageEnd: dates[dates.length - 1] ?? null,
    rowCount: rows.length,
    csvUrl: `${PUBLIC_API}/v2/datasets/${slug}?format=csv&limit=500`,
    jsonUrl: `${PUBLIC_API}/v2/datasets/${slug}?limit=500`,
  };
}
