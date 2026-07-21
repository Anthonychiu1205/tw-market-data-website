import type { AppLocale } from "@/src/i18n/locales";
import type { DatasetGrade } from "@/src/lib/docs/dataset-grade";
import { buildDatasetSearchHaystack, type DocsDatasetSearchEntry } from "@/src/lib/docs/dataset-search";
import {
  DOCS_DOMAINS,
  datasetsByDomain,
  domainDisplayName,
  type DocsDomainId,
} from "@/src/content/docs/dataset-catalog";

// DOCS-01 v5 sidebar. The API groups are GENERATED from the docs dataset catalog (SSOT) so the sidebar
// can never drift from the real dataset set / grades — add or re-tier a dataset in one place and the
// sidebar follows. Building (roadmap) items are declared explicitly, shown with a badge, and are not
// clickable (Part 1). Labels are bilingual and projected to one locale at render time.

// Projected shapes consumed by the docs shell (a single locale resolved at render time).
// Every nav entry (flat item or API group) declares its own icon here, next to the entry itself, and
// EVERY name below is used exactly once across the whole sidebar — no two entries share an icon.
// `docs-sidebar.test.ts` asserts that uniqueness so a future entry cannot silently reuse one.
export type DocsIconName =
  // API groups (the 8 domains)
  | "candlestick-chart"
  | "file-spreadsheet"
  | "landmark"
  | "megaphone"
  | "network"
  | "activity"
  | "layers"
  | "book-open"
  // FOR AI AGENTS
  | "plug"
  | "file-text"
  | "scroll-text"
  | "braces"
  | "bot"
  | "webhook"
  // OVERVIEW
  | "layout-grid"
  | "rocket"
  | "key-round"
  | "file-check"
  | "badge-check"
  | "waypoints"
  | "globe"
  // GUIDES
  | "calculator"
  | "users"
  | "gauge"
  | "brain-circuit"
  // SDKS
  | "git-branch"
  | "file-code"
  | "code-2"
  // HELP
  | "life-buoy";

export type DocsSidebarNavItem = {
  title: string;
  href: string;
  icon?: DocsIconName;
  grade?: DatasetGrade;
  building?: boolean; // roadmap — shown with a badge, never a live link
  children?: DocsSidebarNavItem[];
};

export type DocsSidebarNavGroup = {
  id: string;
  label: string;
  groupIcon: DocsIconName;
  count: number; // number of real datasets in the group (Part 1: 計數)
  items: DocsSidebarNavItem[];
};

export type DocsSidebarNavItemSource = {
  title: string;
  titleEn: string;
  href: string;
  icon?: DocsIconName;
  grade?: DatasetGrade;
  building?: boolean;
  children?: DocsSidebarNavItemSource[];
};

const DOMAIN_ICON: Record<DocsDomainId, DocsIconName> = {
  "market-prices": "candlestick-chart",
  financials: "file-spreadsheet",
  "capital-flows": "landmark",
  "companies-events": "megaphone",
  "structure-reference": "network",
  macro: "activity",
  derivatives: "layers",
  "funds-intel": "book-open",
};

// The 8 collapsible "資料 API" groups, generated from the catalog. Every listed item is a REAL dataset
// (no filler); the count is the real dataset count; each carries its derived grade for the badge.
export const docsSidebarApiGroups: DocsSidebarNavGroupSource[] = DOCS_DOMAINS.map((domain) => {
  const datasets = datasetsByDomain(domain.id);
  return {
    id: domain.id,
    label: domain.zh,
    labelEn: domain.en,
    groupIcon: DOMAIN_ICON[domain.id],
    items: datasets.map((d) => ({
      title: d.zh,
      titleEn: d.en,
      href: `/docs/api/${d.domain}/${d.slug}`,
      grade: d.grade,
    })),
  };
});

export type DocsSidebarNavGroupSource = {
  id: string;
  label: string;
  labelEn: string;
  groupIcon: DocsIconName;
  items: DocsSidebarNavItemSource[];
};

// ── Flat sections (Part 1 order: 儀表板/定價 → 為 AI Agent → 總覽 → 資料 API → Guides → SDK) ──

export const docsSidebarDashboardItems: DocsSidebarNavItemSource[] = [
  { title: "儀表板", titleEn: "Dashboard", href: "/dashboard" },
  { title: "定價", titleEn: "Pricing", href: "/pricing" },
];

