import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

export function BillingLandingPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Billing</h1>
        <p className="mt-2 text-sm text-slate-600">管理訂閱方案、credits 與付款相關資訊。</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-lg font-semibold text-slate-900">Subscriptions</p>
          <p className="mt-2 text-sm text-slate-600">查看方案、切換月繳/年繳，並選擇最適合的訂閱層級。</p>
          <Link href="/billing/subscriptions" className={buttonClass("secondary", "mt-5")}>Go to Subscriptions</Link>
        </Card>
        <Card>
          <p className="text-lg font-semibold text-slate-900">Credits</p>
          <p className="mt-2 text-sm text-slate-600">查看 credit balance、端點計價與交易紀錄。</p>
          <Link href="/billing/credits" className={buttonClass("secondary", "mt-5")}>Go to Credits</Link>
        </Card>
      </section>
    </div>
  );
}
