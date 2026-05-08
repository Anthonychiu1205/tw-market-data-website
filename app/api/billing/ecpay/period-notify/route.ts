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
  const candidates = [payload.Amount, payload.PeriodAmount, payload.TradeAmt, payload.TotalAmount];
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

function parseProcessDate(payload: NotifyPayload) {
  const raw = payload.ProcessDate || payload.PaymentDate || payload.TradeDate;
  if (!raw) return new Date();
  const parsed = new Date(raw.replace(/\//g, "-"));
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

function addPeriodStart(startAt: Date, billingCycle: string) {
  const next = new Date(startAt);
  if (billingCycle === "yearly") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

function buildProviderPaymentId(payload: NotifyPayload, merchantTradeNo: string) {
  const marker = payload.Gwsr || payload.ProcessDate || payload.PaymentDate || payload.TradeNo || "unknown";
  const simulateMarker = payload.SimulatePaid === "1" ? "sim" : "real";
  return `period:${simulateMarker}:${merchantTradeNo}:${marker}`;
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

  const subscription = await prisma.subscription.findUnique({
    where: { merchantTradeNo },
  });

  if (!subscription) {
    return plainText("subscription not found", 404);
  }

  const notifiedAmount = parseAmount(payload);
  if (notifiedAmount === null || notifiedAmount !== subscription.amount) {
    return plainText("amount mismatch", 400);
  }

  const providerPaymentId = buildProviderPaymentId(payload, merchantTradeNo);
  const existing = await prisma.billingPayment.findUnique({ where: { providerPaymentId }, select: { id: true } });
  if (existing) {
    return plainText("1|OK");
  }

  const rtnCode = parseRtnCode(payload);
  const paidAt = parseProcessDate(payload);
  const simulated = isSimulatePaid(payload);

  try {
    await prisma.$transaction(async (tx) => {
      const duplicated = await tx.billingPayment.findUnique({
        where: { providerPaymentId },
        select: { id: true },
      });

      if (duplicated) {
        return;
      }

      if (simulated) {
        await tx.billingPayment.create({
          data: {
            subscriptionId: subscription.id,
            userId: subscription.userId,
            provider: "ecpay",
            merchantTradeNo,
            providerPaymentId,
            amount: subscription.amount,
            currency: subscription.currency,
            status: "simulated",
            ecpayTradeNo: payload.TradeNo,
            ecpayPaymentType: payload.PaymentType,
            ecpayRtnCode: rtnCode,
            ecpayRtnMsg: payload.RtnMsg,
            rawNotify: payload,
          },
        });
      } else if (rtnCode === "1") {
        const currentPeriodStart = subscription.currentPeriodEnd && subscription.currentPeriodEnd > paidAt
          ? subscription.currentPeriodEnd
          : paidAt;
        const currentPeriodEnd = addPeriodStart(currentPeriodStart, subscription.billingCycle);

        await tx.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "active",
            currentPeriodStart,
            currentPeriodEnd,
          },
        });

        await tx.billingPayment.create({
          data: {
            subscriptionId: subscription.id,
            userId: subscription.userId,
            provider: "ecpay",
            merchantTradeNo,
            providerPaymentId,
            amount: subscription.amount,
            currency: subscription.currency,
            status: "paid",
            ecpayTradeNo: payload.TradeNo,
            ecpayPaymentType: payload.PaymentType,
            ecpayRtnCode: rtnCode,
            ecpayRtnMsg: payload.RtnMsg,
            paidAt,
            rawNotify: payload,
          },
        });
      } else {
        await tx.subscription.update({
          where: { id: subscription.id },
          data: {
            status: subscription.status === "active" ? "past_due" : subscription.status,
          },
        });

        await tx.billingPayment.create({
          data: {
            subscriptionId: subscription.id,
            userId: subscription.userId,
            provider: "ecpay",
            merchantTradeNo,
            providerPaymentId,
            amount: subscription.amount,
            currency: subscription.currency,
            status: "failed",
            ecpayTradeNo: payload.TradeNo,
            ecpayPaymentType: payload.PaymentType,
            ecpayRtnCode: rtnCode,
            ecpayRtnMsg: payload.RtnMsg,
            rawNotify: payload,
          },
        });
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return plainText("1|OK");
    }

    return plainText("period notify failed", 500);
  }

  return plainText("1|OK");
}