// 為 AI Agent 打造 — same shape as every other flat nav section (icon + title, no sub-caption).
export const docsSidebarAiAgentItems: DocsSidebarNavItemSource[] = [
  { title: "MCP Server", titleEn: "MCP Server", href: "/docs/ai-agents/mcp-server", icon: "plug" },
  { title: "llms.txt", titleEn: "llms.txt", href: "/docs/ai-agents/llms-txt", icon: "file-text" },
  { title: "工具清單", titleEn: "Tool manifest", href: "/docs/ai-agents/tool-manifest", icon: "scroll-text" },
  { title: "OpenAPI Spec", titleEn: "OpenAPI Spec", href: "/docs/ai-agents/openapi-spec", icon: "braces" },
  { title: "Agent 工作流範例", titleEn: "Agent workflow examples", href: "/docs/ai-agents/agent-workflow-examples", icon: "bot" },
  { title: "Webhooks", titleEn: "Webhooks", href: "/docs/ai-agents/webhooks", icon: "webhook", building: true },
];

export const docsSidebarOverviewItems: DocsSidebarNavItemSource[] = [
  { title: "總覽", titleEn: "Overview", href: "/docs/introduction", icon: "layout-grid" },
  { title: "快速開始", titleEn: "Quick start", href: "/docs/quick-start", icon: "rocket" },
  { title: "認證", titleEn: "Authentication", href: "/docs/authentication", icon: "key-round" },
  { title: "來源政策", titleEn: "Source policy", href: "/docs/source-policy", icon: "file-check" },
  { title: "資料分級", titleEn: "Data grades", href: "/docs/data-grades", icon: "badge-check" },
  { title: "資料血緣", titleEn: "Data lineage", href: "/docs/data-freshness-lineage", icon: "waypoints" },
  { title: "市場覆蓋", titleEn: "Market coverage", href: "/docs/coverage-overview", icon: "globe" },
];

export const docsSidebarGuideItems: DocsSidebarNavItemSource[] = [
  { title: "如何取得財報三表", titleEn: "How to get the 3 financial statements", href: "/docs/guides/financial-statements", icon: "calculator" },
  { title: "如何查三大法人籌碼", titleEn: "How to read institutional flows", href: "/docs/guides/institutional-flows", icon: "users" },
  { title: "如何看市場狀態", titleEn: "How to check market status", href: "/docs/guides/market-status", icon: "gauge" },
  { title: "如何接策略・AI Agent", titleEn: "How to wire a strategy / AI agent", href: "/docs/guides/strategy-ai-agent", icon: "brain-circuit" },
];

export const docsSidebarSdkItems: DocsSidebarNavItemSource[] = [
  { title: "Release Status", titleEn: "Release status", href: "/docs/sdk/release-status", icon: "git-branch" },
  { title: "Python SDK", titleEn: "Python SDK", href: "/docs/sdk/python-sdk", icon: "file-code" },
  { title: "JavaScript / TypeScript SDK", titleEn: "JavaScript / TypeScript SDK", href: "/docs/sdk/javascript-sdk", icon: "code-2" },
];

export const docsSidebarHelpItems: DocsSidebarNavItemSource[] = [
  { title: "幫助中心", titleEn: "Help center", href: "/help-center", icon: "life-buoy" },
];

// Every icon in the nav must be unique (Part 1 §F). Rather than trust a manual audit, derive the list
// from the entries themselves and fail at module load — i.e. at build time, since the sidebar is
// static — the moment two entries reuse an icon or an entry forgets to declare one.
export function collectDocsSidebarIconNames(): { href: string; icon: DocsIconName | undefined }[] {
  return [
    ...docsSidebarApiGroups.map((group) => ({ href: `group:${group.id}`, icon: group.groupIcon })),
    ...docsSidebarAiAgentItems,
    ...docsSidebarOverviewItems,
    ...docsSidebarGuideItems,
    ...docsSidebarSdkItems,
    ...docsSidebarHelpItems,
  ].map((entry) => ({ href: entry.href, icon: entry.icon }));
}

const declaredIcons = collectDocsSidebarIconNames();
const missingIcon = declaredIcons.find((entry) => !entry.icon);
if (missingIcon) {
  throw new Error(`[docs-sidebar] nav entry has no icon: ${missingIcon.href}`);
}
const seenIcons = new Map<string, string>();
for (const entry of declaredIcons) {
  const previous = seenIcons.get(entry.icon as string);
  if (previous) {
    throw new Error(`[docs-sidebar] duplicate icon "${entry.icon}" used by ${previous} and ${entry.href}`);
  }
  seenIcons.set(entry.icon as string, entry.href);
}

function projectItem(item: DocsSidebarNavItemSource, en: boolean): DocsSidebarNavItem {
  return {
    title: en ? item.titleEn || item.title : item.title,
    href: item.href,
    ...(item.icon ? { icon: item.icon } : {}),
    ...(item.grade ? { grade: item.grade } : {}),
    ...(item.building ? { building: true } : {}),
    ...(item.children?.length ? { children: item.children.map((child) => projectItem(child, en)) } : {}),
  };
}

