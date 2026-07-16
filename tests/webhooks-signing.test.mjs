import test from "node:test";
import assert from "node:assert/strict";

// §A4 — the acceptance is that the OFFICIAL Standard Webhooks library verifies signatures we produce.
// We sign with our wrapper (which itself calls the official lib) and verify with a FRESH instance of
// the official Webhook class, the same way any third-party receiver (or n8n/Zapier in Phase C) would.
import { Webhook } from "standardwebhooks";
import { signWebhook } from "../src/lib/webhooks/signing.ts";
import { generateSigningSecret } from "../src/lib/webhooks/signing-secret.ts";

test("official standardwebhooks lib verifies our signature", () => {
  const secret = generateSigningSecret();
  const body = JSON.stringify({ id: "evt_1", type: "revenue.announced", data: { revenue: 331109 } });
  const now = new Date();

  const headers = signWebhook({ secret, messageId: "evt_1", timestamp: now, body });

  // Verified by the official library — NOT by our own code.
  const wh = new Webhook(secret);
  const verified = wh.verify(body, headers);
  assert.equal(verified.id, "evt_1");
  assert.equal(headers["webhook-id"], "evt_1");
  assert.match(headers["webhook-signature"], /^v1,/);
});

test("official lib rejects a tampered body", () => {
  const secret = generateSigningSecret();
  const body = JSON.stringify({ amount: 100 });
  const headers = signWebhook({ secret, messageId: "evt_2", timestamp: new Date(), body });

  const tampered = JSON.stringify({ amount: 999 });
  const wh = new Webhook(secret);
  assert.throws(() => wh.verify(tampered, headers));
});

test("official lib rejects a stale timestamp (5-min tolerance)", () => {
  const secret = generateSigningSecret();
  const body = JSON.stringify({ ok: true });
  const stale = new Date(Date.now() - 10 * 60 * 1000); // 10 min ago > 5 min tolerance
  const headers = signWebhook({ secret, messageId: "evt_3", timestamp: stale, body });

  const wh = new Webhook(secret);
  assert.throws(() => wh.verify(body, headers), /timestamp too old/i);
});

test("a different secret does not verify", () => {
  const body = JSON.stringify({ ok: true });
  const headers = signWebhook({ secret: generateSigningSecret(), messageId: "evt_4", timestamp: new Date(), body });
  const wh = new Webhook(generateSigningSecret());
  assert.throws(() => wh.verify(body, headers));
});
