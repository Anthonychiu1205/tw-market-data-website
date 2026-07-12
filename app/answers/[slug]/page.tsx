import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl } from "@/src/config/site";
import { answerPages, getAnswerPageBySlug } from "@/src/content/answer-pages";

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
  return {
    // Title == the question (answer-shaped page).
    title: page.question,
    description: page.description,
    alternates: { canonical: `/answers/${page.slug}` },
    // Draft pages are noindex until Cowork fills the English content slots / boss reviews.
    robots: isDraft ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: page.question,
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

  return (
    <div lang={page.locale === "en" ? "en" : "zh-Hant"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}

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
