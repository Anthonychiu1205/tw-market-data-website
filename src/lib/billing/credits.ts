export type CreditTransactionStatus = "pending" | "completed" | "failed" | "cancelled" | "expired" | "simulated";
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

// ─── Real spend series (replaces the hardcoded SPEND_SERIES demo) ────────────────────────────────
//
// "Spend" = money actually paid: purchases, NET of refunds (a refund is a negative amountMinor).
//
// Currencies are NOT summed together. Legacy rows are genuinely TWD and new rows are USD; adding
// 500 TWD to 10 USD would produce a meaningless number. The chart plots USD only and the caller is
// told whether other-currency rows exist, so it can say so instead of silently dropping them.

export type SpendDay = { date: string; label: string; spend: number };
export type SpendMonth = { key: string; label: string; points: SpendDay[]; totalMinor: number };

export type CreditSpendSeries = {
  /** Months that actually have USD transactions — no fabricated month buckets. */
  months: SpendMonth[];
  currency: "USD";
  /** True when the user also has non-USD (legacy TWD) rows that the chart excludes. */
  hasExcludedCurrencies: boolean;
};

// The Taipei (UTC+8) calendar date of an instant, as YYYY-MM-DD. Used so the spend chart buckets by
// the Taiwan day rather than the UTC day.
function taipeiIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function getCreditSpendSeriesForUser(userId: string): Promise<CreditSpendSeries> {
  const prisma = await loadPrisma();

  const rows = await prisma.creditTransaction.findMany({
    where: {
      userId,
      type: { in: ["purchase", "refund"] },
      status: "completed",
      amountMinor: { not: null },
    },
    select: { amountMinor: true, currency: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const usd = rows.filter((row) => (row.currency ?? "USD").toUpperCase() === "USD");
  const hasExcludedCurrencies = rows.length > usd.length;

  const byMonth = new Map<string, SpendMonth>();
  for (const row of usd) {
    const minor = row.amountMinor ?? 0;
    // Bucket by the Taipei calendar date, NOT UTC. createdAt.toISOString() is UTC, so a purchase made
    // early on 2026-07-15 Taiwan time (UTC+8) lands on 2026-07-14 in UTC — an off-by-one that put the
    // $10 top-up on the wrong day. These are Taiwan users on Taiwan market data, so the day shown must
    // be the Taiwan day. en-CA formats as YYYY-MM-DD.
    const iso = taipeiIsoDate(row.createdAt);
    const monthKey = iso.slice(0, 7);

    let month = byMonth.get(monthKey);
    if (!month) {
      month = { key: monthKey, label: monthKey, points: [], totalMinor: 0 };
      byMonth.set(monthKey, month);
    }
    month.totalMinor += minor;

    // One point per DAY that had activity — cumulative within the month, so a refund visibly pulls
    // the line back down instead of disappearing.
    const label = `${iso.slice(5, 7)}/${iso.slice(8, 10)}`;
    const existing = month.points.find((point) => point.date === iso);
    if (existing) {
      existing.spend += minor / 100;
    } else {
      month.points.push({ date: iso, label, spend: minor / 100 });
    }
  }

  const months = [...byMonth.values()].sort((a, b) => a.key.localeCompare(b.key));
  for (const month of months) {
    month.points.sort((a, b) => a.date.localeCompare(b.date));
    // Running total across the month.
    let running = 0;
    for (const point of month.points) {
      running += point.spend;
      point.spend = Math.round(running * 100) / 100;
    }
  }

  return { months, currency: "USD", hasExcludedCurrencies };
}
