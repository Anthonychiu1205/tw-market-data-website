"use client";

import { useLocale } from "next-intl";

import { Link, usePathname } from "@/src/i18n/navigation";

// §2.4 language switcher. Renders a REAL <a> (next-intl Link) to the SAME page in the other locale.
// usePathname() returns the current path WITHOUT its locale prefix, so `href` + `locale` produce the
// mirrored URL (/en/pricing ↔ /zh-TW/pricing). Visiting the prefixed target makes proxy.ts pin the
// NEXT_LOCALE cookie, so the choice sticks on subsequent visits (§1.1 cookie).
type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "en" ? "zh-TW" : "en";
  // Show the OTHER language's endonym (same regardless of current locale).
  const label = other === "en" ? "EN" : "中文";
  const ariaLabel = other === "en" ? "Switch to English" : "切換為中文";

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other === "en" ? "en" : "zh-Hant"}
      aria-label={ariaLabel}
      className={
        className ??
        "inline-flex h-10 items-center rounded-md px-3 text-[15px] font-medium leading-6 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
      }
    >
      {label}
    </Link>
  );
}
