import type { Metadata } from "next";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export const metadata: Metadata = {
  title: "Webhooks",
  description: "設定 webhook destinations,即時接收月營收、財報公告與資料集上架事件。",
};

export default async function WebhooksPage() {
  return (
    <DashboardPageShell
      section="webhooks"
      currentPath="/dashboard/webhooks"
      currentHref="/dashboard/webhooks"
    />
  );
}
