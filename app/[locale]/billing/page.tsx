import type { Metadata } from "next";

import { privatePageMetadata } from "@/src/i18n/seo";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(
    locale,
    { en: "Billing", zh: "帳務" },
    { en: "Billing landing page for subscriptions and credits.", zh: "訂閱與 credits 帳務入口。" },
  );
}

export default async function BillingPage() {
  return (
    <DashboardPageShell
      section="billing"
      currentPath="/billing"
      currentHref="/billing"
    />
  );
}
