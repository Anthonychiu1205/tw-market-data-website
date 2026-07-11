import type { Metadata } from "next";
import Link from "next/link";

import { PricingShell } from "@/src/components/pricing/pricing-shell";
import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { getPricingPlanViews } from "@/src/lib/billing/plans";

// Offers derived from the local plan SSOT (plans.ts) — monthly, USD. Only tiers that carry a
// concrete price are emitted as schema.org Offer objects: an Offer without `price` /
// `priceCurrency` triggers a "missing field price" warning in Google Rich Results Test, so the
// contact-only (Enterprise) tier is intentionally excluded from the structured offers array
// (it is still shown on the visible page). Every emitted entry is a fully-specified Offer with
// a numeric price string + priceCurrency, which is the valid object type GSC expects.
const pricingOffers = getPricingPlanViews()
  .filter((plan) => plan.monthlyAmount !== null)
  .map((plan) => ({
    "@type": "Offer",
    name: `${plan.displayName} plan`,
    category: "SubscriptionService",
    url: getAbsoluteUrl("/pricing"),
    price: String(plan.monthlyAmount),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(plan.monthlyAmount),
      priceCurrency: "USD",
      unitText: "MONTH",
    },
  }));

// Public, statically generated, revalidated hourly. Plan data comes from the local
// SSOT (plans.ts constants), so this page never calls the backend at request time and
// stays instant regardless of API cold starts.
export const revalidate = 3600;

const offersLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "TW Market Data",
  description:
    "TWSE-first verified Taiwan financial data API 方案，資料可用性依 dataset coverage 與方案權限揭露。",
  brand: {
    "@type": "Brand",
    name: "TW Market Data",
  },
  url: getAbsoluteUrl("/pricing"),
  offers: pricingOffers,
};

export const metadata: Metadata = {
  title: "方案",
  description:
    "台股資料 API 方案與能力比較，採 TWSE-first verified baseline，並揭露資料 coverage 與限制。",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "方案價格 | TW Market Data",
    description:
      "比較台股 API 方案與配額，依 dataset coverage 與資料狀態規劃使用範圍。",
    url: "/pricing",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "方案價格 | TW Market Data",
    description:
      "台股資料 API 方案比較，支援量化研究與 AI agent financial data workflow。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersLd) }}
      />
      <Container className="space-y-10 py-12">
        <section className="border-b border-slate-200 pb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">方案價格</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/datasets" className={buttonClass("secondary")}>
              先查看可用資料集
            </Link>
            <Link href="/docs/introduction" className={buttonClass("secondary")}>
              查看 API 文件
            </Link>
          </div>
        </section>

        {/* Two product lines: the data API (priced below) and the upcoming research
            terminal (details pending SP1 — placeholder only, no hardcoded price). */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-900 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">資料 API</h2>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">現正供應</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              以 TWSE-first 官方台股資料為底的 REST API，依方案配額與用量計價。下方即為各層級方案。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">投研終端</h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">即將推出</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              線上投研工作台（因子、資料檢視與研究流程）。方案與定價細節將於後續公布。
            </p>
          </div>
        </section>

        <PricingShell />
      </Container>
    </>
  );
}
