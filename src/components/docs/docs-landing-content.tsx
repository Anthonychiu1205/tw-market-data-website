import Link from "next/link";

import { SectionHeading } from "@/src/components/docs/section-heading";

type CapabilityGroup = {
  title: string;
  items: Array<{ label: string; href: string }>;
};

const capabilityGroups: CapabilityGroup[] = [
  {
    title: "Available now（26 datasets）",
    items: [
      { label: "TWSE 日線價格", href: "/docs/api/market-prices/twse-daily-price" },
      { label: "TPEx 日線價格", href: "/docs/api/market-prices/tpex-daily-price" },
      { label: "月營收", href: "/docs/api/financial-growth/monthly-revenue" },
      { label: "估值資料", href: "/docs/api/financial-growth/valuation-data" },
    ],
  },
  {
    title: "Available now（core）",
    items: [
      { label: "調整價格", href: "/docs/api/market-prices/adjusted-prices" },
      { label: "公告資訊", href: "/docs/api/company-events/issuer-announcements" },
      { label: "公司基本資料", href: "/docs/api/company/issuer-profile" },
      { label: "利率", href: "/docs/api/market-prices/interest-rate" },
    ],
  },
  {
    title: "Available now（extended）",
    items: [
      { label: "損益表", href: "/docs/api/financial-growth/income-statement" },
      { label: "現金流量表", href: "/docs/api/financial-growth/cash-flow-statement" },
      { label: "資產負債表", href: "/docs/api/financial-growth/balance-sheet" },
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
          本平台目前提供 26 個可公開使用的資料集。實際可用範圍與配額會依帳號方案與 API 存取權限而定。
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

      <section className="space-y-3 border-t border-slate-200 pt-8">
        <SectionHeading id="upgrade-value">為什麼需要升級</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>目前 public sellable boundary：26 個資料集</li>
          <li>不同方案在可用資料範圍、配額與速率限制上有所差異</li>
          <li>實際帳務與計費顯示以控制台與當前服務條款為準</li>
        </ul>
        <p className="text-sm leading-7 text-slate-600">升級影響的是配額、速率與支援層級；目前可販售邊界已完成 26 dataset 對齊。</p>
        <div>
          <Link
            href="/billing/subscriptions"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            查看方案
          </Link>
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 pt-8">
        <SectionHeading id="auth-entitlement-usage-billing">Auth / Entitlement / Usage / Billing</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>API key model：`X-API-Key` header。</li>
          <li>Dataset access：依帳號方案與 API key 權限套用可用資料範圍。</li>
          <li>Usage summary：可透過 account 相關 API 查看當前使用概況。</li>
          <li>Billing information：以控制台顯示與官方通知為準。</li>
        </ul>
      </section>
    </div>
  );
}
