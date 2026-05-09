import { PrismaClient } from "@prisma/client";

const WINDOW_DAYS = 30;
const USAGE_PREFIX = "usage:";

function safeInt(value) {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("[SKIPPED] DATABASE_URL is not set.");
    process.exit(0);
  }

  const prisma = new PrismaClient();
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - WINDOW_DAYS);

  try {
    const [wallets, usageEvents, usageTransactions] = await Promise.all([
      prisma.creditWallet.findMany({
        select: { userId: true, balance: true },
      }),
      prisma.apiUsageEvent.findMany({
        where: { createdAt: { gte: windowStart } },
        select: {
          userId: true,
          requestId: true,
          creditsCharged: true,
          statusCode: true,
          createdAt: true,
        },
      }),
      prisma.creditTransaction.findMany({
        where: {
          type: "usage",
          createdAt: { gte: windowStart },
        },
        select: {
          userId: true,
          merchantTradeNo: true,
          credits: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const negativeBalances = wallets.filter((w) => safeInt(w.balance) < 0);

    const txByUserRequest = new Map();
    const merchantTradeNoCount = new Map();
    for (const tx of usageTransactions) {
      const merchantTradeNo = tx.merchantTradeNo ?? "";
      if (merchantTradeNo) {
        merchantTradeNoCount.set(merchantTradeNo, (merchantTradeNoCount.get(merchantTradeNo) ?? 0) + 1);
      }

      if (!merchantTradeNo.startsWith(USAGE_PREFIX)) continue;
      const requestId = merchantTradeNo.slice(USAGE_PREFIX.length);
      const key = `${tx.userId}:${requestId}`;
      const list = txByUserRequest.get(key) ?? [];
      list.push(tx);
      txByUserRequest.set(key, list);
    }

    const duplicateRequestIdUsageTransactions = [];
    for (const [key, list] of txByUserRequest.entries()) {
      if (list.length > 1) {
        duplicateRequestIdUsageTransactions.push(key);
      }
    }

    const duplicateMerchantTradeNo = [];
    for (const [merchantTradeNo, count] of merchantTradeNoCount.entries()) {
      if (count > 1) {
        duplicateMerchantTradeNo.push(merchantTradeNo);
      }
    }

    let mismatchCount = 0;
    let orphanUsageEvents = 0;

    for (const event of usageEvents) {
      const charged = Math.max(0, safeInt(event.creditsCharged));
      const key = `${event.userId}:${event.requestId}`;
      const txList = txByUserRequest.get(key) ?? [];
      if (charged <= 0) continue;

      if (txList.length === 0) {
        orphanUsageEvents += 1;
        continue;
      }

      const txCharged = txList.reduce((sum, tx) => sum + Math.max(0, -safeInt(tx.credits)), 0);
      if (txCharged !== charged) {
        mismatchCount += 1;
      }
    }

    const userIds = new Set([
      ...wallets.map((w) => w.userId),
      ...usageEvents.map((e) => e.userId),
      ...usageTransactions.map((t) => t.userId),
    ]);

    const summary = {
      windowDays: WINDOW_DAYS,
      totalUsersChecked: userIds.size,
      negativeBalances: negativeBalances.length,
      usageEventsChecked: usageEvents.length,
      usageTransactionsChecked: usageTransactions.length,
      mismatches: mismatchCount,
      orphanUsageEvents,
      duplicateRequestIdUsageTransactions: duplicateRequestIdUsageTransactions.length,
      duplicateMerchantTradeNo: duplicateMerchantTradeNo.length,
    };

    console.log("[wallet-integrity]", JSON.stringify(summary));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[FAILED] check_wallet_integrity");
  console.error(message);
  process.exit(1);
});
