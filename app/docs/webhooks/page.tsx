import type { Metadata } from "next";
import Link from "next/link";

import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

// Static, repo-driven reference page — no backend call. Self-contained (does not touch the docs
// sidebar registry) so it adds a live /docs/webhooks page without changing any existing docs layout.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "文件｜Webhooks",
  description:
    "TW Market Data Webhooks（Phase A）：Standard Webhooks 簽章、at-least-once 不保序語義、三個事件 payload 與驗簽範例。",
  alternates: { canonical: "/docs/webhooks" },
  openGraph: {
    title: "Webhooks | TW Market Data Docs",
    description: "Signed HTTPS push for TW market data events — Standard Webhooks, at-least-once, not ordered.",
    url: "/docs/webhooks",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

const REVENUE_PAYLOAD = `{
  "schema_ver": 1,
  "symbol": "2330",
  "revenue_month": "2026-06",
  "revenue": 331109,
  "unit": { "currency": "TWD", "scale": "thousand_twd" },
  "data_as_of": "2026-07-10",
  "not_investment_advice": true
}`;

const FILING_PAYLOAD = `{
  "schema_ver": 1,
  "symbol": "2330",
  "statement": "income",
  "fiscal_period": "2026-Q1",
  "report_date": "2026-05-15",
  "data_as_of": "2026-05-15",
  "not_investment_advice": true
}`;

const CATALOG_PAYLOAD = `{
  "schema_ver": 1,
  "dataset": "derivatives-market",
  "exposure_status": "public_sellable",
  "reconciliation_badge": "green",
  "not_investment_advice": true
}`;

const ENVELOPE = `{
  "id": "3f2b0c9e-…",
  "type": "revenue.announced",
  "occurred_at": "2026-07-10T09:00:00Z",
  "dataset": "monthly-revenue",
  "symbol": "2330",
  "schema_ver": 1,
  "data": { "…frozen event payload, verbatim…": true }
}`;

const VERIFY_NODE = `import { Webhook } from "standardwebhooks";

const wh = new Webhook(process.env.WEBHOOK_SIGNING_SECRET); // whsec_…
// Pass the RAW request body (bytes as received) — re-serializing changes the signed bytes.
const event = wh.verify(rawRequestBody, {
  "webhook-id": req.headers["webhook-id"],
  "webhook-timestamp": req.headers["webhook-timestamp"],
  "webhook-signature": req.headers["webhook-signature"],
}); // throws on tampered body / wrong secret / stale timestamp`;

const VERIFY_PY = `from standardwebhooks import Webhook

wh = Webhook(os.environ["WEBHOOK_SIGNING_SECRET"])  # whsec_…
event = wh.verify(raw_request_body, {
    "webhook-id": headers["webhook-id"],
    "webhook-timestamp": headers["webhook-timestamp"],
    "webhook-signature": headers["webhook-signature"],
})  # raises on any mismatch`;

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
      <code>{children}</code>
    </pre>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-300">{children}</div>
    </section>
  );
}

