# TOTAL_MARGIN_SHORT_WEBSITE_POST_SYNC_ROUTE_REVIEW_20260602T081427Z

## 目標路由
- `/datasets`
- `/datasets/total-margin-short`
- `/docs/api/capital-flow/total-margin-short`
- `docsSidebarNav` / docs sidebar 入口
- catalog + dataset 產品入口
- dataset detail + API docs 動態路由

## 來源確認
- `app/datasets/page.tsx` 已包含 `整體融資融券` 入口，含 `href: /datasets/total-margin-short`。
- `src/content/datasets.ts` 含 `slug: "total-margin-short"`。
- `src/content/docs-sidebar.ts` 已包含 `title: "整體融資融券"`、`href: "/docs/api/capital-flow/total-margin-short"`。
- `src/content/docs-pages.ts` 已包含 `topicId: "total_margin_short"`，並在 `schemaReadyTopicPages` 對應 API page 與 API reference。
- `src/content/docs-pages.ts` `docsSidebarNav` 於資金分類已新增 `整體融資融券` 導覽項目（`/docs/api/capital-flow/total-margin-short`）。
- dataset detail page / docs page 採用動態路由 `app/datasets/[slug]/page.tsx` 與 `app/docs/[...slug]/page.tsx`，不需額外實體頁面檔案。

## 內部參照
- 未見 `/datasets/total-margin-short`、`/docs/api/capital-flow/total-margin-short` 的壞連結。
- 來源掃描未在 total-margin-short 路由關聯內容中觀測到未註冊的 slug。

## Route Review 結論
- `total-margin-short` route/docs 對齊已通過。
