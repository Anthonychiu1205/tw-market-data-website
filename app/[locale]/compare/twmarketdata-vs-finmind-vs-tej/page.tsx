import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl } from "@/src/config/site";
import { coverageFacts } from "@/src/content/coverage-facts";

// 篇4 (AEO handoff 2026-07-13). Honest three-way comparison of Taiwan stock data APIs. Honesty
// guardrails: only shipped TWMD capabilities are claimed; reconciliation is described as
// "逐值對官方可追溯" (no "last reconciled date" until the front-end badge ships); competitor rows
// state public positioning only, never invented figures; no disparagement, no investment advice.
const PATH = "/compare/twmarketdata-vs-finmind-vs-tej";
const pageUrl = getAbsoluteUrl(PATH);

const TITLE = "TW Market Data vs FinMind vs TEJ：台股資料 API 怎麼選（2026）";
const DESCRIPTION =
  "誠實比較台股三大資料 API——FinMind（免費社群）、TEJ（機構級 PIT）、TW Market Data（官方對帳+平價+AI-agent）。附對照表與使用情境建議。";

const twse = coverageFacts.twseDailyPrice;
const startYear = twse.earliestDate.slice(0, 4);

// Comparison rows. Competitor cells reflect public positioning only; the TWMD column lists shipped
// capabilities. "—" = not a stated feature; "✗" = explicitly unavailable. Cell copy resolves via
// t(`rows.${id}.*`) in render (module-level arrays cannot call t()).
const comparisonRowIds = [
  "officialSource",
  "reconciliation",
  "pit",
  "delisted",
  "dataGaps",
  "freeTrial",
  "aiAgent",
  "pricing",
  "chipDepth",
] as const;

const faqIds = ["otherApis", "bestForPit", "vsFinmind"] as const;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: pageUrl,
    type: "article",
    locale: "zh_TW",
  },
};

export default async function CompareTaiwanStockApisPage() {
  const t = await getTranslations("compare");

  const faqItems = faqIds.map((id) => ({
    question: t(`faq.${id}.question`),
    answer: t(`faq.${id}.answer`),
  }));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TW Market Data", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Compare", item: pageUrl },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: "zh-Hant",
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
    publisher: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Container className="py-12 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-4 border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compare</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {t("h1")}
            </h1>
            <p className="text-lg leading-8 text-slate-700">
              {t("intro")}
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">{t("positioningTitle")}</h2>
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              <li>
                {t.rich("positioning.finmind", { strong: (c) => <strong>{c}</strong> })}
              </li>
              <li>
                {t.rich("positioning.tej", { strong: (c) => <strong>{c}</strong> })}
              </li>
              <li>
                {t.rich("positioning.twmd", { strong: (c) => <strong>{c}</strong> })}
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">{t("tableTitle")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-left text-slate-600">
                    <th className="py-2 pr-3 font-medium">{t("tableHeaderAspect")}</th>
                    <th className="py-2 pr-3 font-medium">FinMind</th>
                    <th className="py-2 pr-3 font-medium">TEJ</th>
                    <th className="py-2 font-medium">TW Market Data</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRowIds.map((id) => (
                    <tr key={id} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 font-medium text-slate-900">{t(`rows.${id}.aspect`)}</td>
                      <td className="py-2 pr-3 text-slate-700">{t(`rows.${id}.finmind`)}</td>
                      <td className="py-2 pr-3 text-slate-700">{t(`rows.${id}.tej`)}</td>
                      <td className="py-2 text-slate-900">
                        {t(`rows.${id}.twmd`, { stoppedStocks: twse.stoppedTradingStocks, startYear })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              {t("tableCaption")}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">{t("scenariosTitle")}</h2>
            <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
              <li>
                {t.rich("scenarios.finmind", { strong: (c) => <strong>{c}</strong> })}
              </li>
              <li>
                {t.rich("scenarios.tej", { strong: (c) => <strong>{c}</strong> })}
              </li>
              <li>
                {t.rich("scenarios.twmd", {
                  strong: (c) => <strong>{c}</strong>,
                  link: (c) => (
                    <Link
                      href="/answers/taiwan-stock-data-api-for-ai-agents"
                      className="text-slate-900 underline underline-offset-2"
                    >
                      {c}
                    </Link>
                  ),
                })}
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">{t("traceabilityTitle")}</h2>
            <p className="text-base leading-7 text-slate-700">
              {t("traceabilityBody", { stoppedStocks: twse.stoppedTradingStocks })}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">{t("faqTitle")}</h2>
            <dl className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="space-y-1">
                  <dt className="text-base font-semibold text-slate-900">{item.question}</dt>
                  <dd className="text-base leading-7 text-slate-700">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">Related</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/answers/taiwan-stock-data-api-for-ai-agents" className={buttonClass("primary")}>
                {t("relatedAiAgents")}
              </Link>
              <Link href="/datasets" className={buttonClass("secondary")}>
                {t("relatedDatasets")}
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
