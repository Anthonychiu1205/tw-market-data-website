"use client";

import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<DeleteResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsSupportFallback, setNeedsSupportFallback] = useState(false);

  const subject = encodeURIComponent("帳號刪除申請 (Account deletion request)");
  const body = encodeURIComponent(
    `我要求刪除我的 TW Market Data 帳號。\n\n帳號 Email：${email}\n`,
  );

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
      setErrorMessage("目前無法刪除帳號，請稍後再試，或聯繫我們協助處理。");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-slate-900">刪除帳號</p>
          <p className="mt-0.5 text-xs text-slate-500">刪除後 API 金鑰將被撤銷，且無法復原。</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={buttonClass("danger-secondary", "h-9 rounded-lg px-4 text-xs")}
        >
          刪除
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5">
            {result ? (
              // Deleted. Show exactly what the API says it retains.
              <>
                <h3 className="text-base font-semibold text-slate-900">帳號已刪除</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  你的帳號與 API 金鑰已刪除，金鑰即刻失效。
                </p>

                {result.retained.length > 0 ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-medium text-slate-900">依法保留的資料</p>
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
                    API 帳號已刪除，但網站登入資料未能一併移除。請聯繫 {SUPPORT_EMAIL} 讓我們手動清除。
                  </p>
                ) : null}

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}
                  >
                    完成
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-slate-900">刪除帳號</h3>

                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    這個動作<strong>無法復原</strong>。你的帳號與 API 金鑰會被刪除，金鑰即刻失效、無法再呼叫 API。
                  </p>
                  <p className="text-xs text-slate-500">帳號：{email}</p>
                  <p className="text-xs text-slate-500">
                    依稅務／會計法令必須保留的交易與發票紀錄，會在刪除後向你列出。
                  </p>
                </div>

                {needsSupportFallback ? (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                    自助刪除目前尚未開放。請點下方送出刪除申請，我們會人工處理並回信確認。
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
                    取消
                  </button>
                  {needsSupportFallback ? (
                    <a
                      href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`}
                      className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}
                    >
                      送出刪除申請
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      disabled={isDeleting}
                      className={buttonClass("danger-secondary", "h-10 rounded-lg px-4 text-sm")}
                    >
                      {isDeleting ? "刪除中…" : "確認刪除"}
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
