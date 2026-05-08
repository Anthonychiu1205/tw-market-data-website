import { PrismaClient } from "@prisma/client";

const email = process.env.USAGE_CHECK_USER_EMAIL?.trim().toLowerCase() || "";
const keyPrefix = process.env.USAGE_CHECK_API_KEY_PREFIX?.trim() || "";

function maskEmail(value) {
  if (!value.includes("@")) return value || "(missing)";
  const [local, domain] = value.split("@");
  const safeLocal = local.length <= 2 ? `${local[0] || "*"}*` : `${local.slice(0, 2)}***`;
  return `${safeLocal}@${domain}`;
}

function maskPrefix(value) {
  if (!value) return "(missing)";
  if (value.length <= 8) return `${value.slice(0, 4)}••••`;
  return `${value.slice(0, 8)}••••`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("[SKIPPED] DATABASE_URL is not set.");
    process.exit(0);
  }

  if (!email && !keyPrefix) {
    console.log("[SKIPPED] Set USAGE_CHECK_USER_EMAIL or USAGE_CHECK_API_KEY_PREFIX.");
    process.exit(0);
  }

  const prisma = new PrismaClient();
  try {
    let targetUserId = null;

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      targetUserId = user?.id ?? null;
      console.log(`[INFO] userEmail=${maskEmail(email)} found=${Boolean(targetUserId)}`);
    }

    if (!targetUserId && keyPrefix) {
      const apiKey = await prisma.apiKey.findFirst({
        where: { keyPrefix: { startsWith: keyPrefix } },
        select: { userId: true, keyPrefix: true },
        orderBy: [{ updatedAt: "desc" }],
      });
      targetUserId = apiKey?.userId ?? null;
      console.log(`[INFO] apiKeyPrefix=${maskPrefix(keyPrefix)} found=${Boolean(targetUserId)}`);
    }

    if (!targetUserId) {
      console.log("[EMPTY] Cannot resolve target user.");
      process.exit(0);
    }

    const rows = await prisma.apiUsageEvent.findMany({
      where: { userId: targetUserId },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
      select: {
        createdAt: true,
        datasetSlug: true,
        statusCode: true,
        creditsCharged: true,
        requestId: true,
        errorCode: true,
        latencyMs: true,
      },
    });

    if (rows.length === 0) {
      console.log("[EMPTY] No usage events found.");
      process.exit(0);
    }

    console.log(`[INFO] recentEvents=${rows.length}`);
    for (const row of rows) {
      console.log(
        JSON.stringify({
          createdAt: row.createdAt.toISOString(),
          datasetSlug: row.datasetSlug,
          statusCode: row.statusCode,
          creditsCharged: row.creditsCharged,
          requestId: row.requestId,
          errorCode: row.errorCode,
          latencyMs: row.latencyMs,
        }),
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[FAILED] check_usage_ledger");
  console.error(message);
  process.exit(1);
});
