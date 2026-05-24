import type { Metadata } from "next";

import { HelpCenterIndex } from "@/src/components/help-center/help-center-shell";
import { helpCenterMeta } from "@/src/content/help-center-articles";

export const metadata: Metadata = {
  title: `${helpCenterMeta.title} | TW Market Data`,
  description: helpCenterMeta.description,
  alternates: {
    canonical: "/help-center",
  },
};

export default function StandaloneHelpCenterPage() {
  return <HelpCenterIndex />;
}
