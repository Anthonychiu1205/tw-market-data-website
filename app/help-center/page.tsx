import type { Metadata } from "next";

import { HelpCenterShell } from "@/src/components/help/help-center-shell";
import { helpCategories, helpCenterPageMeta } from "@/src/content/help-center";
import { JsonLd } from "@/src/components/seo/json-ld";

export const metadata: Metadata = {
  title: `${helpCenterPageMeta.title} | TW Market Data`,
  description: helpCenterPageMeta.subtitle,
  alternates: {
    canonical: "/help-center",
  },
};

// FAQPage structured data built from the on-page Q&A (invisible; search-engine only).
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: helpCategories
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

export default function HelpCenterStandalonePage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <HelpCenterShell mode="help" />
    </>
  );
}
