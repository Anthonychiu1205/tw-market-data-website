import type { Metadata } from "next";

import { privatePageMetadata } from "@/src/i18n/seo";
import { redirect } from "next/navigation";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";
import { toDashboardSection } from "@/src/content/dashboard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(
    locale,
    { en: "Console", zh: "控制台" },
    { en: "Console for the Taiwan market data platform.", zh: "台股資料平台控制台。" },
  );
}

type DashboardPageProps = {
  searchParams: Promise<{ section?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  if (params.section === "upgrade") {
    redirect("/billing/subscriptions");
  }

  const section = toDashboardSection(params.section);
  const currentHref = `/dashboard?section=${section}`;

  return <DashboardPageShell section={section} currentPath="/dashboard" currentHref={currentHref} />;
}
