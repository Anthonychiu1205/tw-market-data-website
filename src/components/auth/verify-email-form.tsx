"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";

type VerifyEmailFormProps = {
  initialEmail: string;
};

export function VerifyEmailForm({ initialEmail }: VerifyEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          code,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; redirectTo?: string };

      if (!response.ok || !payload.ok) {
        if (payload.error === "too_many_attempts") {
          setErrorMessage("驗證失敗次數過多，請重新寄送驗證碼後再試。");
          return;
        }
        if (payload.error === "code_expired") {
          setErrorMessage("驗證碼已過期，請重新寄送。");
          return;
        }
        setErrorMessage("驗證碼不正確，請重新確認。")
        return;
      }

      window.location.assign(payload.redirectTo ?? "/dashboard");
    } catch {
      setErrorMessage("目前無法完成驗證，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (isResending) return;

    setIsResending(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setErrorMessage("目前無法重新寄送驗證碼，請稍後再試。");
        return;
      }

      setInfoMessage("若信箱可驗證，驗證碼已重新寄出。請檢查收件匣。")
    } catch {
      setErrorMessage("目前無法重新寄送驗證碼，請稍後再試。");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleVerify}>
      <div className="grid gap-1">
        <label htmlFor="verify-email" className="text-xs font-medium text-slate-700">
          Email
        </label>
        <input
          id="verify-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="you@company.com"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="verify-code" className="text-xs font-medium text-slate-700">
          6 位數驗證碼
        </label>
        <input
          id="verify-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          required
          value={code}
          maxLength={6}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="000000"
        />
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
      {infoMessage ? <p className="text-xs text-emerald-700">{infoMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}> 
        {isSubmitting ? "驗證中..." : "驗證並登入"}
      </button>

      <button type="button" disabled={isResending} onClick={handleResend} className={buttonClass("secondary", "h-11 text-sm")}>
        {isResending ? "寄送中..." : "重新寄送驗證碼"}
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
