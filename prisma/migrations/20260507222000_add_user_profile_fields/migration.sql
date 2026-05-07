-- AlterTable
ALTER TABLE "User"
ADD COLUMN "displayName" TEXT,
ADD COLUMN "companyName" TEXT,
ADD COLUMN "userRole" TEXT,
ADD COLUMN "useCase" TEXT,
ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
