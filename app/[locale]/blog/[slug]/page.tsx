import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/src/components/blog/blog-article";
import { siteConfig } from "@/src/config/site";
import { getAllBlogPosts, getBlogPostBySlug } from "@/src/content/blog-posts";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// Static (generateStaticParams), revalidated hourly — repo-driven markdown, no backend.
export const revalidate = 3600;

type BlogDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function toAbsoluteUrl(pathname: string) {
  try {
    return new URL(pathname, siteConfig.url).toString();
  } catch {
    return pathname;
  }
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "文章不存在" };
  }

  const canonicalPath = `/blog/${post.slug}`;
  // On /en use the post's English metadata (I18N-FIX-04): untranslated posts fall back to zh, which
  // pairs with the rendered §2.5 notice.
  const isEn = locale === "en";
  const seoTitle = isEn ? post.seoTitle_en ?? post.title_en ?? post.seoTitle : post.seoTitle;
  const metaDescription = isEn ? post.description_en ?? post.description : post.description;
  const metaTags = isEn ? post.tags_en ?? post.tags : post.tags;
  const metaKeywords = isEn ? post.keywords_en ?? post.keywords : post.keywords;

  return {
    title: seoTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: post.author }],
    alternates: buildAlternates(l, canonicalPath),
    openGraph: {
      type: "article",
      title: seoTitle,
      description: metaDescription,
      url: canonicalPath,
      locale: OG_LOCALE[l],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: metaTags,
      images: [toAbsoluteUrl(post.coverImage)],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: metaDescription,
      images: [toAbsoluteUrl(post.coverImage)],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isEn = locale === "en";
  const ldTitle = isEn ? post.seoTitle_en ?? post.title_en ?? post.seoTitle : post.seoTitle;
  const ldDescription = isEn ? post.description_en ?? post.description : post.description;
  const ldHeadline = isEn ? post.title_en ?? post.title : post.title;

  const articlePath = `/blog/${post.slug}`;
  const articleUrl = toAbsoluteUrl(articlePath);
  const blogUrl = toAbsoluteUrl("/blog");
  const homeUrl = toAbsoluteUrl("/");

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: ldHeadline,
    name: ldTitle,
    description: ldDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "TW Market Data",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
    articleSection: post.category,
    keywords: (isEn ? post.keywords_en ?? post.keywords : post.keywords).join(", "),
    image: toAbsoluteUrl(post.coverImage),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: blogUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ldHeadline,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BlogArticle post={post} />
    </>
  );
}
