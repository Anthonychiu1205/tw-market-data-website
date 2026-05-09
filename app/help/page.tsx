import type { Metadata } from "next";

import { HelpCenterShell } from "@/src/components/help/help-center-shell";
import { helpCenterPageMeta } from "@/src/content/help-center";

export const metadata: Metadata = {
  title: `${helpCenterPageMeta.title} | TW Market Data`,
  description: helpCenterPageMeta.subtitle,
};

export default function HelpCenterPage() {
  return <HelpCenterShell mode="help" />;
}
