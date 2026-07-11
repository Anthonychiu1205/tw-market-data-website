import { buildLlmsFullText } from "@/src/lib/docs/build-llms-full";

// /llms-full.txt — the full docs bundle for AI agents, auto-generated from the docs source at
// build time (was previously a pipeline-synced static file; ownership moved to the website so it
// covers the website's own guide + endpoint pages + dataset catalog). Never hand-maintained.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
