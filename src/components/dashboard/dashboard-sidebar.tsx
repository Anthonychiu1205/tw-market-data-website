"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ContactModal } from "@/src/components/layout/contact-modal";
import { cn } from "@/src/lib/cn";
import {
  dashboardNav,
  type DashboardGroupNavItem,
  type DashboardIcon,
  type DashboardLeafNavItem,
  type DashboardSection,
} from "@/src/content/dashboard";

type DashboardSidebarProps = {
  email: string;
  plan: string;
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
};

const SIDEBAR_NAV_GROUPS: string[][] = [
  ["overview", "ai-research", "billing"],
  ["usage", "settings"],
  ["docs", "tools"],
  ["support", "upgrade"],
];

function DashboardIconGlyph({ icon, className }: { icon: DashboardIcon; className?: string }) {
  const common = "h-4 w-4";

  switch (icon) {
    case "overview":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M3 12L12 4L21 12V20H14V14H10V20H3V12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "billing":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "subscriptions":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 9H16M8 13H16M8 17H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "credits":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 10H20" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16.5" cy="14" r="1.5" fill="currentColor" />
        </svg>
      );
    case "usage":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M4 20V10M10 20V4M16 20V13M22 20V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "keys":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M14 8.5A4.5 4.5 0 1 1 9.5 4A4.5 4.5 0 0 1 14 8.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13 11L20 18M17 15L15 17M19 17L17 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path
            d="M19.4 15A1.7 1.7 0 0 0 19.74 16.88L19.8 16.94A2.06 2.06 0 1 1 16.89 19.85L16.83 19.79A1.7 1.7 0 0 0 14.95 19.45A1.7 1.7 0 0 0 14 21V21.2A2.06 2.06 0 1 1 9.88 21.2V21.1A1.7 1.7 0 0 0 8.83 19.55A1.7 1.7 0 0 0 6.95 19.89L6.89 19.95A2.06 2.06 0 1 1 3.98 17.04L4.04 16.98A1.7 1.7 0 0 0 4.38 15.1A1.7 1.7 0 0 0 2.83 14H2.63A2.06 2.06 0 1 1 2.63 9.88H2.73A1.7 1.7 0 0 0 4.33 8.83A1.7 1.7 0 0 0 3.99 6.95L3.93 6.89A2.06 2.06 0 1 1 6.84 3.98L6.9 4.04A1.7 1.7 0 0 0 8.78 4.38H8.88A1.7 1.7 0 0 0 9.98 2.83V2.63A2.06 2.06 0 1 1 14.1 2.63V2.73A1.7 1.7 0 0 0 15.2 4.28A1.7 1.7 0 0 0 17.08 3.94L17.14 3.88A2.06 2.06 0 1 1 20.05 6.79L19.99 6.85A1.7 1.7 0 0 0 19.65 8.73V8.83A1.7 1.7 0 0 0 21.2 9.93H21.4A2.06 2.06 0 1 1 21.4 14.05H21.3A1.7 1.7 0 0 0 19.75 15.15Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12.015" cy="12.015" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "docs":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M7 4H17C18.1046 4 19 4.89543 19 6V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V6C5 4.89543 5.89543 4 7 4Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 9H16M8 13H16M8 17H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "tools":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M14 7L17 4L20 7L13 14L10 14L10 11L14 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 20L10 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M12 19C16.4183 19 20 15.866 20 12C20 8.13401 16.4183 5 12 5C7.58172 5 4 8.13401 4 12C4 13.703 4.69323 15.2639 5.84615 16.4615L5 20L9.09091 18.9091C9.97856 18.9683 10.9479 19 12 19Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "upgrade":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cn(common, className)}>
          <path d="M12 20V8M12 8L7 13M12 8L17 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    default:
      return null;
  }
}

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn("h-4 w-4 transition-transform", open && "rotate-90", className)}>
      <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function leafIsActive(item: DashboardLeafNavItem, section: DashboardSection, currentPath: string, currentHref: string) {
  if (item.activeMode === "none") return false;
  if (item.activeMode === "section") return item.section === section;
  return item.href === currentPath || item.href === currentHref;
}

