import { blogPosts as legacyPosts } from "@/src/content/blog";
import { getAllBlogPosts as getNextPosts, getBlogTopics as getNextTopics, type BlogTopicSummary as NextTopicSummary } from "@/src/content/blog-posts";

export type BlogTopicSummary = {
  slug: string;
  label: string;
  count: number;
};

export type BlogIndexItem = {
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
  readingTime: string;
  author: string;
};

export type BlogIndexPayload = {
  posts: BlogIndexItem[];
  allPosts: BlogIndexItem[];
  topics: BlogTopicSummary[];
  activeTopic: string | null;
  sourceMode: "legacy_only" | "next_only" | "dual";
};

function normalizeDate(input: string) {
  const parsed = Date.parse(input);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : input;
}

function toLegacyTopicSlug(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, "-");
}

function mapLegacyPost() {
  return legacyPosts.map<BlogIndexItem>((post) => ({
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
    readingTime: `${post.readingMinutes} 分鐘`,
    author: "TW Market Data",
  }));
}

function mapNextPost() {
  return getNextPosts().map<BlogIndexItem>((post) => ({
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
    readingTime: post.readingTime,
    author: post.author,
  }));
}

function mergePosts(preferred: BlogIndexItem[], fallback: BlogIndexItem[]) {
  const map = new Map<string, BlogIndexItem>();

  for (const post of fallback) {
    map.set(post.slug, post);
  }

  for (const post of preferred) {
    map.set(post.slug, post);
  }

  return Array.from(map.values()).sort((a, b) => normalizeDate(b.publishedAt).localeCompare(normalizeDate(a.publishedAt)));
}

function mergeTopics(posts: BlogIndexItem[]) {
  const topicMap = new Map<string, BlogTopicSummary>();

  for (const post of posts) {
    const existing = topicMap.get(post.topic.slug);
    if (existing) {
      existing.count += 1;
      continue;
    }

    topicMap.set(post.topic.slug, {
      slug: post.topic.slug,
      label: post.topic.label,
      count: 1,
    });
  }

  return Array.from(topicMap.values()).sort((a, b) => a.label.localeCompare(b.label, "zh-Hant"));
}

function normalizeActiveTopic(activeTopic: string | null | undefined, topics: BlogTopicSummary[]) {
  if (!activeTopic) return null;
  const topic = activeTopic.toLowerCase();
  return topics.some((item) => item.slug === topic) ? topic : null;
}

export function getBlogIndexPayload(activeTopic?: string | null): BlogIndexPayload {
  const next = mapNextPost();
  const legacy = mapLegacyPost();

  const allPosts = mergePosts(next, legacy);
  const nextTopics = getNextTopics().map<BlogTopicSummary>((topic: NextTopicSummary) => ({
    slug: topic.slug,
    label: topic.label,
    count: topic.count,
  }));

  const fallbackTopics = mergeTopics(allPosts);
  const topics = nextTopics.length > 0 ? mergeTopics([...allPosts]).map((item) => {
    const matched = nextTopics.find((topic) => topic.slug === item.slug);
    return matched ? { ...item, label: matched.label } : item;
  }) : fallbackTopics;

  const normalizedTopic = normalizeActiveTopic(activeTopic, topics);
  const posts = normalizedTopic ? allPosts.filter((post) => post.topic.slug === normalizedTopic) : allPosts;

  const sourceMode: BlogIndexPayload["sourceMode"] = next.length > 0 && legacy.length > 0 ? "dual" : next.length > 0 ? "next_only" : "legacy_only";

  return {
    posts,
    allPosts,
    topics,
    activeTopic: normalizedTopic,
    sourceMode,
  };
}
