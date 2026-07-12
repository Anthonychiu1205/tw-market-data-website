import "server-only";

// LEGACY (P0 key-system unification): this authenticates `twmd_live_` keys against the website's
// local Prisma `ApiKey` table — the OLD system. New keys are `sk_live_` in the API's
// read_api_api_keys (issued via self-serve) and authenticate directly at api.twmarketdata.com; they
// are NOT in this table. This path now only serves the legacy `/v2` datasets PROXY
// (app/v2/datasets/[dataset]/route.ts) for pre-migration twmd_live_ keys. Retire together with that
// proxy route once it is confirmed dead (spec §4 — "另議").
import { prisma } from "@/src/lib/auth/prisma";
import { GatewayHttpError } from "@/src/lib/gateway/errors";
import { hashApiKey } from "@/src/lib/security/api-keys";

const LAST_USED_UPDATE_WINDOW_MS = 5 * 60 * 1000;
const API_KEY_PATTERN = /^twmd_live_[A-Za-z0-9]{20,}$/;

export type GatewayAuthContext = {
  apiKeyId: string;
  userId: string;
  userEmail: string | null;
  keyPrefix: string;
};

export function parseApiKeyFromRequest(request: Request) {
  const headerValue = request.headers.get("x-api-key");
  if (!headerValue) {
    throw new GatewayHttpError(401, "missing_api_key");
  }

  const normalized = headerValue.trim();
  if (!API_KEY_PATTERN.test(normalized)) {
    throw new GatewayHttpError(401, "invalid_api_key");
  }

  return normalized;
}

export async function authenticateApiKey(request: Request): Promise<GatewayAuthContext> {
  const rawApiKey = parseApiKeyFromRequest(request);
  const keyHash = hashApiKey(rawApiKey);

  let apiKey: {
    id: string;
    userId: string;
    status: string;
    keyPrefix: string;
    lastUsedAt: Date | null;
    user: { email: string | null };
  } | null = null;
  try {
    apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      select: {
        id: true,
        userId: true,
        status: true,
        keyPrefix: true,
        lastUsedAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  } catch {
    throw new GatewayHttpError(503, "api_key_lookup_unavailable", undefined, {
      stage: "api_key_auth",
    });
  }

  if (!apiKey) {
    throw new GatewayHttpError(401, "invalid_api_key");
  }

  if (apiKey.status !== "active") {
    throw new GatewayHttpError(403, "api_key_revoked", undefined, {
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      stage: "api_key_auth",
    });
  }

  const now = Date.now();
  const shouldUpdateLastUsed =
    !apiKey.lastUsedAt || now - apiKey.lastUsedAt.getTime() >= LAST_USED_UPDATE_WINDOW_MS;

  if (shouldUpdateLastUsed) {
    void prisma.apiKey
      .update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date(now) },
      })
      .catch(() => {
        // best effort: auth should not fail on lastUsedAt write issue
      });
  }

  return {
    apiKeyId: apiKey.id,
    userId: apiKey.userId,
    userEmail: apiKey.user.email ?? null,
    keyPrefix: apiKey.keyPrefix,
  };
}
