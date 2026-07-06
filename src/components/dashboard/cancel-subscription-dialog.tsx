import { buttonClass } from "@/src/components/ui/button";

type SubscriptionInfo = {
  status: string;
};

type CancelSubscriptionDialogProps = {
  subscription: SubscriptionInfo;
};

function isManageableStatus(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "active" || normalized === "past_due";
}

/**
 * Subscription management is handled by the Polar Customer Portal (cancel, invoices,
 * payment method). We link out to the portal route, which resolves the customer by
 * external id (= NextAuth user id) and redirects to Polar.
 */
export function CancelSubscriptionDialog({ subscription }: CancelSubscriptionDialogProps) {
  if (!isManageableStatus(subscription.status)) {
    return null;
  }

  return (
    <div className="mt-5 space-y-2">
      <a href="/api/billing/portal" className={buttonClass("secondary", "h-10 rounded-lg px-4 text-xs")}>
        管理 / 取消訂閱
      </a>
      <p className="text-xs text-slate-500">於 Polar Customer Portal 取消訂閱、更新付款方式或下載發票。</p>
    </div>
  );
}
