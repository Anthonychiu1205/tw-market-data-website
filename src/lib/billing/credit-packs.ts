// SSOT for prepaid credit packs — the single place that defines what a top-up costs and how many
// credits it grants. Mirrors the subscription SSOT in plans.ts.
//
// MONEY IS AUTHORITATIVE IN POLAR. The customer is charged the price configured on the Polar
// product, never a number computed here; `priceMinor` exists so the site can DISPLAY the price and
// must be kept in sync with the Polar product. Credits granted, by contrast, ARE authoritative here:
// the webhook reads `credits` from this table (keyed by the pack code in the checkout metadata), so
// a mismatch in Polar's product description cannot mint credits.
//
// Amounts below are the work-order skeleton (計費健檢與USD定價提案 2026-07-14) and are pending owner
// sign-off. Adjust here + on the Polar product together.

export type CreditPackCode = "small" | "builder" | "pro" | "scale" | "bulk";

export type CreditPack = {
  code: CreditPackCode;
  label: string;
  /** Price in MINOR units (USD cents) — integers only, never floats, for money. */
  priceMinor: number;
  currency: "USD";
  /** Credits granted on successful payment. Authoritative. */
  credits: number;
  highlight?: "best_value";
};

export const CREDIT_PACKS: Record<CreditPackCode, CreditPack> = {
  small: { code: "small", label: "Small", priceMinor: 1_000, currency: "USD", credits: 4_000 },
  builder: { code: "builder", label: "Builder", priceMinor: 2_500, currency: "USD", credits: 11_000 },
  pro: { code: "pro", label: "Pro", priceMinor: 6_000, currency: "USD", credits: 30_000 },
  scale: {
    code: "scale",
    label: "Scale",
    priceMinor: 15_000,
    currency: "USD",
    credits: 90_000,
    highlight: "best_value",
  },
  bulk: { code: "bulk", label: "Bulk", priceMinor: 40_000, currency: "USD", credits: 280_000 },
};

export const CREDIT_PACK_ORDER: readonly CreditPackCode[] = ["small", "builder", "pro", "scale", "bulk"];

export function isCreditPackCode(value: string): value is CreditPackCode {
  return Object.prototype.hasOwnProperty.call(CREDIT_PACKS, value);
}

export function getCreditPack(code: CreditPackCode): CreditPack {
  return CREDIT_PACKS[code];
}

export function getCreditPackViews(): CreditPack[] {
  return CREDIT_PACK_ORDER.map((code) => CREDIT_PACKS[code]);
}

/** Effective unit price per credit, for the "單價/credit" column. Derived — never hand-maintained. */
export function getPricePerCredit(pack: CreditPack): number {
  return pack.priceMinor / 100 / pack.credits;
}
