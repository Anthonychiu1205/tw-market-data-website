import Link from "next/link";

import { docsPageNav } from "@/src/content/docs";
import type { DocsSection } from "@/src/content/docs";

import { Container } from "@/src/components/ui/container";

import { TocNav } from "./toc-nav";

type DocsLayoutProps = {
  title: string;
  description: string;
  sections: DocsSection[];
  children: React.ReactNode;
};

export function DocsLayout({ title, description, sections, children }: DocsLayoutProps) {
  return (
    <Container className="py-10">
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,720px)_220px] lg:justify-center">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">文件導覽</p>
            <nav className="mt-3 space-y-1">
              {docsPageNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">文件</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
          </section>
          {children}
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">本頁章節</p>
            <nav className="mt-3">
              <TocNav sections={sections} />
            </nav>
          </div>
        </aside>
      </div>
    </Container>
  );
}
