import test from "node:test";
import assert from "node:assert/strict";

import {
  settleBillableRequest,
  previewIncludedQuota,
  monthStartUtc,
  billingWindowStart,
  FREE_DATASET_SLUGS,
} from "../src/lib/billing/included-quota.ts";

// A fake dependency set so the settlement logic is exercised with no DB. Records whether deduct ran and
// which window start the count was asked for (to prove period-anchor vs UTC-month fallback).
function fakeDeps({ used = 0, priorCharge = null, priorUsage = null, deduct, now } = {}) {
  const calls = { deduct: 0, count: 0, since: null };
  return {
    calls,
    deps: {
      async countBillableSince(_userId, since) {
        calls.count += 1;
        calls.since = since;
        return used;
      },
      async deduct(input) {
        calls.deduct += 1;
        calls.deductInput = input;
        return deduct
          ? deduct(input)
          : { ok: true, alreadyProcessed: false, chargedCredits: input.credits, balanceAfter: 1000 - input.credits };
      },
      async findPriorCharge() {
        return priorCharge;
      },
      async findPriorUsage() {
        return priorUsage;
      },
      now: () => (now ? new Date(now) : new Date("2026-07-16T04:00:00.000Z")),
    },
  };
}

const base = {
  userId: "u1",
  planCode: "developer", // quota 3,000,000
  datasetSlug: "financials",
  requestId: "req-1",
  credits: 4,
  statusCode: 200,
};

test("§驗收1 — included not exhausted: quota moves, credits untouched", async () => {
  const { deps, calls } = fakeDeps({ used: 10 });
  const r = await settleBillableRequest(base, deps);
  assert.equal(r.outcome, "included");
  assert.equal(r.chargedCredits, 0);
  assert.equal(r.includedRemaining, 3_000_000 - 10 - 1);
  assert.equal(calls.deduct, 0, "wallet must NOT be touched while included quota remains");
});

test("§驗收2 — included exhausted: overage charges the dataset credit cost", async () => {
  const { deps, calls } = fakeDeps({ used: 3_000_000 });
  const r = await settleBillableRequest(base, deps);
  assert.equal(r.outcome, "charged");
  assert.equal(r.chargedCredits, 4, "charges DATASET_CREDIT_COSTS[financials] = 4");
  assert.equal(calls.deduct, 1);
  assert.equal(calls.deductInput.credits, 4);
});

test("§驗收3 — included exhausted AND wallet empty: 402 (insufficient)", async () => {
  const { deps } = fakeDeps({ used: 3_000_000, deduct: () => ({ ok: false, code: "insufficient_credits" }) });
  const r = await settleBillableRequest(base, deps);
  assert.equal(r.outcome, "insufficient");
  assert.equal(r.chargedCredits, 0);
});

test("free-plan boundary: used=499 included (remaining 0), used=500 overage", async () => {
  const free = { ...base, planCode: "free" }; // quota 500
  const a = await settleBillableRequest(free, fakeDeps({ used: 499 }).deps);
  assert.equal(a.outcome, "included");
  assert.equal(a.includedRemaining, 0);

  const b = await settleBillableRequest(free, fakeDeps({ used: 500 }).deps);
  assert.equal(b.outcome, "charged");
});

test("enterprise (quota null) is always included, never charges", async () => {
  const { deps, calls } = fakeDeps({ used: 9_999_999 });
  const r = await settleBillableRequest({ ...base, planCode: "enterprise" }, deps);
  assert.equal(r.outcome, "included");
  assert.equal(r.includedRemaining, null);
  assert.equal(calls.deduct, 0);
  assert.equal(calls.count, 0, "unlimited plan does not even count usage");
});

test("non-billable: free dataset (cost 0) and non-2xx never consume quota or charge", async () => {
  const zero = await settleBillableRequest({ ...base, credits: 0 }, fakeDeps().deps);
  assert.equal(zero.outcome, "not_billable");
  const notServed = await settleBillableRequest({ ...base, statusCode: 500 }, fakeDeps().deps);
  assert.equal(notServed.outcome, "not_billable");
});

test("idempotent replay: prior wallet charge returns charged, does not re-count or re-deduct", async () => {
  const { deps, calls } = fakeDeps({ used: 10, priorCharge: { credits: -4, balanceAfter: 96 } });
  const r = await settleBillableRequest(base, deps);
  assert.equal(r.outcome, "charged");
  assert.equal(r.chargedCredits, 4);
  assert.equal(r.balanceAfter, 96);
  assert.equal(r.alreadyProcessed, true);
  assert.equal(calls.deduct, 0);
  assert.equal(calls.count, 0);
});

test("idempotent replay: a previously-included request stays included (no overage flip)", async () => {
  // used now >= quota, but this requestId already has a usage row and NO wallet txn ⇒ was included.
  const { deps, calls } = fakeDeps({ used: 3_000_000, priorUsage: { creditsCharged: 0 } });
  const r = await settleBillableRequest(base, deps);
  assert.equal(r.outcome, "included");
  assert.equal(r.alreadyProcessed, true);
  assert.equal(calls.deduct, 0, "must NOT charge a request that was already included on the first try");
});

test("monthStartUtc is the UTC first-of-month", () => {
  assert.equal(monthStartUtc(new Date("2026-07-16T23:59:59Z")).toISOString(), "2026-07-01T00:00:00.000Z");
});

test("FREE_DATASET_SLUGS is empty today (every dataset costs >= 1)", () => {
  assert.deepEqual(FREE_DATASET_SLUGS, []);
});

// ---- BILLING-02: subscription billing-period window ----

test("billingWindowStart uses a valid past period start, else the UTC month", () => {
  const now = new Date("2026-07-16T04:00:00Z");
  // valid past period start ⇒ used verbatim
  assert.equal(billingWindowStart("2026-06-20T00:00:00Z", now).toISOString(), "2026-06-20T00:00:00.000Z");
  // null ⇒ UTC month
  assert.equal(billingWindowStart(null, now).toISOString(), "2026-07-01T00:00:00.000Z");
  // unparseable ⇒ UTC month
  assert.equal(billingWindowStart("not-a-date", now).toISOString(), "2026-07-01T00:00:00.000Z");
  // FUTURE period start ⇒ fall back to month (never over-grant on a bad boundary)
  assert.equal(billingWindowStart("2026-08-01T00:00:00Z", now).toISOString(), "2026-07-01T00:00:00.000Z");
});

test("settle counts usage since the subscription period start when provided", async () => {
  const { deps, calls } = fakeDeps({ used: 10, now: "2026-07-16T04:00:00Z" });
  await settleBillableRequest({ ...base, periodStart: "2026-06-20T00:00:00Z" }, deps);
  assert.equal(calls.since.toISOString(), "2026-06-20T00:00:00.000Z", "window anchored on period start");
});

test("settle falls back to the UTC month when period start is absent", async () => {
  const { deps, calls } = fakeDeps({ used: 10, now: "2026-07-16T04:00:00Z" });
  await settleBillableRequest({ ...base, periodStart: null }, deps);
  assert.equal(calls.since.toISOString(), "2026-07-01T00:00:00.000Z", "window falls back to UTC month");
});

test("previewIncludedQuota honours the period-start window too", async () => {
  const { deps, calls } = fakeDeps({ used: 5, now: "2026-07-16T04:00:00Z" });
  const r = await previewIncludedQuota({ userId: "u1", planCode: "developer", periodStart: "2026-07-03T00:00:00Z" }, deps);
  assert.equal(r.hasRoom, true);
  assert.equal(calls.since.toISOString(), "2026-07-03T00:00:00.000Z");
});
