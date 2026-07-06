export type AiResearchPlan = "free" | "starter" | "pro" | "max" | "developer" | "enterprise";

export type AiResearchEntitlement = {
  plan: AiResearchPlan;
  displayName: string;
  access: "blocked" | "preview" | "basic" | "full" | "custom";
  canRunResearch: boolean;
  modeLabel: string;
  quotaLabel: string;
  commercialUse: boolean;
  batch: boolean;
  simulatedPortfolio: boolean;
  customWorkflow: boolean;
  statusLabel: string;
  helperCopy: string;
  upgradeCopy: string | null;
};

const ENTITLEMENTS: Record<AiResearchPlan, AiResearchEntitlement> = {
  free: {
    plan: "free",
    displayName: "Free",
    access: "blocked",
    canRunResearch: false,
    modeLabel: "Unavailable",
    quotaLabel: "0 次 / 月",
    commercialUse: false,
    batch: false,
    simulatedPortfolio: false,
    customWorkflow: false,
    statusLabel: "未開放",
    helperCopy: "此方案不開放 AI Research。",
    upgradeCopy: "AI Research 為付費功能。請升級至 Starter 以上方案使用。",
  },
  starter: {
    plan: "starter",
    displayName: "Starter",
    access: "preview",
    canRunResearch: true,
    modeLabel: "Mock Preview",
    quotaLabel: "5 次預覽 / 月",
    commercialUse: true,
    batch: false,
    simulatedPortfolio: false,
    customWorkflow: false,
    statusLabel: "預覽",
    helperCopy: "Mock preview only，適合開發驗證流程。",
    upgradeCopy: null,
  },
  pro: {
    plan: "pro",
    displayName: "Pro",
    access: "basic",
    canRunResearch: true,
    modeLabel: "Basic",
    quotaLabel: "100 次研究 / 月",
    commercialUse: true,
    batch: false,
    simulatedPortfolio: false,
    customWorkflow: false,
    statusLabel: "已啟用",
    helperCopy: "提供單一 ticker 基本研究流程與 decision log。",
    upgradeCopy: null,
  },
  max: {
    plan: "max",
    displayName: "Max",
    access: "full",
    canRunResearch: true,
    modeLabel: "Full",
    quotaLabel: "1000 次研究 / 月",
    commercialUse: true,
    batch: true,
    simulatedPortfolio: true,
    customWorkflow: false,
    statusLabel: "完整",
    helperCopy: "可用 batch 研究與 simulated portfolio（本輪僅顯示 UI，不做功能實作）。",
    upgradeCopy: null,
  },
  developer: {
    plan: "developer",
    displayName: "Developer",
    access: "full",
    canRunResearch: true,
    modeLabel: "Full+",
    quotaLabel: "高頻研究額度",
    commercialUse: true,
    batch: true,
    simulatedPortfolio: true,
    customWorkflow: false,
    statusLabel: "完整",
    helperCopy: "最高自助研究額度，含 batch 與 simulated portfolio（本輪僅顯示 UI）。",
    upgradeCopy: null,
  },
  enterprise: {
    plan: "enterprise",
    displayName: "Enterprise",
    access: "custom",
    canRunResearch: true,
    modeLabel: "Custom",
    quotaLabel: "Custom",
    commercialUse: true,
    batch: true,
    simulatedPortfolio: true,
    customWorkflow: true,
    statusLabel: "客製",
    helperCopy: "可規劃 custom workflow 與客製配額（本輪僅顯示 UI，不做功能實作）。",
    upgradeCopy: null,
  },
};

export function getAiResearchEntitlement(plan: AiResearchPlan): AiResearchEntitlement {
  return ENTITLEMENTS[plan];
}

export function listAiResearchPlans(): AiResearchPlan[] {
  return ["free", "starter", "pro", "max", "developer", "enterprise"];
}
