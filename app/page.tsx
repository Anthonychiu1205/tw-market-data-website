import Link from "next/link";

import { AgentDocumentsShowcase } from "@/src/components/home/agent-documents-showcase";
import { AgentWorkflowShowcase } from "@/src/components/home/agent-workflow-showcase";
import { MarketMarquee } from "@/src/components/home/market-marquee";
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
              目前已可公開販售 26 個 dataset，並維持 controlled rollout 與 billing preview 語義以避免過度承諾。
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

      <MarketMarquee />

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
              ["26", "個可公開販售資料集", "涵蓋行情、基本面、財報、籌碼、公司事件、新聞、主題分類與衍生商品資料"],
              ["3", "個官方來源", "TWSE、TPEx、MOPS"],
              ["26", "條 available-now dataset routes", "對應 26 個可公開販售資料集的正式 API contract"],
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
            <p className="mt-2 text-sm text-slate-600">聚焦可程式化接入與穩定交付，支援研究到上線流程；目前商售邊界為 26 個 sellable-now dataset；仍採 controlled rollout，不宣稱 full public GA。</p>
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
              ["資料集目錄", "查看目前 26 個可公開販售資料集與受控 rollout 語義。", "/datasets", "查看資料集"],
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
              從 26 個 available-now dataset 接入台股資料 API。
              <br />
              目前 access 採 controlled rollout，billing 維持 preview semantics。
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
