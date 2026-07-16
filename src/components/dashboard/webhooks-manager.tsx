"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";

import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { cn } from "@/src/lib/cn";

// Client-side manager for /dashboard/webhooks. Talks only to the existing backend routes:
//   GET/POST  /api/dashboard/webhooks              (list / create)
//   PATCH/DELETE /api/dashboard/webhooks/:id        (pause·resume / delete)
//   POST      /api/dashboard/webhooks/:id/secret    (rotate — issues a fresh signing secret once)
//   GET       /api/dashboard/webhooks/deliveries    (recent delivery attempts)
// No emoji anywhere; TWMD dashboard design system only.

const EVENT_TYPES = [
  { id: "revenue.announced", label: "月營收公告" },
  { id: "filing.announced", label: "財報 / 申報公告" },
  { id: "catalog.dataset_listed", label: "資料集上架" },
] as const;

function eventTypeLabel(id: string): string {
  return EVENT_TYPES.find((event) => event.id === id)?.label ?? id;
}

type Subscription = { id: string; eventTypes: string[]; symbolFilter: string[] };
type Destination = {
  id: string;
  url: string;
  type: string;
  status: string;
  secretHint: string | null;
  createdAt: string;
  subscriptions: Subscription[];
};
type Delivery = {
  id: string;
  eventId: string;
  eventType: string;
  status: string;
  attempt: number;
  statusCode: number | null;
  error: string | null;
  at: string;
  destinationUrl: string | null;
};

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

