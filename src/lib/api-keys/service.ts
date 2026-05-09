import "server-only";

import type { ApiKey } from "@prisma/client";

import type { ApiKeyItem, ApiKeysSummary } from "@/src/lib/backend-adapter";
import { prisma } from "@/src/lib/auth/prisma";
import { assertValidApiKeyName, generateApiKey, getApiKeyPrefix, hashApiKey, maskApiKey } from "@/src/lib/security/api-keys";
import { decryptSecret, encryptSecret, getEncryptionVersion } from "@/src/lib/security/secret-encryption";

const MAX_ACTIVE_API_KEYS_PER_USER = 5;
const API_KEYS_SUMMARY_CACHE_TTL_MS = 8_000;

type ApiKeysSummaryCacheEntry = {
  value: ApiKeysSummary;
  expiresAt: number;
};

const apiKeysSummaryCache = new Map<string, ApiKeysSummaryCacheEntry>();

function nowMs() {
  return Date.now();
}

function getApiKeysSummaryCache(userId: string) {
  const entry = apiKeysSummaryCache.get(userId);
  if (!entry) return null;
  if (entry.expiresAt <= nowMs()) {
    apiKeysSummaryCache.delete(userId);
    return null;
  }
  return entry.value;
}

function setApiKeysSummaryCache(userId: string, value: ApiKeysSummary) {
  apiKeysSummaryCache.set(userId, {
    value,
    expiresAt: nowMs() + API_KEYS_SUMMARY_CACHE_TTL_MS,
  });
}

function invalidateApiKeysSummaryCache(userId: string) {
  apiKeysSummaryCache.delete(userId);
}

function toApiKeyItem(row: ApiKey): ApiKeyItem {
  return {
    id: row.id,
    name: row.name,
    keyPrefix: row.keyPrefix,
    maskedKey: maskApiKey(row.keyPrefix),
    canCopy: row.status === "active" && Boolean(row.encryptedSecret),
    status: row.status,
    lastUsed: row.lastUsedAt ? row.lastUsedAt.toISOString() : "-",
    createdAt: row.createdAt.toISOString(),
    revokedAt: row.revokedAt ? row.revokedAt.toISOString() : null,
  };
}

export async function getApiKeysSummaryForUser(userId: string): Promise<ApiKeysSummary> {
  const cached = getApiKeysSummaryCache(userId);
  if (cached) {
    return cached;
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
  });
  const activeCount = keys.filter((item) => item.status === "active").length;

  const result: ApiKeysSummary = {
    keys: keys.map(toApiKeyItem),
    canCreate: activeCount < MAX_ACTIVE_API_KEYS_PER_USER,
    canRevoke: true,
    integrationMode: "live",
  };
  setApiKeysSummaryCache(userId, result);
  return result;
}

export async function createApiKeyForUser(input: { userId: string; name?: string | null }) {
  const validName = assertValidApiKeyName(input.name);

  const activeCount = await prisma.apiKey.count({
    where: {
      userId: input.userId,
      status: "active",
    },
  });

  if (activeCount >= MAX_ACTIVE_API_KEYS_PER_USER) {
    throw new Error("api_key_limit_reached");
  }

  const rawKey = generateApiKey();
  const keyPrefix = getApiKeyPrefix(rawKey);
  const keyHash = hashApiKey(rawKey);

  const created = await prisma.apiKey.create({
    data: {
      userId: input.userId,
      name: validName,
      keyPrefix,
      keyHash,
      encryptedSecret: encryptSecret(rawKey),
      encryptionVersion: getEncryptionVersion(),
      status: "active",
    },
  });

  invalidateApiKeysSummaryCache(input.userId);

  return {
    apiKey: toApiKeyItem(created),
    secret: rawKey,
  };
}

export async function getApiKeySecretForUser(input: { userId: string; apiKeyId: string }) {
  const key = await prisma.apiKey.findFirst({
    where: {
      id: input.apiKeyId,
      userId: input.userId,
    },
    select: {
      id: true,
      status: true,
      encryptedSecret: true,
    },
  });

  if (!key) {
    return { ok: false as const, error: "not_found" as const };
  }

  if (key.status !== "active") {
    return { ok: false as const, error: "revoked" as const };
  }

  if (!key.encryptedSecret) {
    return { ok: false as const, error: "secret_unavailable" as const };
  }

  try {
    const secret = decryptSecret(key.encryptedSecret);
    return { ok: true as const, secret };
  } catch {
    return { ok: false as const, error: "secret_unavailable" as const };
  }
}

export async function revokeApiKeyForUser(input: { userId: string; apiKeyId: string }) {
  const ownedKey = await prisma.apiKey.findFirst({
    where: {
      id: input.apiKeyId,
      userId: input.userId,
    },
  });

  if (!ownedKey) {
    return { ok: false as const, notFound: true };
  }

  if (ownedKey.status === "revoked") {
    return { ok: true as const, apiKey: toApiKeyItem(ownedKey), alreadyRevoked: true };
  }

  const updated = await prisma.apiKey.update({
    where: { id: ownedKey.id },
    data: {
      status: "revoked",
      revokedAt: new Date(),
    },
  });

  invalidateApiKeysSummaryCache(input.userId);

  return { ok: true as const, apiKey: toApiKeyItem(updated), alreadyRevoked: false };
}
