# Google OAuth Setup

## 1. 在 Google Cloud Console 建立 OAuth App
- 進入 Google Cloud Console，建立或選擇專案。
- 啟用 Google Identity / OAuth 同意畫面。
- 建立 OAuth 2.0 Client ID（Web application）。
- 取得 `GOOGLE_CLIENT_ID` 與 `GOOGLE_CLIENT_SECRET`。

## 2. Authorized JavaScript origins
請加入：
- https://twmarketdata.com
- https://www.twmarketdata.com

## 3. Authorized redirect URIs
請加入：
- https://twmarketdata.com/api/auth/callback/google
- https://www.twmarketdata.com/api/auth/callback/google

## 4. PostgreSQL / Prisma migration
本專案使用 Prisma + PostgreSQL 作為 Auth.js session 與 user persistence 的資料庫。

本機開發（建立 migration）：
```bash
npx prisma migrate dev --name init_auth
```

Production / Vercel 部署（套用既有 migration）：
```bash
npx prisma migrate deploy
```

可選：確認 Prisma Client
```bash
npx prisma generate
```

## 5. Vercel 環境變數
請在 Vercel Project Settings → Environment Variables 設定：
- DATABASE_URL=
- AUTH_SECRET=
- NEXTAUTH_URL=https://twmarketdata.com
- NEXT_PUBLIC_SITE_URL=https://twmarketdata.com
- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=

## 6. 本機開發建議
本機 `.env.local` 可設定：
- DATABASE_URL=
- AUTH_SECRET=
- NEXTAUTH_URL=http://localhost:3000
- NEXT_PUBLIC_SITE_URL=http://localhost:3000
- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=

## 7. 驗證流程
1. 開啟 `/login`。
2. 點「使用 Google 登入」。
3. 完成 OAuth 後應導向 `/dashboard`。
4. 點 Logout 後應導向 `/`。
5. 在資料庫確認有 `User`、`Account`、`Session` 資料。
