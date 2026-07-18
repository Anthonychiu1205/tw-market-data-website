import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "packages/**/dist/**",
    // Node --test files use explicit .ts import specifiers (native type-stripping);
    // they run via `npm test`, not the app build, so keep them out of the app lint pass.
    "**/*.test.ts",
    // Ops scripts run via `node --experimental-strip-types` with explicit .ts imports;
    // not part of the app build/lint pass.
    "scripts/**/*.ts",
  ]),
]);

export default eslintConfig;
