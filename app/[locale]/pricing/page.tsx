import type { Metadata } from "next";

import { PricingShell } from "@/src/components/pricing/pricing-shell";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { toMajor } from "@/src/lib/billing/money";
import { getPricingPlanViews } from "@/src/lib/billing/plans";

// Offers derived from the local plan SSOT (plans.ts) — monthly, USD. Only tiers that carry a
// concrete price are emitted as schema.org Offer objects: an Offer without `price` /
// `priceCurrency` triggers a "missing field price" warning in Google Rich Results Test, so the
// contact-only (Enterprise) tier is intentionally excluded from the structured offers array
// (it is still shown on the visible page). Every emitted entry is a fully-specified Offer with
// a numeric price string + priceCurrency, which is the valid object type GSC expects.
const pricingOffers = getPricingPlanViews()
  .filter((plan) => plan.monthlyAmountMinor !== null)
  .map((plan) => ({
    "@type": "Offer",
    name: `${plan.displayName} plan`,
    category: "SubscriptionService",
    url: getAbsoluteUrl("/pricing"),
    price: String(toMajor(plan.monthlyAmountMinor as number)),
    priceCurrency: plan.currency,
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(toMajor(plan.monthlyAmountMinor as number)),
      priceCurrency: plan.currency,
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
  // Absolute image URL clears Google's "商家資訊 / Merchant listings" required-field error for
  // image. Built from siteConfig so it stays correct per environment. Shipping/return fields are
  // optional and physical-commerce only — intentionally omitted for a SaaS product.
  image: getAbsoluteUrl("/og-image.png"),
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
          {/* B-11 self-serve copy (FRICTION-01 §C-1). */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["刷卡三分鐘開通", "線上付款即開 API key，無需簽約、不必等業務回電。"],
              ["隨時可取消", "月費方案隨時於帳戶頁停用，不綁約、不收取消費。"],
              ["全自助", "從註冊、取 key、看用量到升級，全部自己點；需要時才找我們。"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <PricingShell />
      </Container>
    </>
  );
}
