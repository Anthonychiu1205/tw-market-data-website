import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { getHomepageMarketSnapshot } from "@/src/lib/homepage/homepage-market-data";
import { indexDisplayName } from "@/src/lib/homepage/index-names";
import { getMarketMarqueeSnapshotView } from "@/src/lib/market-marquee-snapshot";

// NOTE: these are DATA KEYS matched against the live snapshot's item.name (zh from the API), not
// display strings — they must stay zh or the market-row lookup breaks. Do not translate. Display
// names resolve through indexDisplayName (SSOT in @/src/lib/homepage/index-names).
// MKTCARD-01: the card is a fixed 4-indicator set in this exact order. 半導體 renders once the
// curated /v2/homepage/market-indices endpoint emits its sector_semi row (data exists in the TWSE
// industry index series); until then only the indicators with a real value show.
const MARKET_LABELS = ["加權指數", "電子類股", "金融保險", "半導體"] as const;

function toneClass(trend: "up" | "down" | "neutral") {
  // Taiwan convention: 紅漲綠跌 (red = up, green = down), aligned with market-marquee-track.
  if (trend === "up") return "text-rose-500";
  if (trend === "down") return "text-emerald-600";
  return "text-slate-500";
}

// A news row is only rendered as a link when it points at a real public (external) source.
// Internal/auth-gated destinations (e.g. /login) are never linked from this public marketing
// surface — a login wall is a dead end for visitors and an indexable auth page for crawlers.
function isPublicNewsHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export async function HeroMarketIntel() {
  const t = await getTranslations("home.marketPanel");
  const locale = await getLocale();
  const [marketSnapshot, newsSnapshot] = await Promise.all([
    getHomepageMarketSnapshot(),
    getMarketMarqueeSnapshotView(locale),
  ]);
  // Render exactly the fixed 4 indicators (MARKET_LABELS), in that order, and ONLY those that carry a
  // real live value — an index we have no value for is simply omitted. No placeholder rows and no
  // backfill with a stray index, so the card never shows a number we did not intend (rule 2).
  const byLabel = new Map(marketSnapshot.items.map((item) => [item.name, item]));
  const marketRows = MARKET_LABELS.map((label) => byLabel.get(label)).filter((item) => item !== undefined);
  const newsItems = newsSnapshot.news.slice(0, 4);

  return (
    <div className="relative hidden lg:block">
      <div className="ml-auto w-full max-w-[520px] space-y-5">
        {marketRows.length > 0 ? (
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-slate-900">{t("indicators")}</p>
            </div>
            <Link href="/datasets" className="text-sm font-medium text-slate-400 transition hover:text-slate-700">
              {t("viewAll")} &gt;
            </Link>
          </div>
          <div className="pt-4">
            {marketRows.map((item) => (
              <div key={item.id} className="grid h-10 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-slate-100 text-sm last:border-b-0">
                <p className="truncate font-medium text-slate-800">{indexDisplayName(item.name, locale)}</p>
                <p className="font-medium tabular-nums text-slate-700">{item.value}</p>
                <p className={`font-semibold tabular-nums ${toneClass(item.trend)}`}>{item.percent || item.change}</p>
              </div>
            ))}
          </div>
        </div>
        ) : null}

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <p className="text-base font-semibold text-slate-900">{t("news")}</p>
            <Link href="/datasets" className="text-sm font-medium text-slate-400 transition hover:text-slate-700">
              {t("viewMore")} &gt;
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {newsItems.map((news, index) => {
              const rowClass =
                "grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3 rounded-xl px-3 py-2 text-sm leading-6 text-slate-600 transition";
              const badge = (
                <span className="mt-0.5 inline-flex h-6 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-medium text-slate-500">
                  {news.source}
                </span>
              );
              const body = <span className="min-w-0 leading-6">{news.title}</span>;

              // Only rows backed by a real public source URL become links; the rest are
              // non-clickable text so crawlers are never funnelled into a login wall.
              return isPublicNewsHref(news.href) ? (
                <a
                  key={`hero-news-${index}`}
                  href={news.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${rowClass} hover:bg-slate-50 hover:text-slate-950`}
                >
                  {badge}
                  {body}
                </a>
              ) : (
                <div key={`hero-news-${index}`} className={rowClass}>
                  {badge}
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
