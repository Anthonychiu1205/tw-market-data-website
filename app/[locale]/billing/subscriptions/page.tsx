import type { Metadata } from "next";

import { privatePageMetadata } from "@/src/i18n/seo";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(
    locale,
    { en: "Billing · Subscriptions", zh: "帳務 · 訂閱方案" },
    { en: "Manage subscription plans for the Taiwan market data platform.", zh: "台股資料平台訂閱方案管理。" },
  );
}

export default async function BillingSubscriptionsPage() {
  return (
    <DashboardPageShell
      section="billing"
      currentPath="/billing/subscriptions"
      currentHref="/billing/subscriptions"
    />
  );
}

