/**
 * Pure Polar SDK object -> view-model mappers, with ZERO runtime dependencies
 * (no `server-only`, no SDK/client imports). Kept dependency-free so they run
 * directly under `node --test` (native TS type-stripping) without a bundler.
 *
 * The server-only fetch layer in `./polar-subscription` re-exports these.
 */

export type PolarSubscriptionDetail = {
  id: string;
  /** Polar subscription status: active | trialing | past_due | canceled | ... */
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
  endsAt: Date | null;
  /** Charged amount in integer MINOR units (cents); null when Polar omits it. */
  amountMinor: number | null;
  currency: string;
  /** month | year, or null when unknown. */
  recurringInterval: string | null;
  productId: string | null;
};

export type PolarInvoice = {
  id: string;
  createdAt: Date | null;
  /** Total in integer MINOR units (cents). */
  amountMinor: number;
  currency: string;
  /** Polar order status: paid | pending | refunded | partially_refunded | void | draft */
  status: string;
  invoiceNumber: string | null;
  isInvoiceGenerated: boolean;
  description: string | null;
};

export type PolarPaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

function toStr(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function toNum(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toBool(value: unknown): boolean {
  return value === true;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export function mapPolarSubscription(raw: unknown): PolarSubscriptionDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = toStr(r.id);
  if (!id) return null;
  return {
    id,
    status: toStr(r.status) ?? "unknown",
    cancelAtPeriodEnd: toBool(r.cancelAtPeriodEnd),
    currentPeriodEnd: toDate(r.currentPeriodEnd),
    endsAt: toDate(r.endsAt),
    amountMinor: toNum(r.amount),
    currency: toStr(r.currency) ?? "USD",
    recurringInterval: toStr(r.recurringInterval),
    productId: toStr(r.productId),
  };
}

export function mapPolarOrder(raw: unknown): PolarInvoice | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = toStr(r.id);
  if (!id) return null;
  return {
    id,
    createdAt: toDate(r.createdAt),
    amountMinor: toNum(r.totalAmount) ?? 0,
    currency: toStr(r.currency) ?? "USD",
    status: toStr(r.status) ?? "unknown",
    invoiceNumber: toStr(r.invoiceNumber),
    isInvoiceGenerated: toBool(r.isInvoiceGenerated),
    description: toStr(r.description),
  };
}

export function mapPolarPaymentMethod(raw: unknown): PolarPaymentMethod | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = toStr(r.id);
  if (!id) return null;
  // Only card methods carry brand/last4 to display; skip generic (bank/wallet) methods.
  if (toStr(r.type) !== "card") return null;
  const meta = (r.methodMetadata && typeof r.methodMetadata === "object" ? r.methodMetadata : {}) as Record<
    string,
    unknown
  >;
  const brand = toStr(meta.brand);
  const last4 = toStr(meta.last4);
  if (!brand || !last4) return null;
  return {
    id,
    brand,
    last4,
    expMonth: toNum(meta.expMonth) ?? 0,
    expYear: toNum(meta.expYear) ?? 0,
    isDefault: toBool(r.isDefault),
  };
}

const SUBSCRIPTION_STATUS_RANK: Record<string, number> = {
  active: 3,
  trialing: 3,
  past_due: 2,
  unpaid: 2,
};

/**
 * Pick the subscription that currently represents the account: prefer active/trialing,
 * then past_due, then most recent by period end.
 */
export function selectCurrentSubscription(subs: PolarSubscriptionDetail[]): PolarSubscriptionDetail | null {
  if (subs.length === 0) return null;
  return [...subs].sort((a, b) => {
    const rankA = SUBSCRIPTION_STATUS_RANK[a.status.toLowerCase()] ?? 1;
    const rankB = SUBSCRIPTION_STATUS_RANK[b.status.toLowerCase()] ?? 1;
    if (rankB !== rankA) return rankB - rankA;
    return (b.currentPeriodEnd?.getTime() ?? 0) - (a.currentPeriodEnd?.getTime() ?? 0);
  })[0];
}

/** Sort invoices newest-first for display. */
export function sortInvoicesNewestFirst(invoices: PolarInvoice[]): PolarInvoice[] {
  return [...invoices].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}
