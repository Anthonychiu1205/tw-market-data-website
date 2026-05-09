import { MarketingContainer } from "@/src/components/ui/marketing-container";

import { LazyAgentDocumentsDemo } from "./lazy-agent-documents-demo";

export function AgentDocumentsShowcase() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <MarketingContainer>
        <div className="grid items-start gap-7 lg:grid-cols-[34%_66%] lg:gap-5">
          <div className="order-1 lg:order-1 lg:border-r lg:border-slate-200 lg:pr-4">
            <div className="w-full max-w-[520px] text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                讓 AI agent 直接理解公告與財報內容
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                將重大訊息、公告與財報附註轉為可分析的文字 context。讓 agent 不只讀取數值，也能理解公司實際揭露了什麼。
              </p>
            </div>
          </div>

          <div className="order-2 w-full min-w-0 max-w-none lg:order-2">
            <LazyAgentDocumentsDemo />
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
