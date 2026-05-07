"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";

type PasswordLoginFormProps = {
  callbackPath: string;
};

export function PasswordLoginForm({ callbackPath }: PasswordLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitUrl = useMemo(() => {
    const params = new URLSearchParams({ next: callbackPath });
    return `/api/auth/password-login?${params.toString()}`;
  }, [callbackPath]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        redirectTo?: string;
        requiresVerification?: boolean;
      };

      if (payload.requiresVerification) {
        window.location.assign(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        return;
      }

      if (!response.ok || !payload.ok) {
        setErrorMessage("帳號或密碼錯誤，請重新確認。")
        return;
      }

      window.location.assign(payload.redirectTo ?? "/dashboard");
    } catch {
      setErrorMessage("目前無法登入，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="login-email" className="text-xs font-medium text-slate-700">
          Email
        </label>
        <input
          id="login-email"
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
        <label htmlFor="login-password" className="text-xs font-medium text-slate-700">
          密碼
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="至少 8 碼"
        />
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}> 
        {isSubmitting ? "登入中..." : "使用 Email 登入"}
      </button>

      <p className="text-center text-xs text-slate-500">
        還沒有帳戶？
        <Link href="/register" className="ml-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          註冊
        </Link>
      </p>
    </form>
  );
}
