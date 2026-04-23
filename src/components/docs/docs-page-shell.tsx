"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DocsSection } from "@/src/content/docs";
import type { DocsPageEntry, DocsSidebarIcon, DocsSidebarNavItem } from "@/src/content/docs-pages";
import { docsSidebarNav } from "@/src/content/docs-pages";
import { cn } from "@/src/lib/cn";

import { TocNav } from "./toc-nav";

const SITE_HEADER_HEIGHT_PX = 74;
const DESKTOP_SIDEBAR_TOP_GAP_PX = 16;
const DESKTOP_SIDEBAR_BOTTOM_GAP_PX = 16;
const SIDEBAR_EXPANDED_GROUPS_KEY = "docs-sidebar-expanded-groups";
const SIDEBAR_SCROLL_TOP_KEY = "docs-sidebar-scroll-top";

type DocsPageShellProps = {
  page: DocsPageEntry;
  children: React.ReactNode;
  tocSections?: DocsSection[];
  rightPanelTitle?: string;
  rightPanelContent?: React.ReactNode;
  pageLabel?: string;
};

function getAncestorGroupHrefs(pathname: string): string[] {
  function walk(items: DocsSidebarNavItem[], ancestors: string[]): string[] {
    for (const item of items) {
      const nextAncestors = item.children?.length ? [...ancestors, item.href] : ancestors;

      if (!item.children?.length) {
        if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
          return ancestors;
        }
        continue;
      }

      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        const deepMatch = walk(item.children, nextAncestors);
        if (deepMatch.length) return deepMatch;
        return nextAncestors;
      }

      const deepMatch = walk(item.children, nextAncestors);
      if (deepMatch.length) return deepMatch;
    }
    return [];
  }

  for (const group of docsSidebarNav) {
    const match = walk(group.items, []);
    if (match.length) return match;
  }

  return [];
}

function mergeExpandedGroupsWithActiveAncestors(expanded: string[], ancestors: string[]): string[] {
  return Array.from(new Set([...expanded, ...ancestors]));
}

function toggleGroupExpanded(expanded: string[], groupHref: string): string[] {
  if (expanded.includes(groupHref)) {
    return expanded.filter((href) => href !== groupHref);
  }
  return [...expanded, groupHref];
}

function readSidebarScrollTopFromSession(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.sessionStorage.getItem(SIDEBAR_SCROLL_TOP_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function SidebarIcon({ icon }: { icon: DocsSidebarIcon }) {
  const commonProps = {
    className: "h-4 w-4 shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (icon) {
    case "book":
      return (
        <svg {...commonProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 17A2.5 2.5 0 0 0 4 19.5V5a2 2 0 0 1 2-2h14v14" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...commonProps}>
          <path d="M5 19c2-.5 4-1.5 5.5-3L14 12.5c1.5-1.5 2.5-3.5 3-5.5-2 .5-4 1.5-5.5 3L8 13.5C6.5 15 5.5 17 5 19Z" />
          <path d="M14 7h3" />
          <path d="M7 17v3" />
        </svg>
      );
    case "database":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
        </svg>
      );
    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 3l7 3v5c0 4.4-3 8.1-7 9-4-1-7-4.6-7-9V6l7-3Z" />
          <path d="m9.5 12 1.8 1.8L14.8 10" />
        </svg>
      );
    case "braces":
      return (
        <svg {...commonProps}>
          <path d="M9 4H7a2 2 0 0 0-2 2v2c0 1.1-.9 2-2 2 1.1 0 2 .9 2 2v2a2 2 0 0 0 2 2h2" />
          <path d="M15 4h2a2 2 0 0 1 2 2v2c0 1.1.9 2 2 2-1.1 0-2 .9-2 2v2a2 2 0 0 1-2 2h-2" />
        </svg>
      );
    case "chart":
      return (
        <svg {...commonProps}>
          <path d="M3 20h18" />
          <path d="M6 15l4-4 3 2 5-6" />
        </svg>
      );
    case "building":
      return (
        <svg {...commonProps}>
          <path d="M4 21h16" />
          <path d="M6 21V5h12v16" />
          <path d="M9 9h2M13 9h2M9 13h2M13 13h2" />
        </svg>
      );
    case "earnings":
      return (
        <svg {...commonProps}>
          <path d="M4 20h16" />
          <path d="M7 16V8" />
          <path d="M12 16V5" />
          <path d="M17 16v-6" />
        </svg>
      );
    case "kpi":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 12 16 9" />
          <path d="M12 12V7" />
        </svg>
      );
    case "metrics":
      return (
        <svg {...commonProps}>
          <path d="M4 19h16" />
          <path d="M6 15h3M11 11h3M16 7h2" />
        </svg>
      );
    case "statements":
      return (
        <svg {...commonProps}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );
    case "insider":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20a6 6 0 0 1 12 0" />
        </svg>
      );
    case "news":
      return (
        <svg {...commonProps}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );
    case "holdings":
      return (
        <svg {...commonProps}>
          <path d="M4 19h16" />
          <path d="M5 11h4v8H5zM10 7h4v12h-4zM15 13h4v6h-4z" />
        </svg>
      );
    case "rates":
      return (
        <svg {...commonProps}>
          <path d="M5 16h14" />
          <path d="m8 19 4-14 4 14" />
        </svg>
      );
    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.5-4.5" />
        </svg>
      );
    case "filings":
      return (
        <svg {...commonProps}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v4h4" />
          <path d="M10 12h6M10 16h6" />
        </svg>
      );
    case "segments":
      return (
        <svg {...commonProps}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M12 5v14M4 12h16" />
        </svg>
      );
    case "prices":
      return (
        <svg {...commonProps}>
          <path d="M4 20h16" />
          <path d="M8 15v-6M12 18V7M16 14v-4" />
        </svg>
      );
    case "guide":
      return (
        <svg {...commonProps}>
          <path d="M4 6h16" />
          <path d="M4 12h10" />
          <path d="M4 18h8" />
        </svg>
      );
    case "advanced":
      return (
        <svg {...commonProps}>
          <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "support":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 4.3 1.8c-.7.7-1.3 1.1-1.3 2" />
          <circle cx="12" cy="17" r="0.5" />
        </svg>
      );
  }
}

