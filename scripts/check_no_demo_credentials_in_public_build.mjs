import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const TARGET_DIRS = [".next/server", ".next/static"];
const BANNED_PATTERNS = [
  "demo@twmd.local",
  "demo-password",
  "DEMO_USER_EMAIL",
  "DEMO_USER_PASSWORD",
  "開發環境憑證",
  "本機開發用憑證",
];

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

const matches = [];

for (const targetDir of TARGET_DIRS) {
  if (!existsSync(targetDir)) {
    console.error(`Missing build directory: ${targetDir}. Run npm run build first.`);
    process.exit(1);
  }

  for (const file of walk(targetDir)) {
    const buffer = readFileSync(file);
    const content = buffer.toString("utf8");

    for (const pattern of BANNED_PATTERNS) {
      if (content.includes(pattern)) {
        matches.push({ file, pattern });
      }
    }
  }
}

if (matches.length > 0) {
  console.error("Found banned demo credential tokens in production build output:");
  for (const match of matches) {
    console.error(`- ${match.pattern} in ${match.file}`);
  }
  process.exit(1);
}

console.log("check:public-secrets passed");
