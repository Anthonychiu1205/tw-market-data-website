import type { Metadata } from "next";

import { privatePageMetadata } from "@/src/i18n/seo";

import { DashboardPageShell } from "@/src/components/dashboard/dashboard-page-shell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(
    locale,
    { en: "Usage", zh: "用量" },
    { en: "Usage overview with spend and request logs.", zh: "用量總覽,含花費與請求記錄。" },
  );
}

export default async function UsagePage() {
  return (
    <DashboardPageShell
      section="usage"
      currentPath="/usage"
      currentHref="/usage"
    />
  );
}
