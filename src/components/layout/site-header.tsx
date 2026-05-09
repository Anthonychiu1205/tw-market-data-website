"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

import { productMegaMenuColumns } from "../../content/mega-menu-links";
import { MarketingContainer } from "../ui/marketing-container";
import { buttonClass } from "../ui/button";

const navItems = [
  { href: "/product", label: "產品功能", withArrow: true, isMega: true },
  { href: "/pricing", label: "方案價格" },
  { href: "/docs", label: "文件" },
  { href: "/blog", label: "觀點文章" },
];

const mobileNavItems = [
  { href: "/pricing", label: "方案價格" },
  { href: "/docs", label: "文件" },
  { href: "/blog", label: "觀點文章" },
];

type SiteHeaderProps = {
  onContactClick: () => void;
};

export function SiteHeader({ onContactClick }: SiteHeaderProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasHydratedRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

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
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

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
                  key={item.label}
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
                    {item.label}
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
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[15px] font-medium leading-6 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                  {item.withArrow ? <span className="text-xs text-slate-500">▾</span> : null}
                </Link>
              ),
            )}
          </nav>
        </div>

          <div className="flex items-center justify-self-end gap-2">
            <button
              type="button"
              className={buttonClass("secondary")}
              onClick={onContactClick}
            >
            聯繫我們
            </button>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={`${buttonClass("primary")} hidden md:inline-flex`}>
                  儀表板
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className={`${buttonClass("secondary")} hidden md:inline-flex`}>
                  登入
                </Link>
                <Link href="/register" className={`${buttonClass("primary")} hidden md:inline-flex`}>
                  註冊
                </Link>
              </>
            )}
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="site-mobile-menu"
              aria-label={isMobileMenuOpen ? "關閉選單" : "開啟選單"}
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
            aria-label="關閉選單背景"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/45"
          />
          <div
            id="site-mobile-menu"
            className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col border-l border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4">
              <p className="text-sm font-semibold text-slate-900">網站導覽</p>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="關閉選單"
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
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${buttonClass("primary")} w-full justify-center`}
                >
                  儀表板
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${buttonClass("secondary")} w-full justify-center`}
                  >
                    登入
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${buttonClass("primary")} w-full justify-center`}
                  >
                    註冊
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
