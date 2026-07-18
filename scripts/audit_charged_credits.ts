// READ-ONLY audit of real usage credit charges (charged mode went live 2026-07-15).
// SELECT only — no writes. Lists every `type:"usage"` CreditTransaction in the window,
// masks emails, flags any NON-owner (real customer) charge, and cross-checks the charged
// amount against the authorized per-dataset cost (DATASET_CREDIT_COSTS, single source).
//
// Run (needs the PROD DATABASE_URL — a Sensitive Vercel var, so pass it explicitly):
//   DATABASE_URL='<prod-neon-url>' node --experimental-strip-types scripts/audit_charged_credits.ts
// Optional: AUDIT_SINCE_DAYS=4 (default 4) to widen the window.
import { PrismaClient } from "@prisma/client";
import { DATASET_CREDIT_COSTS } from "../src/lib/gateway/dataset-policies.ts";

const OWNER_EMAIL = (process.env.AUDIT_OWNER_EMAIL || "anthonyiaaan@gmail.com").toLowerCase();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required (pass the prod url explicitly). Aborting.");
  process.exit(1);
}

function maskEmail(v: string): string {
  if (!v || !v.includes("@")) return v || "(none)";
  const [l, d] = v.split("@");
  return `${l.length <= 2 ? (l[0] ?? "*") + "*" : l.slice(0, 2) + "***"}@${d}`;
}
function datasetOf(desc: string | null): string {
  const m = (desc ?? "").match(/API usage\s+([^·]+)\s+·/);
  return m?.[1]?.trim() || "(unparsed)";
}

const prisma = new PrismaClient();
const days = Number(process.env.AUDIT_SINCE_DAYS || "4");
const since = new Date(Date.now() - days * 24 * 3600 * 1000);
const costs = DATASET_CREDIT_COSTS as Record<string, number>;

const txns = await prisma.creditTransaction.findMany({
  where: { type: "usage", createdAt: { gte: since } },
  select: { userId: true, credits: true, description: true, status: true, createdAt: true },
  orderBy: { createdAt: "asc" },
});
const ids = [...new Set(txns.map((t) => t.userId))];
const users = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, email: true } });
const emailById = new Map(users.map((u) => [u.id, u.email ?? ""]));

let real = 0;
let mism = 0;
let tOwner = 0;
let tReal = 0;
console.log(`=== usage CreditTransactions since ${since.toISOString()} (n=${txns.length}) ===`);
for (const t of txns) {
  const email = emailById.get(t.userId) ?? "(unknown)";
  const owner = email.toLowerCase() === OWNER_EMAIL;
  const ds = datasetOf(t.description);
  const auth = costs[ds];
  const charged = Math.abs(t.credits);
  const ok = typeof auth === "number" ? auth === charged : "unknown-dataset";
  if (owner) {
    tOwner += charged;
  } else {
    real += 1;
    tReal += charged;
  }
  if (ok !== true) mism += 1;
  console.log(
    `${t.createdAt.toISOString()} | ${maskEmail(email)}${owner ? " (OWNER)" : " REAL-CUSTOMER!"} | ${ds} | charged=${charged} authorized=${auth ?? "?"} ${ok === true ? "OK" : "MISMATCH:" + ok} | ${t.status}`,
  );
}
console.log(`\n=== SUMMARY ===`);
console.log(`usage txns: ${txns.length} | distinct users: ${ids.length}`);
console.log(`owner charges: ${txns.length - real} txns (${tOwner} credits)`);
console.log(
  `REAL-CUSTOMER charges: ${real} txns (${tReal} credits) ${real === 0 ? "-> none (as expected)" : "-> REVIEW FOR REFUND"}`,
);
console.log(`cost-mismatch (charged != authorized): ${mism} ${mism === 0 ? "-> none" : "-> REVIEW"}`);
await prisma.$disconnect();
