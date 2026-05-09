"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
  useTrackPageViews();

  const [consent, setConsent] = useState<boolean | null>(() => getAnalyticsConsentValue());
  const shouldShowBanner = consent === null;

  if (!shouldShowBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[65] w-[min(420px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
      <p className="text-xs font-medium text-slate-900">Analytics & Cookies</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        我們只使用產品分析來改善登入、API 與文件體驗，不用於廣告追蹤。
        <Link href="/privacy#analytics-cookies" className="ml-1 underline underline-offset-2">
          了解更多
        </Link>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setAnalyticsConsent(false);
            setConsent(false);
          }}
          className="h-8 rounded-md border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-100"
        >
          關閉分析
        </button>
        <button
          type="button"
          onClick={() => {
            setAnalyticsConsent(true);
            setConsent(true);
            if (hasAnalyticsConsent()) {
              void trackPage(window.location.pathname);
            }
          }}
          className="h-8 rounded-md bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          開啟分析
        </button>
      </div>
    </div>
  );
}
