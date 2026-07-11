import type { Metadata } from "next";
import Link from "next/link";

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

export default async function HomePage() {
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
                台股資料 API，為系統與量化流程而設計
              </h1>
              <p className="mt-7 max-w-[700px] text-[19px] leading-9 text-slate-600">
                為 AI agent、自動化流程與量化研究提供一致的台股資料 API。<br />
                以 TWSE 上市資料為核心，已驗證資料集會清楚標示 coverage window、來源與限制。
              </p>
              <div className="mt-9 flex gap-4">
                <Link href="/login" className={buttonClass("secondary")}>
                  登入
                </Link>
                <Link href="/register" className={buttonClass("primary")}>
                  註冊
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
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股資料基礎設施</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              從官方來源取得資料，整理成穩定、可查詢、可追溯的 API。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-4">
            {[
              ["TWSE 優先", "已驗證基準", "以上市資料為核心，逐步擴充其他市場 coverage。", coverageByKey.twse_first ?? "TWSE official-first"],
              ["低延遲查詢", "面向 API 與 agent workflow", "以自動化查詢與研究流程為目標，持續優化讀取體驗。", coverageByKey.low_latency ?? "API-first workflow"],
              ["官方來源優先", "保留 lineage 與 data gaps", "以 TWSE、TPEx、MOPS 與官方公開來源為優先，避免來源混雜。", coverageByKey.official_first ?? "official/public-first"],
              ["邊界清楚", "不做過度宣稱", "不宣稱 full-market、adjusted price、survivorship-safe 或投資建議。", coverageByKey.clear_boundary ?? "scoped dataset claims"],
            ].map(([value, label, description, metric], index) => (
              <div
                key={`${value}-${label}`}
                className={`md:border-l md:border-slate-200 md:pl-8 ${index === 0 ? "md:border-l-0 md:pl-0" : ""}`}
              >
                <p className="text-3xl font-semibold leading-none tracking-tight text-slate-900 sm:text-4xl">{value}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{label}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{metric}</p>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
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
            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">立即開始使用</h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              從行情、財報到公司事件，快速接入台股資料 API。
              <br />
              目前採邀請制開放，依方案提供資料存取與使用配額。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/login" className={buttonClass("secondary")}>
                登入
              </Link>
              <Link href="/register" className={buttonClass("primary")}>
                註冊
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </section>
    </>
  );
}
