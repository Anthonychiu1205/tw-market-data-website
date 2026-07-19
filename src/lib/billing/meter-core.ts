// Pure decision core for the server-to-server credit meter (POST /api/internal/credits/meter).
//
// Why a separate pure module: the route handler is all transport (shared-secret auth, JSON parsing,
// NextResponse). The BILLING decision — identify payer, price from OUR SSOT, deduct idempotently,
// shape the response the read API's credits_meter_client._parse expects — is the part that must be
// unit-tested on the four contract paths (idempotent replay, insufficient, unknown_dataset,
// unidentified payer). Extracting it as a dependency-injected pure function lets those tests run with
// plain fakes and no DB/module mocking (same style as the settlement + Polar mapper tests).
//
// Contract alignment (engine repo src/feature_engine/read_api/credits_meter_client.py `_parse`):
//   - Every billing response carries the full field set: ok, insufficient, deducted, balance, cost,
//     mode, identified. Extra keys (included / includedRemaining / alreadyProcessed) are additive —
//     _parse ignores unknown fields. mode is mapped to the two the client knows: charged | dry_run
//     ("blocked" — a prod misconfig that charges nothing — is reported outward as dry_run).
//   - Unidentified payer → { ok:false, identified:false } with HTTP 200 (never 404/500): a "we can't
//     bill you" answer, not a transport error.
//   - Insufficient balance → HTTP 200 with insufficient:true (the client reads it on the 2xx path).
//   - unknown_dataset → HTTP 400 { error:"unknown_dataset" } (the read API fail-opens on this).
//   - cost is ALWAYS looked up from our DATASET_CREDIT_COSTS SSOT; the caller never sets a price.

import type { CreditsMode } from "./credits-mode.ts";
import type { SettleInput, SettleResult } from "./included-quota.ts";

export type MeterInput = {
  accountEmail?: string;
  dataset?: string;
  requestId?: string;
  // Optional usage-ledger context. statusCode defaults to 200 — the read API confirms it can serve
  // BEFORE calling (deduct-after-serveable); a non-2xx never deducts.
  statusCode?: number;
  endpoint?: string;
  method?: string;
  symbol?: string | null;
  apiKeyId?: string | null;
};

export type MeterResult = { status: number; body: Record<string, unknown> };

// Injectable side effects — real prisma/settle in the route, fakes in the test.
export type MeterDeps = {
  // OUR pricing SSOT. undefined = dataset absent from the policy table → unknown_dataset.
  lookupCost: (dataset: string) => number | undefined;
  findUserByEmail: (email: string) => Promise<{ id: string } | null>;
  // charged | dry_run | blocked, from credits-mode runtime gating.
  runtimeMode: () => CreditsMode;
  getWalletBalance: (userId: string) => Promise<number | null>;
  resolvePlan: (userId: string, requestId: string) => Promise<{ planCode: string; periodStart: string | null }>;
  settle: (input: SettleInput) => Promise<SettleResult>;
  // Idempotent usage-ledger write (no-op if a row for this requestId already exists).
  recordUsage: (input: {
    userId: string;
    dataset: string;
    endpoint: string;
    method: string;
    symbol: string | null;
    creditsCharged: number;
    statusCode: number;
    requestId: string;
  }) => Promise<void>;
};

// The client only knows charged | dry_run. "blocked" charges nothing → report it as dry_run.
function outwardMode(mode: CreditsMode): "charged" | "dry_run" {
  return mode === "charged" ? "charged" : "dry_run";
}

