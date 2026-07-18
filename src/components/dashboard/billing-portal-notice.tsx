"use client";

import { useSearchParams } from "next/navigation";

/**
 * Shows a friendly note when /api/billing/portal redirected back with a ?portal= reason
 * (e.g. an entitlement-only user with no Polar customer clicked "設定付款方式"). Never a 500.
 */
export function BillingPortalNotice() {
  const portal = useSearchParams().get("portal");
  if (portal !== "no-subscription" && portal !== "unavailable") return null;

  const message =
    portal === "no-subscription"
      ? "訂閱方案後即可設定付款方式。"
      : "付款方式管理暫時無法開啟，請稍後再試。";

  return (
    <section className="mx-auto mb-4 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {message}
    </section>
  );
}
