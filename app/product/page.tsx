import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/src/components/ui/card";
import { CodeWindow } from "@/src/components/ui/code-window";
import { Container } from "@/src/components/ui/container";
import { datasetProducts, platformCapabilities } from "@/src/content/site";

export const metadata: Metadata = {
  title: "產品",
  description: "台股資料產品能力總覽。",
};

export default function ProductPage() {
  const liveTopics = datasetProducts.filter((item) => item.readiness === "available_now");
  const invitedTopics = datasetProducts.filter((item) => item.readiness === "invited_preview");
  const blockedTopics = datasetProducts.filter((item) => item.readiness === "not_yet_available");

  return (
    <Container className="space-y-8 py-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">產品</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">官方資料 API 產品（第 1 版）</h1>
          <p className="mt-3 text-base text-slate-600">目前對外可公開販售 8 個 dataset；其餘能力仍維持 invited / preview 或後續擴充，不等同 full GA。</p>
        </div>
        <CodeWindow
          title="產品面向"
          code={`{
  "available_now": [
    "twse-daily-price",
    "tpex-daily-price",
    "monthly-revenue",
    "valuation-data",
    "adjusted-prices",
    "issuer-announcements",
    "issuer-profile",
    "interest-rate-snapshot"
  ],
  "invited_preview": ["technical-indicators", "institutional-flow", "company-news", "market-news"],
  "not_yet_available": ["income-statement", "cash-flow-statement", "balance-sheet", "margin-short"]
}`}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Available now / 已可公開販售</h2>
          <div className="mt-4 space-y-3">
            {liveTopics.map((topic) => (
              <div key={topic.id} className="rounded-md border border-emerald-200 bg-emerald-50/30 px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">{topic.name}</p>
                <p className="mt-1 text-xs text-slate-600">{topic.shortUseCase}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Invited / Preview</h2>
          <div className="mt-4 space-y-3">
            {invitedTopics.map((topic) => (
              <div key={topic.id} className="rounded-md border border-amber-200 bg-amber-50/40 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{topic.name}</p>
                  <span className="rounded-full border border-amber-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-700">
                    invited / preview
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{topic.shortUseCase}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Not yet available</h2>
          <div className="mt-4 space-y-3">
            {blockedTopics.map((topic) => (
              <div key={topic.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{topic.name}</p>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                    not yet available
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{topic.shortUseCase}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {platformCapabilities.map((group) => (
        <Card key={group.title}>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{group.title}</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {group.items.slice(0, 3).map((item) => (
              <p key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">開始使用</h2>
        <p className="mt-2 text-sm text-slate-600">建議先閱讀 Quickstart 與文件，再從 8 個 available-now dataset 中選擇最貼近流程的主題開始整合。</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/docs/quick-start" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            前往 Quickstart
          </Link>
          <Link href="/docs" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            查看文件
          </Link>
        </div>
      </Card>
    </Container>
  );
}
