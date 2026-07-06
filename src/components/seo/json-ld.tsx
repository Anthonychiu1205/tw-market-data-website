import type { ReactElement } from "react";

type JsonLdData = Record<string, unknown>;

type JsonLdProps = {
  data: JsonLdData | JsonLdData[];
};

/**
 * Renders schema.org structured data as an invisible <script type="application/ld+json">.
 * This is metadata for search engines only — it produces no visible output and must not
 * affect layout or styling. Pass a single JSON-LD object or an array of them.
 */
export function JsonLd({ data }: JsonLdProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user-controlled HTML); this is the
      // standard way to embed JSON-LD in Next.js.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
