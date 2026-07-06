# TOTAL_MARGIN_SHORT_WEBSITE_SYNC_PLAN_20260602T080712Z

## 任務目的
依賴後端 handoff 套件，將 Total Margin Short（整體融資融券）完成網站側資料集與文件同步，更新範圍限定於 tw-market-data-website，不改 backend。

## 依賴文件
- /Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/website_packages/total_margin_short_private_beta_package.json
- /Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/website_packages/total_margin_short_api_examples.md
- /Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/website_packages/total_margin_short_private_beta_product_copy.md
- /Volumes/DEV_USB/Projects/tw-feature-engine/docs/ops/TOTAL_MARGIN_SHORT_WEBSITE_REPO_HANDOFF_CHECKLIST.md

## 需要更新的網站檔案（本輪）
1. `src/content/datasets.ts`：新增 / 確認 `total-margin-short` catalog entry。
2. `src/content/site.ts`：新增 `total-margin-short-daily` dataset product 卡片（endpoint、TWSE scope、private beta seeded）。
3. `app/datasets/page.tsx`：在籌碼與交易分類加入 `整體融資融券`，並更新 JSON-LD。
4. `src/content/docs-sidebar.ts`：在資金頁 API sidebar 新增 `/docs/api/capital-flow/total-margin-short`。
5. `src/content/docs-pages.ts`：
   - schema-ready topic group 新增 `total_margin_short` 對應 topic。
   - `schemaReadyTopicPages` 對應頁面 title/subtitle。
   - API 參考建構 (`buildTotalMarginShortApiReference`) 與 sections。
   - `docsSidebarNav` 新增 `整體融資融券` 導覽項目。

## 需保持的限制
- route 只在 /`/v2/datasets/total-margin-short`
- TWSE-only / private beta seeded
- no TPEx/full-market claim
- private beta 種子資訊維持在文案
- 明確標示 `no daily write cron` 與 `not_investment_advice=true`
- 不改後端、scheduler、DB、deploy/CI
