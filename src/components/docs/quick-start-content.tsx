"use client";

import Link from "next/link";

import { AnimatedCodeBlock } from "@/src/components/docs/animated-code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";

const firstRequestTabs = [
  {
    id: "python",
    label: "Python",
    code: `import requests
base_url = "https://api.twmarketdata.com"
headers = {
    "X-API-Key": "your_api_key_here",
}
params = {
    "symbol": "2330",
    "limit": 5,
}
response = requests.get(
    f"{base_url}/v2/datasets/twse-daily-price",
    headers=headers,
    params=params,
)
data = response.json()
print(data)`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    code: `const baseUrl = "https://api.twmarketdata.com";
const params = new URLSearchParams({
  symbol: "2330",
  limit: "5",
});
const response = await fetch(
  \`\${baseUrl}/v2/datasets/twse-daily-price?\${params.toString()}\`,
  {
    headers: {
      "X-API-Key": "your_api_key_here",
    },
  },
);
const data = await response.json();
console.log(data);`,
  },
  {
    id: "curl",
    label: "cURL",
    code: `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=5" \\
  --header "X-API-Key: your_api_key_here"`,
  },
] as const;

const monthlyRevenuePython = `import requests
base_url = "https://api.twmarketdata.com"
headers = {
    "X-API-Key": "your_api_key_here",
}
response = requests.get(
    f"{base_url}/v2/datasets/monthly-revenue",
    headers=headers,
    params={
        "symbol": "2330",
        "limit": 12,
    },
)
data = response.json()
print(data)`;

const issuerProfilePython = `import requests
base_url = "https://api.twmarketdata.com"
headers = {
    "X-API-Key": "your_api_key_here",
}
response = requests.get(
    f"{base_url}/v2/datasets/issuer-profile",
    headers=headers,
    params={
        "symbol": "2330",
    },
)
data = response.json()
print(data)`;

const technicalIndicatorsPython = `import requests
base_url = "https://api.twmarketdata.com"
headers = {
    "X-API-Key": "your_api_key_here",
}
response = requests.get(
    f"{base_url}/v2/datasets/technical-indicators",
    headers=headers,
    params={
        "symbol": "2330",
        "limit": 20,
    },
)
data = response.json()
print(data)`;

const screenerPython = `import requests
base_url = "https://api.twmarketdata.com"
headers = {
    "X-API-Key": "your_api_key_here",
}
body = {
    "filters": [
        {
            "field": "yoy_growth_pct",
            "operator": "gt",
            "value": 20,
        }
    ],
    "limit": 10,
}
response = requests.post(
    f"{base_url}/v2/datasets/screener",
    headers=headers,
    json=body,
)
data = response.json()
print(data)`;

export function QuickStartContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">文件入口</h2>
        <p className="text-sm leading-7 text-slate-600">
          你可以先從左側導覽查看所有資料集，也可以從本頁直接建立第一個 request。若要讓 agent 或內部工具讀取文件，後續可提供
          llms.txt、OpenAPI spec 或 MCP tools 作為入口。
        </p>
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="create-account">建立帳號</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          在 TW Market Data 建立帳號後，進入儀表板建立 API key。所有正式 API request 都會使用
          <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs">X-API-Key</code>
          header 進行認證。
        </p>
        <p className="text-sm leading-7 text-slate-600">
          目前 access 採 controlled rollout。不同方案會影響可用 dataset、rate limit 與月用量上限。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="first-request">發送第一個請求</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          第一個請求建議使用 TWSE 日線價格。這個 endpoint 可查詢上市股票的日線價格、成交量與交易日資料。
        </p>
        <p className="text-sm leading-7 text-slate-700">
          Endpoint：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /v2/datasets/twse-daily-price</code>
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">X-API-Key</code> header
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">symbol</code>，例如 <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">2330</code>
          </li>
          <li>
            可選 <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">limit</code>
          </li>
        </ul>
        <AnimatedCodeBlock tabs={[...firstRequestTabs]} className="mt-2" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">Response example</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{`{
  "dataset": "twse_daily_price",
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-05-06",
      "open": 884,
      "high": 895,
      "low": 878,
      "close": 892,
      "volume": 42168000
    }
  ],
  "count": 1
}`}</code>
          </pre>
          <p className="text-sm leading-7 text-slate-600">
            回應通常包含 dataset、rows 與 count。不同 dataset 會有不同欄位，但 response pattern 會盡量保持一致。
          </p>
        </div>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="explore-more">探索更多 endpoint</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">完成第一個 request 後，可以改查其他常用資料。</p>

        <div className="space-y-6">
          <article className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">1. 查月營收</h3>
            <p className="text-sm text-slate-700">
              Endpoint：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /v2/datasets/monthly-revenue</code>
            </p>
            <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              <code>{monthlyRevenuePython}</code>
            </pre>
          </article>

          <article className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">2. 查公司基本資料</h3>
            <p className="text-sm text-slate-700">
              Endpoint：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /v2/datasets/issuer-profile</code>
            </p>
            <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              <code>{issuerProfilePython}</code>
            </pre>
          </article>

          <article className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">3. 查技術指標</h3>
            <p className="text-sm text-slate-700">
              Endpoint：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /v2/datasets/technical-indicators</code>
            </p>
            <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              <code>{technicalIndicatorsPython}</code>
            </pre>
          </article>

          <article className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">4. 使用 Screener</h3>
            <p className="text-sm text-slate-700">
              Endpoint：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">POST /v2/datasets/screener</code>
            </p>
            <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              <code>{screenerPython}</code>
            </pre>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading id="whats-next">下一步</SectionHeading>
        <div className="grid gap-3 md:grid-cols-2">
          <Link href="/docs/api/market-prices/twse-daily-price" className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">市場與價格</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">查看 TWSE / TPEx 日線價格、還原股價、市場指數與市場廣度。</p>
          </Link>
          <Link href="/docs/api/financial-growth/monthly-revenue" className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">財務與成長</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">查看月營收、財報三表、財務指標與估值資料。</p>
          </Link>
          <Link href="/docs/api/company/issuer-profile" className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">公司與事件</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">查看公司基本資料、公告、事件日曆、公司行動與股利。</p>
          </Link>
          <Link href="/docs/tools-and-mcp" className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Tools / MCP</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">讓 agent 或內部工具以結構化方式使用資料。</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
