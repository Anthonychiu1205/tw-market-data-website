import "server-only";

import type { Subscription } from "@prisma/client";

import { prisma } from "@/src/lib/auth/prisma";

export function isSubscriptionCurrentlyEntitled(subscription: Pick<Subscription, "status" | "currentPeriodEnd"> | null) {
  if (!subscription) {
    return false;
  }

  if (!subscription.currentPeriodEnd) {
    return false;
  }

  const periodEnd = subscription.currentPeriodEnd.getTime();
  if (Number.isNaN(periodEnd) || periodEnd <= Date.now()) {
    return false;
  }

  return subscription.status === "active" || subscription.status === "cancelled";
}

export async function getActiveSubscriptionForUser(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: {
        in: ["active", "cancelled"],
      },
    },
    orderBy: [{ currentPeriodEnd: "desc" }, { updatedAt: "desc" }],
  });

  return subscriptions.find((subscription) => isSubscriptionCurrentlyEntitled(subscription)) ?? null;
}

export async function getLatestSubscriptionForUser(userId: string) {
  return await prisma.subscription.findFirst({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getUserPlanCode(userId: string) {
  const subscription = await getActiveSubscriptionForUser(userId);
  return subscription?.planCode ?? null;
}
