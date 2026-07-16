// Module-resolution hooks so the webhook acceptance tests can import the real source modules under
// `node --test`, exactly as they run in the app:
//   1. `server-only` / `client-only` — Next.js aliases these at build time; there is no node_module.
//      Stub them to an empty module (the tests run server-side, so the guard is a no-op here).
//   2. `@/x` path alias (tsconfig "paths") → the project root, with extensionless .ts resolution.
// Nothing is faked about the code under test — only the module resolver is taught the two things Next's
// bundler normally provides.
import { pathToFileURL, fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

export async function resolve(specifier, context, next) {
  if (specifier === "server-only" || specifier === "client-only") {
    return { url: "data:text/javascript,export{}", shortCircuit: true };
  }

  let spec = specifier;
  if (spec.startsWith("@/")) {
    spec = pathToFileURL(root + spec.slice(2)).href;
  }

  try {
    return await next(spec, context);
  } catch (error) {
    // Extensionless internal import (Next/tsc resolves these) → try the TypeScript extensions.
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      try {
        return await next(spec + ext, context);
      } catch {
        /* try next extension */
      }
    }
    throw error;
  }
}
