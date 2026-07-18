import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { HelpCenterShell } from "@/src/components/help/help-center-shell";
import { getHelpCategories, helpCenterPageMeta } from "@/src/content/help-center";
import type { AppLocale } from "@/src/i18n/locales";
import { JsonLd } from "@/src/components/seo/json-ld";

export const metadata: Metadata = {
  title: `${helpCenterPageMeta.title} | TW Market Data`,
  description: helpCenterPageMeta.subtitle,
  alternates: {
    canonical: "/help-center",
  },
};

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
