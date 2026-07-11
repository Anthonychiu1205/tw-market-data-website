"use client";

import Link from "next/link";

import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";

// Endpoint base, path, query param (symbol) and header (X-API-Key) match the homepage code sample
// (api-demo-section.tsx) and /openapi.json — the two SSOTs. Do NOT change to "ticker": the wire
// query param is `symbol` (openapi's TickerParam.name === "symbol").
const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

const curlExample = `curl "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=10" \\
  -H "X-API-Key: $TWMD_API_KEY"`;

const pythonExample = `import requests

r = requests.get(
    "https://api.twmarketdata.com/v2/datasets/twse-daily-price",
    params={"symbol": "2330", "limit": 10},
    headers={"X-API-Key": TWMD_API_KEY},
)
data = r.json()`;

// hub-and-spoke: verified real docs slugs.
const NEXT_DATASETS: { href: string; name: string }[] = [
  { href: "/docs/api/market-prices/twse-daily-price", name: "上市日線" },
  { href: "/docs/api/financial-growth/monthly-revenue", name: "月營收" },
  { href: "/docs/api/capital-flow/institutional-flow", name: "三大法人" },
  { href: "/docs/api/financial-growth/income-statement", name: "財報三表" },
];

// Plain-text version for /llms-full.txt. Reuses the same code samples + data; lead lines mirror
// the JSX below — keep in sync.
export function quickStartLlmsMarkdown(): string {
  return [
    "### 1. 拿一把 API 金鑰",
    "到儀表板（/dashboard）註冊，並在後台建立一把 API 金鑰。金鑰放在請求標頭，別放進網址。",
    "",
    "### 2. 打第一個請求",
    "每個資料端點都是 GET /v2/datasets/{資料集}，用 X-API-Key 標頭帶上金鑰。",
    "```bash",
    curlExample,
    "```",
    "```python",
    pythonExample,
    "```",
    "",
    "### 3. 看回應",
    "回傳 typed JSON，每筆都帶來源；缺的資料如實留空，不會亂補。欄位說明在各資料集頁（/datasets）。",
    "",
    "### 接下來",
    `- 挑一個資料集開始：${NEXT_DATASETS.map((d) => `${d.name} (${d.href})`).join("、")}。`,
    "- 想看額度與方案 → 方案價格（/pricing）。",
    "- 下一步 → 認證（/docs/authentication）",
  ].join("\n");
}

export function QuickStartContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="get-api-key">1. 拿一把 API 金鑰</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          到{" "}
          <Link href="/dashboard" className={linkClass}>儀表板</Link>{" "}
          註冊，並在後台建立一把 API 金鑰。金鑰放在請求標頭，別放進網址。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="first-request">2. 打第一個請求</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          每個資料端點都是 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">GET /v2/datasets/{"{資料集}"}</code>，用{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">X-API-Key</code> 標頭帶上金鑰。
        </p>
        <CodeBlock code={curlExample} language="bash" copyButtonVariant="icon" />
        <CodeBlock code={pythonExample} language="python" copyButtonVariant="icon" />
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="see-response">3. 看回應</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          回傳 typed JSON，每筆都帶來源；缺的資料如實留空，不會亂補。欄位說明在各{" "}
          <Link href="/datasets" className={linkClass}>資料集頁</Link>。
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading id="whats-next">接下來</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          <li>
            挑一個資料集開始：
            {NEXT_DATASETS.map((d, i) => (
              <span key={d.href}>
                {i > 0 ? "、" : ""}
                <Link href={d.href} className={linkClass}>{d.name}</Link>
              </span>
            ))}
            。
          </li>
          <li>
            想看額度與方案 →{" "}
            <Link href="/pricing" className={linkClass}>方案價格</Link>。
          </li>
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          下一步 →{" "}
          <Link href="/docs/authentication" className={linkClass}>認證</Link>
        </p>
      </section>
    </div>
  );
}
