import { Prisma } from "@prisma/client";

import { prisma } from "@/src/lib/auth/prisma";
import { verifyCheckMacValue } from "@/src/lib/billing/ecpay";

export const runtime = "nodejs";

type NotifyPayload = Record<string, string>;

function plainText(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function parseNotifyPayload(formData: FormData): NotifyPayload {
  const payload: NotifyPayload = {};
  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === "string" ? value : value.name;
  }
  return payload;
}

function parseAmount(payload: NotifyPayload) {
  const candidates = [payload.TradeAmt, payload.Amount, payload.TotalAmount];
  for (const value of candidates) {
    if (!value) continue;
    const amount = Number.parseInt(value, 10);
    if (!Number.isNaN(amount) && amount > 0) {
      return amount;
    }
  }
  return null;
}

function parseRtnCode(payload: NotifyPayload) {
  return payload.RtnCode ?? payload.RTNCode ?? payload.rtnCode ?? "";
}

function isSimulatePaid(payload: NotifyPayload) {
  return payload.SimulatePaid === "1";
}

function sanitizedNotifyPayload(payload: NotifyPayload) {
  const next: NotifyPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === "CheckMacValue") continue;
    next[key] = value;
  }
  return next;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = parseNotifyPayload(formData);

  if (!verifyCheckMacValue(payload)) {
    return plainText("invalid CheckMacValue", 400);
  }

  const merchantTradeNo = payload.MerchantTradeNo;
  if (!merchantTradeNo) {
    return plainText("missing MerchantTradeNo", 400);
  }

  const transaction = await prisma.creditTransaction.findUnique({
    where: { merchantTradeNo },
    select: {
      id: true,
      userId: true,
      walletId: true,
      status: true,
      amountTwd: true,
      credits: true,
    },
  });

  if (!transaction) {
    return plainText("transaction not found", 404);
  }

  const notifiedAmount = parseAmount(payload);
  if (notifiedAmount === null || notifiedAmount !== transaction.amountTwd) {
    if (transaction.status === "pending") {
      await prisma.creditTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "failed",
          rawNotify: sanitizedNotifyPayload(payload),
        },
      });
    }

    return plainText("amount mismatch", 400);
  }

  if (transaction.status === "completed") {
    return plainText("1|OK");
  }

  const rtnCode = parseRtnCode(payload);
  const notifySnapshot = sanitizedNotifyPayload(payload);
  const simulated = isSimulatePaid(payload);

  try {
    await prisma.$transaction(async (tx) => {
      if (simulated) {
        await tx.creditTransaction.updateMany({
          where: {
            id: transaction.id,
            status: { not: "completed" },
          },
          data: {
            status: "simulated",
            providerTradeNo: payload.TradeNo ?? null,
            rawNotify: notifySnapshot,
          },
        });
        return;
      }

      if (rtnCode === "1") {
        const marked = await tx.creditTransaction.updateMany({
          where: {
            id: transaction.id,
            status: { not: "completed" },
          },
          data: {
            status: "completed",
            providerTradeNo: payload.TradeNo ?? null,
            rawNotify: notifySnapshot,
          },
        });

        if (marked.count === 0) {
          return;
        }

        const wallet = await tx.creditWallet.update({
          where: { id: transaction.walletId },
          data: {
            balance: { increment: transaction.credits },
          },
          select: { balance: true },
        });

        await tx.creditTransaction.update({
          where: { id: transaction.id },
          data: {
            balanceAfter: wallet.balance,
          },
        });
        return;
      }

      await tx.creditTransaction.updateMany({
        where: {
          id: transaction.id,
          status: { not: "completed" },
        },
        data: {
          status: "failed",
          providerTradeNo: payload.TradeNo ?? null,
          rawNotify: notifySnapshot,
        },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return plainText("1|OK");
    }
    return plainText("notify failed", 500);
  }

  return plainText("1|OK");
}
