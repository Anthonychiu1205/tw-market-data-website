"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { productMegaMenuColumns } from "../../content/mega-menu-links";
import { ContactModal } from "./contact-modal";
import { MarketingContainer } from "../ui/marketing-container";
import { buttonClass } from "../ui/button";

const navItems = [
  { href: "/product", label: "產品功能", withArrow: true, isMega: true },
  { href: "/pricing", label: "方案價格" },
  { href: "/docs", label: "文件" },
  { href: "/blog", label: "觀點文章" },
];

export function SiteHeader() {
  const { status } = useSession();
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
              onClick={() => setIsContactModalOpen(true)}
            >
            聯繫我們
            </button>
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" className={buttonClass("primary")}>
                  Dashboard
                </Link>
              </>
            ) : status === "loading" ? (
              <span className="inline-flex h-10 w-[160px] animate-pulse rounded-md bg-slate-200" aria-hidden="true" />
            ) : (
              <>
                <Link href="/login" className={buttonClass("secondary")}>
                  登入
                </Link>
                <Link href="/register" className={buttonClass("primary")}>
                  註冊
                </Link>
              </>
            )}
          </div>
        </MarketingContainer>
      </header>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}
