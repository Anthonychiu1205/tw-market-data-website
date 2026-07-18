"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { buttonClass } from "@/src/components/ui/button";
import {
  USER_ROLE_OPTIONS,
  USE_CASE_OPTIONS,
  type AccountProfileResponse,
} from "@/src/lib/account/profile-schema";

type AccountProfileFormProps = {
  email: string;
};

export function AccountProfileForm({ email }: AccountProfileFormProps) {
  const t = useTranslations("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [useCase, setUseCase] = useState("");
  const [googleLinked, setGoogleLinked] = useState(false);
  const [passwordConfigured, setPasswordConfigured] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch("/api/account/profile", { cache: "no-store" });
        const payload = (await response.json()) as { ok?: boolean; profile?: AccountProfileResponse; error?: string };

        if (!response.ok || !payload.ok || !payload.profile) {
          throw new Error(payload.error ?? "load_failed");
        }

        if (!active) return;
        setDisplayName(payload.profile.displayName ?? "");
        setCompanyName(payload.profile.companyName ?? "");
        setUserRole(payload.profile.userRole ?? "");
        setUseCase(payload.profile.useCase ?? "");
        setGoogleLinked(payload.profile.connectedAccounts.google);
        setPasswordConfigured(payload.profile.connectedAccounts.password);
      } catch {
        if (!active) return;
        setErrorMessage(t("profile.loadError"));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          companyName,
          userRole,
          useCase,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; profile?: AccountProfileResponse; error?: string };

      if (!response.ok || !payload.ok || !payload.profile) {
        throw new Error(payload.error ?? "save_failed");
      }

      setDisplayName(payload.profile.displayName ?? "");
      setCompanyName(payload.profile.companyName ?? "");
      setUserRole(payload.profile.userRole ?? "");
      setUseCase(payload.profile.useCase ?? "");
      setGoogleLinked(payload.profile.connectedAccounts.google);
      setPasswordConfigured(payload.profile.connectedAccounts.password);
      setSuccessMessage(t("profile.saveSuccess"));
    } catch {
      setErrorMessage(t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">{t("profile.email.label")}</span>
        <input
          value={email}
          readOnly
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500"
        />
      </div>

      <div className="grid gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-900">{t("profile.accountStatus")}</p>
        <p>{t("profile.google", { status: googleLinked ? t("profile.linked") : t("profile.notLinked") })}</p>
        <p>{t("profile.password", { status: passwordConfigured ? t("profile.configured") : t("profile.notConfigured") })}</p>
      </div>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">{t("profile.displayName.label")}</span>
        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          maxLength={80}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder={t("profile.displayName.placeholder")}
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">{t("profile.company.label")}</span>
        <input
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          maxLength={120}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder={t("profile.company.placeholder")}
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">{t("profile.role.label")}</span>
        <select
          value={userRole}
          onChange={(event) => setUserRole(event.target.value)}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        >
          <option value="">{t("profile.selectPlaceholder")}</option>
          {USER_ROLE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {t(`profile.roles.${value}`)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">{t("profile.useCase.label")}</span>
        <select
          value={useCase}
          onChange={(event) => setUseCase(event.target.value)}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        >
          <option value="">{t("profile.selectPlaceholder")}</option>
          {USE_CASE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {t(`profile.useCases.${value}`)}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || saving}
          className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}
        >
          {saving ? t("profile.saving") : t("profile.save")}
        </button>
        {successMessage ? <span className="text-xs text-emerald-700">{successMessage}</span> : null}
        {errorMessage ? <span className="text-xs text-red-600">{errorMessage}</span> : null}
      </div>
    </form>
  );
}
