"use client";

import { useState } from "react";

import { buttonClass } from "@/src/components/ui/button";

// Bug ② (2026-07-13): the 刪除 button was a bare <button> with no onClick — it fired no request and
// did nothing (a dead button). There is also NO account-deletion endpoint yet: neither on the
// website (app/api has no account delete route) nor a known backend one.
//
// We deliberately do NOT half-implement deletion here. Deleting only the website login while the
// API-side account and its keys keep existing would be a dishonest "deleted" — a data-rights
// problem, not just a UX one. Until the backend deletion endpoint ships, this gives the user a real,
// honest path: an explicit confirmation of what happens, and a working request channel.
//
// TODO(A台): replace the mailto with a call to the account-deletion endpoint once it exists
// (delete API account + keys + website user; disclose what is retained for legal/invoice reasons).

const SUPPORT_EMAIL = "avenra.platform@gmail.com";

export function DeleteAccountCard({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const subject = encodeURIComponent("帳號刪除申請 (Account deletion request)");
  const body = encodeURIComponent(
    `我要求刪除我的 TW Market Data 帳號。\n\n帳號 Email：${email}\n\n我了解：\n- 我的 API 金鑰會被撤銷，之後無法再呼叫 API。\n- 依法令與稅務要求，交易與發票紀錄會保留必要期間。\n`,
  );

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
            <h3 className="text-base font-semibold text-slate-900">刪除帳號</h3>

            <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                目前帳號刪除為<strong>人工處理</strong>（自助刪除功能尚未上線）。送出申請後我們會處理並回信確認。
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-xs font-medium text-slate-900">會刪除</p>
                <p className="mt-0.5 text-xs text-slate-600">帳號資料與 API 金鑰（金鑰立即失效，無法再呼叫 API）。</p>
                <p className="mt-2 text-xs font-medium text-slate-900">依法保留</p>
                <p className="mt-0.5 text-xs text-slate-600">交易與發票紀錄，依稅務／會計法令保留必要期間。</p>
              </div>
              <p className="text-xs text-slate-500">帳號：{email}</p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={buttonClass("secondary", "h-10 rounded-lg px-4 text-sm")}
              >
                取消
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`}
                className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}
              >
                送出刪除申請
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
