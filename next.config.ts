import path from "node:path";

import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// I18N-01: point next-intl at the request config (locale + messages per request).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isProduction = process.env.NODE_ENV === "production";

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  // Polar inline embedded checkout renders its hosted checkout in an iframe. The
  // PRODUCTION checkout session is served on the BARE domain (https://polar.sh/checkout/...),
  // which a "*.polar.sh" wildcard does NOT match — so polar.sh must be listed explicitly,
  // otherwise the browser blocks the iframe ("this content is blocked").
  "frame-src 'self' https://polar.sh https://*.polar.sh",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Keep unsafe-inline/unsafe-eval for current Next runtime/hydration compatibility.
  // We can tighten this later with nonce/hash-based policies.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://polar.sh https://*.polar.sh",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
];

const contentSecurityPolicy = cspDirectives.join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Static export now generates every page twice (en + zh-TW). On slow/local disks a few
  // content-heavy pages (docs/[...slug]) can exceed the 60s default and fail after 3 retries;
  // Vercel's build infra finishes them well under this. Raise the ceiling for build reliability.
  staticPageGenerationTimeout: 300,
  // Root agent-resources (llms.txt, llms-full.txt, openapi.*) live at the domain root by convention —
  // they are NOT localized. A locale-prefixed request (e.g. /zh-TW/llms.txt, which a reader may guess
  // from the docs URL) would otherwise 404; redirect it to the canonical root path.
  async redirects() {
    return [
      { source: "/:locale(en|zh-TW)/llms.txt", destination: "/llms.txt", permanent: true },
      { source: "/:locale(en|zh-TW)/llms-full.txt", destination: "/llms-full.txt", permanent: true },
      { source: "/:locale(en|zh-TW)/openapi.:ext(json|yaml)", destination: "/openapi.:ext", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
