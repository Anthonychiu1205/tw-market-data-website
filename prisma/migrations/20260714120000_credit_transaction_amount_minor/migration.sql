-- P0-A (credit top-up path): record purchase amounts in a currency-explicit way.
--
-- Additive only. The legacy "amountTwd" column is left in place and untouched so existing rows keep
-- their data and nothing breaks mid-deploy; the P0-B currency cutover backfills amountTwd into
-- amountMinor/currency and then drops it. New writes populate amountMinor + currency.
--
-- Money is stored in MINOR units (integer cents) — never a float.
ALTER TABLE "CreditTransaction" ADD COLUMN IF NOT EXISTS "amountMinor" INTEGER;
ALTER TABLE "CreditTransaction" ADD COLUMN IF NOT EXISTS "currency" TEXT;
