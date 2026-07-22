"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Activity,
  BadgeCheck,
  Bot,
  BookOpen,
  Braces,
  BrainCircuit,
  Calculator,
  CandlestickChart,
  ChevronDown,
  Code2,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  KeyRound,
  Landmark,
  Layers,
  LayoutGrid,
  Megaphone,
  Network,
  Plug,
  Rocket,
  ScrollText,
  Search,
  Users,
  Waypoints,
  Webhook,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, useRouter, usePathname } from "@/src/i18n/navigation";

import type { DocsSection } from "@/src/content/docs";
import { normalizeDocsSections } from "@/src/content/docs-sections";
import { getDocsDatasetSearchIndex, getDocsSidebar } from "@/src/content/docs-sidebar";
import type { DocsIconName, DocsSidebarNavGroup, DocsSidebarNavItem } from "@/src/content/docs-sidebar";
import { searchDocsDatasets } from "@/src/lib/docs/dataset-search";
import { DATASET_GRADE_COLORS, datasetGradeLabel } from "@/src/lib/docs/dataset-grade";
import type { DatasetGrade } from "@/src/lib/docs/dataset-grade";
import type { AppLocale } from "@/src/i18n/locales";
import { cn } from "@/src/lib/cn";
import { getAbsoluteUrl } from "@/src/config/site";
import { JsonLd } from "@/src/components/seo/json-ld";

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
    href: string;
    sections: DocsSection[];
  };
  children: React.ReactNode;
  tocSections?: DocsSection[];
  rightPanelTitle?: string;
  rightPanelContent?: React.ReactNode;
  pageLabel?: string;
  // §G-5 ending guide ("Ready? → Quick Start"). Optional slot rendered after the content; the
  // per-page copy is authored by Cowork. Absent = nothing rendered.
  nextGuide?: React.ReactNode;
  // §2.5 fallback: an "English coming soon" notice rendered above the content when the page body has
  // no EN translation and the viewer is on /en. Computed server-side in the [...slug] page.
  topNotice?: React.ReactNode;
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

// §F: one lucide component per DocsIconName. The names themselves are declared next to each nav entry
// in docs-sidebar.ts and are asserted unique there, so this map is a plain 1:1 projection — a
// duplicate icon is impossible to introduce from this file alone.
const NAV_ICON_COMPONENTS: Record<DocsIconName, typeof Activity> = {
  // API groups (the 8 domains)
  "candlestick-chart": CandlestickChart,
  "file-spreadsheet": FileSpreadsheet,
  landmark: Landmark,
  megaphone: Megaphone,
  network: Network,
  activity: Activity,
  layers: Layers,
  "book-open": BookOpen,
  // FOR AI AGENTS
  plug: Plug,
  "file-text": FileText,
  "scroll-text": ScrollText,
  braces: Braces,
  bot: Bot,
  webhook: Webhook,
  // OVERVIEW
  "layout-grid": LayoutGrid,
  rocket: Rocket,
  "key-round": KeyRound,
  "file-check": FileCheck,
  "badge-check": BadgeCheck,
  waypoints: Waypoints,
  globe: Globe,
  // GUIDES
  calculator: Calculator,
  users: Users,
  gauge: Gauge,
  "brain-circuit": BrainCircuit,
  // SDKS
  "git-branch": GitBranch,
  "file-code": FileCode,
  "code-2": Code2,
};

function NavIcon({ name, className }: { name: DocsIconName; className?: string }) {
  const Icon = NAV_ICON_COMPONENTS[name];
  return <Icon className={className} aria-hidden="true" />;
}

// Low-saturation grade dot (Part 1 色碼). building uses an outline ring; the rest are solid dots.
// title carries the localized grade name so it is discoverable on hover and by screen readers.
function GradeDot({ grade, locale }: { grade: DatasetGrade; locale: string }) {
  const color = DATASET_GRADE_COLORS[grade];
  const label = datasetGradeLabel(grade, locale);
  const style =
    grade === "building"
      ? { borderColor: color, borderWidth: 1.5, backgroundColor: "transparent" }
      : { backgroundColor: color };
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full border border-transparent"
      style={style}
      title={label}
      aria-label={label}
    />
  );
}

