const baseUrl = (process.env.GATEWAY_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiKey = process.env.GATEWAY_SMOKE_API_KEY?.trim();
const deductionEnabled = String(process.env.PUBLIC_API_CREDITS_DEDUCTION_ENABLED || "").trim().toLowerCase() === "true";
const confirmed = String(process.env.CONFIRM_DEDUCTION_SMOKE || "").trim().toLowerCase() === "true";

function maskApiKey(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "(missing)";
  if (trimmed.length <= 12) return `${trimmed.slice(0, 4)}••••`;
  return `${trimmed.slice(0, 10)}••••••`;
}

async function parseJsonSafe(response) {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

function readHeader(response, name) {
  return response.headers.get(name) || "-";
}

function normalizeLocator() {
  const byEmail = process.env.USAGE_CHECK_USER_EMAIL?.trim();
  if (byEmail) {
    return { type: "email", value: byEmail.toLowerCase() };
  }
  const explicitPrefix = process.env.USAGE_CHECK_API_KEY_PREFIX?.trim();
  if (explicitPrefix) {
    return { type: "prefix", value: explicitPrefix };
  }
  if (apiKey) {
    return { type: "prefix", value: apiKey.slice(0, Math.min(20, apiKey.length)) };
  }
  return null;
}

async function loadWalletSnapshot() {
  if (!process.env.DATABASE_URL) {
    return { available: false, reason: "DATABASE_URL missing" };
  }

  const locator = normalizeLocator();
  if (!locator) {
    return { available: false, reason: "USAGE_CHECK_USER_EMAIL / USAGE_CHECK_API_KEY_PREFIX not set" };
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
      let userId = null;
      if (locator.type === "email") {
        const user = await prisma.user.findFirst({
          where: { email: locator.value },
          select: { id: true },
        });
        userId = user?.id || null;
      } else {
        const key = await prisma.apiKey.findFirst({
          where: { keyPrefix: locator.value },
          select: { userId: true },
        });
        userId = key?.userId || null;
      }

      if (!userId) {
        return { available: false, reason: "user not found for locator" };
      }

      const wallet = await prisma.creditWallet.findUnique({
        where: { userId },
        select: { balance: true },
      });

      return {
        available: true,
        userId,
        balance: wallet?.balance ?? 0,
      };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { available: false, reason: `wallet lookup failed: ${message}` };
  }
}

async function main() {
  if (!deductionEnabled || !confirmed) {
    console.log("[SKIPPED] deduction smoke is gated. Set PUBLIC_API_CREDITS_DEDUCTION_ENABLED=true and CONFIRM_DEDUCTION_SMOKE=true.");
    process.exit(0);
  }

  if (!apiKey) {
    console.log("[SKIPPED] GATEWAY_SMOKE_API_KEY is not set.");
    process.exit(0);
  }

  const before = await loadWalletSnapshot();
  if (before.available) {
    console.log(`[INFO] wallet-before=${before.balance}`);
  } else {
    console.log(`[INFO] wallet-before-unavailable: ${before.reason}`);
  }

  console.log(`[INFO] baseUrl=${baseUrl}`);
  console.log(`[INFO] apiKey=${maskApiKey(apiKey)}`);

  const response = await fetch(`${baseUrl}/v2/datasets/twse-daily-price?symbol=2330&limit=1`, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const body = await parseJsonSafe(response);
  const errorCode = typeof body?.error?.code === "string" ? body.error.code : "-";
  const requestId = readHeader(response, "x-request-id");
  const dryRun = readHeader(response, "x-twmd-dry-run");
  const creditsCost = readHeader(response, "x-twmd-credits-cost");
  const creditsCharged = readHeader(response, "x-twmd-credits-charged");

  console.log(`[RESULT] status=${response.status}`);
  console.log(`[RESULT] errorCode=${errorCode}`);
  console.log(`[RESULT] requestId=${requestId}`);
  console.log(`[RESULT] x-twmd-dry-run=${dryRun}`);
  console.log(`[RESULT] x-twmd-credits-cost=${creditsCost}`);
  console.log(`[RESULT] x-twmd-credits-charged=${creditsCharged}`);

  const after = await loadWalletSnapshot();
  if (after.available) {
    console.log(`[INFO] wallet-after=${after.balance}`);
    if (before.available) {
      console.log(`[INFO] wallet-delta=${after.balance - before.balance}`);
    }
  } else {
    console.log(`[INFO] wallet-after-unavailable: ${after.reason}`);
  }

  if (dryRun !== "false") {
    console.error("[FAILED] deduction mode expected X-TWMD-Dry-Run=false");
    process.exit(1);
  }

  if (requestId === "-") {
    console.error("[FAILED] missing X-Request-Id");
    process.exit(1);
  }

  console.log("[DONE] deduction smoke completed. Verify wallet delta and usage ledger manually if needed.");
}

main().catch((error) => {
  console.error("[FAILED] smoke_gateway_deduction_mode");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
