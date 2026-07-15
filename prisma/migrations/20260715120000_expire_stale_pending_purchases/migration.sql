-- Revenue integrity: a top-up only counts once the provider confirms payment (Polar order.paid).
--
-- No live code path writes a PENDING purchase — fulfilCreditPurchase only ever inserts status
-- 'completed', and it does so on order.paid. So any pending purchase row is stale legacy data: e.g.
-- the ecpay checkout that never confirmed and has hung as "確認中 +350,000 credits" for two months.
-- Those rows were NEVER added to the wallet balance (crediting only happens on completion), so this
-- does not change any balance — it only stops a never-funded top-up from rendering as a green
-- "+credits" row that looks like money the customer has.
--
-- Mark them expired. Idempotent: it only touches pending purchases and never a completed one. The
-- 1-hour guard is belt-and-suspenders — a legitimate checkout confirms within minutes — so even if a
-- pending purchase were ever written, a genuinely in-flight one is left alone.
UPDATE "CreditTransaction"
SET status = 'expired', "updatedAt" = NOW()
WHERE type = 'purchase'
  AND status = 'pending'
  AND "createdAt" < NOW() - INTERVAL '1 hour';
