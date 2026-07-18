"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { Link } from "@/src/i18n/navigation";
import { buttonClass } from "@/src/components/ui/button";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations("authReset");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (password.length < 8) {
      setErrorMessage(t("errorTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("errorMismatch"));
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
          setErrorMessage(t("errorExpired"))
          return;
        }
        if (payload.code === "invalid_password") {
          setErrorMessage(t("errorInvalidFormat"))
          return;
        }
        setErrorMessage(t("errorGeneric"))
        return;
      }

      window.location.assign(payload.redirectTo ?? "/login?reset=1");
    } catch {
      setErrorMessage(t("errorGeneric"))
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="reset-password" className="text-xs font-medium text-slate-700">
          {t("passwordLabel")}
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
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="reset-confirm-password" className="text-xs font-medium text-slate-700">
          {t("confirmLabel")}
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
          placeholder={t("confirmPlaceholder")}
        />
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}>
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      <p className="text-center text-xs text-slate-500">
        {t("backTo")}
        <Link href="/login" className="ml-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
