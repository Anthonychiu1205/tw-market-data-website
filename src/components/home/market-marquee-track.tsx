"use client";

import type { MarketMarqueeViewItem } from "@/src/lib/market-marquee-snapshot";

type Props = {
  items: MarketMarqueeViewItem[];
};

function trendClass(trend: MarketMarqueeViewItem["trend"]) {
  if (trend === "up") return "text-rose-500";
  if (trend === "down") return "text-emerald-600";
  return "text-slate-500";
}

export function MarketMarqueeTrack({ items }: Props) {
  const duplicated = [...items, ...items];

  return (
    <div className="market-marquee group overflow-hidden">
      <div className="market-marquee__track group-hover:[animation-play-state:paused]">
        {duplicated.map((item, index) => (
          <div key={`${item.id}-${index}`} className="market-marquee__item">
            <span className="text-sm font-medium text-slate-700">{item.name}</span>
            <span className="text-sm font-semibold text-slate-900">{item.value}</span>
            <span className={`text-sm font-medium ${trendClass(item.trend)}`}>{item.percent || item.change}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .market-marquee {
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }

        .market-marquee__track {
          display: flex;
          width: max-content;
          animation: market-marquee-scroll 40s linear infinite;
          will-change: transform;
        }

        .market-marquee__item {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.2rem 1rem;
          white-space: nowrap;
          position: relative;
        }

        .market-marquee__item::after {
          content: "";
          width: 1px;
          height: 0.9rem;
          background: rgb(226 232 240 / 0.4);
          margin-left: 1rem;
        }

        @media (max-width: 768px) {
          .market-marquee__track {
            animation-duration: 34s;
          }

          .market-marquee__item {
            gap: 0.5rem;
            padding: 0.15rem 0.8rem;
          }

          .market-marquee__item::after {
            margin-left: 0.8rem;
          }
        }

        @keyframes market-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
