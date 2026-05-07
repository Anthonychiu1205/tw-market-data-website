import { BlogCard } from "@/src/components/blog/blog-card";
import { Container } from "@/src/components/ui/container";
import type { BlogPost } from "@/src/content/blog-posts";

type BlogIndexProps = {
  posts: BlogPost[];
};

export function BlogIndex({ posts }: BlogIndexProps) {
  const hasPosts = posts.length > 0;

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <header className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{hasPosts ? "觀點文章" : "觀點文章整理中"}</h1>
          <p className="text-sm leading-7 text-slate-600">
            {hasPosts ? "從資料導入、研究流程到 API 實作，整理可直接落地的台股資料實戰內容。" : "內容更新中，請稍後回來查看。"}
          </p>
        </header>

        {hasPosts ? (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white px-5 sm:px-7">
            <div className="divide-y divide-slate-200">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-sm leading-7 text-slate-600">我們正在整理新的文章編排與主題內容，完成後會在此頁重新開放瀏覽。</p>
          </section>
        )}
      </div>
    </Container>
  );
}
