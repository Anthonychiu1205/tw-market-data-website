import type { Metadata } from "next";
import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { EN_HOMEPAGE_READY, hreflangLanguages } from "@/src/config/i18n";
import { coverageFacts } from "@/src/content/coverage-facts";

const twse = coverageFacts.twseDailyPrice;
const twseStocks = twse.stocks.toLocaleString("en-US");

// English landing page — SEO-01 §3 reference template (the "1 樣板頁" of the bilingual scaffold).
// Pattern demonstrated here (title money-word + hreflang cluster + JSON-LD + content slots) is the
// blueprint for the rest of /en/*.
//
// DRAFT until Cowork fills the content slots per docs/seo/en-terminology-glossary.md:
//   - robots.index is false so thin/placeholder copy is NOT indexed and the hreflang cluster stays
//     dormant (Google ignores hreflang to a noindex URL). Flip `DRAFT` to false once the body copy
//     is finalized — that single switch turns on indexing AND activates hreflang.
//   - No machine-translated prose is shipped here; the slots below are placeholders, not final copy.
// Readiness is the shared EN_HOMEPAGE_READY switch (src/config/i18n.ts) so the zh homepage's
// reciprocal hreflang and this page's indexability flip together.
const DRAFT = !EN_HOMEPAGE_READY;

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TW Market Data",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: getAbsoluteUrl("/en"),
  description:
    `TWSE-first Taiwan stock market data API. TWSE daily prices since ${twse.earliestDate} ` +
    "(including full price history for stocks that have stopped trading), MOPS monthly revenue, " +
    "financial statements, three-major-institutional-investor flows, valuations and technical " +
    "indicators. Every response carries source lineage and preserves disclosed data_gaps rather " +
    "than inferring missing values.",
};

export const metadata: Metadata = {
  // Money-word title per SEO-01 §3.3.
  title: "Taiwan Stock Market Data API | TWSE, Financials, Institutional Flow",
  description:
    "TWSE-first Taiwan stock market data API for engineers, quant research and AI agents — " +
    "daily prices, monthly revenue, financial statements and institutional flows, with source " +
    "lineage and disclosed data gaps.",
  alternates: {
    canonical: "/en",
    languages: hreflangLanguages("/", "/en"),
  },
  robots: DRAFT ? { index: false, follow: true } : { index: true, follow: true },
  openGraph: {
    title: "Taiwan Stock Market Data API | TW Market Data",
    description:
      "TWSE-first Taiwan stock market data API with source lineage and honest coverage disclosure.",
    url: getAbsoluteUrl("/en"),
    siteName: "TW Market Data",
    locale: "en",
    type: "website",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

export default function EnglishHomePage() {
  return (
    // lang="en" scopes the content language until the app/[locale] migration sets <html lang="en">.
    <div lang="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd) }}
      />
      <Container className="space-y-12 py-12 sm:py-16">
        <section className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Taiwan Stock Market Data API
          </h1>
          {/* Seed subhead is TRUE and glossary-controlled (safe to ship); expand via slot below. */}
          <p className="mt-6 text-lg leading-8 text-slate-600">
            TW Market Data is a TWSE-first Taiwan stock market data API covering daily prices, MOPS
            monthly revenue, financial statements, three-major-institutional-investor flows,
            valuations and technical indicators. Every response carries source lineage and preserves
            disclosed data gaps rather than inferring missing values.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Built for developers and quant researchers: query first-party Taiwan market data from
            your code over a REST API, or connect it to AI agents over an MCP server (preview).
          </p>
          {/* Citable coverage fact sentence — every figure is DB-verified (coverage-facts.ts). */}
          <p className="mt-4 text-base leading-8 text-slate-600">
            Coverage includes TWSE daily prices since {twse.earliestDate} ({twse.rowsDisplay} rows
            across {twseStocks} stocks, plus {twse.stoppedTradingStocks} stocks that have since
            stopped trading, for survivorship-bias-free backtests), TPEx daily prices since{" "}
            {coverageFacts.tpexDailyPrice.earliestDate.slice(0, 4)}, and monthly revenue since{" "}
            {coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4)}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {/* Points at the existing docs until the /en/docs/* pages ship (next i18n increment). */}
            <Link href="/docs/introduction" className={buttonClass("primary")}>
              Read the docs
            </Link>
            <Link href="/pricing" className={buttonClass("secondary")}>
              Pricing
            </Link>
            <Link href="/datasets" className={buttonClass("secondary")}>
              Browse datasets
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">What you get</h2>
          <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
            <li>
              Official first-party data — sourced from TWSE, TPEx, MOPS and TAIFEX, with coverage and
              data gaps disclosed, not hidden.
            </li>
            <li>
              Taiwan-specific fundamentals US vendors don&apos;t carry — monthly revenue since{" "}
              {coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4)} (a monthly-frequency signal)
              and daily three-major-institutional-investor (三大法人) flow.
            </li>
            <li>
              Survivorship-bias-free — full price history is retained for {twse.stoppedTradingStocks}{" "}
              stocks that have stopped trading, so point-in-time backtests aren&apos;t biased toward
              today&apos;s survivors.
            </li>
            <li>
              Built for AI agents — machine-readable docs, OpenAPI, and an MCP server (preview).
              Start free.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Built for honest, reproducible research
          </h2>
          <p className="text-base leading-7 text-slate-700">
            TW Market Data is a TWSE-first verified baseline. Every response carries source lineage
            and preserves disclosed data gaps rather than inferring missing values, so your research
            stays reproducible. TPEx historical depth is still being expanded, and we make no
            full-market claim.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            What we don&apos;t provide (by design)
          </h2>
          <p className="text-base leading-7 text-slate-700">
            Real-time quotes, intraday bars and crypto are out of scope. We focus on being a
            trustworthy source of end-of-day and fundamental Taiwan data.
          </p>
        </section>
      </Container>
    </div>
  );
}
