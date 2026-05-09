# TW Market Data Public API Gateway Guide

此文件描述 public API gateway（`/v2/datasets/*`）的正式使用方式、錯誤碼與 credits 模式。

## Authentication

### 使用方式

- 所有 public API 請求都使用 header：`X-API-Key`。
- API key 由 Dashboard 建立（`/dashboard` → API 金鑰）。
- API key 與網站伺服器對 backend 使用的 internal token 不同：
  - customer request：`X-API-Key: twmd_live_...`
  - website server → backend：`BACKEND_API_TOKEN`（server-only，不對客戶暴露）

### 建立與撤銷

- 可在 Dashboard 建立、列出、撤銷 API key。
- 新版 key 支援再次複製（`encryptedSecret`），舊版 hash-only key 可能無法再次顯示完整值。
- 撤銷後立即失效。

### API key 安全注意事項

- 不要把 key 放在前端可公開程式碼庫。
- 不要把 key 寫進 client log、error log、analytics event。
- 若疑似外洩，請立刻撤銷並重建。

## Requests

### 基本 endpoint

- `GET /v2/datasets/twse-daily-price`

### 常用 query params

- `symbol`：股票代號（例如 `2330`）
- `limit`：筆數上限
- `start_date`：起始日期（`YYYY-MM-DD`）
- `end_date`：結束日期（`YYYY-MM-DD`）

### cURL

```bash
curl \
  -H "X-API-Key: twmd_live_xxx" \
  "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=1"
```

### JavaScript (fetch)

```js
const response = await fetch(
  "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=1",
  {
    headers: {
      "X-API-Key": "twmd_live_xxx",
    },
  },
);

const requestId = response.headers.get("X-Request-Id");
const dryRun = response.headers.get("X-TWMD-Dry-Run");
const creditsCost = response.headers.get("X-TWMD-Credits-Cost");
const creditsCharged = response.headers.get("X-TWMD-Credits-Charged");

const body = await response.json();
console.log({ status: response.status, requestId, dryRun, creditsCost, creditsCharged, body });
```

### Python (requests)

```python
import requests

resp = requests.get(
    "https://twmarketdata.com/v2/datasets/twse-daily-price",
    params={"symbol": "2330", "limit": 1},
    headers={"X-API-Key": "twmd_live_xxx"},
    timeout=10,
)

request_id = resp.headers.get("X-Request-Id")
dry_run = resp.headers.get("X-TWMD-Dry-Run")
credits_cost = resp.headers.get("X-TWMD-Credits-Cost")
credits_charged = resp.headers.get("X-TWMD-Credits-Charged")

print(resp.status_code, request_id, dry_run, credits_cost, credits_charged)
print(resp.json())
```

## Credits

### 模式說明

- 預設：**試算模式（dry-run）**
  - `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=false`
  - 會回傳 estimated credits，但不會正式扣點。
- 正式扣點模式（需明確啟用）：
  - `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=true`
  - production 還需要：`PUBLIC_API_CREDITS_DEDUCTION_PRODUCTION_CONFIRM=true`

若 production 只開第一個 flag，系統會安全降級為 dry-run，避免誤開正式扣點。

### Usage / Credits ledger

- 每次 request 會寫入 `ApiUsageEvent`（含 `requestId`、status、credits 欄位）。
- Credits 交易（`CreditTransaction`）類型：
  - `purchase`
  - `usage`
  - `adjustment`

### insufficient credits

當正式扣點模式啟用且餘額不足時，回：`402 insufficient_credits`。

## Response Headers

| Header | Meaning |
|---|---|
| `X-Request-Id` | request trace id，用於客服/偵錯追查 |
| `X-TWMD-Dry-Run` | `true`=試算模式，`false`=正式扣點模式 |
| `X-TWMD-Credits-Cost` | 此次 request 的估算/計價 credits |
| `X-TWMD-Credits-Charged` | 實際扣點 credits（只在正式扣點模式、且成功扣點時出現） |
| `X-TWMD-Plan` | gateway 解析後的方案（例如 `free` / `developer` / `pro`） |
| `X-TWMD-Cache` | gateway cache 狀態（`HIT` / `MISS` / `STALE`） |
| `X-TWMD-Cache-Age` | 快取資料齡（毫秒） |

補充：
- dry-run 模式通常有 `X-TWMD-Credits-Cost`，`X-TWMD-Credits-Charged` 可省略。
- deduction 模式 2xx 成功且完成扣點時，會帶 `X-TWMD-Credits-Charged`。
- dry-run mode 啟用短 TTL in-memory cache（預設 30 秒）與 stale-while-revalidate（預設最大 5 分鐘）。

### Public API cache semantics

- 僅在 dry-run mode 的 `GET` + `200` response 會短暫快取。
- deduction mode（正式扣點）預設 bypass cache。
- auth / entitlement / dataset not found / upstream error 等錯誤回應不會被快取為 `HIT`。
- `X-TWMD-Cache`：
  - `MISS`：本次回應來自 upstream
  - `HIT`：命中新鮮快取
  - `STALE`：回傳 stale，並在背景 refresh
