"use client";

import { FormEvent, useEffect, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";
import {
  USER_ROLE_OPTIONS,
  USE_CASE_OPTIONS,
  type AccountProfileResponse,
} from "@/src/lib/account/profile-schema";

type AccountProfileFormProps = {
  email: string;
};

const userRoleLabels: Record<(typeof USER_ROLE_OPTIONS)[number], string> = {
  developer: "AI Agent 開發",
  quant_researcher: "量化交易",
  data_team: "企業團隊",
  founder: "SaaS / 平台",
  other: "其他",
};

const useCaseLabels: Record<(typeof USE_CASE_OPTIONS)[number], string> = {
  ai_agent: "AI Agent",
  quantitative_research: "市場研究 / 回測",
  internal_data_tool: "內部資料平台",
  trading_workflow: "自動化交易",
  product_integration: "Dashboard / App",
  other: "其他",
};

export function AccountProfileForm({ email }: AccountProfileFormProps) {
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
        setErrorMessage("目前無法讀取帳戶資料，請稍後再試。");
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
      setSuccessMessage("帳戶資料已更新。");
    } catch {
      setErrorMessage("目前無法儲存帳戶資料，請稍後再試。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">電子郵件</span>
        <input
          value={email}
          readOnly
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500"
        />
      </div>

      <div className="grid gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-900">帳號狀態</p>
        <p>Google：{googleLinked ? "已連結" : "未連結"}</p>
        <p>Email/password：{passwordConfigured ? "已設定" : "未設定"}</p>
      </div>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">顯示名稱</span>
        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          maxLength={80}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="例如：Ant Wang"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">公司名稱</span>
        <input
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          maxLength={120}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="公司名稱（可選）"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">角色類型</span>
        <select
          value={userRole}
          onChange={(event) => setUserRole(event.target.value)}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        >
          <option value="">請選擇</option>
          {USER_ROLE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {userRoleLabels[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm text-slate-700">
        <span className="font-medium text-slate-900">主要使用情境</span>
        <select
          value={useCase}
          onChange={(event) => setUseCase(event.target.value)}
          disabled={loading || saving}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
        >
          <option value="">請選擇</option>
          {USE_CASE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {useCaseLabels[value]}
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
          {saving ? "儲存中..." : "儲存"}
        </button>
        {successMessage ? <span className="text-xs text-emerald-700">{successMessage}</span> : null}
        {errorMessage ? <span className="text-xs text-red-600">{errorMessage}</span> : null}
      </div>
    </form>
  );
}
