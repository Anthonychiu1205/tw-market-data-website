import "server-only";

import { prisma } from "@/src/lib/auth/prisma";
import { getPlanRequestLimits } from "@/src/lib/billing/plans";
import { DATASET_CREDIT_COSTS } from "@/src/lib/gateway/dataset-policies";
import { deductCreditsForApiUsage } from "@/src/lib/gateway/credits-deduction";

// "Included quota first, then credits overage" settlement (work order 2026-07-16).
//
// Model (all numbers from the SINGLE pricing source — no PRICING_SPEC, no second truth):
//   - Monthly INCLUDED quota is a per-plan REQUEST COUNT (plans.ts PLAN_REQUEST_LIMITS, e.g.
//     developer = 3,000,000/mo). It resets on the calendar-month boundary automatically — it is
//     DERIVED from ApiUsageEvent, not a persisted counter, so there is no reset job and no new table.
//   - OVERAGE price is the per-DATASET credit cost (dataset-policies.ts DATASET_CREDIT_COSTS), the
//     same cost the wallet has always charged. There is no separate per-plan overage price.
//
// Per billable request:
//   included remaining > 0  ⇒ consume 1 included request, wallet untouched.
//   included remaining = 0  ⇒ deduct the dataset's credit cost from the prepaid wallet (overage).
//   wallet also insufficient ⇒ not served (caller returns 402 / upgrade prompt).
//
// A "billable request" is a SERVED (2xx) call to a dataset that costs > 0 credits. Free (cost 0)
// datasets never consume quota and never charge — consistent with the existing deduction engine.

// Datasets that are non-billable (cost <= 0). Currently empty (every dataset costs >= 1), but derived
// from the cost SSOT so a future free dataset is excluded from quota automatically.
export const FREE_DATASET_SLUGS: string[] = Object.entries(DATASET_CREDIT_COSTS)
  .filter(([, cost]) => !(typeof cost === "number" && cost > 0))
  .map(([slug]) => slug);

