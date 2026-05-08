# ECPay Billing Setup (Periodic Credit Card)

## Scope

This integration enables paid plan checkout from `/pricing` using ECPay periodic **credit card** billing.

- Supported plans: `developer`, `pro`, `team`
- Contact-only plan: `enterprise`
- Flow type: one active recurring subscription per checkout order
- Non-scope in this version: invoice/e-invoice, refunds, sponsor pages, public leaderboard

## Required Environment Variables

Set these in Vercel (Preview + Production) and local `.env.local`:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `ECPAY_ENV` (`stage` or `production`)
- `ECPAY_MERCHANT_ID`
- `ECPAY_HASH_KEY`
- `ECPAY_HASH_IV`

## Production/Preview Auth Checklist

Before testing `/pricing` checkout, verify authentication is healthy in the same environment:

- `AUTH_SECRET` is set (production-grade random value, at least 32 chars).
- `DATABASE_URL` points to the deployed PostgreSQL database.
- Auth URL is configured:
  - `NEXTAUTH_URL=https://twmarketdata.com`
  - optional compatibility key: `AUTH_URL=https://twmarketdata.com`
- Google OAuth client is configured using either one pair:
  - `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
  - or `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`
- For Vercel host validation:
  - set `AUTH_TRUST_HOST=true` (or ensure equivalent host trust behavior).

Google OAuth callback URI must include:

- `https://twmarketdata.com/api/auth/callback/google`

Preview deployment note:

- If you test Google login on Preview, add that Preview callback URI in Google Cloud Console as well.
- After changing Vercel env vars, redeploy to apply changes.
- Do not log or expose secret values in build/runtime logs.

## Temporary DB Health Check (Auth Adapter Diagnosis)

For diagnosing Auth.js `AdapterError`, this repo includes a protected internal route:

- `GET /api/internal/db-health`

Call it with the secret header:

```bash
curl -H "x-health-check-secret: <secret>" \
  https://<domain>/api/internal/db-health
```

Notes:

- Set `DB_HEALTH_CHECK_SECRET` in the deployment environment before using this route.
- The response includes only connection state, table existence, and migration summary (no row data).
- Keep this route protected at all times, and remove it after diagnosis if no longer needed.

## Stage vs Production Endpoints

Checkout:
- Stage: `https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5`
- Production: `https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5`

Periodic action (cancel):
- Stage: `https://payment-stage.ecpay.com.tw/Cashier/CreditCardPeriodAction`
- Production: `https://payment.ecpay.com.tw/Cashier/CreditCardPeriodAction`

## ECPay Error 10200141 Quick Check

If ECPay returns `10200141` (`商店尚未提供任何付款方式`), common causes are:

- Merchant payment method is not enabled in ECPay backend.
- Stage/Production credentials and endpoint are mismatched.
- Merchant account is using the wrong checkout endpoint for its environment.
- Transaction amount or periodic setup is outside merchant/account-allowed range.

Use the intermediate checkout diagnostics page to confirm non-sensitive request fields
(`ECPAY_ENV`, checkout host, `MerchantID`, `ChoosePayment`, `TotalAmount`,
`PeriodAmount`, `PeriodType`, `Frequency`, `ExecTimes`, `ReturnURL`, `PeriodReturnURL`).

## Prisma Migration

Run locally after setting `DATABASE_URL`:

```bash
npx prisma migrate dev --name add_billing_subscriptions
npx prisma generate
```

For deployed environments:

```bash
npx prisma migrate deploy
```

## Checkout and Callback Routes

- Checkout submit: `POST /api/billing/ecpay/checkout`
- Initial auth callback: `POST /api/billing/ecpay/notify`
- Recurring callback: `POST /api/billing/ecpay/period-notify`
- Cancel recurring: `POST /api/billing/ecpay/cancel`
- Credits one-time checkout: `POST /api/billing/ecpay/credits/create`
- Credits one-time callback: `POST /api/billing/ecpay/credits/notify`

## Callback URL Requirements

`ReturnURL` and `PeriodReturnURL` must be reachable via public HTTPS domain in production.

This project uses:

- `${NEXT_PUBLIC_SITE_URL}/api/billing/ecpay/notify`
- `${NEXT_PUBLIC_SITE_URL}/api/billing/ecpay/period-notify`

Both routes validate `CheckMacValue` and return plain text `1|OK` only after valid processing.

## Checkout Flow Summary

1. User selects paid plan on `/pricing`.
2. Browser posts `planCode` + `billingCycle` to `POST /api/billing/ecpay/checkout`.
3. Server validates user session and trusted plan catalog price.
4. Server creates pending `Subscription` record.
5. Server returns auto-submit HTML form to ECPay checkout URL.
6. ECPay calls server callbacks (`notify` / `period-notify`) to finalize status.
7. `/billing/thank-you` is UX-only; callback is source of truth.

