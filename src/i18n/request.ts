import { hasLocale, IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

// Loads the per-request locale + message catalog for Server Components. The locale comes from the
// [locale] route segment; an unknown value falls back to the default (never a raw-key render, §1.4).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,

    // Missing-key telemetry (§2 / §1.4). A missing message must NOT crash the render or leak a raw
    // key to users — log it (so it surfaces in server logs / can be shipped to telemetry) and render
    // a graceful fallback. CI additionally enforces en/zh key parity (see scripts) to catch these
    // before they ship.
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.warn(`[i18n] missing message (${locale}): ${error.message}`);
        return;
      }
      // Other IntlErrors (bad ICU syntax, etc.) are real bugs — surface them.
      console.error(`[i18n] ${error.code} (${locale}): ${error.message}`);
    },
    getMessageFallback({ key, namespace }) {
      const path = [namespace, key].filter(Boolean).join(".");
      // Human-neutral placeholder rather than a raw dotted key or a hard crash.
      return process.env.NODE_ENV === "production" ? "" : `⟨${path}⟩`;
    },
  };
});
