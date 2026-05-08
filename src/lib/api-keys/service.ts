import "server-only";

import type { ApiKey } from "@prisma/client";

import type { ApiKeyItem, ApiKeysSummary } from "@/src/lib/backend-adapter";
import { prisma } from "@/src/lib/auth/prisma";
import { assertValidApiKeyName, generateApiKey, getApiKeyPrefix, hashApiKey, maskApiKey } from "@/src/lib/security/api-keys";

const MAX_ACTIVE_API_KEYS_PER_USER = 5;

function toApiKeyItem(row: ApiKey): ApiKeyItem {
  return {
    id: row.id,
    name: row.name,
    keyPrefix: row.keyPrefix,
    maskedKey: maskApiKey(row.keyPrefix),
    status: row.status,
    lastUsed: row.lastUsedAt ? row.lastUsedAt.toISOString() : "-",
    createdAt: row.createdAt.toISOString(),
    revokedAt: row.revokedAt ? row.revokedAt.toISOString() : null,
  };
}

export async function getApiKeysSummaryForUser(userId: string): Promise<ApiKeysSummary> {
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
  });
  const activeCount = keys.filter((item) => item.status === "active").length;

  return {
    keys: keys.map(toApiKeyItem),
    canCreate: activeCount < MAX_ACTIVE_API_KEYS_PER_USER,
    canRevoke: true,
    integrationMode: "live",
  };
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
      status: "active",
    },
  });

  return {
    apiKey: toApiKeyItem(created),
    secret: rawKey,
  };
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

  return { ok: true as const, apiKey: toApiKeyItem(updated), alreadyRevoked: false };
}
