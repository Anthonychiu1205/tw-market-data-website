"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (password.length < 8) {
      setErrorMessage("密碼至少需要 8 碼");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("兩次輸入的密碼不一致");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; code?: string; redirectTo?: string };
      if (!response.ok || !payload.ok) {
        if (payload.code === "invalid_or_expired_token") {
          setErrorMessage("重設連結已失效，請重新申請。")
          return;
        }
        if (payload.code === "invalid_password") {
          setErrorMessage("請確認密碼格式（至少 8 碼）。")
          return;
        }
        setErrorMessage("目前無法重設密碼，請稍後再試。")
        return;
      }

      window.location.assign(payload.redirectTo ?? "/login?reset=1");
    } catch {
      setErrorMessage("目前無法重設密碼，請稍後再試。")
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="reset-password" className="text-xs font-medium text-slate-700">
          新密碼
        </label>
        <input
          id="reset-password"
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
        <label htmlFor="reset-confirm-password" className="text-xs font-medium text-slate-700">
          確認密碼
        </label>
        <input
          id="reset-confirm-password"
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
        {isSubmitting ? "處理中..." : "重設密碼"}
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
