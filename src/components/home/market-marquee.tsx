import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getHomepageTickerTape } from "@/src/lib/homepage/homepage-market-data";

import { MarketMarqueeTrack } from "./market-marquee-track";

export async function MarketMarquee() {
  const { items, statusLabel } = await getHomepageTickerTape();

  return (
    <section className="bg-white">
      <MarketingContainer className="py-3">
        <MarketMarqueeTrack items={items} />
        <p className="mt-1 text-[11px] text-slate-500">{statusLabel}</p>
      </MarketingContainer>
    </section>
  );
}
