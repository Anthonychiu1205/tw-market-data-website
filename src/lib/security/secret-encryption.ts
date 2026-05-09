import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ENCRYPTION_VERSION = "v1";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function resolveEncryptionSecret() {
  const explicit = process.env.API_KEY_ENCRYPTION_SECRET?.trim();
  if (explicit) return explicit;

  if (process.env.NODE_ENV === "production") {
    throw new Error("api_key_encryption_secret_missing");
  }

  const fallback = process.env.AUTH_SECRET?.trim();
  if (fallback) return fallback;

  throw new Error("api_key_encryption_secret_missing");
}

function deriveKey(secret: string) {
  const key = createHash("sha256").update(secret).digest();
  if (key.byteLength !== 32) {
    throw new Error("api_key_encryption_key_invalid");
  }
  return key;
}

function assertSecretStrength(secret: string) {
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("api_key_encryption_secret_too_short");
  }
}

export function encryptSecret(plainText: string) {
  const secret = resolveEncryptionSecret();
  assertSecretStrength(secret);

  const key = deriveKey(secret);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTION_VERSION,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

export function decryptSecret(encryptedPayload: string) {
  const secret = resolveEncryptionSecret();
  assertSecretStrength(secret);

  const parts = encryptedPayload.split(":");
  if (parts.length !== 4) {
    throw new Error("api_key_encryption_payload_invalid");
  }

  const [version, ivRaw, authTagRaw, cipherTextRaw] = parts;
  if (version !== ENCRYPTION_VERSION) {
    throw new Error("api_key_encryption_version_unsupported");
  }

  const iv = Buffer.from(ivRaw, "base64url");
  const authTag = Buffer.from(authTagRaw, "base64url");
  const cipherText = Buffer.from(cipherTextRaw, "base64url");

  if (iv.byteLength !== IV_LENGTH || authTag.byteLength !== 16 || cipherText.byteLength === 0) {
    throw new Error("api_key_encryption_payload_invalid");
  }

  const key = deriveKey(secret);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const plainText = Buffer.concat([decipher.update(cipherText), decipher.final()]).toString("utf8");
  if (!plainText) {
    throw new Error("api_key_encryption_decrypt_failed");
  }

  return plainText;
}

export function getEncryptionVersion() {
  return ENCRYPTION_VERSION;
}
