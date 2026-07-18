import type { Metadata } from "next";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export const metadata: Metadata = {
  title: "Billing",
  description: "Billing landing page for subscriptions and credits.",
};

export default async function BillingPage() {
  return (
    <DashboardPageShell
      section="billing"
      currentPath="/billing"
      currentHref="/billing"
    />
  );
}
