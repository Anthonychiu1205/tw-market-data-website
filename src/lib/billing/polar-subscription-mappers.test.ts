import assert from "node:assert/strict";
import { test } from "node:test";

import {
  mapPolarOrder,
  mapPolarPaymentMethod,
  mapPolarSubscription,
  selectCurrentSubscription,
  sortInvoicesNewestFirst,
  type PolarSubscriptionDetail,
} from "./polar-subscription-mappers.ts";

test("mapPolarSubscription maps a full active subscription", () => {
  const periodEnd = new Date("2026-08-15T00:00:00Z");
  const mapped = mapPolarSubscription({
    id: "sub_123",
    status: "active",
    cancelAtPeriodEnd: false,
    currentPeriodEnd: periodEnd,
    endsAt: null,
    amount: 10000,
    currency: "USD",
    recurringInterval: "month",
    productId: "prod_pro",
  });
  assert.equal(mapped?.id, "sub_123");
  assert.equal(mapped?.status, "active");
  assert.equal(mapped?.cancelAtPeriodEnd, false);
  assert.equal(mapped?.currentPeriodEnd?.getTime(), periodEnd.getTime());
  assert.equal(mapped?.amountMinor, 10000);
  assert.equal(mapped?.currency, "USD");
  assert.equal(mapped?.productId, "prod_pro");
});

test("mapPolarSubscription reads cancelAtPeriodEnd strictly (only boolean true)", () => {
  assert.equal(mapPolarSubscription({ id: "s", cancelAtPeriodEnd: true })?.cancelAtPeriodEnd, true);
  // Truthy-but-not-true must NOT be read as scheduled-to-cancel.
  assert.equal(mapPolarSubscription({ id: "s", cancelAtPeriodEnd: "true" })?.cancelAtPeriodEnd, false);
  assert.equal(mapPolarSubscription({ id: "s" })?.cancelAtPeriodEnd, false);
});

test("mapPolarSubscription defaults currency/status and parses ISO date strings", () => {
  const mapped = mapPolarSubscription({ id: "s", currentPeriodEnd: "2026-08-15T00:00:00Z" });
  assert.equal(mapped?.status, "unknown");
  assert.equal(mapped?.currency, "USD");
  assert.equal(mapped?.amountMinor, null);
  assert.equal(mapped?.currentPeriodEnd?.toISOString(), "2026-08-15T00:00:00.000Z");
});

test("mapPolarSubscription returns null without a usable id", () => {
  assert.equal(mapPolarSubscription({ status: "active" }), null);
  assert.equal(mapPolarSubscription(null), null);
  assert.equal(mapPolarSubscription("nope"), null);
});

test("mapPolarOrder maps an order and defaults a missing total to 0", () => {
  const created = new Date("2026-07-15T00:00:00Z");
  const mapped = mapPolarOrder({
    id: "ord_1",
    createdAt: created,
    totalAmount: 10000,
    currency: "USD",
    status: "paid",
    invoiceNumber: "INV-001",
    isInvoiceGenerated: true,
  });
  assert.equal(mapped?.id, "ord_1");
  assert.equal(mapped?.amountMinor, 10000);
  assert.equal(mapped?.status, "paid");
  assert.equal(mapped?.invoiceNumber, "INV-001");
  assert.equal(mapped?.isInvoiceGenerated, true);

  assert.equal(mapPolarOrder({ id: "ord_2" })?.amountMinor, 0);
  assert.equal(mapPolarOrder({ totalAmount: 100 }), null);
});

test("mapPolarPaymentMethod maps a card and skips non-card / incomplete methods", () => {
  const card = mapPolarPaymentMethod({
    id: "pm_1",
    type: "card",
    isDefault: true,
    methodMetadata: { brand: "visa", last4: "4242", expMonth: 8, expYear: 2028 },
  });
  assert.equal(card?.brand, "visa");
  assert.equal(card?.last4, "4242");
  assert.equal(card?.expMonth, 8);
  assert.equal(card?.expYear, 2028);
  assert.equal(card?.isDefault, true);

  // Non-card method → skipped.
  assert.equal(mapPolarPaymentMethod({ id: "pm_2", type: "generic", isDefault: false }), null);
  // Card missing brand/last4 → skipped (nothing to display).
  assert.equal(mapPolarPaymentMethod({ id: "pm_3", type: "card", methodMetadata: { brand: "visa" } }), null);
});

function sub(partial: Partial<PolarSubscriptionDetail> & { id: string }): PolarSubscriptionDetail {
  return {
    id: partial.id,
    status: partial.status ?? "active",
    cancelAtPeriodEnd: partial.cancelAtPeriodEnd ?? false,
    currentPeriodEnd: partial.currentPeriodEnd ?? null,
    endsAt: partial.endsAt ?? null,
    amountMinor: partial.amountMinor ?? null,
    currency: partial.currency ?? "USD",
    recurringInterval: partial.recurringInterval ?? "month",
    productId: partial.productId ?? null,
  };
}

test("selectCurrentSubscription prefers active over canceled", () => {
  const chosen = selectCurrentSubscription([
    sub({ id: "old", status: "canceled", currentPeriodEnd: new Date("2027-01-01Z") }),
    sub({ id: "active", status: "active", currentPeriodEnd: new Date("2026-08-01Z") }),
  ]);
  assert.equal(chosen?.id, "active");
});

test("selectCurrentSubscription ranks past_due above canceled but below active", () => {
  const chosen = selectCurrentSubscription([
    sub({ id: "canceled", status: "canceled" }),
    sub({ id: "pastdue", status: "past_due" }),
  ]);
  assert.equal(chosen?.id, "pastdue");
});

test("selectCurrentSubscription breaks ties by furthest period end, and empty → null", () => {
  const chosen = selectCurrentSubscription([
    sub({ id: "near", status: "active", currentPeriodEnd: new Date("2026-08-01Z") }),
    sub({ id: "far", status: "active", currentPeriodEnd: new Date("2026-09-01Z") }),
  ]);
  assert.equal(chosen?.id, "far");
  assert.equal(selectCurrentSubscription([]), null);
});

test("sortInvoicesNewestFirst orders by createdAt descending", () => {
  const invoices = [
    { id: "a", createdAt: new Date("2026-06-15Z"), amountMinor: 100, currency: "USD", status: "paid", invoiceNumber: null, isInvoiceGenerated: false, description: null },
    { id: "b", createdAt: new Date("2026-07-15Z"), amountMinor: 100, currency: "USD", status: "paid", invoiceNumber: null, isInvoiceGenerated: false, description: null },
  ];
  assert.deepEqual(
    sortInvoicesNewestFirst(invoices).map((i) => i.id),
    ["b", "a"],
  );
});
