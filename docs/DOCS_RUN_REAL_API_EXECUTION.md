# Docs Run Playground Real API Execution

## 修改檔案
- `src/components/docs/api-run-playground.tsx`
- `src/lib/docs/run-playground.ts`
- `tests/docs-run-playground-real-api.test.mjs`

## Real API execution flow
- Run 按鈕改為真實呼叫目前 docs endpoint（same-origin relative path）。
- URL 由 `endpoint + query params` 組成，透過 `buildRunUrl(...)` 產生。
- request header 帶 `X-API-Key`（僅來源於本頁輸入狀態）。
- 呼叫 `fetch(url, { method: GET, headers, cache: "no-store" })`。
- 結果寫入 Live result card，顯示真實 status 與 response body。

## Usage logging path
- Run 呼叫走既有 `/v2/datasets/*` gateway route 時，會自然進入現有：
  - API key validation
  - usage logging (`createApiUsageEvent`)
  - credits deduction（依既有規則）
- 本輪未新增任何平行 usage logging 機制。

## API key handling
- API key 只存在 React local state。
- 不寫入 localStorage / sessionStorage / cookie。
- 不放在 URL query string。
- request example 中只顯示 mask 後的 key（例如 `twmd_liv••••••`）。
- 未填 API key 或 placeholder key 時會先擋下，不送 request。

## Dashboard delay note
- Run 成功/失敗後文案提示：儀表板用量可能有數秒快取延遲。

## 安全檢查
- 無 hardcoded secret。
- 無 console 輸出 API key。
- 無新增 backend logging side channel。

## Validation
- `npm run lint`
- `NEXT_TELEMETRY_DISABLED=1 npm run build`
