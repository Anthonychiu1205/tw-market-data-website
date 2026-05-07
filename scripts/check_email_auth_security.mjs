import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir, files = []) {
  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const schemaPath = "prisma/schema.prisma";
const schema = readFileSync(schemaPath, "utf8");

assert(schema.includes("passwordHash"), "User.passwordHash is missing in prisma/schema.prisma");
assert(schema.includes("emailVerifiedAt"), "User.emailVerifiedAt is missing in prisma/schema.prisma");
assert(schema.includes("model EmailVerificationCode"), "EmailVerificationCode model is missing in prisma/schema.prisma");
assert(schema.includes("codeHash"), "EmailVerificationCode.codeHash is missing");
assert(!/\n\s*code\s+String/.test(schema), "EmailVerificationCode must not store plaintext `code` field");
assert(schema.includes("pendingPasswordHash"), "EmailVerificationCode.pendingPasswordHash is missing");
assert(schema.includes("model PasswordResetToken"), "PasswordResetToken model is missing in prisma/schema.prisma");
assert(schema.includes("tokenHash"), "PasswordResetToken.tokenHash is missing");
const passwordResetBlockMatch = schema.match(/model PasswordResetToken \{[\s\S]*?\n\}/);
assert(passwordResetBlockMatch, "Unable to read PasswordResetToken model block");
assert(
  !/\n\s*token\s+String/.test(passwordResetBlockMatch[0]),
  "PasswordResetToken must not store plaintext `token` field",
);

const routeFiles = [
  "app/api/auth/register/route.ts",
  "app/api/auth/verify-email/route.ts",
  "app/api/auth/password-login/route.ts",
  "app/api/auth/resend-verification/route.ts",
  "app/api/auth/forgot-password/route.ts",
  "app/api/auth/reset-password/route.ts",
];

for (const file of routeFiles) {
  const content = readFileSync(file, "utf8");
  assert(!/console\.log\s*\([^\n]*(password|code|token)/i.test(content), `Sensitive console.log found in ${file}`);
  assert(!/console\.error\s*\([^\n]*(password|code|token)/i.test(content), `Sensitive console.error found in ${file}`);
}

const staticDir = ".next/static";
assert(existsSync(staticDir), "Missing .next/static. Run npm run build first.");

const leakedClientPatterns = ["RESEND_API_KEY", "demo@twmd.local", "demo-password"];
const clientMatches = [];
for (const file of walk(staticDir)) {
  const content = readFileSync(file, "utf8");
  for (const pattern of leakedClientPatterns) {
    if (content.includes(pattern)) {
      clientMatches.push({ file, pattern });
    }
  }
}

if (clientMatches.length > 0) {
  console.error("Potential sensitive token leakage in client build output:");
  for (const item of clientMatches) {
    console.error(`- ${item.pattern} in ${item.file}`);
  }
  process.exit(1);
}

console.log("check:email-auth-security passed");
