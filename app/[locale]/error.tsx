"use client";

import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Error</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">頁面發生錯誤</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
        請重新整理，或回到首頁。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={buttonClass("primary")}>重新整理</button>
        <Link href="/" className={buttonClass("secondary")}>回首頁</Link>
      </div>
    </main>
  );
}
