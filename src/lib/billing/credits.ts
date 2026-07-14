export type CreditTransactionStatus = "pending" | "completed" | "failed" | "cancelled" | "simulated";
export type CreditTransactionType = "purchase" | "refund" | "usage" | "adjustment";
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
      amountMinor: true,
      currency: true,
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
