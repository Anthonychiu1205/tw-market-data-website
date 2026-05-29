"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Activity,
  Bot,
  BookOpen,
  Braces,
  Building2,
  ChevronDown,
  FileCheck,
  FileSpreadsheet,
  GitBranch,
  Home,
  LifeBuoy,
  Landmark,
  LineChart,
  Network,
  Rocket,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DocsSection } from "@/src/content/docs";
import { normalizeDocsSections } from "@/src/content/docs-sections";
import {
  docsSidebarApiGroups,
  docsSidebarAiAgentItems,
  docsSidebarGuideItems,
  docsSidebarHelpItems,
  docsSidebarOverviewItems,
  docsSidebarSdkItems,
} from "@/src/content/docs-sidebar";
import type { DocsSidebarNavGroup, DocsSidebarNavItem } from "@/src/content/docs-sidebar";
import { cn } from "@/src/lib/cn";

import { TocNav } from "./toc-nav";

const SITE_HEADER_HEIGHT_PX = 74;
const DESKTOP_SIDEBAR_TOP_GAP_PX = 16;
const DESKTOP_SIDEBAR_BOTTOM_GAP_PX = 16;
const SIDEBAR_EXPANDED_GROUPS_KEY = "docs-sidebar-expanded-groups";
const SIDEBAR_SCROLL_TOP_KEY = "docs-sidebar-scroll-top";

type DocsPageShellProps = {
  page: {
    title: string;
    subtitle: string;
    sections: DocsSection[];
  };
  children: React.ReactNode;
  tocSections?: DocsSection[];
  rightPanelTitle?: string;
  rightPanelContent?: React.ReactNode;
  pageLabel?: string;
};

function itemHasActivePath(item: DocsSidebarNavItem, pathname: string): boolean {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
    return true;
  }
  return item.children?.some((child) => itemHasActivePath(child, pathname)) ?? false;
}

function groupHasActivePath(group: DocsSidebarNavGroup, pathname: string): boolean {
  return group.items.some((item) => itemHasActivePath(item, pathname));
}

function toggleGroupExpanded(expanded: string[], groupId: string): string[] {
  if (expanded.includes(groupId)) {
    return expanded.filter((id) => id !== groupId);
  }
  return [...expanded, groupId];
}

function readExpandedGroupsFromSession(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.sessionStorage.getItem(SIDEBAR_EXPANDED_GROUPS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string" && value.length > 0);
  } catch {
    return [];
  }
}

