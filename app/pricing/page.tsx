import type { Metadata } from "next";

import { PricingShell } from "@/src/components/pricing/pricing-shell";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

const offersLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "TW Market Data",
  description:
    "台股資料 API 方案，支援 TWSE / TPEx 日線價格、MOPS 財報與營收、台股技術指標、三大法人與融資融券資料。",
  brand: {
    "@type": "Brand",
    name: "TW Market Data",
  },
  url: getAbsoluteUrl("/pricing"),
  offers: {
    "@type": "OfferCatalog",
    name: "TW Market Data Pricing Plans",
  },
};

export const metadata: Metadata = {
  title: "方案",
  description:
    "台股資料 API 方案與能力比較，涵蓋台灣股票資料、月營收 API、台股財報 API、台股技術指標與三大法人、融資融券資料。",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "方案價格 | TW Market Data",
    description:
      "比較台股 API 方案與配額，依需求使用 TWSE API、TPEx API、MOPS API 與量化查詢工具。",
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
