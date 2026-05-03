import type { Metadata } from "next";

import { PricingShell } from "@/src/components/pricing/pricing-shell";
import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "方案",
  description: "台股資料 API 方案與能力比較。",
};

export default function PricingPage() {
  return (
    <Container className="space-y-10 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">台股資料 API 方案</h1>
        <p className="max-w-3xl text-base text-slate-600">目前 pricing / website public boundary 以 26 個 sellable-now dataset 為準；access 維持 controlled rollout，billing 仍保留 preview semantics。</p>
      </section>
      <PricingShell />
    </Container>
  );
}
