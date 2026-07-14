import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/src/lib/auth/prisma";
import { isCreditsDeductionEnabled as isCreditsDeductionEnabledWithGuard } from "@/src/lib/billing/credits-mode";
import { sanitizeGatewayErrorMessage } from "@/src/lib/gateway/errors";

export function isCreditsDeductionEnabled() {
  return isCreditsDeductionEnabledWithGuard();
}

function toUsageMerchantTradeNo(requestId: string) {
  return `usage:${requestId}`;
}

export type CreditsAvailabilityResult = {
  sufficient: boolean;
  balance: number;
};

export async function checkCreditsAvailabilityForApiUsage(input: {
  userId: string;
  credits: number;
}): Promise<CreditsAvailabilityResult> {
  const credits = Math.max(0, Math.trunc(input.credits));
  if (credits <= 0) {
    return { sufficient: true, balance: 0 };
  }

  const wallet = await prisma.creditWallet.findUnique({
    where: { userId: input.userId },
    select: { balance: true },
  });

  const balance = wallet?.balance ?? 0;
  return {
    sufficient: balance >= credits,
    balance,
  };
}

export type DeductCreditsForApiUsageResult =
  | {
      ok: true;
      alreadyProcessed: boolean;
      chargedCredits: number;
      balanceAfter: number | null;
    }
  | {
      ok: false;
      code: "insufficient_credits" | "deduction_failed";
    };

export async function deductCreditsForApiUsage(input: {
  userId: string;
  apiKeyId?: string | null;
  datasetSlug: string;
  requestId: string;
  credits: number;
  statusCode: number;
}): Promise<DeductCreditsForApiUsageResult> {
  const credits = Math.max(0, Math.trunc(input.credits));
  if (credits <= 0 || input.statusCode < 200 || input.statusCode >= 300) {
    return {
      ok: true,
      alreadyProcessed: false,
      chargedCredits: 0,
      balanceAfter: null,
    };
  }

  const usageMerchantTradeNo = toUsageMerchantTradeNo(input.requestId);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.creditTransaction.findUnique({
        where: { merchantTradeNo: usageMerchantTradeNo },
        select: {
          id: true,
          status: true,
          credits: true,
          balanceAfter: true,
        },
      });

      if (existing) {
        return {
          kind: "already" as const,
          chargedCredits: Math.max(0, -existing.credits),
          balanceAfter: existing.balanceAfter,
        };
      }

      const wallet = await tx.creditWallet.findUnique({
        where: { userId: input.userId },
        select: {
          id: true,
          balance: true,
        },
      });

      if (!wallet || wallet.balance < credits) {
        return {
          kind: "insufficient" as const,
        };
      }

      const updatedWallet = await tx.creditWallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: credits,
          },
        },
        select: {
          balance: true,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: input.userId,
          walletId: wallet.id,
          type: "usage",
          status: "completed",
          credits: -credits,
          balanceAfter: updatedWallet.balance,
          provider: "gateway",
          merchantTradeNo: usageMerchantTradeNo,
          packageCode: null,
          description: `API usage ${input.datasetSlug} · request ${input.requestId}`,
        },
      });

      return {
        kind: "deducted" as const,
        chargedCredits: credits,
        balanceAfter: updatedWallet.balance,
      };
    });

    if (result.kind === "insufficient") {
      return { ok: false, code: "insufficient_credits" };
    }

    if (result.kind === "already") {
      return {
        ok: true,
        alreadyProcessed: true,
        chargedCredits: result.chargedCredits,
        balanceAfter: result.balanceAfter,
      };
    }

    return {
      ok: true,
      alreadyProcessed: false,
      chargedCredits: result.chargedCredits,
      balanceAfter: result.balanceAfter,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await prisma.creditTransaction.findUnique({
        where: { merchantTradeNo: usageMerchantTradeNo },
        select: {
          credits: true,
          balanceAfter: true,
        },
      });
      if (existing) {
        return {
          ok: true,
          alreadyProcessed: true,
          chargedCredits: Math.max(0, -existing.credits),
          balanceAfter: existing.balanceAfter,
        };
      }
    }

    const sanitized = sanitizeGatewayErrorMessage(error);
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn("[gateway]", {
      requestId: input.requestId,
      stage: "credits_deduction",
      errorName,
      message: sanitized,
    });

    return {
      ok: false,
      code: "deduction_failed",
    };
  }
}
