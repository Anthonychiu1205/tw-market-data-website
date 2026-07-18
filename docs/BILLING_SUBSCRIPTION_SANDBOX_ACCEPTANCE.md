# 訂閱改版 sandbox 驗收 runbook（PR #62 + #63）

一頁照做即可。目標：在 Polar **sandbox** 驗證訂閱三態頁 + 站內取消/恢復/發票/付款方式，**不碰 prod**。

## 0. 前置：sandbox 憑證 / env

在 preview（或本機 `.env.local`）設定，**全部用 sandbox 值，勿用 prod**：

| env | 說明 |
|---|---|
| `POLAR_API_BASE` | Polar **sandbox** base URL（設此值即切 sandbox；`polar.ts` 以是否含 `sandbox` 判定 server）。 |
| `POLAR_ACCESS_TOKEN` | **sandbox** organization token，scopes 需含 `subscriptions:read`+`subscriptions:write`+`orders:read`+`customers:read`+`customer_sessions:write`。 |
| `POLAR_PRODUCT_ID_STARTER/PRO/MAX/DEVELOPER` | sandbox 四個訂閱產品 id（sandbox 產品與 prod 分開）。 |
| `POLAR_WEBHOOK_SECRET` | sandbox webhook secret（credit-pack 用；訂閱 provisioning 由 read API 的 webhook 擁有）。 |
| `NEXT_PUBLIC_SITE_URL` | preview URL（embed checkout origin）。 |
| `PUBLIC_API_CREDITS_DEDUCTION_ENABLED` | **保持未設 / dry_run**——本驗收不啟用實扣（實扣啟用走另一份 runbook）。 |

⚠ **跨服務依賴**：步驟 4「期末後 REST/MCP 回 402」需 **read API（tw-feature-engine）也指向同一個 Polar sandbox**，其 Polar webhook 才會把 sandbox 訂閱的 canceled 事件投影成降級。若 read API 仍指 prod，網站 UI 步驟（1–3、5、6）仍可驗，但 402 降級（步驟 4）驗不到——請先確認 read API sandbox 對齊，或將步驟 4 標記為 blocked。

建立測試帳號：以一個 NextAuth 帳號登入（其 user id = Polar `externalCustomerId`）。

## 1. 三態 + 訂閱 → 取消 → 黃 banner → 恢復（UI）
1. **態 A（免費）**：新帳號未訂閱 → `/billing/subscriptions` 顯示「目前：免費層」現況帶 + 四張升級卡。
2. **訂閱**：走 checkout（sandbox 卡：Polar 測試卡）訂 Pro。回 `/billing/subscriptions` → **態 B**：目前方案卡（Pro $100/月、配額摘要、**下次扣款日**走 Polar `currentPeriodEnd`）＋付款方式（末四碼）＋扣款紀錄＋底部紅「取消訂閱」。
3. **取消**：按紅鈕 → 確認 modal（警告期末生效／不退款／API keys 降級）→ 確認。UI 走「處理中」→ 重拉 Polar → **態 C**：黃 banner「已排定取消，服務可使用至 {endsAt}」＋恢復鈕；方案卡標「已排定取消」；取消鈕隱藏。
4. **恢復**：按「恢復訂閱」→ 重拉 → 回態 B（badge「使用中」、取消鈕回來）。
5. **再取消**：重複 3，準備期末驗收。

驗收點：banner 的 `endsAt`、下次扣款日、金額皆來自 Polar 即時值（非寫死）；取消/恢復皆為 `subscriptions.update({cancelAtPeriodEnd})` 同一支。

## 2. 期末生效 → 降級（跨服務，需 read API sandbox 對齊）
6. 在 Polar sandbox 讓訂閱**期末到期**（sandbox 可縮短週期或手動觸發到期）。Polar 發 `subscription.canceled` → read API 翻 status。
7. 用該帳號的 **API key** 打 **REST** `/v2/datasets/{付費集，如 income-statement}` → 預期 **402**（或依 entitlement 為 403 plan_not_entitled，視降級後 plan）。
8. **同一把 key** 打 **MCP** `query_dataset` 同一付費集 → 預期同樣被拒（**60s entitlement cache 內**一致）。

驗收點：REST 與 MCP 對同一 key/同一集的降級**一致**（同源 entitlement）。

## 3. 拒絕 / 錯誤態 / 邊界
9. **免費用戶**：另一未訂閱帳號 → 態 A；直接呼叫 cancel server action（或無訂閱下）→ 被拒（`no_subscription`），不誤動他人訂閱。
10. **跨帳號**：發票 route `/api/billing/invoice/{別人的 orderId}` → **404**（不洩存在）。
11. **Polar down**：暫時把 `POLAR_ACCESS_TOKEN` 設為無效值（或斷網）→ `/billing/subscriptions` 付費卡顯示「暫時無法讀取」錯誤態、**頁面不崩、不顯示假數字**；server log 有真實 status/body（`[polar-billing] … status=…`）。

## 4. dunning（扣款失敗，follow-up）
12. Polar org 設定：權益撤銷 = **立即**（無寬限）。在 sandbox 觸發一次扣款失敗（測試卡 decline）→ 觀察 Polar 事件與 read API 降級行為；確認第四態文案照實（不假設寬限）。做不完就列 follow-up ticket，不擋合併。

---

**通過標準**：1–3、9–11 全綠即可合 #62/#63 的 UI 層；步驟 4（402 降級）需 read API sandbox 對齊後補驗；步驟 12（dunning）可列 follow-up。**全程 `POLAR_API_BASE` 指 sandbox、實扣 flag 不開。**
