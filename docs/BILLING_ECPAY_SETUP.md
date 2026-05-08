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

## Stage vs Production Endpoints

Checkout:
- Stage: `https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5`
- Production: `https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5`

Periodic action (cancel):
- Stage: `https://payment-stage.ecpay.com.tw/Cashier/CreditCardPeriodAction`
- Production: `https://payment.ecpay.com.tw/Cashier/CreditCardPeriodAction`

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

## Cancellation Flow Summary

1. User submits cancel from `/billing`.
2. Server verifies ownership and active subscription.
3. Server posts cancel action to ECPay `CreditCardPeriodAction` endpoint.
4. On success, local subscription sets:
   - `status=cancelled`
   - `cancelAtPeriodEnd=true`
   - `cancelledAt=now`

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
