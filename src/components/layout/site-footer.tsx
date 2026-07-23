"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import { investmentDisclaimer } from "@/src/lib/legal/disclaimer";

import { LanguageSwitcher } from "./language-switcher";
import { Container } from "../ui/container";

const policyLinks = [
  { href: "/privacy", labelKey: "privacy" },
  { href: "/terms", labelKey: "terms" },
] as const;

const supportLinks = [{ href: "/help", labelKey: "help" }] as const;

type SiteFooterProps = {
  onContactClick: () => void;
};

export function SiteFooter({ onContactClick }: SiteFooterProps) {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    // The footer is the CLS *victim*, not the cause: the homepage used to suspend on its top-level data
    // fetches, so the route loading.tsx skeleton painted short and then the full page replaced it — the
    // footer jumped ~4700px. The fix is upstream (page.tsx streams its data regions into height-reserved
    // Suspense fallbacks; the route skeleton was removed) — so the footer needs no min-height of its own.
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col items-center justify-center gap-3 py-6">
        <p className="text-center text-xs text-slate-500">
          {investmentDisclaimer(locale === "en" ? "en" : "zh-TW")}
        </p>
        <div className="mx-auto flex flex-wrap items-center justify-center text-sm text-slate-600">
          {policyLinks.map((item) => (
            <span key={item.labelKey} className="inline-flex items-center">
              <Link href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {t(item.labelKey)}
              </Link>
              <span className="px-2 text-slate-600">|</span>
            </span>
          ))}
          {supportLinks.map((item) => (
            <span key={item.labelKey} className="inline-flex items-center">
              <Link href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {t(item.labelKey)}
              </Link>
              <span className="px-2 text-slate-600">|</span>
            </span>
          ))}
          <button
            type="button"
            onClick={onContactClick}
            className="text-sm text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {t("contact")}
          </button>
          <span className="px-2 text-slate-600">|</span>
          <LanguageSwitcher className="text-sm text-slate-600 transition hover:text-slate-900" />
          <span className="px-2 text-slate-600">|</span>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            TW Market Data © 2026
          </Link>
        </div>
      </Container>
    </footer>
  );
}
