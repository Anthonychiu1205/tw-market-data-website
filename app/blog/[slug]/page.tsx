import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/src/components/blog/blog-article";
import { siteConfig } from "@/src/config/site";
import { getAllBlogPosts, getBlogPostBySlug } from "@/src/content/blog-posts";

// Static (generateStaticParams), revalidated hourly — repo-driven markdown, no backend.
export const revalidate = 3600;

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "文章不存在" };
  }

  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: post.seoTitle,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.description,
      url: canonicalPath,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [toAbsoluteUrl(post.coverImage)],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
      images: [toAbsoluteUrl(post.coverImage)],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articlePath = `/blog/${post.slug}`;
  const articleUrl = toAbsoluteUrl(articlePath);
  const blogUrl = toAbsoluteUrl("/blog");
  const homeUrl = toAbsoluteUrl("/");

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle,
    description: post.description,
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
    keywords: post.keywords.join(", "),
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
        name: post.seoTitle,
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
