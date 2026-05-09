import { createHash } from "node:crypto";

const baseUrl = (process.env.GATEWAY_SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiKey = process.env.GATEWAY_SMOKE_API_KEY?.trim() || "";
const deductionEnabled = String(process.env.PUBLIC_API_CREDITS_DEDUCTION_ENABLED || "").trim().toLowerCase() === "true";
const confirmed = String(process.env.CONFIRM_DEDUCTION_SMOKE || "").trim().toLowerCase() === "true";
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());

function maskApiKey(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "(missing)";
  if (trimmed.length <= 12) return `${trimmed.slice(0, 4)}••••`;
  return `${trimmed.slice(0, 10)}••••••`;
}

function maskEmail(email) {
  const normalized = String(email || "").trim();
  const [local, domain] = normalized.split("@");
  if (!local || !domain) return "(masked)";
  const maskedLocal = local.length <= 2 ? `${local[0] || "*"}*` : `${local.slice(0, 2)}***`;
  const [domainHead, ...domainTail] = domain.split(".");
  const maskedDomain = `${domainHead.slice(0, 1) || "*"}***`;
  return `${maskedLocal}@${maskedDomain}${domainTail.length ? ".***" : ""}`;
}

function getApiKeyHashSecret() {
  const explicit = process.env.API_KEY_HASH_SECRET?.trim();
  if (explicit) return explicit;
  const auth = process.env.AUTH_SECRET?.trim();
  if (auth) return auth;
  if (process.env.NODE_ENV === "production") {
    throw new Error("api_key_hash_secret_missing");
  }
  return "dev-only-api-key-hash-secret";
}

function hashApiKey(rawKey) {
  const secret = getApiKeyHashSecret();
  return createHash("sha256").update(`${secret}:${rawKey}`).digest("hex");
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

async function loadPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function loadApiKeyOwner(prisma, rawApiKey) {
  const keyHash = hashApiKey(rawApiKey);
  const key = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      userId: true,
      status: true,
      name: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!key) {
    throw new Error("api_key_not_found_in_db");
  }

  return {
    apiKeyId: key.id,
    userId: key.userId,
    status: key.status,
    name: key.name,
    userEmailMasked: maskEmail(key.user?.email || ""),
  };
}

async function loadWalletBalance(prisma, userId) {
  const wallet = await prisma.creditWallet.findUnique({
    where: { userId },
    select: {
      id: true,
      balance: true,
    },
  });

  return {
    walletId: wallet?.id || null,
    balance: wallet?.balance ?? 0,
  };
}

async function loadUsageTransactionByRequestId(prisma, requestId, userId) {
  return prisma.creditTransaction.findUnique({
    where: {
      merchantTradeNo: `usage:${requestId}`,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      status: true,
      credits: true,
      balanceAfter: true,
      merchantTradeNo: true,
      createdAt: true,
    },
  }).then((row) => {
    if (!row || row.userId !== userId) return null;
    return row;
  });
}

async function loadUsageEventByRequestId(prisma, requestId, userId) {
  return prisma.apiUsageEvent.findFirst({
    where: {
      requestId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      datasetSlug: true,
      statusCode: true,
      creditsCharged: true,
      errorCode: true,
      createdAt: true,
    },
  });
}

async function countUsageTransactionsByRequestId(prisma, requestId, userId) {
  return prisma.creditTransaction.count({
    where: {
      userId,
      merchantTradeNo: `usage:${requestId}`,
      type: "usage",
    },
  });
}

async function main() {
  const missingReasons = [];
  if (!deductionEnabled) missingReasons.push("PUBLIC_API_CREDITS_DEDUCTION_ENABLED!=true");
  if (!confirmed) missingReasons.push("CONFIRM_DEDUCTION_SMOKE!=true");
  if (!apiKey) missingReasons.push("GATEWAY_SMOKE_API_KEY missing");
  if (!hasDatabaseUrl) missingReasons.push("DATABASE_URL missing");

  if (missingReasons.length > 0) {
    console.log(`[SKIPPED] ${missingReasons.join(", ")}`);
    process.exit(0);
  }

  const prisma = await loadPrisma();

  try {
    const owner = await loadApiKeyOwner(prisma, apiKey);
    console.log(`[INFO] baseUrl=${baseUrl}`);
    console.log(`[INFO] apiKey=${maskApiKey(apiKey)}`);
    console.log(`[INFO] apiKeyName=${owner.name}`);
    console.log(`[INFO] apiKeyStatus=${owner.status}`);
    console.log(`[INFO] apiKeyOwner=${owner.userEmailMasked}`);

    if (owner.status !== "active") {
      console.error("[FAILED] API key is not active.");
      process.exit(1);
    }

    const beforeWallet = await loadWalletBalance(prisma, owner.userId);
    console.log(`[INFO] wallet-before=${beforeWallet.balance}`);

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

    if (requestId === "-") {
      console.error("[FAILED] missing X-Request-Id");
      process.exit(1);
    }

    if (response.status !== 200) {
      console.error("[FAILED] expected status=200 for deduction verification");
      process.exit(1);
    }

    if (dryRun !== "false") {
      console.error("[FAILED] expected X-TWMD-Dry-Run=false");
      process.exit(1);
    }

    if (creditsCharged !== "1") {
      console.error("[FAILED] expected X-TWMD-Credits-Charged=1");
      process.exit(1);
    }

    const afterWallet = await loadWalletBalance(prisma, owner.userId);
    console.log(`[INFO] wallet-after=${afterWallet.balance}`);
    console.log(`[INFO] wallet-delta=${afterWallet.balance - beforeWallet.balance}`);

    if (afterWallet.balance !== beforeWallet.balance - 1) {
      console.error("[FAILED] expected wallet after = wallet before - 1");
      process.exit(1);
    }

    const usageTransaction = await loadUsageTransactionByRequestId(prisma, requestId, owner.userId);
    if (!usageTransaction) {
      console.error("[FAILED] missing usage credit transaction for requestId");
      process.exit(1);
    }

    console.log(
      `[INFO] usage-transaction status=${usageTransaction.status} type=${usageTransaction.type} credits=${usageTransaction.credits}`,
    );

    if (usageTransaction.type !== "usage" || usageTransaction.status !== "completed" || usageTransaction.credits !== -1) {
      console.error("[FAILED] usage credit transaction fields are invalid");
      process.exit(1);
    }

    const usageEvent = await loadUsageEventByRequestId(prisma, requestId, owner.userId);
    if (!usageEvent) {
      console.error("[FAILED] missing ApiUsageEvent for requestId");
      process.exit(1);
    }

    console.log(
      `[INFO] usage-event statusCode=${usageEvent.statusCode} creditsCharged=${usageEvent.creditsCharged} errorCode=${usageEvent.errorCode ?? "-"}`,
    );

    if (usageEvent.statusCode !== 200) {
      console.error("[FAILED] expected ApiUsageEvent statusCode=200");
      process.exit(1);
    }

    const duplicateCount = await countUsageTransactionsByRequestId(prisma, requestId, owner.userId);
    console.log(`[INFO] idempotency-count usage-transactions-for-request=${duplicateCount}`);
    if (duplicateCount !== 1) {
      console.error("[FAILED] idempotency violation: duplicated usage transaction");
      process.exit(1);
    }

    console.log("[DONE] deduction smoke passed");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("[FAILED] smoke_gateway_deduction_mode");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
