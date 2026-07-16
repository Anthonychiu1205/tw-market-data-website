import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, Check } from "lucide-react";

import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";

// Tools / MCP docs page content (/docs/tools-and-mcp). Content is transcribed from the published
// source (docs_tools-and-mcp_上線版_20260716.md) — MCP is LIVE, framed as "已上線", not preview.
// Every code block uses CodeBlock (built-in copy). The "連上" client picker uses native <details>
// accordions so it needs no client JS. Only clients that actually connect over the X-API-Key header
// are listed; OAuth-only clients (ChatGPT / Claude web/desktop) are explicitly marked "開發中".

const MCP_SERVER_URL = "https://mcp.twmarketdata.com/mcp";

function ClientBlock({
  title,
  open = false,
  children,
}: {
  title: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={open}
      className="group rounded-lg border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-800">
        <span>{title}</span>
        <span className="text-slate-400 transition-transform duration-150 group-open:rotate-90">›</span>
      </summary>
      <div className="space-y-3 border-t border-slate-100 px-4 py-4 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </details>
  );
}

export function ToolsMcpContent() {
  return (
    <div className="space-y-10 py-8">
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Tools / MCP —— 把台股接上你的程式與 AI</h1>
        <p className="text-sm leading-7 text-slate-600">
          用一把 API key,就能查台股<strong>官方</strong>資料:行情與還原價、月營收、財報三表、估值、技術指標、籌碼與三大法人、公司事件與公告。
        </p>
        <ul className="space-y-2 text-sm leading-7 text-slate-700">
          <li className="flex items-start gap-2">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>
              <strong>REST API</strong>(<code className="font-mono text-slate-700">api.twmarketdata.com</code>)—— 任何語言、任何能打 HTTP 的程式或 AI agent 都能接。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>
              <strong>MCP</strong>(<code className="font-mono text-slate-700">mcp.twmarketdata.com</code>)—— 讓 Claude、Cursor 等 AI 助理<strong>一鍵連上</strong>、用自然語言問,它自己選工具查。
            </span>
          </li>
        </ul>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          兩者查的是同一份官方資料、同一套定價,<strong>扣點完全一致</strong>。用哪個看你的場景:寫程式用 REST,想讓 AI 助理直接會查台股用 MCP。
        </blockquote>
      </header>

      {/* 先拿一把 API key */}
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="get-key">先拿一把 API key</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          到
          <Link href="/dashboard" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">
            儀表板
          </Link>
          建立一把 key(<code className="font-mono text-slate-700">sk_live_…</code> 開頭)。key 綁定你的方案,決定可查的資料集、rate limit 與用量。
          <strong>請妥善保存;外洩就到儀表板撤銷並重建</strong>(撤銷後永久失效)。
        </p>
      </section>

      {/* A. MCP */}
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="mcp">A. 用 MCP 讓你的 AI 一鍵會查台股(最簡單)</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          MCP 上線後,你的 AI 助理會<strong>自動偵測所有工具</strong>,你用中文/英文問它,它就自己選工具查——不用你手寫任何 API。
        </p>

        <h3 className="pt-2 text-base font-semibold text-slate-900">1. 連上(選你用的 AI 工具)</h3>
        <p className="text-sm leading-7 text-slate-600">
          我們用 <strong>API key(<code className="font-mono">X-API-Key</code> header)</strong> 認證。以下是<strong>目前實測可連</strong>的客戶端 —— 每個都寫清楚「在哪裡設定」。伺服器位址一律是:
          <code className="mx-1 font-mono text-slate-700">{MCP_SERVER_URL}</code>,把 <code className="font-mono text-slate-700">sk_live_你的key</code> 換成你的 key。
        </p>

        <div className="space-y-2.5">
          <ClientBlock title="Claude Code(終端機一行,最快)" open>
            <p>
              在<strong>終端機</strong>執行:
            </p>
            <CodeBlock
              language="bash"
              copyButtonVariant="icon"
              code={`claude mcp add --transport http tw-market-data \\
  https://mcp.twmarketdata.com/mcp \\
  --header "X-API-Key: sk_live_你的key"`}
            />
            <p>
              確認:<code className="font-mono text-slate-700">claude mcp list</code> 看到 <code className="font-mono text-slate-700">tw-market-data ✓ connected</code>。
            </p>
          </ClientBlock>

          <ClientBlock title="Cursor">
            <p>
              編輯設定檔 <strong><code className="font-mono">~/.cursor/mcp.json</code></strong>,加入:
            </p>
            <CodeBlock
              language="json"
              copyButtonVariant="icon"
              code={`{
  "mcpServers": {
    "tw-market-data": {
      "url": "https://mcp.twmarketdata.com/mcp",
      "headers": { "X-API-Key": "sk_live_你的key" }
    }
  }
}`}
            />
            <p>存檔後在 Cursor 設定的 MCP 頁確認已連上。</p>
          </ClientBlock>

          <ClientBlock title="VS Code(Copilot / MCP)">
            <p>
              編輯 <strong><code className="font-mono">mcp.json</code></strong>(macOS:<code className="font-mono text-slate-700">~/Library/Application Support/Code/User/mcp.json</code>;Windows:<code className="font-mono text-slate-700">%APPDATA%\\Code\\User\\mcp.json</code>;Linux:<code className="font-mono text-slate-700">~/.config/Code/User/mcp.json</code>):
            </p>
            <CodeBlock
              language="json"
              copyButtonVariant="icon"
              code={`{
  "servers": {
    "tw-market-data": {
      "type": "http",
      "url": "https://mcp.twmarketdata.com/mcp",
      "headers": { "X-API-Key": "sk_live_你的key" }
    }
  }
}`}
            />
            <p>
              或用命令面板 <code className="font-mono text-slate-700">MCP: Add Server</code>。
            </p>
          </ClientBlock>

          <ClientBlock title="Codex(OpenAI CLI)">
            <p>
              編輯 <strong><code className="font-mono">~/.codex/config.toml</code></strong>:
            </p>
            <CodeBlock
              language="text"
              copyButtonVariant="icon"
              code={`[mcp_servers.tw_market_data]
url = "https://mcp.twmarketdata.com/mcp"
http_headers = { "X-API-Key" = "sk_live_你的key" }`}
            />
          </ClientBlock>

          <ClientBlock title="Gemini CLI">
            <p>
              編輯 <strong><code className="font-mono">~/.gemini/settings.json</code></strong>:
            </p>
            <CodeBlock
              language="json"
              copyButtonVariant="icon"
              code={`{
  "mcpServers": {
    "tw-market-data": {
      "url": "https://mcp.twmarketdata.com/mcp",
      "headers": { "X-API-Key": "sk_live_你的key" }
    }
  }
}`}
            />
          </ClientBlock>

          <ClientBlock title="Windsurf">
            <p>
              編輯 <strong><code className="font-mono">~/.codeium/windsurf/mcp_config.json</code></strong>(注意 Windsurf 用 <code className="font-mono text-slate-700">serverUrl</code>,不是 <code className="font-mono text-slate-700">url</code>):
            </p>
            <CodeBlock
              language="json"
              copyButtonVariant="icon"
              code={`{
  "mcpServers": {
    "tw-market-data": {
      "type": "streamable-http",
      "serverUrl": "https://mcp.twmarketdata.com/mcp",
      "headers": { "X-API-Key": "sk_live_你的key" }
    }
  }
}`}
            />
          </ClientBlock>

          <ClientBlock title="其他(LM Studio / Cherry Studio / Goose / Raycast)">
            <p>
              這些都讀 <code className="font-mono text-slate-700">mcpServers</code> JSON,結構同 Cursor(<code className="font-mono text-slate-700">url</code> + <code className="font-mono text-slate-700">headers</code>)。Raycast 則在 App 內用表單填 Transport: HTTP + URL + header。
            </p>
          </ClientBlock>

          <ClientBlock title="Zed(需一個小轉接)">
            <p>
              Zed 的 URL 表單不接受 header,需用 <code className="font-mono text-slate-700">mcp-remote</code> 轉接。編輯 <strong><code className="font-mono">~/.config/zed/settings.json</code></strong>:
            </p>
            <CodeBlock
              language="json"
              copyButtonVariant="icon"
              code={`{
  "context_servers": {
    "tw-market-data": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.twmarketdata.com/mcp",
               "--header", "X-API-Key: sk_live_你的key"]
    }
  }
}`}
            />
          </ClientBlock>
        </div>

        {/* OAuth-only clients: NOT supported yet. */}
        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
          <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <p>
            <strong>目前尚未支援:ChatGPT、Claude Desktop / Claude.ai 網頁版。</strong> 這些客戶端的連線走 <strong>OAuth</strong>,尚不接受本服務的 API key 連線方式。<strong>OAuth 一鍵連線正在開發中</strong>,屆時這些客戶端也能連 —— 敬請關注。在此之前,請用上方的開發者工具連線,或直接用 REST。
          </p>
        </div>

        <h3 className="pt-2 text-base font-semibold text-slate-900">2. 直接用自然語言問</h3>
        <p className="text-sm leading-7 text-slate-600">連上後,在對話裡直接問,例如:</p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>「查台積電 2330 最近一季損益表。」</li>
          <li>「比較 2330 與 2317 最近 12 個月的月營收 YoY。」</li>
          <li>「列出三大法人最近一週買超最多的股票。」</li>
          <li>「用技術指標找出 RSI &lt; 30 的股票。」</li>
        </ul>
        <p className="text-sm leading-7 text-slate-600">
          你的 AI 會自動:先用 <code className="font-mono text-slate-700">list_datasets</code> 找到對的資料集 → 用 <code className="font-mono text-slate-700">query_dataset</code> 取回乾淨的 JSON → 幫你摘要/比較/篩選。
        </p>

        <h3 className="pt-2 text-base font-semibold text-slate-900">MCP 提供的 4 個工具(你的 AI 會自動選用)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">工具</th>
                <th className="px-3 py-2 font-medium">用途</th>
                <th className="px-3 py-2 font-medium">計費</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">list_datasets</td>
                <td className="px-3 py-2 text-xs text-slate-600">列出所有可用資料集(可依類別/方案層過濾)</td>
                <td className="px-3 py-2 text-xs text-slate-600">免費</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">describe_dataset</td>
                <td className="px-3 py-2 text-xs text-slate-600">看某個資料集的欄位、語義、更新頻率</td>
                <td className="px-3 py-2 text-xs text-slate-600">免費</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">query_dataset</td>
                <td className="px-3 py-2 text-xs text-slate-600">取回實際資料列(支援個股、日期範圍、<code className="font-mono">as_of</code> 時點)</td>
                <td className="px-3 py-2 text-xs font-medium text-slate-700">依資料集扣點(與 REST 同價)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">find_related</td>
                <td className="px-3 py-2 text-xs text-slate-600">跨表/供應鏈關聯推理(找可 join 的資料、同產業鏈個股)</td>
                <td className="px-3 py-2 text-xs text-slate-600">免費</td>
              </tr>
            </tbody>
          </table>
        </div>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          <strong>計費說明</strong>:只有 <code className="font-mono text-slate-700">query_dataset</code> 取回資料本體會扣點,價格與 REST 同一份 SSOT 定價一致;
          <code className="font-mono text-slate-700">list_datasets</code> / <code className="font-mono text-slate-700">describe_dataset</code> / <code className="font-mono text-slate-700">find_related</code> 免費。
        </blockquote>

        <h3 className="pt-2 text-base font-semibold text-slate-900">
          回測友善:point-in-time(<code className="font-mono">as_of</code>)
        </h3>
        <p className="text-sm leading-7 text-slate-600">
          要做回測或給 agent 學習,<code className="font-mono text-slate-700">query_dataset</code> 帶 <code className="font-mono text-slate-700">as_of=&apos;YYYY-MM-DD&apos;</code> —— 財報、月營收等非即時資料會依<strong>揭露/公告日</strong>過濾,讓 agent 只看得到那個時點公開的資訊,不洩漏未來。例:
        </p>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          「查 2330 在 2023-06-30 當時可知的損益表」→ AI 會帶 <code className="font-mono text-slate-700">as_of=2023-06-30</code>。
        </blockquote>
      </section>

      {/* B. REST */}
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="rest">B. 用 REST 接到任何程式 / AI 框架</SectionHeading>

        <h3 className="text-base font-semibold text-slate-900">打第一個呼叫</h3>
        <CodeBlock
          language="bash"
          copyButtonVariant="icon"
          code={`curl -H "X-API-Key: sk_live_你的key" \\
  "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=5"`}
        />
        <p className="text-sm leading-7 text-slate-600">回傳台積電最近 5 個交易日的日線(開高低收、量、還原資訊)= 成功。</p>

        <h3 className="pt-2 text-base font-semibold text-slate-900">換資料集 —— 把路徑最後一段換掉</h3>
        <CodeBlock
          language="bash"
          copyButtonVariant="icon"
          code={`/v2/datasets/monthly-revenue?symbol=2330            # 月營收
/v2/datasets/income-statement?symbol=2330           # 損益表
/v2/datasets/institutional-flow?symbol=2330         # 三大法人買賣超`}
        />

        <h3 className="pt-2 text-base font-semibold text-slate-900">Python</h3>
        <CodeBlock
          language="python"
          copyButtonVariant="icon"
          code={`import requests
r = requests.get(
    "https://api.twmarketdata.com/v2/datasets/twse-daily-price",
    params={"symbol": "2330", "limit": 20},
    headers={"X-API-Key": "sk_live_你的key"},
)
print(r.json()["rows"])`}
        />

        <h3 className="pt-2 text-base font-semibold text-slate-900">JavaScript / TypeScript</h3>
        <CodeBlock
          language="typescript"
          copyButtonVariant="icon"
          code={`const res = await fetch(
  "https://api.twmarketdata.com/v2/datasets/monthly-revenue?symbol=2330",
  { headers: { "X-API-Key": "sk_live_你的key" } },
);
const data = await res.json();`}
        />

        <p className="text-sm leading-7 text-slate-600">
          <strong>接到 AI agent</strong> —— 任何支援「呼叫 HTTP API」的框架(LangChain、自建 tool 等),把上面的 GET 包成一個 tool,agent 就能自己查台股。回傳是乾淨的 normalized JSON,直接餵給模型。
        </p>
      </section>

      {/* 認證 */}
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="auth">認證(Authentication)</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>
            <strong>API Key</strong> —— 每個 request 帶 <code className="font-mono text-slate-700">X-API-Key: sk_live_…</code>(REST 走 header;MCP 走 <code className="font-mono text-slate-700">claude mcp add</code> 的 <code className="font-mono text-slate-700">--header</code>)。key 綁定方案,決定可查資料集、rate limit 與月用量。
          </li>
          <li>
            <strong>安全</strong> —— key 請勿寫進公開程式碼或分享;外洩就到儀表板撤銷重建。
          </li>
        </ul>
      </section>

      {/* 資料集一覽 */}
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="datasets">資料集一覽(每個一行用途)</SectionHeading>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          完整資料集與每次 credits 成本見
          <Link href="/billing/credits" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">
            儀表板成本表
          </Link>
          。MCP 端你的 AI 也能用 <code className="font-mono text-slate-700">list_datasets</code> 隨時列出目前有權限的全部資料集。
        </blockquote>
        <div className="space-y-3 text-sm leading-7 text-slate-700">
          <p><strong>市場與價格</strong><br />上市 / 上櫃個股日線(開高低收、量、還原)、還原價(total-return 回測用)、大盤與類股指數、漲跌家數。</p>
          <p><strong>財務與成長</strong><br />月營收(含 MoM / YoY)、財報三表(損益/資產負債/現金流)、財務比率、估值(PER / PBR / 殖利率)。</p>
          <p><strong>籌碼與資金</strong><br />三大法人買賣超、融資融券、借券、法人持股 / 集保股權分散、當沖、大額交易人未平倉。</p>
          <p><strong>衍生性 / 可轉債</strong><br />期貨、選擇權日資料(TAIFEX)、可轉債日成交。</p>
          <p><strong>事件 / 風險 / 股利</strong><br />公司事件與公告、裁罰 / 法律風險事件、股利 / 除權息、注意處置。</p>
          <p><strong>技術 / 因子 / 總經</strong><br />技術指標(MA / RSI / MACD…)、選股因子、利率、國際總經、匯率、證券主檔、產業鏈與分類。</p>
        </div>
        <blockquote className="border-l-2 border-amber-300 bg-amber-50/50 pl-4 text-sm leading-7 text-slate-600">
          註:「全市場個股日線聯集(上市+上櫃)」正在上架中;在此之前請用「上市日線」與「上櫃日線」個別資料集。
        </blockquote>
      </section>

      {/* 語義與注意 */}
      <section className="space-y-3">
        <SectionHeading id="semantics">語義與注意</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>回傳為 <strong>normalized JSON</strong>,欄位穩定;缺資料誠實回 <code className="font-mono text-slate-700">null</code>,不捏造。</li>
          <li>資料為 <strong>EOD 官方數據</strong>(TWSE / TPEx / TAIFEX / MOPS…),<strong>不含即時逐筆、分K、分點</strong>——乾淨、可回測、PIT 安全。</li>
          <li>rate limit 與月度用量依方案;超量回 402 / 429,不靜默放行。</li>
          <li>
            更多:
            <Link href="/docs/quick-start" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">Quick Start</Link>
            ·
            <Link href="/docs/api-model" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">OpenAPI</Link>
            · 給 AI 先讀
            <a href="/llms.txt" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">/llms.txt</a>
            。
          </li>
        </ul>
      </section>
    </div>
  );
}
