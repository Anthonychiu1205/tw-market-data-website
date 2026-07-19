import { DocsPageShell } from "@/src/components/docs/docs-page-shell";
import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { getArticlePage, type ArticlePage } from "@/src/content/docs/article-pages";
import { findDocsSidebarLink } from "@/src/content/docs-sidebar";
import type { Bi } from "@/src/content/docs/dataset-pages";

// Bilingual renderer for v5 overview + guide "article" pages, and a graceful bilingual placeholder for
// a sidebar link whose page is not built yet (Phase 1) — so the v5 IA never produces a 404.

type Locale = string;

function bi(value: Bi, locale: Locale): string {
  return locale === "en" ? value.en : value.zh;
}

export function isDocsArticleOrKnownLink(slugParts: string[]): boolean {
  if (getArticlePage(slugParts)) return true;
  return findDocsSidebarLink(`/docs/${slugParts.join("/")}`) !== null;
}

function ArticleBody({ article, locale }: { article: ArticlePage; locale: Locale }) {
  const en = locale === "en";
  return (
    <div className="mt-6">
      {article.sections.map((section) => (
        <section key={section.id} className="mt-10 first:mt-0">
          <SectionHeading id={section.id}>{bi(section.heading, locale)}</SectionHeading>
          {section.paragraphs?.map((p, i) => (
            <p key={i} className="mt-3">{bi(p, locale)}</p>
          ))}
          {section.bullets?.length ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              {section.bullets.map((b, i) => (
                <li key={i}>{bi(b, locale)}</li>
              ))}
            </ul>
          ) : null}
          {section.code ? (
            <div className="mt-4">
              <CodeBlock code={section.code.code} language={section.code.language} />
            </div>
          ) : null}
        </section>
      ))}
      <p className="mt-10 text-xs text-slate-400">{en ? "English is a semantic rewrite, not a machine translation." : "英文為語義改寫,非機器翻譯。"}</p>
    </div>
  );
}

export function DocsArticlePage({ slugParts, locale }: { slugParts: string[]; locale: Locale }) {
  const article = getArticlePage(slugParts);
  const en = locale === "en";

  if (article) {
    const title = bi(article.title, locale);
    const subtitle = bi(article.subtitle, locale);
    const pageLabel = bi(article.pageLabel, locale);
    const href = `/docs/${slugParts.join("/")}`;
    const tocSections = article.sections.map((s) => ({ id: s.id, label: bi(s.heading, locale) }));
    return (
      <DocsPageShell page={{ title, subtitle, href, sections: tocSections }} tocSections={tocSections} pageLabel={pageLabel}>
        <ArticleBody article={article} locale={locale} />
      </DocsPageShell>
    );
  }

  // Placeholder for a sidebar link not built yet — honest "being written", never a 404.
  const link = findDocsSidebarLink(`/docs/${slugParts.join("/")}`);
  const title = link ? (en ? link.titleEn || link.title : link.title) : "Documentation";
  return (
    <DocsPageShell
      page={{ title, subtitle: en ? "This page is being written." : "此頁面撰寫中。", href: `/docs/${slugParts.join("/")}`, sections: [] }}
      pageLabel={en ? "Docs" : "文件"}
    >
      <p className="mt-8 text-slate-600">
        {en
          ? "This section of the documentation is being written. The surrounding structure is in place; the content is on its way."
          : "此文件章節正在撰寫中。周邊結構已就緒,內容即將補上。"}
      </p>
    </DocsPageShell>
  );
}
