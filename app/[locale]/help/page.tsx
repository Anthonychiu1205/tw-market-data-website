import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { helpCenterPageMeta } from "@/src/content/help-center";

export const metadata: Metadata = {
  title: `${helpCenterPageMeta.title} | TW Market Data`,
  description: helpCenterPageMeta.subtitle,
  alternates: {
    canonical: "/help-center",
  },
};

export default function HelpCenterPage() {
  redirect("/help-center");
}
