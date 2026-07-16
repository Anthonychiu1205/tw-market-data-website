import "server-only";

import { randomBytes } from "node:crypto";

import { encryptSecret, decryptSecret, getEncryptionVersion } from "@/src/lib/security/secret-encryption";

// The signing secret follows the SAME key-reveal chain as API keys (§A2): generated once, stored only
// AES-256-GCM-encrypted (encryptedSigningSecret), and revealed to the account only through the throttled
// reveal endpoint — never logged, never returned by a list call. Rotation issues a fresh secret and
// re-encrypts; the old value is overwritten.
//
// Format is Standard-Webhooks native: `whsec_<base64(32 random bytes)>`. The base64 body is the HMAC
// key; the official `standardwebhooks` library accepts this string verbatim (it strips the whsec_
// prefix), which is why we store the whole prefixed string as the plaintext secret.

const SIGNING_SECRET_PREFIX = "whsec_";
const SIGNING_SECRET_BYTES = 32;

export function generateSigningSecret(): string {
  return SIGNING_SECRET_PREFIX + randomBytes(SIGNING_SECRET_BYTES).toString("base64");
}

export function encryptSigningSecret(rawSecret: string): { encrypted: string; version: string } {
  return { encrypted: encryptSecret(rawSecret), version: getEncryptionVersion() };
}

export function decryptSigningSecret(encrypted: string): string {
  return decryptSecret(encrypted);
}

// A stable, non-secret fingerprint for display ("whsec_…AbCd") — lets a user tell two secrets apart in
// the UI without ever revealing the key. Never derive the HMAC from this.
export function signingSecretHint(rawSecret: string): string {
  const body = rawSecret.startsWith(SIGNING_SECRET_PREFIX)
    ? rawSecret.slice(SIGNING_SECRET_PREFIX.length)
    : rawSecret;
  const tail = body.slice(-4);
  return `${SIGNING_SECRET_PREFIX}…${tail}`;
}
