import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import type {
  ApiKeysSummary,
  BillingSummary,
  UsageRequestsSummary,
  UsageSummary,
} from "@/src/lib/backend-adapter";
import { DashboardSection } from "@/src/content/dashboard";
import { cn } from "@/src/lib/cn";

import { buttonClass } from "@/src/components/ui/button";
import { DashboardCard } from "@/src/components/dashboard/dashboard-card";
import { ApiKeysManager } from "@/src/components/dashboard/api-keys-manager";
import { BillingLandingPage } from "@/src/components/dashboard/billing-landing-page";
import { BillingSubscriptionsPage } from "@/src/components/dashboard/billing-subscriptions-page";
import { BillingCreditsPage } from "@/src/components/dashboard/billing-credits-page";
import { UsagePageShell } from "@/src/components/dashboard/usage-page-shell";
import { RequestResponsePlayground } from "@/src/components/dashboard/request-response-playground";
import { OverviewUsageChart } from "@/src/components/dashboard/overview-usage-chart";
import { AccountProfileForm } from "@/src/components/dashboard/account-profile-form";
import { DeleteAccountCard } from "@/src/components/dashboard/delete-account-card";
import { ResearchTerminalEntryCard } from "@/src/components/dashboard/research-terminal-entry-card";
import type { CreditSpendSeries } from "@/src/lib/billing/credits";
import type { PolarBillingSnapshot } from "@/src/lib/billing/polar-subscription";
import { planFromPolarProductId } from "@/src/lib/billing/polar";
import type { CreditsDeductionRuntimeState } from "@/src/lib/billing/credits-mode";
import { getCreditsAmountLabel, getCreditsModeDescription, getCreditsModeLabel } from "@/src/lib/billing/credits-mode";

type DashboardConsoleProps = {
  email: string;
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
  billing: BillingSummary;
  usage: UsageSummary;
  usageRequests: UsageRequestsSummary;
  apiKeys: ApiKeysSummary;
  entitlement: {
    planCode: string;
    planName: string;
    source: "subscription" | "backend" | "fallback";
    subscriptionStatus?: string;
    isEntitled: boolean;
    apiKeyLimit?: number | null;
    datasetLimit?: string | null;
    requestLimitLabel?: string | null;
  };
  subscription: {
    id: string;
    planCode: string;
    status: string;
    billingCycle: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    cancelReason: string | null;
    cancelReasonDetail: string | null;
  } | null;
  /** Live Polar snapshot for /billing/subscriptions; null on free tier / other sections. */
  polar?: PolarBillingSnapshot | null;
  creditWalletBalance: number;
  spendSeries: CreditSpendSeries;
  creditsModeState: CreditsDeductionRuntimeState;
  usageReconciliation: {
    windowDays: number;
    walletBalance: number;
    totalUsageEvents: number;
    totalChargedCredits: number;
    totalTransactionCredits: number;
    mismatchedRequestIds: string[];
    orphanUsageEvents: string[];
    orphanUsageTransactions: string[];
    duplicateUsageTransactions: string[];
  } | null;
  creditTransactions: Array<{
    id: string;
    type: string;
    status: string;
    amountMinor: number | null;
    currency: string | null;
    credits: number;
    balanceAfter: number | null;
    provider: string | null;
    merchantTradeNo: string | null;
    providerTradeNo: string | null;
    packageCode: string | null;
    description: string | null;
    createdAt: string;
  }>;
};

type CreditState = "normal" | "low" | "exhausted";

function PanelTitle({ title, description, mode }: { title: string; description: string; mode: "live" | "fallback" }) {
  const t = useTranslations("dashboard");
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            mode === "live" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
          )}
        >
          {t(mode === "live" ? "mode.live" : "mode.fallback")}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </section>
  );
}

function usageHasEvents(usage: UsageSummary) {
  return usage.dailyUsage.some((item) => item.count > 0);
}

function getLatestActiveUsage(usage: UsageSummary) {
  const latest = [...usage.dailyUsage]
    .reverse()
    .find((item) => item.count > 0);
  return latest ?? null;
}

