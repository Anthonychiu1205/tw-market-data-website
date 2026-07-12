import "server-only";

import type { ApiKeyItem, ApiKeysSummary } from "@/src/lib/backend-adapter";
import {
  createSelfServeKey,
  getSelfServeAccount,
  listSelfServeKeys,
  revokeSelfServeKey,
  SelfServeError,
  type SelfServeKey,
} from "@/src/lib/api-keys/self-serve-client";
import { assertValidApiKeyName } from "@/src/lib/security/api-keys";

// P0 key-system unification: the account page's key lifecycle now runs entirely through the API's
// self-serve endpoints (keys stored in read_api_api_keys as sk_live_). No local Prisma ApiKey rows,
// no twmd_live_ generation. Functions key off the user's EMAIL (the API derives the account_id from
// it deterministically). The sk_live_ raw is returned once on create and is never retrievable later.

const DEFAULT_API_KEY_LIMIT = 3;
const API_KEYS_SUMMARY_CACHE_TTL_MS = 8_000;

type ApiKeysSummaryCacheEntry = { value: ApiKeysSummary; expiresAt: number };
const apiKeysSummaryCache = new Map<string, ApiKeysSummaryCacheEntry>();

function getApiKeysSummaryCache(email: string) {
  const entry = apiKeysSummaryCache.get(email);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    apiKeysSummaryCache.delete(email);
    return null;
  }
  return entry.value;
}

function setApiKeysSummaryCache(email: string, value: ApiKeysSummary) {
  apiKeysSummaryCache.set(email, { value, expiresAt: Date.now() + API_KEYS_SUMMARY_CACHE_TTL_MS });
}

function invalidateApiKeysSummaryCache(email: string) {
  apiKeysSummaryCache.delete(email);
}

function toApiKeyItem(key: SelfServeKey): ApiKeyItem {
  const prefix = key.prefix ?? "";
  return {
    id: key.key_id,
    name: key.label ?? "",
    keyPrefix: prefix,
    // The list endpoint only ever returns a masked prefix; the raw sk_live_ is shown once on create.
    maskedKey: prefix,
    canCopy: false,
    status: key.status,
    lastUsed: key.last_used_at ?? "-",
    createdAt: key.created_at,
    revokedAt: key.revoked_at ?? null,
  };
}

export async function getApiKeysSummaryForUser(email: string): Promise<ApiKeysSummary> {
  const cached = getApiKeysSummaryCache(email);
  if (cached) return cached;

  const [keys, account] = await Promise.all([
    listSelfServeKeys(email),
    getSelfServeAccount(email).catch(() => ({}) as Record<string, unknown>),
  ]);

  const activeCount = keys.filter((item) => item.status === "active").length;
  const limit = typeof account.api_keys_limit === "number" ? account.api_keys_limit : DEFAULT_API_KEY_LIMIT;

  const result: ApiKeysSummary = {
    keys: keys.map(toApiKeyItem),
    canCreate: activeCount < limit,
    canRevoke: true,
    integrationMode: "live",
  };
  setApiKeysSummaryCache(email, result);
  return result;
}

export async function createApiKeyForUser(input: { email: string; name?: string | null }) {
  const validName = assertValidApiKeyName(input.name);

  try {
    const { key, apiKey } = await createSelfServeKey(input.email, validName);
    invalidateApiKeysSummaryCache(input.email);
    return {
      apiKey: toApiKeyItem(key),
      secret: apiKey, // sk_live_ raw — surfaced to the client once, never stored.
    };
  } catch (error) {
    if (error instanceof SelfServeError) {
      // Surface the API's machine code; the route maps it to a status. api_key_limit_exceeded is
      // normalized to the existing api_key_limit_reached signal the UI already understands.
      throw new Error(error.code === "api_key_limit_exceeded" ? "api_key_limit_reached" : error.code);
    }
    throw error;
  }
}

// The unified model does not store a retrievable raw key (sk_live_ is shown once at creation), so
// "copy again later" is no longer possible — always report the secret as unavailable.
export async function getApiKeySecretForUser(_input: { email: string; apiKeyId: string }) {
  return { ok: false as const, error: "secret_unavailable" as const };
}

export async function revokeApiKeyForUser(input: { email: string; apiKeyId: string }) {
  try {
    await revokeSelfServeKey(input.email, input.apiKeyId);
    invalidateApiKeysSummaryCache(input.email);
    const revokedItem: ApiKeyItem = {
      id: input.apiKeyId,
      name: "",
      maskedKey: "",
      canCopy: false,
      status: "revoked",
      lastUsed: "-",
      revokedAt: new Date().toISOString(),
    };
    return { ok: true as const, apiKey: revokedItem, alreadyRevoked: false };
  } catch (error) {
    if (error instanceof SelfServeError && (error.status === 404 || error.code === "api_key_not_found")) {
      return { ok: false as const, notFound: true };
    }
    throw error;
  }
}
