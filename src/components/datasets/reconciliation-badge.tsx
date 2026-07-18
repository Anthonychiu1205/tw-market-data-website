import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { DatasetReconciliation } from "@/src/lib/reconciliation/dataset-reconciliation";

// Trust badge for dataset (coverage) pages. Renders the reconciliation state resolved server-side.
// null → renders nothing, so the page degrades gracefully until the persistence job lands data.
export async function ReconciliationBadge({ data }: { data: DatasetReconciliation | null }) {
  if (!data) return null;

  const t = await getTranslations("datasets");

  if (data.status === "green") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
        title={t("badgeGreenTitle")}
      >
        {t("badgeGreenLabel")}
        {data.lastReconciledDate}
        <Check className="h-3.5 w-3.5" aria-hidden />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
      title={t("badgePendingTitle")}
    >
      {t("badgePending")}
    </span>
  );
}
