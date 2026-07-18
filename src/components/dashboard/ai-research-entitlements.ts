export type AiResearchPlan = "free" | "starter" | "pro" | "max" | "developer" | "enterprise";

// I18N-01 (PR3): display copy moved to the `aiResearch` message namespace. `displayName`, `modeLabel`
// and `access` stay as literal identifiers (plan/mode names shown identically in both locales); the
// zh-only prose fields (status / quota / helper / upgrade) became message-key references resolved at
// render via t(key). Numbers in the quota strings are mirrored exactly across en/zh (鐵律 2).
export type AiResearchEntitlement = {
  plan: AiResearchPlan;
  displayName: string;
  access: "blocked" | "preview" | "basic" | "full" | "custom";
  canRunResearch: boolean;
  modeLabel: string;
  commercialUse: boolean;
  batch: boolean;
  simulatedPortfolio: boolean;
  customWorkflow: boolean;
  quotaKey: string;
  statusKey: string;
  helperKey: string;
  upgradeKey: string | null;
};

const ENTITLEMENTS: Record<AiResearchPlan, AiResearchEntitlement> = {
  free: {
    plan: "free",
    displayName: "Free",
    access: "blocked",
    canRunResearch: false,
    modeLabel: "Unavailable",
    commercialUse: false,
    batch: false,
    simulatedPortfolio: false,
    customWorkflow: false,
    quotaKey: "entitlementQuota.free",
    statusKey: "entitlementStatus.free",
    helperKey: "entitlementHelper.free",
    upgradeKey: "entitlementUpgrade.free",
  },
  starter: {
    plan: "starter",
    displayName: "Starter",
    access: "preview",
    canRunResearch: true,
    modeLabel: "Mock Preview",
    commercialUse: true,
    batch: false,
    simulatedPortfolio: false,
    customWorkflow: false,
    quotaKey: "entitlementQuota.starter",
    statusKey: "entitlementStatus.starter",
    helperKey: "entitlementHelper.starter",
    upgradeKey: null,
  },
  pro: {
    plan: "pro",
    displayName: "Pro",
    access: "basic",
    canRunResearch: true,
    modeLabel: "Basic",
    commercialUse: true,
    batch: false,
    simulatedPortfolio: false,
    customWorkflow: false,
    quotaKey: "entitlementQuota.pro",
    statusKey: "entitlementStatus.pro",
    helperKey: "entitlementHelper.pro",
    upgradeKey: null,
  },
  max: {
    plan: "max",
    displayName: "Max",
    access: "full",
    canRunResearch: true,
    modeLabel: "Full",
    commercialUse: true,
    batch: true,
    simulatedPortfolio: true,
    customWorkflow: false,
    quotaKey: "entitlementQuota.max",
    statusKey: "entitlementStatus.max",
    helperKey: "entitlementHelper.max",
    upgradeKey: null,
  },
  developer: {
    plan: "developer",
    displayName: "Developer",
    access: "full",
    canRunResearch: true,
    modeLabel: "Full+",
    commercialUse: true,
    batch: true,
    simulatedPortfolio: true,
    customWorkflow: false,
    quotaKey: "entitlementQuota.developer",
    statusKey: "entitlementStatus.developer",
    helperKey: "entitlementHelper.developer",
    upgradeKey: null,
  },
  enterprise: {
    plan: "enterprise",
    displayName: "Enterprise",
    access: "custom",
    canRunResearch: true,
    modeLabel: "Custom",
    commercialUse: true,
    batch: true,
    simulatedPortfolio: true,
    customWorkflow: true,
    quotaKey: "entitlementQuota.enterprise",
    statusKey: "entitlementStatus.enterprise",
    helperKey: "entitlementHelper.enterprise",
    upgradeKey: null,
  },
};

export function getAiResearchEntitlement(plan: AiResearchPlan): AiResearchEntitlement {
  return ENTITLEMENTS[plan];
}

export function listAiResearchPlans(): AiResearchPlan[] {
  return ["free", "starter", "pro", "max", "developer", "enterprise"];
}
