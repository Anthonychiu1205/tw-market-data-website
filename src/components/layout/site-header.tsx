"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getProductMegaMenuColumns } from "../../content/mega-menu-links";
import { LanguageSwitcher } from "./language-switcher";
import { MarketingContainer } from "../ui/marketing-container";
import { buttonClass } from "../ui/button";

type NavLabelKey = "product" | "pricing" | "docs" | "blog" | "resources" | "facts";

type NavItem = {
  href: string;
  labelKey: NavLabelKey;
  withArrow?: boolean;
  isMega?: boolean;
};

const navItems: NavItem[] = [
  { href: "/product", labelKey: "product", withArrow: true, isMega: true },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/docs", labelKey: "docs" },
];

// NAV-01: Blog + Market Facts live under a single "Resources" dropdown — no standalone Blog nav entry
// (avoids a duplicate entry point). These are real /blog and /facts links, crawlable and agent-friendly.
const resourcesItems: { href: string; labelKey: NavLabelKey }[] = [
  { href: "/blog", labelKey: "blog" },
  { href: "/facts", labelKey: "facts" },
];

const mobileNavItems: NavItem[] = [
  { href: "/pricing", labelKey: "pricing" },
  { href: "/docs", labelKey: "docs" },
];

type SiteHeaderProps = {
  onContactClick: () => void;
};

