import "server-only";

import { prisma } from "@/src/lib/auth/prisma";

const USAGE_MERCHANT_TRADE_NO_PREFIX = "usage:";
const RECONCILIATION_CACHE_TTL_MS = 10_000;

type ReconciliationCacheEntry = {
  value: UsageCreditReconciliation;
  expiresAt: number;
};

const reconciliationCache = new Map<string, ReconciliationCacheEntry>();

function nowMs() {
  return Date.now();
}

function reconciliationCacheKey(userId: string, days: number) {
  return `${userId}:${days}`;
}

function requestIdFromUsageTransaction(merchantTradeNo: string | null, description: string | null) {
  if (merchantTradeNo && merchantTradeNo.startsWith(USAGE_MERCHANT_TRADE_NO_PREFIX)) {
    return merchantTradeNo.slice(USAGE_MERCHANT_TRADE_NO_PREFIX.length);
  }

  if (description) {
    const matched = description.match(/request\s+([A-Za-z0-9-]{8,})/);
    if (matched?.[1]) {
      return matched[1];
    }
  }

  return null;
}

export type UsageTransactionLink = {
  id: string;
  status: string;
  credits: number;
  createdAt: Date;
  merchantTradeNo: string | null;
  requestId: string | null;
};

export type ReconciliationRow = {
  requestId: string;
  createdAt: Date;
  datasetSlug: string;
  statusCode: number;
  usageCredits: number;
  transactionCredits: number;
  transactionStatus: string | null;
  linked: boolean;
  reconciled: boolean;
};

export type UsageCreditReconciliation = {
  windowDays: number;
  walletBalance: number;
  totalUsageEvents: number;
  totalChargedCredits: number;
  totalTransactionCredits: number;
  mismatchedRequestIds: string[];
  orphanUsageEvents: string[];
  orphanUsageTransactions: string[];
  duplicateUsageTransactions: string[];
  recentRows: ReconciliationRow[];
};

export async function getUsageTransactionByRequestId(requestId: string) {
  const trimmed = requestId.trim();
  if (!trimmed) return null;

  return prisma.creditTransaction.findUnique({
    where: { merchantTradeNo: `${USAGE_MERCHANT_TRADE_NO_PREFIX}${trimmed}` },
    select: {
      id: true,
      userId: true,
      type: true,
      status: true,
      credits: true,
      balanceAfter: true,
      description: true,
      merchantTradeNo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUsageCreditReconciliationForUser(userId: string, days = 30): Promise<UsageCreditReconciliation> {
  const windowDays = Number.isFinite(days) ? Math.max(1, Math.min(Math.trunc(days), 90)) : 30;
  const cacheKey = reconciliationCacheKey(userId, windowDays);
  const cached = reconciliationCache.get(cacheKey);
  if (cached && cached.expiresAt > nowMs()) {
    return cached.value;
  }

  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - windowDays);

  const [wallet, usageEvents, usageTransactions] = await Promise.all([
    prisma.creditWallet.findUnique({
      where: { userId },
      select: { balance: true },
    }),
    prisma.apiUsageEvent.findMany({
      where: {
        userId,
        createdAt: { gte: windowStart },
      },
      orderBy: [{ createdAt: "desc" }],
      select: {
        requestId: true,
        createdAt: true,
        datasetSlug: true,
        statusCode: true,
        creditsCharged: true,
      },
      take: 200,
    }),
    prisma.creditTransaction.findMany({
      where: {
        userId,
        type: "usage",
        createdAt: { gte: windowStart },
      },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        status: true,
        credits: true,
        createdAt: true,
        merchantTradeNo: true,
        description: true,
      },
      take: 400,
    }),
  ]);

  const txByRequestId = new Map<string, UsageTransactionLink[]>();
  for (const tx of usageTransactions) {
    const requestId = requestIdFromUsageTransaction(tx.merchantTradeNo, tx.description);
    if (!requestId) continue;
    const bucket = txByRequestId.get(requestId) ?? [];
    bucket.push({
      id: tx.id,
      status: tx.status,
      credits: tx.credits,
      createdAt: tx.createdAt,
      merchantTradeNo: tx.merchantTradeNo,
      requestId,
    });
    txByRequestId.set(requestId, bucket);
  }

  const totalChargedCredits = usageEvents.reduce((sum, item) => sum + Math.max(0, item.creditsCharged), 0);
  const totalTransactionCredits = usageTransactions.reduce((sum, item) => sum + Math.max(0, -item.credits), 0);

  const mismatchedRequestIds = new Set<string>();
  const orphanUsageEvents = new Set<string>();
  const consumedTxRequestIds = new Set<string>();
  const recentRows: ReconciliationRow[] = [];

  for (const event of usageEvents) {
    const matches = txByRequestId.get(event.requestId) ?? [];
    const primaryTx = matches[0] ?? null;
    if (matches.length > 0) {
      consumedTxRequestIds.add(event.requestId);
    }

    const eventCredits = Math.max(0, event.creditsCharged);
    const txCredits = primaryTx ? Math.max(0, -primaryTx.credits) : 0;

    const linked = Boolean(primaryTx);
    const reconciled = linked && eventCredits === txCredits;

    if (!linked && eventCredits > 0) {
      orphanUsageEvents.add(event.requestId);
    }

    if (linked && eventCredits !== txCredits) {
      mismatchedRequestIds.add(event.requestId);
    }

    recentRows.push({
      requestId: event.requestId,
      createdAt: event.createdAt,
      datasetSlug: event.datasetSlug,
      statusCode: event.statusCode,
      usageCredits: eventCredits,
      transactionCredits: txCredits,
      transactionStatus: primaryTx?.status ?? null,
      linked,
      reconciled,
    });
  }

  const orphanUsageTransactions = new Set<string>();
  const duplicateUsageTransactions = new Set<string>();
  for (const [requestId, rows] of txByRequestId.entries()) {
    if (rows.length > 1) {
      duplicateUsageTransactions.add(requestId);
    }
    if (!consumedTxRequestIds.has(requestId)) {
      orphanUsageTransactions.add(requestId);
    }
  }

  const result: UsageCreditReconciliation = {
    windowDays,
    walletBalance: wallet?.balance ?? 0,
    totalUsageEvents: usageEvents.length,
    totalChargedCredits,
    totalTransactionCredits,
    mismatchedRequestIds: Array.from(mismatchedRequestIds).sort(),
    orphanUsageEvents: Array.from(orphanUsageEvents).sort(),
    orphanUsageTransactions: Array.from(orphanUsageTransactions).sort(),
    duplicateUsageTransactions: Array.from(duplicateUsageTransactions).sort(),
    recentRows: recentRows.slice(0, 80),
  };
  reconciliationCache.set(cacheKey, {
    value: result,
    expiresAt: nowMs() + RECONCILIATION_CACHE_TTL_MS,
  });
  return result;
}
