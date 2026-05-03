import type { Metadata } from "next";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { CodeWindow } from "@/src/components/ui/code-window";
import { apiSections } from "@/src/content/docs";

export const metadata: Metadata = {
  title: "API",
  description: "台股資料 API 參考。",
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
        <p className="mt-3 text-sm text-slate-600">目前 available now：`/v2/datasets/twse-daily-price`、`/v2/datasets/tpex-daily-price`、`/v2/datasets/monthly-revenue`、`/v2/datasets/valuation-data`、`/v2/datasets/adjusted-prices`、`/v2/datasets/issuer-announcements`、`/v2/datasets/issuer-profile`、`/v2/datasets/interest-rate-snapshot`。</p>
        <p className="mt-2 text-sm text-slate-600">`technical-indicators`、`institutional-flow`、`company-news`、`market-news` 仍屬 invited / preview；其餘資料集仍在擴充，不應視為已全面可用。</p>
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
