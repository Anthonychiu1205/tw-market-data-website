import Link from "next/link";

import { getMarketMarqueeSnapshotView } from "@/src/lib/market-marquee-snapshot";

const MARKET_LABELS = ["加權指數", "櫃買指數", "台灣50", "電子類股", "金融保險"] as const;

function toneClass(trend: "up" | "down" | "neutral") {
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-red-600";
  return "text-slate-500";
}

export async function HeroMarketIntel() {
  // Hero market cards follow the public snapshot. They update when
  // data/market-marquee-snapshot.json is refreshed.
  // Suggested refresh cadence: hourly during Taiwan market open window
  // (Mon-Fri 09:00-13:30 Asia/Taipei).
  const snapshot = await getMarketMarqueeSnapshotView();
  const selectedRows = MARKET_LABELS.map((label) => snapshot.items.find((item) => item.name === label)).filter((item) => item !== undefined);
  const marketRows = selectedRows.length > 0 ? selectedRows : snapshot.items.slice(0, 5);
  const newsItems = snapshot.news.slice(0, 4);

  return (
    <div className="relative hidden lg:block">
      <div className="ml-auto w-full max-w-[520px] space-y-5">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <p className="text-base font-semibold text-slate-900">市場指標</p>
            <Link href="/login" className="text-sm font-medium text-slate-400 transition hover:text-slate-700">
              查看全部資料 &gt;
            </Link>
          </div>

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
            <Link href="/login" className="text-sm font-medium text-slate-400 transition hover:text-slate-700">
              查看更多 &gt;
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {newsItems.map((news, index) => (
              <Link
                key={`hero-news-${index}`}
                href={news.href}
                className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3 rounded-xl px-3 py-2 text-sm leading-6 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <span className="mt-0.5 inline-flex h-6 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-medium text-slate-500">
                  {news.source}
                </span>
                <span className="min-w-0 leading-6">{news.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
