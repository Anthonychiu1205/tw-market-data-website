import { Webhooks } from "@polar-sh/nextjs";

import { fulfilCreditPurchase, revokeCreditPurchase } from "@/src/lib/billing/credit-fulfilment";

export const runtime = "nodejs";

// Polar webhook for CREDIT PACK fulfilment.
//
// Scope: this endpoint exists because the credit wallet lives in the website's database. Subscription
// provisioning is NOT handled here — it is owned by the shared Polar webhook in the read API service
// (keyed on externalCustomerId + product metadata.plan_id). We deliberately ignore subscription
// events so the two webhooks cannot fight over the same state.
//
// Signature verification is done by Webhooks() using POLAR_WEBHOOK_SECRET; an unsigned or forged
// delivery never reaches our handler. Without that secret configured, no credits can be minted.
//
// We only act on order.paid — i.e. money has actually settled. Credits are never granted at checkout
// creation, so an abandoned or failed payment grants nothing.

function readMetadata(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const data = (payload as { data?: unknown }).data;
  if (!data || typeof data !== "object") return {};
  const meta = (data as { metadata?: unknown }).metadata;
  return meta && typeof meta === "object" ? (meta as Record<string, unknown>) : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? "",

  onOrderPaid: async (payload) => {
    const order = payload.data as unknown as {
      id?: string;
      metadata?: Record<string, unknown>;
      customer?: { externalId?: string | null; email?: string | null } | null;
      totalAmount?: number | null;
      currency?: string | null;
    };

    const metadata = { ...readMetadata(payload), ...(order.metadata ?? {}) };
    const packCode = readString(metadata.credit_pack);

    // Not a credit-pack order (e.g. a subscription) — the read API service owns those. Ignore it
    // rather than guessing, and ack so Polar stops retrying.
    if (!packCode) return;

    // Resolving the buyer, most reliable first:
    //   1. customer.external_id — the NextAuth user id we pass as externalCustomerId. NOT reliable
    //      on its own: Polar does not overwrite the external_id of an existing customer matched by
    //      email, so customers created before we started sending it arrive with external_id = null.
    //   2. metadata.user_id — we now stamp this at checkout, so it is set for every new order.
    //   3. customer email — the recovery path. Orders paid BEFORE (2) shipped have neither of the
    //      above, and would otherwise 500 forever while the customer is out of pocket. User.email is
    //      unique, and the payload is signature-verified, so this is a deterministic, safe match.
    const orderId = readString(order.id);
    const userId = readString(order.customer?.externalId) ?? readString(metadata.user_id);
    const customerEmail = readString(order.customer?.email);

    if (!orderId || (!userId && !customerEmail)) {
      console.error("[polar-webhook] credit pack order cannot be attributed", {
        hasOrder: Boolean(orderId),
        hasUser: Boolean(userId),
        hasEmail: Boolean(customerEmail),
      });
      // Throw so Polar retries. Silently dropping a PAID order would lose a customer's money.
      throw new Error("credit_pack_order_missing_identifiers");
    }

    const result = await fulfilCreditPurchase({
      userId,
      customerEmail,
      orderId,
      packCode,
      amountMinor: typeof order.totalAmount === "number" ? order.totalAmount : null,
      currency: order.currency ?? null,
    });

    if (!result.ok) {
      // Throw so Polar retries — the customer has paid, so failing quietly would owe them credits.
      throw new Error(`credit_fulfilment_failed:${result.error}`);
    }

    if (result.duplicate) {
      console.info("[polar-webhook] duplicate delivery ignored", { orderId });
      return;
    }

    console.info("[polar-webhook] credited wallet", {
      orderId,
      packCode,
      credits: result.credited,
    });
  },

  // A refund without a clawback is a revenue hole — the customer gets their money back AND keeps the
  // credits. Reverse the grant.
  //
  // We do NOT need to re-identify the buyer here: the original purchase row is looked up by the Polar
  // order id, and it already carries the userId/walletId we resolved at grant time. That is strictly
  // safer than re-deriving identity from a refund payload.
  onOrderRefunded: async (payload) => {
    const order = payload.data as unknown as {
      id?: string;
      metadata?: Record<string, unknown>;
      totalAmount?: number | null;
      refundedAmount?: number | null;
      currency?: string | null;
    };

    const metadata = { ...readMetadata(payload), ...(order.metadata ?? {}) };
    const packCode = readString(metadata.credit_pack);
    const orderId = readString(order.id);

    // Not a credit-pack order (e.g. a refunded subscription) — not ours to reverse.
    if (!packCode || !orderId) return;

    const result = await revokeCreditPurchase({
      orderId,
      refundId: readString(metadata.refund_id),
      refundedAmountMinor: typeof order.refundedAmount === "number" ? order.refundedAmount : null,
      orderTotalMinor: typeof order.totalAmount === "number" ? order.totalAmount : null,
      currency: order.currency ?? null,
    });

    if (!result.ok) {
      // Throw so Polar retries and the failure stays visible. A refund we cannot process must never
      // be silently dropped — that is exactly the revenue hole this handler exists to close.
      throw new Error(`credit_refund_failed:${result.error}`);
    }

    if (result.duplicate) {
      console.info("[polar-webhook] duplicate refund delivery ignored", { orderId });
      return;
    }

    if ("notFulfilled" in result && result.notFulfilled) {
      console.info("[polar-webhook] refund for an order that granted no credits — nothing to revoke", {
        orderId,
      });
      return;
    }

    console.info("[polar-webhook] revoked credits after refund", {
      orderId,
      credits: result.revoked,
      balanceAfter: result.balanceAfter,
    });
  },
});
