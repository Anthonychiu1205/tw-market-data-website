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
    const headingElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headingElements.length) return;

    const lastSectionId = headingElements[headingElements.length - 1].id;
    const topScanLine = 160;

    const calculateActiveSection = () => {
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);

      // Lock to last section at page bottom to avoid short-last-section misses.
      if (remaining <= 24) {
        setActive(lastSectionId);
        return;
      }

      let candidateId = headingElements[0].id;

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top <= topScanLine) {
          candidateId = heading.id;
        } else {
          break;
        }
      }

      setActive(candidateId);
    };

    let frame = 0;
    const onScrollOrResize = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        calculateActiveSection();
      });
    };

    calculateActiveSection();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sections]);

  return (
    <ul className={cn("space-y-1", className)}>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
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
