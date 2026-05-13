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
