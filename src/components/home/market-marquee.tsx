import { getLocale, getTranslations } from "next-intl/server";

import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getHomepageTickerTape } from "@/src/lib/homepage/homepage-market-data";
import { indexDisplayName } from "@/src/lib/homepage/index-names";

import { MarketMarqueeTrack } from "./market-marquee-track";

export async function MarketMarquee() {
  const locale = await getLocale();
  const t = await getTranslations("home.marketPanel");
  const { items, updatedAt } = await getHomepageTickerTape();

  // Same single source as the hero panel — identical values, identical as_of. When there is no real
  // data we render nothing rather than a demo band with stale numbers.
  if (items.length === 0) return null;

  // Index display names follow locale via the SSOT (I18N-FIX-03 ②); the "資料日期/As of" line goes
  // through i18n (⑤) instead of the snapshot's zh statusLabel.
  const localizedItems = items.map((item) => ({ ...item, name: indexDisplayName(item.name, locale) }));

  return (
    <section className="bg-white">
      <MarketingContainer className="py-3">
        <MarketMarqueeTrack items={localizedItems} />
        {updatedAt ? <p className="mt-1 text-[11px] text-slate-500">{t("asOf", { date: updatedAt })}</p> : null}
      </MarketingContainer>
    </section>
  );
}
