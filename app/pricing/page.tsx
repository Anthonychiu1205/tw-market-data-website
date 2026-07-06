import type { Metadata } from "next";
import Link from "next/link";

import { PricingShell } from "@/src/components/pricing/pricing-shell";
import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

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
  offers: {
    "@type": "OfferCatalog",
    name: "TW Market Data Pricing Plans",
  },
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
        <PricingShell />
      </Container>
    </>
  );
}
