"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useMemo, useState } from "react";

import { Link } from "@/src/i18n/navigation";
import { buttonClass } from "@/src/components/ui/button";

type PasswordLoginFormProps = {
  callbackPath: string;
};

export function PasswordLoginForm({ callbackPath }: PasswordLoginFormProps) {
  const t = useTranslations("authLogin");
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
        setErrorMessage(t("errorInvalidCredentials"))
        return;
      }

      window.location.assign(payload.redirectTo ?? "/dashboard");
    } catch {
      setErrorMessage(t("errorUnavailable"));
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
          {t("passwordLabel")}
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
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "h-11 text-sm")}> 
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      <p className="text-center text-xs text-slate-500">
        <Link href="/forgot-password" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          {t("forgotPassword")}
        </Link>
      </p>

      <p className="text-center text-xs text-slate-500">
        {t("noAccount")}
        <Link href="/register" className="ml-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
          {t("register")}
        </Link>
      </p>
    </form>
  );
}
