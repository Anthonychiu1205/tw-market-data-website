# DOCS Run Playground 與 Dashboard Usage Logging Audit

## Scope
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- 本輪僅 audit，未改 backend 行為、未改 billing/credits、未改 Run 成真 API call。

## 1) Run playground current behavior

### Source
- `src/components/docs/api-run-playground.tsx`

### Findings
- `Run` 行為由 `handleRunPreview()` 驅動，僅更新 client state（`previewResult` / `runNotice` / `activeStatus`）。
- UI 明確顯示 preview-only 訊息（含 `Preview result generated` 與「不會呼叫真實 API」語意）。
- 未發現此 component 執行真實資料請求或 usage logger 呼叫。
- `api key` 僅為 local state 輸入，不做持久化。

### Conclusion
- Docs Run playground 現況為「純預覽互動」，不應記入請求量、不應扣 credits。

## 2) Dashboard usage data source

### Main rendering
- `app/usage/page.tsx`
- `src/components/dashboard/usage-page-shell.tsx`
- `src/components/dashboard/dashboard-page-shell.tsx`

### Server-side summary source
- `src/lib/gateway/usage.ts`
  - `getUsageSummaryForUser(userId)`
  - `getRecentApiUsageForUser(userId, limit)`

### Metric definitions (current implementation)
- 今日請求（requestsToday）
  - `apiUsageEvent.count(createdAt >= 今日 00:00)`
- 30 天請求（requests30d）
  - 目前程式實作為近 `35` 天 window 的 `events.length`（`startOfWindow = today - 34 days`）
- 30 天試算模式（estimatedCreditsUsage30d）
  - 同一 window 內 `creditsCharged` 累加
- Top datasets
  - 同一 window 內 `datasetSlug` 分組計數，降冪取前 8
- 端點/資料集使用圖
  - 由 usage rows 聚合（UI 中以 dataset/endpoint 做顯示）

### Refresh / cache behavior
- `getUsageSummaryForUser` 有 in-memory cache：`USAGE_SUMMARY_CACHE_TTL_MS = 8000`（8 秒）。
- 真實請求寫入後可能最多約 8 秒內看到舊值；但若完全沒有新增 usage event，不會有變化。

## 3) True API usage logging path

### API gateway route
- `app/v2/datasets/[dataset]/route.ts`

### Logging point
- 在 `finally` 區塊呼叫 `createApiUsageEvent(...)`：
  - `datasetSlug`, `endpoint`, `statusCode`, `creditsCharged`, `requestId`, `errorCode`, `latencyMs` 等
- 因此只要有真實 `/v2/datasets/*` gateway request，就會進 usage log path。

### Credits path (separate but linked)
- `src/lib/gateway/credits-deduction.ts`
  - `checkCreditsAvailabilityForApiUsage`
  - `deductCreditsForApiUsage`
- 與 usage event 同屬真實 API 流程；docs preview 不經過此流程。

## 4) Why Run does not update dashboard usage

### Root-cause classification
- **A. expected_behavior_preview_only**

### Explanation
- Dashboard usage 只來自 `apiUsageEvent`（真實 gateway request）。
- Docs Run playground 不呼叫 gateway、不寫 usage event，因此 dashboard 不會增加。
- 這不是目前程式碼層面的 logging bug；是設計上的行為差異。

## 5) Product decision options

### Option 1 (Recommended): Keep preview-only + clearer label
- 說明文字強化：「Preview 不計入用量、不扣 credits、不呼叫真 API」
- 風險最低，維持安全與成本可控。

### Option 2: Real API Run with usage logging
- Run 走 `/v2/datasets/*` 真路徑，需 API key 驗證、usage 記錄、credits 規則一致。
- 風險：誤扣 credits、濫用風險、前端需處理真實錯誤與速率限制。

### Option 3: Preview interaction telemetry (non-billing)
- 記錄「按了 Run」的產品行為事件（analytics），不寫 usage/billing。
- 可觀測 docs 互動，但不混淆 API usage 指標。

## 6) Recommended next implementation task
- 優先執行 **Option 1**：在 Run 面板與 usage 頁補強語意對齊（preview vs real usage）。
- 若產品要評估 conversion，再追加 **Option 3** analytics（非 billing log）。
- 僅在明確商業決策後才做 **Option 2**。

## No-change confirmation
- 本輪未修改 backend 行為。
- 本輪未改 billing/credits 邏輯。
- 本輪未將 Run 改為真 API call。
