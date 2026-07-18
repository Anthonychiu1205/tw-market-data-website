import { getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { buttonClass } from "@/src/components/ui/button";
import { buildMarketCoverageConfig } from "@/src/lib/homepage/demo-real-data";

import { LazyAgentWorkflowDemo } from "./lazy-agent-workflow-demo";

export async function MarketCoverageShowcase() {
  const t = await getTranslations("home.marketCoverage");
  // Real per-ticker screen (TTM revenue / gross margin / YoY growth), daily ISR. The fabricated
  // 6-stock table is gone; omitted when no real data is available (rule 2).
  const config = await buildMarketCoverageConfig();
  return (
    <section className="bg-white py-20 lg:py-24">
      <MarketingContainer>
        <div className="grid items-start gap-7 lg:grid-cols-[34%_66%] lg:gap-5">
          <div className="order-1 lg:border-r lg:border-slate-200 lg:pr-4">
            <div className="w-full max-w-[520px] text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {t("heading")}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                {t("description")}
              </p>
              <div className="mt-6">
                <Link href="/datasets" className={buttonClass("primary")}>
                  {t("exploreDatasets")}
                </Link>
              </div>
            </div>
          </div>

          <div className="order-2 w-full min-w-0 max-w-none">
            {config ? <LazyAgentWorkflowDemo config={config} /> : null}
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
