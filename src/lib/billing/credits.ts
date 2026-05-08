export type CreditPackageCode = "starter" | "builder" | "pro" | "scale" | "enterprise";

export type CreditPackage = {
  packageCode: CreditPackageCode;
  label: string;
  priceTwd: number;
  credits: number;
  bonusCredits: number;
  highlight?: "best_value";
};

export const CREDIT_PACKAGES: Record<CreditPackageCode, CreditPackage> = {
  starter: {
    packageCode: "starter",
    label: "Starter",
    priceTwd: 500,
    credits: 10000,
    bonusCredits: 0,
  },
  builder: {
    packageCode: "builder",
    label: "Builder",
    priceTwd: 1000,
    credits: 25000,
    bonusCredits: 5000,
  },
  pro: {
    packageCode: "pro",
    label: "Pro",
    priceTwd: 3000,
    credits: 90000,
    bonusCredits: 30000,
  },
  scale: {
    packageCode: "scale",
    label: "Scale",
    priceTwd: 10000,
    credits: 350000,
    bonusCredits: 150000,
    highlight: "best_value",
  },
  enterprise: {
    packageCode: "enterprise",
    label: "Enterprise",
    priceTwd: 30000,
    credits: 1200000,
    bonusCredits: 600000,
  },
};

export const CREDIT_PACKAGE_ORDER: CreditPackageCode[] = [
  "starter",
  "builder",
  "pro",
  "scale",
  "enterprise",
];

export function isCreditPackageCode(value: string): value is CreditPackageCode {
  return Object.prototype.hasOwnProperty.call(CREDIT_PACKAGES, value);
}

export function getCreditPackageByCode(packageCode: CreditPackageCode) {
  return CREDIT_PACKAGES[packageCode];
}

export function getCreditPackageViews() {
  return CREDIT_PACKAGE_ORDER.map((packageCode) => CREDIT_PACKAGES[packageCode]);
}

export function formatTwd(value: number) {
  return `NT$${new Intl.NumberFormat("en-US").format(value)}`;
}

export function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
