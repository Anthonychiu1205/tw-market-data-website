"use client";

import { useEffect, useMemo, useState } from "react";

type OutlineSection = {
  id: string;
  title: string;
};

type ArticleOutlineProps = {
  sections: OutlineSection[];
};

export function ArticleOutline({ sections }: ArticleOutlineProps) {
  const validSections = useMemo(() => sections.filter((section) => section.id && section.title), [sections]);
  const [activeId, setActiveId] = useState(validSections[0]?.id ?? "");

  useEffect(() => {
    if (!validSections.length || typeof window === "undefined") return;

    const elements = validSections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { root: null, rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [validSections]);

  if (!validSections.length) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 border-l border-slate-200 pl-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">本文目錄</h2>
        <nav className="mt-3">
          {validSections.map((section) => {
            const active = section.id === activeId;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={[
                  "block border-l-2 py-2 pl-3 text-sm leading-5 transition-colors",
                  active ? "border-slate-950 font-medium text-slate-950" : "border-transparent text-slate-500 hover:text-slate-950",
                ].join(" ")}
              >
                {section.title}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
