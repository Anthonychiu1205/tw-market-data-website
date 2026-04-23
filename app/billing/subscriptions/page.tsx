import type { Metadata } from "next";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export const metadata: Metadata = {
  title: "Billing · Subscriptions",
  description: "台股資料平台訂閱方案管理。",
};

export default async function BillingSubscriptionsPage() {
  return (
    <DashboardPageShell
      section="billing"
      currentPath="/billing/subscriptions"
      currentHref="/billing/subscriptions"
    />
  );
}

