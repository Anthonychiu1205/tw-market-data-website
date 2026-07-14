#!/usr/bin/env node
/**
 * Release step: apply pending Prisma migrations before the app is built/served.
 *
 * Why this exists: the Vercel build was `prisma generate && next build` — it NEVER migrated. Every
 * schema change depended on someone remembering to run `prisma migrate deploy` by hand against prod.
 * Miss it once and the deployed code talks to a database that lacks the columns it expects, which
 * fails at runtime (e.g. an INSERT naming a column that does not exist → 500 on a paid webhook).
 *
 * WHY THIS IS GATED TO PRODUCTION
 * The project documents a single DATABASE_URL, so preview deployments very likely point at the SAME
 * database as production. If we migrated on every build, opening a PR would apply its migrations to
 * PROD while prod still runs the OLD code. A destructive migration (e.g. the amountTwd DROP COLUMN)
 * would then break live production before the code that tolerates it is merged — a worse outage than
 * the one this script prevents.
 *
 * So: migrate on production deploys only. If preview environments are later given their own database
 * (e.g. Neon branching), set MIGRATE_ON_BUILD=1 there to opt them in.
 *
 * Concurrency: `prisma migrate deploy` takes a Postgres advisory lock, so two deployments racing is
 * safe — one waits, and each migration is applied exactly once.
 *
 * ORDERING CAVEAT (worth knowing, not fixable here): Vercel applies this during the build, before
 * traffic cuts over, so for a brief window the OLD code runs against the NEW schema. Additive
 * migrations are fine. Destructive ones (DROP/RENAME) must therefore be done expand→contract:
 * ship the additive half, deploy, then drop in a LATER release.
 */
import { execFileSync } from "node:child_process";

const vercelEnv = process.env.VERCEL_ENV; // "production" | "preview" | "development"
const forced = process.env.MIGRATE_ON_BUILD === "1";
const skipped = process.env.SKIP_MIGRATIONS === "1";

function log(message) {
  console.log(`[release-migrate] ${message}`);
}

if (skipped) {
  log("SKIP_MIGRATIONS=1 — skipping migrations (deploying code only).");
  process.exit(0);
}

// Local `npm run build` must never touch a remote database as a side effect.
if (!vercelEnv && !forced) {
  log("not a Vercel deployment (VERCEL_ENV unset) — skipping. Use MIGRATE_ON_BUILD=1 to force.");
  process.exit(0);
}

if (vercelEnv && vercelEnv !== "production" && !forced) {
  log(
    `VERCEL_ENV=${vercelEnv} — skipping. Previews share the production database unless configured ` +
      `otherwise; migrating here would change prod before this code is merged. ` +
      `Set MIGRATE_ON_BUILD=1 once previews have their own database.`,
  );
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  // Fail loudly. Building without DATABASE_URL would ship code against an unmigrated/unknown DB —
  // exactly the silent failure mode this script exists to remove.
  console.error("[release-migrate] DATABASE_URL is not set — refusing to build a production deploy.");
  process.exit(1);
}

// Log which database we are about to migrate, with credentials stripped.
try {
  const url = new URL(process.env.DATABASE_URL);
  log(`applying migrations to ${url.host}${url.pathname} (VERCEL_ENV=${vercelEnv ?? "forced"})`);
} catch {
  log(`applying migrations (VERCEL_ENV=${vercelEnv ?? "forced"})`);
}

try {
  // Inherit stdio so the applied-migration list appears in the Vercel build log — that log is the
  // audit trail for what actually ran against production.
  execFileSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit" });
  log("migrations applied.");
} catch {
  // Non-zero exit fails the build on purpose: better to abort the deploy than to serve code against
  // a database whose schema does not match it.
  console.error("[release-migrate] `prisma migrate deploy` FAILED — aborting the deploy.");
  process.exit(1);
}
