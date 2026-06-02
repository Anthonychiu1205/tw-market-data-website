# API Playground Dropdown Z-Index Fix

## Problem
語言選單在 request card 展開時被下方 response 區塊遮擋/裁切。

## Root Cause
- dropdown menu 在 request header 中採 `absolute`。
- request card 使用的 `CodeBlock` root 預設有 `overflow-hidden`，導致 menu 被裁切。
- menu z-index 在卡片堆疊下不足。

## Fix
- 在 request header parent 提升 stacking context：`z-[90]`。
- dropdown menu 提升為 `z-[100]`。
- request `CodeBlock` 實例改為 `!overflow-visible`（局部覆蓋），並加 `relative z-20`。
- 保留 code block 內容區自身 scroll/overflow 控制，不破壞既有程式碼顯示。

## Validation
- `npm run lint` PASS
- `npm run build` PASS
- 安全檢查無 API key persistence/logging。
