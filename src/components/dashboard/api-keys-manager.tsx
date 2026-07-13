"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";

import type { ApiKeyItem } from "@/src/lib/backend-adapter";
import { trackEvent } from "@/src/lib/analytics/client";
import { buttonClass } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type ApiKeysManagerProps = {
  initialKeys: ApiKeyItem[];
  canCreate: boolean;
  canRevoke: boolean;
  // Max active keys the plan allows; null/undefined = no client-side cap (server still enforces).
  keyLimit?: number | null;
  // Server-provided reason the create action is unavailable (used when it isn't a plain limit hit).
  createDisabledReason?: string | null;
  // Account has no subscription: the API gates key creation, so route to checkout instead.
  needsSubscription?: boolean;
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

// Robust copy: try the async Clipboard API, then fall back to a hidden textarea + execCommand.
// The fallback matters because after an `await fetch(...)` some browsers (notably Safari) drop the
// user-gesture and reject navigator.clipboard.writeText with NotAllowedError.
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

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

export function ApiKeysManager({
  initialKeys,
  canCreate,
  canRevoke,
  keyLimit,
  createDisabledReason,
  needsSubscription,
}: ApiKeysManagerProps) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
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
  // Revoked keys never count toward the limit (activeKeys already excludes them). The plan limit is
  // authoritative; when it's null/undefined there's no client cap and the server stays the gate.
  const atPlanLimit = typeof keyLimit === "number" && activeKeys.length >= keyLimit;
  const canCreateNow = canCreate && !atPlanLimit;
  const canSubmit = canCreateNow && !isSubmitting;

  // Why the Create button is disabled — shown as inline hint + button tooltip so it's never silent.
  const createDisabledHint = isSubmitting
    ? null
    : atPlanLimit
      ? `已達方案金鑰上限（${keyLimit} 把）。請先撤銷未使用的金鑰，或升級方案以提高上限。`
      : !canCreate
        ? createDisabledReason ?? "目前方案無法新增 API 金鑰，請升級方案或聯繫我們。"
        : null;

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
        // 402 from the API's subscription gate — a permanent state, not a transient failure.
        if (payload?.error === "subscription_required") throw new Error("subscription_required");
        if (payload?.error === "entitlement_inactive") throw new Error("entitlement_inactive");
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
        setErrorMessage(
          typeof keyLimit === "number"
            ? `已達方案金鑰上限（${keyLimit} 把）。請先撤銷未使用的金鑰，或升級方案以提高上限。`
            : "已達方案金鑰上限。請先撤銷未使用的金鑰，或升級方案以提高上限。",
        );
      } else if (error instanceof Error && error.message === "subscription_required") {
        // Permanent gate — do NOT say "請稍後再試" (the old message implied a transient error and
        // left every new signup at a dead end). Close the modal and point at the real path.
        setIsModalOpen(false);
        setErrorMessage(
          "免費層不含 API key。你可以直接免金鑰試 5 檔（2330／2317／2454／0050／2603）；要取得 API key 請先選擇方案。",
        );
      } else if (error instanceof Error && error.message === "entitlement_inactive") {
        setIsModalOpen(false);
        setErrorMessage("你的方案目前未生效（可能待付款或已到期）。請至方案頁確認後再試。");
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
    if (item.status === "revoked" || copyingId) return;

    setErrorMessage(null);
    setCopyingId(item.id);

    try {
      const response = await fetch(`/api/dashboard/api-keys/${encodeURIComponent(item.id)}/secret`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as { secret?: string; error?: string } | null;

      if (!response.ok || !payload?.secret) {
        if (payload?.error === "secret_unavailable") {
          // Only hash-only keys (no retrievable raw) can't be re-copied — regenerate to get one.
          setErrorMessage("此金鑰無法再次複製，請重新產生以取得可複製版本。");
          return;
        }
        if (payload?.error === "api_key_revoked") {
          setErrorMessage("已撤銷的金鑰無法複製。");
          return;
        }
        throw new Error("copy_failed");
      }

      const copied = await copyToClipboard(payload.secret);
      if (!copied) {
        setErrorMessage("無法寫入剪貼簿，請手動複製或檢查瀏覽器權限。");
        return;
      }
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
      pushToast("API key 已複製到剪貼簿");
      window.setTimeout(() => {
        setCopiedKeyId((prev) => (prev === item.id ? null : prev));
      }, 1200);
    } catch {
      setErrorMessage("無法複製金鑰，請稍後再試或檢查瀏覽器權限。");
    } finally {
      setCopyingId(null);
    }
  }

  async function copyCreatedSecret() {
    if (!createdSecret) return;
    const copied = await copyToClipboard(createdSecret);
    if (!copied) {
      setErrorMessage("無法寫入剪貼簿，請手動複製或檢查瀏覽器權限。");
      return;
    }
    setSecretCopied(true);
    pushToast("API key 已複製到剪貼簿");
    window.setTimeout(() => setSecretCopied(false), 1200);
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
                const isCopying = copyingId === item.id;
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
                          disabled={copyDisabled || isCopying}
                          className={cn(
                            "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-slate-500 transition duration-150 ease-out hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95 active:opacity-80",
                            (copyDisabled || isCopying) && "cursor-not-allowed text-slate-300 hover:border-transparent hover:bg-transparent hover:text-slate-300",
                          )}
                          aria-label="複製 API 金鑰"
                          title={
                            item.status === "revoked"
                              ? "已撤銷金鑰不可複製"
                              : item.canCopy === false
                                ? "此金鑰無法再次複製，請重新產生以取得可複製版本"
                                : isCopying
                                  ? "複製中…"
                                  : copied
                                    ? "已複製"
                                    : "複製"
                          }
                        >
                          {isCopying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
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

      {/* No subscription: the API gates key creation (403 subscription_required), so offer the real
          path — free no-key trial + choose a plan — instead of a Create button that always fails. */}
      {needsSubscription ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-900">免費層不含 API key</p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            你可以<strong>免金鑰</strong>直接試 5 檔（2330／2317／2454／0050／2603）；要取得 API key 請先選擇方案。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/pricing" className={buttonClass("primary", "h-9 rounded-lg px-4 text-xs")}>
              查看方案
            </a>
            <a href="/docs/quick-start" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
              免金鑰快速試用
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            disabled={!canCreateNow}
            onClick={() => {
              setErrorMessage(null);
              setIsModalOpen(true);
            }}
            title={createDisabledHint ?? undefined}
            className={buttonClass("primary", "h-11 rounded-2xl px-6 text-sm")}
          >
            Create
          </button>
          {createDisabledHint ? <p className="text-xs text-amber-600">{createDisabledHint}</p> : null}
        </div>
      )}

      <p className="text-xs text-slate-500">
        API key 可用於呼叫 /v2 API。請妥善保存，若外洩請立即撤銷並重建。
        {typeof keyLimit === "number" ? `目前方案可保留 ${keyLimit} 把啟用中的金鑰。` : null}
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
              "pointer-events-auto flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-lg transition-all duration-200",
              toast.exiting ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
            )}
            role="status"
            aria-live="polite"
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
