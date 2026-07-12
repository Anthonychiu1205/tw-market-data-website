import "server-only";

import type { ApiKeyItem, ApiKeysSummary } from "@/src/lib/backend-adapter";
import {
  createSelfServeKey,
  getSelfServeAccount,
  listSelfServeKeys,
  revealSelfServeKey,
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

function getApiKeysSummaryCache(cacheKey: string) {
  const entry = apiKeysSummaryCache.get(cacheKey);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    apiKeysSummaryCache.delete(cacheKey);
    return null;
  }
  return entry.value;
}

function setApiKeysSummaryCache(cacheKey: string, value: ApiKeysSummary) {
  apiKeysSummaryCache.set(cacheKey, { value, expiresAt: Date.now() + API_KEYS_SUMMARY_CACHE_TTL_MS });
}

// Cache keys are `${email}:${limit}`, so drop every entry for this email (all plan-limit variants).
function invalidateApiKeysSummaryCache(email: string) {
  const prefix = `${email}:`;
  for (const key of apiKeysSummaryCache.keys()) {
    if (key === email || key.startsWith(prefix)) apiKeysSummaryCache.delete(key);
  }
}

// A key is "revoked" if the API marks its status revoked OR stamps revoked_at. Revoked keys never
// count toward the plan limit.
function isRevoked(key: SelfServeKey): boolean {
  return key.status === "revoked" || Boolean(key.revoked_at);
}

// Resolve the active-key limit. The plan entitlement (from the read API) is authoritative and is
// passed in by callers; null means unlimited (enterprise). Only when no plan limit is supplied do we
// fall back to the self-serve account summary, then to a conservative default. This is the fix for
// the "Developer button disabled" bug: the limit no longer silently degrades to 3 when the account
// summary lacks api_keys_limit.
function resolveKeyLimit(
  planKeyLimit: number | null | undefined,
  account: Record<string, unknown>,
): number | null {
  if (planKeyLimit !== undefined) return planKeyLimit;
  if (typeof account.api_keys_limit === "number") return account.api_keys_limit;
  return DEFAULT_API_KEY_LIMIT;
}

function toApiKeyItem(key: SelfServeKey): ApiKeyItem {
  const prefix = key.prefix ?? "";
  return {
    id: key.key_id,
    name: key.label ?? "",
    keyPrefix: prefix,
    // The list endpoint only ever returns a masked prefix; the raw sk_live_ is re-fetched on demand
    // via the reveal endpoint when the user clicks copy.
    maskedKey: prefix,
    // Copy is attempted for every active key; keys too old to reveal fall back to secret_unavailable
    // at copy time (surfaced as "regenerate to get a copyable version").
    canCopy: true,
    status: key.status,
    lastUsed: key.last_used_at ?? "-",
    createdAt: key.created_at,
    revokedAt: key.revoked_at ?? null,
  };
}

export async function getApiKeysSummaryForUser(
  email: string,
  options?: { planKeyLimit?: number | null },
): Promise<ApiKeysSummary> {
  // Cache key includes the supplied plan limit so a limit-aware caller and a limit-less one don't
  // clobber each other's result within the TTL window.
  const cacheKey = `${email}:${options?.planKeyLimit ?? "auto"}`;
  const cached = getApiKeysSummaryCache(cacheKey);
  if (cached) return cached;

  const [keys, account] = await Promise.all([
    listSelfServeKeys(email),
    getSelfServeAccount(email).catch(() => ({}) as Record<string, unknown>),
  ]);

  const activeCount = keys.filter((item) => !isRevoked(item)).length;
  const limit = resolveKeyLimit(options?.planKeyLimit, account);
  const canCreate = limit === null || activeCount < limit;

  const result: ApiKeysSummary = {
    keys: keys.map(toApiKeyItem),
    canCreate,
    canRevoke: true,
    integrationMode: "live",
    keyLimit: limit,
    createDisabledReason: canCreate
      ? null
      : `已達方案金鑰上限（${limit} 把）。請先撤銷未使用的金鑰，或升級方案以提高上限。`,
  };
  setApiKeysSummaryCache(cacheKey, result);
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

// Re-fetch the full sk_live_ via the API's reveal endpoint (encrypted-at-rest keys). Keys created
// before at-rest encryption can't be revealed — the API returns secret_unavailable / 404, which we
// pass through so the UI tells the user to regenerate.
export async function getApiKeySecretForUser(input: { email: string; apiKeyId: string }) {
  try {
    const secret = await revealSelfServeKey(input.email, input.apiKeyId);
    if (!secret) return { ok: false as const, error: "secret_unavailable" as const };
    return { ok: true as const, secret };
  } catch (error) {
    if (error instanceof SelfServeError) {
      if (error.status === 404 || error.code === "api_key_not_found" || error.code === "secret_unavailable") {
        return { ok: false as const, error: "secret_unavailable" as const };
      }
      return { ok: false as const, error: error.code };
    }
    throw error;
  }
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
