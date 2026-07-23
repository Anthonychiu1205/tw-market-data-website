import type { Metadata } from "next";

import { getLocale } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { errata } from "@/src/content/errata";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";
import type { AppLocale } from "@/src/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Errata — corrections to the data catalog" : "勘誤 — 資料型錄的公開更正";
  const description = isEn
    ? "A public log of corrections to the TW Market Data catalog: overclaimed grades fixed, empty datasets delisted, wrong fields rewritten. We publish our mistakes."
    : "TW Market Data 資料型錄的公開更正紀錄:修正誇大的分級、下架空殼資料集、改寫錯誤欄位。我們公開自己的錯誤。";
  return {
    title,
    description,
    alternates: buildAlternates(l, "/errata"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

export default async function ErrataPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const bi = (v: { en: string; zh: string }) => (en ? v.en : v.zh);

  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{en ? "Errata" : "勘誤"}</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {en
            ? "This is a public log of corrections we have made to the data catalog — grades that overclaimed, datasets that were sold with no live data, fields that did not match the real response. A data API that hides its mistakes is the one you should not trust, so we publish ours. Newest first."
            : "這是我們對資料型錄所做更正的公開紀錄——誇大的分級、以空殼販售的資料集、與真實回應不符的欄位。會隱藏錯誤的資料 API 才不該信任,所以我們把自己的錯誤公開。由新到舊。"}
        </p>
      </section>

      <div className="space-y-6">
        {errata.map((e) => (
          <article key={`${e.date}-${e.area}`} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <time dateTime={e.date} className="font-mono">{e.date}</time>
              <span className="rounded border border-slate-200 px-2 py-0.5 font-mono text-slate-600">{e.area}</span>
            </div>
            <h2 className="mt-3 text-base font-semibold text-slate-900">{bi(e.title)}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{en ? "Before" : "原本"}</dt>
                <dd className="mt-1 text-sm leading-7 text-slate-600">{bi(e.before)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{en ? "Now" : "現在"}</dt>
                <dd className="mt-1 text-sm leading-7 text-slate-700">{bi(e.after)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Container>
  );
}
