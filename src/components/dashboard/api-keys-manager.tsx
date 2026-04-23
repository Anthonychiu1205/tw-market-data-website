"use client";

import { FormEvent, useMemo, useState } from "react";

import type { ApiKeyItem } from "@/src/lib/backend-adapter";
import { buttonClass } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type ApiKeysManagerProps = {
  initialKeys: ApiKeyItem[];
  canCreate: boolean;
  canRevoke: boolean;
};

export function ApiKeysManager({ initialKeys, canCreate, canRevoke }: ApiKeysManagerProps) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdPlainKey, setCreatedPlainKey] = useState<string | null>(null);

  const canSubmit = canCreate && !isSubmitting;
  const hasKeys = keys.length > 0;

  async function handleCreateKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setCreatedPlainKey(null);

    try {
      const response = await fetch("/api/dashboard/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("create_failed");
      }

      const payload = (await response.json()) as {
        key: ApiKeyItem;
        plainTextKey?: string;
      };

      setKeys((prev) => [payload.key, ...prev]);
      setNewKeyName("");
      setCreatedPlainKey(payload.plainTextKey ?? null);
    } catch {
      setErrorMessage("目前無法建立金鑰，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteKey(keyId: string) {
    if (!canRevoke || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/dashboard/api-keys/${encodeURIComponent(keyId)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("delete_failed");
      }

      setKeys((prev) => prev.filter((item) => item.id !== keyId));
      if (copiedKeyId === keyId) {
        setCopiedKeyId(null);
      }
    } catch {
      setErrorMessage("目前無法刪除金鑰，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(item: ApiKeyItem) {
    const value = item.keyValue ?? item.maskedKey;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKeyId(item.id);
      window.setTimeout(() => {
        setCopiedKeyId((prev) => (prev === item.id ? null : prev));
      }, 1500);
    } catch {
      setErrorMessage("無法複製金鑰，請檢查瀏覽器權限。");
    }
  }

  const disabledHint = useMemo(() => {
    if (canCreate) return null;
    return "目前方案或環境未開放建立金鑰。";
  }, [canCreate]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="border-b border-slate-200 px-2 py-2">名稱</th>
              <th className="border-b border-slate-200 px-2 py-2">金鑰</th>
              <th className="border-b border-slate-200 px-2 py-2">最近使用</th>
              <th className="border-b border-slate-200 px-2 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {hasKeys ? (
              keys.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-100 px-2 py-2">{item.name}</td>
                  <td className="border-b border-slate-100 px-2 py-2 font-mono text-xs">{item.maskedKey}</td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.lastUsed}</td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className={cn(
                          buttonClass("secondary", "h-9 rounded-lg px-3"),
                          copiedKeyId === item.id && "border-emerald-300 text-emerald-700",
                        )}
                      >
                        {copiedKeyId === item.id ? "已複製" : "複製"}
                      </button>
                      <button
                        type="button"
                        disabled={!canRevoke || isSubmitting}
                        onClick={() => handleDeleteKey(item.id)}
                        className={buttonClass("danger-secondary", "h-9 rounded-lg px-3")}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-2 py-4 text-sm text-slate-500" colSpan={4}>
                  尚無金鑰資料。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form className="flex flex-wrap items-center gap-2" onSubmit={handleCreateKey}>
        <input
          value={newKeyName}
          onChange={(event) => setNewKeyName(event.target.value)}
          placeholder="金鑰名稱（可選）"
          className="h-11 min-w-[220px] flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          disabled={!canCreate || isSubmitting}
        />
        <button type="submit" disabled={!canSubmit} className={buttonClass("primary")}>
          {isSubmitting ? "處理中..." : "建立 API 金鑰"}
        </button>
      </form>

      {disabledHint ? <p className="text-xs text-slate-500">{disabledHint}</p> : null}
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
      {createdPlainKey ? (
        <p className="text-xs text-slate-700">
          已建立新金鑰：<span className="font-mono">{createdPlainKey}</span>（請立即保存）
        </p>
      ) : null}
    </div>
  );
}
