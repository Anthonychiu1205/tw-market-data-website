import { Prisma, type PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/auth/prisma";

export const runtime = "nodejs";

const REQUIRED_TABLES = [
  "User",
  "Account",
  "Session",
  "VerificationToken",
  "EmailVerificationCode",
  "PasswordResetToken",
  "ApiKey",
  "ApiUsageEvent",
  "CreditWallet",
  "CreditTransaction",
  "_prisma_migrations",
] as const;

type TableExistenceRow = {
  table_name: string;
};

type SelectOneRow = {
  value: number;
};

type MigrationSummaryRow = {
  migration_name: string;
};

type MigrationCountRow = {
  count: string;
};

function notFoundTextResponse() {
  return new Response("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function sanitizeError(error: unknown) {
  const name = error instanceof Error ? error.name : "UnknownError";
  const rawMessage = error instanceof Error ? error.message : "Unknown database error";
  const message = rawMessage
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[redacted-url]")
    .replace(/password\s*=\s*[^\s;]+/gi, "password=[redacted]")
    .slice(0, 240);

  return {
    name,
    message,
  };
}

function isAuthorized(request: Request, secret: string): boolean {
  const headerValue = request.headers.get("x-health-check-secret");
  if (!headerValue) {
    return false;
  }

  return headerValue === secret;
}

async function verifyConnection(client: PrismaClient) {
  await client.$queryRaw<SelectOneRow[]>(Prisma.sql`SELECT 1 AS value`);
}

async function checkTableExistence(client: PrismaClient) {
  const rows = await client.$queryRaw<TableExistenceRow[]>(Prisma.sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (${Prisma.join(REQUIRED_TABLES.map((tableName) => Prisma.sql`${tableName}`))})
  `);

  const existingTables = new Set(rows.map((row) => row.table_name));

  return REQUIRED_TABLES.reduce<Record<(typeof REQUIRED_TABLES)[number], boolean>>(
    (accumulator, tableName) => {
      accumulator[tableName] = existingTables.has(tableName);
      return accumulator;
    },
    {
      User: false,
      Account: false,
      Session: false,
      VerificationToken: false,
      EmailVerificationCode: false,
      PasswordResetToken: false,
      ApiKey: false,
      ApiUsageEvent: false,
      CreditWallet: false,
      CreditTransaction: false,
      _prisma_migrations: false,
    },
  );
}

async function loadMigrationSummary(client: PrismaClient, hasMigrationsTable: boolean) {
  if (!hasMigrationsTable) {
    return {
      latest: [] as string[],
      count: 0,
    };
  }

  const latestRows = await client.$queryRaw<MigrationSummaryRow[]>(Prisma.sql`
    SELECT migration_name
    FROM "_prisma_migrations"
    ORDER BY finished_at DESC NULLS LAST, started_at DESC
    LIMIT 5
  `);

  const countRows = await client.$queryRaw<MigrationCountRow[]>(Prisma.sql`
    SELECT COUNT(*)::text AS count
    FROM "_prisma_migrations"
  `);

  const count = Number(countRows[0]?.count ?? "0");

  return {
    latest: latestRows.map((row) => row.migration_name),
    count,
  };
}

export async function GET(request: Request) {
  const secret = process.env.DB_HEALTH_CHECK_SECRET?.trim();

  if (!secret) {
    return notFoundTextResponse();
  }

  if (!isAuthorized(request, secret)) {
    return notFoundTextResponse();
  }

  try {
    await verifyConnection(prisma);
    const tables = await checkTableExistence(prisma);
    const migrations = await loadMigrationSummary(prisma, tables._prisma_migrations);

    return NextResponse.json({
      ok: true,
      database: {
        connected: true,
      },
      tables,
      migrations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: {
          connected: false,
        },
        error: sanitizeError(error),
      },
      { status: 500 },
    );
  }
}
