"use client";

import { useState } from "react";

import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

type EndpointRow = {
  resource: string;
  path: string;
  usageCost: string;
  docLabel: string;
};

const ENDPOINT_ROWS: Record<"stocks" | "crypto" | "macro", EndpointRow[]> = {
  stocks: [
    { resource: "TWSE Daily Price", path: "/v2/datasets/twse-daily-price", usageCost: "1 credit", docLabel: "View docs" },
    { resource: "TPEx Daily Price", path: "/v2/datasets/tpex-daily-price", usageCost: "1 credit", docLabel: "View docs" },
    { resource: "Monthly Revenue", path: "/v2/datasets/monthly-revenue", usageCost: "2 credits", docLabel: "View docs" },
  ],
  crypto: [
    { resource: "BTC Spot", path: "/v2/datasets/crypto/btc-spot", usageCost: "2 credits", docLabel: "View docs" },
    { resource: "ETH Spot", path: "/v2/datasets/crypto/eth-spot", usageCost: "2 credits", docLabel: "View docs" },
  ],
  macro: [
    { resource: "Interest Snapshot", path: "/v2/datasets/interest-rate-snapshot", usageCost: "1 credit", docLabel: "View docs" },
    { resource: "Macro Events", path: "/v2/datasets/macro/events", usageCost: "2 credits", docLabel: "View docs" },
  ],
};

const TAB_LABELS: Array<{ id: "stocks" | "crypto" | "macro"; label: string }> = [
  { id: "stocks", label: "Stocks" },
  { id: "crypto", label: "Crypto" },
  { id: "macro", label: "Macroeconomics" },
];

export function BillingCreditsPage() {
  const [activeTab, setActiveTab] = useState<"stocks" | "crypto" | "macro">("stocks");

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Billing · Credits</h1>
        <p className="mt-2 text-sm text-slate-600">查看 credits 餘額、端點單價與花費記錄。</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <p className="text-sm font-medium text-slate-500">Balance</p>
          <p className="mt-1 text-sm text-slate-600">Available credit balance</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-900">12,480</p>
          <button className={buttonClass("primary", "mt-5")}>Add credits</button>
        </Card>

        <Card className="xl:col-span-2">
          <p className="text-base font-semibold text-slate-900">Endpoints</p>
          <p className="mt-1 text-sm text-slate-600">Usage costs per API call</p>

          <div className="mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {TAB_LABELS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-sm ${activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Resource</th>
                  <th className="px-3 py-2 text-left font-medium">Path</th>
                  <th className="px-3 py-2 text-left font-medium">Usage cost</th>
                  <th className="px-3 py-2 text-left font-medium">Documentation</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINT_ROWS[activeTab].map((row) => (
                  <tr key={`${row.resource}-${row.path}`} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-900">{row.resource}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600">{row.path}</td>
                    <td className="px-3 py-2 text-slate-700">{row.usageCost}</td>
                    <td className="px-3 py-2 text-slate-700">{row.docLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Credit usage is limited to 60 requests per minute.</p>
        </Card>
      </section>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">Save with a subscription</p>
            <p className="mt-1 text-sm text-slate-600">改用訂閱方案可降低單次調用成本，並取得更高穩定性與配額。</p>
          </div>
          <button className={buttonClass("secondary")}>View plans</button>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-slate-900">Spend</p>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700">This month</button>
          </div>
          <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
            No spend data yet
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-slate-900">Transactions</p>
            <button className={buttonClass("secondary", "h-9 rounded-lg px-3 text-xs")}>Export CSV</button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Description</th>
                  <th className="px-3 py-2 text-left font-medium">Amount</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td colSpan={3} className="px-3 py-6 text-center text-slate-500">No transactions yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
