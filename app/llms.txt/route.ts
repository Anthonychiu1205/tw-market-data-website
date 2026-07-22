import { buildLlmsText } from "@/src/lib/docs/build-llms";

// /llms.txt — the compact machine-readable index for AI agents, generated from the storefront catalog
// SSOT at build time (was previously a static file synced from the backend; ownership moved to the
// website so it reflects exactly what the site sells and can never drift). Root-level, not localized.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
