import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/src/components/ui/card";
import { CodeWindow } from "@/src/components/ui/code-window";
import { Container } from "@/src/components/ui/container";
import { platformCapabilities } from "@/src/content/site";

export const metadata: Metadata = {
  title: "產品",
  description: "TWSE-first verified 台股資料產品能力總覽。",
};

export default function ProductPage() {
  const verifiedBaselineTopics = [
    "twse_daily_price",
    "monthly_revenue",
    "income_statement",
    "balance_sheet",
    "cash_flow_statement",
    "valuation_data",
    "institutional_flow",
    "technical_indicators",
  ];
  const deferredTopics = [
    "tpex_daily_price_historical_depth (deferred)",
    "adjusted_prices (deferred)",
    "survivorship-safe ticker universe (blocked)",
    "full-market daily price claim (blocked)",
  ];

  return (
    <Container className="space-y-8 py-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">產品</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">TWSE-first verified 資料 API 產品</h1>
          <p className="mt-3 text-base text-slate-600">目前公開定位為 TWSE-first verified baseline；TPEx 歷史覆蓋與 full-market claim 仍採 deferred / blocked 管理。</p>
        </div>
        <CodeWindow
          title="產品面向"
          code={`{
  "public_positioning": "TWSE_first_verified_baseline",
  "verified_baseline_dataset_count": 8,
  "tpex_historical_depth": "deferred",
  "full_market_claim": "do_not_claim",
  "access_semantics": "controlled_rollout",
  "not_investment_advice": true
}`}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-1">
        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Verified baseline / 可公開主張</h2>
          <div className="mt-4 space-y-3">
            {verifiedBaselineTopics.map((topic) => (
              <div key={topic} className="rounded-md border border-emerald-200 bg-emerald-50/30 px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">{topic}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-1">
        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Deferred / blocked claims</h2>
          <div className="mt-4 space-y-3">
            {deferredTopics.map((topic) => (
              <div key={topic} className="rounded-md border border-amber-200 bg-amber-50/40 px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">{topic}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {platformCapabilities.map((group) => (
        <Card key={group.title}>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{group.title}</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {group.items.slice(0, 3).map((item) => (
              <p key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">開始使用</h2>
        <p className="mt-2 text-sm text-slate-600">建議先閱讀 Quickstart 與文件，再從 verified baseline dataset 開始整合。所有資料主張請以各 dataset coverage/status 註記為準。</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/docs/quick-start" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            前往 Quickstart
          </Link>
          <Link href="/docs" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            查看文件
          </Link>
        </div>
      </Card>
    </Container>
  );
}