export function DocsPageShell({ page, children, tocSections, rightPanelTitle, rightPanelContent, pageLabel, nextGuide, topNotice }: DocsPageShellProps) {
  const t = useTranslations("docs");
  const locale = useLocale() as AppLocale;
  const sidebar = useMemo(() => getDocsSidebar(locale), [locale]);
  const resolvedPageLabel = pageLabel ?? t("docLabel");
  const pathname = usePathname();
  const sections: DocsSection[] = useMemo(
    () => normalizeDocsSections(tocSections ?? page.sections).map((section) => ({ id: section.id, label: section.label })),
    [tocSections, page.sections],
  );
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);

  const activeGroupIds = useMemo(
    () => sidebar.apiGroups.filter((group) => groupHasActivePath(group, pathname)).map((group) => group.id),
    [pathname, sidebar],
  );

  const userToggledGroupsRef = useRef<Set<string>>(new Set());
  const [openGroupIds, setOpenGroupIds] = useState<string[]>(() => {
    const restored = readExpandedGroupsFromSession();
    return Array.from(new Set([...(restored.length ? restored : ["quick-start"]), ...activeGroupIds]));
  });

  // Sidebar dataset search: an autocomplete over the catalog (zh name + en name + slug), matching in
  // both languages regardless of UI locale. Picking a suggestion navigates to that dataset page.
  const router = useRouter();
  const searchIndex = useMemo(() => getDocsDatasetSearchIndex(locale), [locale]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const suggestions = useMemo(() => searchDocsDatasets(searchIndex, search), [searchIndex, search]);
  const showSuggestions = searchOpen && search.trim().length > 0;

  function goToSuggestion(href: string) {
    setSearchOpen(false);
    setSearch("");
    router.push(href);
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setSearchOpen(false);
      return;
    }
    if (!showSuggestions || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = suggestions[Math.min(highlightIndex, suggestions.length - 1)];
      if (target) goToSuggestion(target.href);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(SIDEBAR_EXPANDED_GROUPS_KEY, JSON.stringify(openGroupIds));
  }, [openGroupIds]);

  // A new query always re-aims at the first suggestion.
  useEffect(() => {
    setHighlightIndex(0);
  }, [search]);

  // Clicking anywhere outside the search box dismisses the suggestion list.
  useEffect(() => {
    if (!showSuggestions) return;
    function onPointerDown(event: MouseEvent) {
      if (!searchBoxRef.current?.contains(event.target as Node)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [showSuggestions]);

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

          // Building (roadmap) datasets are shown with a badge but are NOT links (Part 1).
          if (item.building) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400"
                aria-disabled="true"
              >
                {item.grade ? <GradeDot grade={item.grade} locale={locale} /> : null}
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span
                  className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: DATASET_GRADE_COLORS.building, color: DATASET_GRADE_COLORS.building }}
                >
                  {datasetGradeLabel("building", locale)}
                </span>
              </div>
            );
          }

          const isActive = isItemActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-slate-100 font-medium text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              {item.grade ? <GradeDot grade={item.grade} locale={locale} /> : null}
              <span className="block min-w-0 flex-1 truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // One renderer for every flat nav section (OVERVIEW / FOR AI AGENTS / GUIDES / SDKS / HELP): icon +
  // title, identical spacing. Building (roadmap) entries carry a badge and are not links.
  function renderFlatSidebarItems(items: DocsSidebarNavItem[]) {
    return (
      <div className="space-y-1">
        {items.map((item) => {
          if (item.building) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400"
                aria-disabled="true"
              >
                {item.icon ? <NavIcon name={item.icon} className="h-4 w-4 shrink-0 text-slate-400" /> : null}
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span
                  className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: DATASET_GRADE_COLORS.building, color: DATASET_GRADE_COLORS.building }}
                >
                  {datasetGradeLabel("building", locale)}
                </span>
              </div>
            );
          }

          const isActive = isItemActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isActive ? "bg-slate-100 font-medium text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              {item.icon ? <NavIcon name={item.icon} className="h-4 w-4 shrink-0 text-slate-500" /> : null}
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  const sidebarTopOffset = SITE_HEADER_HEIGHT_PX + DESKTOP_SIDEBAR_TOP_GAP_PX;
  const sidebarHeight = `calc(100vh - ${sidebarTopOffset + DESKTOP_SIDEBAR_BOTTOM_GAP_PX}px)`;

  // Two column layouts measured against financialdatasets.ai (DOCS-01 §A/§B):
  //  - API endpoint pages (they pass a code panel via rightPanelContent) get a WIDE right column
  //    (420) so the request/response panel isn't cramped; the middle narrows to ~540 (max 560).
  //  - Text pages (TOC only) keep a narrow right column (220) and a wider ~680 reading column.
  const isApiPage = Boolean(rightPanelContent);
  const gridClass = isApiPage
    ? "lg:grid-cols-[256px_minmax(0,1fr)_420px] lg:gap-11"
    : "lg:grid-cols-[256px_minmax(0,1fr)_220px] lg:gap-10";
  const mainMaxWidth = isApiPage ? "max-w-[560px]" : "max-w-[680px]";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: t("docLabel"), item: getAbsoluteUrl("/docs") },
      { "@type": "ListItem", position: 3, name: page.title, item: getAbsoluteUrl(page.href) },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-[68px]">
      <JsonLd data={breadcrumbLd} />
      <div className={cn("grid gap-8", gridClass)}>
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
            <p className="text-xs font-semibold tracking-wide text-slate-500">{t("sidebarTitle")}</p>

            {/* Dataset search with an autocomplete list — picking a suggestion opens that page. */}
            <div ref={searchBoxRef} className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={onSearchKeyDown}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                role="combobox"
                aria-expanded={showSuggestions}
                aria-controls="docs-dataset-search-listbox"
                aria-autocomplete="list"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
              {showSuggestions ? (
                <div
                  id="docs-dataset-search-listbox"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                  {suggestions.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-slate-400">{t("searchNoResults")}</p>
                  ) : (
                    suggestions.map((entry, index) => (
                      <button
                        key={entry.href}
                        type="button"
                        role="option"
                        aria-selected={index === highlightIndex}
                        onMouseEnter={() => setHighlightIndex(index)}
                        onClick={() => goToSuggestion(entry.href)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
                          index === highlightIndex ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        <GradeDot grade={entry.grade} locale={locale} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{entry.title}</span>
                          <span className="block truncate text-xs text-slate-400">{entry.groupLabel}</span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            <nav className="mt-3">
              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">DASHBOARD</p>
              {renderSidebarItems(sidebar.dashboardItems)}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">FOR AI AGENTS</p>
              {renderFlatSidebarItems(sidebar.aiAgentItems)}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">OVERVIEW</p>
              {renderFlatSidebarItems(sidebar.overviewItems)}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">DATA APIS</p>
              <div className="space-y-4">
                {sidebar.apiGroups.map((group) => {
                  const expanded = openGroupIds.includes(group.id);
                  return (
                    <div key={group.id}>
                      <button
                        type="button"
                        aria-label={`${group.label}${expanded ? t("collapse") : t("expand")}`}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
                          activeGroupIds.includes(group.id) && "text-slate-950",
                        )}
                        onClick={() => {
                          userToggledGroupsRef.current.add(group.id);
                          setOpenGroupIds((previous) => toggleGroupExpanded(previous, group.id));
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <NavIcon name={group.groupIcon} className="h-4 w-4 shrink-0 text-slate-500" />
                          <span className="truncate">{group.label}</span>
                          <span className="shrink-0 rounded-full bg-slate-100 px-1.5 text-[11px] font-medium text-slate-500">{group.count}</span>
                        </div>
                        <ChevronDown
                          className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", expanded && "rotate-180")}
                          aria-hidden="true"
                        />
                      </button>
                      {expanded ? <div className="mt-1 space-y-1 pl-7">{renderSidebarItems(group.items)}</div> : null}
                    </div>
                  );
                })}
              </div>

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">GUIDES</p>
              {renderFlatSidebarItems(sidebar.guideItems)}

              <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-950">SDKS</p>
              {renderFlatSidebarItems(sidebar.sdkItems)}
            </nav>
            <div className="h-28 shrink-0" aria-hidden="true" />
          </div>
        </aside>

        {/* Content column centered at ~760px (§A) with generous line-height for scan-reading (§B).
            A <div> (not <main>): the site shell already provides the single <main> landmark; a nested
            <main> here gave docs pages two main regions (breaks the a11y tree for computer-use agents). */}
        <div className={cn("mx-auto w-full min-w-0", mainMaxWidth)}>
          {/* AI-agent hint on every docs page (BENCH-01 §2, FDS per-page practice). */}
          <p className="mb-4 text-xs text-slate-400">
            {t.rich("aiHint", {
              llms: (chunks) => (
                <Link href="/llms.txt" className="underline underline-offset-2 hover:text-slate-600">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <section className="border-b border-slate-200 pb-8">
            {/* eyebrow → H1 → tagline (§B) */}
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{resolvedPageLabel}</p>
            <h1 className="mt-2 text-[2rem] font-semibold leading-tight tracking-tight text-slate-900">{page.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{page.subtitle}</p>
          </section>
          {topNotice ? <div className="mt-6">{topNotice}</div> : null}
          <div className="text-[15px] leading-7 text-slate-700">{children}</div>
          {nextGuide ? (
            <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">{nextGuide}</div>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold tracking-wide text-slate-500">{rightPanelTitle ?? t("onThisPage")}</p>
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
                  <p className="mt-3 text-sm text-slate-500">{t("noSections")}</p>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
