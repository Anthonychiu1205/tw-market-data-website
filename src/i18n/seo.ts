import type { Metadata } from "next";

import { X_DEFAULT_LOCALE, type AppLocale } from "./locales";

// Open Graph locale tag per app locale.
export const OG_LOCALE: Record<AppLocale, string> = {
  en: "en_US",
  "zh-TW": "zh_TW",
};

// Root-relative localized path. "/" → "/en" or "/zh-TW"; "/pricing" → "/en/pricing".
export function localizedPath(locale: AppLocale, pathname: string): string {
  const clean = pathname === "/" ? "" : pathname;
  return `/${locale}${clean}`;
}

/**
 * Central hreflang + canonical builder for per-page metadata (§2.1 canonical self-ref, §2.2 hreflang
 * cluster zh-Hant + en + x-default=en). Pass the LOGICAL pathname (no locale prefix), e.g. "/pricing"
 * or "/". Values are root-relative; Next resolves them against metadataBase.
 *
 * Use on BOTH locales of a page (each generateMetadata call passes its own `locale`) so the cluster
 * is symmetric — a one-sided hreflang is ignored by Google.
 */
export function buildAlternates(locale: AppLocale, pathname: string): Metadata["alternates"] {
  return {
    canonical: localizedPath(locale, pathname),
    languages: {
      "zh-Hant": localizedPath("zh-TW", pathname),
      en: localizedPath("en", pathname),
      "x-default": localizedPath(X_DEFAULT_LOCALE, pathname),
    },
  };
}
