"""TW Market Data — verify a webhook signature in Python using the OFFICIAL Standard Webhooks library.

    pip install standardwebhooks

Standard Webhooks (https://www.standardwebhooks.com/): three headers (webhook-id, webhook-timestamp,
webhook-signature), HMAC-SHA256, a 5-minute timestamp tolerance. The library does the crypto and raises
on a tampered body / wrong secret / stale timestamp — never hand-roll HMAC yourself.

In your handler, pass the RAW request body (bytes as received, not re-serialized) and the headers.
Run this self-contained demo directly:

    python examples/webhooks/verify_signature.py
"""
import os
import json
from datetime import datetime, timezone

from standardwebhooks import Webhook

# 1) Your destination's signing secret (starts with `whsec_`). Reveal it once in the dashboard.
SIGNING_SECRET = os.environ.get("WEBHOOK_SIGNING_SECRET", "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw")

wh = Webhook(SIGNING_SECRET)

# 2) A sample signed request (in production these come from the incoming HTTP request).
body = json.dumps(
    {
        "id": "3f2b…",
        "type": "revenue.announced",
        "occurred_at": "2026-07-10T09:00:00Z",
        "dataset": "monthly-revenue",
        "symbol": "2330",
        "schema_ver": 1,
        "data": {
            "schema_ver": 1,
            "symbol": "2330",
            "revenue_month": "2026-06",
            "revenue": 331109,
            "unit": {"currency": "TWD", "scale": "thousand_twd"},
            "data_as_of": "2026-07-10",
            "not_investment_advice": True,
        },
    },
    separators=(",", ":"),
)
now = datetime.now(timezone.utc)
headers = {
    "webhook-id": "3f2b…",
    "webhook-timestamp": str(int(now.timestamp())),
    "webhook-signature": wh.sign("3f2b…", now, body),
}

# 3) Verify. Raises on any mismatch; returns the parsed payload on success.
try:
    event = wh.verify(body, headers)
    print("verified OK:", event["type"], event["data"]["symbol"], event["data"]["revenue"])
    # Dedupe on webhook-id (delivery is at-least-once, not ordered) before acting on the event.
except Exception as err:  # WebhookVerificationError
    print("verification FAILED:", err)
    raise SystemExit(1)
