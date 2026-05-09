export type CreditPackageCode = "starter" | "builder" | "pro" | "scale" | "enterprise";

export type CreditPackage = {
  packageCode: CreditPackageCode;
  label: string;
  priceTwd: number;
  credits: number;
  bonusCredits: number;
  highlight?: "best_value";
};

export type CreditTransactionStatus = "pending" | "completed" | "failed" | "cancelled" | "simulated";
export type CreditTransactionType = "purchase" | "usage" | "adjustment";
const CREDIT_WALLET_CACHE_TTL_MS = 8_000;

type CreditWalletCacheValue = {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
} | null;

type CreditWalletCacheEntry = {
  value: CreditWalletCacheValue;
  expiresAt: number;
};

const creditWalletCache = new Map<string, CreditWalletCacheEntry>();

function nowMs() {
  return Date.now();
}

function getCachedWallet(userId: string): CreditWalletCacheValue | undefined {
  const entry = creditWalletCache.get(userId);
  if (!entry) return undefined;
  if (entry.expiresAt <= nowMs()) {
    creditWalletCache.delete(userId);
    return undefined;
  }
  return entry.value;
}

function setCachedWallet(userId: string, value: CreditWalletCacheValue) {
  creditWalletCache.set(userId, {
    value,
    expiresAt: nowMs() + CREDIT_WALLET_CACHE_TTL_MS,
  });
}

function invalidateWalletCache(userId: string) {
  creditWalletCache.delete(userId);
}

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

export function getCreditPackage(packageCode: CreditPackageCode) {
  return CREDIT_PACKAGES[packageCode];
}

export function getCreditPackageByCode(packageCode: CreditPackageCode) {
  return getCreditPackage(packageCode);
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

async function loadPrisma() {
  if (typeof window !== "undefined") {
    throw new Error("Credit wallet helpers are server-only");
  }

  const { prisma } = await import("@/src/lib/auth/prisma");
  return prisma;
}

export async function getCreditWalletForUser(userId: string) {
  const cached = getCachedWallet(userId);
  if (cached !== undefined) {
    return cached;
  }

  const prisma = await loadPrisma();
  const wallet = await prisma.creditWallet.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  setCachedWallet(userId, wallet);
  return wallet;
}

export async function getCreditTransactionsForUser(userId: string, limit = 10) {
  const prisma = await loadPrisma();
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: Math.max(1, Math.min(limit, 50)),
    select: {
      id: true,
      type: true,
      status: true,
      amountTwd: true,
      credits: true,
      balanceAfter: true,
      provider: true,
      merchantTradeNo: true,
      providerTradeNo: true,
      packageCode: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getOrCreateCreditWallet(userId: string) {
  invalidateWalletCache(userId);
  const prisma = await loadPrisma();
  const wallet = await prisma.creditWallet.upsert({
    where: { userId },
    create: { userId, balance: 0 },
    update: {},
    select: {
      id: true,
      userId: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  setCachedWallet(userId, wallet);
  return wallet;
}
