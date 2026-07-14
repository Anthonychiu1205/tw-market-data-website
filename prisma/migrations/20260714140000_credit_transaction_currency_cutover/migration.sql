-- P0-B currency cutover: CreditTransaction.amountTwd -> amountMinor + currency.
--
-- Safe in either merge order relative to P0-A: the ADDs are IF NOT EXISTS (P0-A may already have
-- added them) and the DROP is IF EXISTS.
ALTER TABLE "CreditTransaction" ADD COLUMN IF NOT EXISTS "amountMinor" INTEGER;
ALTER TABLE "CreditTransaction" ADD COLUMN IF NOT EXISTS "currency" TEXT;

-- Backfill legacy rows. These were charged in NEW TAIWAN DOLLARS, so they are preserved AS TWD —
-- they are NOT relabelled as USD. Relabelling would silently restate a NT$500 charge as $500, a
-- ~32x overstatement of what the customer actually paid. amountTwd held MAJOR units (whole dollars),
-- so it is multiplied by 100 to become minor units, consistent with the new column.
UPDATE "CreditTransaction"
SET "amountMinor" = "amountTwd" * 100,
    "currency"    = 'TWD'
WHERE "amountTwd" IS NOT NULL
  AND "amountMinor" IS NULL;

-- Any row already written by the new code (P0-A) carries its own currency and is untouched above.
-- Default the currency only where an amount exists but no currency was recorded.
UPDATE "CreditTransaction"
SET "currency" = 'USD'
WHERE "amountMinor" IS NOT NULL
  AND "currency" IS NULL;

ALTER TABLE "CreditTransaction" DROP COLUMN IF EXISTS "amountTwd";
