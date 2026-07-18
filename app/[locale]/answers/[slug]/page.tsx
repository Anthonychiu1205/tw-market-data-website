import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl } from "@/src/config/site";
import { answerPages, getAnswerPageBySlug } from "@/src/content/answer-pages";
import { coverageFacts } from "@/src/content/coverage-facts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return answerPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getAnswerPageBySlug(slug);
  if (!page) {
    return { title: "Not found | TW Market Data", robots: { index: false, follow: false } };
  }

  const isDraft = page.status === "draft";
  // Title defaults to the question (answer-shaped), but a page may set a keyword-rich metaTitle.
  const title = page.metaTitle ?? page.question;
  return {
    title,
    description: page.description,
    alternates: { canonical: `/answers/${page.slug}` },
    // Draft pages are noindex until Cowork fills the English content slots / boss reviews.
    robots: isDraft ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description: page.description,
      url: getAbsoluteUrl(`/answers/${page.slug}`),
      type: "article",
      locale: page.locale === "en" ? "en" : "zh_TW",
    },
  };
}

/** Off-production content-slot marker so reviewers can see what Cowork still needs to fill. */
function ContentSlot({ note }: { note: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p className="mt-3 rounded-md border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
      CONTENT SLOT (Cowork, per glossary): {note}
    </p>
  );
}

export default async function AnswerPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getAnswerPageBySlug(slug);
  if (!page) {
    notFound();
  }

  const pageUrl = getAbsoluteUrl(`/answers/${page.slug}`);
  const ctaHref = page.cta.href;
  const isProd = process.env.NODE_ENV === "production";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TW Market Data", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Answers", item: getAbsoluteUrl("/answers") },
      { "@type": "ListItem", position: 3, name: page.question, item: pageUrl },
    ],
  };

  // FAQPage schema only when real Q&A exist — never emit thin/placeholder FAQ markup.
  const faqLd =
    page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  // Article schema: the answer page IS an article answering the title question.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.metaTitle ?? page.question,
    description: page.description,
    inLanguage: page.locale === "en" ? "en" : "zh-Hant",
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
    publisher: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
  };

  // AI-agent API pages additionally describe the product (SoftwareApplication) and its flagship
  // dataset. Figures come from coverage-facts (DB-verified SSOT); only shipped capabilities claimed.
  const twse = coverageFacts.twseDailyPrice;
  const extraSchema: Record<string, unknown>[] = page.aiAgentApiSchema
    ? [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "TW Market Data API",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any (REST API over HTTP)",
          description:
            "為 AI agent 與量化流程打造的台股資料 API：結構化 JSON、每筆帶 knowledge_date 與來源 lineage，附 openapi.json 與 llms.txt 供 agent 探索。",
          url: pageUrl,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "免費層：5 檔（2330/2317/2454/0050/2603）免 API key 試用。",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Taiwan TWSE daily price (survivorship-bias-free)",
          description: `上市個股日線，回溯 ${twse.earliestDate}，含 ${twse.stoppedTradingStocks} 檔已停止交易股票的完整價史；每筆帶 knowledge_date 與來源 lineage，data_gaps 誠實揭露。`,
          url: getAbsoluteUrl("/datasets/twse-daily-price"),
          temporalCoverage: `${twse.earliestDate}/..`,
          isAccessibleForFree: true,
          creator: { "@type": "Organization", name: "TW Market Data", url: getAbsoluteUrl("/") },
          distribution: {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: "https://api.twmarketdata.com/v2/datasets/twse-daily-price",
          },
        },
      ]
    : [];

  return (
    <div lang={page.locale === "en" ? "en" : "zh-Hant"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}
      {extraSchema.map((schema, index) => (
        <script
          key={(schema["@type"] as string) ?? index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Container className="py-12 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-4 border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Answer</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{page.question}</h1>
            {page.shortAnswer ? (
              <p className="text-lg leading-8 text-slate-700">{page.shortAnswer}</p>
            ) : (
              <ContentSlot note="Lead answer: answer the title question in the first 3 sentences (subject + verifiable specifics). This is the block AI engines quote." />
            )}
          </header>

          {page.sections.map((section) => {
            const hasBody = Boolean(section.body || section.bullets?.length || section.code);
            // In production, skip sections that carry only an unfilled content slot so a published
            // page never shows a bare heading with no content.
            if (!hasBody && isProd) return null;
            return (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-950">{section.heading}</h2>
                {section.body ? <p className="text-base leading-7 text-slate-700">{section.body}</p> : null}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.code ? (
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                    <code>{section.code}</code>
                  </pre>
                ) : null}
                {section.slot ? <ContentSlot note={section.slot} /> : null}
              </section>
            );
          })}

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">Related</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href={ctaHref} className={buttonClass("primary")}>
                {page.cta.label}
              </Link>
              {page.relatedLinks?.map((link) => (
                <Link key={link.href} href={link.href} className={buttonClass("secondary")}>
                  {link.label}
                </Link>
              ))}
              <Link href="/docs/introduction" className={buttonClass("secondary")}>
                API docs
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
