import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { faqPageMeta } from "@/src/content/help-center";

export const metadata: Metadata = {
  title: `${faqPageMeta.title} | TW Market Data`,
  description: faqPageMeta.subtitle,
  alternates: {
    canonical: "/docs/help-center",
  },
};

export default function FaqPage() {
  redirect("/docs/help-center");
}
