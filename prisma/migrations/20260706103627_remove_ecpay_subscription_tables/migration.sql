-- Remove the local ECPay subscription/payment tables. After the Polar migration the
-- website stores no subscription of its own: provisioning is owned by the shared
-- Polar webhook in the read API service, and the website reads plan/subscription
-- status from the backend. No paid users existed, so no data migration is needed.
DROP TABLE IF EXISTS "BillingPayment";
DROP TABLE IF EXISTS "Subscription";
