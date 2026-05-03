import Link from "next/link";

import { AgentDocumentsShowcase } from "@/src/components/home/agent-documents-showcase";
import { AgentWorkflowShowcase } from "@/src/components/home/agent-workflow-showcase";
import { MarketCoverageShowcase } from "@/src/components/home/market-coverage-showcase";
import { AiAgentWorkflowSection } from "@/src/components/home/ai-agent-workflow-section";
import { buttonClass } from "@/src/components/ui/button";
import { SourceOfTruthSection } from "@/src/components/home/source-of-truth-section";
import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { Tag } from "@/src/components/ui/tag";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <MarketingContainer className="py-14">
          <div className="fade-in">
            <Tag>台股資料平台</Tag>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">台股資料 API，為系統與量化流程而設計</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              專為 agent 與自動化系統打造，
              <br />
              低延遲存取、結構一致、來源可審計。
              <br />
              目前已可公開販售 8 個 dataset，其餘能力仍維持 invited / limited rollout 擴充中。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className={buttonClass("secondary")}>
                登入
              </Link>
              <Link href="/login" className={buttonClass("primary")}>
                註冊
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-b border-slate-200 bg-white py-14">
        <MarketingContainer className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股資料基礎設施</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              從官方來源取得資料，經標準化處理後提供一致、可追溯的 API。
            </p>
          </div>

          <div className="grid gap-0 border-y border-slate-200 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["8", "個可公開販售資料集", "TWSE、TPEx、monthly revenue、valuation、adjusted prices、issuer announcements、issuer profile、interest rate snapshot"],
              ["3", "個官方來源", "TWSE、TPEx、MOPS"],
              ["8", "條 available-now dataset routes", "對應 8 個可公開販售資料集的正式 API contract"],
              ["1", "個可信產品邊界", "available now / invited-preview / not-yet-available 明確分級"],
            ].map(([value, label, description], index) => (
              <div
                key={`${value}-${label}`}
                className={`py-5 ${index % 2 === 1 ? "md:pl-6" : "md:pr-6"} ${index >= 2 ? "md:border-t md:border-slate-200 xl:border-t-0" : ""} ${index > 0 ? "xl:border-l xl:border-slate-200 xl:pl-6" : ""}`}
              >
                <p className="text-4xl font-semibold leading-none tracking-tight text-slate-900 sm:text-5xl">{value}</p>
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

      <section className="bg-white py-14">
        <MarketingContainer className="space-y-8">
          <div className="border-b border-slate-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900">為開發者、量化研究與資料產品團隊打造</h2>
            <p className="mt-2 text-sm text-slate-600">聚焦可程式化接入與穩定交付，支援研究到上線流程；目前商售邊界為 8 個 dataset，非 full GA 全量資料供應。</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
              {["量化研究", "策略開發", "自動化系統", "Agent workflow", "資料產品團隊"].map((item) => (
                <span key={item} className="inline-flex items-center">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-0 border-y border-slate-200 md:grid-cols-3">
            {[
              ["資料集目錄", "查看目前 8 個可公開販售資料集與其餘 invited / preview 範圍。", "/datasets", "查看資料集"],
              ["API 參考", "直接查看 available-now endpoint、參數與回應格式。", "/api", "查看 API"],
              ["方案與控制台", "管理方案、用量與 API 金鑰；billing 仍維持 preview semantics。", "/dashboard", "前往控制台"],
            ].map(([title, description, href, action], index) => (
              <div key={title} className={`py-5 ${index > 0 ? "md:border-l md:border-slate-200 md:pl-6" : "md:pr-6"}`}>
                <p className="text-base font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
                <Link href={href} className="mt-3 inline-flex text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
                  {action}
                </Link>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">立即開始使用</h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              從 8 個 available-now dataset 開始接入台股資料 API。
              <br />
              其餘資料能力仍在 invited / preview 或後續 graduation 批次中。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/login" className={buttonClass("secondary")}>
                登入
              </Link>
              <Link href="/login" className={buttonClass("primary")}>
                註冊
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </section>
    </>
  );
}
