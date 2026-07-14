import "server-only";

// Front-end trust badge data source (AEO work order Part C). Reads the backend's persisted
// data_catalog.dataset_reconciliation record for a dataset and normalizes it into a badge state.
//
// Contract with the badge (src/components/datasets/reconciliation-badge.tsx):
//   - green + a date              → show "最後對官方對帳通過：YYYY-MM-DD ✓"
//   - amber/pending/checking      → show "對帳校驗中"
//   - unverified / red / absent   → null → hide entirely
// A red / failed state is intentionally NEVER surfaced (spec: 不顯示紅) — it hides, not amber.
//
// The endpoint (GET /v2/data-catalog/reconciliation/{dataset}, dataset_key eats both hyphen and
// underscore) returns 200 with an "unverified" status before the table is filled — a graceful
// degrade, not a 404. "unverified" maps to null so the badge stays hidden (rather than showing
// "校驗中" on every dataset) until the persistence job (db_write:false today) actually lands a
// reconciliation record. Once it lands green, ISR revalidation lights the badge with no rebuild.

export type DatasetReconciliation =
  | { status: "green"; lastReconciledDate: string }
  | { status: "amber" };

const TIMEOUT_MS = 4000;

export async function getDatasetReconciliation(slug: string): Promise<DatasetReconciliation | null> {
  const base = process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;

  // The reconciliation table keys on the dataset id (underscored), while the page uses a hyphenated
  // slug. Try both id forms across the likely catalog paths; the first record wins.
  const id = slug.replace(/-/g, "_");
  const token = process.env.BACKEND_API_TOKEN;
  const candidatePaths = [
    `/v2/data-catalog/reconciliation/${id}`,
    `/v2/data-catalog/dataset-reconciliation/${id}`,
    `/v2/data-catalog/reconciliation/${slug}`,
    `/data-catalog/dataset_reconciliation/${id}`,
  ];

  for (const path of candidatePaths) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      let response: Response;
      try {
        response = await fetch(`${base}${path}`, {
          cache: "no-store",
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } finally {
        clearTimeout(timeoutId);
      }
      if (!response.ok) continue;
      const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
      const parsed = normalize(json);
      if (parsed) return parsed;
    } catch {
      // Unreachable / timeout / bad JSON — try the next candidate, then fall through to null (hidden).
      continue;
    }
  }

  return null;
}

// Badge states that mean "reconciliation is genuinely in progress" → 校驗中. Everything else that
// isn't a dated green pass (unverified, red, failed, unknown) hides.
const AMBER_STATES = new Set(["amber", "pending", "checking", "in_progress", "verifying", "running"]);

// Bulk variant for pages that show many datasets at once (e.g. the /datasets overview): one call to
// GET /v2/data-catalog/reconciliation instead of one per dataset. Returns a map keyed by dataset_key
// in BOTH hyphen and underscore forms so callers can look up by page slug. Empty map on any failure.
export async function getAllDatasetReconciliations(): Promise<Map<string, DatasetReconciliation>> {
  const result = new Map<string, DatasetReconciliation>();
  const base = process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return result;
  const token = process.env.BACKEND_API_TOKEN;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(`${base}/v2/data-catalog/reconciliation`, {
        cache: "no-store",
        signal: controller.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) return result;
    const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    if (!json) return result;

    // Accept either an array of rows or an object keyed by dataset.
    // Live shape (verified against the API): {"count":0,"reconciliation":[...],"meta":{...}}.
    // `reconciliation` is SINGULAR — reading only `reconciliations`/`data` fell through to the
    // envelope itself and produced junk keys (count/meta) instead of dataset rows.
    const container = (json.reconciliation ?? json.reconciliations ?? json.data ?? json) as unknown;
    const rows: Record<string, unknown>[] = Array.isArray(container)
      ? (container as Record<string, unknown>[])
      : Object.entries(container as Record<string, unknown>).map(([key, value]) =>
          typeof value === "object" && value ? { dataset_key: key, ...(value as Record<string, unknown>) } : { dataset_key: key },
        );

    for (const row of rows) {
      const key = String(row.dataset_key ?? row.dataset ?? row.id ?? "").trim();
      if (!key) continue;
      const parsed = normalize(row);
      if (!parsed) continue;
      result.set(key, parsed);
      result.set(key.replace(/_/g, "-"), parsed);
      result.set(key.replace(/-/g, "_"), parsed);
    }
  } catch {
    return result;
  }

  return result;
}

function normalize(json: Record<string, unknown> | null): DatasetReconciliation | null {
  if (!json) return null;
  // Unwrap common envelopes ({ data: {...} } / { reconciliation: {...} }).
  const row =
    (json.data as Record<string, unknown> | undefined) ??
    (json.reconciliation as Record<string, unknown> | undefined) ??
    json;

  const badge = String(row.badge ?? row.status ?? "").toLowerCase();
  const date =
    getDateString(row.last_reconciled_date) ??
    getDateString(row.last_passed_date) ??
    getDateString(row.reconciled_date) ??
    getDateString(row.last_reconciled_at);

  // Only a dated green pass earns the ✓ badge.
  if (badge === "green" && date) return { status: "green", lastReconciledDate: date };
  // Genuine in-progress → 校驗中. unverified / red / failed / no data → hidden (return null).
  if (AMBER_STATES.has(badge)) return { status: "amber" };
  return null;
}

function getDateString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}
