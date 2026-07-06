# TOTAL_MARGIN_SHORT_WEBSITE_ROUTE_REVIEW_20260602T080712Z

## 路由檢核

### 目標路由
- `/datasets`
- `/datasets/total-margin-short`
- `/docs/api/capital-flow/total-margin-short`
- docs sidebar 導覽入口

### 已確認註冊
- `/datasets/total-margin-short`：
  - `app/datasets/page.tsx` 卡片列入 `整體融資融券`
  - `/datasets/[slug]/page.tsx` 會以 `datasetSeoEntries` 做動態 slug 解析
  - `src/content/datasets.ts` 含 `slug: "total-margin-short"`

- `/docs/api/capital-flow/total-margin-short`：
  - `src/content/docs-sidebar.ts` 的 capital-flow 群組已新增此項
  - `src/content/docs-pages.ts` 的 schemaReadyGroups 含 topic `total_margin_short`
  - `schemaReadyTopicPages` 分派對應 title/subtitle 與 `buildTotalMarginShortApiReference`
  - `docsSidebarNav` 已補上該項（剛完成）

- `/datasets` / `/docs` 導覽
  - `app/datasets/page.tsx` 與 `src/content/docs-sidebar.ts` 可到達對應頁面入口

### 備註
- `app/docs/api/capital-flow` 無實體 total-margin-short 檔案頁，但文件系統採 `app/docs/[...slug]/page.tsx` 動態路由，依 `docsPages` static params 生成。
