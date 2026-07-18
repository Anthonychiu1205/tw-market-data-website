-- PERF-01 C: composite index for the hot dashboard/usage queries.
-- Every ApiUsageEvent read filters by (userId, createdAt range) and orders by createdAt DESC
-- (countBillableSince, getRecentApiUsageForUser, usageSummary, reconciliation). The existing
-- single-column indexes force a userId-scan-then-filter/sort; this composite serves the range
-- + ordering directly. Additive, non-destructive; brief write lock while the b-tree builds.
CREATE INDEX "ApiUsageEvent_userId_createdAt_idx" ON "ApiUsageEvent"("userId", "createdAt");
