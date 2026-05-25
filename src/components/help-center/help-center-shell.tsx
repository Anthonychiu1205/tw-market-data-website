import Link from "next/link";

import type { HelpArticle } from "@/src/content/help-center-articles";
import { helpCenterArticles, helpCenterCategories, helpCenterMeta } from "@/src/content/help-center-articles";
import { HelpCenterArticleNav, HelpCenterIndexPanels } from "@/src/components/help-center/help-center-nav-search";

type HelpCenterArticleShellProps = {
  article: HelpArticle;
};

export function HelpCenterIndex() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{helpCenterMeta.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          查找 API key、API 呼叫、錯誤排查與資料使用相關說明。若問題持續發生，請保留 requestId、endpoint、查詢參數與發生時間，方便支援團隊排查。
        </p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {helpCenterCategories.map((category) => (
          <article key={category.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">{category.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{category.description}</p>
          </article>
        ))}
      </section>

      <HelpCenterIndexPanels articles={helpCenterArticles} categories={helpCenterCategories} />

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">仍需要協助？</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          若問題持續發生，請附上 requestId、endpoint、查詢參數與發生時間，寄至{" "}
          <a href="mailto:avenra.platform@gmail.com" className="font-medium text-slate-900 underline underline-offset-4">
            avenra.platform@gmail.com
          </a>
          。
        </p>
      </section>
    </div>
  );
}

export function HelpCenterArticleShell({ article }: HelpCenterArticleShellProps) {
  const relatedArticles = article.related
    .map((slug) => helpCenterArticles.find((entry) => entry.slug === slug))
    .filter((entry): entry is HelpArticle => entry !== undefined)
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 text-sm text-slate-500">
        <Link href="/help-center" className="hover:text-slate-800">
          幫助中心
        </Link>{" "}
        / <span className="text-slate-700">{article.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_220px]">
        <HelpCenterArticleNav articles={helpCenterArticles} categories={helpCenterCategories} currentSlug={article.slug} />

        <article className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{article.title}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">{article.description}</p>

          <div className="mt-6 space-y-8">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-3 border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
                {(section.paragraphs ?? []).map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
                {(section.steps ?? []).length ? (
                  <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
                    {(section.steps ?? []).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : null}
                {(section.notes ?? []).length ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                    {(section.notes ?? []).map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <h2 className="text-sm font-semibold text-slate-900">相關文章</h2>
            <ul className="mt-2 space-y-2">
              {relatedArticles.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/help-center/${entry.slug}`}
                    className="block rounded-md border border-slate-200 px-2.5 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <h2 className="text-sm font-semibold text-slate-900">需要協助？</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">請整理 requestId、endpoint、查詢參數與發生時間後，聯絡支援。</p>
            <a
              href="mailto:avenra.platform@gmail.com"
              className="mt-2 inline-block text-sm font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
            >
              avenra.platform@gmail.com
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
