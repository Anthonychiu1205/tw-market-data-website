import type { Metadata } from "next";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export const metadata: Metadata = {
  title: "Usage",
  description: "Usage overview with spend and request logs.",
};

export default async function UsagePage() {
  return (
    <DashboardPageShell
      section="usage"
      currentPath="/usage"
      currentHref="/usage"
    />
  );
}
