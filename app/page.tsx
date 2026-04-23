import Link from "next/link";

import { AgentDocumentsShowcase } from "@/src/components/home/agent-documents-showcase";
import { AgentWorkflowShowcase } from "@/src/components/home/agent-workflow-showcase";
import { MarketCoverageShowcase } from "@/src/components/home/market-coverage-showcase";
import { buttonClass } from "@/src/components/ui/button";
import { SourceOfTruthSection } from "@/src/components/home/source-of-truth-section";
import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { Tag } from "@/src/components/ui/tag";
import { datasetProducts } from "@/src/content/site";

export default function HomePage() {
  const liveTopics = datasetProducts.filter((item) => item.readiness === "available_now");
  const upcomingTopics = datasetProducts.filter((item) => item.readiness !== "available_now");

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <MarketingContainer className="py-14">
          <div className="fade-in">
            <Tag>台股資料平台</Tag>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">台股資料 API，為系統與量化流程而設計</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              專為 agent 與自動化系統打造，
              <br />
              低延遲存取、結構一致、來源可審計，
              <br />
              支援策略開發與決策流程。
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
              ["2 個已上線主題", "issuer-profile、issuer-announcements"],
              ["官方來源", "TWSE、TPEx、MOPS"],
              ["結構一致", "統一 schema 與欄位設計"],
              ["可追溯", "lineage 與來源可審計"],
            ].map(([title, description], index) => (
              <div
                key={title}
                className={`py-5 ${index % 2 === 1 ? "md:pl-6" : "md:pr-6"} ${index >= 2 ? "md:border-t md:border-slate-200 xl:border-t-0" : ""} ${index > 0 ? "xl:border-l xl:border-slate-200 xl:pl-6" : ""}`}
              >
                <p className="text-lg font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <section className="border-b border-slate-200 bg-white py-14">
        <MarketingContainer className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Datasets Overview</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">目前正式可用主題僅限兩個 live topics；其餘主題維持 coming soon / beta，不做超額宣稱。</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-5">
              <p className="text-sm font-semibold text-emerald-800">Available now / 已可用</p>
              <div className="mt-4 space-y-3">
                {liveTopics.map((topic) => (
                  <div key={topic.id} className="rounded-md border border-emerald-200 bg-white px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{topic.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{topic.shortUseCase}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-800">Coming soon / Beta</p>
              <div className="mt-4 space-y-3">
                {upcomingTopics.map((topic) => (
                  <div key={topic.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{topic.name}</p>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                        {topic.readiness === "beta" ? "beta" : "coming soon"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{topic.shortUseCase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5">
            <Link href="/docs/quick-start" className={buttonClass("primary")}>
              前往快速開始
            </Link>
            <Link href="/docs" className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
              查看文件
            </Link>
            <Link href="/datasets" className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
              查看資料主題目錄
            </Link>
          </div>
        </MarketingContainer>
      </section>

      <SourceOfTruthSection />
      <MarketCoverageShowcase />
      <AgentWorkflowShowcase />
      <AgentDocumentsShowcase />

      <section className="bg-white py-14">
        <MarketingContainer className="space-y-8">
          <div className="border-b border-slate-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900">為開發者、量化研究與資料產品團隊打造</h2>
            <p className="mt-2 text-sm text-slate-600">聚焦可程式化接入與穩定交付，支援研究到上線流程。</p>
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
              ["資料集目錄", "查看目前可用資料與覆蓋範圍。", "/datasets", "查看資料集"],
              ["API 參考", "直接查看端點、參數與回應格式。", "/api", "查看 API"],
              ["方案與控制台", "管理方案、用量與 API 金鑰。", "/dashboard", "前往控制台"],
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
              立即開始使用台股資料 API。
              <br />
              支援股價、財報與公司事件，快速建立你的分析與交易流程。
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
