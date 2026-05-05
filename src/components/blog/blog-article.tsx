import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import type { BlogPost } from "@/src/content/blog-posts";

type BlogArticleProps = {
  post: BlogPost;
};

export function BlogArticle({ post }: BlogArticleProps) {
  const ArticleContent = post.content;

  return (
    <Container className="py-12 sm:py-14">
      <article className="mx-auto max-w-[860px] space-y-10">
        <Link href="/blog" className="inline-flex text-sm text-slate-600 hover:text-slate-900">
          ← 返回 Blog
        </Link>

        <header className="space-y-4 border-b border-slate-200 pb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{post.title}</h1>
          <p className="max-w-4xl text-lg leading-9 text-slate-700">{post.lead}</p>
        </header>

        <div className="space-y-11">
          <ArticleContent />
        </div>

        {post.faq.length > 0 ? (
          <section id="faq" className="scroll-mt-24 space-y-5 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">FAQ</h2>
            <div className="space-y-6">
              {post.faq.map((item) => (
                <div key={item.question} className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                  <p className="text-base leading-8 text-slate-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {post.nextStepItems.length > 0 ? (
          <section id="next-step" className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">下一步</h2>
            <p className="text-base leading-8 text-slate-700">{post.nextStepIntro}</p>
            <ol className="space-y-2 text-base leading-8 text-slate-700">
              {post.nextStepItems.map((item, index) => (
                <li key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="space-y-5 border-t border-slate-200 pt-8">
          <p className="text-base leading-8 text-slate-800">{post.ctaPrompt}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs" className={buttonClass("secondary")}>
              Read the API docs
            </Link>
            <Link href="/pricing" className={buttonClass("secondary")}>
              View pricing
            </Link>
          </div>
          <p className="text-sm leading-7 text-slate-600">{post.footerNote}</p>
        </section>
      </article>
    </Container>
  );
}