- `X-TWMD-Cache-Age`：快取資料齡（毫秒）

## Errors

所有 gateway 錯誤都使用統一格式：

```json
{
  "error": {
    "code": "...",
    "message": "..."
  },
  "requestId": "..."
}
```

### 401 invalid_api_key

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key."
  },
  "requestId": "..."
}
```

### 402 insufficient_credits

```json
{
  "error": {
    "code": "insufficient_credits",
    "message": "Insufficient credits."
  },
  "requestId": "..."
}
```

### 403 plan_not_entitled

```json
{
  "error": {
    "code": "plan_not_entitled",
    "message": "Current plan is not entitled for this dataset."
  },
  "requestId": "..."
}
```

### 404 dataset_not_found

```json
{
  "error": {
    "code": "dataset_not_found",
    "message": "Dataset not found."
  },
  "requestId": "..."
}
```

### 502 upstream_error

```json
{
  "error": {
    "code": "upstream_error",
    "message": "Upstream service error."
  },
  "requestId": "..."
}
```

### 504 upstream_timeout

```json
{
  "error": {
    "code": "upstream_timeout",
    "message": "Upstream request timed out."
  },
  "requestId": "..."
}
```

### 500 internal_error

```json
{
  "error": {
    "code": "internal_error",
    "message": "Internal service error."
  },
  "requestId": "..."
}
```

### 429 rate_limit_exceeded（future）

目前尚未啟用 production rate limiting，`429` 為規劃中的 future support。

## Request Tracing

- 每次 request 會有 `X-Request-Id`。
- 發生問題時，請提供：
  - `requestId`
  - 請求時間
  - dataset slug
  - HTTP status
- support/debug 可用此 ID 在 usage ledger 與後端 log 追查。

## Usage & Billing

- Usage page 會顯示最近 request、狀態、credits（試算或已扣）。
- Credits page 會顯示 wallet balance 與交易紀錄。
- 在 dry-run 模式下，請以「estimated credits」理解 usage 指標。

## SDK Preview (Local)

目前提供 local/dev preview SDK skeleton，尚未發布到 PyPI/npm。

- Python SDK: `packages/python-sdk`
- JavaScript SDK: `packages/js-sdk`

### Python quickstart

```python
from twmarketdata import TWMarketDataClient

client = TWMarketDataClient(api_key="twmd_live_xxx")
result = client.twse_daily_price(symbol="2330", limit=1)

print(result.meta.request_id)
print(result.meta.dry_run)
print(result.meta.credits_cost)
print(result.data)
```

### JavaScript / TypeScript quickstart

```ts
import { TWMarketDataClient } from "@twmarketdata/sdk";

const client = new TWMarketDataClient({ apiKey: "twmd_live_xxx" });
const result = await client.twseDailyPrice({ symbol: "2330", limit: 1 });

