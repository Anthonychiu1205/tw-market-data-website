import type { DatasetReconciliation } from "@/src/lib/reconciliation/dataset-reconciliation";

// Trust badge for dataset (coverage) pages. Renders the reconciliation state resolved server-side.
// null → renders nothing, so the page degrades gracefully until the persistence job lands data.
export function ReconciliationBadge({ data }: { data: DatasetReconciliation | null }) {
  if (!data) return null;

  if (data.status === "green") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
        title="每個值逐值對官方來源可追溯；此日期為最後一次對帳通過的日期。"
      >
        最後對官方對帳通過：{data.lastReconciledDate}
        <span aria-hidden>✓</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
      title="對帳流程進行中，通過日期尚未產生。"
    >
      對帳校驗中
    </span>
  );
}
