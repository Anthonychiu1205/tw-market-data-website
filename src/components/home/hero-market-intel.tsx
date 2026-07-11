import Link from "next/link";

import { getHomepageMarketSnapshot } from "@/src/lib/homepage/homepage-market-data";
import { getMarketMarqueeSnapshotView } from "@/src/lib/market-marquee-snapshot";

const MARKET_LABELS = ["加權指數", "櫃買指數", "台灣50", "電子類股", "金融保險"] as const;

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
  const [marketSnapshot, newsSnapshot] = await Promise.all([
    getHomepageMarketSnapshot(),
    getMarketMarqueeSnapshotView(),
  ]);
  const selectedRows = MARKET_LABELS.map((label) => marketSnapshot.items.find((item) => item.name === label)).filter((item) => item !== undefined);
  const marketRows = selectedRows.length > 0 ? selectedRows : marketSnapshot.items.slice(0, 5);
  const newsItems = newsSnapshot.news.slice(0, 4);

  return (
    <div className="relative hidden lg:block">
      <div className="ml-auto w-full max-w-[520px] space-y-5">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <p className="text-base font-semibold text-slate-900">市場指標</p>
            <Link href="/datasets" className="text-sm font-medium text-slate-400 transition hover:text-slate-700">
              查看全部資料 &gt;
            </Link>
          </div>
          <p className="mt-2 text-xs text-slate-500">{marketSnapshot.statusLabel}</p>

          <div className="pt-2">
            {marketRows.map((item) => (
              <div key={item.id} className="grid h-10 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-slate-100 text-sm last:border-b-0">
                <p className="truncate font-medium text-slate-800">{item.name}</p>
                <p className="font-medium tabular-nums text-slate-700">{item.value}</p>
                <p className={`font-semibold tabular-nums ${toneClass(item.trend)}`}>{item.percent || item.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <p className="text-base font-semibold text-slate-900">市場新聞</p>
            <Link href="/datasets" className="text-sm font-medium text-slate-400 transition hover:text-slate-700">
              查看更多 &gt;
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