## Credits Top-up Flow (One-time Payment)

Credits 儲值與訂閱是兩條獨立流程：

- 訂閱方案：使用 ECPay periodic (定期定額)
- Credits 儲值：使用 ECPay one-time payment (單次付款)

### Credits Packages

| Package | 金額 | 最終入帳 credits | 額外加值（已含） |
| --- | --- | --- | --- |
| Starter | NT$500 | 10,000 | 0 |
| Builder | NT$1,000 | 25,000 | 5,000 |
| Pro | NT$3,000 | 90,000 | 30,000 |
| Scale | NT$10,000 | 350,000 | 150,000 |
| Enterprise | NT$30,000 | 1,200,000 | 600,000 |

### Credits one-time checkout params

Credits create route 只使用一次性付款參數：

- `MerchantID`
- `MerchantTradeNo`
- `MerchantTradeDate`
- `PaymentType=aio`
- `TotalAmount`
- `TradeDesc=TW Market Data Credits`
- `ItemName=TW Market Data Credits {credits}`
- `ReturnURL=/api/billing/ecpay/credits/notify`
- `ClientBackURL=/billing/credits`
- `ChoosePayment=Credit`
- `EncryptType=1`
- `CheckMacValue`

**不會帶入**定期定額參數：

- `PeriodAmount`
- `PeriodType`
- `Frequency`
- `ExecTimes`

### Credits callback behavior

`/api/billing/ecpay/credits/notify` 是 credits 入帳唯一 truth source：

1. 驗證 `CheckMacValue`
2. 依 `MerchantTradeNo` 找本地 pending 交易
3. 驗證回傳金額與本地 `amountTwd` 一致
4. `RtnCode=1` 時才會入帳 wallet
5. 更新交易狀態與 `balanceAfter`

`ClientBackURL` 只作為 UX 返回，不可視為付款成功依據。

### SimulatePaid behavior

若 ECPay 回傳 `SimulatePaid=1`：

- 交易只標記為 `simulated`（或保留 pending with simulation record）
- **不會**增加 wallet credits
- callback 仍回 `1|OK`

### Idempotency

- `CreditTransaction.merchantTradeNo` 唯一
- callback 會先檢查是否已 `completed`
- 已完成交易重複通知時直接回 `1|OK`
- 避免重複入帳

## Cancellation Flow Summary

1. User submits cancel from `/billing`.
2. User confirms in modal and can provide cancellation reason payload:
   - `reason`
   - `reasonDetail` (optional, only for `other`)
3. Server verifies ownership and active subscription.
4. Server posts cancel action to ECPay `CreditCardPeriodAction` endpoint.
5. On success, local subscription sets:
   - `status=cancelled`
   - `cancelAtPeriodEnd=true`
   - `cancelledAt=now`
   - `cancelReason`
   - `cancelReasonDetail` (optional)

## First Test Checklist

1. Set `ECPAY_ENV=stage` and ECPay stage credentials.
2. Set `NEXT_PUBLIC_SITE_URL` to a public HTTPS test domain.
3. Run Prisma migration.
4. Sign in and open `/pricing`.
5. Submit `Developer` monthly checkout.
6. Verify browser redirects to ECPay form POST flow.
7. Complete test card authorization in ECPay stage.
8. Verify callback reaches `/api/billing/ecpay/notify`.
9. Verify DB `Subscription` status changes `pending -> active`.
10. Verify `BillingPayment` row created for initial authorization.
11. Simulate duplicate callback and confirm idempotent behavior.
12. Verify recurring callback creates another `BillingPayment` row.
13. Submit cancel from `/billing` and confirm cancel fields update.

## Credits One-time Test Checklist

1. 設定 `ECPAY_ENV=stage`
2. 設定 `ECPAY_MERCHANT_ID` / `ECPAY_HASH_KEY` / `ECPAY_HASH_IV`
3. 設定可公開 HTTPS 的 `NEXT_PUBLIC_SITE_URL`
4. 完成 Prisma migration（包含 wallet / transactions）
5. 登入後前往 `/billing/credits`
6. 開啟「購買 credits」，選擇一個 package
7. 確認新分頁打開綠界付款頁
8. 完成 stage 測試付款
9. 確認 callback 命中 `/api/billing/ecpay/credits/notify`
10. 確認 DB 交易狀態 `pending -> completed`，wallet balance 正確增加
11. 重送同一 callback，確認不會重複入帳
12. 測試 `SimulatePaid=1`，確認不會增加 credits
