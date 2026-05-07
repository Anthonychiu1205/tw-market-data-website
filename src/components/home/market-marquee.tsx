import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getMarketMarqueeSnapshotView } from "@/src/lib/market-marquee-snapshot";

import { MarketMarqueeTrack } from "./market-marquee-track";

export async function MarketMarquee() {
  const { items } = await getMarketMarqueeSnapshotView();

  return (
    <section className="bg-white">
      <MarketingContainer className="py-3">
        <MarketMarqueeTrack items={items} />
      </MarketingContainer>
    </section>
  );
}
