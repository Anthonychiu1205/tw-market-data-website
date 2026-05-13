import type { Metadata } from "next";

import { DashboardSidebar } from "@/src/components/dashboard/dashboard-sidebar";
import { AiResearchStaticMockPage } from "@/src/components/dashboard/ai-research-static-mock-page";

export const metadata: Metadata = {
  title: "AI Research",
  description: "AI Research Pro+ 靜態研究工作台（mock）。",
};

export default function AiResearchDashboardPage() {
  return (
    <div className="h-[calc(100dvh-73px)] overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-h-0 h-full overflow-hidden">
          <DashboardSidebar
            email="pro-user@twmarketdata.com"
            plan="Pro"
            section="ai-research"
            currentPath="/dashboard/ai-research"
            currentHref="/dashboard/ai-research"
          />
        </aside>
        <main className="min-h-0 min-w-0 h-full overflow-y-auto pr-1">
          <AiResearchStaticMockPage />
        </main>
      </div>
    </div>
  );
}