function UsageActivityCard({
  usage,
  creditsModeState,
}: {
  usage: UsageSummary;
  creditsModeState: CreditsDeductionRuntimeState;
}) {
  const t = useTranslations("dashboard");
  const hasEvents = usageHasEvents(usage);
  const latestActive = getLatestActiveUsage(usage);

  const monthlyUsed = Math.max(usage.monthlyUsed, 0);
  const monthlyQuota = Math.max(usage.monthlyQuota, 1);
  const monthlyRemaining = Math.max(monthlyQuota - monthlyUsed, 0);
  const monthlyUsedPct = Math.max(0, Math.min(100, (monthlyUsed / monthlyQuota) * 100));

  const now = new Date();
  const monthResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  const dayResetAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);

  function formatReset(date: Date) {
    return new Intl.DateTimeFormat("zh-TW", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  const monthlyResetLabel = formatReset(monthResetAt);
  const dailyResetLabel = formatReset(dayResetAt);
  const chartData = usage.dailyUsage.slice(-14).map((item) => ({
    date: item.date.slice(5),
    requests: item.count,
  }));
  const requestsToday = usage.requestsToday ?? 0;
  const requests30d = usage.requests30d ?? monthlyUsed;
  const estimatedCreditsUsage30d = usage.estimatedCreditsUsage30d ?? 0;
  const chargedCreditsUsage30d = usage.chargedCreditsUsage30d ?? 0;
  // In charged mode show what actually left the wallet; in 試算/blocked show the estimate. The old
  // code always showed the estimate, so '30天已扣 credits' counted dry_run calls that never charged.
  const creditsUsage30dDisplay = creditsModeState.mode === "charged" ? chargedCreditsUsage30d : estimatedCreditsUsage30d;
  const recentErrors = usage.recentErrors ?? [];

  return (
    <DashboardCard className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-none">
      <h2 className="text-base font-semibold text-slate-900">{t("usageActivity.title")}</h2>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-slate-600">
            {t("usageActivity.monthlyRemaining", {
              remaining: monthlyRemaining.toLocaleString(),
              quota: monthlyQuota.toLocaleString(),
            })}
          </p>
          <p className="text-xs text-slate-500">
            {t("usageActivity.usedLine", {
              used: monthlyUsed.toLocaleString(),
              pct: monthlyUsedPct.toFixed(1),
              reset: monthlyResetLabel,
            })}
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {t("usageActivity.rateLimitLine", { rate: String(usage.rateLimitPerMin), reset: dailyResetLabel })}
        </p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-700" style={{ width: `${monthlyUsedPct}%` }} />
      </div>

      <div className="mt-5 h-[220px]">
        <OverviewUsageChart data={chartData} />
      </div>

      <div className="mt-4 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
        <p>{t("usageActivity.requestsTodayLine", { count: requestsToday.toLocaleString() })}</p>
        <p>{t("usageActivity.requests30dLine", { count: requests30d.toLocaleString() })}</p>
        <p>{t("usageActivity.credits30dLine", { label: getCreditsAmountLabel(creditsModeState), value: creditsUsage30dDisplay.toLocaleString() })}</p>
      </div>

      {recentErrors.length > 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          {t("usageActivity.recentErrors", {
            list: recentErrors.slice(0, 3).map((item) => `${item.code} (${item.count})`).join("、"),
          })}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-slate-500">
        {hasEvents
          ? t("usageActivity.latestActive", { date: latestActive?.date ?? "", count: (latestActive?.count ?? 0).toLocaleString() })
          : t("usageActivity.noActivity")}
      </p>
      <p className="mt-1 text-xs text-slate-500">{getCreditsModeDescription(creditsModeState)}</p>
    </DashboardCard>
  );
}

function OverviewPanel({
  entitlement,
  usage,
  apiKeys,
  creditState,
  creditWalletBalance,
  creditsModeState,
}: {
  entitlement: DashboardConsoleProps["entitlement"];
  usage: UsageSummary;
  apiKeys: ApiKeysSummary;
  creditState: CreditState;
  creditWalletBalance: number;
  creditsModeState: CreditsDeductionRuntimeState;
}) {
  const t = useTranslations("dashboard");
  const activeKeysCount = apiKeys.keys.filter((item) => item.status !== "revoked").length;
  const requestsToday = usage.requestsToday ?? 0;
  const requests30d = usage.requests30d ?? usage.monthlyUsed;
  const entitlementSourceCopy =
    entitlement.source === "subscription"
      ? t("overview.source.subscription")
      : entitlement.source === "backend"
        ? t("overview.source.backend")
        : t("overview.source.fallback");

  return (
    <div className="space-y-3">
      <DashboardCard className="border-slate-200/80 bg-slate-50/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900">
            {t("overview.currentPlan", { plan: entitlement.planName })}
            {entitlement.isEntitled ? t("overview.inUseSuffix") : ""}
          </p>
          <p className="text-xs text-slate-500">{entitlementSourceCopy}</p>
        </div>
      </DashboardCard>

      <DashboardCard className="border-slate-200/80 bg-slate-50/60">
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-4">
          <p>
            {t("overview.apiKeysStat")}
            <span className="ml-2 font-semibold text-slate-900">{activeKeysCount}</span>
          </p>
          <p>
            {t("overview.requestsToday")}
            <span className="ml-2 font-semibold text-slate-900">{requestsToday.toLocaleString()}</span>
          </p>
          <p>
            {t("overview.requests30d")}
            <span className="ml-2 font-semibold text-slate-900">{requests30d.toLocaleString()}</span>
          </p>
          <p>
            {t("overview.availableCredits")}
            <span className="ml-2 font-semibold text-slate-900">{creditWalletBalance.toLocaleString()}</span>
          </p>
        </div>
        <p className="mt-2 text-xs text-slate-500">{t("overview.currentMode", { mode: getCreditsModeLabel(creditsModeState) })}</p>
      </DashboardCard>

      {creditState === "exhausted" ? (
        <DashboardCard className="border-amber-200 bg-amber-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">{t("overview.quotaExhaustedTitle")}</p>
              <p className="mt-1 text-sm text-amber-800">{t("overview.quotaExhaustedBody")}</p>
            </div>
            <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
              {t("overview.upgradeCta")}
            </Link>
          </div>
        </DashboardCard>
      ) : null}

      <DashboardCard>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">{t("overview.apiKeysHeading")}</h2>
        <p className="text-xs text-slate-500">{t("overview.activeKeys", { count: activeKeysCount })}</p>
        </div>
        <div className="mt-3">
          <ApiKeysManager
            initialKeys={apiKeys.keys}
            canCreate={apiKeys.canCreate}
            canRevoke={apiKeys.canRevoke}
            keyLimit={apiKeys.keyLimit}
            createDisabledReason={apiKeys.createDisabledReason}
            needsSubscription={apiKeys.needsSubscription}
          />
        </div>
      </DashboardCard>

      <UsageActivityCard usage={usage} creditsModeState={creditsModeState} />

      <RequestResponsePlayground
        apiKeys={apiKeys.keys}
        planCode={entitlement.planCode}
        isEntitled={entitlement.isEntitled}
        planName={entitlement.planName}
      />
    </div>
  );
}

function KeysPanel({ apiKeys }: { apiKeys: ApiKeysSummary }) {
  const t = useTranslations("dashboard");
  return (
    <div className="space-y-4">
      <PanelTitle title={t("keys.title")} description={t("keys.description")} mode={apiKeys.integrationMode} />

      <DashboardCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">{t("keys.listTitle")}</h2>
        </div>
        <div className="mt-3">
          <ApiKeysManager
            initialKeys={apiKeys.keys}
            canCreate={apiKeys.canCreate}
            canRevoke={apiKeys.canRevoke}
            keyLimit={apiKeys.keyLimit}
            createDisabledReason={apiKeys.createDisabledReason}
            needsSubscription={apiKeys.needsSubscription}
          />
        </div>
      </DashboardCard>
    </div>
  );
}

function SettingsPanel({
  email,
  entitlement,
}: {
  email: string;
  entitlement: DashboardConsoleProps["entitlement"];
}) {
  const t = useTranslations("dashboard");
  return (
    <div className="space-y-5">

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("settings.planSection")}</h2>
        <DashboardCard className="border-slate-200/80 bg-slate-50/70 p-0 shadow-none">
          <div className="space-y-2 px-5 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("overview.currentPlan", { plan: entitlement.planName })}
                {entitlement.isEntitled ? t("overview.inUseSuffix") : ""}
              </p>
              <p className="text-xs text-slate-500">
                {entitlement.source === "subscription"
                  ? t("overview.source.subscription")
                  : entitlement.source === "backend"
                    ? t("overview.source.backend")
                    : t("overview.source.fallback")}
              </p>
            </div>
            <div>
              <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
                {t("settings.managePlan")}
              </Link>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("settings.accountSection")}</h2>
        <DashboardCard className="border-slate-200/80 bg-slate-50/70 p-0 shadow-none">
          <div className="px-5 py-4">
            <AccountProfileForm email={email} />
          </div>
        </DashboardCard>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("settings.otherSection")}</h2>
        <DashboardCard className="border-slate-200/80 bg-slate-50/70 p-0 shadow-none">
          <div className="divide-y divide-slate-200">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">{t("settings.logout")}</p>
              <form action="/api/auth/logout" method="post">
                <button className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>{t("settings.logout")}</button>
              </form>
            </div>
            <DeleteAccountCard email={email} />
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}

