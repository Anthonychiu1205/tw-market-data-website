"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import type { ReactNode } from "react";

import { cn } from "@/src/lib/cn";

type GoogleSignInButtonProps = {
  callbackUrl?: string;
  className?: string;
  children?: ReactNode;
};

export function GoogleSignInButton({ callbackUrl = "/dashboard", className, children }: GoogleSignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleSignIn() {
    if (isPending) return;
    setIsPending(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isPending}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      <span aria-hidden="true" className="inline-flex h-[18px] w-[18px] items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.25h2.91c1.7-1.56 2.69-3.86 2.69-6.6z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.25c-.81.54-1.85.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.32A9 9 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.95 10.7a5.41 5.41 0 0 1 0-3.4V4.98H.96a9 9 0 0 0 0 8.04l2.99-2.32z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A8.98 8.98 0 0 0 9 0a9 9 0 0 0-8.04 4.98L3.95 7.3C4.66 5.16 6.65 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
      </span>
      <span>{children ?? (isPending ? "登入中..." : "使用 Google 登入")}</span>
    </button>
  );
}
