"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

import type { ApiKeyItem } from "@/src/lib/backend-adapter";
import { trackEvent } from "@/src/lib/analytics/client";
import { buttonClass } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type ApiKeysManagerProps = {
  initialKeys: ApiKeyItem[];
  canCreate: boolean;
  canRevoke: boolean;
};

type CreateApiKeyResponse = {
  apiKey: ApiKeyItem;
  secret: string;
  message?: string;
};

type ToastItem = {
  id: string;
  message: string;
  exiting: boolean;
};

const MAX_ACTIVE_KEYS = 5;

function formatDateTime(raw: string | null | undefined) {
  if (!raw || raw === "-") return "尚未使用";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "尚未使用";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function ApiKeysManager({ initialKeys, canCreate, canRevoke }: ApiKeysManagerProps) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [showRevoked, setShowRevoked] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastCounterRef = useRef(0);

  const activeKeys = useMemo(() => keys.filter((item) => item.status !== "revoked"), [keys]);
  const revokedCount = keys.length - activeKeys.length;
  const visibleKeys = useMemo(() => (showRevoked ? keys : activeKeys), [activeKeys, keys, showRevoked]);
  const hasKeys = visibleKeys.length > 0;
  const canCreateNow = canCreate && activeKeys.length < MAX_ACTIVE_KEYS;
  const canSubmit = canCreateNow && !isSubmitting;

  function publishKeysUpdate(nextKeys: ApiKeyItem[]) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("dashboard-api-keys-updated", { detail: nextKeys }));
  }

  function pushToast(message: string) {
    const id = `toast-${Date.now()}-${toastCounterRef.current++}`;
    setToasts((prev) => [...prev, { id, message, exiting: false }].slice(-4));

    window.setTimeout(() => {
      setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, exiting: true } : item)));
    }, 2400);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2650);
  }

  async function handleCreateKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSecretCopied(false);

    try {
      const response = await fetch("/api/dashboard/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as CreateApiKeyResponse & { error?: string } | null;

      if (!response.ok || !payload?.apiKey || !payload.secret) {
        if (payload?.error === "invalid_api_key_name") throw new Error("invalid_api_key_name");
        if (payload?.error === "api_key_limit_reached") throw new Error("api_key_limit_reached");
        if (payload?.error === "api_key_encryption_unavailable") throw new Error("api_key_encryption_unavailable");
        throw new Error("create_failed");
      }

      const nextKey: ApiKeyItem = {
        ...payload.apiKey,
        canCopy: true,
        lastUsed: payload.apiKey.lastUsed ?? "-",
      };

      setKeys((prev) => {
        const next = [nextKey, ...prev];
        publishKeysUpdate(next);
        return next;
      });
      void trackEvent(
        {
          event: "api_key_created",
          properties: {
            keyId: nextKey.id,
            keyName: nextKey.name,
          },
          context: { source: "client", page: "/dashboard?section=api-keys" },
        },
        { dedupeKey: `api-key-created:${nextKey.id}` },
      );

      setCreatedSecret(payload.secret);
      setNewKeyName("");
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error && error.message === "invalid_api_key_name") {
        setErrorMessage("請輸入 1 到 40 字的金鑰名稱。");
      } else if (error instanceof Error && error.message === "api_key_limit_reached") {
        setErrorMessage("目前最多只能保留 5 把啟用中的 API 金鑰。");
      } else if (error instanceof Error && error.message === "api_key_encryption_unavailable") {
        setErrorMessage("目前無法安全建立可複製的金鑰，請稍後再試或聯繫管理員。");
      } else {
        setErrorMessage("目前無法建立金鑰，請稍後再試。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRevokeKey(item: ApiKeyItem) {
    if (!canRevoke || isSubmitting || item.status === "revoked") return;

    const confirmed = window.confirm(`確定要刪除（撤銷）API 金鑰「${item.name}」嗎？`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/dashboard/api-keys/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("revoke_failed");
      }

      const payload = (await response.json().catch(() => null)) as { apiKey?: ApiKeyItem } | null;
      const updated = payload?.apiKey ?? { ...item, status: "revoked", revokedAt: new Date().toISOString(), canCopy: false };

      setKeys((prev) => {
        const next = prev.map((key) =>
          key.id === item.id
            ? {
                ...key,
                ...updated,
                canCopy: false,
              }
            : key,
        );
        publishKeysUpdate(next);
        return next;
      });

      if (copiedKeyId === item.id) {
        setCopiedKeyId(null);
      }
      void trackEvent(
        {
          event: "api_key_revoked",
          properties: {
            keyId: item.id,
            keyName: item.name,
          },
          context: { source: "client", page: "/dashboard?section=api-keys" },
        },
        { dedupeKey: `api-key-revoked:${item.id}` },
      );
    } catch {
      setErrorMessage("目前無法撤銷金鑰，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(item: ApiKeyItem) {
    if (item.status === "revoked") return;

    setErrorMessage(null);

    try {
      const response = await fetch(`/api/dashboard/api-keys/${encodeURIComponent(item.id)}/secret`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as { secret?: string; error?: string } | null;

      if (!response.ok || !payload?.secret) {
        if (payload?.error === "secret_unavailable") {
          setErrorMessage("此金鑰建立於舊版本，無法再次複製，請重新建立。");
          return;
        }
        if (payload?.error === "api_key_revoked") {
          setErrorMessage("已撤銷的金鑰無法複製。");
          return;
        }
        throw new Error("copy_failed");
      }

      await navigator.clipboard.writeText(payload.secret);
      setCopiedKeyId(item.id);
      void trackEvent(
        {
          event: "api_key_copied",
          properties: {
            keyId: item.id,
            keyName: item.name,
          },
          context: { source: "client", page: "/dashboard?section=api-keys" },
        },
        { dedupeKey: `api-key-copied:${item.id}`, dedupeMs: 2000 },
      );
      pushToast("API key 已複製");
      window.setTimeout(() => {
        setCopiedKeyId((prev) => (prev === item.id ? null : prev));
      }, 1000);
    } catch {
      setErrorMessage("無法複製金鑰，請稍後再試或檢查瀏覽器權限。");
    }
  }

  async function copyCreatedSecret() {
    if (!createdSecret) return;
    try {
      await navigator.clipboard.writeText(createdSecret);
      setSecretCopied(true);
      pushToast("API key 已複製");
      window.setTimeout(() => setSecretCopied(false), 1000);
    } catch {
      setErrorMessage("無法複製金鑰，請檢查瀏覽器權限。");
    }
  }

  return (
    <div className="space-y-4">
      {createdSecret ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-900">新 API 金鑰已建立</p>
            <button
              type="button"
              onClick={copyCreatedSecret}
              className={buttonClass("secondary", "h-8 rounded-lg px-3 text-xs")}
            >
              {secretCopied ? "已複製" : "複製完整金鑰"}
            </button>
          </div>
          <p className="mt-1 break-all font-mono text-xs text-slate-700">{createdSecret}</p>
          <p className="mt-1 text-xs text-slate-500">
            請立即複製並妥善保存。若未保存，可稍後在表格中再次複製新版本金鑰。
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="border-b border-slate-200 py-3 pr-3 font-medium">Name</th>
              <th className="border-b border-slate-200 py-3 pr-3 font-medium">API Key</th>
              <th className="border-b border-slate-200 py-3 pr-3 font-medium">Last used</th>
              <th className="border-b border-slate-200 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hasKeys ? (
              visibleKeys.map((item) => {
                const copied = copiedKeyId === item.id;
                const copyDisabled = item.status === "revoked" || item.canCopy === false;
                const rowMuted = item.status === "revoked";
                return (
                  <tr key={item.id} className={rowMuted ? "opacity-60" : ""}>
                    <td className="border-b border-slate-100 py-3 pr-3 text-slate-900">
                      {item.name}
                      {rowMuted ? <span className="ml-2 text-xs text-slate-500">已撤銷</span> : null}
                    </td>
                    <td className="border-b border-slate-100 py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-700">{item.maskedKey}</span>
                        <button
                          type="button"
                          onClick={() => void handleCopy(item)}
                          disabled={copyDisabled}
                          className={cn(
                            "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-slate-500 transition duration-150 ease-out hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95 active:opacity-80",
                            copyDisabled && "cursor-not-allowed text-slate-300 hover:border-transparent hover:bg-transparent hover:text-slate-300",
                          )}
                          aria-label="複製 API 金鑰"
                          title={
                            item.status === "revoked"
                              ? "已撤銷金鑰不可複製"
                              : item.canCopy === false
                                ? "舊版金鑰無法再次複製，請重新建立"
                                : copied
                                  ? "已複製"
                                  : "複製"
                          }
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="border-b border-slate-100 py-3 pr-3 text-slate-600">{formatDateTime(item.lastUsed)}</td>
                    <td className="border-b border-slate-100 py-3 text-right">
                      <button
                        type="button"
                        disabled={!canRevoke || isSubmitting || item.status === "revoked"}
                        onClick={() => void handleRevokeKey(item)}
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700",
                          (!canRevoke || isSubmitting || item.status === "revoked") &&
                            "cursor-not-allowed text-slate-300 hover:border-transparent hover:bg-transparent hover:text-slate-300",
                        )}
                        aria-label={`刪除 ${item.name}`}
                        title={item.status === "revoked" ? "已撤銷" : "刪除（撤銷）"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="py-4 text-sm text-slate-500" colSpan={4}>
                  目前沒有可用中的 API key。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {revokedCount > 0 ? (
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => setShowRevoked((prev) => !prev)}
            className="text-xs text-slate-500 underline-offset-4 transition hover:text-slate-700 hover:underline"
          >
            {showRevoked ? "隱藏已撤銷金鑰" : `顯示已撤銷金鑰（${revokedCount}）`}
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-start">
        <button
          type="button"
          disabled={!canCreateNow}
          onClick={() => {
            setErrorMessage(null);
            setIsModalOpen(true);
          }}
          className={buttonClass("primary", "h-11 rounded-2xl px-6 text-sm")}
        >
          Create
        </button>
      </div>

      <p className="text-xs text-slate-500">
        API key 可用於呼叫 /v2 API。請妥善保存，若外洩請立即撤銷並重建。
      </p>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">建立 API 金鑰</h3>
            <form className="mt-4 space-y-4" onSubmit={handleCreateKey}>
              <label className="block space-y-1 text-sm text-slate-600">
                <span>名稱</span>
                <input
                  value={newKeyName}
                  onChange={(event) => setNewKeyName(event.target.value)}
                  placeholder="例如 ai-hedge-fund"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  disabled={!canCreateNow || isSubmitting}
                  maxLength={40}
                />
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={buttonClass("secondary", "h-10 rounded-lg px-4 text-sm")}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button type="submit" disabled={!canSubmit} className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}>
                  {isSubmitting ? "建立中..." : "建立"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col-reverse gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-sm transition-all duration-200",
              toast.exiting ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
            )}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
