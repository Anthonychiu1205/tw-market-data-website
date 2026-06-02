# API Playground Console Layout Polish

## Scope
本輪只重構 API playground modal 介面節奏，不更動 API 行為或後端。

## Key Updates
1. 移除左側「資料狀態」區塊。
2. 左側改為單層 API 參數列：Authorization + Query rows，取消框中框與表頭感。
3. 右側請求範例新增語言選單（cURL / Python / JavaScript / PHP / Go / Java / Ruby），並附語言短標記。
4. Response 狀態控制整合進 response card header，顯示 `200 - OK` 等狀態標籤。
5. cURL 維持語意化多行（`--get` + `--data-urlencode`），避免長 query string 橫向滾動。
6. 保留 endpoint-specific query params 與安全 preview-only Run 行為。

## Validation
- `npm run lint` PASS
- `npm run build` PASS
- 無 API key persistence / logging
- 無 Try it / Send 新增

## Notes
- 僅修改 `src/components/docs/api-run-playground.tsx`。
- 未變更 OpenAPI、llms、docs sidebar、backend routes。
