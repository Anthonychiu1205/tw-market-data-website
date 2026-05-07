"use client";

import { useEffect, useState } from "react";

import { cn } from "@/src/lib/cn";

import type { DocsSection } from "@/src/content/docs";

type TocNavProps = {
  sections: DocsSection[];
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export function TocNav({
  sections,
  className,
  itemClassName = "block rounded-md px-2 py-1 text-sm transition",
  activeClassName = "bg-teal-50 text-teal-700",
  inactiveClassName = "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
}: TocNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const sectionIds = sections.map((section) => section.id);
    if (!sectionIds.length) return;

    const updateActiveSection = () => {
      const offset = 140;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset) {
          current = id;
        } else {
          break;
        }
      }

      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;
      if (nearBottom) {
        current = sectionIds[sectionIds.length - 1];
      }

      setActive(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  return (
    <ul className={cn("space-y-1", className)}>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById(section.id);
              if (!target) return;
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(null, "", `#${section.id}`);
              setActive(section.id);
            }}
            className={cn(
              itemClassName,
              active === section.id ? activeClassName : inactiveClassName,
            )}
          >
            {section.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
