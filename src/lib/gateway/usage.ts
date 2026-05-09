import "server-only";

import { prisma } from "@/src/lib/auth/prisma";
import { sanitizeGatewayErrorMessage } from "@/src/lib/gateway/errors";

const USAGE_SUMMARY_CACHE_TTL_MS = 8_000;

type UsageSummaryCacheEntry = {
  value: ApiUsageSummary;
  expiresAt: number;
};

const usageSummaryCache = new Map<string, UsageSummaryCacheEntry>();

function nowMs() {
  return Date.now();
}

type CreateApiUsageEventInput = {
  userId: string;
  apiKeyId?: string | null;
  datasetSlug: string;
  endpoint: string;
  method: string;
  symbol?: string | null;
  creditsCharged: number;
  statusCode: number;
  latencyMs?: number | null;
  requestId: string;
  errorCode?: string | null;
};

export function normalizeGatewayErrorCode(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (!/^[a-z0-9_]{3,64}$/.test(normalized)) return "internal_error";
  return normalized;
}

export function deriveSymbolFromSearchParams(searchParams: URLSearchParams) {
  const raw = (searchParams.get("symbol") ?? "").trim();
  if (!raw) return null;
  if (!/^[A-Za-z0-9._-]{1,16}$/.test(raw)) return null;
  return raw;
}

export async function createApiUsageEvent(input: CreateApiUsageEventInput) {
  try {
    await prisma.apiUsageEvent.create({
      data: {
        userId: input.userId,
        apiKeyId: input.apiKeyId ?? null,
        datasetSlug: input.datasetSlug,
        endpoint: input.endpoint,
        method: input.method.toUpperCase(),
        symbol: input.symbol ?? null,
        creditsCharged: Math.max(0, Math.trunc(input.creditsCharged)),
        statusCode: Math.max(100, Math.min(599, Math.trunc(input.statusCode))),
        latencyMs:
          typeof input.latencyMs === "number" && Number.isFinite(input.latencyMs)
            ? Math.max(0, Math.trunc(input.latencyMs))
            : null,
        requestId: input.requestId,
        errorCode: normalizeGatewayErrorCode(input.errorCode),
      },
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const sanitizedMessage = sanitizeGatewayErrorMessage(error);
    console.warn("[gateway]", {
      requestId: input.requestId,
      stage: "usage_logging",
      errorName,
      message: sanitizedMessage,
    });
  }
}

export type RecentApiUsageItem = {
  id: string;
  requestTimestamp: string;
  dataset: string;
  endpoint: string;
  method: string;
  symbol: string | null;
  statusCode: number;
  creditsCharged: number;
  latencyMs: number | null;
  requestId: string;
  errorCode: string | null;
};

export async function getRecentApiUsageForUser(userId: string, limit = 100): Promise<RecentApiUsageItem[]> {
  const take = Number.isFinite(limit) ? Math.max(1, Math.min(Math.trunc(limit), 500)) : 100;
  const rows = await prisma.apiUsageEvent.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    take,
    select: {
      id: true,
      createdAt: true,
      datasetSlug: true,
      endpoint: true,
      method: true,
      symbol: true,
      statusCode: true,
      creditsCharged: true,
      latencyMs: true,
      requestId: true,
      errorCode: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    requestTimestamp: row.createdAt.toISOString(),
    dataset: row.datasetSlug,
    endpoint: row.endpoint,
    method: row.method,
    symbol: row.symbol ?? null,
    statusCode: row.statusCode,
    creditsCharged: row.creditsCharged,
    latencyMs: row.latencyMs ?? null,
    requestId: row.requestId,
    errorCode: row.errorCode ?? null,
  }));
}

export type ApiUsageSummary = {
  requestsToday: number;
  requests30d: number;
  estimatedCreditsUsage30d: number;
  topDatasets: Array<{ dataset: string; count: number }>;
  recentErrors: Array<{ code: string; count: number }>;
  dailyUsage: Array<{ date: string; count: number }>;
};

export async function getUsageSummaryForUser(userId: string): Promise<ApiUsageSummary> {
  const cached = usageSummaryCache.get(userId);
  if (cached && cached.expiresAt > nowMs()) {
    return cached.value;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWindow = new Date(startOfToday);
  startOfWindow.setDate(startOfWindow.getDate() - 34);

  const [events, requestsToday] = await Promise.all([
    prisma.apiUsageEvent.findMany({
      where: {
        userId,
        createdAt: { gte: startOfWindow },
      },
      select: {
        datasetSlug: true,
        createdAt: true,
        creditsCharged: true,
        errorCode: true,
        statusCode: true,
      },
      orderBy: [{ createdAt: "desc" }],
    }),
    prisma.apiUsageEvent.count({
      where: {
        userId,
        createdAt: { gte: startOfToday },
      },
    }),
  ]);

  const datasetCount = new Map<string, number>();
  const errorCount = new Map<string, number>();
  const dailyCount = new Map<string, number>();
  let creditsTotal = 0;

  for (const item of events) {
    datasetCount.set(item.datasetSlug, (datasetCount.get(item.datasetSlug) ?? 0) + 1);
    creditsTotal += Math.max(0, item.creditsCharged);

    const dayKey = item.createdAt.toISOString().slice(0, 10);
    dailyCount.set(dayKey, (dailyCount.get(dayKey) ?? 0) + 1);

    const errorCode = item.errorCode ?? (item.statusCode >= 400 ? `http_${item.statusCode}` : null);
    if (errorCode) {
      errorCount.set(errorCode, (errorCount.get(errorCode) ?? 0) + 1);
    }
  }

  const dailyUsage = Array.from({ length: 35 }, (_, index) => {
    const day = new Date(startOfWindow);
    day.setDate(startOfWindow.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    return {
      date: key,
      count: dailyCount.get(key) ?? 0,
    };
  });

  const result: ApiUsageSummary = {
    requestsToday,
    requests30d: events.length,
    estimatedCreditsUsage30d: creditsTotal,
    topDatasets: Array.from(datasetCount.entries())
      .map(([dataset, count]) => ({ dataset, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    recentErrors: Array.from(errorCount.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    dailyUsage,
  };
  usageSummaryCache.set(userId, {
    value: result,
    expiresAt: nowMs() + USAGE_SUMMARY_CACHE_TTL_MS,
  });
  return result;
}
