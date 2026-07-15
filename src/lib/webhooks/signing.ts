import "server-only";

import { Webhook } from "standardwebhooks";

// §A4 — Standard Webhooks, NOT self-invented crypto. We sign with the official `standardwebhooks`
// library (the same package receivers use to verify, and the format n8n/Zapier consume in Phase C).
// The signed content is `${webhook-id}.${webhook-timestamp}.${body}` over HMAC-SHA256; the library
// owns that construction so our push and a receiver's verify() cannot drift.
//
// Headers we emit (Standard Webhooks unbranded set):
//   webhook-id         — the message id (== outbox event_id; receivers dedupe on it, at-least-once §A3)
//   webhook-timestamp  — unix seconds; receivers enforce a 5-minute tolerance
//   webhook-signature  — `v1,<base64 hmac>`

export const WEBHOOK_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

export type SignedWebhookHeaders = {
  "webhook-id": string;
  "webhook-timestamp": string;
  "webhook-signature": string;
  "content-type": "application/json";
  "user-agent": string;
};

const USER_AGENT = "TWMarketData-Webhooks/1";

export function signWebhook(input: {
  secret: string; // the raw whsec_ signing secret (decrypted just-in-time by the worker)
  messageId: string; // outbox event_id
  timestamp: Date;
  body: string; // the exact JSON string that will be sent as the request body
}): SignedWebhookHeaders {
  const wh = new Webhook(input.secret);
  const signature = wh.sign(input.messageId, input.timestamp, input.body);
  return {
    "webhook-id": input.messageId,
    "webhook-timestamp": Math.floor(input.timestamp.getTime() / 1000).toString(),
    "webhook-signature": signature,
    "content-type": "application/json",
    "user-agent": USER_AGENT,
  };
}