function readSidebarScrollTopFromSession(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.sessionStorage.getItem(SIDEBAR_SCROLL_TOP_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function GroupIcon({ groupIcon, className }: { groupIcon: DocsSidebarNavGroup["groupIcon"]; className?: string }) {
  switch (groupIcon) {
    case "line-chart":
      return <LineChart className={className} aria-hidden="true" />;
    case "file-spreadsheet":
      return <FileSpreadsheet className={className} aria-hidden="true" />;
    case "landmark":
      return <Landmark className={className} aria-hidden="true" />;
    case "building-2":
      return <Building2 className={className} aria-hidden="true" />;
    case "network":
      return <Network className={className} aria-hidden="true" />;
    case "activity":
      return <Activity className={className} aria-hidden="true" />;
    case "search-code":
      return <Search className={className} aria-hidden="true" />;
    case "book-open":
      return <BookOpen className={className} aria-hidden="true" />;
  }
}

function getOverviewItemIcon(href: string) {
  switch (href) {
    case "/docs/introduction":
      return Home;
    case "/docs/quick-start":
      return Rocket;
    case "/docs/authentication":
      return ShieldCheck;
    case "/docs/source-policy":
      return FileCheck;
    case "/docs/data-freshness-lineage":
      return GitBranch;
    case "/docs/api-model":
      return Braces;
    case "/docs/tools-and-mcp":
      return Wrench;
    default:
      return Home;
  }
}

function getGuideItemIcon(href: string) {
  switch (href) {
    case "/docs/workflows/company-fundamentals":
      return Building2;
    case "/docs/workflows/capital-flow":
      return Landmark;
    case "/docs/workflows/market-status":
      return Activity;
    case "/docs/workflows/fast-data-access":
      return Search;
    case "/docs/workflows/strategy-ai":
      return Bot;
    default:
      return Building2;
  }
}

function getSdkItemIcon(href: string) {
  switch (href) {
    case "/docs/sdk/python-sdk":
      return Braces;
    case "/docs/sdk/javascript-sdk":
      return Braces;
    default:
      return Braces;
  }
}

function getAiAgentItemIcon(href: string) {
  switch (href) {
    case "/docs/ai-agents/mcp-server-preview":
      return Wrench;
    case "/docs/ai-agents/tool-manifest":
      return Search;
    case "/docs/ai-agents/agent-workflow-examples":
      return Bot;
    default:
      return Bot;
  }
}

function getHelpItemIcon() {
  return LifeBuoy;
}

export function DocsPageShell({ page, children, tocSections, rightPanelTitle, rightPanelContent, pageLabel = "文件" }: DocsPageShellProps) {
  const pathname = usePathname();
  const sections: DocsSection[] = useMemo(
    () => normalizeDocsSections(tocSections ?? page.sections).map((section) => ({ id: section.id, label: section.label })),
    [tocSections, page.sections],
  );
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);

  const activeGroupIds = useMemo(
    () => docsSidebarApiGroups.filter((group) => groupHasActivePath(group, pathname)).map((group) => group.id),
    [pathname],
  );

  const userToggledGroupsRef = useRef<Set<string>>(new Set());
  const [openGroupIds, setOpenGroupIds] = useState<string[]>(() => {
    const restored = readExpandedGroupsFromSession();
    return Array.from(new Set([...(restored.length ? restored : ["quick-start"]), ...activeGroupIds]));
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(SIDEBAR_EXPANDED_GROUPS_KEY, JSON.stringify(openGroupIds));
  }, [openGroupIds]);

  useEffect(() => {
    setOpenGroupIds((current) => {
      const next = new Set(current);
      for (const groupId of activeGroupIds) {
        if (!userToggledGroupsRef.current.has(groupId)) {
          next.add(groupId);
        }
      }
      return Array.from(next);
    });
  }, [activeGroupIds]);

  useEffect(() => {
    const container = sidebarScrollRef.current;
    if (!container) return;
    container.scrollTop = readSidebarScrollTopFromSession();
  }, [pathname]);

  function isItemActive(item: DocsSidebarNavItem): boolean {
    return itemHasActivePath(item, pathname);
  }

  function renderSidebarItems(items: DocsSidebarNavItem[], depth = 0) {
    return (
      <div className={cn("space-y-1", depth > 0 && "pl-4")}>
        {items.map((item) => {
          if (item.children?.length) {
            return (
              <div key={item.href}>
                <p className="px-3 py-2 text-sm font-medium text-slate-500">{item.title}</p>
                {renderSidebarItems(item.children, depth + 1)}
              </div>
            );
          }

          const isActive = isItemActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-slate-100 font-medium text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              <span className="block truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  function renderFlatSidebarItems(items: DocsSidebarNavItem[], section: "overview" | "guides" | "sdks" | "ai-agents" | "help") {
    return (
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = isItemActive(item);
          const Icon = section === "overview"
            ? getOverviewItemIcon(item.href)
            : section === "guides"
              ? getGuideItemIcon(item.href)
                : section === "sdks"
                  ? getSdkItemIcon(item.href)
                  : section === "ai-agents"
                    ? getAiAgentItemIcon(item.href)
                    : getHelpItemIcon();
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-slate-100 font-medium text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
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
            className="docs-sidebar sticky overflow-y-auto overscroll-contain pr-1 pb-28"
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
            <nav className="mt-3">
              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">OVERVIEW</p>
              {renderFlatSidebarItems(docsSidebarOverviewItems, "overview")}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">APIS</p>
              <div className="space-y-4">
                {docsSidebarApiGroups.map((group) => (
                  <div key={group.id}>
                    <button
                      type="button"
                      aria-label={`${group.label}${openGroupIds.includes(group.id) ? "收合" : "展開"}`}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
                        activeGroupIds.includes(group.id) && "text-slate-950",
                      )}
                      onClick={() => {
                        userToggledGroupsRef.current.add(group.id);
                        setOpenGroupIds((previous) => toggleGroupExpanded(previous, group.id));
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <GroupIcon groupIcon={group.groupIcon} className="h-4 w-4 text-slate-500" />
                        <span>{group.label}</span>
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 text-slate-400 transition-transform", openGroupIds.includes(group.id) && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    {openGroupIds.includes(group.id) ? (
                      <div className="mt-1 space-y-1 pl-7">{renderSidebarItems(group.items)}</div>
                    ) : null}
                  </div>
                ))}
              </div>

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">GUIDES</p>
              {renderFlatSidebarItems(docsSidebarGuideItems, "guides")}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">SDKS</p>
              {renderFlatSidebarItems(docsSidebarSdkItems, "sdks")}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">AI AGENTS</p>
              {renderFlatSidebarItems(docsSidebarAiAgentItems, "ai-agents")}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">HELP</p>
              {renderFlatSidebarItems(docsSidebarHelpItems, "help")}
            </nav>
            <div className="h-28 shrink-0" aria-hidden="true" />
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
              <>
                {sections.length > 0 ? (
                  <nav className="mt-3">
                    <TocNav
                      sections={sections}
                      className="space-y-0.5"
                      itemClassName="block border-l px-3 py-2 text-sm transition"
                      activeClassName="border-slate-900 font-medium text-slate-950"
                      inactiveClassName="border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900"
                    />
                  </nav>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">本頁目前沒有章節目錄。</p>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
