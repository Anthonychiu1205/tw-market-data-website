// i18n / hreflang foundation for SEO-01 §3 (bilingual architecture).
//
// Scope note: this is the SCAFFOLD. The zh-Hant site lives at the site root (`/`); English
// pages live under `/en/*`. A full migration to per-locale `<html lang>` would move every route
// under an `app/[locale]/` segment — that is intentionally out of scope here. Until then, English
// pages set content language on a wrapper element (`lang="en"`) and rely on hreflang + content
// signals; the root <html lang="zh-Hant"> stays until the [locale] migration lands.

export const locales = ["zh-Hant", "en"] as const;
export type Locale = (typeof locales)[number];

// zh-Hant is the site default (root path). x-default points at English, because an unlocalized
// visitor (largely global developers per the work order) is best served the English landing.
export const defaultLocale: Locale = "zh-Hant";
export const xDefaultLocale: Locale = "en";

// Single switch for the /en homepage pair. While false, the English homepage is noindex (draft,
// awaiting Cowork content) AND the zh homepage does NOT emit hreflang to it — so there is no
// "hreflang points to noindex URL" warning. Flip to true once app/en/page.tsx content slots are
// filled: it turns on EN indexing and activates the reciprocal hreflang cluster in one place.
export const EN_HOMEPAGE_READY = false;

/**
 * Map a zh-Hant path to its English counterpart under /en.
 *  "/"            -> "/en"
 *  "/docs/intro"  -> "/en/docs/intro"
 */
export function toEnglishPath(zhPath: string): string {
  if (zhPath === "/") return "/en";
  const normalized = zhPath.startsWith("/") ? zhPath : `/${zhPath}`;
  return `/en${normalized}`;
}

/**
 * Build the Next.js `alternates.languages` map for a pair of pages so each side declares
 * reciprocal hreflang (zh-Hant, en, and x-default=en). Values are root-relative; Next resolves
 * them against `metadataBase`.
 *
 * Pass the zh path; the English path is derived (or overridden). Use on BOTH the zh page and its
 * /en counterpart so the hreflang cluster is symmetric — a one-sided hreflang is ignored by Google.
 */
export function hreflangLanguages(zhPath: string, enPath: string = toEnglishPath(zhPath)): Record<string, string> {
  return {
    "zh-Hant": zhPath,
    en: enPath,
    "x-default": enPath,
  };
}
