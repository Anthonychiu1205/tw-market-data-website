import type { Metadata } from "next";

import { HelpCenterShell } from "@/src/components/help/help-center-shell";
import { faqPageMeta } from "@/src/content/help-center";

export const metadata: Metadata = {
  title: `${faqPageMeta.title} | TW Market Data`,
  description: faqPageMeta.subtitle,
};

export default function FaqPage() {
  return <HelpCenterShell mode="faq" />;
}
