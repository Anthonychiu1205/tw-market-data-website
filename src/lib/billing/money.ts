// The single money formatter for the whole site (P0-B).
//
// It replaces two hardcoded, currency-blind formatters that had drifted apart:
//   plans.ts   formatPlanCurrency() → always "$"    (subscriptions, USD)
//   credits.ts formatTwd()          → always "NT$"  (credits, TWD)
// Because each baked its symbol in, the currency was decided by WHICH function you happened to call,
// not by the data. A USD amount rendered through the credits path silently became "NT$".
//
// Two invariants:
//   1. Money is always carried in MINOR units as an integer (USD cents, TWD cents). Never a float —
//      0.1 + 0.2 !== 0.3, and money must not round-trip through binary fractions.
//   2. The currency travels WITH the amount. Nothing here assumes USD; the symbol comes from Intl,
//      so a legacy TWD row still renders as NT$ (truthful) while new USD rows render as $.

export type CurrencyCode = "USD" | "TWD";

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/**
 * Format an integer minor-unit amount in its own currency.
 *   formatMoney(2_000, "USD") → "$20"
 *   formatMoney(2_050, "USD") → "$20.50"
 *   formatMoney(50_000, "TWD") → "NT$500"
 *
 * Whole amounts render without decimals (a $20 plan should read "$20", not "$20.00"), but real
 * cents are never hidden.
 */
export function formatMoney(amountMinor: number, currency: string = DEFAULT_CURRENCY): string {
  const code = (currency || DEFAULT_CURRENCY).toUpperCase();
  const major = amountMinor / 100;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(major);
  } catch {
    // Unknown/invalid ISO code — show the number with the code rather than guessing a symbol.
    return `${major.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${code}`;
  }
}

/**
 * Same, but for amounts that may be absent (e.g. a contact-only plan, or a transaction with no
 * recorded amount). Returns `fallback` instead of inventing a zero.
 */
export function formatMoneyOrFallback(
  amountMinor: number | null | undefined,
  currency: string | null | undefined,
  fallback: string,
): string {
  if (amountMinor === null || amountMinor === undefined) return fallback;
  return formatMoney(amountMinor, currency ?? DEFAULT_CURRENCY);
}

/** Convert major units to integer minor units (e.g. 20 → 2000). For config authored in dollars. */
export function toMinor(amountMajor: number): number {
  return Math.round(amountMajor * 100);
}

/** Minor units → major, for surfaces that need a bare number (e.g. schema.org Offer price). */
export function toMajor(amountMinor: number): number {
  return amountMinor / 100;
}
