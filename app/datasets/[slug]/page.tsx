import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getDatasetBySlug, datasetSeoEntries } from "@/src/content/datasets";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return datasetSeoEntries.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dataset = getDatasetBySlug(slug);

  if (!dataset) {
    return {
      title: "資料集不存在 | TW Market Data",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: dataset.seoTitle,
    description: dataset.seoDescription,
    alternates: {
      canonical: `/datasets/${dataset.slug}`,
    },
    keywords: dataset.keywords,
    openGraph: {
      title: dataset.seoTitle,
      description: dataset.seoDescription,
      url: `/datasets/${dataset.slug}`,
      siteName: "TW Market Data",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: dataset.seoTitle,
      description: dataset.seoDescription,
    },
  };
}

export default async function DatasetSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const dataset = getDatasetBySlug(slug);

  if (!dataset) {
    notFound();
  }

  const pageUrl = `https://twmarketdata.com/datasets/${dataset.slug}`;
  const docsUrl = `https://twmarketdata.com${dataset.docsHref}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "資料集",
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

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: dataset.jsonLdName,
    description: dataset.jsonLdDescription,
    url: pageUrl,
    isAccessibleForFree: false,
    creator: {
      "@type": "Organization",
      name: "TW Market Data",
      url: "https://twmarketdata.com",
    },
    keywords: dataset.keywords,
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "TW Market Data Datasets",
      url: "https://twmarketdata.com/datasets",
    },
    distribution: [
      {
        "@type": "DataDownload",
        name: `${dataset.name} API 文件`,
        contentUrl: docsUrl,
        encodingFormat: "application/json",
      },
    ],
    variableMeasured: ["pe_ratio", "pb_ratio", "dividend_yield", "data_gaps"],
  };

  return (
    <Container className="py-12 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />

      <div className="mx-auto max-w-4xl space-y-8">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/datasets" className="hover:text-slate-900">資料集</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{dataset.name}</span>
        </nav>

        <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dataset</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{dataset.name}</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">{dataset.shortDescription}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={dataset.docsHref} className={buttonClass("primary")}>查看 API 文件</Link>
            <Link href={dataset.pricingHref} className={buttonClass("secondary")}>查看方案</Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">這是什麼資料</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{dataset.whatItIs}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">資料用途</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-600">
            {dataset.useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">為什麼對股票分析重要</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{dataset.whyItMatters}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">Coverage / Freshness / Source Policy</h2>
          <div className="mt-4 space-y-3 text-base leading-7 text-slate-600">
            <p>{dataset.coverageNote}</p>
            <p>{dataset.freshnessNote}</p>
            <p>{dataset.sourcePolicyNote}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">Developer 入口</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-slate-600">
            <li>
              API 文件：<Link href={dataset.docsHref} className="text-slate-900 underline-offset-4 hover:underline">{dataset.docsHref}</Link>
            </li>
            <li>
              OpenAPI：<Link href="/openapi.json" className="text-slate-900 underline-offset-4 hover:underline">/openapi.json</Link>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">相關連結</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/datasets" className={buttonClass("secondary")}>資料集總覽</Link>
            <Link href={dataset.docsHref} className={buttonClass("secondary")}>API 文件</Link>
            <Link href="/pricing" className={buttonClass("secondary")}>Pricing</Link>
            <Link href="/llms.txt" className={buttonClass("secondary")}>llms.txt</Link>
            <Link href="/openapi.json" className={buttonClass("secondary")}>openapi.json</Link>
          </div>
        </section>
      </div>
    </Container>
  );
}
