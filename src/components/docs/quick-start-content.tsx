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
print("status:", response.status_code)
print("requestId:", response.headers.get("X-Request-Id"))
print("dryRun:", response.headers.get("X-TWMD-Dry-Run"))
print("creditsCost:", response.headers.get("X-TWMD-Credits-Cost"))
print("creditsCharged:", response.headers.get("X-TWMD-Credits-Charged"))
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
console.log({
  status: response.status,
  requestId: response.headers.get("X-Request-Id"),
  dryRun: response.headers.get("X-TWMD-Dry-Run"),
  creditsCost: response.headers.get("X-TWMD-Credits-Cost"),
  creditsCharged: response.headers.get("X-TWMD-Credits-Charged"),
  data,
});`,
  },
  {
    id: "curl",
    label: "cURL",
    code: `curl -i --request GET \\
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

const sdkPythonExample = `from twmarketdata import TWMarketDataClient

client = TWMarketDataClient(api_key="twmd_live_xxx")
result = client.twse_daily_price(symbol="2330", limit=1)

print(result.meta.request_id)
print(result.meta.dry_run)
print(result.meta.credits_cost)
print(result.data)`;

const sdkTypeScriptExample = `import { TWMarketDataClient } from "@twmarketdata/sdk";

const client = new TWMarketDataClient({
  apiKey: "twmd_live_xxx",
  baseUrl: "https://twmarketdata.com",
  timeoutMs: 10000,
});

const result = await client.twseDailyPrice({ symbol: "2330", limit: 1 });
console.log(result.meta.requestId, result.meta.creditsCost, result.meta.dryRun);
console.log(result.data);`;

const sdkErrorHandlingExample = `import {
  TWMarketDataClient,
  AuthenticationError,
  EntitlementError,
  InsufficientCreditsError,
  DatasetNotFoundError,
  UpstreamError,
} from "@twmarketdata/sdk";

const client = new TWMarketDataClient({ apiKey: "twmd_live_xxx" });

try {
  await client.monthlyRevenue({ symbol: "2330", limit: 12 });
} catch (error) {
  if (error instanceof AuthenticationError) console.error("API key 無效");
  else if (error instanceof EntitlementError) console.error("方案未開通");
  else if (error instanceof InsufficientCreditsError) console.error("credits 不足");
  else if (error instanceof DatasetNotFoundError) console.error("dataset 不存在");
  else if (error instanceof UpstreamError) console.error("上游異常");
}`;

const mcpSkeletonExample = `cd packages/mcp-server
npm install --ignore-scripts
npm run build

TWMD_API_KEY=twmd_live_xxx \\
node dist/index.js get_twse_daily_price '{"symbol":"2330","limit":1}'`;

const agentWorkflowExample = `# TypeScript
TWMD_API_KEY=twmd_live_xxx node examples/agents/simple_research_agent.ts

# Python
TWMD_API_KEY=twmd_live_xxx python3 examples/agents/simple_research_agent.py`;

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
        <p className="text-sm leading-7 text-slate-600">
          平台使用輕量 product analytics（非廣告 tracking）來改善登入、API onboarding 與文件體驗；可於網站 analytics 提示選擇關閉。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="sdk-preview">SDK preview（local/dev）</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          我們已提供 Python 與 JavaScript SDK skeleton，讓你不需要手寫 fetch/curl。此階段僅為 local/dev preview，尚未發布到 PyPI 或 npm。
        </p>
        <p className="text-sm leading-7 text-slate-600">
          相關文件：<Link href="/docs/sdk/python-sdk" className="underline underline-offset-4">Python SDK</Link>、
          <Link href="/docs/sdk/javascript-sdk" className="underline underline-offset-4">JavaScript / TypeScript SDK</Link>。
        </p>
        <p className="text-sm leading-7 text-slate-600">
          SDK / MCP 目前為 preview，完整狀態請看
          <Link href="/docs/sdk/release-status" className="ml-1 underline underline-offset-4">Release Status</Link>。
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">Python SDK</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{sdkPythonExample}</code>
          </pre>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">JavaScript / TypeScript SDK</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{sdkTypeScriptExample}</code>
          </pre>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">錯誤處理範例</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{sdkErrorHandlingExample}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="ai-agent-preview">AI Agent / MCP preview（local/dev）</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          TW Market Data 提供 MCP server skeleton、tool manifest 與 agent workflow 範例，方便你把資料能力接到 Claude、Cursor 或自建 agent tools。
        </p>
        <p className="text-sm leading-7 text-slate-600">
          相關文件：
          <Link href="/docs/ai-agents/mcp-server-preview" className="underline underline-offset-4">MCP Server Preview</Link>、
          <Link href="/docs/ai-agents/tool-manifest" className="underline underline-offset-4">Tool Manifest</Link>、
          <Link href="/docs/ai-agents/agent-workflow-examples" className="underline underline-offset-4">Agent Workflow Examples</Link>。
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>
            MCP skeleton：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">packages/mcp-server</code>
          </li>
          <li>
            Tool manifest：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">ai-tools/twmd_tools.json</code>
          </li>
          <li>
            Agent examples：<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">examples/agents</code>
          </li>
        </ul>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">MCP skeleton example</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{mcpSkeletonExample}</code>
          </pre>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">Agent workflow example</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{agentWorkflowExample}</code>
          </pre>
        </div>
        <p className="text-xs text-slate-500">
          此區塊為 preview，僅供 local/dev 驗證，未發布為正式套件或託管 MCP service，且不依賴 LLM API key。
        </p>
        <p className="text-xs text-slate-500">
          Release status matrix：<Link href="/docs/sdk/release-status" className="underline underline-offset-4">/docs/sdk/release-status</Link>
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

        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">Gateway dry-run（Beta）</p>
          <p className="text-sm leading-7 text-slate-600">
            目前可透過官網路徑測試 gateway skeleton：
            <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">GET /v2/datasets/:dataset</code>。
            此階段僅做 entitlement 與成本試算，不會實際扣除 credits。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            請使用 Dashboard 建立的 customer API key 放在 <code className="rounded bg-white px-1 py-0.5 text-xs">X-API-Key</code>。
            Gateway 與 backend 溝通使用的是網站伺服器端 internal token（例如 BACKEND_API_TOKEN），與 customer key 不同。
          </p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-4 text-xs leading-6 text-slate-700">
            <code>{`curl \\
  -H "X-API-Key: twmd_live_xxx" \\
  "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=5"`}</code>
          </pre>
          <p className="text-xs text-slate-500">
            dry-run 回應 headers 會包含 X-TWMD-Plan、X-TWMD-Credits-Cost、X-TWMD-Dry-Run=true 與 X-Request-Id。
          </p>
          <p className="text-xs text-slate-500">
            啟用扣點模式後，回應會包含 X-TWMD-Credits-Charged；credits 不足會回 402 insufficient_credits。X-Request-Id 可提供客服追查。
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">常見錯誤格式</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            <code>{`{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key."
  },
  "requestId": "..."
}`}</code>
          </pre>
          <p className="text-xs text-slate-500">
            常見 code：`401 invalid_api_key`、`403 plan_not_entitled`、`402 insufficient_credits`、`404 dataset_not_found`、`502 upstream_error`、`504 upstream_timeout`。
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
