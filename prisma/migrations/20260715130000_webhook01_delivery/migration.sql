-- WEBHOOK-01 Phase A · webhook台 delivery side.
-- The events_outbox itself lives in the read API's DB (A台, append-only). These tables are the
-- website-side delivery state: where to deliver (destinations/subscriptions), the per-attempt delivery
-- ledger, and the outbox poll cursor. Nothing here ever writes back to events_outbox.

-- CreateTable
CREATE TABLE "WebhookDestination" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'https',
    "encryptedSigningSecret" TEXT NOT NULL,
    "signingSecretVersion" TEXT NOT NULL DEFAULT 'v1',
    "secretRotatedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "disabledReason" TEXT,
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookSubscription" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "eventTypes" TEXT[],
    "symbolFilter" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "schemaVer" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "statusCode" INTEGER,
    "latencyMs" INTEGER,
    "error" TEXT,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstAttemptedAt" TIMESTAMP(3),
    "lastAttemptedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookOutboxCursor" (
    "source" TEXT NOT NULL,
    "lastCreatedAt" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookOutboxCursor_pkey" PRIMARY KEY ("source")
);

-- CreateIndex
CREATE INDEX "WebhookDestination_userId_idx" ON "WebhookDestination"("userId");

-- CreateIndex
CREATE INDEX "WebhookDestination_userId_status_idx" ON "WebhookDestination"("userId", "status");

-- CreateIndex
CREATE INDEX "WebhookDestination_status_idx" ON "WebhookDestination"("status");

-- CreateIndex
CREATE INDEX "WebhookSubscription_destinationId_idx" ON "WebhookSubscription"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookDelivery_eventId_destinationId_key" ON "WebhookDelivery"("eventId", "destinationId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_nextAttemptAt_idx" ON "WebhookDelivery"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "WebhookDelivery_destinationId_idx" ON "WebhookDelivery"("destinationId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_eventId_idx" ON "WebhookDelivery"("eventId");

-- AddForeignKey
ALTER TABLE "WebhookDestination" ADD CONSTRAINT "WebhookDestination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookSubscription" ADD CONSTRAINT "WebhookSubscription_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "WebhookDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "WebhookDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
