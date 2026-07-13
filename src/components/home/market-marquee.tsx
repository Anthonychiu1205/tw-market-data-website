import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getHomepageTickerTape } from "@/src/lib/homepage/homepage-market-data";

import { MarketMarqueeTrack } from "./market-marquee-track";

export async function MarketMarquee() {
  const { items, statusLabel } = await getHomepageTickerTape();

  // Same single source as the hero panel — identical values, identical as_of. When there is no real
  // data we render nothing rather than a demo band with stale numbers.
  if (items.length === 0) return null;

  return (
    <section className="bg-white">
      <MarketingContainer className="py-3">
        <MarketMarqueeTrack items={items} />
        {statusLabel ? <p className="mt-1 text-[11px] text-slate-500">{statusLabel}</p> : null}
      </MarketingContainer>
    </section>
  );
}
