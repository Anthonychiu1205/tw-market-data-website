import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { Card } from "@/src/components/ui/card";
import { CodeWindow } from "@/src/components/ui/code-window";
import { Container } from "@/src/components/ui/container";
import { platformCapabilities } from "@/src/content/site";

export const metadata: Metadata = {
  title: "產品",
  description: "TWSE-first verified 台股資料產品能力總覽。",
};

export default async function ProductPage() {
  const t = await getTranslations("product");
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("eyebrow")}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
          <p className="mt-3 text-base text-slate-600">{t("lead")}</p>
        </div>
        <CodeWindow
          title={t("codeWindowTitle")}
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
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t("verifiedHeading")}</h2>
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
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t("deferredHeading")}</h2>
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
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t("gettingStarted.heading")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("gettingStarted.body")}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/docs/quick-start" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            {t("gettingStarted.quickstartLink")}
          </Link>
          <Link href="/docs" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            {t("gettingStarted.docsLink")}
          </Link>
        </div>
      </Card>
    </Container>
  );
}
