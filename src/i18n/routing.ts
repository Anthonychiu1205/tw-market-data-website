import { defineRouting } from "next-intl/routing";

// I18N-01 §1.2: en + zh-TW, both crawlable URL prefixes (/en/..., /zh-TW/...).
// zh-TW is the product's origin locale (defaultLocale). localePrefix "always" so BOTH locales carry
// a prefix — the unprefixed root ("/") is 307-redirected by middleware to the detected locale (§2.9);
// crawlers get real per-locale URLs, never a geo redirect (§1.2).
export const routing = defineRouting({
  locales: ["en", "zh-TW"],
  defaultLocale: "zh-TW",
  localePrefix: "always",
  // We detect the locale ourselves in proxy.ts (cookie → geo → Accept-Language → en) and pin it,
  // so next-intl's own Accept-Language negotiation is disabled to keep detection in one place.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