export function DashboardSidebar({ email, section, plan, currentPath, currentHref }: DashboardSidebarProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const activeGroupIds = useMemo(() => {
    const ids = new Set<string>();
    for (const node of dashboardNav) {
      if (node.type !== "group") continue;
      if (node.id === "billing" && section === "billing") {
        ids.add(node.id);
      }
      const hasActiveChild = node.children.some((child) => leafIsActive(child, section, currentPath, currentHref));
      if (hasActiveChild) ids.add(node.id);
    }
    return ids;
  }, [section, currentPath, currentHref]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(activeGroupIds));
  const resolvedExpandedGroups = useMemo(() => {
    const merged = new Set(expandedGroups);
    activeGroupIds.forEach((id) => merged.add(id));
    return merged;
  }, [expandedGroups, activeGroupIds]);

  function toggleGroup(node: DashboardGroupNavItem) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }

  const navNodeMap = useMemo(() => {
    const map = new Map<string, (typeof dashboardNav)[number]>();
    for (const node of dashboardNav) {
      map.set(node.id, node);
    }
    return map;
  }, []);

  return (
    <aside className="h-full overflow-y-auto px-2 py-1">
      <p className="text-sm font-semibold text-slate-900">控制台</p>
      <p className="mt-1 text-xs text-slate-500">{plan} · {email}</p>

      <nav className="mt-5 space-y-0">
        {SIDEBAR_NAV_GROUPS.map((groupIds, groupIndex) => (
          <div
            key={`sidebar-group-${groupIndex}`}
            className={cn(
              "space-y-1",
              groupIndex > 0 && "mt-3 border-t border-slate-200 pt-3",
            )}
          >
            {groupIds.map((nodeId) => {
              const node = navNodeMap.get(nodeId);
              if (!node) return null;

              if (node.type === "group") {
                const isOpen = resolvedExpandedGroups.has(node.id);
                const hasActiveChild = node.children.some((child) => leafIsActive(child, section, currentPath, currentHref));

                return (
                  <div key={node.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(node)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
                        hasActiveChild && "bg-slate-100 text-slate-900",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <DashboardIconGlyph
                          icon={node.icon}
                          className={cn(
                            "transition",
                            hasActiveChild ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700",
                          )}
                        />
                        <span className="font-medium text-slate-700">{node.label}</span>
                      </span>
                      <ChevronIcon open={isOpen} className="text-slate-500" />
                    </button>

                    {isOpen && (
                      <div className="ml-3 space-y-1 border-l border-slate-200 pl-2">
                        {node.children.map((child) => {
                          const active = leafIsActive(child, section, currentPath, currentHref);
                          return (
                            <Link
                              key={child.id}
                              href={child.href}
                              className={cn(
                                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                                active
                                  ? "bg-slate-200/70 font-medium text-slate-900"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                              )}
                            >
                              <DashboardIconGlyph
                                icon={child.icon}
                                className={cn(
                                  "transition",
                                  active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700",
                                )}
                              />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = leafIsActive(node, section, currentPath, currentHref);
              const openInNewTab = node.id === "docs" || node.id === "tools";

              if (node.id === "support") {
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                      active
                        ? "bg-slate-200/70 font-medium text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <DashboardIconGlyph
                      icon={node.icon}
                      className={cn(
                        "transition",
                        active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700",
                      )}
                    />
                    <span>{node.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={node.id}
                  href={node.href}
                  target={openInNewTab ? "_blank" : undefined}
                  rel={openInNewTab ? "noreferrer" : undefined}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-slate-200/70 font-medium text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <DashboardIconGlyph
                    icon={node.icon}
                    className={cn(
                      "transition",
                      active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700",
                    )}
                  />
                  <span>{node.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </aside>
  );
}
