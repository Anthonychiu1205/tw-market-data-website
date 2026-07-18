"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";
import { Link } from "@/src/i18n/navigation";

export function RegisterForm() {
  const t = useTranslations("authRegister");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginOrResetHint, setShowLoginOrResetHint] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setShowLoginOrResetHint(false);

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 8) {
      setErrorMessage(t("errors.passwordTooShort"));
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("errors.passwordMismatch"));
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

      const payload = (await response.json()) as { ok?: boolean; error?: string; code?: string; next?: string };

      if (!response.ok || !payload.ok) {
        const errorCode = payload.code ?? payload.error;
        if (errorCode === "email_service_not_configured") {
          setErrorMessage(t("errors.emailServiceNotConfigured"));
          return;
        }
        if (errorCode === "email_delivery_failed") {
          setErrorMessage(t("errors.emailDeliveryFailed"));
          return;
        }
        if (errorCode === "invalid_registration_input") {
          setErrorMessage(t("errors.invalidInput"));
          return;
        }
        if (errorCode === "registration_unavailable") {
          setErrorMessage(t("errors.unavailable"));
          return;
        }
        if (errorCode === "login_or_reset") {
          setErrorMessage(t("errors.loginOrReset"));
          setShowLoginOrResetHint(true);
          return;
        }
        setErrorMessage(t("errors.unavailable"));
        return;
      }

      if (payload.next === "login_or_reset") {
        setErrorMessage(t("errors.loginOrReset"));
        setShowLoginOrResetHint(true);
        return;
      }

      window.location.assign(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`);
    } catch {
      setErrorMessage(t("errors.unavailable"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="register-email" className="text-xs font-medium text-slate-700">
          {t("emailLabel")}
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
          {t("passwordLabel")}
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
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="register-confirm-password" className="text-xs font-medium text-slate-700">
          {t("confirmPasswordLabel")}
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
          placeholder={t("confirmPasswordPlaceholder")}
        />
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
      {showLoginOrResetHint ? (
        <p className="text-xs text-slate-600">
          <Link href="/login" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-800">
            {t("goToLogin")}
          </Link>
          <span className="mx-1">{t("or")}</span>
          <Link href="/forgot-password" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-800">
            {t("forgotPassword")}
          </Link>
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}>
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      <p className="text-center text-xs text-slate-500">
        {t("haveAccount")}
        <Link href="/login" className="ml-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
