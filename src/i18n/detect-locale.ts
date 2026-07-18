import { LOCALES, type AppLocale } from "./locales.ts";

function isAppLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export type LocaleSignals = {
  /** NEXT_LOCALE cookie value (set once on first visit). */
  cookieLocale?: string | null;
  /** x-vercel-ip-country header (edge geo). */
  geoCountry?: string | null;
  /** Accept-Language header. */
  acceptLanguage?: string | null;
};

/**
 * I18N-01 §1.1 four-layer locale detection, in priority order:
 *   1. NEXT_LOCALE cookie (a returning visitor's choice always wins)
 *   2. x-vercel-ip-country === "TW"  → zh-TW
 *   3. Accept-Language contains a Traditional-Chinese tag (zh-Hant / zh-TW / zh-HK / zh-MO) → zh-TW
 *   4. otherwise → en
 *
 * Geo + Accept-Language are consulted ONLY when there is no cookie — the middleware judges once on
 * first visit and then pins the choice via the cookie, so per-request geo never breaks static caching
 * and crawlers are never geo-redirected (§1.1 / §1.2). Pure + deterministic for §3.1 unit tests.
 */
export function detectLocale(signals: LocaleSignals): AppLocale {
  if (isAppLocale(signals.cookieLocale)) {
    return signals.cookieLocale;
  }
  if ((signals.geoCountry ?? "").trim().toUpperCase() === "TW") {
    return "zh-TW";
  }
  const acceptLanguage = (signals.acceptLanguage ?? "").toLowerCase();
  if (/zh-hant|zh-tw|zh-hk|zh-mo/.test(acceptLanguage)) {
    return "zh-TW";
  }
  return "en";
}

/** The locale prefix a pathname starts with, or null when it has none. */
export function localeFromPathname(pathname: string): AppLocale | null {
  const segment = pathname.split("/")[1];
  return isAppLocale(segment) ? segment : null;
}
