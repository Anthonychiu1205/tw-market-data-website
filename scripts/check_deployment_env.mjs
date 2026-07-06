const REQUIRED_ALWAYS = ["AUTH_SECRET", "DATABASE_URL"];
const GOOGLE_PRIMARY = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
const GOOGLE_FALLBACK = ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"];
const OPTIONAL_AUTH_URL_KEYS = ["NEXTAUTH_URL", "AUTH_URL"];
const OPTIONAL_SITE_URL = "NEXT_PUBLIC_SITE_URL";
const POLAR_KEYS = [
  "POLAR_ACCESS_TOKEN",
  "POLAR_PRODUCT_ID_STARTER",
  "POLAR_PRODUCT_ID_PRO",
  "POLAR_PRODUCT_ID_MAX",
  "POLAR_PRODUCT_ID_DEVELOPER",
];

function hasValue(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeUrl(raw) {
  if (!raw) {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/$/, "");
  }

  if (trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")) {
    return `http://${trimmed}`.replace(/\/$/, "");
  }

  return `https://${trimmed}`.replace(/\/$/, "");
}

function isValidUrl(raw) {
  if (!raw) {
    return false;
  }
  try {
    new URL(raw);
    return true;
  } catch {
    return false;
  }
}

function printStatus(label, ok, detail = "") {
  const state = ok ? "OK" : "MISSING";
  const suffix = detail ? ` (${detail})` : "";
  console.log(`${state.padEnd(7)} ${label}${suffix}`);
}

function printInfo(label, detail) {
  console.log(`INFO    ${label}: ${detail}`);
}

const nodeEnv = process.env.NODE_ENV;
const vercelEnv = process.env.VERCEL_ENV;
const isProduction = nodeEnv === "production" || vercelEnv === "production";

console.log("=== Deployment Environment Check ===");
printInfo("NODE_ENV", nodeEnv || "(not set)");
printInfo("VERCEL_ENV", vercelEnv || "(not set)");

let failures = 0;

for (const key of REQUIRED_ALWAYS) {
  const ok = hasValue(key);
  printStatus(key, ok);
  if (!ok) {
    failures += 1;
  }
}

const hasPrimaryGoogle = GOOGLE_PRIMARY.every(hasValue);
const hasFallbackGoogle = GOOGLE_FALLBACK.every(hasValue);
const hasAnyGooglePair = hasPrimaryGoogle || hasFallbackGoogle;

printStatus(
  `${GOOGLE_PRIMARY.join(" + ")} OR ${GOOGLE_FALLBACK.join(" + ")}`,
  hasAnyGooglePair,
  hasPrimaryGoogle ? "using GOOGLE_CLIENT_*" : hasFallbackGoogle ? "using AUTH_GOOGLE_*" : "none",
);
if (!hasAnyGooglePair) {
  failures += 1;
}

const availableAuthUrls = OPTIONAL_AUTH_URL_KEYS.filter(hasValue);
printStatus("NEXTAUTH_URL or AUTH_URL", availableAuthUrls.length > 0, availableAuthUrls.join(", ") || "none");
if (availableAuthUrls.length === 0) {
  failures += 1;
}

for (const key of OPTIONAL_AUTH_URL_KEYS) {
  if (!hasValue(key)) {
    continue;
  }
  const normalized = normalizeUrl(process.env[key]);
  const valid = isValidUrl(normalized);
  printInfo(`${key} URL shape`, valid ? "valid" : "invalid");
  if (!valid) {
    failures += 1;
  }
}

if (isProduction) {
  const authUrlRaw = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "";
  const normalizedAuthUrl = normalizeUrl(authUrlRaw);
  const expected = "https://twmarketdata.com";
  const looksExpected = normalizedAuthUrl === expected;
  printInfo("Production auth URL target", looksExpected ? "matches twmarketdata.com" : `current=${normalizedAuthUrl || "(missing)"}`);
}

if (hasValue(OPTIONAL_SITE_URL)) {
  const normalizedSiteUrl = normalizeUrl(process.env[OPTIONAL_SITE_URL]);
  const valid = isValidUrl(normalizedSiteUrl);
  printStatus(OPTIONAL_SITE_URL, valid, valid ? "valid URL" : "invalid URL");
  if (!valid) {
    failures += 1;
  }
} else {
  printInfo(
    OPTIONAL_SITE_URL,
    "not set (optional for preview/dev because billing site URL can fallback to VERCEL_* variables)",
  );
}

for (const key of POLAR_KEYS) {
  const ok = hasValue(key);
  printStatus(key, ok);
  if (!ok) {
    failures += 1;
  }
}

const polarApiBase = (process.env.POLAR_API_BASE || "").trim();
if (polarApiBase) {
  printInfo("POLAR_API_BASE value", polarApiBase);
} else {
  printInfo("POLAR_API_BASE value", "not set (defaults to production https://api.polar.sh)");
}

if (failures > 0) {
  console.error(`\ncheck:deployment-env failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log("\ncheck:deployment-env passed");
