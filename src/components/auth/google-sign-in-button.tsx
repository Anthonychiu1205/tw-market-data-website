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
        "h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {children ?? (isPending ? "登入中..." : "使用 Google 登入")}
    </button>
  );
}
