import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { ReconciliationBadge } from "@/src/components/datasets/reconciliation-badge";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { getDatasetSeoEntry, datasetSeoEntries } from "@/src/content/datasets";
import { datasetTemporalCoverage } from "@/src/content/coverage-facts";
import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import { getDatasetReconciliation } from "@/src/lib/reconciliation/dataset-reconciliation";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return datasetSeoEntries.map((item) => ({ slug: item.slug }));
}

// ISR: the reconciliation badge reads a backend record that lands later (persistence job runs with
// db_write:false today). Revalidating hourly lets the badge light up once the data lands, with no
// rebuild — the rest of the page is static content from src/content/datasets.ts.
export const revalidate = 3600;

// Locale-aware metadata: the dataset record is bilingual (§1.6) and projected per locale via
// getDatasetSeoEntry, so seoTitle/seoDescription/keywords already carry the right language.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  const dataset = getDatasetSeoEntry(slug, l);

  if (!dataset) {
    return {
      title: isEn ? "Dataset not found | TW Market Data" : "資料集不存在 | TW Market Data",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: dataset.seoTitle,
    description: dataset.seoDescription,
    alternates: buildAlternates(l, `/datasets/${dataset.slug}`),
    keywords: dataset.keywords,
    openGraph: {
      locale: OG_LOCALE[l],
      title: dataset.seoTitle,
      description: dataset.seoDescription,
      url: `/datasets/${dataset.slug}`,
      siteName: "TW Market Data",
      type: "article",
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
    twitter: {
      card: "summary_large_image",
      title: dataset.seoTitle,
      description: dataset.seoDescription,
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
  };
}

export default async function DatasetSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const appLocale: AppLocale = locale === "en" ? "en" : "zh-TW";
  const t = await getTranslations("datasets");

  const dataset = getDatasetSeoEntry(slug, appLocale);

  if (!dataset) {
    notFound();
  }

  // Trust badge state (null until the backend reconciliation record lands → badge hidden).
  const reconciliation = await getDatasetReconciliation(dataset.slug);

  const pageUrl = `https://twmarketdata.com/datasets/${dataset.slug}`;
  const docsUrl = `https://twmarketdata.com${dataset.docsHref}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumbRoot"),
        item: "https://twmarketdata.com/datasets",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dataset.name,
        item: pageUrl,
      },
    ],
  };

  // The description folds in this dataset's coverage / freshness / source-policy disclosure.
  // That honest, dataset-specific metadata is the unique content that makes each of these pages
  // eligible for (and differentiated in) Google Dataset Search — no competitor can copy it.
  const datasetDescription = [
    dataset.jsonLdDescription,
    `${t("coveragePrefix")}${dataset.coverageNote}`,
    `${t("freshnessPrefix")}${dataset.freshnessNote}`,
    `${t("sourcePolicyPrefix")}${dataset.sourcePolicyNote}`,
  ].join(" ");

  const organization = {
    "@type": "Organization",
    name: "TW Market Data",
    url: "https://twmarketdata.com",
  };

  // temporalCoverage is added only for datasets whose coverage window is DB-verified
  // (coverage-facts.ts); the rest omit it rather than fabricate a start date. No variableMeasured:
  // the model has no authoritative per-dataset field list (the old code hardcoded the same
  // PE/PB/dividend variables onto every dataset), so omitting is correct. Both are optional for
  // Dataset Search eligibility.
  const temporalCoverage = datasetTemporalCoverage[dataset.slug];

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: dataset.jsonLdName,
    description: datasetDescription,
    url: pageUrl,
    isAccessibleForFree: false,
    spatialCoverage: "Taiwan",
    ...(temporalCoverage ? { temporalCoverage } : {}),
    license: "https://twmarketdata.com/terms",
    creator: organization,
    publisher: organization,
    keywords: dataset.keywords,
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "TW Market Data Datasets",
      url: "https://twmarketdata.com/datasets",
    },
    distribution: [
      {
        "@type": "DataDownload",
        name: `${dataset.name} ${t("apiDocs")}`,
        contentUrl: docsUrl,
        encodingFormat: "application/json",
      },
    ],
  };

  return (
    <Container className="py-12 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />

      <div className="mx-auto max-w-4xl space-y-8">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/datasets" className="hover:text-slate-900">{t("breadcrumbRoot")}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{dataset.name}</span>
        </nav>

        <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("datasetEyebrow")}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{dataset.name}</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">{dataset.shortDescription}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={dataset.docsHref} className={buttonClass("primary")}>{t("viewApiDocs")}</Link>
            {/* B-4 (FRICTION-01): zero-registration sample CSV via the no-key free symbol 2330. */}
            <a
              href={`https://api.twmarketdata.com/v2/datasets/${dataset.slug}?symbol=2330&format=csv&limit=50`}
              className={buttonClass("secondary")}
              rel="noopener"
            >
              {t("downloadSampleCsv")}
            </a>
            <Link href={dataset.pricingHref} className={buttonClass("secondary")}>{t("viewPricing")}</Link>
          </div>
          <p className="text-xs text-slate-500">{t("sampleCaption")}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">{t("whatItIsTitle")}</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{dataset.whatItIs}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">{t("useCasesTitle")}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-600">
            {dataset.useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">{t("whyItMattersTitle")}</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{dataset.whyItMatters}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950">{t("coverageTitle")}</h2>
            <ReconciliationBadge data={reconciliation} />
          </div>
          <div className="mt-4 space-y-3 text-base leading-7 text-slate-600">
            <p>{dataset.coverageNote}</p>
            <p>{dataset.freshnessNote}</p>
            <p>{dataset.sourcePolicyNote}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">{t("developerTitle")}</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-slate-600">
            <li>
              {t("developerApiDocsLabel")}<Link href={dataset.docsHref} className="text-slate-900 underline-offset-4 hover:underline">{dataset.docsHref}</Link>
            </li>
            <li>
              {t("developerOpenApiLabel")}<Link href="/openapi.json" className="text-slate-900 underline-offset-4 hover:underline">/openapi.json</Link>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">{t("relatedLinksTitle")}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/datasets" className={buttonClass("secondary")}>{t("catalogOverview")}</Link>
            <Link href={dataset.docsHref} className={buttonClass("secondary")}>{t("apiDocs")}</Link>
            <Link href="/pricing" className={buttonClass("secondary")}>Pricing</Link>
            <Link href="/llms.txt" className={buttonClass("secondary")}>llms.txt</Link>
            <Link href="/openapi.json" className={buttonClass("secondary")}>openapi.json</Link>
          </div>
        </section>
      </div>
    </Container>
  );
}
