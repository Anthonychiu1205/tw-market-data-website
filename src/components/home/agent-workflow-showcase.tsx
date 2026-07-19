import { getLocale, getTranslations } from "next-intl/server";

import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { buildAgentWorkflowConfig } from "@/src/lib/homepage/demo-real-data";

import { LazyAgentWorkflowDemo } from "./lazy-agent-workflow-demo";

export async function AgentWorkflowShowcase() {
  const t = await getTranslations("home.agentWorkflowShowcase");
  const locale = await getLocale();
  // Real TSMC last-8-quarters config (daily ISR). Omitted when no real data is available — never a
  // fabricated table (rule 2). Labels follow locale (I18N-FIX-03 ①).
  const config = await buildAgentWorkflowConfig(locale);

  return (
    <section className="bg-white py-20 lg:py-24">
      <MarketingContainer>
        <div className="grid items-start gap-7 lg:grid-cols-[66%_34%] lg:gap-5">
          <div className="order-2 w-full min-w-0 max-w-none lg:order-1">
            {config ? <LazyAgentWorkflowDemo config={config} /> : null}
          </div>

          <div className="order-1 lg:order-2 lg:border-l lg:border-slate-200 lg:pl-4">
            <div className="ml-auto w-full max-w-[520px] text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {t("title")}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                {t("description")}
              </p>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
