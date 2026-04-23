import Link from "next/link";

import type {
  AccountSummary,
  ApiKeysSummary,
  BillingSummary,
  UsageRequestsSummary,
  UsageSummary,
} from "@/src/lib/backend-adapter";
import { DashboardSection } from "@/src/content/dashboard";
import { cn } from "@/src/lib/cn";

import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ApiKeysManager } from "@/src/components/dashboard/api-keys-manager";
import { DashboardSidebar } from "@/src/components/dashboard/dashboard-sidebar";
import { BillingLandingPage } from "@/src/components/dashboard/billing-landing-page";
import { BillingSubscriptionsPage } from "@/src/components/dashboard/billing-subscriptions-page";
import { BillingCreditsPage } from "@/src/components/dashboard/billing-credits-page";
import { UsagePageShell } from "@/src/components/dashboard/usage-page-shell";

type DashboardConsoleProps = {
  email: string;
  section: DashboardSection;
  currentPath: string;
  currentHref: string;
  account: AccountSummary;
  billing: BillingSummary;
  usage: UsageSummary;
  usageRequests: UsageRequestsSummary;
  apiKeys: ApiKeysSummary;
};

type CreditState = "normal" | "low" | "exhausted";

function modeLabel(mode: "live" | "fallback") {
  return mode === "live" ? "已連接" : "簡化模式";
}

