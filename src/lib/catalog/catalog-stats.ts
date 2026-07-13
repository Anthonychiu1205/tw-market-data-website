import "server-only";

// Live catalog statistics (real row counts) from A台's GET /v2/data-catalog/stats.
//
// STATUS: the endpoint does NOT exist yet — https://api.twmarketdata.com/v2/data-catalog/stats
// currently returns 404. So this whole path is OFF behind a flag and every caller falls back to the
// coverage-facts SSOT. Nothing on the site changes until BOTH are true:
//   1. CATALOG_STATS_ENABLED=1 is set, and
//   2. the endpoint actually returns usable rows.
// Even with the flag on, any failure/empty response falls back to the SSOT rather than showing a
// blank or a zero — a "0 rows" claim would be worse than the honest SSOT figure.
//
// The exact field names are NOT yet confirmed (we cannot read a contract off a 404), so parsing is
// deliberately tolerant of the shapes the sibling endpoint uses. Once A台 ships it, confirm the real
// keys against a live response and tighten `normalizeRow`.

const TIMEOUT_MS = 4000;

export type DatasetStat = {
  /** Total rows in the dataset's table. */
  rows?: number;
  /** Distinct instruments/tickers — a different 口徑 from rows; never mix the two. */
  distinctTickers?: number;
};

export function isCatalogStatsEnabled(): boolean {
  return process.env.CATALOG_STATS_ENABLED === "1";
}

/**
 * Live per-dataset stats keyed by dataset_key (both hyphen and underscore forms).
 * Returns an EMPTY map when the flag is off, the endpoint is unreachable, or it yields no usable
 * rows — callers must treat an empty map as "no live stats, use the SSOT".
 */
export async function getCatalogStats(): Promise<Map<string, DatasetStat>> {
  const result = new Map<string, DatasetStat>();
  if (!isCatalogStatsEnabled()) return result;

  const base = process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return result;
  const token = process.env.BACKEND_API_TOKEN;

  let json: Record<string, unknown> | null = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(`${base}/v2/data-catalog/stats`, {
        cache: "no-store",
        signal: controller.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) return result; // includes the current 404
    json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  } catch {
    return result;
  }
  if (!json) return result;

  // Accept an array of rows or an object keyed by dataset. Mirrors the reconciliation endpoint's
  // envelope ({count, <name>: [...], meta}).
  const container = (json.stats ?? json.datasets ?? json.data ?? json) as unknown;
  const rows: Record<string, unknown>[] = Array.isArray(container)
    ? (container as Record<string, unknown>[])
    : isRecord(container)
      ? Object.entries(container)
          .filter(([, value]) => isRecord(value))
          .map(([key, value]) => ({ dataset_key: key, ...(value as Record<string, unknown>) }))
      : [];

  for (const row of rows) {
    const key = String(row.dataset_key ?? row.dataset ?? row.id ?? row.table ?? "").trim();
    if (!key) continue;
    const stat = normalizeRow(row);
    if (!stat) continue;
    result.set(key, stat);
    result.set(key.replace(/_/g, "-"), stat);
    result.set(key.replace(/-/g, "_"), stat);
  }

  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function toCount(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  // A 0 is not a usable public statistic — treat it as "no data" so we never advertise "0 rows".
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function normalizeRow(row: Record<string, unknown>): DatasetStat | null {
  const rows = toCount(row.rows ?? row.row_count ?? row.count ?? row.total_rows);
  const distinctTickers = toCount(
    row.distinct_tickers ?? row.distinct_symbols ?? row.tickers ?? row.instruments,
  );
  if (rows === undefined && distinctTickers === undefined) return null;
  return { ...(rows !== undefined ? { rows } : {}), ...(distinctTickers !== undefined ? { distinctTickers } : {}) };
}
