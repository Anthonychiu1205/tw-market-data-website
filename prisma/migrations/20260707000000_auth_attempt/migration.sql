-- Auth hardening: per-identifier attempt ledger for login brute-force + secret-reveal
-- throttling. Identifiers (email / userId / ip) are never stored in plaintext — the
-- application hashes scope+identifier into "bucket" (sha256) before writing. Rows are
-- disposable; the throttle windows only read recent rows. All throttle reads/writes are
-- fail-open in the app, so an empty/unavailable table never locks users out.
CREATE TABLE "AuthAttempt" (
    "id"        TEXT NOT NULL,
    "bucket"    TEXT NOT NULL,
    "outcome"   TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthAttempt_bucket_createdAt_idx" ON "AuthAttempt"("bucket", "createdAt");

-- CreateIndex
CREATE INDEX "AuthAttempt_createdAt_idx" ON "AuthAttempt"("createdAt");
