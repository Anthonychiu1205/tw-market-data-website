import "server-only";

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
    throw new GatewayHttpError(401, "invalid_api_key");
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
    throw new GatewayHttpError(500, "internal_error", "API key lookup failed.", {
      stage: "auth_lookup",
    });
  }

  if (!apiKey) {
    throw new GatewayHttpError(401, "invalid_api_key");
  }

  if (apiKey.status !== "active") {
    throw new GatewayHttpError(403, "api_key_revoked", undefined, {
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      stage: "auth_lookup",
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
