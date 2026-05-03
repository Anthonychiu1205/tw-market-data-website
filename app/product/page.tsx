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

  return (
    <Container className="space-y-8 py-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">產品</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">官方資料 API 產品（第 1 版）</h1>
          <p className="mt-3 text-base text-slate-600">目前對外可公開販售 26 個 dataset；access 採 controlled rollout，並不等同 full public GA。</p>
        </div>
        <CodeWindow
          title="產品面向"
          code={`{
  "available_now_count": 26,
  "access_semantics": "controlled_rollout",
  "billing_semantics": "preview"
}`}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-1">
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
        <p className="mt-2 text-sm text-slate-600">建議先閱讀 Quickstart 與文件，再從 26 個 available-now dataset 中選擇最貼近流程的主題開始整合。</p>
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
