import type { Metadata } from "next";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export const metadata: Metadata = {
  title: "Billing · Credits",
  description: "台股資料平台 credits 與餘額檢視。",
};

export default async function BillingCreditsPage() {
  return (
    <DashboardPageShell
      section="billing"
      currentPath="/billing/credits"
      currentHref="/billing/credits"
    />
  );
}