export function DocsPageShell({ page, children, tocSections, rightPanelTitle, rightPanelContent, pageLabel = "文件" }: DocsPageShellProps) {
  const pathname = usePathname();
  const sections: DocsSection[] = (tocSections ?? page.sections).map((section) => ({ id: section.id, label: section.label }));
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);

  const activeAncestorGroups = useMemo(() => getAncestorGroupHrefs(pathname), [pathname]);

  function hasActiveDescendant(item: DocsSidebarNavItem): boolean {
    return (
      item.children?.some(
        (child) =>
          pathname === child.href ||
          pathname.startsWith(`${child.href}/`) ||
          hasActiveDescendant(child),
      ) ?? false
    );
  }

  const [userExpandedGroups, setUserExpandedGroups] = useState<string[]>(() => [...activeAncestorGroups]);

  const expandedGroups = useMemo(
    () => mergeExpandedGroupsWithActiveAncestors(userExpandedGroups, activeAncestorGroups),
    [userExpandedGroups, activeAncestorGroups],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(SIDEBAR_EXPANDED_GROUPS_KEY, JSON.stringify(userExpandedGroups));
  }, [userExpandedGroups]);

  useEffect(() => {
    const container = sidebarScrollRef.current;
    if (!container) return;
    container.scrollTop = readSidebarScrollTopFromSession();
  }, [pathname]);

  function isItemActive(item: DocsSidebarNavItem) {
    if (item.children?.length) {
      return hasActiveDescendant(item);
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  function renderSidebarItems(items: DocsSidebarNavItem[], depth = 0) {
    const isNested = depth > 0;
    return (
      <ul className={cn("space-y-0.5", isNested ? "pl-4" : "")}>
        {items.map((item) => (
          <li key={item.href}>
            {item.children?.length ? (
              <div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`${item.title}${expandedGroups.includes(item.href) ? "收合" : "展開"}`}
                    onClick={() => setUserExpandedGroups((previous) => toggleGroupExpanded(previous, item.href))}
                    className={
                      isItemActive(item)
                        ? "flex min-w-0 flex-1 items-center gap-2.5 rounded-md bg-slate-100 px-2 py-1.5 text-sm font-medium text-slate-800"
                        : "flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    }
                  >
                    {isNested ? <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" /> : <SidebarIcon icon={item.icon ?? "database"} />}
                    <span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`${item.title}${expandedGroups.includes(item.href) ? "收合" : "展開"}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                    onClick={() => setUserExpandedGroups((previous) => toggleGroupExpanded(previous, item.href))}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn("h-3.5 w-3.5 transition-transform", expandedGroups.includes(item.href) ? "rotate-90" : "")}
                      aria-hidden="true"
                    >
                      <path d="m7 5 6 5-6 5" />
                    </svg>
                  </button>
                </div>
                {expandedGroups.includes(item.href) ? <div className="mt-1">{renderSidebarItems(item.children, depth + 1)}</div> : null}
              </div>
            ) : (
              <Link
                href={item.href}
                className={
                  pathname === item.href
                    ? "flex items-center gap-2.5 rounded-md bg-slate-200 px-2 py-1.5 text-sm font-semibold text-slate-950"
                    : "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                }
              >
                {isNested ? <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" /> : <SidebarIcon icon={item.icon ?? "database"} />}
                <span>{item.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  }

  const sidebarTopOffset = SITE_HEADER_HEIGHT_PX + DESKTOP_SIDEBAR_TOP_GAP_PX;
  const sidebarHeight = `calc(100vh - ${sidebarTopOffset + DESKTOP_SIDEBAR_BOTTOM_GAP_PX}px)`;

  return (
    <div className="w-full px-8 py-10 lg:px-16">
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[200px_minmax(0,1fr)_380px]">
        <aside className="hidden lg:block">
          <div
            ref={sidebarScrollRef}
            className="sticky overflow-y-auto overscroll-contain pr-1"
            onScroll={(event) => {
              if (typeof window === "undefined") return;
              window.sessionStorage.setItem(SIDEBAR_SCROLL_TOP_KEY, String(event.currentTarget.scrollTop));
            }}
            style={{
              top: `${sidebarTopOffset}px`,
              height: sidebarHeight,
            }}
          >
            <p className="text-xs font-semibold tracking-wide text-slate-500">文件總覽</p>
            <nav className="mt-3 space-y-4">
              {docsSidebarNav.map((group) => (
                <div key={group.id}>
                  <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-slate-500">{group.label}</p>
                  {renderSidebarItems(group.items)}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          <section className="border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold tracking-wide text-slate-500">{pageLabel}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{page.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{page.subtitle}</p>
          </section>
          <div>{children}</div>
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold tracking-wide text-slate-500">{rightPanelTitle ?? "本頁章節"}</p>
            {rightPanelContent ? (
              <div className="mt-3">{rightPanelContent}</div>
            ) : (
              <nav className="mt-3">
                <TocNav
                  sections={sections}
                  className="space-y-0.5"
                  itemClassName="block border-l-2 border-transparent py-1.5 pl-2 text-sm transition"
                  activeClassName="border-slate-400 font-medium text-slate-900"
                  inactiveClassName="text-slate-500 hover:text-slate-900"
                />
              </nav>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
