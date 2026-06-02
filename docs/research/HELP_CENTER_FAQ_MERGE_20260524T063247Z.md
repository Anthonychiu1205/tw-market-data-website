# Help Center + FAQ Merge

## Summary
本輪將 FAQ 入口與內容收斂到幫助中心，避免 support 導覽重複，同時保留舊路徑可訪問。

## What Changed
- SUPPORT sidebar 移除「常見問題」，保留：
  - Support
  - 幫助中心
- 幫助中心 FAQ 內容全面加深：
  - 每題均補成可操作型回答（原因 + 步驟 + 排查）
  - 涵蓋 API、金鑰、credits、502/504、SDK/Agent、回報流程
- FAQ 路徑處理：
  - `/faq` 轉址到 `/help` 並設 canonical `/help`
  - `/docs/faq`、`/docs/help-center` 於 docs catch-all 做 alias redirect 到 `/help`

## Why
- 減少導覽重複與 SEO 內容重疊
- 讓使用者在單一幫助中心就能找到完整解法
- 保留舊連結兼容性，不造成 404

## Validation
- `npm run lint` PASS
- `npm run build` PASS
