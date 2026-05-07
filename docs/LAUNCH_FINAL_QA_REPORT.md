# TW Market Data Final Launch QA Report

## Overall Status
- **Conditionally Ready**
- 核心阻擋項（lint/build、安全基線、SEO 基礎、主要互動）皆已通過。
- 建議上線前再做一次真機手動 smoke test（iOS Safari / Android Chrome / Desktop）。

## Checks Completed
- Content QA
- Responsive QA（程式碼層檢查 + 版型規則檢查）
- Interaction QA（navbar / docs / API demo / market marquee）
- SEO / AI Discoverability
- Security Headers
- Env / Deployment Readiness

## Findings

| Severity | Area | Finding | File / Evidence | Fix Applied or Recommended |
|---|---|---|---|---|
| High | Content QA | 公開可讀內容仍含不應主宣傳字詞（unsupported topics / US-market terms） | `public/llms-full.txt`, `src/content/docs-pages.ts` | **Applied**：改為中性描述，不再列出不適用關鍵詞；coming-soon 顯示名改為中性名稱。 |
| Medium | Content QA | 市場覆蓋限制段落直接列舉未納入主功能主題，容易被誤讀為公開承諾列表 | `src/content/docs-pages.ts` | **Applied**：改為「延伸主題後續依 controlled rollout 公告」的中性文案。 |
| Medium | QA Scope | 部分舊 docs route 仍可被直接存取（非主導航入口） | build route output (`/docs/api/institutional-ownership` 等) | **Recommended**：後續可加 canonical redirect 或 noindex 策略，避免搜尋引擎收錄舊路由。 |
| Low | Responsive QA | Dashboard 進階頁（非核心 landing）在極窄螢幕仍需人工真機驗證互動細節 | dashboard components | **Recommended**：上線前用 360px / 390px 寬度做手動點擊巡檢。 |

## Remaining Risks
- 舊版 docs path 仍存在可直接訪問入口，雖不在主 sidebar，但可能被外部索引。
- 本輪以程式碼與建置驗證為主，未做完整跨裝置視覺回歸截圖比對。
- `vercel.json` cron 與 production env 需在平台後台正確配置後才會生效。

## Deployment Checklist

### Required Environment Variables
- `NEXT_PUBLIC_SITE_URL`
- `AUTH_SECRET`
- `BACKEND_API_BASE_URL`
- `BACKEND_API_TOKEN`（或 `BACKEND_API_KEY` / `BACKEND_BEARER_TOKEN` / `STAGING_BACKEND_API_TOKEN` 其一）
- `CRON_SECRET` 或 `MARKET_MARQUEE_REFRESH_SECRET`

### Optional Environment Variables
- `MARKET_MARQUEE_SNAPSHOT_PATH`

### Platform / Infra Checks
- Vercel domain 與 `NEXT_PUBLIC_SITE_URL` 一致
- `vercel.json` cron 已啟用（盤中 + 收盤後時段）
- `/api/market-marquee?refresh=1` 受 secret 保護
- `robots.txt` 與 `sitemap.xml` 使用正式 site URL

### Post-deploy Verification
- Metadata canonical / OG / Twitter card 正確
- Contact modal（navbar + dashboard 支援）可用
- Docs TOC / scrollspy / anchor 可用
- API demo Run / loading / line-by-line response 可用

## Post-deploy Smoke Test
- `/`
- `/pricing`
- `/docs`
- `/docs/quick-start`
- `/api`
- `/blog`
- `/login`
- `/api/market-marquee`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`

## Recommended Next Step
可進入 deploy 準備流程：
1. 先在 staging 套用 production env 與 cron。
2. 跑一次上述 smoke test。
3. 若無回歸，再進 production deploy。
