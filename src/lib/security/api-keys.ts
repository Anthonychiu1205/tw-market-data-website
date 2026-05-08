import "server-only";

import { createHash, randomBytes } from "crypto";

const API_KEY_PREFIX = "twmd_live_";
const API_KEY_MASK_SUFFIX = "••••••••";
const API_KEY_RANDOM_LENGTH = 32;

function normalizeHashSecret() {
  const explicitSecret = process.env.API_KEY_HASH_SECRET?.trim();
  if (explicitSecret) {
    return explicitSecret;
  }

  const authSecret = process.env.AUTH_SECRET?.trim();
  if (authSecret) {
    return authSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("api_key_hash_secret_missing");
  }

  return "dev-only-api-key-hash-secret";
}

function normalizeApiKeyRandomPart(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, "").slice(0, API_KEY_RANDOM_LENGTH);
}

export function generateApiKey() {
  let randomPart = "";
  while (randomPart.length < API_KEY_RANDOM_LENGTH) {
    randomPart = normalizeApiKeyRandomPart(`${randomPart}${randomBytes(24).toString("base64url")}`);
  }

  return `${API_KEY_PREFIX}${randomPart}`;
}

export function hashApiKey(rawKey: string) {
  const secret = normalizeHashSecret();
  return createHash("sha256").update(`${secret}:${rawKey}`).digest("hex");
}

export function getApiKeyPrefix(rawKey: string) {
  const trimmed = rawKey.trim();
  return trimmed.slice(0, Math.min(20, trimmed.length));
}

export function maskApiKey(prefix: string) {
  return `${prefix}${API_KEY_MASK_SUFFIX}`;
}

export function assertValidApiKeyName(name: string | null | undefined) {
  const normalized = (name ?? "").trim();

  if (!normalized) {
    throw new Error("invalid_api_key_name");
  }

  if (normalized.length > 40) {
    throw new Error("invalid_api_key_name");
  }

  return normalized;
}

