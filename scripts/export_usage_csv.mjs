import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const LIMIT = 500;

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("[SKIPPED] DATABASE_URL is not set.");
    process.exit(0);
  }

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.apiUsageEvent.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: LIMIT,
      select: {
        requestId: true,
        datasetSlug: true,
        statusCode: true,
        creditsCharged: true,
        latencyMs: true,
        createdAt: true,
      },
    });

    const header = ["requestId", "dataset", "status", "credits", "latencyMs", "createdAt"];
    const lines = [header.join(",")];

    for (const row of rows) {
      lines.push([
        csvEscape(row.requestId),
        csvEscape(row.datasetSlug),
        csvEscape(row.statusCode),
        csvEscape(row.creditsCharged),
        csvEscape(row.latencyMs ?? ""),
        csvEscape(row.createdAt.toISOString()),
      ].join(","));
    }

    const artifactsDir = path.join(process.cwd(), "artifacts");
    await fs.mkdir(artifactsDir, { recursive: true });

    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const outputPath = path.join(artifactsDir, `usage_export_${stamp}.csv`);
    await fs.writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");

    console.log(`[DONE] exported ${rows.length} rows to ${outputPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[FAILED] export_usage_csv");
  console.error(message);
  process.exit(1);
});
