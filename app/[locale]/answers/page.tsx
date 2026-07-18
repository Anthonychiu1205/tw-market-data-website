import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { getPublishedAnswerPages } from "@/src/content/answer-pages";
import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// Hub for AEO-01 §2.3 answer-shaped pages. Only lists PUBLISHED pages; while every page is still a
// draft (awaiting Cowork content) this hub is noindex so no thin/empty page is indexed.
const published = getPublishedAnswerPages();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Answers | TW Market Data" : "解答 | TW Market Data";
  const description = isEn
    ? "Direct answers to common questions about Taiwan stock market data and APIs."
    : "台股市場資料與 API 常見問題的直接解答。";
  return {
    title,
    description,
    alternates: buildAlternates(l, "/answers"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
    robots: published.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function AnswersIndexPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("answers");
  // Each answer entry is already authored per-locale — list only the current locale's entries.
  const localePages = getPublishedAnswerPages(locale);

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("title")}</h1>
          <p className="text-base leading-7 text-slate-600">{t("subtitle")}</p>
        </header>

        {localePages.length > 0 ? (
          <ul className="space-y-3">
            {localePages.map((page) => (
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
          <p className="text-sm text-slate-500">{t("empty")}</p>
        )}
      </div>
    </Container>
  );
}
