"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Link } from "@/src/i18n/navigation";
import {
  getAnalyticsConsentValue,
  hasAnalyticsConsent,
  setAnalyticsConsent,
} from "@/src/lib/analytics/consent";
import { trackPage } from "@/src/lib/analytics/client";

function useTrackPageViews() {
  const pathname = usePathname();

  useEffect(() => {
    void trackPage(pathname);
  }, [pathname]);
}

export function AnalyticsControls() {
  const t = useTranslations("cookieBanner");
  useTrackPageViews();

  const storedConsent = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    () => getAnalyticsConsentValue(),
    () => null,
  );
  const [localConsent, setLocalConsent] = useState<boolean | null>(null);
  const consent = localConsent ?? storedConsent;

  // COOKIE-CONSENT-01. The banner is client-only: it renders nothing until mounted.
  //
  // The consent decision lives in localStorage, which the server cannot read — and these pages are
  // PRERENDERED (setRequestLocale enables static rendering; 215 zh-TW pages ship as static HTML).
  // A prerendered file is one document shared by every visitor, so it can never encode "this person
  // already consented": the banner was baked into the HTML, painted on load, then removed by JS after
  // hydration. That flash is what users saw as "the banner comes back every time".
  //
  // Mirroring the decision into a cookie would not fix it here — reading a cookie during render opts
  // the whole locale subtree out of static generation, turning every prerendered page into a
  // per-request render. That is a large cost to pay for a cosmetic flash, so the render TIMING is
  // moved instead: nothing is emitted server-side, and returning visitors never see the banner at all.
  //
  // The storage logic below is untouched — this only changes when the banner is allowed to render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldShowBanner = mounted && consent === null;

  if (!shouldShowBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[65] w-[min(420px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
      <p className="text-xs font-medium text-slate-900">{t("title")}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        {t("description")}
        <Link href="/privacy#analytics-cookies" className="ml-1 underline underline-offset-2">
          {t("learnMore")}
        </Link>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setAnalyticsConsent(false);
            setLocalConsent(false);
          }}
          className="h-8 min-w-[88px] rounded-md border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-100"
        >
          {t("decline")}
        </button>
        <button
          type="button"
          onClick={() => {
            setAnalyticsConsent(true);
            setLocalConsent(true);
            if (hasAnalyticsConsent()) {
              void trackPage(window.location.pathname);
            }
          }}
          className="h-8 min-w-[138px] rounded-md bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          {t("acceptAll")}
        </button>
      </div>
    </div>
  );
}
