import type { Metadata } from "next";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { aboutSections } from "@/src/content/docs";
import { sourcePolicy } from "@/src/content/site";

export const metadata: Metadata = {
  title: "關於",
  description: "來源政策與可信任設計。",
};

export default function AboutPage() {
  return (
    <DocsLayout
      title="信任與來源政策"
      description="台股資料平台的來源原則與可追溯設計。"
      sections={aboutSections}
    >
      <Card className="fade-in">
        <SectionHeading id="trust-model">信任模型</SectionHeading>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          以 canonical、fallback、helper 分層，避免來源混用；回應保留 lineage 與 freshness。
        </p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="source-policy">來源政策</SectionHeading>
        <div className="mt-3 grid gap-2">
          {sourcePolicy.map((line) => (
            <p key={line} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {line}
            </p>
          ))}
        </div>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="why-us">為什麼是這個產品</SectionHeading>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          對研究、量化與開發流程來說，重點不是抓到資料，而是資料可追溯、可驗證、可持續交付。
        </p>
      </Card>
    </DocsLayout>
  );
}
