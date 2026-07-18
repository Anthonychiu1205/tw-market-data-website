"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { buttonClass } from "@/src/components/ui/button";

// Bug ② (2026-07-13): the 刪除 button was a bare <button> with no onClick — it fired no request at
// all. It now runs the real deletion: POST /api/account/delete → DELETE /v2/self-serve/account
// ({"confirm":"DELETE"}), which removes the API account + keys, then the website login (otherwise
// onboarding/start, being create-or-get, would resurrect the account on the next visit).
//
// The API's response discloses what it RETAINS for legal/tax reasons; we render those items and
// billing.note verbatim rather than paraphrasing a legal disclosure.
//
// Fallback: while the endpoint is not deployed (production still answers `allow: GET` on that path)
// the route returns not_implemented and we show the support-request path — never a dead button.

const SUPPORT_EMAIL = "avenra.platform@gmail.com";

type RetainedItem = { label: string; detail?: string };
type DeleteResult = { retained: RetainedItem[]; billingNote: string | null; localDeleted: boolean };

export function DeleteAccountCard({ email }: { email: string }) {
  const t = useTranslations("account");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<DeleteResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsSupportFallback, setNeedsSupportFallback] = useState(false);

  const subject = encodeURIComponent(t("delete.mailSubject"));
  const body = encodeURIComponent(t("delete.mailBody", { email }));

  function close() {
    setIsOpen(false);
    setErrorMessage(null);
    setNeedsSupportFallback(false);
    // If the account was deleted, the session is stale — send the user out.
    if (result) window.location.href = "/";
  }

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    setErrorMessage(null);
    setNeedsSupportFallback(false);

    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as
        | (DeleteResult & { ok?: boolean; error?: string })
        | null;

      if (response.status === 501 || payload?.error === "not_implemented") {
        // Endpoint not live yet — offer the working support path instead of failing silently.
        setNeedsSupportFallback(true);
        return;
      }
      if (!response.ok || !payload?.ok) {
        throw new Error("delete_failed");
      }

      setResult({
        retained: payload.retained ?? [],
        billingNote: payload.billingNote ?? null,
        localDeleted: payload.localDeleted ?? true,
      });
    } catch {
      setErrorMessage(t("delete.error"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-slate-900">{t("delete.title")}</p>
          <p className="mt-0.5 text-xs text-slate-500">{t("delete.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={buttonClass("danger-secondary", "h-9 rounded-lg px-4 text-xs")}
        >
          {t("delete.button")}
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5">
            {result ? (
              // Deleted. Show exactly what the API says it retains.
              <>
                <h3 className="text-base font-semibold text-slate-900">{t("delete.done.title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("delete.done.body")}
                </p>

                {result.retained.length > 0 ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-medium text-slate-900">{t("delete.done.retainedTitle")}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-5 text-slate-600">
                      {result.retained.map((item) => (
                        <li key={item.label}>
                          {item.label}
                          {item.detail ? <span className="text-slate-500">：{item.detail}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {result.billingNote ? (
                  <p className="mt-3 text-xs leading-5 text-slate-600">{result.billingNote}</p>
                ) : null}

                {!result.localDeleted ? (
                  <p className="mt-3 text-xs leading-5 text-amber-700">
                    {t("delete.done.localNotDeleted", { email: SUPPORT_EMAIL })}
                  </p>
                ) : null}

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}
                  >
                    {t("delete.done.close")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-slate-900">{t("delete.title")}</h3>

                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    {t.rich("delete.confirm.body", {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </p>
                  <p className="text-xs text-slate-500">{t("delete.confirm.account", { email })}</p>
                  <p className="text-xs text-slate-500">
                    {t("delete.confirm.retentionNote")}
                  </p>
                </div>

                {needsSupportFallback ? (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                    {t("delete.confirm.fallback")}
                  </div>
                ) : null}
                {errorMessage ? <p className="mt-3 text-xs text-red-600">{errorMessage}</p> : null}

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={close}
                    disabled={isDeleting}
                    className={buttonClass("secondary", "h-10 rounded-lg px-4 text-sm")}
                  >
                    {t("delete.confirm.cancel")}
                  </button>
                  {needsSupportFallback ? (
                    <a
                      href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`}
                      className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}
                    >
                      {t("delete.confirm.submitRequest")}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      disabled={isDeleting}
                      className={buttonClass("danger-secondary", "h-10 rounded-lg px-4 text-sm")}
                    >
                      {isDeleting ? t("delete.confirm.deleting") : t("delete.confirm.confirm")}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
