# Market Marquee Snapshot (Snapshot-First)

## Architecture
- Hero market cards and market marquee read a server-side snapshot file (`data/market-marquee-snapshot.json`).
- Browser does not call private backend market or news APIs directly.
- Backend token is read only on server-side refresh execution.

## Snapshot Fields
`data/market-marquee-snapshot.json` uses a public-summary shape:
- `asOf`
- `updatedAt`
- `marketStatus` (`open` | `closed`)
- `items[]` (`label`, `value`, `changePct`, `tone`; optional display helpers)
- `summary[]`
- `news[]` (`title`, `source`, `category`, `href`)

Only summary-level fields are exposed by `GET /api/market-marquee`; no raw rows or private payloads are returned.

## News Strategy
- Hero 第二張卡片顯示「市場新聞」，資料來源為 snapshot `news[]`。
- refresh 會在 server-side 嘗試讀取 backend dataset contracts：
  - `/v2/datasets/company-news`
  - `/v2/datasets/market-news`
  - `/v2/datasets/issuer-announcements`
- 若 backend 無資料、endpoint 失敗或不可用，保留 previous snapshot news，並以 curated fallback news 補齊 4 則。
- 市場新聞目前隨 snapshot refresh 更新，來源為 curated snapshot，不是即時新聞。
- 文案以摘要語氣呈現，不宣稱即時新聞。

## Refresh API
- `POST /api/market-marquee`
  - Requires `x-refresh-secret` (match `MARKET_MARQUEE_REFRESH_SECRET` or `CRON_SECRET`)
  - Invalid secret returns `401`
  - Missing both secret envs returns `503` (`missing_refresh_secret_env`)
  - Runs refresh server-side only
- `GET /api/market-marquee`
  - Returns summary snapshot payload only (`items` / `summary` / `news`)
- `GET /api/market-marquee?refresh=1`
  - For scheduler compatibility (e.g. Vercel cron GET)
  - Requires refresh secret (`x-refresh-secret` or `Authorization: Bearer ...`)
  - Supports `MARKET_MARQUEE_REFRESH_SECRET` or `CRON_SECRET`

## Deployment Envs
Required for refresh execution:
- `BACKEND_API_BASE_URL`
- One backend auth secret: `BACKEND_API_TOKEN` (or `BACKEND_API_KEY` / `BACKEND_BEARER_TOKEN` / `STAGING_BACKEND_API_TOKEN`)
- One refresh secret: `MARKET_MARQUEE_REFRESH_SECRET` or `CRON_SECRET`

Optional:
- `MARKET_MARQUEE_SNAPSHOT_PATH`

## Refresh Window (Asia/Taipei)
Weekdays only (`Mon-Fri`):
- Market indicators: `09:00` to `13:30` refresh allowed (hourly scheduler recommended)
- Market news: after-close window `15:30` to `18:00` refresh allowed (daily scheduler recommended)
- Non-trading days (weekends): skip refresh and keep last snapshot

## Suggested Cadence
Hero market cards follow the public snapshot. They update when `data/market-marquee-snapshot.json` is refreshed.
Suggested refresh cadence: once per hour during TW market open window.

## Vercel Cron Example
`vercel.json` can schedule hourly triggers:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/market-marquee?refresh=1",
      "schedule": "0 1-5 * * 1-5"
    },
    {
      "path": "/api/market-marquee?refresh=1",
      "schedule": "0 7-10 * * 1-5"
    }
  ]
}
```

This maps to:
- `09:00`-`13:00` Asia/Taipei (market indicator window trigger)
- `15:00`-`18:00` Asia/Taipei (after-close news window trigger)

Route-level time-window checks still enforce:
- Market indicators: `09:00`-`13:30`
- News refresh: `15:30`-`18:00`

## Non-Vercel Scheduler Example
```bash
curl -X POST https://your-domain.com/api/market-marquee \
  -H "x-refresh-secret: $MARKET_MARQUEE_REFRESH_SECRET"
```
