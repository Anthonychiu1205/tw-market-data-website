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
    label: "帳務",
    icon: "billing",
    children: [
      {
        type: "item",
        id: "billing-subscriptions",
        label: "訂閱方案",
        icon: "subscriptions",
        href: "/billing/subscriptions",
        activeMode: "path",
      },
      {
        type: "item",
        id: "billing-credits",
        label: "Credits 點數",
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
    href: "/usage",
    section: "usage",
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
    href: "/docs",
    activeMode: "none",
  },
  {
    type: "item",
    id: "tools",
    label: "Tools & MCP",
    icon: "tools",
    href: "/docs/tools-and-mcp",
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
