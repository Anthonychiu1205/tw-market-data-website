# AI Research Local Mock API Proxy Implementation (W4-E)

## 1. Executive Summary

- W4-E 實作 local-only internal proxy：`POST /api/ai-research/mock-ticker`。
- 目的是讓 `/dashboard/ai-research` 在開發環境可透過 website internal route 呼叫 tw-ai mock endpoint。
- 仍保留本地 deterministic mock fallback。
- 不做 production proxy、不做 auth/credits/billing/DB 變更。

## 2. Route

- Path: `POST /api/ai-research/mock-ticker`
- Request:

```json
{
  "ticker": "2330",
  "as_of_date": "2026-05-13",
  "mode": "mock",
  "include_simulation": true
}
```

- 若 proxy 可用：
  - 回傳 `{ ok: true, source: "tw_ai_mock_proxy", data: <tw-ai envelope> }`
- 若 proxy 不可用或失敗：
  - 回傳 `{ ok: false, reason: "...", fallback_required: true }`

## 3. Env Flags

- server-side:
  - `AI_RESEARCH_MOCK_PROXY_ENABLED=true`
  - `AI_RESEARCH_MOCK_API_BASE_URL=http://127.0.0.1:8010`
- client-side feature flag:
  - `NEXT_PUBLIC_AI_RESEARCH_MOCK_PROXY_ENABLED=true`

備註：
- proxy 預設關閉。
- 未設定時 dashboard 仍使用本地 deterministic mock。

## 4. Safety Validation

proxy 會檢查 tw-ai 回應 safety flags：

- `broker_execution === false`
- `simulation_only === true`
- `not_investment_advice === true`

若不符合，轉為 fallback，不直接透傳不安全回應。

## 5. Dashboard Fallback

- 使用者點「執行研究」時：
  1. 若 client flag 關閉：直接本地 mock。
  2. 若 client flag 開啟：呼叫 internal proxy。
  3. proxy 回 `fallback_required` 或 fetch 失敗：回退本地 mock。
- UI 會顯示資料來源狀態：
  - `本地 mock`
  - `tw-ai mock proxy`
  - `proxy unavailable, using local mock`

## 6. Boundaries

- browser 不直接呼叫 tw-ai。
- client 不暴露 tw-ai backend URL。
- 不改 auth。
- 不改 entitlement。
- 不改 credits / billing。
- 不改 DB。
- 不部署。

## 7. Next Step

- W4-F：local proxy + tw-ai FastAPI end-to-end smoke（本機同時啟動 tw-ai server）。

## 8. W4-F Smoke Checklist

### Step 1: Start tw-ai mock server (read-only repo)

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-investment-research
PYTHONPATH=src /tmp/tw-ai-ir-py311/bin/python -m uvicorn \
  tw_ai_investment_research.api.research_firm_app:app \
  --host 127.0.0.1 \
  --port 8010
```

Direct smoke:

```bash
curl -s -X POST http://127.0.0.1:8010/v1/research/ticker \
  -H "Content-Type: application/json" \
  -d '{"ticker":"2330","as_of_date":"2026-05-13","mode":"mock","include_simulation":true}'
```

Expected safety flags:

- `broker_execution=false`
- `simulation_only=true`
- `not_investment_advice=true`
- `research.analysts[0].analyst_role=market_data`
- `research.analysts[0].output_status=mock_real`

### Step 2: Start website with proxy env flags

```bash
cd /Volumes/DEV_USB/Projects/tw-market-data-website
AI_RESEARCH_MOCK_PROXY_ENABLED=true \
AI_RESEARCH_MOCK_API_BASE_URL=http://127.0.0.1:8010 \
NEXT_PUBLIC_AI_RESEARCH_MOCK_PROXY_ENABLED=true \
npm run dev
```

### Step 3: Smoke internal proxy route

```bash
curl -s -X POST http://127.0.0.1:3001/api/ai-research/mock-ticker \
  -H "Content-Type: application/json" \
  -d '{"ticker":"2330","as_of_date":"2026-05-13","mode":"mock","include_simulation":true}'
```

Expected:

- `ok=true`
- `source="tw_ai_mock_proxy"`
- `data.broker_execution=false`
- `data.simulation_only=true`
- `data.not_investment_advice=true`

### Step 4: Fallback behavior check

If proxy base URL is unreachable or proxy disabled, internal route should return:

- `ok=false`
- `fallback_required=true`
- reason like `proxy_disabled` or `proxy_unavailable`
- no stack trace / no secrets

### Step 5: Dashboard access check

- login success via `/api/auth/password-login`
- authenticated `/dashboard/ai-research` returns `200`
- route remains usable even when proxy falls back

### W4-F Boundaries

- no production use
- no deployment
- no push
- no auth/billing/credits/DB logic changes
- browser never calls tw-ai directly

## 9. W4-G Proxy Mode UX Polish

- dashboard 新增克制版「資料來源狀態」呈現，支援三種模式：
  - `本地 mock`
  - `tw-ai mock proxy`
  - `proxy 不可用，已切回本地 mock`
- 狀態區塊僅顯示必要文字與 badge，不顯示 backend URL / env / stack trace。
- 「執行研究」按鈕在處理中會顯示 `執行中...` 並短暫 disabled。
- proxy 成功或 fallback 後皆會更新來源狀態，避免誤解目前資料來源。
- 本輪仍不代表 production integration，且無 auth/credits/billing/DB 變更。
