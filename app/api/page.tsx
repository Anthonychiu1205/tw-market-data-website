import type { Metadata } from "next";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { CodeWindow } from "@/src/components/ui/code-window";
import { apiSections } from "@/src/content/docs";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "API",
  description:
    "台股 API 參考與請求範例，涵蓋台灣股票資料、月營收 API、台股財報 API、台股技術指標、三大法人資料與融資融券資料。",
  alternates: {
    canonical: "/api",
  },
  openGraph: {
    title: "API 參考 | TW Market Data",
    description: "TWSE API、TPEx API、MOPS API 的台股資料文件與回應格式說明。",
    url: "/api",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "API 參考 | TW Market Data",
    description: "台股資料 API 文件，支援量化研究與 AI agent financial data workflow。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

export default function ApiPage() {
  return (
    <DocsLayout title="API 參考" description="最常用的驗證、資料集與請求範例。" sections={apiSections}>
      <Card className="fade-in">
        <SectionHeading id="overview">總覽</SectionHeading>
        <p className="mt-3 text-sm text-slate-600">回應固定包含 dataset、source_role、lineage、data、errors。</p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="auth">驗證</SectionHeading>
        <CodeWindow title="Header" code={`X-API-Key: <API_KEY>`} />
        <p className="mt-3 text-sm text-slate-600">帳號與授權狀態可由 `/v2/account/entitlements` 檢視。</p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="datasets">資料集</SectionHeading>
        <p className="mt-3 text-sm text-slate-600">
          available-now 能力以台股核心資料為主，涵蓋市場與價格、財務與成長、籌碼與資金、公司與事件、分類與結構、策略與查詢工具。
        </p>
        <p className="mt-2 text-sm text-slate-600">
          公司新聞與市場新聞目前為 preview；整體 access 採 controlled rollout，並非 full public GA。
        </p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="examples">請求範例</SectionHeading>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <CodeWindow title="Request" code={`GET /v2/datasets/issuer-profile?ticker=2330&limit=1`} />
          <CodeWindow
            title="Response"
            code={`{
  "dataset": "issuer-profile",
  "source_role": "canonical",
  "lineage": { "provider": "TWSE/TPEx" },
  "data": [{ "ticker": "2330", "issuer_name": "台積電" }]
}`}
          />
        </div>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Account surfaces</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>`GET /v2/product/catalog`</li>
            <li>`GET /v2/account/entitlements`</li>
            <li>`GET /v2/account/usage-summary?window=month`</li>
            <li>`GET /v2/account/billing-preview?window=month`（preview only）</li>
          </ul>
        </div>
      </Card>
    </DocsLayout>
  );
}