function DocsPanel() {
  const t = useTranslations("dashboard");
  const docsLinks = [
    { labelKey: "docs.links.quickStart", href: "/docs" },
    { labelKey: "docs.links.apiReference", href: "/api" },
    { labelKey: "docs.links.datasetCatalog", href: "/datasets" },
    { labelKey: "docs.links.sourcePolicy", href: "/about" },
  ] as const;
  return (
    <div className="space-y-4">
      <PanelTitle title={t("docs.title")} description={t("docs.description")} mode="fallback" />
      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-2">
          {docsLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonClass("secondary")}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function SupportPanel() {
  const t = useTranslations("dashboard");
  const supportItems = [
    { titleKey: "support.items.sales.title", textKey: "support.items.sales.text" },
    { titleKey: "support.items.data.title", textKey: "support.items.data.text" },
    { titleKey: "support.items.integration.title", textKey: "support.items.integration.text" },
  ] as const;
  return (
    <div className="space-y-4">
      <PanelTitle title={t("support.title")} description={t("support.description")} mode="fallback" />

      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-3">
          {supportItems.map((item) => (
            <div key={item.titleKey} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-sm font-medium text-slate-900">{t(item.titleKey)}</p>
              <p className="mt-1 text-sm text-slate-600">{t(item.textKey)}</p>
            </div>
          ))}
        </div>
        <Link href="/contact" className={buttonClass("secondary", "mt-4")}>
          {t("support.contactCta")}
        </Link>
      </DashboardCard>
    </div>
  );
}

export function renderSection(section: DashboardSection, props: DashboardConsoleProps) {
  const quotaRatio = props.usage.monthlyQuota > 0 ? props.usage.monthlyUsed / props.usage.monthlyQuota : 0;
  const creditState: CreditState = props.usageRequests.insufficientCredits
    ? "exhausted"
    : quotaRatio >= 0.85
      ? "low"
      : "normal";

  if (section === "overview") {
    return (
      <div className="space-y-6">
        <ResearchTerminalEntryCard />
        <OverviewPanel
          entitlement={props.entitlement}
          usage={props.usage}
          apiKeys={props.apiKeys}
          creditState={creditState}
          creditWalletBalance={props.creditWalletBalance}
          creditsModeState={props.creditsModeState}
        />
      </div>
    );
  }
  if (section === "billing") {
    if (props.currentPath === "/billing/subscriptions") {
      // Polar is SSOT for subscription state on this page: derive the paid plan from the ACTIVE
      // Polar subscription's product. Only fall back to the read API entitlement plan when Polar
      // has no active sub (so the page still works if Polar is momentarily unavailable).
      const polarSub = props.polar?.subscription.ok ? props.polar.subscription.data : null;
      const polarActive =
        polarSub && ["active", "trialing", "past_due"].includes(polarSub.status.toLowerCase());
      const polarPlan = polarActive ? planFromPolarProductId(polarSub!.productId) : null;
      const entitlementPlan = props.subscription?.planCode;
      const entitlementPaid =
        entitlementPlan === "starter" ||
        entitlementPlan === "pro" ||
        entitlementPlan === "max" ||
        entitlementPlan === "developer"
          ? entitlementPlan
          : null;
      const paidPlanId = polarPlan ?? entitlementPaid;
      return <BillingSubscriptionsPage currentPlanId={paidPlanId} polar={props.polar ?? null} />;
    }
    if (props.currentPath === "/billing/credits") {
      return (
        <BillingCreditsPage
          creditsModeState={props.creditsModeState}
          walletBalance={props.creditWalletBalance}
          spendSeries={props.spendSeries}
          transactions={props.creditTransactions}
          usageReconciliation={props.usageReconciliation}
        />
      );
    }
    return <BillingLandingPage subscription={props.subscription} />;
  }
  if (section === "usage")
    return (
      <UsagePageShell
        usageRequests={props.usageRequests}
        usageSummary={{ ...props.usage, isDryRun: props.creditsModeState.mode !== "charged" }}
        creditState={creditState}
        creditsModeState={props.creditsModeState}
        usageReconciliation={props.usageReconciliation}
      />
    );
  if (section === "keys") return <KeysPanel apiKeys={props.apiKeys} />;
  if (section === "settings") return <SettingsPanel email={props.email} entitlement={props.entitlement} />;
  if (section === "docs") return <DocsPanel />;
  if (section === "support") return <SupportPanel />;
  return (
    <OverviewPanel
      entitlement={props.entitlement}
      usage={props.usage}
      apiKeys={props.apiKeys}
      creditState={creditState}
      creditWalletBalance={props.creditWalletBalance}
      creditsModeState={props.creditsModeState}
    />
  );
}

