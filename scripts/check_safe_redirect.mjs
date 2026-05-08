import { getSafeRedirectTarget } from "../src/lib/security/safe-redirect-impl.mjs";

const cases = [
  ["/dashboard", "/dashboard"],
  ["/dashboard/settings", "/dashboard/settings"],
  ["/pricing?plan=developer&billingCycle=monthly", "/pricing?plan=developer&billingCycle=monthly"],
  ["https://evil.com", "/dashboard"],
  ["//evil.com", "/dashboard"],
  ["%2F%2Fevil.com", "/dashboard"],
  ["javascript:alert(1)", "/dashboard"],
];

let hasFailure = false;

for (const [input, expected] of cases) {
  const actual = getSafeRedirectTarget(input, "/dashboard");
  if (actual !== expected) {
    hasFailure = true;
    console.error(`FAIL input=${input} expected=${expected} actual=${actual}`);
  }
}

if (hasFailure) {
  process.exit(1);
}

console.log("check:safe-redirect passed");
