import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { AgentDocumentsShowcase } from "@/src/components/home/agent-documents-showcase";
import { AgentWorkflowShowcase } from "@/src/components/home/agent-workflow-showcase";
import { ApiDemoSectionDeferred } from "@/src/components/home/api-demo-section-deferred";
import { HeroMarketIntel } from "@/src/components/home/hero-market-intel";
import { MarketMarquee } from "@/src/components/home/market-marquee";
import { MarketCoverageShowcase } from "@/src/components/home/market-coverage-showcase";
import { AiAgentWorkflowSection } from "@/src/components/home/ai-agent-workflow-section";
import { buttonClass } from "@/src/components/ui/button";
import { SourceOfTruthSectionDeferred } from "@/src/components/home/source-of-truth-section-deferred";
import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { EN_HOMEPAGE_READY, hreflangLanguages } from "@/src/config/i18n";
import { getHomepageCoverageMetrics } from "@/src/lib/homepage/homepage-market-data";

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TW Market Data",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: siteConfig.url,
  description:
    "以 TWSE 上市資料為核心的台股資料 API，提供已驗證資料集並揭露 coverage 與限制，適合系統、量化研究與 AI agent workflow。",
};

export const metadata: Metadata = {
  title: "台股資料 API 基礎設施",
  description:
    "TWSE-first verified Taiwan financial data API，提供已驗證資料集並明確標示 coverage window、來源與限制。",
  alternates: {
    canonical: "/",
    // Reciprocal hreflang cluster with /en — only emitted once the English homepage is
    // content-complete (EN_HOMEPAGE_READY), so we never point hreflang at a noindex draft.
    ...(EN_HOMEPAGE_READY ? { languages: hreflangLanguages("/", "/en") } : {}),
  },
  openGraph: {
    title: "台股資料 API 基礎設施 | TW Market Data",
    description:
      "為系統、量化研究與 AI agent financial data workflow 提供可追溯、結構一致的台股資料 API。",
    url: "/",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "台股資料 API 基礎設施 | TW Market Data",
    description:
      "以 TWSE 上市資料為核心的台股資料平台，公開揭露資料 coverage 與限制，支援量化研究與 AI agent workflow。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

const PILLARS = [
  { key: "twseFirst", metricKey: "twse_first", metricFallback: "TWSE official-first" },
  { key: "lowLatency", metricKey: "low_latency", metricFallback: "API-first workflow" },
  { key: "officialFirst", metricKey: "official_first", metricFallback: "official/public-first" },
  { key: "clearBoundary", metricKey: "clear_boundary", metricFallback: "scoped dataset claims" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");
  const coverageMetrics = await getHomepageCoverageMetrics();
  const coverageByKey = Object.fromEntries(coverageMetrics.map((metric) => [metric.key, metric.value])) as Record<string, string>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd) }}
      />
      <section className="border-b border-slate-200 bg-white">
        <MarketingContainer className="max-w-7xl">
          <div className="grid items-start gap-14 pt-10 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pt-12 lg:pb-20 xl:pt-14">
            <div className="max-w-3xl pt-2 lg:pt-20 xl:pt-24">
              <h1 className="max-w-[760px] text-[48px] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 lg:text-[60px]">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-[700px] text-[19px] leading-9 text-slate-600">
                {t("hero.subhead1")}<br />
                {t("hero.subhead2")}
              </p>
              <div className="mt-9 flex gap-4">
                <Link href="/login" className={buttonClass("secondary")}>
                  {t("cta.signIn")}
                </Link>
                <Link href="/register" className={buttonClass("primary")}>
                  {t("cta.register")}
                </Link>
              </div>
            </div>

            <div className="lg:self-start lg:pt-0 xl:pt-0">
              <HeroMarketIntel />
            </div>
          </div>
        </MarketingContainer>
      </section>

      <MarketMarquee />

      <section className="border-b border-slate-200 bg-white py-14">
        <MarketingContainer className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("infra.heading")}</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {t("infra.subheading")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.key}
                className={`md:border-l md:border-slate-200 md:pl-8 ${index === 0 ? "md:border-l-0 md:pl-0" : ""}`}
              >
                <p className="text-3xl font-semibold leading-none tracking-tight text-slate-900 sm:text-4xl">{t(`pillars.${pillar.key}.value`)}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{t(`pillars.${pillar.key}.label`)}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{coverageByKey[pillar.metricKey] ?? pillar.metricFallback}</p>
                <p className="mt-2 text-sm text-slate-600">{t(`pillars.${pillar.key}.description`)}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <MarketCoverageShowcase />
      <AgentWorkflowShowcase />
      <AgentDocumentsShowcase />
      <SourceOfTruthSectionDeferred />
      <AiAgentWorkflowSection />
      <ApiDemoSectionDeferred />

      <section className="bg-white py-14">
        <MarketingContainer>
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">{t("finalCta.heading")}</h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {t("finalCta.body1")}
              <br />
              {t("finalCta.body2")}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/login" className={buttonClass("secondary")}>
                {t("cta.signIn")}
              </Link>
              <Link href="/register" className={buttonClass("primary")}>
                {t("cta.register")}
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </section>
    </>
  );
}
