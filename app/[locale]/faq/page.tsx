import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getFaqPageMeta } from "@/src/content/help-center";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const meta = getFaqPageMeta(l);
  return {
    title: `${meta.title} | TW Market Data`,
    description: meta.subtitle,
    alternates: buildAlternates(l, "/help-center"),
  };
}

export default function FaqPage() {
  redirect("/help-center#api-data");
}
