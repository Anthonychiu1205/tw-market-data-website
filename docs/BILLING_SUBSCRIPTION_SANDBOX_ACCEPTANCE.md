# 訂閱改版 sandbox 驗收 runbook（SBX-63）

一頁照做。在 Polar **sandbox** 驗證訂閱三態頁 + 站內取消/恢復/發票/付款方式。**全程不碰 prod。**

> ⚠️ **前置：互動功能（取消/恢復/發票/modal）需 PR2 在 main。** PR2（原 #63）於 #62 合併時被 GitHub 連帶自動關閉（base 分支被刪），**非人為否決**，程式碼仍在分支 `feat/billing-subscription-actions`。跑「取消→橫幅→恢復→發票→跨帳 404」這幾列前，需先把 PR2 重新 land 到 main（rebase 後重開 PR）。只驗三態**顯示**則 main（#62）已足夠。

## 0. env（`.env.local`，本機；祕密由 owner 手動貼）
| 變數 | 值 | 誰 |
|---|---|---|
| `POLAR_API_BASE` | `https://sandbox-api.polar.sh` | ✅ 已填 |
| `POLAR_PRODUCT_ID_PRO` | `62f2d52d-9696-4a96-8acf-92c143b5cc0d` | ✅ 已填（**程式讀的 Pro env 名**）|
| `NEXT_PUBLIC_SITE_URL` / `AUTH_URL` | `http://localhost:3000` | ✅ 已填 |
| `ALLOW_DEV_LOGIN` | `1` | ✅ 已填（**dev-only 登入旁路開關；勿進 Vercel/.env.production**）|
| `POLAR_ACCESS_TOKEN` | sandbox 全 scope token | 🔑 owner 貼 |
| `BACKEND_API_BASE_URL` | read API base（entitlement 判 paid/free）| 🔑 owner 填（不填 → fail-open=free → 只顯示態 A）|

`AUTH_SECRET`、`DATABASE_URL` 已在。**不需 Google OAuth**（localhost 未註冊；改用 dev-login）。

## 1. dev-login（本機登入旁路，取代 Google）
`src/auth/index.ts` 內建 dev-only Credentials provider `dev-login`，**雙閘門**：`NODE_ENV !== "production"` **且** `ALLOW_DEV_LOGIN === "1"` 才註冊，prod build 永不出現。登入時填 **email + userId**，以該 **userId** upsert user 並建立 session → `session.user.id === userId`。把 userId 填成 **sandbox 訂閱的 externalCustomerId**，即直接解決對映（不用另跑對映修正）。

**取得要填的 userId（= sandbox sub externalId）**：跑 `scratchpad/check_sandbox_mapping.ts`（貼 token 後）列出兩筆 Active 訂閱的 externalId。強烈猜測 anthonyiaaan 的 = `cmovm08sz0000ie04tay5q725`（prod log 佐證），仍請以 script 輸出為準。

## 2. 起站 + 登入
```
npm run dev          # → http://localhost:3000
```
1. 開 `http://localhost:3000/api/auth/signin` → 選 **「Dev Login（本機 sandbox 驗收）」**。
2. 填 **email**（如 `anthonyiaaan@gmail.com`）+ **userId**（= 上面查到的 sandbox sub externalId）→ 送出。
3. 到 `http://localhost:3000/billing/subscriptions` → 應顯示付費態（若 BACKEND_API_BASE_URL 的 read API 回報該帳號為付費）。

## 3. 驗收矩陣（Cowork 跑；需 PR2 在 main）
1. **三態**：態 A 免費四卡 / 態 B 付費管理卡 / 態 C 取消中黃 banner。
2. **取消**：紅鈕 → 確認 modal（期末生效/不退款/API key 降級警告）→ 確認 → 態 C。
3. **恢復**：黃 banner 恢復鈕 → 回態 B。
4. **發票**：扣款紀錄列 [發票] → 導向 Polar sandbox PDF。
5. **跨帳 404**：`/api/billing/invoice/{別人的 orderId}` → 404。
6. **Polar down**：暫時改壞 `POLAR_ACCESS_TOKEN` → 付款方式卡顯示錯誤態、不崩、不假數字。

## 4. 「期末 402 降級」— 部分驗收（缺口）
- 三態頁 paid/free + 方案**已改由 Polar live 判定**（SSOT，#78）；cancel/resume/發票/付款方式亦直讀寫 **Polar sandbox** → UI 全可驗 ✅。
- **但 402 降級**（資料集存取）走 **read API entitlement**：需 read API 收到 **sandbox** 的 `subscription.canceled` webhook 才翻 status；read API 現指 **prod Polar**，看不到 sandbox 取消 → **本機驗不到**。
- **補驗條件**：read API 也指向同一 Polar sandbox（其 Polar env + webhook 設為 sandbox）之日，補跑 REST `/v2/datasets/{付費集}` 回 402 + 同 key MCP `query_dataset` 同集回 402（60s cache 內一致）。
- 追蹤：read API repo backlog 票 `tw-feature-engine#98`。

## 5. 驗收結果（2026-07-18，SBX-63 結案）
**通過**（#78 已合併）。9 項：**6 全過**（三態顯示、訂閱、取消、取消中黃 banner、恢復、跨帳 404）、**1 先前實測**（發票）、**2 部分驗收（留檔）**：
- **402 期末降級**：本機驗不到（read API 指 prod Polar）→ 待 `tw-feature-engine#98` read API 指向 sandbox 後補跑。
- **Polar-down 錯誤態**：以壞 token 驗過付款方式錯誤態；完整跨服務 down 情境列部分驗收。
過程修正併入 #78：dev-login（DB-session 路由 + /login 表單）、Prisma 本機 TCP 分流、三態頁付費/免費改 Polar SSOT。
