-- CreateTable
CREATE TABLE "ApiUsageEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "datasetSlug" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "symbol" TEXT,
    "creditsCharged" INTEGER NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "latencyMs" INTEGER,
    "requestId" TEXT NOT NULL,
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiUsageEvent_userId_idx" ON "ApiUsageEvent"("userId");

-- CreateIndex
CREATE INDEX "ApiUsageEvent_apiKeyId_idx" ON "ApiUsageEvent"("apiKeyId");

-- CreateIndex
CREATE INDEX "ApiUsageEvent_datasetSlug_idx" ON "ApiUsageEvent"("datasetSlug");

-- CreateIndex
CREATE INDEX "ApiUsageEvent_createdAt_idx" ON "ApiUsageEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ApiUsageEvent_requestId_idx" ON "ApiUsageEvent"("requestId");

-- AddForeignKey
ALTER TABLE "ApiUsageEvent" ADD CONSTRAINT "ApiUsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageEvent" ADD CONSTRAINT "ApiUsageEvent_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
