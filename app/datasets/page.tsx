import type { Metadata } from "next";
import Link from "next/link";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { datasetsSections } from "@/src/content/docs";
import { datasetProducts } from "@/src/content/site";
import { getProductCatalog } from "@/src/lib/backend-adapter";

export const metadata: Metadata = {
  title: "資料集",
  description: "資料主題目錄與可用狀態。",
};

export default async function DatasetsPage() {
  const catalog = await getProductCatalog("public-catalog@twmd.local");
  const publicBoundary = new Map(
    datasetProducts.map((item) => [item.id.replace(/-/g, "_"), item.readiness]),
  );
  const liveTopics = datasetProducts.filter((item) => item.readiness === "available_now");

  return (
    <DocsLayout title="資料集目錄" description={`目前 public sellable boundary 為 ${liveTopics.length} 個資料集；其餘資料集會標示為 invited / preview 或 not yet available。`} sections={datasetsSections}>
      <Card className="fade-in">
        <SectionHeading id="catalog">資料目錄</SectionHeading>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-2 py-2">Dataset</th>
                <th className="border-b border-slate-200 px-2 py-2">Public boundary</th>
                <th className="border-b border-slate-200 px-2 py-2">Readiness</th>
                <th className="border-b border-slate-200 px-2 py-2">Coverage</th>
                <th className="border-b border-slate-200 px-2 py-2">Mapping</th>
                <th className="border-b border-slate-200 px-2 py-2">Category</th>
                <th className="border-b border-slate-200 px-2 py-2">Actual Table</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {catalog.rows.map((item) => (
                <tr key={item.dataset}>
                  <td className="border-b border-slate-100 px-2 py-2 font-mono text-xs">{item.dataset}</td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    {publicBoundary.get(item.dataset) === "available_now"
                      ? "available_now"
                      : publicBoundary.get(item.dataset) === "invited_preview"
                        ? "invited_preview"
                        : publicBoundary.get(item.dataset) === "not_yet_available"
                          ? "not_yet_available"
                          : "expanding"}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2">
                    {item.isReleaseGrade ? "verified_release_grade" : item.releaseReadinessStatus}
                  </td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.coverageStatus}</td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.mappingStatus}</td>
                  <td className="border-b border-slate-100 px-2 py-2">{item.category}</td>
                  <td className="border-b border-slate-100 px-2 py-2 font-mono text-xs">{item.selectedActualTable || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">catalog source: {catalog.integrationMode === "live" ? "backend /v2/product/catalog" : "fallback"}</p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="maturity">成熟度</SectionHeading>
        <p className="mt-3 text-sm text-slate-600">`verified_release_grade` 是 backend/catalog readiness；是否可對外公開販售仍以目前 public boundary 標示為準。</p>
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
