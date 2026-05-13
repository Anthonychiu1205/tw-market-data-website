import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const DEFAULT_EMAIL = "dev@twmarketdata.local";
const DEFAULT_PASSWORD = "DevTest123456!";
const BCRYPT_ROUNDS = 12;

function maskEmail(email) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  if (name.length <= 2) return `${name[0] ?? "*"}*@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
}

function assertSafeRuntime() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("seed-dev-user is blocked in production runtime.");
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  let hostname = "";
  try {
    hostname = new URL(databaseUrl).hostname.toLowerCase();
  } catch {
    throw new Error("DATABASE_URL is invalid.");
  }

  const safeHostPatterns = [
    "localhost",
    "127.0.0.1",
    "::1",
    ".local",
    "dev",
    "test",
    "staging",
    "sandbox",
  ];

  const isSafeHost = safeHostPatterns.some((pattern) =>
    pattern.startsWith(".") ? hostname.endsWith(pattern) : hostname.includes(pattern),
  );

  if (!isSafeHost) {
    throw new Error(
      `DATABASE_URL host '${hostname}' is not recognized as local/dev/test. Refusing to seed.`,
    );
  }
}

async function main() {
  assertSafeRuntime();

  const email = (process.env.SEED_DEV_USER_EMAIL?.trim().toLowerCase() || DEFAULT_EMAIL);
  const password = process.env.SEED_DEV_USER_PASSWORD || DEFAULT_PASSWORD;

  if (!email || !email.includes("@")) {
    throw new Error("SEED_DEV_USER_EMAIL is invalid.");
  }
  if (!password || password.length < 8) {
    throw new Error("SEED_DEV_USER_PASSWORD must be at least 8 chars.");
  }

  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  const now = new Date();
  const prisma = new PrismaClient();

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, createdAt: true },
    });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          emailVerified: now,
          emailVerifiedAt: now,
        },
      });
      console.log(`[DONE] updated dev user ${maskEmail(email)}`);
    } else {
      await prisma.user.create({
        data: {
          email,
          name: "Local Dev User",
          role: "user",
          passwordHash,
          emailVerified: now,
          emailVerifiedAt: now,
        },
      });
      console.log(`[DONE] created dev user ${maskEmail(email)}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("[FAILED] seed-dev-user");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
