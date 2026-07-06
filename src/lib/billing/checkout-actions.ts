"use server";

import { auth } from "@/src/auth";
import {
  getEmbedOrigin,
  getPolarClient,
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
      metadata: { plan_id: planCode },
    });

    return { ok: true, url: checkout.url };
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[polar-checkout] failed to create checkout session (${errorName})`);
    return { ok: false, error: "checkout_unavailable" };
  }
}
