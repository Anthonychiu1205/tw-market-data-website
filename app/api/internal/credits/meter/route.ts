import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { prisma } from "@/src/lib/auth/prisma";
import { assertCreditsDeductionRuntimeSafe } from "@/src/lib/billing/credits-mode";
import { DATASET_CREDIT_COSTS } from "@/src/lib/gateway/dataset-policies";
import { resolveUserPlanCode } from "@/src/lib/gateway/entitlement";
import { settleBillableRequest } from "@/src/lib/billing/included-quota";
import { createApiUsageEvent } from "@/src/lib/gateway/usage";

export const runtime = "nodejs";

// Server-to-server credit metering, called ONLY by the read API (api.twmarketdata.com) on each
// successful PAID call made with an sk_live_ key. The read API path has no wallet of its own — the
// wallet, purchases and refunds all live here — so it calls this to deduct.
//
// Guardrails (work order 2026-07-15):
//   - Auth is a shared secret, NOT a user session (there is no browser here).
//   - COST is looked up from OUR SSOT (DATASET_CREDIT_COSTS), never taken from the caller. The read
//     API must not be able to set its own price.
//   - Identity is the account email → local User → wallet. Unresolved → a clear error, never a guess.
//   - charged vs dry_run is decided by OUR credits-mode; the read API does not get a vote.
//   - Idempotent on requestId (reuses the gateway deduction engine: merchantTradeNo=usage:<id>),
//     so a retry never double-charges.
//   - Only a successful, sufficient, paid call deducts.

type MeterPayload = {
  accountEmail?: string;
  dataset?: string;
  requestId?: string;
  // Optional context for the usage ledger. statusCode defaults to 200 because the read API is
  // expected to confirm it can serve BEFORE calling (deduct-after-serveable). A non-2xx here never
  // deducts (the engine enforces that too).
  statusCode?: number;
  endpoint?: string;
  method?: string;
  symbol?: string | null;
  apiKeyId?: string | null;
};

function readToken(request: Request): string {
  return (
    request.headers.get("x-internal-meter-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    ""
  ).trim();
}

// Constant-time comparison so the shared secret cannot be recovered by timing.
function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const expected = process.env.INTERNAL_METER_TOKEN?.trim();
  if (!expected) {
    // Fail CLOSED. Without a configured secret the endpoint must be unusable, never open.
    console.error("[meter] INTERNAL_METER_TOKEN is not configured");
    return NextResponse.json({ ok: false, error: "meter_not_configured" }, { status: 503 });
  }
  if (!tokenMatches(readToken(request), expected)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let payload: MeterPayload = {};
  try {
    payload = (await request.json()) as MeterPayload;
  } catch {
    payload = {};
  }

  const accountEmail = str(payload.accountEmail).toLowerCase();
  const dataset = str(payload.dataset);
  const requestId = str(payload.requestId);

  if (!accountEmail || !dataset || !requestId) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // COST from the SSOT. An unknown dataset is a drift between the read API and our policy table —
  // refuse and surface it rather than invent a price. cost 0 = a real free/non-billable dataset.
  const cost = DATASET_CREDIT_COSTS[dataset];
  if (typeof cost !== "number") {
    return NextResponse.json({ ok: false, error: "unknown_dataset" }, { status: 400 });
  }

  // Identity: account email → local user → wallet. email is @unique, so this is deterministic.
  const user = await prisma.user.findUnique({ where: { email: accountEmail }, select: { id: true } });
  if (!user) {
    // Do not charge someone we cannot identify.
    return NextResponse.json({ ok: false, error: "account_not_found" }, { status: 404 });
  }

  const statusCode = typeof payload.statusCode === "number" ? payload.statusCode : 200;
  const runtimeState = assertCreditsDeductionRuntimeSafe();
  const isServed = statusCode >= 200 && statusCode < 300;

  async function recordUsageOnce(creditsCharged: number) {
    // ApiUsageEvent.requestId is not unique, so a retry could duplicate the row. Guard with a
    // best-effort existence check — the financial idempotency is enforced separately by the
    // deduction engine's unique merchantTradeNo, this only keeps the ledger from double-counting.
    const existing = await prisma.apiUsageEvent.findFirst({ where: { requestId }, select: { id: true } });
    if (existing) return;
    await createApiUsageEvent({
      userId: user!.id,
      // NOT payload.apiKeyId. ApiUsageEvent.apiKeyId is a FK to the website's local ApiKey table
      // (legacy twmd_live_ keys). The read API's sk_live_ keys live in read_api_api_keys and their
      // ids are NOT in that table, so persisting the caller's key id would violate the FK — and
      // createApiUsageEvent swallows write errors, so the usage event would silently vanish. Store
      // null; per-key attribution belongs to the read API updating read_api_api_keys.last_used_at.
      apiKeyId: null,
      datasetSlug: dataset,
      endpoint: str(payload.endpoint) || `/v2/datasets/${dataset}`,
      method: str(payload.method) || "GET",
      symbol: payload.symbol ?? null,
      creditsCharged,
      statusCode,
      requestId,
    });
  }

  // dry_run / blocked: never touch the wallet. Record the estimated cost so the usage dashboard and
  // reconciliation still reflect the call, and tell the read API nothing was deducted.
  if (runtimeState.mode !== "charged") {
    if (isServed) await recordUsageOnce(cost);
    return NextResponse.json({ ok: true, mode: runtimeState.mode, deducted: 0, cost });
  }

  // charged: INCLUDED-QUOTA-FIRST then wallet overage. The plan (and thus the monthly included
  // allowance) is resolved from the SAME source the gateway uses — the read API via resolveUserPlanCode
  // (Polar SSOT) — so the s2s meter and the in-process gateway settle identically. `cost` is still OUR
  // SSOT dataset price; the caller never sets it.
  const { planCode } = await resolveUserPlanCode(user.id, requestId);
  const settle = await settleBillableRequest({
    userId: user.id,
    planCode,
    datasetSlug: dataset,
    requestId,
    credits: cost,
    statusCode,
    apiKeyId: payload.apiKeyId ?? null,
  });

  if (settle.outcome === "insufficient") {
    const wallet = await prisma.creditWallet.findUnique({
      where: { userId: user.id },
      select: { balance: true },
    });
    // Included allowance is spent AND the wallet cannot cover overage. No usage event: the call is NOT
    // served (the read API returns 402 / upgrade prompt), so it is not a billable event.
    return NextResponse.json(
      { ok: false, insufficient: true, balance: wallet?.balance ?? 0, cost },
      { status: 200 },
    );
  }
  if (settle.outcome === "error") {
    // Deduction genuinely failed. Fail the meter so the read API does not serve a call it could not
    // bill — better to 5xx than to give data away for free.
    return NextResponse.json({ ok: false, error: "deduction_failed" }, { status: 502 });
  }

  // included / charged / not_billable. Record the usage event once with the credits ACTUALLY charged
  // (0 when covered by included quota) — a replay must not double-count the ledger, and the wallet
  // deduction (overage) is already idempotent on usage:<requestId>.
  if (!settle.alreadyProcessed && isServed) {
    await recordUsageOnce(settle.chargedCredits);
  }

  return NextResponse.json({
    ok: true,
    mode: "charged",
    deducted: settle.chargedCredits,
    included: settle.outcome === "included",
    includedRemaining: settle.includedRemaining ?? null,
    alreadyProcessed: settle.alreadyProcessed ?? false,
    balance: settle.balanceAfter ?? null,
    cost,
  });
}
