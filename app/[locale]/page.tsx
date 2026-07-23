import { Suspense } from "react";

import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

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
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import { getHomepageCoverageMetrics } from "@/src/lib/homepage/homepage-market-data";
import { getHomepageDemoData } from "@/src/lib/homepage/demo-real-data";

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  return {
    title: isEn
      ? "Taiwan Stock Market Data API — TWSE/TPEx Historical Data & Institutional Flows"
      : "台股市場資料 API — TWSE/TPEx 歷史行情與三大法人籌碼",
    description: isEn
      ? "TWSE-first verified Taiwan financial data API — verified datasets with explicitly labeled coverage windows, sources, and limitations."
      : "TWSE-first verified Taiwan financial data API，提供已驗證資料集並明確標示 coverage window、來源與限制。",
    alternates: buildAlternates(l, "/"),
    openGraph: {
      title: isEn
        ? "Taiwan Stock Market Data API Infrastructure | TW Market Data"
        : "台股資料 API 基礎設施 | TW Market Data",
      description: isEn
        ? "A traceable, structurally consistent Taiwan stock data API for systems, quant research, and AI agent financial data workflows."
        : "為系統、量化研究與 AI agent financial data workflow 提供可追溯、結構一致的台股資料 API。",
      url: "/",
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? "Taiwan Stock Market Data API Infrastructure | TW Market Data"
        : "台股資料 API 基礎設施 | TW Market Data",
      description: isEn
        ? "A Taiwan stock data platform centered on TWSE-listed data, publicly disclosing data coverage and limitations, for quant research and AI agent workflows."
        : "以 TWSE 上市資料為核心的台股資料平台，公開揭露資料 coverage 與限制，支援量化研究與 AI agent workflow。",
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
  };
}

const PILLARS = [
  { key: "twseFirst", metricKey: "twse_first", metricFallback: "TWSE official-first" },
  { key: "lowLatency", metricKey: "low_latency", metricFallback: "API-first workflow" },
  { key: "officialFirst", metricKey: "official_first", metricFallback: "official/public-first" },
  { key: "clearBoundary", metricKey: "clear_boundary", metricFallback: "scoped dataset claims" },
] as const;

// Pre-resolved pillar copy (all `t()` text) so the grid can render with plain strings — no translator
// threading. Only the small metric sub-label comes from the (streamed) coverage API.
type PillarStatic = { key: string; metricKey: string; metricFallback: string; value: string; label: string; description: string };

// Shared grid markup used by BOTH the streamed real metrics and its fallback, so the block's height is
// byte-identical either way and only the sub-label text swaps in — zero layout shift.
function PillarsGrid({ pillars, coverageByKey }: { pillars: PillarStatic[]; coverageByKey: Record<string, string> }) {
  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-4">
      {pillars.map((pillar, index) => (
        <div
          key={pillar.key}
          className={`md:border-l md:border-slate-200 md:pl-8 ${index === 0 ? "md:border-l-0 md:pl-0" : ""}`}
        >
          <p className="text-3xl font-semibold leading-none tracking-tight text-slate-900 sm:text-4xl">{pillar.value}</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{pillar.label}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{coverageByKey[pillar.metricKey] ?? pillar.metricFallback}</p>
          <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
        </div>
      ))}
    </div>
  );
}

// The three data-dependent regions below stream in their own Suspense boundaries so the page shell (hero
// + all static sections = most of the page height) is server-rendered in the FIRST chunk. The footer
// therefore sits at its final position from first paint — no whole-page loading.tsx swap, no CLS. Each
// fallback reserves the region's exact rendered height (getHomepageDemoData is fetch-deduped across the
// two demo boundaries within a single render, so this is still one network call).
async function PillarsMetrics({ pillars, locale }: { pillars: PillarStatic[]; locale: string }) {
  const coverageMetrics = await getHomepageCoverageMetrics(locale);
  const coverageByKey = Object.fromEntries(coverageMetrics.map((metric) => [metric.key, metric.value])) as Record<string, string>;
  return <PillarsGrid pillars={pillars} coverageByKey={coverageByKey} />;
}

async function SourceOfTruthStreamed() {
  const demoData = await getHomepageDemoData();
  return <SourceOfTruthSectionDeferred realById={demoData.sourceOfTruth.byId} />;
}

async function ApiDemoStreamed() {
  const demoData = await getHomepageDemoData();
  return <ApiDemoSectionDeferred data={demoData.apiDemo} />;
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  // Resolve all pillar copy up front (translations are request-local, not network) so the grid renders
  // with plain strings. The real coverage metrics and the demo-panel data are NOT awaited here — they
  // stream into their own Suspense boundaries below, keeping the page shell from suspending (which is
  // what previously triggered the whole-page loading.tsx skeleton and the footer CLS).
  const pillarStatic: PillarStatic[] = PILLARS.map((pillar) => ({
    key: pillar.key,
    metricKey: pillar.metricKey,
    metricFallback: pillar.metricFallback,
    value: t(`pillars.${pillar.key}.value`),
    label: t(`pillars.${pillar.key}.label`),
    description: t(`pillars.${pillar.key}.description`),
  }));

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

          <Suspense fallback={<PillarsGrid pillars={pillarStatic} coverageByKey={{}} />}>
            <PillarsMetrics pillars={pillarStatic} locale={locale} />
          </Suspense>
        </MarketingContainer>
      </section>

      <MarketCoverageShowcase />
      <AgentWorkflowShowcase />
      <AgentDocumentsShowcase />
      <Suspense fallback={<div className="min-h-[730px]" />}>
        <SourceOfTruthStreamed />
      </Suspense>
      <AiAgentWorkflowSection />
      <Suspense fallback={<div className="min-h-[833px]" />}>
        <ApiDemoStreamed />
      </Suspense>

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
