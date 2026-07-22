import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { Link } from "@/src/i18n/navigation";

import { ApiRunPlayground } from "@/src/components/docs/api-run-playground";
import { ApiSidePanel } from "@/src/components/docs/api-side-panel";
import { ApiCoverageTable, ApiLimitations } from "@/src/components/docs/api-coverage-and-limits";
import { CodeBlock } from "@/src/components/docs/code-block";
import { DocsLandingContent } from "@/src/components/docs/docs-landing-content";
import { DocsPageShell } from "@/src/components/docs/docs-page-shell";
import { QuickStartContent } from "@/src/components/docs/quick-start-content";
import { AuthenticationContent } from "@/src/components/docs/authentication-content";
import { ToolsMcpContent } from "@/src/components/docs/tools-mcp-content";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { buttonClass } from "@/src/components/ui/button";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import { normalizeDocsSections } from "@/src/content/docs-sections";
import { findDocsSidebarLink, resolveDocsGroupTargetHref } from "@/src/content/docs-sidebar";
import { docsPages, getDocsPageBySlug } from "@/src/content/docs-pages";
import { DatasetDocPage, isDatasetDocSlug } from "@/src/components/docs/dataset-doc-page";
import { DocsArticlePage } from "@/src/components/docs/docs-article-page";
import { DOCS_DATASET_CATALOG } from "@/src/content/docs/dataset-catalog";
import { getDatasetDocContent } from "@/src/content/docs/dataset-pages";
import { articleSlugs, getArticlePage } from "@/src/content/docs/article-pages";
import { RETIRED_REDIRECTS, getRetiredRedirect } from "@/src/content/docs/retired-redirects";

type DocsDynamicPageProps = {
  params: Promise<{ slug: string[]; locale: string }>;
};

const docsCanonicalAliases: Record<string, string> = {
  "/docs/data-freshness-lineage": "/docs/data-provenance",
  "/docs/data-access": "/docs/market-coverage",
  "/docs/tools-and-mcp": "/docs/tools-mcp",
  "/docs/api-model": "/docs/openapi-spec",
};

function resolveDocsCanonical(href: string) {
  return docsCanonicalAliases[href] ?? href;
}

// Static (generateStaticParams), revalidated hourly — repo-driven docs, no backend.
export const revalidate = 3600;

export async function generateStaticParams() {
  return [
    ...docsPages.map((page) => ({ slug: page.slug })),
    // v5 dataset endpoint pages: /docs/api/<domain>/<slug>
    ...DOCS_DATASET_CATALOG.map((d) => ({ slug: ["api", d.domain, d.slug] })),
    // v5 overview + guide article pages
    ...articleSlugs().map((slug) => ({ slug })),
    // retired (delisted) dataset URLs → render the "retired, use X instead" note, not a 404
    ...RETIRED_REDIRECTS.map((r) => ({ slug: r.slugParts })),
  ];
}

