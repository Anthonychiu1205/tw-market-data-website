import type { ComponentType } from "react";

import { blogPosts as legacyPosts } from "@/src/content/blog";
import { getAllBlogPosts as getNextPosts, getBlogPostBySlug as getNextPostBySlug } from "@/src/content/blog-posts";

export type BlogDetailFaqItem = {
  question: string;
  answer: string;
};

export type BlogDetailPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  topic: {
    slug: string;
    label: string;
  };
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  tags: string[];
  keywords: string[];
  lead: string;
  tldr: string[];
  tableOfContents: Array<{ id: string; label: string }>;
  faq: BlogDetailFaqItem[];
  nextStepIntro: string;
  nextStepItems: string[];
  ctaPrompt: string;
  footerNote: string;
  content: ComponentType;
  sourceMode: "legacy" | "next";
};

function slugifyHeading(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function toLegacyTopicSlug(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, "-");
}

function makeLegacyContent(body: string[]): ComponentType {
  return function LegacyContent() {
    return (
      <>
        {body.map((paragraph, idx) => (
          <section key={`${idx}-${paragraph.slice(0, 24)}`} id={idx === 0 ? "overview" : `section-${idx}`} className="scroll-mt-24 space-y-4">
            <p className="text-base leading-8 text-slate-700">{paragraph}</p>
          </section>
        ))}
      </>
    );
  };
}

function mapLegacyDetail() {
  return legacyPosts.map<BlogDetailPost>((post) => {
    const primaryHeading = post.body[0] ?? post.excerpt;
    const tocId = slugifyHeading(primaryHeading) || "overview";

    return {
      slug: post.slug,
      title: post.title,
      seoTitle: post.title,
      description: post.excerpt,
      category: post.category,
      topic: {
        slug: toLegacyTopicSlug(post.category),
        label: post.category,
      },
      publishedAt: post.publishedAt,
      updatedAt: post.publishedAt,
      readingTime: `${post.readingMinutes} 分鐘`,
      author: "TW Market Data",
      tags: [post.category],
      keywords: [post.category, "TW Market Data", "台股資料 API"],
      lead: post.excerpt,
      tldr: [post.excerpt],
      tableOfContents: [{ id: tocId, label: "重點摘要" }],
      faq: [],
      nextStepIntro: "想進一步評估方案，可前往 pricing、docs 或聯繫團隊。",
      nextStepItems: ["查看方案", "閱讀文件", "聯繫團隊"],
      ctaPrompt: "若你想把資料接進實際工作流，建議先從 docs 與 pricing 開始。",
      footerNote: "內容僅供技術與資料流程參考，不構成投資建議。",
      content: makeLegacyContent(post.body),
      sourceMode: "legacy",
    };
  });
}

function mapNextDetail() {
  return getNextPosts().map<BlogDetailPost>((post) => ({
    slug: post.slug,
    title: post.title,
    seoTitle: post.seoTitle,
    description: post.description,
    category: post.category,
    topic: {
      slug: post.topic.slug,
      label: post.topic.label,
    },
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: post.readingTime,
    author: post.author,
    tags: post.tags,
    keywords: post.keywords,
    lead: post.lead,
    tldr: post.tldr,
    tableOfContents: post.tableOfContents,
    faq: post.faq,
    nextStepIntro: post.nextStepIntro,
    nextStepItems: post.nextStepItems,
    ctaPrompt: post.ctaPrompt,
    footerNote: post.footerNote,
    content: post.content,
    sourceMode: "next",
  }));
}

function mergeBySlug(preferred: BlogDetailPost[], fallback: BlogDetailPost[]) {
  const map = new Map<string, BlogDetailPost>();

  for (const post of fallback) {
    map.set(post.slug, post);
  }

  for (const post of preferred) {
    map.set(post.slug, post);
  }

  return Array.from(map.values()).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogDetailBySlug(slug: string): BlogDetailPost | null {
  const nextDirect = getNextPostBySlug(slug);
  if (nextDirect) {
    const mapped = mapNextDetail().find((post) => post.slug === slug);
    return mapped ?? null;
  }

  const merged = mergeBySlug(mapNextDetail(), mapLegacyDetail());
  return merged.find((post) => post.slug === slug) ?? null;
}

export function getAllBlogDetailSlugs(): string[] {
  const merged = mergeBySlug(mapNextDetail(), mapLegacyDetail());
  return merged.map((post) => post.slug);
}
