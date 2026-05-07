"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 8) {
      setErrorMessage("密碼至少需要 8 碼");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("兩次輸入的密碼不一致");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; code?: string };

      if (!response.ok || !payload.ok) {
        const errorCode = payload.code ?? payload.error;
        if (errorCode === "email_service_not_configured") {
          setErrorMessage("註冊信件服務尚未設定，請稍後再試。");
          return;
        }
        if (errorCode === "email_delivery_failed") {
          setErrorMessage("驗證碼寄送失敗，請稍後再試。");
          return;
        }
        if (errorCode === "invalid_registration_input") {
          setErrorMessage("請確認 email 與密碼格式。");
          return;
        }
        if (errorCode === "registration_unavailable") {
          setErrorMessage("目前無法完成註冊，請稍後再試。");
          return;
        }
        setErrorMessage("目前無法完成註冊，請稍後再試。");
        return;
      }

      window.location.assign(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`);
    } catch {
      setErrorMessage("目前無法完成註冊，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="register-email" className="text-xs font-medium text-slate-700">
          Email
        </label>
        <input
          id="register-email"
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
        <label htmlFor="register-password" className="text-xs font-medium text-slate-700">
          密碼
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="至少 8 碼"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="register-confirm-password" className="text-xs font-medium text-slate-700">
          確認密碼
        </label>
        <input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="再次輸入密碼"
        />
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}>
        {isSubmitting ? "送出中..." : "註冊並取得驗證碼"}
      </button>

      <p className="text-center text-xs text-slate-500">
        已經有帳戶？
        <Link href="/login" className="ml-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          登入
        </Link>
      </p>
    </form>
  );
}