export async function generateMetadata({ params }: DocsDynamicPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";

  // v5 dataset endpoint page metadata (from the catalog + bilingual content).
  if (isDatasetDocSlug(slug)) {
    const datasetSlug = slug[2];
    const entry = DOCS_DATASET_CATALOG.find((d) => d.slug === datasetSlug);
    const content = getDatasetDocContent(datasetSlug);
    const title = entry ? (isEn ? entry.en : entry.zh) : datasetSlug;
    const description = content ? (isEn ? content.description.en : content.description.zh) : undefined;
    return {
      title: isEn ? `Docs | ${title}` : `文件｜${title}`,
      description,
      alternates: buildAlternates(l, `/docs/api/${slug[1]}/${datasetSlug}`),
    };
  }

  // v5 overview / guide article metadata.
  const article = getArticlePage(slug);
  if (article) {
    const title = isEn ? article.title.en : article.title.zh;
    return {
      title: isEn ? `Docs | ${title}` : `文件｜${title}`,
      description: isEn ? article.subtitle.en : article.subtitle.zh,
      alternates: buildAlternates(l, `/docs/${slug.join("/")}`),
    };
  }

  // Retired dataset page (delisted) → keep the URL resolvable with a redirect title.
  const retired = getRetiredRedirect(slug);
  if (retired) {
    return {
      title: isEn ? `Docs | ${retired.title.en}` : `文件｜${retired.title.zh}`,
      alternates: buildAlternates(l, `/docs/${slug.join("/")}`),
    };
  }

  const page = getDocsPageBySlug(slug);

  if (!page) {
    return {
      title: isEn ? "Docs" : "文件",
      alternates: buildAlternates(l, `/docs/${slug.join("/")}`),
    };
  }

  const canonicalHref = resolveDocsCanonical(page.href);

  return {
    title: isEn ? `Docs｜${page.title}` : `文件｜${page.title}`,
    description: page.subtitle,
    alternates: buildAlternates(l, canonicalHref),
    openGraph: {
      title: `${page.title} | TW Market Data Docs`,
      description: page.subtitle,
      url: canonicalHref,
      type: "article",
      locale: OG_LOCALE[l],
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | TW Market Data Docs`,
      description: page.subtitle,
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
  };
}

export default async function DocsDynamicPage({ params }: DocsDynamicPageProps) {
  const { slug } = await params;

  // v5 dataset endpoint pages (/docs/api/<domain>/<slug>) render the bilingual dataset template.
  if (isDatasetDocSlug(slug)) {
    const locale = await getLocale();
    return <DatasetDocPage slugParts={slug} locale={locale} />;
  }

  // v5 bilingual overview / guide article pages.
  if (getArticlePage(slug)) {
    const locale = await getLocale();
    return <DocsArticlePage slugParts={slug} locale={locale} />;
  }

  // Retired (delisted) dataset → honest "retired, use X instead" note, not a 404.
  const retired = getRetiredRedirect(slug);
  if (retired) {
    const locale = await getLocale();
    const en = locale === "en";
    const title = en ? retired.title.en : retired.title.zh;
    return (
      <DocsPageShell
        page={{ title, subtitle: en ? retired.note.en : retired.note.zh, href: `/docs/${slug.join("/")}`, sections: [] }}
        pageLabel={en ? "Retired" : "已下架"}
      >
        <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-700">
          {retired.alternatives.map((alt) =>
            alt.roadmap ? (
              <li key={alt.href} className="text-slate-500">
                {en ? alt.en : alt.zh}
                <span className="ml-2 rounded border border-amber-500/40 px-1.5 py-0.5 text-xs text-amber-700">
                  {en ? "Roadmap" : "規劃中"}
                </span>
              </li>
            ) : (
              <li key={alt.href}>
                <Link href={alt.href} className="underline underline-offset-2 hover:text-slate-950">
                  {en ? alt.en : alt.zh}
                </Link>
              </li>
            ),
          )}
        </ul>
      </DocsPageShell>
    );
  }

  const page = getDocsPageBySlug(slug);

  if (!page) {
    // A v5 sidebar link whose page is not built yet → bilingual "being written" placeholder, not a 404.
    if (findDocsSidebarLink(`/docs/${slug.join("/")}`)) {
      const locale = await getLocale();
      return <DocsArticlePage slugParts={slug} locale={locale} />;
    }
    notFound();
  }
  const pageForShell = { ...page, apiReferenceFactory: undefined };

  const locale = await getLocale();
  const t = await getTranslations("docs");
  // §2.5 fallback: docs-pages.ts bodies stay zh (12k lines, DATA). On /en show an amber "English
  // coming soon" notice above the still-Chinese content. No docs page has an EN body, so the
  // condition is simply locale === "en".
  const englishNotice =
    locale === "en" ? (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {t("englishNotice")}
      </div>
    ) : null;

  const currentHref = `/docs/${slug.join("/")}`;
  const groupTargetHref = resolveDocsGroupTargetHref(currentHref);
  if (groupTargetHref && groupTargetHref !== currentHref) {
    redirect(groupTargetHref);
  }

  const normalizedPageSections = normalizeDocsSections(page.sections);

  if (page.apiReference) {
    const api = page.apiReference;
    const successStatusExample = api.sidePanel.statusExamples.find((example) => example.status === "200");
    // Dataset slug = last docs path segment (e.g. "twse-daily-price"), used for the coverage table.
    const datasetSlug = page.slug[page.slug.length - 1];

    if (api.layoutVariant === "data-api-standard") {
      const tocSections = normalizeDocsSections([
        { id: "overview", label: "Overview" },
        { id: "coverage", label: "覆蓋範圍" },
        { id: "request", label: "Request" },
        { id: "query-parameters", label: "Query Parameters" },
        { id: "response-shape", label: "Response Shape" },
        { id: "field-reference", label: "Field 說明" },
        { id: "usage-notes", label: "Usage Notes / 使用建議" },
        { id: "limitations", label: "限制與注意" },
        ...(api.planRequirement ? [{ id: "plan-requirement", label: api.planRequirement.title ?? "Plan Requirement" }] : []),
      ]).map(({ id, label }) => ({ id, label }));

      return (
        <DocsPageShell
          page={pageForShell} topNotice={englishNotice}
          tocSections={tocSections}
          pageLabel={api.categoryLabel}
          rightPanelTitle="請求與回應"
          rightPanelContent={
            <ApiSidePanel
              requestExample={api.sidePanel.requestExample}
              codeExamples={api.sidePanel.codeExamples}
              statusExamples={api.sidePanel.statusExamples}
            />
          }
        >
          <div className="space-y-8 py-8">
            <section className="space-y-4 border-b border-slate-200 pb-8">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <span className="rounded border border-slate-300 bg-white px-2 py-0.5 font-semibold text-slate-800">{api.method}</span>
                  <code className="truncate font-mono text-slate-700">{api.endpoint}</code>
                </div>
                <ApiRunPlayground api={api} endpointTitle={page.title} />
              </div>
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="overview">Overview</SectionHeading>
              {(api.overview ?? []).map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {(api.useCases ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <ApiCoverageTable slug={datasetSlug} />

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="request">Request</SectionHeading>
              {(api.requestDescription ?? []).map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="query-parameters">Query Parameters</SectionHeading>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">欄位</th>
                      <th scope="col" className="px-3 py-2 font-medium">型別</th>
                      <th scope="col" className="px-3 py-2 font-medium">Required</th>
                      <th scope="col" className="px-3 py-2 font-medium">說明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(api.queryParameters ?? []).map((parameter) => (
                      <tr key={parameter.name}>
                        <td className="px-3 py-2 font-mono text-xs text-slate-700">{parameter.name}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-600">{parameter.type}</td>
                        <td className="px-3 py-2 text-xs text-slate-600">{parameter.required ? "yes" : "no"}</td>
                        <td className="px-3 py-2 text-xs text-slate-600">{parameter.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="response-shape">Response Shape</SectionHeading>
              {(api.responseSummary ?? []).map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}
              {successStatusExample?.body ? (
                <CodeBlock code={successStatusExample.body} language="json" copyButtonVariant="icon" />
              ) : null}
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="field-reference">Field 說明</SectionHeading>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">欄位路徑</th>
                      <th scope="col" className="px-3 py-2 font-medium">型別</th>
                      <th scope="col" className="px-3 py-2 font-medium">說明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(api.responseFields ?? []).map((field) => (
                      <tr key={field.path}>
                        <td className="px-3 py-2 font-mono text-xs text-slate-700">{field.path}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-600">{field.type}</td>
                        <td className="px-3 py-2 text-xs text-slate-600">{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="usage-notes">Usage Notes / 使用建議</SectionHeading>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {(api.notes ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <ApiLimitations slug={datasetSlug} />

            {api.planRequirement ? (
              <section className="space-y-3">
                <SectionHeading id="plan-requirement">{api.planRequirement.title ?? "Plan Requirement"}</SectionHeading>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                  {(api.planRequirement.bullets ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-700">
                此 API 屬於 TW Market Data 資料集目錄。{" "}
                <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
                  查看資料集總覽
                </Link>
              </p>
            </section>
          </div>
        </DocsPageShell>
      );
    }

    const tocSections = normalizeDocsSections([
      { id: "overview", label: "Overview" },
      { id: "coverage", label: "覆蓋範圍" },
      ...(api.planRequirement ? [{ id: "plan-requirement", label: api.planRequirement.title ?? "適用方案" }] : []),
      { id: "request", label: "Request" },
      { id: "response", label: "Response" },
      { id: "field-reference", label: "Field 說明" },
      { id: "best-practices", label: "使用建議" },
      { id: "error-boundaries", label: "錯誤與邊界情況" },
      { id: "limitations", label: "限制與注意" },
    ]).map(({ id, label }) => ({ id, label }));

    return (
      <DocsPageShell
        page={pageForShell} topNotice={englishNotice}
        tocSections={tocSections}
        rightPanelTitle="請求與回應"
        rightPanelContent={
          <ApiSidePanel
            requestExample={api.sidePanel.requestExample}
            codeExamples={api.sidePanel.codeExamples}
            statusExamples={api.sidePanel.statusExamples}
          />
        }
      >
        <div className="space-y-8 py-8">
          <section className="space-y-4 border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold tracking-wide text-slate-500">{api.categoryLabel}</p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <span className="rounded border border-slate-300 bg-white px-2 py-0.5 font-semibold text-slate-800">{api.method}</span>
                <code className="truncate font-mono text-slate-700">{api.endpoint}</code>
              </div>
              <Link href="/dashboard" className={buttonClass("secondary", "shrink-0")}>
                前往儀表板
              </Link>
            </div>
          </section>

          <section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="overview">Overview</SectionHeading>
            {(api.overview ?? []).map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
          </section>

          <ApiCoverageTable slug={datasetSlug} />

          {api.planRequirement ? (
            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="plan-requirement">{api.planRequirement.title ?? "適用方案"}</SectionHeading>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {(api.planRequirement.bullets ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="request">Request</SectionHeading>
            <p className="text-sm leading-7 text-slate-600">此 endpoint 常見使用情境：</p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              {(api.useCases ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pt-1 text-sm leading-7 text-slate-600">建議接入步驟：</p>
            <ol className="space-y-2 text-sm leading-7 text-slate-700">
              {(api.gettingStarted ?? []).map((item, index) => (
                <li key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
            <CodeBlock code={api.exampleRequestCurl} language="curl" copyButtonVariant="icon" />
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">欄位</th>
                    <th scope="col" className="px-3 py-2 font-medium">型別</th>
                    <th scope="col" className="px-3 py-2 font-medium">Required</th>
                    <th scope="col" className="px-3 py-2 font-medium">說明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {(api.queryParameters ?? []).map((parameter) => (
                    <tr key={parameter.name}>
                      <td className="px-3 py-2 font-mono text-xs text-slate-700">{parameter.name}</td>
                      <td className="px-3 py-2 font-mono text-xs text-slate-600">{parameter.type}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{parameter.required ? "yes" : "no"}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{parameter.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="response">Response</SectionHeading>
            {(api.responseSummary ?? []).map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
            {successStatusExample?.body ? (
              <CodeBlock code={successStatusExample.body} language="json" copyButtonVariant="icon" />
            ) : null}
          </section>

          <section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="field-reference">Field 說明</SectionHeading>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">欄位路徑</th>
                    <th scope="col" className="px-3 py-2 font-medium">型別</th>
                    <th scope="col" className="px-3 py-2 font-medium">說明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {(api.responseFields ?? []).map((field) => (
                    <tr key={field.path}>
                      <td className="px-3 py-2 font-mono text-xs text-slate-700">{field.path}</td>
                      <td className="px-3 py-2 font-mono text-xs text-slate-600">{field.type}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="best-practices">使用建議</SectionHeading>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              {(api.notes ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <SectionHeading id="error-boundaries">錯誤與邊界情況</SectionHeading>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              {(
                api.errorCases ??
                (api.sidePanel.statusExamples ?? [])
                  .filter((example) => example.status !== "200")
                  .map((example) => example.description)
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <ApiLimitations slug={datasetSlug} />

          <section className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-700">
              此 API 屬於 TW Market Data 資料集目錄。{" "}
              <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
                查看資料集總覽
              </Link>
            </p>
          </section>
        </div>
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "quick-start") {
    return (
      <DocsPageShell page={pageForShell} topNotice={englishNotice} pageLabel="Overview">
        <QuickStartContent />
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "tools-and-mcp") {
    return (
      <DocsPageShell page={pageForShell} topNotice={englishNotice} pageLabel="Overview">
        <ToolsMcpContent />
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "introduction") {
    return (
      <DocsPageShell page={pageForShell} topNotice={englishNotice} pageLabel="Overview">
        <DocsLandingContent />
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "authentication") {
    return (
      <DocsPageShell page={pageForShell} topNotice={englishNotice} pageLabel="Overview">
        <AuthenticationContent />
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "sdk/release-status") {
    const releaseStatusRows = [
      {
        component: "Public API Gateway",
        status: "Beta / Live",
        intendedUse: "Direct API calls with X-API-Key",
        notYet: "Rate limits GA",
      },
      {
        component: "Python SDK",
        status: "Preview",
        intendedUse: "Local/dev usage",
        notYet: "PyPI publish, tests",
      },
      {
        component: "JavaScript SDK",
        status: "Preview",
        intendedUse: "Local/dev usage",
        notYet: "npm publish, dual build",
      },
      {
        component: "MCP Server",
        status: "Preview Skeleton",
        intendedUse: "Local adapter exploration",
        notYet: "stdio transport, hosted MCP",
      },
      {
        component: "AI Tool Manifest",
        status: "Preview",
        intendedUse: "Tool calling registry seed",
        notYet: "Official agent runtime",
      },
      {
        component: "Agent Examples",
        status: "Example",
        intendedUse: "Workflow demo",
        notYet: "Investment advice / trading",
      },
    ] as const;

    return (
      <DocsPageShell page={pageForShell} topNotice={englishNotice} pageLabel="SDKs">
        <div className="space-y-8 py-8">
          <section id="status-matrix" data-doc-section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="status-matrix">Release Status Matrix</SectionHeading>
            <p className="text-sm leading-7 text-slate-600">
              目前主要可用入口是 Public API Gateway（X-API-Key）。SDK、MCP、AI tools 相關能力仍以 preview 或 example 為主。
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Component</th>
                    <th scope="col" className="px-3 py-2 font-medium">Status</th>
                    <th scope="col" className="px-3 py-2 font-medium">Intended Use</th>
                    <th scope="col" className="px-3 py-2 font-medium">Not Yet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {releaseStatusRows.map((row) => (
                    <tr key={row.component}>
                      <td className="px-3 py-2 text-sm font-medium text-slate-900">{row.component}</td>
                      <td className="px-3 py-2 text-xs text-slate-700">{row.status}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{row.intendedUse}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{row.notYet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="current-default-path" data-doc-section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="current-default-path">Current Recommended Path</SectionHeading>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              <li>正式資料請求：Public API Gateway `/v2/datasets/*` + `X-API-Key`。</li>
              <li>SDK：目前僅建議 local/dev 使用。</li>
              <li>MCP：目前僅 skeleton，尚未正式 stdio server。</li>
              <li>Agent examples：僅示範 workflow，不是投資建議、個股推薦或交易訊號。</li>
            </ul>
          </section>

          <section id="notes" data-doc-section className="space-y-3">
            <SectionHeading id="notes">Notes</SectionHeading>
            <p className="text-sm leading-7 text-slate-600">
              Python SDK 尚未發布到 PyPI，JavaScript SDK 尚未發布到 npm。若需 production integration，請優先依 Public API Gateway 文件整合。
            </p>
          </section>
        </div>
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "support") {
    return (
      <DocsPageShell
        page={pageForShell} topNotice={englishNotice}
        pageLabel="Overview"
        tocSections={[
          { id: "contact", label: "聯繫方式" },
          { id: "report-details", label: "回報時建議附上" },
        ]}
      >
        <div className="space-y-8 py-8">
          <section id="contact" data-doc-section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="contact">聯繫方式</SectionHeading>
            <p className="text-sm leading-7 text-slate-600">
              若你在使用資料、串接 API、建立 agent workflow 或評估企業導入時遇到問題，請來信至：
            </p>
            <a
              href="mailto:avenra.platform@gmail.com"
              className="inline-block text-sm font-medium text-slate-950 underline underline-offset-4 transition hover:text-slate-700"
            >
              avenra.platform@gmail.com
            </a>
            <p className="text-sm leading-7 text-slate-600">我們會依方案與導入狀態提供支援。</p>
          </section>

          <section id="report-details" data-doc-section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="report-details">回報時建議附上</SectionHeading>
            <p className="text-sm leading-7 text-slate-600">你也可以在來信中附上：</p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              <li>帳號 email</li>
              <li>使用的 endpoint</li>
              <li>request id 或錯誤訊息</li>
              <li>想查詢的 ticker / dataset</li>
              <li>預期使用情境，例如量化研究、內部資料平台或 AI agent workflow</li>
            </ul>
          </section>

          <nav className="flex flex-wrap items-center justify-between gap-3 pt-1 text-sm">
            <Link
              href="/docs/tools-and-mcp"
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Previous: Tools / MCP
            </Link>
            <Link
              href="/docs/quick-start"
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Next: 快速開始
            </Link>
          </nav>
        </div>
      </DocsPageShell>
    );
  }

  return (
      <DocsPageShell
        page={pageForShell} topNotice={englishNotice}
        pageLabel={
          page.slug.join("/") === "workflows/company-fundamentals"
            ? "Workflows / Use Cases"
            : page.category === "overview"
              ? "Overview"
              : "文件"
        }
      >
      <div className="space-y-8 py-8">
        {(page.sections ?? []).map((section, index) => {
          const normalizedSection = normalizedPageSections[index];
          const sectionId = normalizedSection?.id ?? section.id;
          const sectionLabel = normalizedSection?.label ?? section.label;

          return (
          <section
            key={sectionId}
            id={sectionId}
            data-doc-section
            className={index < page.sections.length - 1 ? "space-y-3 border-b border-slate-200 pb-8" : "space-y-3"}
          >
            <SectionHeading id={sectionId}>{sectionLabel}</SectionHeading>
            {(section.paragraphs ?? []).map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
            {(section.bullets ?? []).length ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {(section.bullets ?? []).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {(section.codeBlocks ?? []).length ? (
              <div className="space-y-3">
                {(section.codeBlocks ?? []).map((codeBlock, blockIndex) => (
                  <CodeBlock
                    key={`${sectionId}-${codeBlock.language ?? "text"}-${blockIndex}`}
                    code={codeBlock.code}
                    language={codeBlock.language}
                    copyButtonVariant="icon"
                  />
                ))}
              </div>
            ) : null}
          </section>
          );
        })}
      </div>
    </DocsPageShell>
  );
}
