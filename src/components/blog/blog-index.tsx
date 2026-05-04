import Link from "next/link";

import { BlogCard } from "@/src/components/blog/blog-card";
import { Container } from "@/src/components/ui/container";
import type { BlogIndexItem, BlogTopicSummary } from "@/src/lib/blog-adapter";
import { cn } from "@/src/lib/cn";

type BlogIndexProps = {
  posts: BlogIndexItem[];
  allPosts: BlogIndexItem[];
  topics: BlogTopicSummary[];
  activeTopic: string | null;
};

type TopicChip = {
  slug: string;
  label: string;
  href: string;
  count: number;
};

function buildTopicChips(topics: BlogTopicSummary[]): TopicChip[] {
  const allCount = topics.reduce((sum, topic) => sum + topic.count, 0);
  return [
    { slug: "all", label: "All", href: "/blog", count: allCount },
    ...topics.map((topic) => ({
      slug: topic.slug,
      label: topic.label,
      href: `/blog?category=${topic.slug}`,
      count: topic.count,
    })),
  ];
}

export function BlogIndex({ posts, allPosts, topics, activeTopic }: BlogIndexProps) {
  const featuredArticle = allPosts.find((post) => post.slug === "taiwan-stock-api-guide") ?? allPosts[0];
  const featuredSlug = featuredArticle?.slug;
  const chips = buildTopicChips(topics);
  const activeTopicSummary = activeTopic ? topics.find((topic) => topic.slug === activeTopic) : null;

  const groupedArticles = topics
    .map((topic) => ({
      topic,
      posts: allPosts.filter((post) => post.topic.slug === topic.slug && post.slug !== featuredSlug),
    }))
    .filter((group) => group.posts.length > 0);

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-[980px] space-y-10 px-4 sm:px-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Blog</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Research notes for Taiwan market data.</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            Engineering guides for Taiwan stock APIs, Python workflows, quant research, and AI financial agents.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Browse by topic</h2>
          <div className="flex flex-wrap gap-2.5">
            {chips.map((chip) => {
              const isActive = chip.slug === "all" ? !activeTopic : chip.slug === activeTopic;
              return (
                <Link
                  key={chip.slug}
                  href={chip.href}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                  )}
                >
                  {chip.label}
                  <span className={cn("ml-2 text-xs", isActive ? "text-slate-200" : "text-slate-400")}>{chip.count}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {!activeTopic && featuredArticle ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Featured</h2>
            <BlogCard post={featuredArticle} variant="featured" />
          </section>
        ) : null}

        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {activeTopicSummary ? `Articles in ${activeTopicSummary.label}` : "Articles by topic"}
          </h2>

          {activeTopicSummary ? (
            <div className="rounded-xl border border-slate-200 bg-white px-5 sm:px-7">
              <div className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedArticles.map((group) => (
                <section key={group.topic.slug} className="space-y-3">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">{group.topic.label}</h3>
                  <div className="rounded-xl border border-slate-200 bg-white px-5 sm:px-7">
                    <div className="divide-y divide-slate-200">
                      {group.posts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
