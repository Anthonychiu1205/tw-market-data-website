// Locale SSOT — dependency-free (no next-intl import) so pure consumers like detect-locale.ts run
// directly under `node --test`. routing.ts builds the next-intl routing from these same constants.
export const LOCALES = ["en", "zh-TW"] as const;
export type AppLocale = (typeof LOCALES)[number];

// zh-TW is the product's origin locale (the unprefixed root redirects here for TW visitors).
export const DEFAULT_LOCALE: AppLocale = "zh-TW";

// The x-default / fallback locale for unknown overseas visitors (SEO-01 ruling: mostly developers).
export const X_DEFAULT_LOCALE: AppLocale = "en";

// BCP-47 value for the <html lang> attribute (§2.3). zh-TW's script-qualified tag is zh-Hant, which
// matches the hreflang cluster; en stays en.
export const HTML_LANG: Record<AppLocale, string> = {
  en: "en",
  "zh-TW": "zh-Hant",
};
