import Link from "next/link";

import { MarketingContainer } from "@/src/components/ui/marketing-container";
import { buttonClass } from "@/src/components/ui/button";

import type { AgentWorkflowDemoConfig } from "./agent-workflow-demo";
import { LazyAgentWorkflowDemo } from "./lazy-agent-workflow-demo";

const MARKET_COVERAGE_DEMO_CONFIG: AgentWorkflowDemoConfig = {
  queryPrompt: "找出近一年營收成長與毛利率穩定的股票",
  statusLead: "Agent: searching",
  statusPill: "TW Market Data",
  tableHeaders: ["ID", "股票", "營收成長", "毛利率", "營收"],
  tableRows: [
    ["1", "2330 台積電", "18.2%", "53.1%", "$2.89T"],
    ["2", "2454 聯發科", "15.7%", "48.6%", "$1.42T"],
    ["3", "2317 鴻海", "10.3%", "14.2%", "$6.10T"],
    ["4", "2308 台達電", "9.8%", "34.5%", "$412B"],
    ["5", "3711 日月光", "8.7%", "21.3%", "$289B"],
    ["6", "3231 緯創", "7.9%", "12.6%", "$365B"],
  ],
  completionLabel: "Agent: screen complete.",
  tableGridTemplateColumns: "0.6fr 1.2fr repeat(3,minmax(0,1fr))",
};

export function MarketCoverageShowcase() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <MarketingContainer>
        <div className="grid items-start gap-7 lg:grid-cols-[34%_66%] lg:gap-5">
          <div className="order-1 lg:border-r lg:border-slate-200 lg:pr-4">
            <div className="w-full max-w-[520px] text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                跨數千檔股票與資產進行查詢
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                涵蓋台股市場主要資料主題，包括股價、財報、營運指標與公司事件。支援跨股票、跨時間與多資料集查詢，讓
                agent 可在單一資料層完成分析與篩選，並支援完整財報分析（損益表 + 現金流量表）。
              </p>
              <div className="mt-6">
                <Link href="/datasets" className={buttonClass("primary")}>
                  探索資料集
                </Link>
              </div>
            </div>
          </div>

          <div className="order-2 w-full min-w-0 max-w-none">
            <LazyAgentWorkflowDemo config={MARKET_COVERAGE_DEMO_CONFIG} />
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