export function SiteHeader({ onContactClick }: SiteHeaderProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const productMegaMenuColumns = getProductMegaMenuColumns(locale === "en" ? "en" : "zh-TW");
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasHydratedRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesButtonRef = useRef<HTMLButtonElement | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const clearResourcesCloseTimer = useCallback(() => {
    if (!resourcesCloseTimerRef.current) return;
    clearTimeout(resourcesCloseTimerRef.current);
    resourcesCloseTimerRef.current = null;
  }, []);

  const openResourcesMenu = useCallback(() => {
    if (!hasHydratedRef.current) return;
    clearResourcesCloseTimer();
    setIsResourcesMenuOpen(true);
  }, [clearResourcesCloseTimer]);

  const scheduleCloseResourcesMenu = useCallback(() => {
    if (!hasHydratedRef.current) return;
    clearResourcesCloseTimer();
    resourcesCloseTimerRef.current = setTimeout(() => {
      setIsResourcesMenuOpen(false);
    }, 100);
  }, [clearResourcesCloseTimer]);

  const openProductsMenu = useCallback(() => {
    if (!hasHydratedRef.current) return;
    clearCloseTimer();
    setIsProductsMenuOpen(true);
  }, [clearCloseTimer]);

  const scheduleCloseProductsMenu = useCallback(() => {
    if (!hasHydratedRef.current) return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsProductsMenuOpen(false);
    }, 100);
  }, [clearCloseTimer]);

  useEffect(() => {
    hasHydratedRef.current = true;
    return () => {
      clearCloseTimer();
      clearResourcesCloseTimer();
    };
  }, [clearCloseTimer, clearResourcesCloseTimer]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <MarketingContainer className="grid grid-cols-[auto_1fr_auto] items-center gap-5 py-3">
        <div className="justify-self-start">
          <Link href="/" className="inline-flex items-center gap-2.5 text-base font-semibold tracking-tight text-slate-900">
            <Image
              src="/brand/logo-mark.png"
              alt="TW Market Data Logo"
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain"
              priority
            />
            <span>TW Market Data</span>
          </Link>
        </div>

        <div className="hidden justify-self-center md:block">
          <nav className="flex items-center gap-1">
            {navItems.map((item) =>
              item.isMega ? (
                <div
                  key={item.labelKey}
                  className="relative"
                  onMouseEnter={openProductsMenu}
                  onMouseLeave={scheduleCloseProductsMenu}
                  onFocusCapture={openProductsMenu}
                  onBlurCapture={(event) => {
                    const nextFocusedNode = event.relatedTarget as Node | null;
                    if (nextFocusedNode && event.currentTarget.contains(nextFocusedNode)) {
                      return;
                    }
                    scheduleCloseProductsMenu();
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isProductsMenuOpen}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[15px] font-medium leading-6 transition ${
                      isProductsMenuOpen
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {t(item.labelKey)}
                    {item.withArrow ? (
                      <span className={`text-xs transition-transform ${isProductsMenuOpen ? "rotate-180 text-slate-700" : "text-slate-500"}`}>
                        ▾
                      </span>
                    ) : null}
                  </button>

                  <div
                    className={`absolute left-1/2 top-full z-40 w-[940px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3 transition duration-150 ${
                      isProductsMenuOpen
                        ? "pointer-events-auto visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                      <div className="grid grid-cols-3 gap-x-14 gap-y-10">
                        {productMegaMenuColumns.map((column) => (
                          <div key={column.title}>
                            <p className="text-xs font-semibold tracking-wide text-slate-500">{column.title}</p>
                            <div className="mt-3 grid gap-y-3">
                              {column.items.map((entry) => (
                                <Link
                                  key={entry.title}
                                  href={entry.href}
                                  className="flex min-h-[76px] flex-col justify-start rounded-md px-2 py-1.5 transition hover:bg-slate-100"
                                >
                                  <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                                  <p className="mt-0.5 overflow-hidden text-xs leading-5 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                                    {entry.description}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[15px] font-medium leading-6 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {t(item.labelKey)}
                  {item.withArrow ? <span className="text-xs text-slate-500">▾</span> : null}
                </Link>
              ),
            )}

            {/* NAV-01: Resources dropdown — hover + click dual-trigger (touch-friendly), keyboard
                operable (Enter/Space toggles, Esc closes and returns focus, Tab walks the items), and
                real <a href> links so it stays crawlable and agent-friendly. */}
            <div
              className="relative"
              onMouseEnter={openResourcesMenu}
              onMouseLeave={scheduleCloseResourcesMenu}
              onFocusCapture={openResourcesMenu}
              onBlurCapture={(event) => {
                const nextFocusedNode = event.relatedTarget as Node | null;
                if (nextFocusedNode && event.currentTarget.contains(nextFocusedNode)) {
                  return;
                }
                scheduleCloseResourcesMenu();
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape" && isResourcesMenuOpen) {
                  setIsResourcesMenuOpen(false);
                  resourcesButtonRef.current?.focus();
                }
              }}
            >
              <button
                ref={resourcesButtonRef}
                type="button"
                aria-expanded={isResourcesMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsResourcesMenuOpen((previous) => !previous)}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[15px] font-medium leading-6 transition ${
                  isResourcesMenuOpen
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {t("resources")}
                <span className={`text-xs transition-transform ${isResourcesMenuOpen ? "rotate-180 text-slate-700" : "text-slate-500"}`}>
                  ▾
                </span>
              </button>

              <div
                role="menu"
                aria-label={t("resources")}
                className={`absolute left-1/2 top-full z-40 w-56 max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3 transition duration-150 ${
                  isResourcesMenuOpen
                    ? "pointer-events-auto visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible translate-y-1 opacity-0"
                }`}
              >
                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                  {resourcesItems.map((entry) => (
                    <Link
                      key={entry.labelKey}
                      href={entry.href}
                      role="menuitem"
                      onClick={() => setIsResourcesMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {t(entry.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>

          <div className="flex items-center justify-self-end gap-2">
            <LanguageSwitcher className="hidden h-9 items-center rounded-md border border-slate-200 px-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex" />
            <button
              type="button"
              className={buttonClass("secondary")}
              onClick={onContactClick}
            >
            {t("contact")}
            </button>
            <Link href="/login" className={`${buttonClass("primary")} hidden md:inline-flex`}>
              {t("dashboard")}
            </Link>
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="site-mobile-menu"
              aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => setIsMobileMenuOpen((previous) => !previous)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </MarketingContainer>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label={t("closeMenuBackdrop")}
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/45"
          />
          <div
            id="site-mobile-menu"
            className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col border-l border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4">
              <p className="text-sm font-semibold text-slate-900">{t("siteMap")}</p>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={t("closeMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 border-t border-slate-200 pt-4">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {t(item.labelKey)}
                </Link>
              ))}

              {/* NAV-01: on mobile the Resources dropdown collapses into the hamburger at the same level —
                  a labelled group with the same Blog + Market Facts links. */}
              <p className="px-3 pt-3 text-xs font-semibold tracking-wide text-slate-400">{t("resources")}</p>
              {resourcesItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
              <LanguageSwitcher
                className="flex w-full items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              />
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onContactClick();
                }}
                className={`${buttonClass("secondary")} w-full justify-center`}
              >
                {t("contact")}
              </button>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${buttonClass("primary")} w-full justify-center`}
              >
                {t("dashboard")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
