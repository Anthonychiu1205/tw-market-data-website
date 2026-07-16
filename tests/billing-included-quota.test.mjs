import test from "node:test";
import assert from "node:assert/strict";

import { settleBillableRequest, monthStartUtc, FREE_DATASET_SLUGS } from "../src/lib/billing/included-quota.ts";

// A fake dependency set so the settlement logic is exercised with no DB. Records whether deduct ran.
function fakeDeps({ used = 0, priorCharge = null, priorUsage = null, deduct } = {}) {
  const calls = { deduct: 0, count: 0 };
  return {
    calls,
    deps: {
      async countBillableThisMonth() {
        calls.count += 1;
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
      now: () => new Date("2026-07-16T04:00:00.000Z"),
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