console.log(result.meta.requestId);
console.log(result.meta.dryRun);
console.log(result.meta.creditsCost);
console.log(result.data);
```

### SDK error mapping

- `401` / `invalid_api_key` -> `AuthenticationError`
- `403` / `plan_not_entitled` -> `EntitlementError`
- `402` / `insufficient_credits` -> `InsufficientCreditsError`
- `404` / `dataset_not_found` -> `DatasetNotFoundError`
- `429` / `rate_limit_exceeded` -> `RateLimitError`
- `502` / `504` / `upstream_*` -> `UpstreamError`

## Reconciliation & Operations

### Usage / Credits 對帳概念

- 對帳會比對：
  - `ApiUsageEvent`（request ledger）
  - `CreditTransaction(type=usage)`（實際扣點交易）
  - `CreditWallet.balance`
- 主要檢查：
  - `usage events` 計價總額 vs `usage transactions` 總額
  - `requestId` 是否有對應 usage transaction
  - 是否出現 orphan event / orphan transaction / duplicate usage transaction

### Request tracing

- 每筆 gateway 請求都應帶 `X-Request-Id`。
- Dashboard usage table 可複製 requestId，用於 support/debug。
- 若需追查單筆，優先提供：
  - `requestId`
  - dataset
  - status code
  - request time（UTC+8）

### Wallet integrity check script

```bash
npm run check:wallet-integrity
```

- 需 `DATABASE_URL`，否則自動 `SKIPPED`。
- 只讀檢查，不修改資料庫。
- 輸出摘要：
  - total users checked
  - negative balances
  - mismatches
  - duplicate requestId usage transactions
  - duplicate merchantTradeNo

### Seed wallet test flow（測試用）

```bash
npm run seed:test-wallet
```

- 僅在以下 env 皆設定時執行：
  - `DATABASE_URL`
  - `SEED_WALLET_USER_EMAIL`
  - `SEED_WALLET_CREDITS`
  - `CONFIRM_SEED_TEST_WALLET=true`
- 會建立 `adjustment` 交易供測試，不會觸發 ECPay。

### Usage CSV export（optional）

```bash
npm run export:usage-csv
```

- 匯出最近 usage events 到：
  - `artifacts/usage_export_<date>.csv`
- 欄位：
  - `requestId`, `dataset`, `status`, `credits`, `latencyMs`, `createdAt`

## Supported Datasets (Current Gateway)

| Dataset slug | Required plan | Credits cost / request | Example | Common errors |
|---|---|---:|---|---|
| `twse-daily-price` | `free` | 1 | `GET /v2/datasets/twse-daily-price?symbol=2330&limit=1` | `401`, `404`, `502`, `504` |
| `tpex-daily-price` | `free` | 1 | `GET /v2/datasets/tpex-daily-price?symbol=8069&limit=1` | `401`, `404`, `502`, `504` |
| `issuer-profile` | `free` | 1 | `GET /v2/datasets/issuer-profile?symbol=2330` | `401`, `404`, `502`, `504` |
| `adjusted-prices` | `free` | 2 | `GET /v2/datasets/adjusted-prices?symbol=2330&limit=5` | `401`, `404`, `502`, `504` |
| `technical-indicators` | `developer` | 3 | `GET /v2/datasets/technical-indicators?symbol=2330&limit=20` | `401`, `403`, `404`, `502`, `504` |
| `valuation-data` | `developer` | 2 | `GET /v2/datasets/valuation-data?symbol=2330&limit=20` | `401`, `403`, `404`, `502`, `504` |
| `monthly-revenue` | `developer` | 3 | `GET /v2/datasets/monthly-revenue?symbol=2330&limit=12` | `401`, `403`, `404`, `502`, `504` |

## Future Features (Planned)

以下為規劃中，尚未正式提供：

- Rate limits / 429 enforcement
- Batch query
- Streaming / websocket delivery
- Enterprise-only datasets 與更細緻 entitlement
- Webhook events

## Product Analytics（PostHog-first）

我們僅做 product analytics 與 onboarding analytics，不做廣告 tracking。

- 不使用 Meta Pixel / TikTok Pixel
- 不做 invasive session replay
- 不出售資料

### Event taxonomy

- `auth_signup`
- `auth_login_success`
- `api_key_created`
- `api_key_copied`
- `api_key_revoked`
- `api_request_success`
- `api_request_first_success`
- `api_request_upstream_timeout`
- `api_request_upstream_error`
- `pricing_viewed`
- `pricing_upgrade_clicked`
- `sdk_docs_viewed`
- `mcp_docs_viewed`
- `help_center_viewed`

### Payload safety

- 不送 raw API key、token、password、secret
- requestId 可用於追蹤
- userId 會以 mask/hash 方式處理
- analytics fail 不影響登入、付款或 API 主流程

### Consent（輕量）

- essential cookies 永遠啟用
- product analytics 可在前端提示中選擇關閉
- 不使用廣告類別 cookies

### Debug mode

- `NEXT_PUBLIC_ANALYTICS_DEBUG=true` 時，會在 console 顯示 `[analytics]` 事件摘要
- production 建議維持 `false`

## Environment Checklist

- `AUTH_SECRET`
- `API_KEY_HASH_SECRET`
- `API_KEY_ENCRYPTION_SECRET`
- `POSTHOG_API_KEY`（可選；未設定時維持本地 abstraction，不阻塞主流程）
- `POSTHOG_HOST`（預設 `https://us.i.posthog.com`）
- `NEXT_PUBLIC_ANALYTICS_ENABLED`（預設 true）
- `NEXT_PUBLIC_ANALYTICS_DEBUG`（預設 false）
- `BACKEND_API_BASE_URL`
- `BACKEND_API_TOKEN`（或專案採用的 internal backend token env）
- `BACKEND_FETCH_TIMEOUT_MS`（dashboard 建議 2500）
- `BACKEND_SUMMARY_CACHE_TTL_MS`（dashboard summary cache，預設 10000）
- `PUBLIC_API_UPSTREAM_TIMEOUT_MS`（gateway 建議 8000）
- `PUBLIC_API_CACHE_TTL_MS`（gateway cache TTL，預設 30000）
- `PUBLIC_API_CACHE_MAX_STALE_MS`（gateway stale window，預設 300000）
- `PUBLIC_API_CACHE_MAX_ENTRIES`（gateway cache entry 上限，預設 800）
- `PUBLIC_API_CREDITS_DEDUCTION_ENABLED`（預設 false）
- `PUBLIC_API_CREDITS_DEDUCTION_PRODUCTION_CONFIRM`（預設 false）

## AI Agent Preview（Local/Dev）

目前提供 AI agent-ready skeleton（preview）：

- MCP server skeleton：`packages/mcp-server`
- Tool manifest：`ai-tools/twmd_tools.json`
- Agent examples：`examples/agents`

### 目標

- 讓 agent 直接以工具方式呼叫 `/v2/datasets/*`
- 保留 request tracing：`X-Request-Id`
- 回傳 credits metadata：`X-TWMD-Dry-Run`、`X-TWMD-Credits-Cost`、`X-TWMD-Credits-Charged`、`X-TWMD-Plan`

### 注意事項

- 此區塊僅 local/dev preview，未發布 npm/PyPI/MCP hosted service。
- 不要在程式碼庫放入真實 API key。
- customer `X-API-Key` 與 backend `BACKEND_API_TOKEN` 是不同憑證。
