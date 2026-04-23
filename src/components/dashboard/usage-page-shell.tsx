import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import type { UsageRequestRow, UsageRequestsSummary } from "@/src/lib/backend-adapter";

type UsagePageShellProps = {
  usageRequests: UsageRequestsSummary;
};

function formatTimestamp(raw: string) {
  if (!raw || raw === "-") return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toISOString().replace("T", " ").slice(0, 19);
}

function renderRows(rows: UsageRequestRow[]) {
  if (!rows.length) {
    return (
      <tr className="border-t border-slate-100">
        <td colSpan={6} className="px-3 py-8 text-center text-slate-500">No requests yet</td>
      </tr>
    );
  }

  return rows.map((row, index) => (
    <tr key={`${row.requestTimestamp}-${row.endpoint}-${index}`} className="border-t border-slate-100">
      <td className="px-3 py-2 text-slate-700">{formatTimestamp(row.requestTimestamp)}</td>
      <td className="px-3 py-2 text-slate-700">{row.dataset}</td>
      <td className="px-3 py-2 font-mono text-xs text-slate-700">{row.endpoint}</td>
      <td className="px-3 py-2 text-slate-700">{row.statusCode ?? "-"}</td>
      <td className="px-3 py-2 text-slate-700">{row.rowCount ?? "-"}</td>
      <td className="px-3 py-2 text-slate-700">{row.planCode}</td>
    </tr>
  ));
}

export function UsagePageShell({ usageRequests }: UsagePageShellProps) {
  const rows = usageRequests.rows;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Usage</h1>
        <p className="mt-2 text-sm text-slate-600">查看 spend、端點摘要與請求明細。</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="text-base font-semibold text-slate-900">Spend</p>
          <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
            No spend data yet
          </div>
        </Card>
        <Card className="xl:col-span-1">
          <p className="text-base font-semibold text-slate-900">Endpoints summary</p>
          <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
            No endpoint data yet
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-slate-900">Requests</p>
          <button className={buttonClass("secondary", "h-9 rounded-lg px-3 text-xs")}>Export CSV</button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Date</th>
                <th className="px-3 py-2 text-left font-medium">API</th>
                <th className="px-3 py-2 text-left font-medium">Endpoint</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Requests</th>
                <th className="px-3 py-2 text-left font-medium">Plan</th>
              </tr>
            </thead>
            <tbody>{renderRows(rows)}</tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Page 1 of 1</span>
          <span>{rows.length.toLocaleString()} total rows</span>
        </div>
      </Card>
    </div>
  );
}
