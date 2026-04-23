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
        <CodeWindow title="Header" code={`Authorization: Bearer <API_KEY>`} />
      </Card>

      <Card className="fade-in">
        <SectionHeading id="datasets">資料集</SectionHeading>
        <p className="mt-3 text-sm text-slate-600">目前正式可用：`/v2/datasets/issuer-profile`、`/v2/datasets/issuer-announcements`。</p>
        <p className="mt-2 text-sm text-slate-600">`company-news`、`market-news` 為 beta；`interest-rate-snapshot` 為 coming soon。</p>
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
      </Card>
    </DocsLayout>
  );
}
