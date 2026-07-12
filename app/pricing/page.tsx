import type { Metadata } from "next";

import { PricingShell } from "@/src/components/pricing/pricing-shell";
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
        </section>

        <PricingShell />
      </Container>
    </>
  );
}
