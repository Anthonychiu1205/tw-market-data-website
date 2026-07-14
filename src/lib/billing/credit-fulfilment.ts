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
  /**
   * NextAuth user id, from customer.external_id or checkout metadata.user_id. May be absent for
   * orders paid before we stamped user_id into checkout metadata — hence customerEmail.
   */
  userId?: string | null;
  /**
   * Fallback identity: the email the customer paid with. User.email is unique, so this resolves
   * deterministically. Used only when userId is absent, which recovers already-paid orders whose
   * Polar customer has external_id = null.
   */
  customerEmail?: string | null;
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
      // Resolve inside the transaction so the wallet cannot be created for a user that vanishes.
      const user = input.userId
        ? await tx.user.findUnique({ where: { id: input.userId }, select: { id: true } })
        : input.customerEmail
          ? await tx.user.findUnique({ where: { email: input.customerEmail }, select: { id: true } })
          : null;
      if (!user) return { kind: "unknown_user" as const };

      const userId = user.id;

      const wallet = await tx.creditWallet.upsert({
        where: { userId },
        create: { userId, balance: 0 },
        update: {},
        select: { id: true, balance: true },
      });

      const balanceAfter = wallet.balance + pack.credits;

      // The unique merchantTradeNo makes this the idempotency barrier — a replayed order id throws
      // P2002 here and the whole transaction (including the increment below) is rolled back.
      await tx.creditTransaction.create({
        data: {
          userId,
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
      console.error("[credit-fulfilment] could not resolve buyer", {
        orderId: input.orderId,
        byUserId: Boolean(input.userId),
        byEmail: Boolean(input.customerEmail),
      });
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

// ─── Refunds ──────────────────────────────────────────────────────────────────────────────────────
//
// A refund without a clawback is a revenue hole: the customer gets their money back AND keeps the
// credits. This reverses the grant.
//
// Idempotency: same mechanism as the purchase — a UNIQUE merchantTradeNo on the refund row. A
// replayed delivery fails the INSERT with P2002 inside the transaction, so the balance decrement
// rolls back with it and cannot apply twice.
//
// The balance is allowed to go NEGATIVE, deliberately. If a customer bought 4,000 credits, spent
// 1,000, then refunded, clamping the balance at 0 would let them keep 1,000 credits' worth of data
// they already consumed AND have their money back. Going to -1,000 means they must top that back up
// before calling the API again. credits-deduction gates on `balance >= cost`, so a negative balance
// simply blocks usage — it does not corrupt anything.

export type RevokeCreditPurchaseInput = {
  /** Polar order id of the ORIGINAL purchase. Used to find what was granted. */
  orderId: string;
  /** Polar refund id, when the payload carries one. Required for partial refunds (dedupe key). */
  refundId?: string | null;
  /** Amount refunded, minor units. */
  refundedAmountMinor?: number | null;
  /** Original order total, minor units. Used to detect a partial refund. */
  orderTotalMinor?: number | null;
  currency?: string | null;
};

export type RevokeCreditPurchaseResult =
  | { ok: true; revoked: number; balanceAfter: number; duplicate: false }
  | { ok: true; revoked: 0; balanceAfter: null; duplicate: true }
  | { ok: true; revoked: 0; balanceAfter: null; duplicate: false; notFulfilled: true }
  | { ok: false; error: "partial_refund_unsupported" | "failed" };

export async function revokeCreditPurchase(
  input: RevokeCreditPurchaseInput,
): Promise<RevokeCreditPurchaseResult> {
  const purchaseKey = `polar:order:${input.orderId}`;

  try {
    // What did this order actually grant? Read it from OUR ledger, never from the refund payload.
    const purchase = await prisma.creditTransaction.findUnique({
      where: { merchantTradeNo: purchaseKey },
      select: { id: true, userId: true, walletId: true, credits: true, packageCode: true },
    });

    // No purchase row → this order never granted credits here (e.g. a subscription order, or it was
    // refunded before we ever fulfilled it). Nothing to claw back. Ack rather than retry forever.
    if (!purchase) {
      return { ok: true, revoked: 0, balanceAfter: null, duplicate: false, notFulfilled: true };
    }

    // Decide how much to take back.
    const total = input.orderTotalMinor ?? null;
    const refunded = input.refundedAmountMinor ?? null;
    const isPartial = total !== null && refunded !== null && refunded > 0 && refunded < total;

    let creditsToRevoke = purchase.credits;
    if (isPartial) {
      // Partial refunds must be deduped on the REFUND id (an order can be refunded more than once).
      // Without one we cannot dedupe safely, and silently doing nothing would leak credits — so we
      // refuse loudly instead of guessing.
      if (!input.refundId) {
        console.error("[credit-refund] partial refund with no refund id — refusing to guess", {
          orderId: input.orderId,
          refunded,
          total,
        });
        return { ok: false, error: "partial_refund_unsupported" };
      }
      // Pro-rata, rounded so we never revoke more than was granted.
      creditsToRevoke = Math.min(purchase.credits, Math.floor((purchase.credits * refunded) / total));
    }

    if (creditsToRevoke <= 0) {
      return { ok: true, revoked: 0, balanceAfter: null, duplicate: false, notFulfilled: true };
    }

    // Dedupe key: the refund id when we have one (supports several partial refunds per order),
    // otherwise the order id (a full refund happens once).
    const refundKey = input.refundId
      ? `polar:refund:${input.refundId}`
      : `polar:refund:${input.orderId}`;

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.creditWallet.findUnique({
        where: { id: purchase.walletId },
        select: { id: true, balance: true },
      });
      if (!wallet) return { kind: "failed" as const };

      const balanceAfter = wallet.balance - creditsToRevoke;

      // UNIQUE merchantTradeNo — the idempotency barrier (P2002 on replay rolls the whole tx back).
      await tx.creditTransaction.create({
        data: {
          userId: purchase.userId,
          walletId: wallet.id,
          type: "refund",
          status: "completed",
          // Negative: the ledger must show credits leaving the wallet.
          credits: -creditsToRevoke,
          balanceAfter,
          provider: "polar",
          merchantTradeNo: refundKey,
          providerTradeNo: input.refundId ?? input.orderId,
          packageCode: purchase.packageCode,
          amountMinor: refunded !== null ? -Math.abs(refunded) : null,
          currency: (input.currency ?? "USD").toUpperCase(),
          description: isPartial ? "Refund (partial)" : "Refund",
        },
      });

      await tx.creditWallet.update({ where: { id: wallet.id }, data: { balance: balanceAfter } });

      return { kind: "revoked" as const, balanceAfter };
    });

    if (result.kind === "failed") {
      console.error("[credit-refund] wallet missing for purchase", { orderId: input.orderId });
      return { ok: false, error: "failed" };
    }

    return { ok: true, revoked: creditsToRevoke, balanceAfter: result.balanceAfter, duplicate: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      // Already refunded — the expected outcome of a webhook retry. Success, and NOT a second debit.
      return { ok: true, revoked: 0, balanceAfter: null, duplicate: true };
    }
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error(`[credit-refund] failed to revoke credits (${errorName})`, { orderId: input.orderId });
    return { ok: false, error: "failed" };
  }
}
