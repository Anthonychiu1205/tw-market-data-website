"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/src/auth";
import { getPolarClient } from "@/src/lib/billing/polar";
import { invalidatePolarBillingCache } from "@/src/lib/billing/polar-subscription";
import {
  mapPolarSubscription,
  selectCurrentSubscription,
  type PolarSubscriptionDetail,
} from "@/src/lib/billing/polar-subscription-mappers";

/**
 * Cancel / resume the CURRENT user's subscription against Polar (the SSOT). Both actions
 * take no client input — the subscription id is resolved server-side from the session's
 * externalCustomerId, so a user can only ever act on their own subscription (no id is
 * accepted from the client → cross-account writes are structurally impossible).
 *
 * Cancellation is period-end (cancelAtPeriodEnd), never immediate: no service cut mid-period,
 * no refund — aligned with /refund §四. Resume is the same call with the flag set false.
 */

export type SubscriptionActionResult =
  | { ok: true; cancelAtPeriodEnd: boolean }
  | { ok: false; error: "unauthenticated" | "no_subscription" | "not_confirmed" | "polar_error" };

type PolarClient = ReturnType<typeof getPolarClient>;

async function resolveOwnSubscription(
  polar: PolarClient,
  userId: string,
): Promise<PolarSubscriptionDetail | null> {
  const iter = await polar.subscriptions.list({ externalCustomerId: userId, limit: 20 });
  const items: unknown[] = [];
  for await (const page of iter as unknown as AsyncIterable<{ result?: { items?: unknown[] } }>) {
    if (Array.isArray(page?.result?.items)) items.push(...page.result.items);
    break; // first page is enough to pick the current subscription
  }
  const mapped = items
    .map(mapPolarSubscription)
    .filter((sub): sub is PolarSubscriptionDetail => sub !== null);
  return selectCurrentSubscription(mapped);
}

async function resolveClientIp(): Promise<string> {
  try {
    const forwarded = (await headers()).get("x-forwarded-for");
    return forwarded?.split(",")[0]?.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

async function setCancelAtPeriodEnd(intent: boolean): Promise<SubscriptionActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  const action = intent ? "cancel" : "resume";
  if (!userId) {
    return { ok: false, error: "unauthenticated" };
  }

  const ip = await resolveClientIp();

  try {
    const polar = getPolarClient();
    const current = await resolveOwnSubscription(polar, userId);
    if (!current) {
      console.warn(`[billing-action] ${action} rejected — no subscription for user=${userId}`);
      return { ok: false, error: "no_subscription" };
    }

    const updated = await polar.subscriptions.update({
      id: current.id,
      subscriptionUpdate: { cancelAtPeriodEnd: intent },
    });
    const confirmed = updated?.cancelAtPeriodEnd === intent;

    // Audit trail: who / when / where / what — no PII beyond the NextAuth id + client ip.
    console.info(
      `[billing-audit] action=${action} user=${userId} ip=${ip} subscription=${current.id} confirmed=${confirmed} at=${new Date().toISOString()}`,
    );

    // Fresh reads on the next render (drop ≤60s cache) and re-render the billing pages.
    invalidatePolarBillingCache(userId);
    revalidatePath("/billing/subscriptions");
    revalidatePath("/billing");

    if (!confirmed) {
      return { ok: false, error: "not_confirmed" };
    }
    return { ok: true, cancelAtPeriodEnd: updated.cancelAtPeriodEnd };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const statusCode = (error as { statusCode?: number })?.statusCode;
    console.warn(
      `[billing-action] ${action} failed user=${userId} status=${statusCode ?? "n/a"} message=${message}`,
    );
    return { ok: false, error: "polar_error" };
  }
}

export async function cancelSubscription(): Promise<SubscriptionActionResult> {
  return setCancelAtPeriodEnd(true);
}

export async function resumeSubscription(): Promise<SubscriptionActionResult> {
  return setCancelAtPeriodEnd(false);
}