// Fill the full contract field set so every billing response is uniform; caller overrides specifics.
function billingBody(partial: Record<string, unknown>): Record<string, unknown> {
  return {
    ok: false,
    insufficient: false,
    identified: false,
    deducted: 0,
    balance: null,
    cost: null,
    mode: "dry_run",
    ...partial,
  };
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function runMeter(deps: MeterDeps, input: MeterInput): Promise<MeterResult> {
  const accountEmail = str(input.accountEmail).toLowerCase();
  const dataset = str(input.dataset);
  const requestId = str(input.requestId);

  if (!accountEmail || !dataset || !requestId) {
    return { status: 400, body: { ok: false, error: "missing_fields" } };
  }

  // COST from the SSOT. Unknown dataset = drift between the read API and our policy table — refuse
  // rather than invent a price. cost 0 is a real free/non-billable dataset (handled downstream).
  const cost = deps.lookupCost(dataset);
  if (typeof cost !== "number") {
    return { status: 400, body: { ok: false, error: "unknown_dataset" } };
  }

  const mode = deps.runtimeMode();
  const outMode = outwardMode(mode);

  // Identity: account email → local user → wallet. email is @unique, so this is deterministic.
  const user = await deps.findUserByEmail(accountEmail);
  if (!user) {
    // Cannot identify → cannot bill. Not an error (no 404/500): a clean { identified:false } answer.
    return { status: 200, body: billingBody({ ok: false, identified: false, cost, mode: outMode }) };
  }

  const statusCode = typeof input.statusCode === "number" ? input.statusCode : 200;
  const isServed = statusCode >= 200 && statusCode < 300;

  const usageContext = {
    userId: user.id,
    dataset,
    endpoint: str(input.endpoint) || `/v2/datasets/${dataset}`,
    method: str(input.method) || "GET",
    symbol: input.symbol ?? null,
    statusCode,
    requestId,
  };

  // dry_run / blocked: never touch the wallet. Record the ESTIMATED cost so the usage dashboard and
  // reconciliation still reflect the call, and tell the read API nothing was deducted.
  if (mode !== "charged") {
    if (isServed) await deps.recordUsage({ ...usageContext, creditsCharged: cost });
    const balance = await deps.getWalletBalance(user.id);
    return {
      status: 200,
      body: billingBody({ ok: true, identified: true, deducted: 0, cost, balance, mode: outMode }),
    };
  }

  // charged: included-quota-first then wallet overage, settled by the SAME engine the in-process
  // gateway uses (idempotent on usage:<requestId> via the wallet transaction's unique merchantTradeNo).
  const { planCode, periodStart } = await deps.resolvePlan(user.id, requestId);
  const settle = await deps.settle({
    userId: user.id,
    planCode,
    datasetSlug: dataset,
    requestId,
    credits: cost,
    statusCode,
    apiKeyId: input.apiKeyId ?? null,
    periodStart,
  });

  if (settle.outcome === "insufficient") {
    const balance = await deps.getWalletBalance(user.id);
    // Included allowance spent AND wallet can't cover overage. HTTP 200 with insufficient:true — the
    // read API returns 402/upgrade to its caller; no usage event (the call is not served).
    return {
      status: 200,
      body: billingBody({
        ok: false,
        insufficient: true,
        identified: true,
        deducted: 0,
        balance,
        cost,
        mode: "charged",
      }),
    };
  }

  if (settle.outcome === "error") {
    // Deduction genuinely failed — fail the meter so the read API does not serve a call it can't bill.
    return { status: 502, body: { ok: false, error: "deduction_failed" } };
  }

  // included / charged / not_billable. Record the usage event once with the credits ACTUALLY charged
  // (0 when covered by included quota). A replay must not double-count the ledger; the wallet overage
  // is already idempotent on usage:<requestId>.
  if (!settle.alreadyProcessed && isServed) {
    await deps.recordUsage({ ...usageContext, creditsCharged: settle.chargedCredits });
  }

  return {
    status: 200,
    body: billingBody({
      ok: true,
      identified: true,
      deducted: settle.chargedCredits,
      balance: settle.balanceAfter ?? null,
      cost,
      mode: "charged",
      // Extras (additive; _parse ignores unknown fields) — kept for our own usage dashboard.
      included: settle.outcome === "included",
      includedRemaining: settle.includedRemaining ?? null,
      alreadyProcessed: settle.alreadyProcessed ?? false,
    }),
  };
}
