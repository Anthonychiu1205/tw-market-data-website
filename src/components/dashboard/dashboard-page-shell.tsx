import { redirect } from "next/navigation";

import { getSession } from "@/src/auth/session";
import { DashboardConsole } from "@/src/components/dashboard/dashboard-console";
import { Container } from "@/src/components/ui/container";
import { type DashboardSection } from "@/src/content/dashboard";
import {
  getAccountSummary,
  getApiKeysSummary,
  getBillingSummary,
  getUsageSummary,
} from "@/src/lib/backend-adapter";

type DashboardPageShellProps = {
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
};

export async function DashboardPageShell({ section, currentPath, currentHref }: DashboardPageShellProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [account, billing, usage, apiKeys] = await Promise.all([
    getAccountSummary(session.email),
    getBillingSummary(session.email),
    getUsageSummary(session.email),
    getApiKeysSummary(session.email),
  ]);

  return (
    <Container className="py-8 lg:py-10">
      <DashboardConsole
        email={session.email}
        section={section}
        currentPath={currentPath}
        currentHref={currentHref}
        account={account}
        billing={billing}
        usage={usage}
        apiKeys={apiKeys}
      />
    </Container>
  );
}

