import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSession } from "@/src/auth/session";
import { isAdmin } from "@/src/lib/admin/access";
import { GrantPlanForm } from "@/src/components/dashboard/admin/grant-plan-form";

export const metadata: Metadata = {
  title: "Admin · 免費升級用戶",
  robots: { index: false, follow: false },
};

export default async function GrantPlanAdminPage() {
  const session = await getSession();
  if (!isAdmin(session)) {
    // Hide the admin surface entirely from non-admins.
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">免費升級用戶</h1>
        <p className="mt-2 text-sm text-slate-600">
          Owner-only。輸入使用者 email 與方案，伺服器端會呼叫後端 admin 端點開通（不經過瀏覽器帶 token）。
        </p>
        <div className="mt-6">
          <GrantPlanForm />
        </div>
      </section>
    </div>
  );
}