function PanelTitle({ title, description, mode }: { title: string; description: string; mode: "live" | "fallback" }) {
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
          {modeLabel(mode)}
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

function UsageActivityCard({ usage }: { usage: UsageSummary }) {
  const maxDailyUsage = Math.max(...usage.dailyUsage.map((item) => item.count), 1);
  const hasEvents = usageHasEvents(usage);
  const latestActive = getLatestActiveUsage(usage);
  const topEndpoint = usage.topEndpoints[0] ?? null;

  function levelByCount(count: number) {
    const ratio = count / maxDailyUsage;
    if (ratio === 0) return "bg-slate-100";
    if (ratio < 0.25) return "bg-sky-100";
    if (ratio < 0.5) return "bg-sky-200";
    if (ratio < 0.75) return "bg-sky-300";
    return "bg-sky-400";
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">Activity / Usage</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs text-slate-500">總 requests</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{usage.monthlyUsed.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs text-slate-500">本月配額</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{usage.monthlyQuota.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs text-slate-500">Rate limit</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{usage.rateLimitPerMin} / 分鐘</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-3">
        <p className="text-xs text-slate-500">最近活躍</p>
        <p className="mt-1 text-sm text-slate-700">
          {latestActive ? `${latestActive.date} · ${latestActive.count.toLocaleString()} 次請求` : "目前尚無 usage activity。"}
        </p>
        <p className="mt-1 text-xs text-slate-500">{topEndpoint ? `主要端點：${topEndpoint}` : "目前尚無主要端點資料。"}</p>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-900">使用量熱度</p>
        <p className="mt-1 text-xs text-slate-500">近 {usage.dailyUsage.length} 天請求事件分布</p>
        {hasEvents ? (
          <div className="mt-3 grid grid-cols-[repeat(7,minmax(0,1fr))] gap-2 sm:grid-cols-[repeat(10,minmax(0,1fr))] lg:grid-cols-[repeat(14,minmax(0,1fr))] xl:grid-cols-[repeat(18,minmax(0,1fr))]">
            {usage.dailyUsage.map((item) => (
              <div key={item.date} className="space-y-1">
                <div
                  className={cn("h-6 rounded-md border border-slate-200", levelByCount(item.count))}
                  title={`${item.date} · ${item.count.toLocaleString()} 次`}
                  aria-label={`${item.date} 使用量 ${item.count}`}
                />
                <p className="text-[10px] text-slate-500">{item.date.slice(5)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">目前尚無 daily usage events，可先建立 API 金鑰並發送請求後查看活動熱度。</p>
        )}
      </div>
    </Card>
  );
}

function OverviewPanel({
  account,
  usage,
  apiKeys,
  creditState,
}: {
  account: AccountSummary;
  usage: UsageSummary;
  apiKeys: ApiKeysSummary;
  creditState: CreditState;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">控制台</h1>
        <p className="mt-2 text-sm text-slate-600">查看 API 金鑰、使用量與帳號摘要</p>
      </section>

      {creditState === "exhausted" ? (
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">您的使用額度已用完</p>
              <p className="mt-1 text-sm text-amber-800">請升級方案或購買 credits，恢復資料查詢。</p>
            </div>
            <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
              升級方案
            </Link>
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-base font-semibold text-slate-900">API keys</h2>
        <p className="mt-1 text-sm text-slate-600">管理金鑰清單、複製金鑰與建立/刪除操作。</p>
        <div className="mt-4">
          <ApiKeysManager
            initialKeys={apiKeys.keys}
            canCreate={apiKeys.canCreate}
            canRevoke={apiKeys.canRevoke}
          />
        </div>
      </Card>

      <UsageActivityCard usage={usage} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["目前方案", account.plan, "方案可於價格頁調整"],
          ["帳號狀態", account.accessStatus, `整合狀態：${modeLabel(account.integrationMode)}`],
          ["已啟用資料主題", `${account.enabledDatasets}`, "供授權範圍快速檢查"],
          ["速率限制", `${usage.rateLimitPerMin} / 分鐘`, `本月：${usage.monthlyUsed.toLocaleString()} / ${usage.monthlyQuota.toLocaleString()}`],
        ].map(([title, value, meta]) => (
          <Card key={title} className="h-full">
            <p className="text-xs text-slate-500">{title}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
            <p className="mt-2 text-xs text-slate-500">{meta}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

function KeysPanel({ apiKeys }: { apiKeys: ApiKeysSummary }) {
  return (
    <div className="space-y-4">
      <PanelTitle title="API 金鑰" description="管理金鑰與最近使用時間。" mode={apiKeys.integrationMode} />

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">金鑰清單</h2>
        </div>
        <div className="mt-3">
          <ApiKeysManager
            initialKeys={apiKeys.keys}
            canCreate={apiKeys.canCreate}
            canRevoke={apiKeys.canRevoke}
          />
        </div>
      </Card>
    </div>
  );
}

function SettingsPanel({ email, account }: { email: string; account: AccountSummary }) {
  return (
    <div className="space-y-4">
      <PanelTitle title="設定" description="帳號與方案設定。" mode={account.integrationMode} />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">Plan</h2>
        <Card className="p-0">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Current plan: {account.plan}</p>
              <p className="mt-1 text-xs text-slate-500">可在此管理目前方案與升級設定。</p>
            </div>
            <Link href="/billing/subscriptions" className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>
              Manage Plan
            </Link>
          </div>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">Profile</h2>
        <p className="text-sm text-slate-600">你的帳號資料目前為示意版，可於後續接入真實帳號系統。</p>
        <Card className="p-0">
          <div className="divide-y divide-slate-200">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">Email</p>
              <p className="text-sm text-slate-600">{email}</p>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">First Name</p>
              <p className="text-sm text-slate-600">Ant</p>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">Last Name</p>
              <p className="text-sm text-slate-600">User</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900">More</h2>
        <Card className="p-0">
          <div className="divide-y divide-slate-200">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">Log Out</p>
              <form action="/api/auth/logout" method="post">
                <button className={buttonClass("secondary", "h-9 rounded-lg px-4 text-xs")}>Log Out</button>
              </form>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm font-medium text-slate-900">Delete Account</p>
              <button className={buttonClass("danger-secondary", "h-9 rounded-lg px-4 text-xs")}>Delete</button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function DocsPanel() {
  return (
    <div className="space-y-4">
      <PanelTitle title="文件" description="快速進入導入文件與 API 參考。" mode="fallback" />
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["快速上手", "/docs"],
            ["API 參考", "/api"],
            ["資料集目錄", "/datasets"],
            ["來源政策", "/about"],
          ].map(([label, href]) => (
            <Link
              key={String(label)}
              href={String(href)}
              className={buttonClass("secondary")}
            >
              {String(label)}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SupportPanel() {
  return (
    <div className="space-y-4">
      <PanelTitle title="支援" description="商務洽詢、資料需求與整合協助。" mode="fallback" />

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["商務洽詢", "方案與採購流程"],
            ["資料需求", "欄位或覆蓋範圍"],
            ["整合支援", "API 導入與用量問題"],
          ].map(([title, text]) => (
            <div key={String(title)} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-sm font-medium text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/contact" className={buttonClass("secondary", "mt-4")}>
          前往聯絡頁
        </Link>
      </Card>
    </div>
  );
}

function renderSection(section: DashboardSection, props: DashboardConsoleProps) {
  const quotaRatio = props.usage.monthlyQuota > 0 ? props.usage.monthlyUsed / props.usage.monthlyQuota : 0;
  const creditState: CreditState = props.usageRequests.insufficientCredits
    ? "exhausted"
    : quotaRatio >= 0.85
      ? "low"
      : "normal";

  if (section === "overview") {
    return <OverviewPanel account={props.account} usage={props.usage} apiKeys={props.apiKeys} creditState={creditState} />;
  }
  if (section === "billing") {
    if (props.currentPath === "/billing/subscriptions") return <BillingSubscriptionsPage />;
    if (props.currentPath === "/billing/credits") return <BillingCreditsPage />;
    return <BillingLandingPage />;
  }
  if (section === "usage") return <UsagePageShell usageRequests={props.usageRequests} creditState={creditState} />;
  if (section === "keys") return <KeysPanel apiKeys={props.apiKeys} />;
  if (section === "settings") return <SettingsPanel email={props.email} account={props.account} />;
  if (section === "docs") return <DocsPanel />;
  if (section === "support") return <SupportPanel />;
  return <OverviewPanel account={props.account} usage={props.usage} apiKeys={props.apiKeys} creditState={creditState} />;
}

export function DashboardConsole(props: DashboardConsoleProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <DashboardSidebar
        email={props.email}
        section={props.section}
        plan={props.account.plan}
        currentPath={props.currentPath}
        currentHref={props.currentHref}
      />
      <div className="min-w-0">{renderSection(props.section, props)}</div>
    </div>
  );
}
