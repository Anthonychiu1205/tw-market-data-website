import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ApiSidePanel } from "@/src/components/docs/api-side-panel";
import { DocsLandingContent } from "@/src/components/docs/docs-landing-content";
import { DocsPageShell } from "@/src/components/docs/docs-page-shell";
import { QuickStartContent } from "@/src/components/docs/quick-start-content";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { TwseDailyPriceLiveDemo } from "@/src/components/docs/twse-daily-price-live-demo";
import { buttonClass } from "@/src/components/ui/button";
import { docsPages, getDocsPageBySlug, resolveDocsGroupTargetHref } from "@/src/content/docs-pages";

type DocsDynamicPageProps = {
  params: Promise<{ slug: string[] }>;
};

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
  };
}

export default async function DocsDynamicPage({ params }: DocsDynamicPageProps) {
  const { slug } = await params;
  const page = getDocsPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const currentHref = `/docs/${slug.join("/")}`;
  const groupTargetHref = resolveDocsGroupTargetHref(currentHref);
  if (groupTargetHref && groupTargetHref !== currentHref) {
    redirect(groupTargetHref);
  }

  if (page.apiReference) {
    const api = page.apiReference;
    const successStatusExample = api.sidePanel.statusExamples.find((example) => example.status === "200");

    if (api.layoutVariant === "data-api-standard") {
      return (
        <DocsPageShell
          page={page}
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
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <span className="rounded border border-slate-300 bg-white px-2 py-0.5 font-semibold text-slate-800">{api.method}</span>
                  <code className="truncate font-mono text-slate-700">{api.endpoint}</code>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="overview">Overview</SectionHeading>
              {api.overview.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {api.useCases.map((item) => (
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
                    {api.queryParameters.map((parameter) => (
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
              {api.responseSummary.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}
              {successStatusExample?.body ? (
                <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
                  <code>{successStatusExample.body}</code>
                </pre>
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
                    {api.responseFields.map((field) => (
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
                {api.notes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {api.planRequirement ? (
              <section className="space-y-3">
                <SectionHeading id="plan-requirement">{api.planRequirement.title ?? "Plan Requirement"}</SectionHeading>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                  {api.planRequirement.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </DocsPageShell>
      );
    }

    return (
      <DocsPageShell
        page={page}
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
            {api.overview.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
          </section>

          {api.planRequirement ? (
            <section className="space-y-3 border-b border-slate-200 pb-8">
              <SectionHeading id="plan-requirement">{api.planRequirement.title ?? "適用方案"}</SectionHeading>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {api.planRequirement.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-3 border-b border-slate-200 pb-8">
            <SectionHeading id="request">Request</SectionHeading>
            <p className="text-sm leading-7 text-slate-600">此 endpoint 常見使用情境：</p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              {api.useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pt-1 text-sm leading-7 text-slate-600">建議接入步驟：</p>
            <ol className="space-y-2 text-sm leading-7 text-slate-700">
              {api.gettingStarted.map((item, index) => (
                <li key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
            <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              <code>{api.exampleRequestCurl}</code>
            </pre>
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
                  {api.queryParameters.map((parameter) => (
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
            {api.responseSummary.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
            {successStatusExample?.body ? (
              <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
                <code>{successStatusExample.body}</code>
              </pre>
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
                  {api.responseFields.map((field) => (
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
              {api.notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <SectionHeading id="error-boundaries">錯誤與邊界情況</SectionHeading>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
              {(api.errorCases ?? api.sidePanel.statusExamples.filter((example) => example.status !== "200").map((example) => example.description)).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "quick-start") {
    return (
      <DocsPageShell page={page} pageLabel="文件總覽">
        <div className="space-y-8">
          <QuickStartContent />
          <TwseDailyPriceLiveDemo />
        </div>
      </DocsPageShell>
    );
  }

  if (page.slug.join("/") === "introduction") {
    return (
      <DocsPageShell page={page} pageLabel="文件總覽">
        <DocsLandingContent />
      </DocsPageShell>
    );
  }

  return (
    <DocsPageShell page={page} pageLabel={page.slug.join("/") === "workflows/company-fundamentals" ? "Workflows / Use Cases" : "文件"}>
      <div className="space-y-8 py-8">
        {page.sections.map((section, index) => (
          <section
            key={section.id}
            className={index < page.sections.length - 1 ? "space-y-3 border-b border-slate-200 pb-8" : "space-y-3"}
          >
            <SectionHeading id={section.id}>{section.label}</SectionHeading>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.codeBlocks?.length ? (
              <div className="space-y-3">
                {section.codeBlocks.map((codeBlock, blockIndex) => (
                  <pre
                    key={`${section.id}-${codeBlock.language ?? "text"}-${blockIndex}`}
                    className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700"
                  >
                    <code>{codeBlock.code}</code>
                  </pre>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </DocsPageShell>
  );
}
