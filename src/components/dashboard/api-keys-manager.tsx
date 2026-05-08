"use client";

import { FormEvent, useState } from "react";

import type { ApiKeyItem } from "@/src/lib/backend-adapter";
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

function formatDateTime(raw: string | null | undefined) {
  if (!raw || raw === "-") return "—";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "—";
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
  const [createdSecretApiKey, setCreatedSecretApiKey] = useState<ApiKeyItem | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  const canSubmit = canCreate && !isSubmitting;
  const hasKeys = keys.length > 0;

  function publishKeysUpdate(nextKeys: ApiKeyItem[]) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("dashboard-api-keys-updated", { detail: nextKeys }));
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
        if (payload?.error === "invalid_api_key_name") {
          throw new Error("invalid_api_key_name");
        }
        if (payload?.error === "api_key_limit_reached") {
          throw new Error("api_key_limit_reached");
        }
        throw new Error("create_failed");
      }

      const nextKey: ApiKeyItem = {
        ...payload.apiKey,
        keyValue: payload.secret,
        lastUsed: payload.apiKey.lastUsed ?? "-",
      };

      setKeys((prev) => {
        const next = [nextKey, ...prev];
        publishKeysUpdate(next);
        return next;
      });
      setCreatedSecret(payload.secret);
      setCreatedSecretApiKey(nextKey);
      setNewKeyName("");
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error && error.message === "invalid_api_key_name") {
        setErrorMessage("請輸入 1 到 40 字的金鑰名稱。");
      } else if (error instanceof Error && error.message === "api_key_limit_reached") {
        setErrorMessage("目前最多只能保留 5 把啟用中的 API 金鑰。");
      } else {
        setErrorMessage("目前無法建立金鑰，請稍後再試。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRevokeKey(item: ApiKeyItem) {
    if (!canRevoke || isSubmitting || item.status === "revoked") return;

    const confirmed = window.confirm(`確定要撤銷 API 金鑰「${item.name}」嗎？撤銷後不可恢復。`);
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
      const updated = payload?.apiKey ?? { ...item, status: "revoked", revokedAt: new Date().toISOString() };

      setKeys((prev) => {
        const next = prev.map((key) =>
          key.id === item.id
            ? {
                ...key,
                ...updated,
                keyValue: undefined,
              }
            : key,
        );
        publishKeysUpdate(next);
        return next;
      });

      if (copiedKeyId === item.id) {
        setCopiedKeyId(null);
      }
    } catch {
      setErrorMessage("目前無法撤銷金鑰，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(item: ApiKeyItem) {
    if (!item.keyValue) return;

    try {
      await navigator.clipboard.writeText(item.keyValue);
      setCopiedKeyId(item.id);
      window.setTimeout(() => {
        setCopiedKeyId((prev) => (prev === item.id ? null : prev));
      }, 1500);
    } catch {
      setErrorMessage("無法複製金鑰，請檢查瀏覽器權限。");
    }
  }

  async function copyCreatedSecret() {
    if (!createdSecret) return;
    try {
      await navigator.clipboard.writeText(createdSecret);
      setSecretCopied(true);
      window.setTimeout(() => setSecretCopied(false), 1500);
    } catch {
      setErrorMessage("無法複製金鑰，請檢查瀏覽器權限。");
    }
  }

  return (
    <div className="space-y-3">
      {createdSecret && createdSecretApiKey ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">新 API 金鑰已建立</p>
          <p className="mt-1 text-xs text-amber-800">請立即複製，離開此頁後不會再次顯示完整金鑰。</p>
          <p className="mt-2 font-mono text-xs text-amber-900 break-all">{createdSecret}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyCreatedSecret}
              className={buttonClass("secondary", "h-8 rounded-md px-3 text-xs")}
            >
              {secretCopied ? "已複製" : "複製完整金鑰"}
            </button>
            <span className="text-xs text-amber-800">遮罩：{createdSecretApiKey.maskedKey}</span>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="border-b border-slate-200 px-2 py-2">名稱</th>
              <th className="border-b border-slate-200 px-2 py-2">金鑰</th>
              <th className="border-b border-slate-200 px-2 py-2">狀態</th>
              <th className="border-b border-slate-200 px-2 py-2">建立時間</th>
              <th className="border-b border-slate-200 px-2 py-2">最近使用</th>
              <th className="border-b border-slate-200 px-2 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {hasKeys ? (
              keys.map((item) => {
                const revoked = item.status === "revoked";
                return (
                  <tr key={item.id} className={cn(revoked && "bg-slate-50 text-slate-400")}>
                    <td className="border-b border-slate-100 px-2 py-2">{item.name}</td>
                    <td className="border-b border-slate-100 px-2 py-2 font-mono text-xs">{item.maskedKey}</td>
                    <td className="border-b border-slate-100 px-2 py-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
                          revoked ? "border-slate-200 bg-slate-100 text-slate-500" : "border-emerald-200 bg-emerald-50 text-emerald-700",
                        )}
                      >
                        {revoked ? "已撤銷" : "啟用中"}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2">{formatDateTime(item.createdAt)}</td>
                    <td className="border-b border-slate-100 px-2 py-2">{formatDateTime(item.lastUsed)}</td>
                    <td className="border-b border-slate-100 px-2 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(item)}
                          disabled={!item.keyValue}
                          className={buttonClass("secondary", "h-9 rounded-lg px-3 disabled:cursor-not-allowed")}
                        >
                          {copiedKeyId === item.id ? "已複製" : "複製"}
                        </button>
                        <button
                          type="button"
                          disabled={!canRevoke || isSubmitting || revoked}
                          onClick={() => handleRevokeKey(item)}
                          className={buttonClass("danger-secondary", "h-9 rounded-lg px-3")}
                        >
                          撤銷
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-2 py-4 text-sm text-slate-500" colSpan={6}>
                  尚無 API key。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={!canCreate}
          onClick={() => {
            setErrorMessage(null);
            setIsModalOpen(true);
          }}
          className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}
        >
          建立 API 金鑰
        </button>
      </div>

      <p className="text-xs text-slate-500">
        API key 只會在建立當下顯示一次完整值；系統僅保存 hash，無法再次查看明文。
      </p>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">建立新的 API 金鑰</h3>
            <form className="mt-4 space-y-4" onSubmit={handleCreateKey}>
              <label className="block space-y-1 text-sm text-slate-600">
                <span>金鑰名稱</span>
                <input
                  value={newKeyName}
                  onChange={(event) => setNewKeyName(event.target.value)}
                  placeholder="例如 research-bot"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  disabled={!canCreate || isSubmitting}
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
    </div>
  );
}

