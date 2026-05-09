const confirmed = String(process.env.CONFIRM_SEED_TEST_WALLET || "").trim().toLowerCase() === "true";
const databaseUrl = process.env.DATABASE_URL?.trim();
const userEmail = process.env.SEED_WALLET_USER_EMAIL?.trim().toLowerCase();
const creditsRaw = process.env.SEED_WALLET_CREDITS?.trim();
const isProductionRuntime = String(process.env.NODE_ENV || "").trim().toLowerCase() === "production";
const allowProductionTestScripts =
  String(process.env.ALLOW_PRODUCTION_TEST_SCRIPTS || "").trim().toLowerCase() === "true";

function maskEmail(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return "(masked)";
  const [domainHead, ...domainTail] = domain.split(".");
  const maskedLocal = local.length <= 2 ? `${local[0] || "*"}*` : `${local.slice(0, 2)}***`;
  const maskedDomain = `${domainHead.slice(0, 1) || "*"}***`;
  return `${maskedLocal}@${maskedDomain}${domainTail.length ? ".***" : ""}`;
}

async function main() {
  if (isProductionRuntime && !allowProductionTestScripts) {
    console.error("[BLOCKED] seed script is disabled in production runtime.");
    console.error("[BLOCKED] set ALLOW_PRODUCTION_TEST_SCRIPTS=true only for controlled emergency operations.");
    process.exit(1);
  }

  const missing = [];
  if (!confirmed) missing.push("CONFIRM_SEED_TEST_WALLET!=true");
  if (!databaseUrl) missing.push("DATABASE_URL missing");
  if (!userEmail) missing.push("SEED_WALLET_USER_EMAIL missing");
  if (!creditsRaw) missing.push("SEED_WALLET_CREDITS missing");

  const credits = Number.parseInt(String(creditsRaw ?? ""), 10);
  if (!Number.isFinite(credits) || credits <= 0) {
    missing.push("SEED_WALLET_CREDITS must be a positive integer");
  }

  if (missing.length > 0) {
    console.log(`[SKIPPED] ${missing.join(", ")}`);
    process.exit(0);
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
      select: { id: true, email: true },
    });

    if (!user) {
      console.error("[FAILED] target user not found for seed operation.");
      process.exit(1);
    }

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.creditWallet.upsert({
        where: { userId: user.id },
        update: {
          balance: {
            increment: credits,
          },
        },
        create: {
          userId: user.id,
          balance: credits,
        },
        select: {
          id: true,
          balance: true,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          walletId: wallet.id,
          type: "adjustment",
          status: "completed",
          amountTwd: null,
          credits,
          balanceAfter: wallet.balance,
          provider: "manual_test_seed",
          merchantTradeNo: null,
          providerTradeNo: null,
          packageCode: null,
          description: "Manual test seed",
        },
      });

      return wallet;
    });

    console.log(`[DONE] seeded credits=${credits} walletBalance=${result.balance} user=${maskEmail(user.email ?? userEmail)}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("[FAILED] seed_test_wallet_credits");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
