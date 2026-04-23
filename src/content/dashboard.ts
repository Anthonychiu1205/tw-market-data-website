export type DashboardSection =
  | "overview"
  | "billing"
  | "usage"
  | "keys"
  | "settings"
  | "docs"
  | "support";

export type DashboardIcon =
  | "overview"
  | "billing"
  | "subscriptions"
  | "credits"
  | "usage"
  | "keys"
  | "settings"
  | "docs"
  | "tools"
  | "support"
  | "upgrade";

export type DashboardLeafNavItem = {
  type: "item";
  id: string;
  label: string;
  icon: DashboardIcon;
  href: string;
  section?: DashboardSection;
  activeMode?: "section" | "path" | "none";
};

export type DashboardGroupNavItem = {
  type: "group";
  id: string;
  label: string;
  icon: DashboardIcon;
  children: DashboardLeafNavItem[];
};

export type DashboardNavItem = DashboardLeafNavItem | DashboardGroupNavItem;

export const dashboardNav: DashboardNavItem[] = [
  {
    type: "item",
    id: "overview",
    label: "總覽",
    icon: "overview",
    href: "/dashboard?section=overview",
    section: "overview",
    activeMode: "section",
  },
  {
    type: "group",
    id: "billing",
    label: "Billing",
    icon: "billing",
    children: [
      {
        type: "item",
        id: "billing-subscriptions",
        label: "Subscriptions",
        icon: "subscriptions",
        href: "/billing/subscriptions",
        activeMode: "path",
      },
      {
        type: "item",
        id: "billing-credits",
        label: "Credits",
        icon: "credits",
        href: "/billing/credits",
        activeMode: "path",
      },
    ],
  },
  {
    type: "item",
    id: "usage",
    label: "用量",
    icon: "usage",
    href: "/dashboard?section=usage",
    section: "usage",
    activeMode: "section",
  },
  {
    type: "item",
    id: "keys",
    label: "API 金鑰",
    icon: "keys",
    href: "/dashboard?section=keys",
    section: "keys",
    activeMode: "section",
  },
  {
    type: "item",
    id: "settings",
    label: "設定",
    icon: "settings",
    href: "/dashboard?section=settings",
    section: "settings",
    activeMode: "section",
  },
  {
    type: "item",
    id: "docs",
    label: "文件",
    icon: "docs",
    href: "/dashboard?section=docs",
    section: "docs",
    activeMode: "section",
  },
  {
    type: "item",
    id: "tools",
    label: "工具",
    icon: "tools",
    href: "/datasets",
    activeMode: "none",
  },
  {
    type: "item",
    id: "support",
    label: "支援",
    icon: "support",
    href: "/dashboard?section=support",
    section: "support",
    activeMode: "section",
  },
  {
    type: "item",
    id: "upgrade",
    label: "升級方案",
    icon: "upgrade",
    href: "/billing/subscriptions",
    activeMode: "none",
  },
];

export function toDashboardSection(value?: string): DashboardSection {
  const allowed: DashboardSection[] = [
    "overview",
    "billing",
    "usage",
    "keys",
    "settings",
    "docs",
    "support",
  ];

  if (value && allowed.includes(value as DashboardSection)) {
    return value as DashboardSection;
  }

  return "overview";
}
