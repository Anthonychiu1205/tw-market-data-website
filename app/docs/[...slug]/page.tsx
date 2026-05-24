import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ApiRunPlayground } from "@/src/components/docs/api-run-playground";
import { ApiSidePanel } from "@/src/components/docs/api-side-panel";
import { CodeBlock } from "@/src/components/docs/code-block";
import { DocsLandingContent } from "@/src/components/docs/docs-landing-content";
import { DocsPageShell } from "@/src/components/docs/docs-page-shell";
import { QuickStartContent } from "@/src/components/docs/quick-start-content";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { buttonClass } from "@/src/components/ui/button";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { normalizeDocsSections } from "@/src/content/docs-sections";
import { resolveDocsGroupTargetHref } from "@/src/content/docs-sidebar";
import { docsPages, getDocsPageBySlug } from "@/src/content/docs-pages";

type DocsDynamicPageProps = {
  params: Promise<{ slug: string[] }>;
};

const docsCanonicalAliases: Record<string, string> = {
  "/docs/data-freshness-lineage": "/docs/data-provenance",
  "/docs/data-access": "/docs/market-coverage",
  "/docs/tools-and-mcp": "/docs/tools-mcp",
  "/docs/api-model": "/docs/openapi-spec",
  "/docs/faq": "/help-center",
  "/docs/help-center": "/help-center",
  "/docs/help-center/get-api-key": "/help-center/get-api-key",
  "/docs/help-center/call-api": "/help-center/call-api",
  "/docs/help-center/502-504-errors": "/help-center/502-504-errors",
};

function resolveDocsCanonical(href: string) {
  return docsCanonicalAliases[href] ?? href;
}

export async function generateStaticParams() {
  return docsPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: DocsDynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocsPageBySlug(slug);

  if (!page) {
    return {
      title: "文件",
    };
  }

  return {
    title: `文件｜${page.title}`,
    description: page.subtitle,
    alternates: {
      canonical: resolveDocsCanonical(page.href),
    },
    openGraph: {
      title: `${page.title} | TW Market Data Docs`,
      description: page.subtitle,
      url: resolveDocsCanonical(page.href),
      type: "article",
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
  const currentHref = `/docs/${slug.join("/")}`;
  const canonicalAlias = docsCanonicalAliases[currentHref];
  if (canonicalAlias && canonicalAlias !== currentHref) {
    redirect(canonicalAlias);
  }

  const page = getDocsPageBySlug(slug);

  if (!page) {
    notFound();
  }
  const pageForShell = { ...page, apiReferenceFactory: undefined };

  const groupTargetHref = resolveDocsGroupTargetHref(currentHref);
  if (groupTargetHref && groupTargetHref !== currentHref) {
    redirect(groupTargetHref);
  }

  const normalizedPageSections = normalizeDocsSections(page.sections);

  if (page.apiReference) {
    const api = page.apiReference;
    const successStatusExample = api.sidePanel.statusExamples.find((example) => example.status === "200");

    if (api.layoutVariant === "data-api-standard") {
      const tocSections = normalizeDocsSections([
        { id: "overview", label: "Overview" },
        { id: "request", label: "Request" },
        { id: "query-parameters", label: "Query Parameters" },
        { id: "response-shape", label: "Response Shape" },
        { id: "field-reference", label: "Field 說明" },
        { id: "usage-notes", label: "Usage Notes / 使用建議" },
      ]).map(({ id, label }) => ({ id, label }));

      return (
        <DocsPageShell
          page={pageForShell}
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
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">欄位</th>
                      <th className="px-3 py-2 font-medium">型別</th>
                      <th className="px-3 py-2 font-medium">Required</th>
                      <th className="px-3 py-2 font-medium">說明</th>
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
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">欄位路徑</th>
                      <th className="px-3 py-2 font-medium">型別</th>
                      <th className="px-3 py-2 font-medium">說明</th>
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
              <SectionHeading id="usage-notes">Usage Notes / 使用建議</SectionHeading>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {(api.notes ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

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
      { id: "request", label: "Request" },
      { id: "response", label: "Response" },
      { id: "field-reference", label: "Field 說明" },
      { id: "best-practices", label: "使用建議" },
      { id: "error-boundaries", label: "錯誤與邊界情況" },
    ]).map(({ id, label }) => ({ id, label }));

    return (
      <DocsPageShell
        page={pageForShell}
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
              <div className="flex items-center gap-2">
                <ApiRunPlayground api={api} endpointTitle={page.title} />
                <Link href="/dashboard" className={buttonClass("secondary", "shrink-0")}>
                  前往儀表板
                </Link>
              </div>
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
                    <th className="px-3 py-2 font-medium">欄位</th>
                    <th className="px-3 py-2 font-medium">型別</th>
                    <th className="px-3 py-2 font-medium">Required</th>
                    <th className="px-3 py-2 font-medium">說明</th>
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
                    <th className="px-3 py-2 font-medium">欄位路徑</th>
                    <th className="px-3 py-2 font-medium">型別</th>
                    <th className="px-3 py-2 font-medium">說明</th>
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
      <DocsPageShell page={pageForShell} pageLabel="Overview">
        <QuickStartContent />
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "introduction") {
    return (
      <DocsPageShell page={pageForShell} pageLabel="Overview">
        <DocsLandingContent />
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
      <DocsPageShell page={pageForShell} pageLabel="SDKs">
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
                    <th className="px-3 py-2 font-medium">Component</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Intended Use</th>
                    <th className="px-3 py-2 font-medium">Not Yet</th>
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
        page={pageForShell}
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
        page={pageForShell}
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
