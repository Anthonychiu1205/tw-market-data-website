import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/src/lib/auth/prisma";
import { getCreditPack, isCreditPackCode } from "@/src/lib/billing/credit-packs";

// Credits a wallet for a settled Polar order. This is the ONLY path that mints credits.
//
// Idempotency: Polar retries webhooks, and a retry must never double-credit. We rely on the DB, not
// on a prior read: CreditTransaction.merchantTradeNo is UNIQUE, and we key it on the Polar order id.
// A duplicate delivery therefore fails the INSERT with P2002 inside the transaction, which rolls the
// whole thing back — the balance increment cannot be applied twice even under concurrent retries.
// (A read-then-write "have I seen this order?" check would race; the unique index cannot.)
//
// Trust: the credit amount comes from the credit-packs SSOT keyed by the pack code, NEVER from the
// webhook payload. Even if a payload claimed credits: 999999999, we grant what the pack defines.

export type FulfilCreditPurchaseInput = {
  /** NextAuth user id — passed to Polar as externalCustomerId at checkout. */
  userId: string;
  /** Polar order id. The idempotency key. */
  orderId: string;
  /** Pack code from the checkout metadata. */
  packCode: string;
  /** Amount actually charged, in minor units, as reported by Polar. Recorded, not trusted for credits. */
  amountMinor?: number | null;
  currency?: string | null;
};

export type FulfilCreditPurchaseResult =
  | { ok: true; credited: number; balanceAfter: number; duplicate: false }
  | { ok: true; credited: 0; balanceAfter: null; duplicate: true }
  | { ok: false; error: "unknown_pack" | "unknown_user" | "failed" };

export async function fulfilCreditPurchase(
  input: FulfilCreditPurchaseInput,
): Promise<FulfilCreditPurchaseResult> {
  if (!isCreditPackCode(input.packCode)) {
    // Never guess. An unrecognised pack means our SSOT and the Polar product drifted — credit nothing
    // and let it surface, rather than inventing an amount.
    console.error("[credit-fulfilment] unknown pack code", { packCode: input.packCode, orderId: input.orderId });
    return { ok: false, error: "unknown_pack" };
  }

  const pack = getCreditPack(input.packCode);
  const idempotencyKey = `polar:order:${input.orderId}`;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: input.userId }, select: { id: true } });
      if (!user) return { kind: "unknown_user" as const };

      const wallet = await tx.creditWallet.upsert({
        where: { userId: input.userId },
        create: { userId: input.userId, balance: 0 },
        update: {},
        select: { id: true, balance: true },
      });

      const balanceAfter = wallet.balance + pack.credits;

      // The unique merchantTradeNo makes this the idempotency barrier — a replayed order id throws
      // P2002 here and the whole transaction (including the increment below) is rolled back.
      await tx.creditTransaction.create({
        data: {
          userId: input.userId,
          walletId: wallet.id,
          type: "purchase",
          status: "completed",
          credits: pack.credits,
          balanceAfter,
          provider: "polar",
          merchantTradeNo: idempotencyKey,
          providerTradeNo: input.orderId,
          packageCode: pack.code,
          amountMinor: input.amountMinor ?? pack.priceMinor,
          currency: (input.currency ?? pack.currency).toUpperCase(),
          description: `Credit pack: ${pack.label}`,
        },
      });

      await tx.creditWallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      return { kind: "credited" as const, balanceAfter };
    });

    if (result.kind === "unknown_user") {
      console.error("[credit-fulfilment] no such user", { orderId: input.orderId });
      return { ok: false, error: "unknown_user" };
    }

    return { ok: true, credited: pack.credits, balanceAfter: result.balanceAfter, duplicate: false };
  } catch (error) {
    // P2002 = the order was already fulfilled. This is the EXPECTED outcome of a webhook retry, so it
    // is a success (ack the delivery) — not an error, and emphatically not a second credit.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: true, credited: 0, balanceAfter: null, duplicate: true };
    }
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error(`[credit-fulfilment] failed to credit wallet (${errorName})`, { orderId: input.orderId });
    return { ok: false, error: "failed" };
  }
}
