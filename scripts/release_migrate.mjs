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
import { spawnSync } from "node:child_process";

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

// ── Preflight: migrations must not run through the pooler ────────────────────────────────────────
// `prisma migrate deploy` takes a pg_advisory_lock. An advisory lock cannot survive a transaction-
// mode pooler (pgbouncer): the connection it is taken on is not the one it is released on, so the
// lock wait times out → P1002, which is exactly how production deploys were failing. Prisma uses
// `directUrl` (DIRECT_DATABASE_URL) for migrate, so that must be the NON-pooled Neon host.
const directUrl = process.env.DIRECT_DATABASE_URL;

function isPooled(value) {
  return /-pooler\.|pgbouncer=true/i.test(value);
}

if (!directUrl) {
  // Not fatal: without it Prisma falls back to DATABASE_URL, which is what we are trying to avoid.
  // Warn loudly rather than hard-fail, so merging this before the env var is set cannot brick deploys
  // — but make it impossible to miss in the build log.
  console.warn(
    "[release-migrate] WARNING: DIRECT_DATABASE_URL is not set. Prisma will migrate over " +
      "DATABASE_URL, which is the POOLED endpoint — expect P1002 (advisory lock timeout). " +
      "Set DIRECT_DATABASE_URL to the Neon DIRECT (non '-pooler') connection string.",
  );
} else if (isPooled(directUrl)) {
  // A pooled URL here defeats the entire point, and would fail confusingly. Refuse.
  console.error(
    "[release-migrate] DIRECT_DATABASE_URL points at a POOLED endpoint (contains '-pooler' or " +
      "pgbouncer=true). Migrations cannot hold an advisory lock through the pooler. Use the Neon " +
      "DIRECT connection string.",
  );
  process.exit(1);
} else {
  try {
    const url = new URL(directUrl);
    log(`migrating over direct connection ${url.host}`);
  } catch {
    log("migrating over direct connection");
  }
}

// ── Apply, with one retry on P1002 ───────────────────────────────────────────────────────────────
// Even on a direct connection, a Neon cold start can make the first lock attempt time out. One
// backoff retry covers that without masking a real failure (a genuinely broken migration fails twice).
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 5000;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  // Capture output so we can inspect it for P1002, then echo it — the build log stays the audit
  // trail of what actually ran against production.
  // --no-install: run ONLY the prisma pinned in this project (6.x). Without it, npx would silently
  // fetch the latest major if resolution ever failed — and Prisma 7 rejects `url` in the datasource,
  // so it would fail confusingly (or worse, behave differently) against production.
  const result = spawnSync("npx", ["--no-install", "prisma", "migrate", "deploy"], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(output);

  if (result.status === 0) {
    log("migrations applied.");
    process.exit(0);
  }

  const isLockTimeout = /P1002|advisory lock|timed out/i.test(output);
  if (isLockTimeout && attempt < MAX_ATTEMPTS) {
    log(`P1002 / lock timeout on attempt ${attempt} — retrying in ${RETRY_DELAY_MS / 1000}s...`);
    sleep(RETRY_DELAY_MS);
    continue;
  }

  if (isLockTimeout) {
    console.error(
      "[release-migrate] P1002 again. This is the pooler symptom: confirm DIRECT_DATABASE_URL is " +
        "the Neon DIRECT (non '-pooler') connection string.",
    );
  }
  // Non-zero exit fails the build on purpose: better to abort the deploy than to serve code against
  // a database whose schema does not match it.
  console.error("[release-migrate] `prisma migrate deploy` FAILED — aborting the deploy.");
  process.exit(1);
}
