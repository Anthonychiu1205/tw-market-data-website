"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setInfoMessage(null);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      setInfoMessage("如果此 Email 已註冊，我們會寄出重設密碼連結。");
    } catch {
      setInfoMessage("如果此 Email 已註冊，我們會寄出重設密碼連結。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="forgot-email" className="text-xs font-medium text-slate-700">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="you@company.com"
        />
      </div>

      {infoMessage ? <p className="text-xs text-slate-600">{infoMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}>
        {isSubmitting ? "寄送中..." : "寄送重設密碼信"}
      </button>

      <p className="text-center text-xs text-slate-500">
        回到
        <Link href="/login" className="ml-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          登入
        </Link>
      </p>
    </form>
  );
}
