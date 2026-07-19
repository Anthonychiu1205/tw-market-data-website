import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { ArticleOutline } from "@/src/components/blog/article-outline";
import { Container } from "@/src/components/ui/container";
import { getLocalizedBlogPost, type BlogBodyBlock, type BlogPost } from "@/src/content/blog-posts";

type BlogArticleProps = {
  post: BlogPost;
};

function renderBlock(block: BlogBodyBlock, index: number) {
  if (block.type === "heading") {
    const HeadingTag = block.level === 3 ? "h3" : "h2";
    return (
      <HeadingTag
        id={block.id}
        key={`heading-${index}`}
        className={
          block.level === 3
            ? "scroll-mt-28 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
            : "scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        }
      >
        {block.text}
      </HeadingTag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p key={`paragraph-${index}`} className="text-base leading-8 text-slate-700">
        {block.text}
      </p>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote key={`quote-${index}`} className="rounded-xl border-l-4 border-slate-300 bg-slate-50 px-5 py-4 text-slate-700">
        <p className="text-base leading-8">{block.text}</p>
      </blockquote>
    );
  }

  if (block.type === "callout") {
    return (
      <div key={`callout-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm leading-7 text-slate-700">{block.text}</p>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={`list-${index}`} className="list-disc space-y-2 pl-6 text-base leading-8 text-slate-700">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <pre key={`code-${index}`} className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
      <code>{block.code}</code>
    </pre>
  );
}

export async function BlogArticle({ post }: BlogArticleProps) {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const view = getLocalizedBlogPost(post, locale);
  const outlineSections = [
    ...(view.keyTakeaways?.length ? [{ id: "key-takeaways", title: t("keyTakeaways") }] : []),
    ...view.body
      .filter((block): block is Extract<BlogBodyBlock, { type: "heading" }> => block.type === "heading" && block.level === 2)
      .map((block, idx) => ({
        id: block.id || `section-${idx + 1}`,
        title: block.text,
      })),
  ];

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,820px)_240px]">
        <article className="max-w-[820px] space-y-8">
          <Link href="/blog" className="inline-flex text-sm text-slate-600 hover:text-slate-900">
            ← {t("backToBlog")}
          </Link>

          <header className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{view.title}</h1>
            <p className="text-base leading-8 text-slate-700">{view.excerpt}</p>
            <div className="text-sm text-slate-500">{post.publishedAt}</div>
            {locale === "en" && !view.hasEnglish ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                {t("englishNotice")}
              </p>
            ) : null}
          </header>

          {view.keyTakeaways?.length ? (
            <section id="key-takeaways" className="scroll-mt-28 rounded-xl border border-slate-200 bg-slate-50/70 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">{t("keyTakeaways")}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                {view.keyTakeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-100">
              <Image src={post.coverImage} alt={post.coverAlt} fill className="object-cover" sizes="(min-width: 1280px) 820px, 100vw" priority />
            </div>
          </div>

          <div className="space-y-6">{view.body.map((block, index) => renderBlock(block, index))}</div>

          <footer className="space-y-4 border-t border-slate-200 pt-6">
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">{view.disclaimer}</p>
            <Link href="/blog" className="inline-flex text-sm text-slate-600 hover:text-slate-900">
              ← {t("backToList")}
            </Link>
          </footer>
        </article>

        <ArticleOutline sections={outlineSections} />
      </div>
    </Container>
  );
}
