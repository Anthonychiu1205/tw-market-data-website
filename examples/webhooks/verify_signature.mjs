// TW Market Data — verify a webhook signature in Node.js using the OFFICIAL Standard Webhooks library.
//
//   npm i standardwebhooks
//
// The signature scheme is Standard Webhooks (https://www.standardwebhooks.com/): three headers
// (webhook-id, webhook-timestamp, webhook-signature), HMAC-SHA256, a 5-minute timestamp tolerance.
// You do NOT implement any crypto yourself — the library does it, and rejects a tampered body, a wrong
// secret, or a stale timestamp for you.
import { Webhook } from "standardwebhooks";

// In your HTTP handler: read the RAW request body (bytes as received — do not re-serialize) and the
// three headers. Below is a self-contained demonstration you can run directly:
//   node examples/webhooks/verify_signature.mjs

// 1) Your destination's signing secret (starts with `whsec_`). Reveal it once in the dashboard.
const SIGNING_SECRET = process.env.WEBHOOK_SIGNING_SECRET ?? "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";

// 2) A sample signed request (in production these come from the incoming HTTP request).
const wh = new Webhook(SIGNING_SECRET);
const body = JSON.stringify({
  id: "3f2b…",
  type: "revenue.announced",
  occurred_at: "2026-07-10T09:00:00Z",
  dataset: "monthly-revenue",
  symbol: "2330",
  schema_ver: 1,
  data: {
    schema_ver: 1,
    symbol: "2330",
    revenue_month: "2026-06",
    revenue: 331109,
    unit: { currency: "TWD", scale: "thousand_twd" },
    data_as_of: "2026-07-10",
    not_investment_advice: true,
  },
});
const headers = {
  "webhook-id": "3f2b…",
  "webhook-timestamp": Math.floor(Date.now() / 1000).toString(),
  "webhook-signature": wh.sign("3f2b…", new Date(), body),
};

// 3) Verify. Throws on any mismatch; returns the parsed payload on success.
try {
  const event = wh.verify(body, headers);
  console.log("verified OK:", event.type, event.data.symbol, event.data.revenue);
  // Dedupe on webhook-id (delivery is at-least-once, not ordered) before acting on the event.
} catch (err) {
  console.error("verification FAILED:", err.message);
  process.exit(1);
}