// UTC calendar-month start — the window the monthly included allowance is counted over.
//
// KNOWN LIMITATION (v1, tracked follow-up): the window SHOULD be the subscription's current billing
// period (current_period_start … current_period_end), not the UTC calendar month. Anchoring on the
// calendar month means the allowance resets on the 1st regardless of when the cycle actually renews,
// so a user whose period starts late in a month gets a fresh full allowance on the 1st — a
// "month-end double reset" that hands out more included requests than one billing cycle should.
//
// Why UTC month for now: the plan is resolved from the read API's /v2/account/summary (AccountSummary),
// which today exposes current_period_END (→ renewalDate) but NOT current_period_START, and nothing in
// the website code carries a period start. Fixing this needs A台 to confirm /v2/account/summary returns
// current_period_start, then plumbing it through AccountSummary → resolveUserPlanCode → here (swap this
// function for the period-start anchor). Until then the calendar month is the safe, deterministic v1.
export function monthStartUtc(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export type SettleOutcome = "not_billable" | "included" | "charged" | "insufficient" | "error";

export type SettleResult = {
  outcome: SettleOutcome;
  // credits actually taken from the wallet (0 for included / not_billable).
  chargedCredits: number;
  balanceAfter?: number | null;
  // included requests left AFTER this one (null = unlimited, e.g. enterprise). Present on "included".
  includedRemaining?: number | null;
  // true when a retry hit an already-settled request (idempotent replay), so nothing changed.
  alreadyProcessed?: boolean;
};

export type SettleInput = {
  userId: string;
  planCode: string;
  datasetSlug: string;
  requestId: string;
  credits: number;
  statusCode: number;
  apiKeyId?: string | null;
};

// Injectable so the settlement logic is unit-tested with no DB (mirrors the webhook worker's design).
export type SettleDeps = {
  countBillableThisMonth: (userId: string, since: Date) => Promise<number>;
  deduct: typeof deductCreditsForApiUsage;
  // idempotency lookups: a prior wallet transaction (overage replay) / a prior usage row (included replay).
  findPriorCharge: (requestId: string) => Promise<{ credits: number; balanceAfter: number | null } | null>;
  findPriorUsage: (requestId: string) => Promise<{ creditsCharged: number } | null>;
  now: () => Date;
};

function defaultDeps(): SettleDeps {
  return {
    async countBillableThisMonth(userId, since) {
      return prisma.apiUsageEvent.count({
        where: {
          userId,
          createdAt: { gte: since },
          statusCode: { gte: 200, lt: 300 },
          ...(FREE_DATASET_SLUGS.length ? { datasetSlug: { notIn: FREE_DATASET_SLUGS } } : {}),
        },
      });
    },
    deduct: deductCreditsForApiUsage,
    async findPriorCharge(requestId) {
      const txn = await prisma.creditTransaction.findUnique({
        where: { merchantTradeNo: `usage:${requestId}` },
        select: { credits: true, balanceAfter: true },
      });
      return txn ?? null;
    },
    async findPriorUsage(requestId) {
      const row = await prisma.apiUsageEvent.findFirst({
        where: { requestId },
        select: { creditsCharged: true },
      });
      return row ?? null;
    },
    now: () => new Date(),
  };
}

// Read-only preview of the monthly included allowance — used by the gateway pre-check to decide
// whether a request can be SERVED without wallet credits (included quota still has room). It never
// charges. `hasRoom` true = this request would be covered by included quota.
export async function previewIncludedQuota(
  input: { userId: string; planCode: string },
  deps: Pick<SettleDeps, "countBillableThisMonth" | "now"> = defaultDeps(),
): Promise<{ remaining: number | null; hasRoom: boolean }> {
  const { monthlyRequestQuota: quota } = getPlanRequestLimits(input.planCode);
  if (quota === null) {
    return { remaining: null, hasRoom: true };
  }
  const used = await deps.countBillableThisMonth(input.userId, monthStartUtc(deps.now()));
  return { remaining: Math.max(0, quota - used), hasRoom: used < quota };
}

export async function settleBillableRequest(
  input: SettleInput,
  deps: SettleDeps = defaultDeps(),
): Promise<SettleResult> {
  const credits = Math.max(0, Math.trunc(input.credits));
  const served = input.statusCode >= 200 && input.statusCode < 300;

  // Non-billable: a free dataset or a non-served call. No quota consumed, no charge (same rule the
  // deduction engine enforces).
  if (credits <= 0 || !served) {
    return { outcome: "not_billable", chargedCredits: 0 };
  }

  // Idempotent replays FIRST, before any counting or charging — a retry must not re-count quota or
  // flip a previously-included request into an overage charge.
  const priorCharge = await deps.findPriorCharge(input.requestId);
  if (priorCharge) {
    return {
      outcome: "charged",
      chargedCredits: Math.max(0, -priorCharge.credits),
      balanceAfter: priorCharge.balanceAfter,
      alreadyProcessed: true,
    };
  }
  const priorUsage = await deps.findPriorUsage(input.requestId);
  if (priorUsage) {
    // Already settled and left no wallet transaction ⇒ it was covered by included quota.
    return { outcome: "included", chargedCredits: 0, alreadyProcessed: true };
  }

  // Included quota is a monthly request count from the pricing SSOT. null = enterprise/custom =
  // unlimited included (never charged here).
  const { monthlyRequestQuota: quota } = getPlanRequestLimits(input.planCode);
  if (quota === null) {
    return { outcome: "included", chargedCredits: 0, includedRemaining: null };
  }

  const usedThisMonth = await deps.countBillableThisMonth(input.userId, monthStartUtc(deps.now()));
  if (usedThisMonth < quota) {
    // Covered by the monthly included allowance — wallet untouched.
    return { outcome: "included", chargedCredits: 0, includedRemaining: Math.max(0, quota - usedThisMonth - 1) };
  }

  // Included exhausted ⇒ overage against the prepaid wallet, at the dataset's credit cost.
  const result = await deps.deduct({
    userId: input.userId,
    apiKeyId: input.apiKeyId ?? null,
    datasetSlug: input.datasetSlug,
    requestId: input.requestId,
    credits,
    statusCode: input.statusCode,
  });
  if (!result.ok) {
    return { outcome: result.code === "insufficient_credits" ? "insufficient" : "error", chargedCredits: 0 };
  }
  return {
    outcome: "charged",
    chargedCredits: result.chargedCredits,
    balanceAfter: result.balanceAfter,
    alreadyProcessed: result.alreadyProcessed,
  };
}
