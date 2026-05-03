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
        <p className="mt-3 text-sm text-slate-600">目前 available now：26 個 sellable-now datasets（含財報三表、技術指標、法人流、融資融券、指數成分、ETF flow、衍生性商品、可轉債、結構化事件、公司/市場新聞與主題 taxonomy）。</p>
        <p className="mt-2 text-sm text-slate-600">對外語義維持 controlled rollout；billing 仍為 preview semantics，避免誤判為 full public GA。</p>
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
