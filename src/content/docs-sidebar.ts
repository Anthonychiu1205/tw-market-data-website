import type { AppLocale } from "@/src/i18n/locales";
import type { DatasetGrade } from "@/src/lib/docs/dataset-grade";
import {
  DOCS_DOMAINS,
  datasetsByDomain,
  type DocsDomainId,
} from "@/src/content/docs/dataset-catalog";

// DOCS-01 v5 sidebar. The API groups are GENERATED from the docs dataset catalog (SSOT) so the sidebar
// can never drift from the real dataset set / grades — add or re-tier a dataset in one place and the
// sidebar follows. Building (roadmap) items are declared explicitly, shown with a badge, and are not
// clickable (Part 1). Labels are bilingual and projected to one locale at render time.

// Projected shapes consumed by the docs shell (a single locale resolved at render time).
export type DocsSidebarNavItem = {
  title: string;
  href: string;
  grade?: DatasetGrade;
  building?: boolean; // roadmap — shown with a badge, never a live link
  children?: DocsSidebarNavItem[];
};

export type DocsSidebarGroupIcon =
  | "line-chart"
  | "file-spreadsheet"
  | "landmark"
  | "building-2"
  | "network"
  | "activity"
  | "search-code"
  | "book-open";

export type DocsSidebarNavGroup = {
  id: string;
  label: string;
  groupIcon: DocsSidebarGroupIcon;
  count: number; // number of real datasets in the group (Part 1: 計數)
  items: DocsSidebarNavItem[];
};

export type DocsSidebarNavItemSource = {
  title: string;
  titleEn: string;
  href: string;
  grade?: DatasetGrade;
  building?: boolean;
  children?: DocsSidebarNavItemSource[];
};

// A flat item with a one-line description (Part 1: 為 AI Agent 打造 — 純標題 + 一行說明).
export type DocsSidebarDescribedItemSource = DocsSidebarNavItemSource & {
  description?: string;
  descriptionEn?: string;
};
export type DocsSidebarDescribedItem = DocsSidebarNavItem & { description?: string };

const DOMAIN_ICON: Record<DocsDomainId, DocsSidebarGroupIcon> = {
  "market-prices": "line-chart",
  financials: "file-spreadsheet",
  "capital-flows": "landmark",
  "companies-events": "building-2",
  "structure-reference": "network",
  macro: "activity",
  derivatives: "search-code",
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
  groupIcon: DocsSidebarGroupIcon;
  items: DocsSidebarNavItemSource[];
};

// ── Flat sections (Part 1 order: 儀表板/定價 → 為 AI Agent → 總覽 → 資料 API → Guides → SDK) ──

export const docsSidebarDashboardItems: DocsSidebarNavItemSource[] = [
  { title: "儀表板", titleEn: "Dashboard", href: "/dashboard" },
  { title: "定價", titleEn: "Pricing", href: "/pricing" },
];

// 為 AI Agent 打造 — plain titles + a one-line description each (no icons).
export const docsSidebarAiAgentItems: DocsSidebarDescribedItemSource[] = [
  { title: "MCP Server", titleEn: "MCP Server", href: "/docs/ai-agents/mcp-server", description: "以 MCP 連接你的 agent", descriptionEn: "Connect your agent over MCP" },
  { title: "llms.txt", titleEn: "llms.txt", href: "/docs/ai-agents/llms-txt", description: "機器可讀的能力索引", descriptionEn: "Machine-readable capability index" },
  { title: "工具清單", titleEn: "Tool manifest", href: "/docs/ai-agents/tool-manifest", description: "每個 dataset 皆為一個 MCP 工具", descriptionEn: "Every dataset is exposed as an MCP tool" },
  { title: "OpenAPI Spec", titleEn: "OpenAPI Spec", href: "/docs/ai-agents/openapi-spec", description: "完整端點與 schema", descriptionEn: "Full endpoints and schemas" },
  { title: "Agent 工作流範例", titleEn: "Agent workflow examples", href: "/docs/ai-agents/agent-workflow-examples", description: "端到端 agent 範例", descriptionEn: "End-to-end agent examples" },
  { title: "Webhooks", titleEn: "Webhooks", href: "/docs/ai-agents/webhooks", building: true, description: "規劃中", descriptionEn: "Planned" },
];

export const docsSidebarOverviewItems: DocsSidebarNavItemSource[] = [
  { title: "總覽", titleEn: "Overview", href: "/docs/introduction" },
  { title: "快速開始", titleEn: "Quick start", href: "/docs/quick-start" },
  { title: "認證", titleEn: "Authentication", href: "/docs/authentication" },
  { title: "來源政策", titleEn: "Source policy", href: "/docs/source-policy" },
  { title: "資料分級", titleEn: "Data grades", href: "/docs/data-grades" },
  { title: "資料血緣", titleEn: "Data lineage", href: "/docs/data-freshness-lineage" },
  { title: "市場覆蓋", titleEn: "Market coverage", href: "/docs/coverage-overview" },
];

export const docsSidebarGuideItems: DocsSidebarNavItemSource[] = [
  { title: "如何取得財報三表", titleEn: "How to get the 3 financial statements", href: "/docs/guides/financial-statements" },
  { title: "如何查三大法人籌碼", titleEn: "How to read institutional flows", href: "/docs/guides/institutional-flows" },
  { title: "如何看市場狀態", titleEn: "How to check market status", href: "/docs/guides/market-status" },
  { title: "如何接策略・AI Agent", titleEn: "How to wire a strategy / AI agent", href: "/docs/guides/strategy-ai-agent" },
];

export const docsSidebarSdkItems: DocsSidebarNavItemSource[] = [
  { title: "Release Status", titleEn: "Release status", href: "/docs/sdk/release-status" },
  { title: "Python SDK", titleEn: "Python SDK", href: "/docs/sdk/python-sdk" },
  { title: "JavaScript / TypeScript SDK", titleEn: "JavaScript / TypeScript SDK", href: "/docs/sdk/javascript-sdk" },
];

export const docsSidebarHelpItems: DocsSidebarNavItemSource[] = [
  { title: "幫助中心", titleEn: "Help center", href: "/help-center" },
];

function projectItem(item: DocsSidebarNavItemSource, en: boolean): DocsSidebarNavItem {
  return {
    title: en ? item.titleEn || item.title : item.title,
    href: item.href,
    ...(item.grade ? { grade: item.grade } : {}),
    ...(item.building ? { building: true } : {}),
    ...(item.children?.length ? { children: item.children.map((child) => projectItem(child, en)) } : {}),
  };
}

function projectDescribedItem(item: DocsSidebarDescribedItemSource, en: boolean): DocsSidebarDescribedItem {
  const base = projectItem(item, en);
  const description = en ? item.descriptionEn || item.description : item.description;
  return { ...base, ...(description ? { description } : {}) };
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
  aiAgentItems: DocsSidebarDescribedItem[];
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
    aiAgentItems: docsSidebarAiAgentItems.map((item) => projectDescribedItem(item, en)),
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

export function resolveDocsGroupTargetHref(href: string): string | null {
  for (const group of docsSidebarApiGroups) {
    const item = findSidebarItemByHref(group.items, href);
    if (!item || !item.children?.length) continue;
    const firstLeafHref = getFirstLeafHref(item);
    if (firstLeafHref && firstLeafHref !== item.href) return firstLeafHref;
  }
  return null;
}
