import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AlertTriangle, Check } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";

// Tools / MCP docs page content (/docs/tools-and-mcp). The MCP server is LIVE and connectable
// (verified 2026-07-22: v1.28.1, 4 tools) but BETA, not GA — framed as beta here (owner ruling),
// neither "已上線 GA" (overclaim) nor "skeleton" (false: it works). The REST API is the stable path.
// Every code block uses CodeBlock (built-in copy). The "連上" client picker uses native <details>
// accordions so it needs no client JS. Only clients that actually connect over the X-API-Key header
// are listed; OAuth-only clients (ChatGPT / Claude web/desktop) are explicitly marked "開發中".
//
// I18N-01: this is a very long, densely-marked-up prose block, so per spec §1.6 it is localized in
// place with a `zh-TW` / other locale switch (`en` ternaries on every text node) rather than the
// messages catalog. All code samples, endpoint paths, JSON payloads, field names and identifiers
// stay identical across locales (code is data). Numbers/tickers mirror exactly.

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

export async function ToolsMcpContent() {
  const en = (await getLocale()) !== "zh-TW";

  return (
    <div className="space-y-10 py-8">
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {en ? "Tools / MCP — connect Taiwan stocks to your code and AI" : "Tools / MCP —— 把台股接上你的程式與 AI"}
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "With a single API key you can query " : "用一把 API key,就能查台股"}
          <strong>{en ? "official" : "官方"}</strong>
          {en
            ? " Taiwan-stock data: prices and adjusted prices, monthly revenue, financial statements, valuation, technical indicators, chips and institutional flows, corporate events and announcements."
            : "資料:行情與還原價、月營收、財報三表、估值、技術指標、籌碼與三大法人、公司事件與公告。"}
        </p>
        <ul className="space-y-2 text-sm leading-7 text-slate-700">
          <li className="flex items-start gap-2">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>
              <strong>REST API</strong>(<code className="font-mono text-slate-700">api.twmarketdata.com</code>)
              {en
                ? " — any language, any program or AI agent that can make HTTP calls can connect."
                : "—— 任何語言、任何能打 HTTP 的程式或 AI agent 都能接。"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>
              <strong>MCP</strong>(<code className="font-mono text-slate-700">mcp.twmarketdata.com</code>)
              {en ? " — let AI assistants like Claude and Cursor " : "—— 讓 Claude、Cursor 等 AI 助理"}
              <strong>{en ? "connect in one click" : "一鍵連上"}</strong>
              {en
                ? ", ask in natural language, and let them pick the tools to query."
                : "、用自然語言問,它自己選工具查。"}
            </span>
          </li>
        </ul>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          {en
            ? "Both query the same official data with the same pricing, "
            : "兩者查的是同一份官方資料、同一套定價,"}
          <strong>{en ? "credits are identical" : "扣點完全一致"}</strong>
          {en
            ? ". Which to use depends on your scenario: REST for writing code, MCP if you want an AI assistant to query Taiwan stocks directly."
            : "。用哪個看你的場景:寫程式用 REST,想讓 AI 助理直接會查台股用 MCP。"}
        </blockquote>
        <div className="rounded-md border border-amber-500/40 bg-amber-50/50 px-4 py-3 text-sm leading-7 text-amber-900">
          <strong>{en ? "MCP is in beta" : "MCP 為 beta 階段"}</strong>
          {en
            ? " — the server (v1.28.1, tools: list_datasets / describe_dataset / query_dataset / find_related) is live and connectable, but not yet GA. The REST API is the stable path. Details below may change before general availability."
            : "——伺服器(v1.28.1,工具:list_datasets／describe_dataset／query_dataset／find_related)已上線可連,但尚非正式版(GA)。穩定路徑請用 REST API;下方細節在 GA 前可能調整。"}
        </div>
      </header>

      {/* 先拿一把 API key */}
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="get-key">{en ? "Get an API key first" : "先拿一把 API key"}</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "In the " : "到"}
          <Link href="/dashboard" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">
            {en ? "dashboard" : "儀表板"}
          </Link>
          {en ? "create a key (starting with " : "建立一把 key("}
          <code className="font-mono text-slate-700">sk_live_…</code>
          {en
            ? "). The key is bound to your plan and determines which datasets you can query, your rate limit, and usage. "
            : " 開頭)。key 綁定你的方案,決定可查的資料集、rate limit 與用量。"}
          <strong>
            {en
              ? "Keep it safe; if it leaks, revoke and recreate it in the dashboard"
              : "請妥善保存;外洩就到儀表板撤銷並重建"}
          </strong>
          {en ? " (revoked keys are permanently invalid)." : "(撤銷後永久失效)。"}
        </p>
      </section>

      {/* A. MCP */}
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="mcp">
          {en
            ? "A. Use MCP so your AI can query Taiwan stocks in one click (beta)"
            : "A. 用 MCP 讓你的 AI 一鍵會查台股(beta)"}
        </SectionHeading>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "Once MCP is connected, your AI assistant " : "MCP 上線後,你的 AI 助理會"}
          <strong>{en ? "auto-detects all tools" : "自動偵測所有工具"}</strong>
          {en
            ? "; ask it in Chinese or English and it picks the tools to query on its own — you never hand-write any API call."
            : ",你用中文/英文問它,它就自己選工具查——不用你手寫任何 API。"}
        </p>

        <h3 className="pt-2 text-base font-semibold text-slate-900">
          {en ? "1. Connect (pick the AI tool you use)" : "1. 連上(選你用的 AI 工具)"}
        </h3>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "We authenticate with an " : "我們用 "}
          <strong>
            {en ? "API key (" : "API key("}
            <code className="font-mono">X-API-Key</code>
            {en ? " header)" : " header)"}
          </strong>
          {en ? ". Below are the clients " : " 認證。以下是"}
          <strong>{en ? "verified to connect today" : "目前實測可連"}</strong>
          {en
            ? " — each notes exactly where to configure it. The server address is always: "
            : "的客戶端 —— 每個都寫清楚「在哪裡設定」。伺服器位址一律是:"}
          <code className="mx-1 font-mono text-slate-700">{MCP_SERVER_URL}</code>
          {en ? ", and replace " : ","}
          <code className="font-mono text-slate-700">sk_live_你的key</code>
          {en ? " with your key." : " 換成你的 key。"}
        </p>

        <div className="space-y-2.5">
          <ClientBlock
            title={en ? "Claude Code (one line in the terminal, fastest)" : "Claude Code(終端機一行,最快)"}
            open
          >
            <p>
              {en ? "Run in the " : "在"}
              <strong>{en ? "terminal" : "終端機"}</strong>
              {en ? ":" : "執行:"}
            </p>
            <CodeBlock
              language="bash"
              copyButtonVariant="icon"
              code={`claude mcp add --transport http tw-market-data \\
  https://mcp.twmarketdata.com/mcp \\
  --header "X-API-Key: sk_live_你的key"`}
            />
            <p>
              {en ? "Verify: " : "確認:"}
              <code className="font-mono text-slate-700">claude mcp list</code>
              {en ? " shows " : " 看到 "}
              <code className="font-mono text-slate-700">tw-market-data ✓ connected</code>
              {en ? "." : "。"}
            </p>
          </ClientBlock>

          <ClientBlock
            title={en ? "Claude Desktop (via mcp-remote bridge)" : "Claude Desktop(mcp-remote 橋接)"}
          >
            <p>
              {en
                ? "Claude Desktop reaches remote MCP servers through the mcp-remote local bridge (it injects the X-API-Key header). Add to "
                : "Claude Desktop 透過 mcp-remote 本地橋接連遠端 MCP(它會帶上 X-API-Key 標頭)。加到 "}
              <code className="font-mono text-slate-700">claude_desktop_config.json</code>
              {en ? ":" : ":"}
            </p>
            <CodeBlock
              language="json"
              copyButtonVariant="icon"
              code={`{
  "mcpServers": {
    "tw-market-data": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote", "https://mcp.twmarketdata.com/mcp",
        "--transport", "http-only",
        "--header", "X-API-Key: sk_live_你的key"
      ]
    }
  }
}`}
            />
            <p>
              {en
                ? "Restart Claude Desktop; tw-market-data appears in the tools list (list_datasets / describe_dataset / query_dataset / find_related)."
                : "重啟 Claude Desktop,tw-market-data 會出現在工具清單(list_datasets / describe_dataset / query_dataset / find_related)。"}
            </p>
          </ClientBlock>

          <ClientBlock title="Cursor">
            <p>
              {en ? "Edit the config file " : "編輯設定檔 "}
              <strong><code className="font-mono">~/.cursor/mcp.json</code></strong>
              {en ? " and add:" : ",加入:"}
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
            <p>{en ? "After saving, confirm the connection on Cursor's MCP settings page." : "存檔後在 Cursor 設定的 MCP 頁確認已連上。"}</p>
          </ClientBlock>

          <ClientBlock title={en ? "VS Code (Copilot / MCP)" : "VS Code(Copilot / MCP)"}>
            <p>
              {en ? "Edit " : "編輯 "}
              <strong><code className="font-mono">mcp.json</code></strong>
              {en ? " (macOS: " : "(macOS:"}
              <code className="font-mono text-slate-700">~/Library/Application Support/Code/User/mcp.json</code>
              {en ? "; Windows: " : ";Windows:"}
              <code className="font-mono text-slate-700">%APPDATA%\\Code\\User\\mcp.json</code>
              {en ? "; Linux: " : ";Linux:"}
              <code className="font-mono text-slate-700">~/.config/Code/User/mcp.json</code>
              {en ? "):" : "):"}
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
              {en ? "Or use the command palette " : "或用命令面板 "}
              <code className="font-mono text-slate-700">MCP: Add Server</code>
              {en ? "." : "。"}
            </p>
          </ClientBlock>

          <ClientBlock title={en ? "Codex (OpenAI CLI)" : "Codex(OpenAI CLI)"}>
            <p>
              {en ? "Edit " : "編輯 "}
              <strong><code className="font-mono">~/.codex/config.toml</code></strong>:
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
              {en ? "Edit " : "編輯 "}
              <strong><code className="font-mono">~/.gemini/settings.json</code></strong>:
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
              {en ? "Edit " : "編輯 "}
              <strong><code className="font-mono">~/.codeium/windsurf/mcp_config.json</code></strong>
              {en ? " (note Windsurf uses " : "(注意 Windsurf 用 "}
              <code className="font-mono text-slate-700">serverUrl</code>
              {en ? ", not " : ",不是 "}
              <code className="font-mono text-slate-700">url</code>
              {en ? "):" : "):"}
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

          <ClientBlock title={en ? "Others (LM Studio / Cherry Studio / Goose / Raycast)" : "其他(LM Studio / Cherry Studio / Goose / Raycast)"}>
            <p>
              {en ? "These all read " : "這些都讀 "}
              <code className="font-mono text-slate-700">mcpServers</code>
              {en ? " JSON, same structure as Cursor (" : " JSON,結構同 Cursor("}
              <code className="font-mono text-slate-700">url</code>
              {en ? " + " : " + "}
              <code className="font-mono text-slate-700">headers</code>
              {en
                ? "). Raycast instead uses an in-app form: Transport: HTTP + URL + header."
                : ")。Raycast 則在 App 內用表單填 Transport: HTTP + URL + header。"}
            </p>
          </ClientBlock>

          <ClientBlock title={en ? "Zed (needs a small adapter)" : "Zed(需一個小轉接)"}>
            <p>
              {en
                ? "Zed's URL form doesn't accept headers, so you need the "
                : "Zed 的 URL 表單不接受 header,需用 "}
              <code className="font-mono text-slate-700">mcp-remote</code>
              {en ? " adapter. Edit " : " 轉接。編輯 "}
              <strong><code className="font-mono">~/.config/zed/settings.json</code></strong>:
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
            <strong>
              {en
                ? "Not yet supported: ChatGPT, Claude Desktop / Claude.ai web."
                : "目前尚未支援:ChatGPT、Claude Desktop / Claude.ai 網頁版。"}
            </strong>
            {en ? " These clients connect via " : " 這些客戶端的連線走 "}
            <strong>OAuth</strong>
            {en
              ? ", which doesn't yet accept this service's API-key connection. "
              : ",尚不接受本服務的 API key 連線方式。"}
            <strong>{en ? "One-click OAuth is in development" : "OAuth 一鍵連線正在開發中"}</strong>
            {en
              ? "; these clients will be able to connect then — stay tuned. Until then, connect with the developer tools above, or use REST directly."
              : ",屆時這些客戶端也能連 —— 敬請關注。在此之前,請用上方的開發者工具連線,或直接用 REST。"}
          </p>
        </div>

        <h3 className="pt-2 text-base font-semibold text-slate-900">
          {en ? "2. Ask in plain natural language" : "2. 直接用自然語言問"}
        </h3>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "Once connected, just ask in the chat, for example:" : "連上後,在對話裡直接問,例如:"}
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>{en ? "\"Get TSMC 2330's latest quarterly income statement.\"" : "「查台積電 2330 最近一季損益表。」"}</li>
          <li>{en ? "\"Compare the monthly-revenue YoY of 2330 and 2317 over the last 12 months.\"" : "「比較 2330 與 2317 最近 12 個月的月營收 YoY。」"}</li>
          <li>{en ? "\"List the stocks the three major investors bought the most over the past week.\"" : "「列出三大法人最近一週買超最多的股票。」"}</li>
          <li>{en ? <>&quot;Use technical indicators to find stocks with RSI &lt; 30.&quot;</> : <>「用技術指標找出 RSI &lt; 30 的股票。」</>}</li>
        </ul>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "Your AI does this automatically: first " : "你的 AI 會自動:先用 "}
          <code className="font-mono text-slate-700">list_datasets</code>
          {en ? " to find the right dataset → " : " 找到對的資料集 → 用 "}
          <code className="font-mono text-slate-700">query_dataset</code>
          {en
            ? " to fetch clean JSON → then summarize / compare / filter for you."
            : " 取回乾淨的 JSON → 幫你摘要/比較/篩選。"}
        </p>

        <h3 className="pt-2 text-base font-semibold text-slate-900">
          {en ? "The 4 tools MCP provides (your AI selects them automatically)" : "MCP 提供的 4 個工具(你的 AI 會自動選用)"}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">{en ? "Tool" : "工具"}</th>
                <th className="px-3 py-2 font-medium">{en ? "Purpose" : "用途"}</th>
                <th className="px-3 py-2 font-medium">{en ? "Billing" : "計費"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">list_datasets</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {en ? "List all available datasets (filter by category / plan tier)" : "列出所有可用資料集(可依類別/方案層過濾)"}
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">{en ? "Free" : "免費"}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">describe_dataset</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {en ? "See a dataset's fields, semantics, and update cadence" : "看某個資料集的欄位、語義、更新頻率"}
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">{en ? "Free" : "免費"}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">query_dataset</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {en ? "Fetch actual data rows (supports individual stocks, date ranges, and " : "取回實際資料列(支援個股、日期範圍、"}
                  <code className="font-mono">as_of</code>
                  {en ? " point-in-time)" : " 時點)"}
                </td>
                <td className="px-3 py-2 text-xs font-medium text-slate-700">
                  {en ? "Credits per dataset (same price as REST)" : "依資料集扣點(與 REST 同價)"}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">find_related</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {en
                    ? "Cross-table / supply-chain relationship reasoning (find joinable data, same-supply-chain stocks)"
                    : "跨表/供應鏈關聯推理(找可 join 的資料、同產業鏈個股)"}
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">{en ? "Free" : "免費"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          <strong>{en ? "Billing" : "計費說明"}</strong>
          {en ? ": only " : ":只有 "}
          <code className="font-mono text-slate-700">query_dataset</code>
          {en
            ? " fetching the data body consumes credits, priced from the same SSOT as REST; "
            : " 取回資料本體會扣點,價格與 REST 同一份 SSOT 定價一致;"}
          <code className="font-mono text-slate-700">list_datasets</code> /{" "}
          <code className="font-mono text-slate-700">describe_dataset</code> /{" "}
          <code className="font-mono text-slate-700">find_related</code>
          {en ? " are free." : " 免費。"}
        </blockquote>

        <h3 className="pt-2 text-base font-semibold text-slate-900">
          {en ? "Backtest-friendly: point-in-time (" : "回測友善:point-in-time("}
          <code className="font-mono">as_of</code>
          {en ? ")" : ")"}
        </h3>
        <p className="text-sm leading-7 text-slate-600">
          {en ? "For backtests or agent training, pass " : "要做回測或給 agent 學習,"}
          <code className="font-mono text-slate-700">query_dataset</code>
          {en ? " with " : " 帶 "}
          <code className="font-mono text-slate-700">as_of=&apos;YYYY-MM-DD&apos;</code>
          {en
            ? " — non-real-time data such as financial statements and monthly revenue is filtered by "
            : " —— 財報、月營收等非即時資料會依"}
          <strong>{en ? "disclosure / announcement date" : "揭露/公告日"}</strong>
          {en
            ? ", so the agent sees only what was public at that point, with no leakage of the future. Example:"
            : "過濾,讓 agent 只看得到那個時點公開的資訊,不洩漏未來。例:"}
        </p>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          {en
            ? "\"Get the income statement knowable for 2330 as of 2023-06-30\" → the AI passes "
            : "「查 2330 在 2023-06-30 當時可知的損益表」→ AI 會帶 "}
          <code className="font-mono text-slate-700">as_of=2023-06-30</code>
          {en ? "." : "。"}
        </blockquote>
      </section>

      {/* B. REST */}
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="rest">{en ? "B. Use REST from any program / AI framework" : "B. 用 REST 接到任何程式 / AI 框架"}</SectionHeading>

        <h3 className="text-base font-semibold text-slate-900">{en ? "Make your first call" : "打第一個呼叫"}</h3>
        <CodeBlock
          language="bash"
          copyButtonVariant="icon"
          code={`curl -H "X-API-Key: sk_live_你的key" \\
  "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=5"`}
        />
        <p className="text-sm leading-7 text-slate-600">
          {en
            ? "You get TSMC's daily bars for the last 5 trading days (OHLC, volume, adjustment info) = success."
            : "回傳台積電最近 5 個交易日的日線(開高低收、量、還原資訊)= 成功。"}
        </p>

        <h3 className="pt-2 text-base font-semibold text-slate-900">
          {en ? "Switch datasets — swap the last path segment" : "換資料集 —— 把路徑最後一段換掉"}
        </h3>
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
          <strong>{en ? "Connect to an AI agent" : "接到 AI agent"}</strong>
          {en
            ? " — in any framework that can \"call an HTTP API\" (LangChain, your own tool, etc.), wrap the GET above as a tool and the agent can query Taiwan stocks itself. The response is clean normalized JSON, ready to feed straight to the model."
            : " —— 任何支援「呼叫 HTTP API」的框架(LangChain、自建 tool 等),把上面的 GET 包成一個 tool,agent 就能自己查台股。回傳是乾淨的 normalized JSON,直接餵給模型。"}
        </p>
      </section>

      {/* 認證 */}
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="auth">{en ? "Authentication" : "認證(Authentication)"}</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>
            <strong>API Key</strong>
            {en ? " — each request carries " : " —— 每個 request 帶 "}
            <code className="font-mono text-slate-700">X-API-Key: sk_live_…</code>
            {en ? " (REST via header; MCP via the " : "(REST 走 header;MCP 走 "}
            <code className="font-mono text-slate-700">claude mcp add</code>
            {en ? " " : " 的 "}
            <code className="font-mono text-slate-700">--header</code>
            {en
              ? "). The key is bound to your plan and determines which datasets you can query, your rate limit, and monthly usage."
              : ")。key 綁定方案,決定可查資料集、rate limit 與月用量。"}
          </li>
          <li>
            <strong>{en ? "Security" : "安全"}</strong>
            {en
              ? " — never commit the key to public code or share it; if it leaks, revoke and recreate it in the dashboard."
              : " —— key 請勿寫進公開程式碼或分享;外洩就到儀表板撤銷重建。"}
          </li>
        </ul>
      </section>

      {/* 資料集一覽 */}
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="datasets">{en ? "Dataset overview (one line each)" : "資料集一覽(每個一行用途)"}</SectionHeading>
        <blockquote className="border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
          {en ? "For the full dataset list and the credits cost per call, see the " : "完整資料集與每次 credits 成本見"}
          <Link href="/billing/credits" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">
            {en ? "dashboard cost table" : "儀表板成本表"}
          </Link>
          {en ? ". On the MCP side, your AI can also use " : "。MCP 端你的 AI 也能用 "}
          <code className="font-mono text-slate-700">list_datasets</code>
          {en ? " to list all datasets you currently have access to at any time." : " 隨時列出目前有權限的全部資料集。"}
        </blockquote>
        <div className="space-y-3 text-sm leading-7 text-slate-700">
          <p>
            <strong>{en ? "Market & prices" : "市場與價格"}</strong>
            <br />
            {en
              ? "Individual TWSE / TPEx daily bars (OHLC, volume, adjusted), adjusted prices (for total-return backtests), market and sector indices, advancers/decliners."
              : "上市 / 上櫃個股日線(開高低收、量、還原)、還原價(total-return 回測用)、大盤與類股指數、漲跌家數。"}
          </p>
          <p>
            <strong>{en ? "Financials & growth" : "財務與成長"}</strong>
            <br />
            {en
              ? "Monthly revenue (with MoM / YoY), the three financial statements (income / balance sheet / cash flow), financial ratios, valuation (PER / PBR / dividend yield)."
              : "月營收(含 MoM / YoY)、財報三表(損益/資產負債/現金流)、財務比率、估值(PER / PBR / 殖利率)。"}
          </p>
          <p>
            <strong>{en ? "Chips & capital flows" : "籌碼與資金"}</strong>
            <br />
            {en
              ? "Institutional net buy/sell (three major investors), margin trading & short selling, securities lending, institutional holdings / TDCC shareholding dispersion, day trading, large-trader open interest."
              : "三大法人買賣超、融資融券、借券、法人持股 / 集保股權分散、當沖、大額交易人未平倉。"}
          </p>
          <p>
            <strong>{en ? "Derivatives / convertibles" : "衍生性 / 可轉債"}</strong>
            <br />
            {en
              ? "Daily futures and options data (TAIFEX), daily convertible-bond trades."
              : "期貨、選擇權日資料(TAIFEX)、可轉債日成交。"}
          </p>
          <p>
            <strong>{en ? "Events / risk / dividends" : "事件 / 風險 / 股利"}</strong>
            <br />
            {en
              ? "Corporate events and announcements, penalty / legal-risk events, dividends / ex-rights & ex-dividend, alert & disposition."
              : "公司事件與公告、裁罰 / 法律風險事件、股利 / 除權息、注意處置。"}
          </p>
          <p>
            <strong>{en ? "Technicals / factors / macro" : "技術 / 因子 / 總經"}</strong>
            <br />
            {en
              ? "Technical indicators (MA / RSI / MACD…), stock-selection factors, interest rates, global macro, FX, security master, supply chains and classifications."
              : "技術指標(MA / RSI / MACD…)、選股因子、利率、國際總經、匯率、證券主檔、產業鏈與分類。"}
          </p>
        </div>
        <blockquote className="border-l-2 border-amber-300 bg-amber-50/50 pl-4 text-sm leading-7 text-slate-600">
          {en
            ? "Note: the \"all-market individual daily union (TWSE + TPEx)\" is being added; until then, use the separate \"TWSE daily\" and \"TPEx daily\" datasets."
            : "註:「全市場個股日線聯集(上市+上櫃)」正在上架中;在此之前請用「上市日線」與「上櫃日線」個別資料集。"}
        </blockquote>
      </section>

      {/* 語義與注意 */}
      <section className="space-y-3">
        <SectionHeading id="semantics">{en ? "Semantics & notes" : "語義與注意"}</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>
            {en ? "Responses are " : "回傳為 "}
            <strong>normalized JSON</strong>
            {en ? " with stable fields; missing data honestly returns " : ",欄位穩定;缺資料誠實回 "}
            <code className="font-mono text-slate-700">null</code>
            {en ? ", never fabricated." : ",不捏造。"}
          </li>
          <li>
            {en ? "Data is " : "資料為 "}
            <strong>{en ? "official EOD data" : "EOD 官方數據"}</strong>
            {en ? " (TWSE / TPEx / TAIFEX / MOPS…), " : "(TWSE / TPEx / TAIFEX / MOPS…),"}
            <strong>
              {en ? "with no real-time tick, intraday-K, or broker-branch data" : "不含即時逐筆、分K、分點"}
            </strong>
            {en ? " — clean, backtestable, PIT-safe." : "——乾淨、可回測、PIT 安全。"}
          </li>
          <li>
            {en
              ? "Rate limit and monthly usage follow your plan; overage returns 402 / 429, never silently allowed."
              : "rate limit 與月度用量依方案;超量回 402 / 429,不靜默放行。"}
          </li>
          <li>
            {en ? "More: " : "更多:"}
            <Link href="/docs/quick-start" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">Quick Start</Link>
            ·
            <Link href="/docs/api-model" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">OpenAPI</Link>
            {en ? "· for AI to read first " : "· 給 AI 先讀"}
            <a href="/llms.txt" className="mx-1 font-medium text-slate-900 underline-offset-4 hover:underline">/llms.txt</a>
            {en ? "." : "。"}
          </li>
        </ul>
      </section>
    </div>
  );
}
