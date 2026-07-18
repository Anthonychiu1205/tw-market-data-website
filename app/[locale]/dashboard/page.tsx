import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";
import { toDashboardSection } from "@/src/content/dashboard";

export const metadata: Metadata = {
  title: "控制台",
  description: "台股資料平台控制台。",
};

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
