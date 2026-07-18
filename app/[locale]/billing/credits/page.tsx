import type { Metadata } from "next";

import { privatePageMetadata } from "@/src/i18n/seo";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(
    locale,
    { en: "Billing · Credits", zh: "帳務 · Credits" },
    { en: "View credits and balance for the Taiwan market data platform.", zh: "台股資料平台 credits 與餘額檢視。" },
  );
}

export default async function BillingCreditsPage() {
  return (
    <DashboardPageShell
      section="billing"
      currentPath="/billing/credits"
      currentHref="/billing/credits"
    />
  );
}

