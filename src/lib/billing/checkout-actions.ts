"use server";

import { auth } from "@/src/auth";
import { getCreditPack, isCreditPackCode } from "@/src/lib/billing/credit-packs";
import {
  getEmbedOrigin,
  getPolarClient,
  getPolarCreditPackProductId,
  getPolarProductId,
  isPolarPaidPlanCode,
} from "@/src/lib/billing/polar";

export type CreateCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: "invalid_plan" | "unauthenticated" | "checkout_unavailable" };

/**
 * Create a Polar Checkout Session for the given paid plan and return its hosted
 * checkout URL. The client opens the URL with PolarEmbedCheckout (inline overlay),
 * so the user never leaves the site.
 *
 * Provisioning (subscription + API key issuance) is handled by the shared Polar
 * webhook in the read API service, keyed on `externalCustomerId` (= the NextAuth
 * user id) and the product's `metadata.plan_id`. The website never records the
 * subscription itself.
 */
export async function createCheckoutSession(planCode: string): Promise<CreateCheckoutResult> {
  if (!isPolarPaidPlanCode(planCode)) {
    return { ok: false, error: "invalid_plan" };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "unauthenticated" };
  }
  const email = session?.user?.email ?? undefined;

  try {
    const polar = getPolarClient();
    const embedOrigin = getEmbedOrigin();
    const checkout = await polar.checkouts.create({
      products: [getPolarProductId(planCode)],
      successUrl: embedOrigin ? `${embedOrigin}/billing?checkout=success` : undefined,
      embedOrigin,
      externalCustomerId: userId,
      customerEmail: email,
      // user_id for the same reason as the credit-pack checkout: externalCustomerId is not
      // applied to a pre-existing Polar customer matched by email, so it can arrive null on the
      // order. The read API service owns subscription provisioning; sending user_id gives its
      // webhook a reliable fallback instead of depending on external_id being set.
      metadata: { plan_id: planCode, user_id: userId },
    });

    return { ok: true, url: checkout.url };
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[polar-checkout] failed to create checkout session (${errorName})`);
    return { ok: false, error: "checkout_unavailable" };
  }
}

/**
 * Create a Polar Checkout Session for a prepaid credit pack.
 *
 * Fulfilment is NOT done here — the wallet is credited by the Polar webhook
 * (app/api/billing/polar/webhook) once payment actually settles, so a user who abandons or
 * fails payment never receives credits. The pack code travels in checkout metadata; the
 * webhook resolves the credit amount from the credit-packs SSOT, never from anything the
 * client sent, so a tampered client cannot mint credits.
 */
export async function createCreditPackCheckout(packCode: string): Promise<CreateCheckoutResult> {
  if (!isCreditPackCode(packCode)) {
    return { ok: false, error: "invalid_plan" };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "unauthenticated" };
  }
  const email = session?.user?.email ?? undefined;
  const pack = getCreditPack(packCode);

  try {
    const polar = getPolarClient();
    const embedOrigin = getEmbedOrigin();
    const checkout = await polar.checkouts.create({
      products: [getPolarCreditPackProductId(pack.code)],
      successUrl: embedOrigin ? `${embedOrigin}/billing/credits?checkout=success` : undefined,
      embedOrigin,
      externalCustomerId: userId,
      customerEmail: email,
      // credit_pack is what the webhook keys on. credits is included for observability only —
      // the webhook re-reads it from the SSOT and ignores this value.
      //
      // user_id is REQUIRED, not redundant with externalCustomerId: when Polar matches an
      // existing customer by email, it does NOT overwrite that customer's existing
      // external_id — so a customer created before we started sending it keeps external_id
      // = null, and order.customer.external_id arrives null. Without this the webhook cannot
      // attribute a PAID order to a user.
      metadata: { credit_pack: pack.code, credits: String(pack.credits), user_id: userId },
    });

    return { ok: true, url: checkout.url };
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[polar-checkout] failed to create credit pack checkout (${errorName})`);
    return { ok: false, error: "checkout_unavailable" };
  }
}
