# AI Research Mock API Integration Gate

## 1. Executive Summary

- 本文件為 mock API integration gate（設計 gate），用於定義 `/dashboard/ai-research` 未來如何安全串接 tw-ai mock endpoint。
- 本輪不做 API proxy implementation、不做 frontend fetch implementation、不改 UI。
- 本輪不改 auth / billing / credits / DB。
- AI Research 仍定位為 TW Market Data 的 Pro+ bonus feature。

## 2. Current Website State

目前官網狀態：

- `/dashboard/ai-research` 已存在。
- 頁面為 static mock，資料來源全為前端靜態陣列與文案。
- 無 backend call、無 API proxy、無 server action。
- 無 credits deduction。
- 無 billing/auth 行為變更。
- Pro+ gating 目前為靜態文案（非真 entitlement）。
- dashboard guard 仍保護路由（未登入需先登入）。

## 3. Current tw-ai Mock API State

目前 tw-ai 狀態：

- FastAPI app 已存在。
- Endpoint：`POST /v1/research/ticker`。
- Mode：`mock` only。
- 回傳 envelope 包含：
  - `run_id`
  - `ticker`
  - `as_of_date`
  - `decision`
  - `simulation`
  - `research`
  - `research.analysts`
  - `data_gaps`
  - `warnings`
  - `disclaimer`
  - `replay_fingerprint`
  - `broker_execution=false`
  - `simulation_only=true`
  - `not_investment_advice=true`
- P2-L13 後可在 `research.analysts` 暴露 `market_data` analyst（`output_status=mock_real`、`stance=neutral`、`score=0`、`evidence` 非空）。
- 無 DB / provider / LLM / broker / ResearchRunner。

## 4. Proposed Integration Architecture

### A. Browser 直接呼叫 tw-ai FastAPI service

- 優點：
  - local dev 最快看到結果。
- 缺點：
  - 不適合作為 production 模式（backend URL 與服務邊界暴露）。
  - 難以前置 session/plan gate。

### B. Website internal API proxy 呼叫 tw-ai service

- 優點：
  - 可先做 session 與 plan entitlement 檢查。
  - 可隱藏 backend service details。
  - 可集中安全與策略控管。
- 缺點：
  - 需要多一層 route/service 維護。

### C. 維持 static mock，直到 backend deployment/auth gate 完成

- 優點：
  - 最保守、風險最低。
- 缺點：
  - 無法及早驗證 dashboard 與 mock API 對接行為。

### Recommendation

- **短期建議：先維持 C（本輪）**，僅完成 integration gate 文件與資料映射規格。
- **下一步實作建議：走 B**（website internal API proxy），避免 browser 直接暴露 tw-ai service。
- local development 可先有受控 proxy 路徑，但不可直接把 tw-ai internals 暴露到 browser。

## 5. Proposed Future Website API Proxy

設計（本輪不實作）：

- `POST /api/ai-research/ticker`

流程（future）：

1. website 檢查 session。
2. website 檢查 plan entitlement。
3. website 呼叫 tw-ai backend `POST /v1/research/ticker`（mock mode）。
4. website 將 safe envelope 回傳 browser。

Request draft：

```json
{
  "ticker": "2330",
  "as_of_date": "2026-05-13",
  "mode": "mock",
  "include_simulation": true
}
```

Response draft：

- 直接沿用 tw-ai safe envelope（不改語義、不移除 safety flags）。

## 6. Plan Entitlement Gate

未來 entitlement 設計（本輪不實作）：

- Free：blocked，顯示 upgrade prompt。
- Developer：mock preview only（限制展示/次數）。
- Pro：single ticker basic。
- Team：batch/history（後續階段）。
- Enterprise：custom。

## 7. Credits / Usage Gate

本輪定義（不實作）：

- credits 仍為 dry-run。
- mock mode 不扣點。
- 未來可定義：
  - Pro 月度 runs quota
  - Team 更高月度 quota
- validation fail 不應扣點。
- usage 視覺化延後到 dashboard 後續階段。

## 8. Dashboard Data Mapping

tw-ai response 到目前 UI 區塊的映射規格：

- `decision.action` -> Decision Summary / 研究動作候選
- `decision.confidence` -> 信心分數
- `research.analysts[]` -> 分析師總覽
- `research.analysts[market_data]` -> 市場資料分析師（mock-real）
- `research.bull_case` -> 多方觀點
- `research.bear_case` -> 空方觀點
- `research.risk_review` -> 風控審查
- `research.portfolio_decision` -> 投組動作
- `simulation.order` -> 模擬訂單
- `data_gaps` -> 資料缺口
- `warnings` -> 風險提示
- `replay_fingerprint` -> Replay fingerprint

## 9. Safety / Compliance Requirements

頁面與 API response 必須維持：

- 僅供研究參考
- 非投資建議
- 不保證報酬
- 不進行真實下單
- `simulation_only=true`
- `broker_execution=false`
- `not_investment_advice=true`
- 使用者需自行判斷

## 10. Proposed W4-B Minimal Implementation Scope

若進入 W4-B（implementation），僅允許：

- website internal mock API proxy 設計/實作其一（小範圍）。
- 不可硬編 production backend URL。
- 無 auth/billing/credits implementation（除非另開 gate）。
- 無 direct DB。
- 無 live provider。
- 不 deploy，不 push。

W4-B 可選路徑：

- Option 1：
  - 先做 static adapter（把現有 static UI data shape 對齊 tw-ai response shape），不呼叫 backend。
- Option 2：
  - local-only internal proxy（以 env flag 控制）對接 tw-ai mock FastAPI。

建議：先走 Option 1 或先補 implementation gate，再進 Option 2；避免直接做 production proxy。

## 11. Explicit Non-Goals

- 本輪不做 implementation。
- 不做 frontend fetch。
- 不做 API proxy。
- 不做 auth changes。
- 不做 credits changes。
- 不做 billing。
- 不做 DB。
- 不做 live trading。
- 不提供投資建議。
- 不修改 tw-ai。
- 不修改 tw-feature-engine。
