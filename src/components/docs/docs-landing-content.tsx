import Link from "next/link";

import { SectionHeading } from "@/src/components/docs/section-heading";

export function DocsLandingContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <p className="text-sm leading-7 text-slate-600">
          TW Market Data 提供以 TWSE 上市資料為核心的台股資料 API，並將官方來源整理成一致、可查詢、可串接的資料格式。
        </p>
        <p className="text-sm leading-7 text-slate-600">
          已驗證資料集會明確標示 coverage window、來源與限制。實際可用範圍與配額會依帳號方案與 API key 權限決定，請勿假設所有市場與所有期間都已完整覆蓋。
        </p>
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="docs-portals">文件入口</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">你可以從左側導覽進入資料集文件，也可以先從 Quick Start 建立第一個 request。</p>
        <p className="text-sm leading-7 text-slate-600">
          若要讓 agent 或工具讀取文件，TW Market Data 已提供 llms.txt、llms-full.txt 與 /openapi.json 作為 machine-readable 入口；MCP tools 目前維持 preview / planned，不假設為正式交易或投資建議系統。
        </p>
        <p className="text-sm leading-7 text-slate-600">目前文件會標示 available / preview / deferred 狀態；TPEx 歷史覆蓋與 adjusted price 目前屬 deferred 或受限狀態。</p>
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="what-you-can-access">目前可存取的資料</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>市場價格：TWSE 日線價格（已驗證可用）；TPEx 日線價格目前為 beta / limited，歷史深度 deferred。</li>
          <li>財務與成長：月營收、損益表、資產負債表、現金流量表、財務指標與估值資料。</li>
          <li>籌碼與資金：三大法人買賣、融資融券與資金面資料。</li>
          <li>公司與事件：公司公告、事件日曆與結構化事件；公司行動與股利請依頁面狀態判讀，不預設完整歷史可用。</li>
          <li>分類與結構：主題分類、指數分類與跨資料集對齊用的分類 mapping。</li>
          <li>策略與查詢：features、factor data、time alignment、screener、search API 與 query API。</li>
        </ul>
        <p className="text-sm leading-7 text-slate-600">
          不宣稱 full-market historical coverage、adjusted price 可用、survivorship-safe universe 或 backtest-grade 全市場 baseline。
        </p>
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="built-for">適合使用者</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>AI agent 與 LLM workflow</li>
          <li>台股量化研究與回測流程</li>
          <li>自動化投資研究系統</li>
          <li>內部資料平台與 API 產品</li>
          <li>需要 official/public-first lineage 的金融資料應用</li>
        </ul>
      </section>

      <section className="space-y-3">
        <SectionHeading id="design-principles">設計原則</SectionHeading>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>官方來源優先：以 TWSE、TPEx、MOPS 與其他官方公開資料作為 canonical source。</li>
          <li>結構化回應：不同資料集使用一致的 JSON response pattern 與穩定欄位命名。</li>
          <li>可追溯資料：保留 source role、lineage 與資料處理語義，降低研究流程黑盒化。</li>
          <li>系統優先：文件、API 與 schema 以 agent、程式與資料產品串接為主要使用情境。</li>
          <li>受控推出：available-now、preview 與 not-yet-available 資料明確分級，避免過度承諾。</li>
        </ul>
        <p className="text-sm leading-7 text-slate-600">
          準備開始時，請前往{" "}
          <Link href="/docs/quick-start" className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
            Quick Start
          </Link>{" "}
          建立第一個 request，或直接查看{" "}
          <Link
            href="/docs/api/market-prices/twse-daily-price"
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
          >
            市場與價格資料集
          </Link>
          。
        </p>
      </section>
    </div>
  );
}
