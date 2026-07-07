// Static assertion check for the auth-hardening pack (login throttle + secret-reveal
// throttle + constant-time login). This repo has no unit-test runner; following the
// existing scripts/check_*.mjs convention, we assert the hardening is structurally
// present and fail-open. Run: `npm run check:auth-throttle`.
import { existsSync, readFileSync, readdirSync } from "node:fs";

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`  ✗ ${message}`);
    failures += 1;
  } else {
    console.log(`  ✓ ${message}`);
  }
}
function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

// 1) throttle module: fail-open, hashed identifiers, no plaintext logging.
console.log("auth-throttle.ts");
const throttle = read("src/lib/auth/auth-throttle.ts");
assert(throttle.length > 0, "module exists");
assert(/createHash\(\s*["']sha256["']\s*\)/.test(throttle), "identifier is sha256-hashed (no plaintext)");
assert(/login_email/.test(throttle) && /login_ip/.test(throttle) && /secret_reveal/.test(throttle), "defines login_email, login_ip, secret_reveal policies");
// fail-open: isThrottled must catch and return blocked:false.
assert(/catch\s*\{[\s\S]*?blocked:\s*false[\s\S]*?\}/.test(throttle), "isThrottled is fail-open (catch → blocked:false)");
assert(/export async function recordFailure/.test(throttle), "exports recordFailure");
assert(/export async function clearFailures/.test(throttle), "exports clearFailures");
assert(!/console\./.test(throttle), "never logs (no console.* — cannot leak identifiers)");

// 2) constant-time placeholder hash.
console.log("email-password.ts");
const emailPw = read("src/lib/auth/email-password.ts");
assert(/export const INVALID_PLACEHOLDER_HASH\s*=/.test(emailPw), "exports INVALID_PLACEHOLDER_HASH");
assert(/INVALID_PLACEHOLDER_HASH\s*=\s*\n?\s*["']\$2[aby]\$/.test(emailPw), "placeholder is a valid bcrypt hash format");

// 3) password-login route wiring.
console.log("password-login route");
const login = read("app/api/auth/password-login/route.ts");
assert(/from "@\/src\/lib\/auth\/auth-throttle"/.test(login), "imports auth-throttle");
assert(/isThrottled\(\s*["']login_email["']/.test(login) && /isThrottled\(\s*["']login_ip["']/.test(login), "throttles on email + IP");
assert(/status:\s*429/.test(login) && /too_many_attempts/.test(login), "returns 429 too_many_attempts when blocked");
assert(/INVALID_PLACEHOLDER_HASH/.test(login), "uses INVALID_PLACEHOLDER_HASH for constant-time compare");
assert(/recordFailure\(/.test(login) && /clearFailures\(/.test(login), "records failures and clears on success");

// 4) secret-reveal route wiring.
console.log("api-keys secret route");
const secret = read("app/api/dashboard/api-keys/[id]/secret/route.ts");
assert(/from "@\/src\/lib\/auth\/auth-throttle"/.test(secret), "imports auth-throttle");
assert(/isThrottled\(\s*["']secret_reveal["']\s*,\s*session\.id\s*\)/.test(secret), "throttles secret_reveal per user (session.id)");
assert(/status:\s*429/.test(secret), "returns 429 when blocked");
assert(/no-store/.test(secret), "keeps Cache-Control: no-store");

// 5) schema model.
console.log("prisma schema");
const schema = read("prisma/schema.prisma");
assert(/model AuthAttempt \{/.test(schema), "AuthAttempt model exists");
assert(/bucket\s+String/.test(schema) && /outcome\s+String/.test(schema), "has bucket + outcome fields");
assert(/@@index\(\[bucket, createdAt\]\)/.test(schema), "has (bucket, createdAt) index");

// 6) migration file.
console.log("migration");
const migDir = "prisma/migrations";
const authMig = existsSync(migDir)
  ? readdirSync(migDir).find((d) => /auth_attempt/.test(d))
  : undefined;
assert(Boolean(authMig), "auth_attempt migration folder exists");
if (authMig) {
  const sql = read(`${migDir}/${authMig}/migration.sql`);
  assert(/CREATE TABLE "AuthAttempt"/.test(sql), "migration creates AuthAttempt table");
  assert(/AuthAttempt_bucket_createdAt_idx/.test(sql), "migration creates (bucket, createdAt) index");
}

console.log("");
if (failures > 0) {
  console.error(`auth-throttle check FAILED: ${failures} assertion(s)`);
  process.exit(1);
}
console.log("auth-throttle check passed.");
