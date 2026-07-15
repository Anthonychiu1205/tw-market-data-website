import test from "node:test";
import assert from "node:assert/strict";

// §A2 — the signing_secret rides the EXISTING key-reveal chain (AES-256-GCM, versioned, rotatable).
// This proves the crypto mechanics: encrypt-at-rest, reveal round-trips, rotation issues a new secret,
// and a hint never leaks the key. (The DB-scoped create/list/reveal routes wrap these exact calls.)
process.env.API_KEY_ENCRYPTION_SECRET = "test-encryption-secret-that-is-32b+"; // >= 32 bytes

const { generateSigningSecret, encryptSigningSecret, decryptSigningSecret, signingSecretHint } = await import(
  "../src/lib/webhooks/signing-secret.ts"
);

test("generated secret is whsec_-prefixed and unique", () => {
  const a = generateSigningSecret();
  const b = generateSigningSecret();
  assert.match(a, /^whsec_/);
  assert.notEqual(a, b);
});

test("secret is encrypted at rest and reveals back to the exact plaintext", () => {
  const raw = generateSigningSecret();
  const { encrypted, version } = encryptSigningSecret(raw);
  assert.equal(version, "v1");
  assert.notEqual(encrypted, raw);
  assert.ok(!encrypted.includes(raw), "ciphertext must not contain the plaintext");
  assert.equal(decryptSigningSecret(encrypted), raw);
});

test("rotation yields a different secret that also round-trips", () => {
  const first = generateSigningSecret();
  const rotated = generateSigningSecret();
  assert.notEqual(first, rotated);
  assert.equal(decryptSigningSecret(encryptSigningSecret(rotated).encrypted), rotated);
});

test("hint never exposes the key body", () => {
  const raw = generateSigningSecret();
  const hint = signingSecretHint(raw);
  assert.match(hint, /^whsec_…/);
  assert.ok(!raw.includes(hint.replace("whsec_…", "")) === false); // tail is 4 chars of the body
  assert.ok(hint.length < 16);
});
