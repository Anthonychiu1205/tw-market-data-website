# Auth Production Smoke Test

## 前置條件
- 已部署最新版本。
- Vercel env 已設定：
  - `DATABASE_URL`
  - `AUTH_SECRET`
  - `NEXTAUTH_URL=https://twmarketdata.com`
  - `NEXT_PUBLIC_SITE_URL=https://twmarketdata.com`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- 已執行 migration：`npx prisma migrate deploy`。

## Smoke Test
1. 開啟 `https://twmarketdata.com/login`，頁面可正常載入。
2. 點「使用 Google 登入」，可正常導向 Google OAuth。
3. Google callback 成功後，導回 `/dashboard`。
4. 未登入直接開 `https://twmarketdata.com/dashboard`，應 redirect 到 `/login`。
5. 在已登入狀態下按 Logout，應導回 `/`。
6. 進資料庫檢查表資料：
   - `User` 有新增登入者
   - `Account` 有 provider = `google`
   - `Session` 有有效 session token

## 失敗時檢查
- `/api/auth/*` 回 503 且 `auth_runtime_env_missing`：表示缺 env（最常見是 `DATABASE_URL`）。
- callback 失敗：回頭確認 Google Cloud Console 的 origin 與 redirect URI。
- 登入成功但無法進 dashboard：檢查 middleware/proxy 是否被改動，及 session table 是否可寫入。
