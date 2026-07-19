import assert from "node:assert/strict";
import { test } from "node:test";

import { runMeter, type MeterDeps, type MeterInput } from "./meter-core.ts";
import type { SettleInput, SettleResult } from "./included-quota.ts";

// A configurable settle fake that models the real engine's requestId idempotency (unique
// merchantTradeNo): the first call for a requestId deducts from a shared wallet; a replay returns the
// SAME result with alreadyProcessed:true and deducts nothing more.
function makeStatefulSettle(startingBalance: number) {
  const seen = new Map<string, SettleResult>();
  const state = { wallet: startingBalance, deductions: 0 };
  const settle = async (input: SettleInput): Promise<SettleResult> => {
    const prior = seen.get(input.requestId);
    if (prior) return { ...prior, alreadyProcessed: true };
    state.deductions += 1;
    state.wallet -= input.credits;
    const result: SettleResult = {
      outcome: "charged",
      chargedCredits: input.credits,
      balanceAfter: state.wallet,
      alreadyProcessed: false,
    };
    seen.set(input.requestId, result);
    return result;
  };
  return { settle, state };
}

function makeDeps(overrides: Partial<MeterDeps> = {}): { deps: MeterDeps; usageCalls: unknown[] } {
  const usageCalls: unknown[] = [];
  const deps: MeterDeps = {
    lookupCost: (dataset) => (dataset === "income-statement" ? 5 : undefined),
    findUserByEmail: async () => ({ id: "u1" }),
    runtimeMode: () => "charged",
    getWalletBalance: async () => 100,
    resolvePlan: async () => ({ planCode: "free", periodStart: null }),
    settle: async () => ({ outcome: "charged", chargedCredits: 5, balanceAfter: 95 }),
    recordUsage: async (u) => {
      usageCalls.push(u);
    },
    ...overrides,
  };
  return { deps, usageCalls };
}

const BASE_INPUT: MeterInput = {
  accountEmail: "user@example.com",
  dataset: "income-statement",
  requestId: "req-1",
};

// ── Path 1: idempotency — same requestId twice charges at most once, same result both times ──
test("idempotent: same requestId twice deducts once and returns the same result", async () => {
  const { settle, state } = makeStatefulSettle(100);
  const { deps, usageCalls } = makeDeps({ settle });

  const first = await runMeter(deps, BASE_INPUT);
  const second = await runMeter(deps, BASE_INPUT); // identical requestId → replay

  assert.equal(state.deductions, 1, "wallet must be deducted exactly once across two identical calls");
  assert.equal(state.wallet, 95, "cost 5 taken once from balance 100");

  assert.equal(first.status, 200);
  assert.equal(first.body.ok, true);
  assert.equal(first.body.deducted, 5);
  assert.equal(first.body.balance, 95);

  assert.equal(second.status, 200);
  assert.equal(second.body.ok, true);
  assert.equal(second.body.deducted, 5, "replay reports the same deducted amount, not a second charge");
  assert.equal(second.body.balance, 95);
  assert.equal(second.body.alreadyProcessed, true);

  // Usage ledger recorded on the first (fresh) settle only; the replay is alreadyProcessed → skipped.
  assert.equal(usageCalls.length, 1, "usage ledger must not double-count on replay");
});

// ── Path 2: insufficient balance → 200, insufficient:true, nothing deducted ──
test("insufficient: returns 200 insufficient:true with no deduction and full contract fields", async () => {
  const { deps, usageCalls } = makeDeps({
    settle: async () => ({ outcome: "insufficient", chargedCredits: 0 }),
    getWalletBalance: async () => 2,
  });

  const res = await runMeter(deps, BASE_INPUT);

  assert.equal(res.status, 200, "insufficient stays 200 (client reads insufficient on the 2xx path)");
  assert.equal(res.body.ok, false);
  assert.equal(res.body.insufficient, true);
  assert.equal(res.body.deducted, 0);
  assert.equal(res.body.identified, true);
  assert.equal(res.body.balance, 2);
  assert.equal(res.body.cost, 5);
  assert.equal(res.body.mode, "charged");
  assert.equal(usageCalls.length, 0, "an unserved (unbilled) call records no usage event");
});

// ── Path 3: unknown dataset → HTTP 400 { error:"unknown_dataset" }, no identity lookup ──
test("unknown_dataset: returns 400 error and never looks up the user", async () => {
  let userLookups = 0;
  const { deps } = makeDeps({
    findUserByEmail: async () => {
      userLookups += 1;
      return { id: "u1" };
    },
  });

  const res = await runMeter(deps, { ...BASE_INPUT, dataset: "not-a-real-dataset" });

  assert.equal(res.status, 400);
  assert.equal(res.body.error, "unknown_dataset");
  assert.equal(userLookups, 0, "pricing drift is rejected before any identity/billing work");
});

// ── Path 4: unidentified payer → 200 { ok:false, identified:false }, never 404/500, never charges ──
test("unidentified payer: returns 200 identified:false and does not deduct", async () => {
  let settleCalls = 0;
  const { deps } = makeDeps({
    findUserByEmail: async () => null,
    settle: async () => {
      settleCalls += 1;
      return { outcome: "charged", chargedCredits: 5, balanceAfter: 95 };
    },
  });

  const res = await runMeter(deps, BASE_INPUT);

  assert.equal(res.status, 200, "unidentified is a billing answer, not a 404/500 transport error");
  assert.equal(res.body.ok, false);
  assert.equal(res.body.identified, false);
  assert.equal(res.body.deducted, 0);
  assert.equal(res.body.cost, 5, "cost is still surfaced from the SSOT");
  assert.equal(settleCalls, 0, "we never attempt to charge someone we cannot identify");
});

// ── Contract completeness + mode mapping: dry_run/blocked report outward as dry_run, full fields ──
test("dry_run and blocked both report mode:dry_run with the full field set and no deduction", async () => {
  for (const mode of ["dry_run", "blocked"] as const) {
    const { deps } = makeDeps({ runtimeMode: () => mode, getWalletBalance: async () => 42 });
    const res = await runMeter(deps, BASE_INPUT);

    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.mode, "dry_run", `${mode} maps outward to dry_run`);
    assert.equal(res.body.deducted, 0);
    assert.equal(res.body.identified, true);
    assert.equal(res.body.balance, 42);
    assert.equal(res.body.cost, 5);
    // The 7 contract fields must all be present (aligns with client _parse).
    for (const field of ["ok", "insufficient", "deducted", "balance", "cost", "mode", "identified"]) {
      assert.ok(field in res.body, `field '${field}' must be present`);
    }
  }
});
