import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { prisma } from "@/src/lib/auth/prisma";
import { assertCreditsDeductionRuntimeSafe } from "@/src/lib/billing/credits-mode";
import { settleBillableRequest } from "@/src/lib/billing/included-quota";
import { runMeter, type MeterInput } from "@/src/lib/billing/meter-core";
import { DATASET_CREDIT_COSTS } from "@/src/lib/gateway/dataset-policies";
import { resolveUserPlanCode } from "@/src/lib/gateway/entitlement";
import { createApiUsageEvent } from "@/src/lib/gateway/usage";

export const runtime = "nodejs";

// Server-to-server credit metering, called ONLY by the read API (api.twmarketdata.com) on each
// successful PAID call made with an sk_live_ key. The read API path has no wallet of its own — the
// wallet, purchases and refunds all live here — so it calls this to deduct.
//
// This handler is TRANSPORT ONLY: shared-secret auth, X-Request-Id reconciliation, JSON parsing, and
// wiring real prisma/settle into the pure decision core (meter-core.ts). All billing semantics — SSOT
// pricing, identity, idempotent deduction, and the exact response shape the read API's
// credits_meter_client._parse expects — live in the core and are unit-tested there.
//
// Guardrails (work order METER-01):
//   - Auth is a shared secret, NOT a user session (there is no browser here). Missing → fail CLOSED.
//   - COST comes from OUR SSOT (DATASET_CREDIT_COSTS), never the caller.
//   - Idempotent on requestId (merchantTradeNo=usage:<id>) so a retry never double-charges.

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

  let payload: MeterInput = {};
  try {
    payload = (await request.json()) as MeterInput;
  } catch {
    payload = {};
  }

  // X-Request-Id is a transport-level copy of body.requestId and must agree with it — the idempotency
  // key is the requestId, so a divergence would key the ledger and the header on different ids. Reject
  // rather than silently pick one.
  const headerRequestId = request.headers.get("x-request-id")?.trim();
  const bodyRequestId = typeof payload.requestId === "string" ? payload.requestId.trim() : "";
  if (headerRequestId && bodyRequestId && headerRequestId !== bodyRequestId) {
    return NextResponse.json({ ok: false, error: "request_id_mismatch" }, { status: 400 });
  }

  const result = await runMeter(
    {
      lookupCost: (dataset) => DATASET_CREDIT_COSTS[dataset],
      findUserByEmail: (email) => prisma.user.findUnique({ where: { email }, select: { id: true } }),
      runtimeMode: () => assertCreditsDeductionRuntimeSafe().mode,
      getWalletBalance: async (userId) => {
        const wallet = await prisma.creditWallet.findUnique({ where: { userId }, select: { balance: true } });
        return wallet?.balance ?? null;
      },
      resolvePlan: async (userId, requestId) => {
        const { planCode, periodStart } = await resolveUserPlanCode(userId, requestId);
        return { planCode, periodStart };
      },
      settle: (input) => settleBillableRequest(input),
      recordUsage: async (usage) => {
        // ApiUsageEvent.requestId is not unique, so a retry could duplicate the row. Guard with a
        // best-effort existence check — the FINANCIAL idempotency is enforced separately by the
        // deduction engine's unique merchantTradeNo; this only keeps the ledger from double-counting.
        const existing = await prisma.apiUsageEvent.findFirst({
          where: { requestId: usage.requestId },
          select: { id: true },
        });
        if (existing) return;
        await createApiUsageEvent({
          userId: usage.userId,
          // NOT the caller's apiKeyId. ApiUsageEvent.apiKeyId is a FK to the website's local ApiKey
          // table (legacy twmd_live_ keys); the read API's sk_live_ key ids are NOT in that table, so
          // persisting one would violate the FK — and createApiUsageEvent swallows write errors, so the
          // event would silently vanish. Store null; per-key attribution belongs to the read API.
          apiKeyId: null,
          datasetSlug: usage.dataset,
          endpoint: usage.endpoint,
          method: usage.method,
          symbol: usage.symbol,
          creditsCharged: usage.creditsCharged,
          statusCode: usage.statusCode,
          requestId: usage.requestId,
        });
      },
    },
    payload,
  );

  return NextResponse.json(result.body, { status: result.status });
}
