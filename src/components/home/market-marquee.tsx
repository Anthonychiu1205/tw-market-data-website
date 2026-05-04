import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getMarketMarqueeSnapshotView } from "@/src/lib/market-marquee-snapshot";

import { MarketMarqueeTrack } from "./market-marquee-track";

export async function MarketMarquee() {
  const { items, isFallback, isStale, updatedAt, asOfDate } = await getMarketMarqueeSnapshotView();

  return (
    <section className="border-b border-slate-200 bg-white">
      <MarketingContainer className="py-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-2 py-2 text-[11px] text-slate-500 sm:px-3">
          <span>Market Snapshot</span>
          <span>
            {updatedAt ? `updated ${new Date(updatedAt).toLocaleString("zh-TW", { hour12: false })}` : "updated unavailable"}
            {asOfDate ? ` · as of ${asOfDate}` : ""}
          </span>
        </div>
        {isFallback ? (
          <div className="flex min-h-[52px] items-center justify-center px-3 py-3 text-center text-sm text-slate-500">
            市場指數資料同步中，請稍後重整。
          </div>
        ) : (
          <>
            <MarketMarqueeTrack items={items} />
            {isStale ? (
              <div className="border-t border-slate-200 px-3 py-2 text-center text-xs text-amber-700">目前為較舊快照，資料更新中。</div>
            ) : null}
          </>
        )}
      </MarketingContainer>
    </section>
  );
}