function projectGroup(group: DocsSidebarNavGroupSource, en: boolean): DocsSidebarNavGroup {
  const items = group.items.map((item) => projectItem(item, en));
  return {
    id: group.id,
    label: en ? group.labelEn || group.label : group.label,
    groupIcon: group.groupIcon,
    count: items.filter((i) => !i.building).length,
    items,
  };
}

export type DocsSidebar = {
  apiGroups: DocsSidebarNavGroup[];
  dashboardItems: DocsSidebarNavItem[];
  aiAgentItems: DocsSidebarNavItem[];
  overviewItems: DocsSidebarNavItem[];
  guideItems: DocsSidebarNavItem[];
  sdkItems: DocsSidebarNavItem[];
  helpItems: DocsSidebarNavItem[];
};

export function getDocsSidebar(locale: AppLocale): DocsSidebar {
  const en = locale === "en";
  return {
    apiGroups: docsSidebarApiGroups.map((group) => projectGroup(group, en)),
    dashboardItems: docsSidebarDashboardItems.map((item) => projectItem(item, en)),
    aiAgentItems: docsSidebarAiAgentItems.map((item) => projectItem(item, en)),
    overviewItems: docsSidebarOverviewItems.map((item) => projectItem(item, en)),
    guideItems: docsSidebarGuideItems.map((item) => projectItem(item, en)),
    sdkItems: docsSidebarSdkItems.map((item) => projectItem(item, en)),
    helpItems: docsSidebarHelpItems.map((item) => projectItem(item, en)),
  };
}

// Retained for the catch-all route (a group whose item has children redirects to the first leaf). The
// v5 API groups are flat (no children), so this returns null for them — kept for API compatibility.
function getFirstLeafHref(item: DocsSidebarNavItemSource): string | null {
  if (!item.children?.length) return item.href;
  for (const child of item.children) {
    const href = getFirstLeafHref(child);
    if (href) return href;
  }
  return null;
}

function findSidebarItemByHref(items: DocsSidebarNavItemSource[], href: string): DocsSidebarNavItemSource | null {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children?.length) {
      const nested = findSidebarItemByHref(item.children, href);
      if (nested) return nested;
    }
  }
  return null;
}

// All docs-internal sidebar links (href + bilingual title). Used to render a graceful bilingual
// "documentation being written" placeholder for a link the v5 IA lists but whose page is not built
// yet (Phase 1), instead of a 404.
export function getAllDocsSidebarLinks(): { href: string; title: string; titleEn: string }[] {
  const out: { href: string; title: string; titleEn: string }[] = [];
  const push = (items: DocsSidebarNavItemSource[]) => {
    for (const item of items) {
      if (item.href.startsWith("/docs") && !item.building) out.push({ href: item.href, title: item.title, titleEn: item.titleEn });
      if (item.children?.length) push(item.children);
    }
  };
  push(docsSidebarOverviewItems);
  push(docsSidebarGuideItems);
  push(docsSidebarSdkItems);
  push(docsSidebarAiAgentItems);
  for (const group of docsSidebarApiGroups) push(group.items);
  return out;
}

export function findDocsSidebarLink(href: string): { href: string; title: string; titleEn: string } | null {
  return getAllDocsSidebarLinks().find((l) => l.href === href) ?? null;
}

// ── Dataset search index (sidebar autocomplete) ──
// One entry per real dataset, built from the catalog SSOT so it can never drift from the sidebar.
// The matching itself lives in lib/docs/dataset-search.ts (pure, unit-tested).
export function getDocsDatasetSearchIndex(locale: AppLocale): DocsDatasetSearchEntry[] {
  const en = locale === "en";
  return DOCS_DOMAINS.flatMap((domain) =>
    datasetsByDomain(domain.id).map((d) => ({
      href: `/docs/api/${d.domain}/${d.slug}`,
      title: en ? d.en : d.zh,
      groupLabel: domainDisplayName(domain, locale),
      slug: d.slug,
      grade: d.grade,
      haystack: buildDatasetSearchHaystack(d.zh, d.en, d.slug),
    })),
  );
}

export function resolveDocsGroupTargetHref(href: string): string | null {
  for (const group of docsSidebarApiGroups) {
    const item = findSidebarItemByHref(group.items, href);
    if (!item || !item.children?.length) continue;
    const firstLeafHref = getFirstLeafHref(item);
    if (firstLeafHref && firstLeafHref !== item.href) return firstLeafHref;
  }
  return null;
}
