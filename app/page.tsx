import type { Metadata } from "next";
import Link from "next/link";

import { AgentDocumentsShowcase } from "@/src/components/home/agent-documents-showcase";
import { AgentWorkflowShowcase } from "@/src/components/home/agent-workflow-showcase";
import { ApiDemoSection } from "@/src/components/home/api-demo-section";
import { HeroMarketIntel } from "@/src/components/home/hero-market-intel";
import { MarketMarquee } from "@/src/components/home/market-marquee";
import { MarketCoverageShowcase } from "@/src/components/home/market-coverage-showcase";
import { AiAgentWorkflowSection } from "@/src/components/home/ai-agent-workflow-section";
import { buttonClass } from "@/src/components/ui/button";
import { SourceOfTruthSection } from "@/src/components/home/source-of-truth-section";
import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TW Market Data",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: siteConfig.url,
  description:
    "台股資料 API，涵蓋行情、財報、營收、籌碼、公司事件、分類與查詢工具，適合系統、量化研究與 AI agent workflow。",
};

export const metadata: Metadata = {
  title: "台股資料 API 基礎設施",
  description:
    "台股資料 API，整合 TWSE、TPEx、MOPS 官方來源，提供台灣股票資料、月營收 API、台股財報 API、台股技術指標與三大法人、融資融券資料。",
  alternates: {
    canonical: "/",
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
      "整合 TWSE API、TPEx API、MOPS API 的台股資料平台，支援量化研究與 AI agent workflow。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

export default function HomePage() {
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
                涵蓋行情、財報、營收、籌碼與事件資料，讓模型與系統使用同一份可信資料底座。
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
              ["26", "個 available-now datasets", "涵蓋行情、財報、營收、籌碼、公司事件與分類資料"],
              ["<100ms", "目標 API latency", "為 agent workflow 與自動化查詢設計的低延遲讀取體驗"],
              ["3", "個官方核心來源", "TWSE、TPEx、MOPS official/public-first source policy"],
              ["1", "套可信資料邊界", "以 available-now、preview、not-yet-available 明確分級"],
            ].map(([value, label, description], index) => (
              <div
                key={`${value}-${label}`}
                className={`md:border-l md:border-slate-200 md:pl-8 ${index === 0 ? "md:border-l-0 md:pl-0" : ""}`}
              >
                <p className="text-4xl font-semibold leading-none tracking-tight text-slate-900 sm:text-[44px]">{value}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{label}</p>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <MarketCoverageShowcase />
      <AgentWorkflowShowcase />
      <AgentDocumentsShowcase />
      <SourceOfTruthSection />
      <AiAgentWorkflowSection />
      <ApiDemoSection />

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
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <Link href="/docs/sdk/python-sdk" className="hover:text-slate-900">
                Python SDK
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/docs/sdk/javascript-sdk" className="hover:text-slate-900">
                TypeScript SDK
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/docs/ai-agents/mcp-server-preview" className="hover:text-slate-900">
                MCP Preview
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/docs/ai-agents/agent-workflow-examples" className="hover:text-slate-900">
                AI Agent Workflow
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </section>
    </>
  );
}