function formatDateTime(raw: string | null | undefined): string {
  if (!raw) return "—";
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

function statusLabel(status: string): { label: string; className: string } {
  if (status === "active") return { label: "啟用中", className: "bg-emerald-50 text-emerald-700" };
  if (status === "paused") return { label: "已停用", className: "bg-slate-100 text-slate-600" };
  return { label: status, className: "bg-slate-100 text-slate-600" };
}

function deliveryResponse(delivery: Delivery): { label: string; className: string } {
  if (delivery.statusCode !== null) {
    const ok = delivery.statusCode >= 200 && delivery.statusCode < 300;
    return {
      label: String(delivery.statusCode),
      className: ok ? "text-emerald-700" : "text-rose-600",
    };
  }
  if (delivery.status === "dead") return { label: "投遞失敗", className: "text-rose-600" };
  if (delivery.status === "retrying") return { label: "重試中", className: "text-amber-600" };
  return { label: "等待中", className: "text-slate-500" };
}

function shortId(value: string): string {
  return value.length > 12 ? `${value.slice(0, 12)}…` : value;
}

export function WebhooksManager() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [symbolFilter, setSymbolFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // The raw signing secret is shown exactly once — right after create or a rotate.
  const [revealedSecret, setRevealedSecret] = useState<{ id: string; secret: string; rotated: boolean } | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; exiting: boolean }>>([]);
  const toastCounterRef = useRef(0);

  const pushToast = useCallback((message: string) => {
    const id = `toast-${Date.now()}-${toastCounterRef.current++}`;
    setToasts((prev) => [...prev, { id, message, exiting: false }].slice(-4));
    window.setTimeout(() => {
      setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, exiting: true } : item)));
    }, 2400);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2650);
  }, []);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [destRes, delRes] = await Promise.all([
        fetch("/api/dashboard/webhooks", { cache: "no-store" }),
        fetch("/api/dashboard/webhooks/deliveries", { cache: "no-store" }),
      ]);
      if (!destRes.ok) throw new Error("load_failed");
      const destJson = (await destRes.json()) as { destinations?: Destination[] };
      setDestinations(Array.isArray(destJson.destinations) ? destJson.destinations : []);
      if (delRes.ok) {
        const delJson = (await delRes.json()) as { deliveries?: Delivery[] };
        setDeliveries(Array.isArray(delJson.deliveries) ? delJson.deliveries : []);
      }
    } catch {
      setLoadError("目前無法載入 webhook 設定,請稍後再試。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openModal() {
    setUrl("");
    setSelectedEvents(new Set());
    setSymbolFilter("");
    setFormError(null);
    setIsModalOpen(true);
  }

  function toggleEvent(eventId: string) {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setFormError("請輸入目標 URL。");
      return;
    }
    if (selectedEvents.size === 0) {
      setFormError("請至少勾選一個事件型別。");
      return;
    }

    const symbolList = symbolFilter
      .split(/[,\s]+/)
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const response = await fetch("/api/dashboard/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmedUrl,
          eventTypes: [...selectedEvents],
          symbolFilter: symbolList,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { destinationId?: string; signingSecret?: string; error?: string }
        | null;

      if (!response.ok || !payload?.destinationId || !payload.signingSecret) {
        if (payload?.error === "unsafe_url") setFormError("此 URL 不被允許(需為公開的 https 目標)。");
        else if (payload?.error === "url_required") setFormError("請輸入目標 URL。");
        else if (payload?.error === "no_event_types") setFormError("請至少勾選一個事件型別。");
        else setFormError("目前無法建立 webhook,請稍後再試。");
        return;
      }

      setIsModalOpen(false);
      setRevealedSecret({ id: payload.destinationId, secret: payload.signingSecret, rotated: false });
      setSecretCopied(false);
      await load();
    } catch {
      setFormError("目前無法建立 webhook,請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  }

  async function copySecret(secret: string) {
    const ok = await copyToClipboard(secret);
    if (ok) {
      setSecretCopied(true);
      pushToast("Signing secret 已複製到剪貼簿");
      window.setTimeout(() => setSecretCopied(false), 1200);
    } else {
      pushToast("無法寫入剪貼簿,請手動複製。");
    }
  }

  async function toggleStatus(destination: Destination) {
    if (busyId) return;
    const action = destination.status === "active" ? "pause" : "resume";
    setBusyId(destination.id);
    try {
      const response = await fetch(`/api/dashboard/webhooks/${encodeURIComponent(destination.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("failed");
      await load();
    } catch {
      pushToast("狀態更新失敗,請稍後再試。");
    } finally {
      setBusyId(null);
    }
  }

  async function rotateSecret(destination: Destination) {
    if (busyId) return;
    setBusyId(destination.id);
    try {
      const response = await fetch(`/api/dashboard/webhooks/${encodeURIComponent(destination.id)}/secret`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as { signingSecret?: string } | null;
      if (!response.ok || !payload?.signingSecret) throw new Error("failed");
      setRevealedSecret({ id: destination.id, secret: payload.signingSecret, rotated: true });
      setSecretCopied(false);
      await load();
    } catch {
      pushToast("重新產生密鑰失敗,請稍後再試。");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteDestination(destination: Destination) {
    if (busyId) return;
    const confirmed = window.confirm(`確定要刪除這個 webhook destination 嗎?\n${destination.url}`);
    if (!confirmed) return;
    setBusyId(destination.id);
    try {
      const response = await fetch(`/api/dashboard/webhooks/${encodeURIComponent(destination.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("failed");
      if (revealedSecret?.id === destination.id) setRevealedSecret(null);
      await load();
    } catch {
      pushToast("刪除失敗,請稍後再試。");
    } finally {
      setBusyId(null);
    }
  }

  const hasDestinations = destinations.length > 0;
  const hasDeliveries = deliveries.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Webhooks</h1>
        <p className="mt-2 text-sm text-slate-600">
          設定 destination,當月營收、財報公告或資料集上架時,我們會即時把事件推送到你的伺服器。
        </p>
      </section>

      {/* A) Destinations */}
      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Destinations</h2>
        </div>

        {revealedSecret ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-900">
                {revealedSecret.rotated ? "已產生新的 Signing secret" : "Webhook 已建立"}
              </p>
              <button
                type="button"
                onClick={() => void copySecret(revealedSecret.secret)}
                className={buttonClass("secondary", "h-8 rounded-lg px-3 text-xs")}
              >
                {secretCopied ? "已複製" : "複製 Signing secret"}
              </button>
            </div>
            <p className="mt-1 break-all font-mono text-xs text-slate-700">{revealedSecret.secret}</p>
            <p className="mt-1 text-xs text-slate-500">
              請立即複製並妥善保存。此密鑰只顯示這一次;遺失後只能重新產生(舊密鑰即失效)。
            </p>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setRevealedSecret(null)}
                className="text-xs text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
              >
                我已保存,關閉
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">URL</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Signing secret</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Events</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Status</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Created</th>
                <th className="border-b border-slate-200 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> 載入中…
                    </span>
                  </td>
                </tr>
              ) : hasDestinations ? (
                destinations.map((destination) => {
                  const events = [...new Set(destination.subscriptions.flatMap((sub) => sub.eventTypes))];
                  const symbols = [...new Set(destination.subscriptions.flatMap((sub) => sub.symbolFilter))];
                  const status = statusLabel(destination.status);
                  const isBusy = busyId === destination.id;
                  return (
                    <tr key={destination.id} className="align-top">
                      <td className="border-b border-slate-100 py-3 pr-3">
                        <span className="break-all font-mono text-xs text-slate-700">{destination.url}</span>
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-3">
                        <span className="font-mono text-xs text-slate-500">{destination.secretHint ?? "—"}</span>
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-700">
                            {events.length ? events.map(eventTypeLabel).join("、") : "—"}
                          </span>
                          {symbols.length ? (
                            <span className="text-[11px] text-slate-400">篩選:{symbols.join("、")}</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-3">
                        <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", status.className)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-3 text-xs text-slate-500">
                        {formatDateTime(destination.createdAt)}
                      </td>
                      <td className="border-b border-slate-100 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => void toggleStatus(destination)}
                            disabled={isBusy}
                            className={buttonClass("secondary", "h-8 rounded-lg px-2.5 text-xs")}
                          >
                            {destination.status === "active" ? "停用" : "啟用"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void rotateSecret(destination)}
                            disabled={isBusy}
                            className={buttonClass("secondary", "h-8 rounded-lg px-2.5 text-xs")}
                          >
                            重新產生密鑰
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteDestination(destination)}
                            disabled={isBusy}
                            aria-label="刪除 destination"
                            title="刪除"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-red-600 disabled:cursor-not-allowed disabled:text-slate-300"
                          >
                            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-sm text-slate-500">
                    尚無 webhook,新增一個 destination 開始接收事件。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loadError ? <p className="mt-3 text-xs text-red-600">{loadError}</p> : null}

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={openModal} className={buttonClass("primary", "h-10 rounded-xl px-5 text-sm")}>
            Add destination
          </button>
        </div>
      </DashboardCard>

      {/* B) Recent events */}
      <DashboardCard className="rounded-3xl border-slate-200/70 bg-white p-6 shadow-none">
        <h2 className="text-base font-semibold text-slate-900">Recent events</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Event</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">ID</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Response</th>
                <th className="border-b border-slate-200 py-3 pr-3 font-medium">Attempt</th>
                <th className="border-b border-slate-200 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> 載入中…
                    </span>
                  </td>
                </tr>
              ) : hasDeliveries ? (
                deliveries.map((delivery) => {
                  const response = deliveryResponse(delivery);
                  return (
                    <tr key={delivery.id}>
                      <td className="border-b border-slate-100 py-3 pr-3 text-slate-800">
                        {eventTypeLabel(delivery.eventType)}
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-3 font-mono text-xs text-slate-500">
                        {shortId(delivery.eventId)}
                      </td>
                      <td className={cn("border-b border-slate-100 py-3 pr-3 text-xs font-medium", response.className)}>
                        {response.label}
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-3 text-slate-600">{delivery.attempt}</td>
                      <td className="border-b border-slate-100 py-3 text-xs text-slate-500">{formatDateTime(delivery.at)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-slate-500">
                    尚無投遞。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Add destination modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">新增 destination</h3>
            <form className="mt-4 space-y-4" onSubmit={handleCreate}>
              <label className="block space-y-1 text-sm text-slate-600">
                <span>目標 URL</span>
                <input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com/webhooks/twmd"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  disabled={submitting}
                />
              </label>

              <fieldset className="space-y-2 text-sm text-slate-600">
                <legend className="mb-1">事件型別</legend>
                {EVENT_TYPES.map((event) => (
                  <label key={event.id} className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedEvents.has(event.id)}
                      onChange={() => toggleEvent(event.id)}
                      disabled={submitting}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <span className="text-slate-800">{event.label}</span>
                    <span className="font-mono text-xs text-slate-400">{event.id}</span>
                  </label>
                ))}
              </fieldset>

              <label className="block space-y-1 text-sm text-slate-600">
                <span>
                  Symbol filter<span className="ml-1 text-xs text-slate-400">(選填,以逗號或空白分隔,留空 = 全部)</span>
                </span>
                <input
                  value={symbolFilter}
                  onChange={(event) => setSymbolFilter(event.target.value)}
                  placeholder="2330 2317"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  disabled={submitting}
                />
              </label>

              {formError ? <p className="text-xs text-red-600">{formError}</p> : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className={buttonClass("secondary", "h-10 rounded-lg px-4 text-sm")}
                >
                  取消
                </button>
                <button type="submit" disabled={submitting} className={buttonClass("primary", "h-10 rounded-lg px-4 text-sm")}>
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> 建立中…
                    </span>
                  ) : (
                    "建立"
                  )}
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
