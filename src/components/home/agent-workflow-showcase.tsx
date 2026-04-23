import { MarketingContainer } from "@/src/components/ui/marketing-container";

import { AgentWorkflowDemo } from "./agent-workflow-demo";

export function AgentWorkflowShowcase() {
  return (
    <section className="border-b border-slate-200 bg-white py-20 lg:py-24">
      <MarketingContainer>
        <div className="grid items-start gap-7 lg:grid-cols-[66%_34%] lg:gap-5">
          <div className="order-2 w-full min-w-0 max-w-none lg:order-1">
            <AgentWorkflowDemo />
          </div>

          <div className="order-1 lg:order-2 lg:border-l lg:border-slate-200 lg:pl-4">
            <div className="ml-auto w-full max-w-[520px] text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                讓 AI agent 直接讀取可追溯的台股資料
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                將股價、財報與公告接入 agent workflow。使用一致的回應結構與 source_role / lineage，讓資料可讀也可驗證。
              </p>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
