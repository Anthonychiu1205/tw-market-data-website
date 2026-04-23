import Link from "next/link";

import { SectionHeading } from "@/src/components/docs/section-heading";

type CapabilityGroup = {
  title: string;
  items: Array<{ label: string; href: string }>;
};

const capabilityGroups: CapabilityGroup[] = [
  {
    title: "財報分析",
    items: [
      { label: "損益表", href: "/docs/api/financial-growth/income-statement" },
      { label: "現金流量表", href: "/docs/api/financial-growth/cash-flow-statement" },
      { label: "資產負債表", href: "/docs/api/financial-growth/balance-sheet" },
    ],
  },
  {
    title: "基本面分析",
    items: [
      { label: "月營收", href: "/docs/api/financial-growth/monthly-revenue" },
      { label: "估值資料", href: "/docs/api/financial-growth/valuation-data" },
    ],
  },
  {
    title: "市場分析",
    items: [
      { label: "股價日線（TWSE）", href: "/docs/api/market-prices/twse-daily-price" },
      { label: "股價日線（TPEx）", href: "/docs/api/market-prices/tpex-daily-price" },
      { label: "技術指標", href: "/docs/api/market-prices/technical-indicators" },
    ],
  },
  {
    title: "籌碼分析",
    items: [
      { label: "法人買賣", href: "/docs/api/capital-flow/institutional-flow" },
      { label: "融資融券", href: "/docs/api/capital-flow/margin-short" },
    ],
  },
];

export function DocsLandingContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="platform-overview">台股資料平台</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          本平台提供已標準化、可驗證的台股資料，適合 AI agent、量化策略與研究使用。
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading id="capability-groups">能力分類</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          {capabilityGroups.map((group) => (
            <article key={group.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-600 transition hover:text-slate-900 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