export default function WebhooksDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-300">
      <p className="text-sm font-medium text-sky-400">文件 · Webhooks</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Webhooks（Phase A）</h1>
      <p className="mt-4 text-slate-300">
        當發生一個你也能從 <code className="text-slate-100">/freshness</code> 拉到的資料事件時,我們會把{" "}
        <strong className="text-white">同一份凍結 payload</strong> 推送到你的 HTTPS 端點——
        <strong className="text-white">推即是拉,零雙重真相</strong>。投遞以{" "}
        <a className="text-sky-400 underline" href="https://www.standardwebhooks.com/" rel="noreferrer" target="_blank">
          Standard Webhooks
        </a>{" "}
        簽章,失敗會退避重試,並有 SSRF 防護。
      </p>

      <div className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
        <p className="font-semibold text-amber-200">語義:at-least-once、不保序</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>
            同一事件可能送達不只一次(重試/部署中)。請用 <code className="text-slate-100">webhook-id</code>{" "}
            去重,<strong>不要</strong>假設 exactly-once。
          </li>
          <li>不保證依 occurred_at 順序抵達;需要順序請自行以 occurred_at 排序。</li>
        </ul>
      </div>

      <Section id="request" title="請求與簽章 headers">
        <p>
          <code className="text-slate-100">POST</code>,<code className="text-slate-100">Content-Type: application/json</code>。
          三個 Standard Webhooks headers:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <code className="text-slate-100">webhook-id</code> — 事件穩定 id,<strong>用它去重</strong>
          </li>
          <li>
            <code className="text-slate-100">webhook-timestamp</code> — unix 秒;驗簽有 5 分鐘容差
          </li>
          <li>
            <code className="text-slate-100">webhook-signature</code> —{" "}
            <code className="text-slate-100">v1,&lt;base64 HMAC-SHA256&gt;</code>,簽{" "}
            <code className="text-slate-100">{"{id}.{timestamp}.{body}"}</code>
          </li>
        </ul>
        <p>Body envelope(路由 metadata + 凍結 payload 放在 data):</p>
        <Code>{ENVELOPE}</Code>
      </Section>

      <Section id="verify" title="驗簽——用官方庫,別自己寫">
        <p>
          簽章是標準 HMAC-SHA256。用官方庫驗,篡改的 body / 錯的 secret / 過期 timestamp 都會被擋。可直接執行的範例:
        </p>
        <p className="text-sm">
          Node:<code className="text-slate-100">examples/webhooks/verify_signature.mjs</code>(
          <code className="text-slate-100">npm i standardwebhooks</code>)· Python:
          <code className="text-slate-100">examples/webhooks/verify_signature.py</code>(
          <code className="text-slate-100">pip install standardwebhooks</code>)
        </p>
        <Code>{VERIFY_NODE}</Code>
        <Code>{VERIFY_PY}</Code>
      </Section>

      <Section id="events" title="三個事件(schema_ver = 1)">
        <p>
          所有 payload 都帶 <code className="text-slate-100">schema_ver: 1</code> 與{" "}
          <code className="text-slate-100">not_investment_advice: true</code>;結構凍結。
        </p>
        <h3 className="pt-2 font-semibold text-white">revenue.announced — 月營收公告</h3>
        <Code>{REVENUE_PAYLOAD}</Code>
        <h3 className="pt-2 font-semibold text-white">filing.announced — 財報公告</h3>
        <p className="text-sm">statement 為 income | balance | cash_flow。</p>
        <Code>{FILING_PAYLOAD}</Code>
        <h3 className="pt-2 font-semibold text-white">catalog.dataset_listed — 新資料集上架</h3>
        <p className="text-sm">此事件沒有 symbol,因此只會匹配「未設 symbol filter」的訂閱。</p>
        <Code>{CATALOG_PAYLOAD}</Code>
      </Section>

      <Section id="retries" title="重試、退避、自動停用">
        <p>
          失敗(非 2xx、逾時、連線錯誤、<strong>遇到 redirect</strong>)以指數退避 + 抖動重試,
          <strong className="text-white">24 小時內最多 8 次</strong>。用盡後端點會被
          <strong className="text-white">自動停用並 email 通知</strong>帳號;修好後可在後台重新啟用。每次嘗試逐筆記錄。
        </p>
      </Section>

      <Section id="ssrf" title="端點規則(SSRF:建立與每次投遞都檢查)">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>僅 HTTPS。</li>
          <li>
            host 必須解析到公網 IP。私網/loopback/link-local/CGNAT 及雲 metadata(
            <code className="text-slate-100">169.254.169.254</code> / <code className="text-slate-100">fd00:ec2::254</code>)
            一律拒絕(含 IPv4-mapped / 6to4 / NAT64)。
          </li>
          <li>不跟隨 redirect——3xx 視為投遞失敗。</li>
          <li>僅預設埠;URL 不得含帳密;payload 大小上限。</li>
        </ul>
      </Section>

      <Section id="secret" title="簽章密鑰:揭示與輪替">
        <p>
          每個端點有 <code className="text-slate-100">whsec_…</code> 簽章密鑰,
          <strong className="text-white">加密儲存</strong>(與 API key 相同的 key-reveal 鏈),建立時完整顯示
          <strong className="text-white">一次</strong>,其餘僅能經節流的 reveal 端點取得。可隨時
          <strong className="text-white">輪替</strong>——新密鑰回傳一次,舊的立即停止簽章。
        </p>
      </Section>

      <p className="mt-12 text-sm text-slate-400">
        完整參考:<code className="text-slate-100">docs/WEBHOOKS.md</code> ·{" "}
        <Link className="text-sky-400 underline" href="/docs">
          返回文件入口
        </Link>
      </p>
    </main>
  );
}
