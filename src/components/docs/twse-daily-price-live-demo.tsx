"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Link } from "@/src/i18n/navigation";

type DemoRow = {
  symbol: string;
  date: string;
  close: string | number;
};

export function TwseDailyPriceLiveDemo() {
  const t = useTranslations("docsDemo");
  const [symbol, setSymbol] = useState("2330");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<DemoRow[]>([]);
  const [raw, setRaw] = useState<unknown>(null);
  const [planLimitedMeta, setPlanLimitedMeta] = useState<{ isLimited: boolean; rowLimit: number | null }>({
    isLimited: false,
    rowLimit: null,
  });

  const handleFetch = async () => {
    const value = symbol.trim();
    if (!value) {
      setError(t("liveDemo.errorEnterSymbol"));
      setRows([]);
      setRaw(null);
      setPlanLimitedMeta({ isLimited: false, rowLimit: null });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = `http://127.0.0.1:8011/v2/datasets/twse-daily-price?symbol=${encodeURIComponent(value)}&limit=5`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": "free_key",
        },
      });

      const payload = await response.json();
      setRaw(payload);

      const meta = (payload?.meta ?? {}) as Record<string, unknown>;
      const rowLimitRaw = meta.row_limit;
      const parsedRowLimit =
        typeof rowLimitRaw === "number"
          ? rowLimitRaw
          : typeof rowLimitRaw === "string"
            ? Number(rowLimitRaw)
            : Number.NaN;
      setPlanLimitedMeta({
        isLimited: meta.is_limited === true,
        rowLimit: Number.isFinite(parsedRowLimit) ? parsedRowLimit : null,
      });

      if (!response.ok) {
        setRows([]);
        setError(typeof payload?.detail === "string" ? payload.detail : t("liveDemo.errorRequestFailed"));
        return;
      }

      const resultRows = Array.isArray(payload?.rows) ? payload.rows : [];
      const normalized = resultRows.map((row: unknown) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return {
          symbol: String(r.symbol ?? ""),
          date: String(r.date ?? ""),
          close: (r.close as string | number | undefined) ?? "",
        } satisfies DemoRow;
      });

      setRows(normalized);
    } catch {
      setRows([]);
      setRaw(null);
      setPlanLimitedMeta({ isLimited: false, rowLimit: null });
      setError(t("liveDemo.errorConnect"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3 border-b border-slate-200 pb-8">
      <SectionHeading id="live-demo-twse-daily-price">{t("liveDemo.heading")}</SectionHeading>
      <p className="text-sm leading-7 text-slate-600">
        {t("liveDemo.description")}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /v2/datasets/twse-daily-price</code>
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder={t("liveDemo.placeholder")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500 sm:max-w-[220px]"
        />
        <button
          type="button"
          onClick={handleFetch}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("liveDemo.loading") : t("liveDemo.fetchData")}
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {planLimitedMeta.isLimited ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
          <p className="text-sm font-medium text-amber-900">
            {t("liveDemo.planLimitedTitle", { count: planLimitedMeta.rowLimit ?? 50 })}
          </p>
          <p className="mt-1 text-sm text-amber-800">{t("liveDemo.planLimitedUpgrade")}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-amber-200 bg-white px-3 py-2">
              <p className="text-xs font-medium text-slate-700">Free</p>
              <p className="mt-1 text-sm text-slate-900">50 rows</p>
            </div>
            <div className="rounded-md border border-slate-300 bg-white px-3 py-2">
              <p className="text-xs font-medium text-slate-700">Developer / Pro</p>
              <p className="mt-1 text-sm text-slate-900">5000 rows</p>
            </div>
          </div>
          <Link
            href="/billing/subscriptions"
            className="mt-3 inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            {t("liveDemo.upgradePlan")}
          </Link>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-700">symbol</th>
                <th className="px-3 py-2 text-left font-medium text-slate-700">date</th>
                <th className="px-3 py-2 text-left font-medium text-slate-700">close</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => (
                <tr key={`${row.symbol}-${row.date}-${idx}`}>
                  <td className="px-3 py-2 text-slate-700">{row.symbol}</td>
                  <td className="px-3 py-2 text-slate-700">{row.date}</td>
                  <td className="px-3 py-2 text-slate-700">{row.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {raw ? (
        <CodeBlock code={JSON.stringify(raw, null, 2)} language="json" copyButtonVariant="icon" />
      ) : null}
    </section>
  );
}
