import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALES } from "./locales";

// I18N-01 §1.2: en + zh-TW, both crawlable URL prefixes (/en/..., /zh-TW/...).
// zh-TW is the product's origin locale (defaultLocale). localePrefix "always" so BOTH locales carry
// a prefix — the unprefixed root ("/") is 307-redirected by proxy.ts to the detected locale (§2.9);
// crawlers get real per-locale URLs, never a geo redirect (§1.2). Detection lives in proxy.ts
// (detect-locale.ts, four-layer), so next-intl's own negotiation is disabled here.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: false,
});

export type { AppLocale } from "./locales";
