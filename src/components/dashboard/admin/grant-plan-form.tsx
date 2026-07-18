"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { buttonClass } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { GRANTABLE_PLANS, type GrantPlanResult } from "@/src/lib/admin/access";
import { grantPlan } from "@/src/lib/admin/grant-plan-actions";

export function GrantPlanForm() {
  const t = useTranslations("account");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<string>("starter");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<GrantPlanResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setResult(null);
    try {
      const outcome = await grantPlan({ email, plan });
      setResult(outcome);
    } catch {
      setResult({ ok: false, detail: t("grantPlan.error") });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">{t("grantPlan.emailLabel")}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="off"
          placeholder="user@example.com"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">{t("grantPlan.planLabel")}</span>
        <select
          value={plan}
          onChange={(event) => setPlan(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          {GRANTABLE_PLANS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          buttonClass("primary", "h-12 w-full rounded-2xl px-5 text-sm font-semibold"),
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {pending ? t("grantPlan.processing") : t("grantPlan.submit")}
      </button>

      {result ? (
        result.ok ? (
          <div className="space-y-1 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-medium">{t("grantPlan.success")}</p>
            <p>plan：<span className="font-mono">{result.plan}</span></p>
            <p>subscription_id：<span className="font-mono">{result.subscriptionId ?? "—"}</span></p>
            <p>api_key_id：<span className="font-mono">{result.apiKeyId ?? "—"}</span></p>
          </div>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">{t("grantPlan.failed")}</p>
            <p className="mt-1 break-words">{result.detail}</p>
          </div>
        )
      ) : null}
    </form>
  );
}
