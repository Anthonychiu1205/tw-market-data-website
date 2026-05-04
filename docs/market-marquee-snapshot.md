# Market Marquee Daily Snapshot

## Flow Overview
- Source: backend dataset route `/v2/datasets/index-market-context`.
- Snapshot store: `data/market-marquee-snapshot.json` (or override by `MARKET_MARQUEE_SNAPSHOT_PATH`).
- Homepage reads **snapshot only** via `getMarketMarqueeSnapshotView()`.
- No live dataset request is triggered by homepage render.

## Snapshot Schema
```json
{
  "as_of_date": "2026-05-04",
  "updated_at": "2026-05-04T01:00:00.000Z",
  "items": [
    {
      "symbol": "TAIEX",
      "label": "加權指數",
      "value": 20500.12,
      "change": 88.4,
      "change_percent": 0.43
    }
  ]
}
```

## Refresh Entry Point (Cron/Job)
- Endpoint: `POST /api/market-marquee`
- Auth:
  - If `MARKET_MARQUEE_CRON_TOKEN` is configured, send it via `x-cron-token` (or `Authorization: Bearer ...`).
  - If not configured, refresh is only allowed in non-production.

Example:
```bash
curl -X POST "https://<site>/api/market-marquee" \
  -H "x-cron-token: <MARKET_MARQUEE_CRON_TOKEN>"
```

## Recommended Daily Refresh Time
- Suggested: **every trading day 15:10 Asia/Taipei**.
- Optional second pass: 15:30 for reconciliation.

## Failure Strategy
- If refresh fails, previous snapshot is kept.
- Homepage continues serving last successful snapshot.
- If `updated_at` is older than 36 hours, UI shows stale hint.
