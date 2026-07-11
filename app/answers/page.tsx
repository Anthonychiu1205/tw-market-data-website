import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/ui/container";
import { getPublishedAnswerPages } from "@/src/content/answer-pages";

// Hub for AEO-01 §2.3 answer-shaped pages. Only lists PUBLISHED pages; while every page is still a
// draft (awaiting Cowork content) this hub is noindex so no thin/empty page is indexed.
const published = getPublishedAnswerPages();

export const metadata: Metadata = {
  title: "Answers | TW Market Data",
  description: "Direct answers to common questions about Taiwan stock market data and APIs.",
  alternates: { canonical: "/answers" },
  robots: published.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
};

export default function AnswersIndexPage() {
  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Answers</h1>
          <p className="text-base leading-7 text-slate-600">
            Direct answers to common questions about Taiwan stock market data and APIs.
          </p>
        </header>

        {published.length > 0 ? (
          <ul className="space-y-3">
            {published.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/answers/${page.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 transition hover:border-slate-400 hover:text-slate-950"
                >
                  {page.question}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Answer pages are being prepared.</p>
        )}
      </div>
    </Container>
  );
}
