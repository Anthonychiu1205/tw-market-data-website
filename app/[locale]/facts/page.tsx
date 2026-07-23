import type { Metadata } from "next";

import { getLocale } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { Link } from "@/src/i18n/navigation";
import { factsTopics } from "@/src/content/facts";
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
  const title = isEn ? "Market Facts — Taiwan market statistics" : "統計資料室 — 台股統計數據";
  const description = isEn
    ? "Pipeline-generated public statistics on the Taiwan market: rules history, monthly seasonality, delistings, and dividend fill rates. Every figure carries its data as_of and methodology, and is queryable via the TWMD API."
    : "由 pipeline 自動生成的台股公開統計:制度沿革、月度季節性、歷年下市家數與填息基率。每個數字都帶資料 as_of 與方法論,並可透過 TWMD API 直查。";
  return {
    title,
    description,
    alternates: buildAlternates(l, "/facts"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

export default async function FactsIndexPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const bi = (v: { en: string; zh: string }) => (en ? v.en : v.zh);

  return (
    <Container className="space-y-10 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {en ? "Market Facts" : "統計資料室"}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {en
            ? "Public statistics on the Taiwan market, generated straight from the TWMD database — not articles. There is no author and no publish date; each figure instead carries the data's as_of cut-off and a plain-language methodology, and every table is downloadable as CSV and queryable via the API. Pages are published as their data sources are verified."
            : "直接由 TWMD 資料庫生成的台股公開統計——不是文章。沒有作者、沒有發文日;取而代之的是每個數字的資料 as_of 截止日與白話方法論,每張表都可下載 CSV 並透過 API 直查。各頁在其資料源確認後才上線。"}
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {factsTopics.map((topic) => {
          const badge = (
            <span className="inline-flex items-center rounded border border-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-500">
              {bi(topic.coverage)}
            </span>
          );
          const body = (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">{bi(topic.title)}</h2>
                {topic.published ? (
                  badge
                ) : (
                  <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                    {en ? "Coming soon" : "建置中"}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{bi(topic.blurb)}</p>
              {topic.published ? <div className="mt-3">{badge}</div> : null}
            </>
          );

          // A topic only becomes a link once its page ships; until then it is a non-interactive card
          // (no dead link) — the section never points at a /facts/<slug> that does not exist yet.
          return topic.published ? (
            <Link
              key={topic.slug}
              href={`/facts/${topic.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {body}
            </Link>
          ) : (
            <div
              key={topic.slug}
              className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5"
              aria-disabled="true"
            >
              {body}
            </div>
          );
        })}
      </div>

      <section className="border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-600">
          {en
            ? "These statistics are auto-generated from the same data behind the TWMD API."
            : "這些統計由 TWMD API 背後的同一份資料自動生成。"}{" "}
          <Link href="/datasets" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
            {en ? "Explore the full dataset catalog" : "探索完整資料型錄"}
          </Link>
        </p>
      </section>
    </Container>
  );
}
