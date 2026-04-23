"use client";

import { useState } from "react";

import { SectionHeading } from "@/src/components/docs/section-heading";

type DemoRow = {
  symbol: string;
  date: string;
  close: string | number;
};

export function TwseDailyPriceLiveDemo() {
  const [symbol, setSymbol] = useState("2330");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<DemoRow[]>([]);
  const [raw, setRaw] = useState<unknown>(null);

  const handleFetch = async () => {
    const value = symbol.trim();
    if (!value) {
      setError("請先輸入 symbol。");
      setRows([]);
      setRaw(null);
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

      if (!response.ok) {
        setRows([]);
        setError(typeof payload?.detail === "string" ? payload.detail : "API 請求失敗。");
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
      setError("無法連線到本機 API（http://127.0.0.1:8011）。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3 border-b border-slate-200 pb-8">
      <SectionHeading id="live-demo-twse-daily-price">Live Demo（TWSE Daily Price）</SectionHeading>
      <p className="text-sm leading-7 text-slate-600">
        這個示範會直接呼叫本機 API：
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /v2/datasets/twse-daily-price</code>
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="例如 2330"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500 sm:max-w-[220px]"
        />
        <button
          type="button"
          onClick={handleFetch}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

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
        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-700">
          {JSON.stringify(raw, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
