# TW Market Data Platform Website

全新重建的 Next.js 官網專案，定位為台股 financial data platform 的產品站與 docs 入口。

## 技術棧

- Next.js App Router
- TypeScript
- Tailwind CSS
- Cookie-based demo auth（無資料庫）

## 快速啟動

1. 安裝依賴

```bash
npm install
```

2. 設定環境變數

```bash
cp .env.example .env.local
```

建議填入：

- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`（例如 `http://localhost:3000`）

3. 啟動開發環境

```bash
npm run dev
```

4. 驗證品質

```bash
npm run lint
npm run build
```

## Demo Login

- 路由：`/login`
- 帳密：使用 `.env.local` 內的 `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`
- 成功登入後導向 `/dashboard`
- 未登入訪問 `/dashboard` 會導向 `/login`
- 可於 header 或 dashboard 內登出

## 已完成頁面

- `/`
- `/product`
- `/datasets`
- `/api`
- `/pricing`
- `/docs`
- `/about`
- `/contact`
- `/login`
- `/dashboard`

## Placeholder 區塊

- 聯絡頁表單僅 UI（未串接 backend）
- Dashboard usage / quota / access 為 placeholder
- Semantic execution / analytical response / agent workflow 屬逐步開放能力
- Changelog 區塊為 placeholder

## 產品敘事範圍

本站內容反映：

- 台股資料平台 v1（canonical read API、dataset catalog、source policy、plan enforcement、usage/rate limit）
- v2 semantic / agent capabilities（semantic catalog、planner、execution、agent interface、MCP/tool packaging）

其中 v2 能力明確標示為「規劃中 / 逐步開放」，避免誇大描述。
