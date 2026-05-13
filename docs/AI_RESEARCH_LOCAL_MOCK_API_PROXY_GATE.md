# AI Research Local Mock API Proxy Gate

## 1. Executive Summary

- W4-D 是 local mock API proxy implementation gate。
- 本輪不實作 proxy。
- 目標是決定下一輪是否允許 website 建立 local-only proxy 連到 tw-ai mock endpoint。
- AI Research 仍是 TW Market Data 的 Pro+ bonus feature。
- 本輪不接 production backend。

## 2. Current Website State

- `/dashboard/ai-research` 已存在。
- 目前使用本地 deterministic mock response（互動式 ticker/date）。
- 無 backend call。
- 無 API proxy。
- 無 server action。
- 無 billing / auth / credits 行為變更。
- 路由仍由 dashboard auth guard 保護。

## 3. Current tw-ai Mock API State

- FastAPI endpoint：`POST /v1/research/ticker`。
- mode 只支援 `mock`。
- 回傳既有 API envelope。
- `research.analysts` 包含 `market_data` analyst（`mock_real`）。
- 無 DB / provider / LLM / broker / ResearchRunner。

## 4. Integration Options

### A. Keep local deterministic mock only

- 優點：最安全、無 backend 依賴。
- 缺點：無法驗證 website 與 tw-ai response 實際串接。

### B. Add local-only website internal proxy to tw-ai mock endpoint

- 優點：有助於整合測試。
- 前提：必須 env-gated、mock-only、local-only。
- 缺點：需要新增內部路由維護成本。

### C. Browser directly calls tw-ai FastAPI

- 優點：本地開發最直接。
- 缺點：不建議，會暴露 backend URL 並帶來 CORS/安全邊界問題。

### D. Production internal proxy later

- 只可在 auth/entitlement/credits gate 完成後考慮。

### Recommendation

- W4-E 若要實作，建議採 **B**：local-only internal proxy、env-gated、mock-only。
- **C 不可作為 production path**。
- production path 需另立 gate 審核。

## 5. Proposed W4-E Minimal Scope

若下一輪進入 W4-E implementation，僅允許：

- 新增 Next.js internal route（例如 `POST /api/ai-research/mock-ticker`）。
- local-only / development-only guard。
- 透過 env 指定 tw-ai FastAPI base URL（例如 `AI_RESEARCH_MOCK_API_BASE_URL`）。
- 僅允許 `mode=mock`。
- 不改 auth/credits/billing 邏輯。
- 不做 DB write。
- 不做 persistence。
- 不做 production deployment。
- frontend 僅在 local/mock flag 下可選擇呼叫該 proxy。
- proxy 不可用時回退到本地 deterministic mock。

## 6. Env / Safety Gate

- `AI_RESEARCH_MOCK_API_BASE_URL` 為 proxy mode 必填。
- proxy default disabled。
- 僅允許在 `NODE_ENV !== "production"` 或明確 dev flag 下啟用。
- 不可暴露上游 secrets。
- 暫不轉發 API key。
- 不可把 raw credentials 暴露到 browser。

## 7. Entitlement / Credits Boundary

- W4-E 不做 real entitlement enforcement。
- 現有 dashboard auth guard 保持。
- Pro+ gating 在 W4-E 仍為 static/local copy。
- credits 維持 dry-run。
- 不扣點。
- 不寫 ledger。
- 不產生 billing event。

## 8. Response Mapping

- proxy response 應盡可能對齊目前 dashboard response-like shape。
- Analyst Overview 需呈現 market_data analyst `mock_real`。
- `data_gaps` / `warnings` / `disclaimer` 必須保留。
- safety flags 必須保留：
  - `broker_execution=false`
  - `simulation_only=true`
  - `not_investment_advice=true`

## 9. Stop Conditions

若 implementation 需要以下任一項目，W4-E 應停止：

- production backend URL
- deployment config
- auth middleware
- billing / credits logic
- DB persistence
- browser 端 CORS workaround
- browser 直連 tw-ai
- live provider
- LLM
- broker
- 修改 tw-ai code
- 修改 tw-feature-engine code

## 10. Explicit Non-Goals

- W4-D 不做 implementation。
- 不新增 API proxy code。
- 不新增 frontend fetch。
- 不改 auth。
- 不改 credits。
- 不改 billing。
- 不改 DB。
- 不做 deployment。
- 不提供投資建議。
- 不修改 tw-ai。
- 不修改 tw-feature-engine。
