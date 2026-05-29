# Docs Run Playground Result Panel Fix

## Modified files
- `src/components/docs/api-run-playground.tsx`
- `docs/DOCS_RUN_PLAYGROUND_RESULT_PANEL_FIX.md`

## Run 前 layout
- 左側維持 endpoint / auth / query params input。
- 右側維持 request example card + response example card。
- 最上方顯示淡色 empty state（尚未執行）。

## Run 後 layout
右側改為垂直三段：
1. Result card（新增）
2. Request example card（保留）
3. Response example card（保留）

## Result vs Example differentiation
- Result card：
  - 綠色語意邊框與背景（成功語意）
  - 顯示狀態列（200/400）、Body 標籤、Copy、Download、Clear result
  - 支援 stale 標記（參數改變後）
- Example cards：
  - 維持中性 `CodeBlock` 風格
  - Response card 明確標示為 `Example / Sample response`

## Preview-only safety
- Run 仍為 preview-only。
- 不做任何 fetch / 真實 API 呼叫。
- API key 只在 local state 使用，不儲存不持久化。
- 不輸出或儲存 secret。

## Validation
- `npm run lint`
- `npm run build` (record if long-running)
