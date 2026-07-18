import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { HelpCenterShell } from "@/src/components/help/help-center-shell";
import { getHelpCategories, getHelpCenterPageMeta } from "@/src/content/help-center";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import { JsonLd } from "@/src/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const meta = getHelpCenterPageMeta(l);
  return {
    title: `${meta.title} | TW Market Data`,
    description: meta.subtitle,
    alternates: buildAlternates(l, "/help-center"),
    openGraph: {
      title: `${meta.title} | TW Market Data`,
      description: meta.subtitle,
      locale: OG_LOCALE[l],
    },
  };
}

export default async function HelpCenterStandalonePage() {
  const locale = await getLocale();
  const appLocale: AppLocale = locale === "en" ? "en" : "zh-TW";

  // FAQPage structured data built from the on-page Q&A (invisible; search-engine only).
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getHelpCategories(appLocale)
      .flatMap((category) => category.topics)
      .map((topic) => ({
        "@type": "Question",
        name: topic.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: topic.answer,
        },
      })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <HelpCenterShell mode="help" />
    </>
  );
}
