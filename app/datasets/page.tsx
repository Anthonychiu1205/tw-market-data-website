import type { Metadata } from "next";
import Link from "next/link";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { datasetsSections } from "@/src/content/docs";
import { datasetProducts } from "@/src/content/site";

export const metadata: Metadata = {
  title: "資料集",
  description: "資料主題目錄與可用狀態。",
};

export default function DatasetsPage() {
  const liveTopics = datasetProducts.filter((item) => item.readiness === "available_now");

  return (
    <DocsLayout title="資料集目錄" description={`目前正式可用 ${liveTopics.length} 個資料主題，其餘為 coming soon / beta。`} sections={datasetsSections}>
      <Card className="fade-in">
        <SectionHeading id="catalog">資料目錄</SectionHeading>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-2 py-2">名稱</th>
                <th className="border-b border-slate-200 px-2 py-2">類型</th>
                <th className="border-b border-slate-200 px-2 py-2">覆蓋範圍</th>
                <th className="border-b border-slate-200 px-2 py-2">狀態</th>
                <th className="border-b border-slate-200 px-2 py-2">Endpoint</th>
                <th className="border-b border-slate-200 px-2 py-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {datasetProducts.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-100 px-2 py-2 font-medium">{item.name}</td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.domain}</td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.marketCoverage}</td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    {item.readiness === "available_now" ? "Available now / 已可用" : item.readiness === "beta" ? "Beta" : "Coming soon"}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2 font-mono text-xs">{item.endpoint ?? "-"}</td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.shortUseCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="maturity">成熟度</SectionHeading>
        <p className="mt-3 text-sm text-slate-600">目前官網只宣告 live topics 為可用；其餘主題保留為 coming soon / beta。</p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="source">來源</SectionHeading>
        <p className="mt-3 text-sm text-slate-600">TWSE / TPEx / MOPS 優先，保留來源角色與追溯資訊。</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/docs/quick-start" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            前往 Quickstart
          </Link>
          <Link href="/docs" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            查看文件
          </Link>
        </div>
      </Card>
    </DocsLayout>
  );
}
