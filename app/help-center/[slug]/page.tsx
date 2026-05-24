import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HelpCenterArticleShell } from "@/src/components/help-center/help-center-shell";
import { getHelpArticleBySlug, helpCenterArticles } from "@/src/content/help-center-articles";

type HelpCenterArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return helpCenterArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: HelpCenterArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);

  if (!article) {
    return {
      title: "幫助中心文章",
    };
  }

  return {
    title: `${article.title} | TW Market Data 幫助中心`,
    description: article.description,
    alternates: {
      canonical: `/help-center/${article.slug}`,
    },
  };
}

export default async function HelpCenterArticlePage({ params }: HelpCenterArticlePageProps) {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <HelpCenterArticleShell article={article} />;
}
