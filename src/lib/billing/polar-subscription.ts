import "server-only";

import { getPolarClient } from "@/src/lib/billing/polar";
import {
  mapPolarOrder,
  mapPolarPaymentMethod,
  mapPolarSubscription,
  selectCurrentSubscription,
  sortInvoicesNewestFirst,
  type PolarInvoice,
  type PolarPaymentMethod,
  type PolarSubscriptionDetail,
} from "@/src/lib/billing/polar-subscription-mappers";

/**
 * Live subscription/billing read layer, sourced DIRECTLY from Polar (the SSOT).
 *
 * The website stores no subscription state of its own. For the billing UI we read
 * the authoritative values straight from Polar keyed on externalCustomerId (= the
 * NextAuth user id, matching the id passed at checkout and to the Customer Portal).
 * The read API's webhook projection remains the entitlement source (dataset access /
 * REST + MCP rate tier); this layer is display-only and never writes.
 *
 * Pure SDK->view-model mappers live in `./polar-subscription-mappers` (dependency-free,
 * unit-tested). Every fetch here fails CLOSED to an explicit error result — callers
 * render an error state rather than a fabricated number (CLAUDE.md 鐵律 #2).
 */

export type { PolarSubscriptionDetail, PolarInvoice, PolarPaymentMethod };

export type PolarReadResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type PolarBillingSnapshot = {
  subscription: PolarReadResult<PolarSubscriptionDetail | null>;
  invoices: PolarReadResult<PolarInvoice[]>;
  paymentMethod: PolarReadResult<PolarPaymentMethod | null>;
};

// ---------------------------------------------------------------------------
// Fetchers — 60s in-memory TTL cache (mirrors backend-adapter's account cache).
// Only successful results are cached, so a transient Polar failure retries next load.
// ---------------------------------------------------------------------------

const POLAR_BILLING_CACHE_TTL_MS = 60_000;

type PolarCacheEntry<T> = { value: T; expiresAt: number };
const polarBillingCache = new Map<string, PolarCacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = polarBillingCache.get(key) as PolarCacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    polarBillingCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached<T>(key: string, value: T) {
  polarBillingCache.set(key, { value, expiresAt: Date.now() + POLAR_BILLING_CACHE_TTL_MS });
}

/** Map any Polar/client failure to a stable, non-leaky reason code for the UI. */
function describePolarError(error: unknown): string {
  if (error instanceof Error && error.message.includes("POLAR_ACCESS_TOKEN")) {
    return "billing_not_configured";
  }
  return "polar_unavailable";
}

/** Read the first page of items off a Polar PageIterator. */
async function collectFirstPage(iter: AsyncIterable<{ result?: { items?: unknown[] } }>): Promise<unknown[]> {
  for await (const page of iter) {
    return Array.isArray(page?.result?.items) ? page.result.items : [];
  }
  return [];
}

export async function getPolarSubscriptionDetail(
  userId: string,
): Promise<PolarReadResult<PolarSubscriptionDetail | null>> {
  const cacheKey = `polar:sub:${userId}`;
  const cached = getCached<PolarReadResult<PolarSubscriptionDetail | null>>(cacheKey);
  if (cached) return cached;

  try {
    const polar = getPolarClient();
    const iter = await polar.subscriptions.list({ externalCustomerId: userId, limit: 20 });
    const items = await collectFirstPage(iter as unknown as AsyncIterable<{ result?: { items?: unknown[] } }>);
    const mapped = items
      .map(mapPolarSubscription)
      .filter((sub): sub is PolarSubscriptionDetail => sub !== null);
    const result: PolarReadResult<PolarSubscriptionDetail | null> = {
      ok: true,
      data: selectCurrentSubscription(mapped),
    };
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    return { ok: false, error: describePolarError(error) };
  }
}

export async function getPolarInvoices(
  userId: string,
  limit = 12,
): Promise<PolarReadResult<PolarInvoice[]>> {
  const cacheKey = `polar:invoices:${userId}`;
  const cached = getCached<PolarReadResult<PolarInvoice[]>>(cacheKey);
  if (cached) return cached;

  try {
    const polar = getPolarClient();
    const iter = await polar.orders.list({ externalCustomerId: userId, limit });
    const items = await collectFirstPage(iter as unknown as AsyncIterable<{ result?: { items?: unknown[] } }>);
    const mapped = items.map(mapPolarOrder).filter((order): order is PolarInvoice => order !== null);
    const result: PolarReadResult<PolarInvoice[]> = { ok: true, data: sortInvoicesNewestFirst(mapped) };
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    return { ok: false, error: describePolarError(error) };
  }
}

export async function getPolarPaymentMethod(
  userId: string,
): Promise<PolarReadResult<PolarPaymentMethod | null>> {
  const cacheKey = `polar:pm:${userId}`;
  const cached = getCached<PolarReadResult<PolarPaymentMethod | null>>(cacheKey);
  if (cached) return cached;

  try {
    const polar = getPolarClient();
    const iter = await polar.customers.listPaymentMethodsExternal({ externalId: userId, limit: 20 });
    const items = await collectFirstPage(iter as unknown as AsyncIterable<{ result?: { items?: unknown[] } }>);
    const cards = items
      .map(mapPolarPaymentMethod)
      .filter((card): card is PolarPaymentMethod => card !== null);
    const preferred = cards.find((card) => card.isDefault) ?? cards[0] ?? null;
    const result: PolarReadResult<PolarPaymentMethod | null> = { ok: true, data: preferred };
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    return { ok: false, error: describePolarError(error) };
  }
}

/** One-shot bundle of the three reads, run in parallel, for the billing page. */
export async function getPolarBillingSnapshot(userId: string): Promise<PolarBillingSnapshot> {
  const [subscription, invoices, paymentMethod] = await Promise.all([
    getPolarSubscriptionDetail(userId),
    getPolarInvoices(userId),
    getPolarPaymentMethod(userId),
  ]);
  return { subscription, invoices, paymentMethod };
}
