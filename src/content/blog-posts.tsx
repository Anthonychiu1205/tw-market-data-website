import type { ComponentType } from "react";
import Link from "next/link";

type BlogTableOfContentsItem = {
  id: string;
  label: string;
};

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogTopic = {
  slug: string;
  label: string;
};

export type BlogTopicSummary = BlogTopic & {
  count: number;
};

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  topic: BlogTopic;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  tags: string[];
  keywords: string[];
  lead: string;
  tldr: string[];
  tableOfContents: BlogTableOfContentsItem[];
  faq: BlogFaqItem[];
  nextStepIntro: string;
  nextStepItems: string[];
  ctaPrompt: string;
  footerNote: string;
  content: ComponentType;
};

type ArticleTableProps = {
  headers: string[];
  rows: string[][];
};

function ArticleTable({ headers, rows }: ArticleTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((value, valueIndex) => (
                <td key={`${headers[valueIndex]}-${valueIndex}`} className="px-3 py-2 align-top leading-6">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type CodeBlockProps = {
  code: string;
  language?: string;
};

function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}

const recommendedSchemaCode = `{
  "symbol": "2330",
  "name": "台積電",
  "market": "twse",
  "instrument_type": "stock",
  "currency": "TWD",
  "is_active": true
}`;

const ohlcvResponseCode = `{
  "data": [
    {
      "date": "2026-04-23",
      "symbol": "2330",
      "market": "twse",
      "open": 812,
      "high": 825,
      "low": 808,
      "close": 821,
      "volume": 35124000,
      "turnover": 28754100000,
      "currency": "TWD"
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "adjusted": false,
    "timezone": "Asia/Taipei"
  }
}`;

const pythonExampleCode = `import requests
import pandas as pd

headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

params = {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31"
}

response = requests.get(
    "/v1/tw/stocks/ohlcv",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

data = response.json()["data"]
df = pd.DataFrame(data)

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date")

print(df.head())`;

const agentToolsCode = `tools = [
    "search_stocks",
    "get_stock_profile",
    "get_daily_ohlcv",
    "get_realtime_quote",
    "get_financial_statements",
    "get_monthly_revenue",
    "get_institutional_flows",
    "get_etf_constituents",
    "calculate_risk_metrics"
]`;

const agentResponseCode = `{
  "symbol": "2330",
  "signal": "neutral",
  "confidence": 0.62,
  "summary": "價格動能偏強，但估值與短期波動需要進一步檢查。",
  "data_used": [
    "daily_ohlcv",
    "financial_statements",
    "institutional_flows"
  ],
  "risk_flags": [
    "high_recent_volatility",
    "requires_updated_financials"
  ],
  "not_investment_advice": true
}`;

const endpointDesignCode = `GET /v1/tw/stocks/search?q=台積電
GET /v1/tw/stocks/{symbol}/profile
GET /v1/tw/stocks/{symbol}/quote
GET /v1/tw/stocks/{symbol}/ohlcv?from=2025-01-01&to=2025-12-31
GET /v1/tw/stocks/{symbol}/financials
GET /v1/tw/stocks/{symbol}/monthly-revenue
GET /v1/tw/stocks/{symbol}/institutional-flows
GET /v1/tw/etfs/{symbol}/constituents
GET /v1/tw/calendar/trading-days`;

function TaiwanStockApiGuideContent() {
  return (
    <>
      <section id="what-is-taiwan-stock-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">什麼是台股 API？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股 API 是讓程式透過 HTTP request、WebSocket、檔案下載或其他資料介面取得台灣股票市場資料的服務。資料可能來自交易所、櫃買中心、公開資訊觀測站、券商、資料供應商或商用 financial data API。
        </p>
        <p className="text-base leading-8 text-slate-700">
          對一般投資人來說，台股資料可能只是股價、成交量和漲跌幅。對開發者來說，台股資料需要被轉換成可重複使用的資料模型，例如：
        </p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>股票代號與市場別</li>
          <li>每日 OHLCV</li>
          <li>即時 quote</li>
          <li>財報欄位</li>
          <li>ETF 成分股</li>
          <li>法人買賣超</li>
          <li>交易日曆</li>
          <li>除權息與 corporate actions</li>
          <li>API response schema</li>
          <li>error handling 與 rate limit</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          真正可用於產品的台股 API，重點不是能不能抓到資料，而是資料能不能長期穩定地被同一套程式消費。
        </p>
      </section>

      <section id="data-types" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股資料可以分成哪些類型？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股資料通常可以拆成幾個層級。這樣拆分的好處是，開發者可以依照使用情境選擇資料，不需要一開始就把所有資料接進系統。
        </p>
        <ArticleTable
          headers={["資料類型", "常見欄位", "適合情境", "開發注意事項"]}
          rows={[
            ["股票基本資料", "symbol, name, market, industry, isin", "建立股票清單、搜尋、universe selection", "上市、上櫃、興櫃、ETF 不要混在同一個未標準化欄位"],
            ["即時行情", "bid, ask, last, volume, timestamp", "看盤工具、alert、intraday dashboard", "latency、授權、連線穩定性與非展示使用條款"],
            ["盤後行情", "open, high, low, close, volume, turnover", "每日資料管線、研究、報表", "更新時間、欄位格式、缺值處理"],
            ["歷史股價", "date, symbol, open, high, low, close, volume", "回測、因子研究、長期績效分析", "除權息、下市股票、停牌、survivorship bias"],
            ["財報與基本面", "revenue, gross_margin, eps, roe, cash_flow", "基本面因子、估值模型、AI research assistant", "報表期和公告日不能混淆"],
            ["法人與籌碼", "foreign_net_buy, investment_trust_net_buy, dealer_net_buy", "籌碼分析、量化因子、台股特色資料", "單位、買賣超方向、與成交量的對齊"],
            ["ETF 與指數", "constituents, weights, nav, premium_discount", "ETF 分析、index universe、sector rotation", "成分股變更、權重更新頻率、資料授權"],
            ["交易日曆", "date, is_trading_day, session", "backtest、batch jobs、排程", "國定假日、補班日、颱風休市"],
          ]}
        />
      </section>

      <section id="market-differences" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">上市、上櫃、興櫃與 ETF：開發時要注意什麼？</h2>
        <p className="text-base leading-8 text-slate-700">台股市場不是單一資料表。常見資料至少會遇到：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>上市股票</li>
          <li>上櫃股票</li>
          <li>興櫃股票</li>
          <li>ETF</li>
          <li>指數</li>
          <li>權證、受益證券與其他商品</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果 API 沒有明確標示 market 或 instrument type，後續很容易在回測、搜尋、資料清洗時出錯。
        </p>
        <p className="text-base leading-8 text-slate-700">
          例如，2330 是上市股票，部分中小型公司可能在上櫃市場，ETF 則有自己的商品特性。對使用者介面來說，它們都可能被搜尋成股票代號。但對資料管線來說，這些商品應該有清楚的分類。
        </p>
        <p className="text-sm font-medium tracking-wide text-slate-500">Recommended schema</p>
        <CodeBlock code={recommendedSchemaCode} language="json" />
        <p className="text-base leading-8 text-slate-700">
          這種 schema 的好處是，使用者可以用同一個 search endpoint 找到商品，但資料工程師仍然可以在後端保持清楚的分類。
        </p>
      </section>

      <section id="realtime-vs-eod-vs-history" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">即時行情、延遲行情、盤後資料與歷史資料的差異</h2>
        <p className="text-base leading-8 text-slate-700">
          很多人搜尋台股 API 時，其實沒有先定義自己要的是哪一種資料。即時行情、延遲行情、盤後資料和歷史資料的成本、授權、更新頻率與使用情境都不同。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">即時行情</h3>
          <p className="text-base leading-8 text-slate-700">
            即時行情適合看盤工具、alert system、intraday dashboard 或高頻更新的使用者介面。這類資料通常最重視 latency、連線穩定性與資料授權。
          </p>
          <p className="text-base leading-8 text-slate-700">
            但不是所有量化交易或 AI agent workflow 都需要即時資料。很多研究任務只需要每日盤後資料，甚至更適合使用盤後資料，因為它的資料邊界更清楚，也比較容易回測。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">延遲行情</h3>
          <p className="text-base leading-8 text-slate-700">
            延遲行情通常適合非即時決策的展示型產品，例如教育工具、研究頁面或一般資訊型 dashboard。它可以降低即時授權與即時連線的複雜度，但不適合對 latency 敏感的交易決策。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">盤後資料</h3>
          <p className="text-base leading-8 text-slate-700">
            盤後資料是量化研究和資料管線最常用的資料類型之一。每日收盤後取得 open、high、low、close、volume、turnover 等資料，就能支援大多數中低頻策略、因子研究、報表與 AI agent 每日分析。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">歷史資料</h3>
          <p className="text-base leading-8 text-slate-700">歷史資料是回測的基礎。只拿最近幾天的資料無法做策略研究。對台股量化交易來說，歷史資料還需要處理：</p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>除權息</li>
            <li>暫停交易</li>
            <li>下市或下櫃</li>
            <li>股票分割或面額變更</li>
            <li>缺失值</li>
            <li>交易日曆</li>
            <li>survivorship bias</li>
            <li>look-ahead bias</li>
          </ul>
        </div>

        <ArticleTable
          headers={["資料類型", "更新頻率", "適合情境", "主要挑戰"]}
          rows={[
            ["即時行情", "交易時間內持續更新", "看盤、alert、intraday 工具", "latency、授權、連線穩定性"],
            ["延遲行情", "延遲後更新", "資訊展示、教育、非即時 dashboard", "使用者預期與資料標示"],
            ["盤後資料", "每個交易日收盤後", "回測、研究、報表、AI 每日分析", "更新時間、欄位一致性"],
            ["歷史資料", "查詢指定期間", "策略回測、因子分析", "corporate actions、下市資料、資料偏誤"],
          ]}
        />
      </section>

      <section id="data-source-comparison" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">公開資料、交易所資料與商用 API 的差異</h2>
        <p className="text-base leading-8 text-slate-700">
          台股資料可以從不同來源取得。開發者要先理解這些來源的定位，才能決定要怎麼設計資料架構。
        </p>
        <ArticleTable
          headers={["來源", "優點", "限制", "適合使用者"]}
          rows={[
            ["公開資料", "入門成本低，適合學習與原型開發", "欄位可能不一致，資料清洗成本高，批次查詢和穩定性需要自行處理", "學生、個人研究、prototype"],
            ["交易所或官方資料服務", "來源權威，資料類型完整", "需要理解資料格式、授權、更新時間與使用條件", "資料供應商、金融產品、正式資料服務"],
            ["券商 API", "可能同時支援行情與交易", "通常綁定帳戶、交易情境和券商生態", "交易系統、下單流程、個人交易工具"],
            ["商用 financial data API", "schema 統一、文件完整、適合產品與 production workflow", "通常需要訂閱費與 rate limit 管理", "SaaS、量化研究、AI agent、資料產品"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          TW Market Data 的定位是最後一類：把台股資料整理成 developer-friendly 的 financial data API，讓使用者可以把資料接進 application、backtest、dashboard 或 AI agent workflow，而不是每個團隊都重新處理一次資料清洗和欄位標準化。
        </p>
      </section>

      <section id="schema-design" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">一個好用的台股 API schema 應該長什麼樣子？</h2>
        <p className="text-base leading-8 text-slate-700">
          好的 API schema 應該讓使用者一眼看懂資料，不需要猜欄位單位，也不需要自行判斷日期格式。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">OHLCV response example</h3>
          <CodeBlock code={ohlcvResponseCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">欄位設計原則</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["date", "string", "ISO 8601 日期，例如 2026-04-23"],
              ["symbol", "string", "股票代號，例如 2330"],
              ["market", "string", "市場別，例如 twse、tpex"],
              ["open", "number", "開盤價"],
              ["high", "number", "最高價"],
              ["low", "number", "最低價"],
              ["close", "number", "收盤價"],
              ["volume", "number", "成交量，必須清楚定義單位"],
              ["turnover", "number", "成交金額"],
              ["currency", "string", "幣別，例如 TWD"],
            ]}
          />
          <p className="text-base leading-8 text-slate-700">
            最重要的是一致性。API 不應該在不同 endpoint 中混用日期格式、欄位名稱或成交量單位。對量化交易來說，這些細節會直接影響回測結果。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Python example</h3>
          <CodeBlock code={pythonExampleCode} language="python" />
          <p className="text-sm text-slate-600">這是 endpoint 設計示意。實際路徑請以 TW Market Data docs 為準。</p>
          <p className="text-sm leading-7 text-slate-600">
            如果你要直接用 Python 串接 OHLCV 與個股行情，可以接著看
            {" "}
            <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
              Python 抓台股資料教學
            </Link>
            。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            如果你要處理除權息與回測資料品質，建議接著看
            {" "}
            <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
              台股歷史股價 API 設計
            </Link>
            。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            如果你要把資料流程串到策略回測與風險控管，可以再看
            {" "}
            <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
              台股量化交易入門
            </Link>
            。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            如果你正在建立基本面資料層與財報因子流程，可以再看
            {" "}
            <Link href="/blog/taiwan-stock-financial-statements-api" className="text-slate-900 underline underline-offset-4">
              台股財報 API 教學
            </Link>
            。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            如果你要把外資、投信與自營商資料做成可回測的籌碼特徵，可以再看
            {" "}
            <Link href="/blog/taiwan-institutional-investors-api" className="text-slate-900 underline underline-offset-4">
              三大法人買賣超 API
            </Link>
            。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            如果你要建立 ETF 成分股、指數權重與產業分類驅動的 universe selection，可再看
            {" "}
            <Link href="/blog/taiwan-etf-index-constituents-api" className="text-slate-900 underline underline-offset-4">
              台股 ETF 與指數成分股 API
            </Link>
            。
          </p>
          <p className="text-sm leading-7 text-slate-600">
            如果你想把前面這些資料層串成 multi-agent 研究流程，可以再看
            {" "}
            <Link href="/blog/ai-hedge-fund-taiwan-stocks" className="text-slate-900 underline underline-offset-4">
              AI Hedge Fund 台股版
            </Link>
            。
          </p>
        </div>
      </section>

      <section id="quant-workflow" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股 API 在量化交易裡怎麼使用？</h2>
        <p className="text-base leading-8 text-slate-700">台股量化交易通常不是從模型開始，而是從資料開始。資料管線不穩定，策略結果就沒有可信度。</p>
        <p className="text-base leading-8 text-slate-700">一個基本的台股量化流程通常包含：</p>
        <ol className="space-y-2 text-base leading-8 text-slate-700">
          <li>1. 定義股票 universe</li>
          <li>2. 取得歷史 OHLCV</li>
          <li>3. 處理交易日曆與缺值</li>
          <li>4. 加入財報、法人、ETF 或技術指標資料</li>
          <li>5. 產生 signal</li>
          <li>6. 建立 portfolio</li>
          <li>7. 加入交易成本與滑價</li>
          <li>8. 回測績效</li>
          <li>9. 檢查風險與資料偏誤</li>
        </ol>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">量化交易最常用的台股資料</h3>
          <ArticleTable
            headers={["用途", "需要資料", "說明"]}
            rows={[
              ["Universe selection", "股票清單、產業分類、上市上櫃狀態", "決定哪些股票可以被納入策略"],
              ["Price signal", "OHLCV、歷史 K 線", "建立動能、均值回歸、突破等策略"],
              ["Fundamental factor", "財報、月營收、EPS、ROE", "建立基本面選股因子"],
              ["Flow factor", "外資、投信、自營商買賣超", "台股常見籌碼分析資料"],
              ["Risk control", "波動率、成交量、流動性、產業曝險", "控制部位大小與集中風險"],
              ["Backtesting", "歷史價格、交易日曆、交易成本、除權息", "評估策略在歷史資料上的表現"],
            ]}
          />
          <p className="text-base leading-8 text-slate-700">
            這也是為什麼台股 API 不能只提供今天股價。對 quant workflow 來說，歷史資料、欄位一致性、資料更新時間和 edge cases 處理同樣重要。
          </p>
        </div>
      </section>

      <section id="ai-agent-workflow" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股 API 在 AI Agent workflow 裡怎麼使用？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 不能靠語言模型自己猜股價、財報或法人買賣超。金融資料必須由外部工具提供，LLM 才能負責整理、推理、比較與產生結構化結論。
        </p>
        <p className="text-base leading-8 text-slate-700">一個台股 AI agent workflow 可以拆成幾個 tools：</p>
        <CodeBlock code={agentToolsCode} language="python" />
        <p className="text-base leading-8 text-slate-700">
          Agent 不應該只輸出一句看多或看空。比較好的 response schema 應該明確標出資料來源、訊號、信心、風險和缺失資料。
        </p>
        <CodeBlock code={agentResponseCode} language="json" />
        <p className="text-base leading-8 text-slate-700">
          這種格式比自然語言回答更適合放進 production workflow。它可以被 dashboard 呈現，也可以被下一個 agent、risk manager 或 portfolio process 使用。
        </p>
      </section>

      <section id="api-selection-checklist" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">選擇台股 API 的 checklist</h2>
        <p className="text-base leading-8 text-slate-700">在選擇台股 API 之前，可以用下面的 checklist 檢查。</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>是否支援上市與上櫃資料？</li>
          <li>是否支援 ETF 與指數資料？</li>
          <li>是否提供歷史 OHLCV？</li>
          <li>是否清楚標示成交量與成交金額單位？</li>
          <li>是否有交易日曆？</li>
          <li>是否支援除權息或 adjusted price？</li>
          <li>是否能查財報、月營收與基本面資料？</li>
          <li>是否有法人買賣超或籌碼資料？</li>
          <li>是否支援批次查詢？</li>
          <li>是否有穩定的 API docs？</li>
          <li>是否有 rate limit 說明？</li>
          <li>是否提供錯誤碼與 retry 建議？</li>
          <li>是否能用於商業產品或 production workflow？</li>
          <li>是否能被 AI agent / MCP / tool calling 使用？</li>
          <li>是否清楚說明資料更新時間？</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果只是做一次性的資料分析，公開資料或爬取頁面可能足夠。如果要做 SaaS、dashboard、量化回測或 AI agent，應該優先考慮穩定 schema、文件、授權和資料更新流程。
        </p>
      </section>

      <section id="endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是 developer-friendly 台股 API 可以採用的 endpoint 結構示意。</p>
        <CodeBlock code={endpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要和上面完全相同。重點是路徑必須可預期，response schema 必須穩定，錯誤處理必須清楚。
        </p>
      </section>

      <section id="common-mistakes" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見錯誤：把資料抓下來不等於可以做產品</h2>
        <p className="text-base leading-8 text-slate-700">
          很多台股資料專案會卡在同一個地方：prototype 可以跑，但 production 不能用。
        </p>
        <p className="text-base leading-8 text-slate-700">常見問題包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>每個 endpoint 回傳欄位不同</li>
          <li>同一欄位有時是 string，有時是 number</li>
          <li>日期格式不一致</li>
          <li>民國年與西元年混用</li>
          <li>成交量單位沒有標準化</li>
          <li>沒有處理停牌或無成交資料</li>
          <li>沒有保留下市資料</li>
          <li>沒有明確標示資料更新時間</li>
          <li>沒有 cache，導致 request 過多</li>
          <li>沒有 retry，遇到暫時錯誤就中斷 pipeline</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          資料產品的核心不是抓資料，而是讓資料可以被穩定、重複、可監控地使用。
        </p>
      </section>
    </>
  );
}

const pythonSetupCode = `python -m venv .venv
source .venv/bin/activate

pip install requests pandas python-dotenv`;

const pythonEnvCode = `TW_MARKET_DATA_API_KEY=your_api_key_here`;

const pythonLoadEnvCode = `import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")

if not API_KEY:
    raise RuntimeError("Missing TW_MARKET_DATA_API_KEY")`;

const pythonRequestsCode = `import requests

BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/ohlcv",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

payload = response.json()

print(payload.keys())`;

const pythonDataframeCode = `import pandas as pd

data = payload["data"]

df = pd.DataFrame(data)

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

print(df.head())`;

const pythonReturnCode = `df["daily_return"] = df["close"].pct_change()

print(df[["date", "symbol", "close", "daily_return"]].tail())`;

const pythonMultiSymbolCode = `symbols = ["2330", "2317", "2454"]

frames = []

for symbol in symbols:
    response = requests.get(
        f"{BASE_URL}/v1/tw/stocks/{symbol}/ohlcv",
        headers=headers,
        params={
            "from": "2025-01-01",
            "to": "2025-12-31"
        },
        timeout=20
    )
    response.raise_for_status()

    data = response.json()["data"]
    frame = pd.DataFrame(data)
    frames.append(frame)

prices = pd.concat(frames, ignore_index=True)
prices["date"] = pd.to_datetime(prices["date"])

print(prices.head())`;

const pythonRetryCode = `import time
import requests

def fetch_ohlcv(symbol: str, start: str, end: str, max_retries: int = 3) -> pd.DataFrame:
    url = f"{BASE_URL}/v1/tw/stocks/{symbol}/ohlcv"

    for attempt in range(max_retries):
        try:
            response = requests.get(
                url,
                headers=headers,
                params={
                    "from": start,
                    "to": end
                },
                timeout=20
            )

            if response.status_code == 429:
                time.sleep(2 ** attempt)
                continue

            response.raise_for_status()

            payload = response.json()
            data = payload.get("data", [])

            frame = pd.DataFrame(data)

            if frame.empty:
                return frame

            frame["date"] = pd.to_datetime(frame["date"])
            frame = frame.sort_values("date").reset_index(drop=True)

            return frame

        except requests.RequestException:
            if attempt == max_retries - 1:
                raise

            time.sleep(2 ** attempt)

    return pd.DataFrame()`;

const pythonCacheCode = `from pathlib import Path

CACHE_DIR = Path(".cache/ohlcv")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def get_cache_path(symbol: str, start: str, end: str) -> Path:
    return CACHE_DIR / f"{symbol}_{start}_{end}.parquet"

def load_or_fetch_ohlcv(symbol: str, start: str, end: str) -> pd.DataFrame:
    cache_path = get_cache_path(symbol, start, end)

    if cache_path.exists():
        return pd.read_parquet(cache_path)

    frame = fetch_ohlcv(symbol, start, end)

    if not frame.empty:
        frame.to_parquet(cache_path, index=False)

    return frame`;

const pythonPyarrowCode = `pip install pyarrow`;

const pythonBacktestCode = `df = load_or_fetch_ohlcv("2330", "2025-01-01", "2025-12-31")

df["ma20"] = df["close"].rolling(20).mean()
df["ma60"] = df["close"].rolling(60).mean()

df["signal"] = 0
df.loc[df["ma20"] > df["ma60"], "signal"] = 1
df.loc[df["ma20"] <= df["ma60"], "signal"] = 0

print(df[["date", "close", "ma20", "ma60", "signal"]].tail())`;

const pythonToolCode = `def get_daily_ohlcv_tool(symbol: str, start: str, end: str) -> dict:
    frame = load_or_fetch_ohlcv(symbol, start, end)

    return {
        "symbol": symbol,
        "start": start,
        "end": end,
        "rows": len(frame),
        "data": frame.tail(20).to_dict(orient="records"),
        "not_investment_advice": True
    }`;

const pythonFullExampleCode = `import os
import time
from pathlib import Path

import pandas as pd
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

if not API_KEY:
    raise RuntimeError("Missing TW_MARKET_DATA_API_KEY")

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

CACHE_DIR = Path(".cache/ohlcv")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def fetch_ohlcv(symbol: str, start: str, end: str, max_retries: int = 3) -> pd.DataFrame:
    url = f"{BASE_URL}/v1/tw/stocks/{symbol}/ohlcv"

    for attempt in range(max_retries):
        try:
            response = requests.get(
                url,
                headers=headers,
                params={
                    "from": start,
                    "to": end
                },
                timeout=20
            )

            if response.status_code == 429:
                time.sleep(2 ** attempt)
                continue

            response.raise_for_status()

            payload = response.json()
            frame = pd.DataFrame(payload.get("data", []))

            if frame.empty:
                return frame

            frame["date"] = pd.to_datetime(frame["date"])
            frame = frame.sort_values("date").reset_index(drop=True)

            return frame

        except requests.RequestException:
            if attempt == max_retries - 1:
                raise

            time.sleep(2 ** attempt)

    return pd.DataFrame()

def load_or_fetch_ohlcv(symbol: str, start: str, end: str) -> pd.DataFrame:
    cache_path = CACHE_DIR / f"{symbol}_{start}_{end}.parquet"

    if cache_path.exists():
        return pd.read_parquet(cache_path)

    frame = fetch_ohlcv(symbol, start, end)

    if not frame.empty:
        frame.to_parquet(cache_path, index=False)

    return frame

df = load_or_fetch_ohlcv("2330", "2025-01-01", "2025-12-31")

df["daily_return"] = df["close"].pct_change()
df["ma20"] = df["close"].rolling(20).mean()
df["ma60"] = df["close"].rolling(60).mean()
df["signal"] = (df["ma20"] > df["ma60"]).astype(int)

print(df.tail())`;

function PythonTaiwanStockDataApiContent() {
  return (
    <>
      <section id="why-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼用 API 抓台股資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          很多台股資料分析專案一開始都會從爬蟲開始。爬蟲適合 prototype，但如果要建立長期可維護的量化研究、資料 dashboard 或 AI agent workflow，API 會更穩定。
        </p>
        <p className="text-base leading-8 text-slate-700">API 的價值不只是取得資料，而是提供一套可被程式長期消費的資料介面：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>endpoint 穩定</li>
          <li>欄位名稱一致</li>
          <li>日期格式一致</li>
          <li>錯誤碼清楚</li>
          <li>支援批次查詢</li>
          <li>有 rate limit 說明</li>
          <li>可以接進 backtest、ETL、dashboard 或 AI agent tool calling</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果你還不熟悉台股 API 的資料類型，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要專注在回測資料品質、K 線與除權息處理，可以再看
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你下一步要把資料串到策略回測與風控流程，建議接著看
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          。
        </p>
      </section>

      <section id="python-setup" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Python 環境準備</h2>
        <p className="text-base leading-8 text-slate-700">
          這篇文章使用 Python、requests 和 pandas 示範。你可以用 venv、pyenv、conda 或任何你習慣的 Python 環境。
        </p>
        <CodeBlock code={pythonSetupCode} language="bash" />
        <p className="text-base leading-8 text-slate-700">建議不要把 API key 寫死在程式裡。可以用環境變數或 .env 管理。</p>
        <CodeBlock code={pythonEnvCode} language="bash" />
        <CodeBlock code={pythonLoadEnvCode} language="python" />
      </section>

      <section id="requests-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">用 requests 呼叫台股 API</h2>
        <p className="text-base leading-8 text-slate-700">
          以下示範如何用 Python 呼叫台股 OHLCV endpoint。OHLCV 代表 open、high、low、close、volume，是歷史股價與回測最常用的基礎資料。
        </p>
        <CodeBlock code={pythonRequestsCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
      </section>

      <section id="dataframe" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">把 API response 轉成 pandas DataFrame</h2>
        <p className="text-base leading-8 text-slate-700">API response 通常是 JSON。對資料分析與量化研究來說，最常見的下一步是轉成 pandas DataFrame。</p>
        <CodeBlock code={pythonDataframeCode} language="python" />
        <p className="text-base leading-8 text-slate-700">轉成 DataFrame 後，就可以進一步做：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>畫價格走勢</li>
          <li>計算報酬率</li>
          <li>計算技術指標</li>
          <li>建立量化 signal</li>
          <li>匯出成 parquet / csv</li>
          <li>接進 backtesting engine</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">計算日報酬率</h3>
          <CodeBlock code={pythonReturnCode} language="python" />
        </div>
      </section>

      <section id="ohlcv-schema" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">OHLCV 欄位怎麼設計？</h2>
        <p className="text-base leading-8 text-slate-700">穩定的欄位設計比單次抓到資料更重要。對台股資料 API 來說，OHLCV schema 至少應該包含以下欄位。</p>
        <ArticleTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["date", "string", "交易日期，建議使用 ISO 8601，例如 2026-04-23"],
            ["symbol", "string", "股票代號，例如 2330"],
            ["market", "string", "市場別，例如 twse、tpex"],
            ["open", "number", "開盤價"],
            ["high", "number", "最高價"],
            ["low", "number", "最低價"],
            ["close", "number", "收盤價"],
            ["volume", "number", "成交量，需清楚定義單位"],
            ["turnover", "number", "成交金額"],
            ["currency", "string", "幣別，例如 TWD"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          對回測來說，date、symbol、close 和 volume 是最低限度。若要做更完整的策略研究，market、turnover、adjusted price、交易日曆與除權息資料也會很重要。
        </p>
      </section>

      <section id="multi-symbol" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">一次查詢多檔股票</h2>
        <p className="text-base leading-8 text-slate-700">
          量化研究通常不會只看一檔股票，而是會建立一個 universe。例如大型股、ETF 成分股、特定產業或自訂股票池。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果 API 支援批次查詢，可以用 batch endpoint。若目前只支援單檔查詢，也可以在 client 端迴圈呼叫，但要注意 rate limit。
        </p>
        <CodeBlock code={pythonMultiSymbolCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
        <p className="text-base leading-8 text-slate-700">如果後續要做 portfolio-level backtest，建議把資料整理成長表格式：</p>
        <ArticleTable
          headers={["date", "symbol", "open", "high", "low", "close", "volume"]}
          rows={[
            ["2025-01-02", "2330", "1000", "1010", "995", "1005", "25000000"],
            ["2025-01-02", "2317", "180", "183", "178", "181", "32000000"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">長表格式比寬表格式更適合 API、資料庫、ETL 和多商品分析。</p>
      </section>

      <section id="error-handling" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">加入錯誤處理、retry 與 timeout</h2>
        <p className="text-base leading-8 text-slate-700">Production workflow 不能假設每次 request 都會成功。你至少需要處理：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>timeout</li>
          <li>429 rate limit</li>
          <li>401 authentication error</li>
          <li>404 symbol not found</li>
          <li>5xx server error</li>
          <li>response schema 不符合預期</li>
        </ul>
        <CodeBlock code={pythonRetryCode} language="python" />
        <p className="text-base leading-8 text-slate-700">實務上也可以用 tenacity 這類套件管理 retry，但在教學文章中先用簡單函式比較容易理解。</p>
      </section>

      <section id="cache" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">用 cache 降低 API request</h2>
        <p className="text-base leading-8 text-slate-700">
          歷史 OHLCV 不需要每次都重新抓。對研究與回測來說，cache 可以降低 API request、加速 notebook，也避免重複消耗 rate limit。
        </p>
        <CodeBlock code={pythonCacheCode} language="python" />
        <p className="text-base leading-8 text-slate-700">如果要用 parquet，請安裝 pyarrow：</p>
        <CodeBlock code={pythonPyarrowCode} language="bash" />
      </section>

      <section id="workflow" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">接到台股回測或 AI agent workflow</h2>
        <p className="text-base leading-8 text-slate-700">抓資料只是第一步。對 TW Market Data 的使用者來說，更重要的是資料可以接進後續 workflow。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">接到回測系統</h3>
          <p className="text-base leading-8 text-slate-700">一個簡單的 moving average signal 可以這樣建立：</p>
          <CodeBlock code={pythonBacktestCode} language="python" />
          <p className="text-base leading-8 text-slate-700">
            這只是資料處理範例，不是投資策略建議。實際回測還需要交易成本、滑價、position sizing、風險控管和 out-of-sample 驗證。
          </p>
          <p className="text-base leading-8 text-slate-700">
            如果你想直接看完整的 Python 回測框架實作，可以接著看
            {" "}
            <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
              Python 台股回測系統實作
            </Link>
            。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">接到 AI agent tool</h3>
          <p className="text-base leading-8 text-slate-700">
            如果你要讓 AI agent 查詢台股資料，可以把 API 包成 tool function。Agent 負責決定何時查資料，API 負責提供可信的數值資料。
          </p>
          <CodeBlock code={pythonToolCode} language="python" />
          <p className="text-base leading-8 text-slate-700">
            這種格式比把完整 DataFrame 丟給 LLM 更容易控制 token，也比較適合 agent workflow。通常可以先讓工具回傳摘要、最近 N 筆資料、統計值或風險指標，再讓 LLM 產生結構化分析。
          </p>
        </div>
      </section>

      <section id="full-example" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">完整範例程式</h2>
        <p className="text-base leading-8 text-slate-700">以下是一個簡化版完整範例，示範從 API request、DataFrame 整理到 moving average signal。</p>
        <CodeBlock code={pythonFullExampleCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
        <p className="text-sm leading-7 text-slate-600">這是教學用範例，不構成投資建議。實際交易前需要完整回測、風險控管、交易成本與合規檢查。</p>
      </section>
    </>
  );
}

const historicalBasicOhlcvSchemaCode = `{
  "date": "2026-04-23",
  "symbol": "2330",
  "market": "twse",
  "open": 812,
  "high": 825,
  "low": 808,
  "close": 821,
  "volume": 35124000,
  "turnover": 28754100000,
  "currency": "TWD"
}`;

const historicalIntervalQueryCode = `GET /v1/tw/stocks/{symbol}/ohlcv?interval=1d&from=2025-01-01&to=2025-12-31
GET /v1/tw/stocks/{symbol}/ohlcv?interval=1w&from=2025-01-01&to=2025-12-31
GET /v1/tw/stocks/{symbol}/ohlcv?interval=1mo&from=2020-01-01&to=2025-12-31`;

const historicalAdjustedQueryCode = `GET /v1/tw/stocks/2330/ohlcv?from=2020-01-01&to=2025-12-31&adjusted=false
GET /v1/tw/stocks/2330/ohlcv?from=2020-01-01&to=2025-12-31&adjusted=true`;

const historicalAdjustedMetaCode = `{
  "data": [
    {
      "date": "2026-04-23",
      "symbol": "2330",
      "open": 812,
      "high": 825,
      "low": 808,
      "close": 821,
      "volume": 35124000,
      "turnover": 28754100000
    }
  ],
  "meta": {
    "adjusted": false,
    "timezone": "Asia/Taipei",
    "currency": "TWD"
  }
}`;

const historicalResponseSchemaCode = `{
  "data": [
    {
      "date": "2026-04-23",
      "symbol": "2330",
      "market": "twse",
      "open": 812,
      "high": 825,
      "low": 808,
      "close": 821,
      "volume": 35124000,
      "turnover": 28754100000,
      "currency": "TWD"
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "interval": "1d",
    "adjusted": false,
    "from": "2026-04-01",
    "to": "2026-04-23",
    "timezone": "Asia/Taipei"
  }
}`;

const historicalRangeQueryCode = `GET /v1/tw/stocks/2330/ohlcv?from=2025-01-01&to=2025-12-31`;

const historicalBatchQueryCode = `POST /v1/tw/stocks/ohlcv/batch

{
  "symbols": ["2330", "2317", "2454"],
  "from": "2025-01-01",
  "to": "2025-12-31",
  "interval": "1d",
  "adjusted": true
}`;

const historicalPythonFetchCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "from": "2025-01-01",
    "to": "2025-12-31",
    "interval": "1d",
    "adjusted": "true"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/ohlcv",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

payload = response.json()
df = pd.DataFrame(payload["data"])

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

print(df.head())`;

const historicalAdjustedCheckCode = `meta = payload.get("meta", {})

if not meta.get("adjusted"):
    print("Warning: data is not adjusted. Long-term backtest may be affected by corporate actions.")`;

const historicalBacktestCode = `df["return"] = df["close"].pct_change()
df["ma20"] = df["close"].rolling(20).mean()
df["ma60"] = df["close"].rolling(60).mean()

df["signal"] = (df["ma20"] > df["ma60"]).astype(int)
df["strategy_return"] = df["signal"].shift(1) * df["return"]

equity_curve = (1 + df["strategy_return"].fillna(0)).cumprod()

print(equity_curve.tail())`;

const historicalAgentToolCode = `{
  "name": "get_historical_ohlcv",
  "description": "Get historical OHLCV data for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "interval": "1d",
    "adjusted": true
  }
}`;

const historicalAgentResponseCode = `{
  "symbol": "2330",
  "data_used": [
    "historical_ohlcv"
  ],
  "price_adjusted": true,
  "summary": "The stock showed positive momentum over the selected period, but further risk checks are required.",
  "risk_flags": [
    "requires_volume_liquidity_check",
    "strategy_not_backtested"
  ],
  "not_investment_advice": true
}`;

const historicalEndpointDesignCode = `GET /v1/tw/stocks/{symbol}/ohlcv
GET /v1/tw/stocks/{symbol}/ohlcv?interval=1d
GET /v1/tw/stocks/{symbol}/ohlcv?interval=1w
GET /v1/tw/stocks/{symbol}/ohlcv?interval=1mo
GET /v1/tw/stocks/{symbol}/ohlcv?adjusted=true
GET /v1/tw/stocks/{symbol}/corporate-actions
GET /v1/tw/calendar/trading-days`;

function TaiwanStockHistoricalPriceApiContent() {
  return (
    <>
      <section id="why-historical-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼歷史股價 API 對台股量化交易重要？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股量化研究通常不是從模型開始，而是從資料開始。策略訊號、回測績效、風險指標和 AI agent 的分析結果，都依賴歷史資料是否乾淨、完整且可重複取得。
        </p>
        <p className="text-base leading-8 text-slate-700">如果歷史資料 API 不穩定，後續會出現幾種常見問題：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>同一檔股票不同時間查詢結果不一致</li>
          <li>欄位名稱或型別在不同 endpoint 中不一致</li>
          <li>日期格式混用</li>
          <li>成交量單位不清楚</li>
          <li>沒有處理除權息</li>
          <li>下市股票消失，造成 survivorship bias</li>
          <li>停牌、無成交或缺值沒有標示</li>
          <li>沒有交易日曆，導致回測日期對齊錯誤</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果你剛開始了解台股 API 的資料類型，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你已經要用 Python 抓資料，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
            Python 抓台股資料教學
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你想把歷史資料進一步接到策略回測與風險控管，可以再看
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把 OHLCV 進一步轉成均線、RSI、MACD 或布林通道等指標，可再看
          {" "}
          <Link href="/blog/taiwan-stock-technical-indicators-api" className="text-slate-900 underline underline-offset-4">
            台股技術分析 API
          </Link>
          。
        </p>
      </section>

      <section id="ohlcv-basics" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">OHLCV 是什麼？</h2>
        <p className="text-base leading-8 text-slate-700">OHLCV 是歷史股價最基本的資料格式，代表：</p>
        <ArticleTable
          headers={["欄位", "英文", "說明"]}
          rows={[
            ["O", "open", "開盤價"],
            ["H", "high", "最高價"],
            ["L", "low", "最低價"],
            ["C", "close", "收盤價"],
            ["V", "volume", "成交量"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">對大多數回測、技術分析和因子研究來說，OHLCV 是最低限度資料。但台股 API 只提供 OHLCV 還不夠，還需要至少補上：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>symbol</li>
          <li>market</li>
          <li>date</li>
          <li>turnover</li>
          <li>currency</li>
          <li>adjusted flag</li>
          <li>data source</li>
          <li>timezone</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">基本 OHLCV schema</h3>
          <CodeBlock code={historicalBasicOhlcvSchemaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            這個 schema 看起來簡單，但最重要的是一致性。不同 endpoint 不應該混用 `stock_id`、`symbol`、`ticker`；成交量也不應該有時是股數、有時是張數，卻沒有清楚說明。
          </p>
        </div>
      </section>

      <section id="kline-interval" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">日 K、週 K、月 K 怎麼設計？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股歷史股價 API 常見查詢粒度包括日 K、週 K 和月 K。這些資料可以由 API 直接提供，也可以由 client 端根據日 K 聚合。
        </p>
        <ArticleTable
          headers={["K 線類型", "適合情境", "開發注意事項"]}
          rows={[
            ["日 K", "回測、每日策略、因子研究", "最常用，應優先保證資料完整與穩定"],
            ["週 K", "中期趨勢、週期性報表", "需要明確定義一週起訖與遇到假日的處理方式"],
            ["月 K", "長期分析、資產配置、低頻策略", "需要明確定義月末交易日與聚合規則"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">如果由 API 直接提供週 K 或月 K，應清楚說明聚合規則。通常：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>open 取期間第一個交易日開盤價</li>
          <li>high 取期間最高價</li>
          <li>low 取期間最低價</li>
          <li>close 取期間最後一個交易日收盤價</li>
          <li>volume 取期間成交量加總</li>
          <li>turnover 取期間成交金額加總</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">K 線查詢 endpoint 示意</h3>
          <CodeBlock code={historicalIntervalQueryCode} language="text" />
          <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
        </div>
      </section>

      <section id="adjustments" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">除權息與調整後收盤價</h2>
        <p className="text-base leading-8 text-slate-700">
          台股長期回測不能忽略除權息。當公司配發現金股利、股票股利、減資或發生其他 corporate actions 時，未調整價格和調整後價格會產生差異。
        </p>
        <p className="text-base leading-8 text-slate-700">如果使用未調整價格做長期策略研究，可能會把除權息造成的價格變化誤判成市場價格下跌，進而影響：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>報酬率計算</li>
          <li>技術指標</li>
          <li>動能策略</li>
          <li>最大回撤</li>
          <li>長期績效</li>
          <li>AI agent 對價格走勢的解讀</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">未調整價格與調整後價格</h3>
          <ArticleTable
            headers={["價格類型", "說明", "適合用途"]}
            rows={[
              ["unadjusted price", "原始交易價格，不針對除權息或 corporate actions 調整", "還原實際市場成交價格、短期行情展示"],
              ["adjusted price", "根據 corporate actions 調整後的價格序列", "長期績效、報酬率、回測、技術指標"],
              ["adjusted close", "通常指調整後收盤價", "報酬率計算、策略研究、長期圖表"],
            ]}
          />
          <p className="text-base leading-8 text-slate-700">一個好的台股歷史股價 API 不一定要強迫所有使用者只用 adjusted price，但應該清楚提供參數讓使用者選擇。</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">調整參數設計示意</h3>
          <CodeBlock code={historicalAdjustedQueryCode} language="text" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Response meta 應標示 adjusted 狀態</h3>
          <CodeBlock code={historicalAdjustedMetaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">重點不是欄位名稱一定要叫 `adjusted`，而是 API 必須明確告訴使用者現在拿到的是原始價格還是調整後價格。</p>
        </div>
      </section>

      <section id="schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">歷史資料 API response schema</h2>
        <p className="text-base leading-8 text-slate-700">歷史資料 API 的 response schema 應該同時支援人類閱讀和程式消費。建議至少包含 `data` 和 `meta` 兩層。</p>
        <CodeBlock code={historicalResponseSchemaCode} language="json" />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">欄位表</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["date", "string", "交易日期，建議使用 ISO 8601"],
              ["symbol", "string", "股票代號，例如 2330"],
              ["market", "string", "市場別，例如 twse、tpex"],
              ["open", "number", "開盤價"],
              ["high", "number", "最高價"],
              ["low", "number", "最低價"],
              ["close", "number", "收盤價"],
              ["volume", "number", "成交量，需清楚定義單位"],
              ["turnover", "number", "成交金額"],
              ["currency", "string", "幣別，例如 TWD"],
              ["interval", "string", "K 線粒度，例如 1d、1w、1mo"],
              ["adjusted", "boolean", "是否為調整後價格"],
            ]}
          />
          <p className="text-base leading-8 text-slate-700">
            對 developer 來說，`meta` 很重要。它可以讓 backtester 或 data pipeline 知道這批資料的查詢條件、時間區間、價格調整狀態與資料時區。
          </p>
        </div>
      </section>

      <section id="biases" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">回測資料常見偏誤</h2>
        <p className="text-base leading-8 text-slate-700">
          歷史股價資料最危險的地方，是它看起來很完整，但實際上可能已經帶有偏誤。這些偏誤會讓回測結果看起來比真實情況更好。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Survivorship bias</h3>
          <p className="text-base leading-8 text-slate-700">如果資料庫只保留目前還存在的股票，而移除下市、下櫃或停止交易的公司，回測結果就會偏向成功存活的公司。這會高估策略績效。</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Look-ahead bias</h3>
          <p className="text-base leading-8 text-slate-700">如果策略在回測中使用了當時尚未公開的資料，例如未來財報、未來指數成分股或尚未公告的 corporate actions，就會產生 look-ahead bias。</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Corporate actions</h3>
          <p className="text-base leading-8 text-slate-700">除權息、減資、股票分割與其他 corporate actions 會影響價格序列。若未正確處理，技術指標和報酬率計算都會失真。</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Trading calendar mismatch</h3>
          <p className="text-base leading-8 text-slate-700">如果沒有使用正確交易日曆，可能會把非交易日誤當成缺值，或讓多檔股票在不同日期對齊錯誤。</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Missing data</h3>
          <p className="text-base leading-8 text-slate-700">缺值不一定代表資料錯誤，也可能代表停牌、無成交、資料尚未更新或該商品在那天不存在。API 應該讓使用者能區分這些狀況。</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Bias checklist</h3>
          <ArticleTable
            headers={["偏誤", "風險", "API 應提供的協助"]}
            rows={[
              ["survivorship bias", "回測只看到存活股票", "保留 inactive / delisted symbols"],
              ["look-ahead bias", "使用未來資料", "提供公告日、有效日與資料版本"],
              ["corporate actions", "報酬率與技術指標失真", "提供 adjusted price 或 corporate action endpoint"],
              ["calendar mismatch", "多商品日期對齊錯誤", "提供交易日曆 endpoint"],
              ["missing data", "錯把停牌或無成交當成資料錯誤", "標示缺值原因或提供交易狀態"],
            ]}
          />
        </div>
      </section>

      <section id="range-query" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何查詢一段時間的歷史資料？</h2>
        <p className="text-base leading-8 text-slate-700">台股歷史股價 API 應該支援清楚的時間區間查詢。最常見的方式是使用 `from` 和 `to` 參數。</p>
        <CodeBlock code={historicalRangeQueryCode} language="text" />
        <p className="text-base leading-8 text-slate-700">對大量資料來說，還需要考慮 pagination、batch query 和 rate limit。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">批次查詢設計示意</h3>
          <CodeBlock code={historicalBatchQueryCode} language="json" />
          <p className="text-base leading-8 text-slate-700">批次查詢對 quant workflow 很重要，因為策略通常需要一次處理一整個股票 universe，而不是只查一檔股票。</p>
          <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
        </div>
      </section>

      <section id="python-integration" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何把歷史股價 API 接到 Python？</h2>
        <p className="text-base leading-8 text-slate-700">以下示範如何用 Python 抓取一檔股票的歷史 OHLCV，並轉成 pandas DataFrame。</p>
        <CodeBlock code={historicalPythonFetchCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">檢查價格是否為調整後資料</h3>
          <CodeBlock code={historicalAdjustedCheckCode} language="python" />
        </div>
      </section>

      <section id="backtest-integration" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何把歷史資料接進回測系統？</h2>
        <p className="text-base leading-8 text-slate-700">歷史股價 API 回傳的 DataFrame 可以直接接進 backtester。最低限度需要 date、symbol、close 和 volume。</p>
        <CodeBlock code={historicalBacktestCode} language="python" />
        <p className="text-base leading-8 text-slate-700">這只是資料處理示意，不是投資策略建議。正式回測還需要：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>交易成本</li>
          <li>滑價</li>
          <li>position sizing</li>
          <li>風險限制</li>
          <li>停損或部位調整規則</li>
          <li>out-of-sample test</li>
          <li>walk-forward validation</li>
          <li>portfolio-level analysis</li>
        </ul>
      </section>

      <section id="ai-agent" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 如何使用歷史股價資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 不應該靠模型內部知識猜測股價，也不應該直接把未驗證的自然語言當成市場資料。正確做法是讓 agent 透過 tool calling 查詢台股歷史資料。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent tool schema 示意</h3>
          <CodeBlock code={historicalAgentToolCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent response schema 示意</h3>
          <CodeBlock code={historicalAgentResponseCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            這種 schema 能讓 AI agent 清楚知道自己用了哪些資料、資料是否調整過，以及哪些風險還需要檢查。對 production workflow 來說，這比單純產生一段自然語言分析更可靠。
          </p>
        </div>
      </section>

      <section id="endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是歷史股價相關 endpoint 的設計示意。</p>
        <CodeBlock code={historicalEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是查詢參數清楚、response schema 穩定、價格調整狀態明確，並且能支援回測和資料管線。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const quantUniverseSchemaCode = `{
  "universe": "large_cap_twse",
  "as_of": "2026-04-24",
  "symbols": [
    {
      "symbol": "2330",
      "name": "台積電",
      "market": "twse",
      "industry": "半導體",
      "is_active": true
    }
  ],
  "filters": {
    "market": "twse",
    "min_average_turnover": 50000000,
    "exclude_suspended": true
  }
}`;

const quantSignalSchemaCode = `{
  "date": "2026-04-24",
  "symbol": "2330",
  "signal_type": "momentum",
  "score": 0.73,
  "rank": 12,
  "universe": "large_cap_twse",
  "data_used": [
    "daily_ohlcv",
    "adjusted_close"
  ]
}`;

const quantCostModelCode = `{
  "commission_rate": 0.001425,
  "transaction_tax_rate": 0.003,
  "slippage_bps": 10,
  "max_participation_rate": 0.05
}`;

const quantRiskRuleCode = `{
  "max_position_weight": 0.1,
  "max_sector_weight": 0.35,
  "max_daily_turnover": 0.2,
  "max_drawdown": 0.25,
  "min_average_turnover": 50000000,
  "rebalance_frequency": "monthly"
}`;

const quantPythonWorkflowCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "from": "2025-01-01",
    "to": "2025-12-31",
    "interval": "1d",
    "adjusted": "true"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/ohlcv",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

payload = response.json()
df = pd.DataFrame(payload["data"])

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

df["return"] = df["close"].pct_change()
df["ma20"] = df["close"].rolling(20).mean()
df["ma60"] = df["close"].rolling(60).mean()

df["signal"] = (df["ma20"] > df["ma60"]).astype(int)
df["strategy_return"] = df["signal"].shift(1) * df["return"]

df["equity_curve"] = (1 + df["strategy_return"].fillna(0)).cumprod()

print(df[["date", "close", "signal", "strategy_return", "equity_curve"]].tail())`;

const quantAgentResponseSchemaCode = `{
  "strategy_name": "ma_cross_example",
  "data_used": [
    "historical_ohlcv",
    "trading_calendar"
  ],
  "price_adjusted": true,
  "backtest_summary": {
    "annual_return": 0.08,
    "max_drawdown": 0.18,
    "turnover": 0.32
  },
  "risk_flags": [
    "single_asset_example",
    "transaction_cost_not_fully_modeled",
    "requires_out_of_sample_test"
  ],
  "not_investment_advice": true
}`;

const quantEndpointDesignCode = `GET /v1/tw/stocks/search
GET /v1/tw/stocks/{symbol}/profile
GET /v1/tw/stocks/{symbol}/ohlcv
GET /v1/tw/stocks/{symbol}/financials
GET /v1/tw/stocks/{symbol}/monthly-revenue
GET /v1/tw/stocks/{symbol}/institutional-flows
GET /v1/tw/stocks/{symbol}/corporate-actions
GET /v1/tw/calendar/trading-days
GET /v1/tw/etfs/{symbol}/constituents`;

function TaiwanQuantTradingGuideContent() {
  return (
    <>
      <section id="what-is-quant-trading" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">什麼是台股量化交易？</h2>
        <p className="text-base leading-8 text-slate-700">
          量化交易是把投資研究流程轉成可重複執行的資料與規則系統。它不代表一定是高頻交易，也不代表一定需要複雜模型。很多量化研究其實是中低頻策略，例如每日或每週更新一次資料，根據價格、成交量、財報、籌碼或產業資料產生 signal。
        </p>
        <p className="text-base leading-8 text-slate-700">台股量化交易常見任務包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>量化選股</li>
          <li>動能策略</li>
          <li>均值回歸</li>
          <li>基本面因子</li>
          <li>法人籌碼因子</li>
          <li>產業輪動</li>
          <li>ETF 成分股研究</li>
          <li>風險控管</li>
          <li>投資組合再平衡</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">量化交易的核心不是預測一定會漲，而是建立一套可以被資料驗證、可以回測、可以監控風險的研究流程。</p>
        <p className="text-base leading-8 text-slate-700">
          如果你還不熟悉台股 API 的資料類型，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="required-data" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股量化交易需要哪些資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股量化交易需要的資料取決於策略類型。價格型策略可能只需要 OHLCV 和交易日曆；基本面策略會需要財報、月營收與公告日；籌碼策略會需要外資、投信、自營商買賣超。
        </p>
        <ArticleTable
          headers={["資料類型", "常見欄位", "用途", "注意事項"]}
          rows={[
            ["股票基本資料", "symbol, name, market, industry, is_active", "建立股票 universe", "上市、上櫃、ETF、下市狀態要清楚區分"],
            ["歷史股價", "date, open, high, low, close, volume", "技術分析、回測、報酬率計算", "需要處理除權息、停牌、下市與交易日曆"],
            ["交易日曆", "date, is_trading_day, session", "排程、回測日期對齊", "國定假日、補班日、特殊休市都要處理"],
            ["財報與基本面", "revenue, eps, roe, gross_margin, cash_flow", "基本面因子、估值模型", "報表期、公告日與資料可得時間不能混淆"],
            ["法人籌碼", "foreign_net_buy, investment_trust_net_buy, dealer_net_buy", "籌碼因子、資金流向分析", "單位、方向、與成交量對齊要清楚"],
            ["ETF 與指數", "constituents, weights, nav, premium_discount", "universe selection、產業輪動、ETF 分析", "成分股與權重更新頻率要明確"],
            ["Corporate actions", "ex_date, dividend, split_ratio, adjustment_factor", "調整價格、長期回測", "adjusted price 與 unadjusted price 要明確標示"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          如果你要先理解歷史股價、K 線與 adjusted price，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把月營收、EPS、ROE 與現金流整合成基本面因子，可以接著看
          {" "}
          <Link href="/blog/taiwan-stock-financial-statements-api" className="text-slate-900 underline underline-offset-4">
            台股財報 API 教學
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把外資、投信與自營商買賣超納入台股特色因子，可以接著看
          {" "}
          <Link href="/blog/taiwan-institutional-investors-api" className="text-slate-900 underline underline-offset-4">
            三大法人買賣超 API
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把 ETF holdings、指數成分股與產業分類納入 universe construction，可接著看
          {" "}
          <Link href="/blog/taiwan-etf-index-constituents-api" className="text-slate-900 underline underline-offset-4">
            台股 ETF 與指數成分股 API
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你想把基本面、技術面、籌碼與 universe 全部串成 multi-agent 研究架構，可接著看
          {" "}
          <Link href="/blog/ai-hedge-fund-taiwan-stocks" className="text-slate-900 underline underline-offset-4">
            AI Hedge Fund 台股版
          </Link>
          。
        </p>
      </section>

      <section id="universe-selection" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">從 universe selection 開始</h2>
        <p className="text-base leading-8 text-slate-700">
          量化研究的第一步通常不是選策略，而是定義股票 universe。Universe 是策略允許交易或研究的股票集合。
        </p>
        <p className="text-base leading-8 text-slate-700">常見 universe 包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>全部上市股票</li>
          <li>全部上櫃股票</li>
          <li>特定產業股票</li>
          <li>大型股</li>
          <li>ETF 成分股</li>
          <li>流動性足夠的股票</li>
          <li>排除下市、停牌或成交量過低的股票</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Universe schema 示意</h3>
          <CodeBlock code={quantUniverseSchemaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            Universe 必須有明確的 `as_of` 日期。否則容易在回測中不小心使用未來才加入的成分股，造成 look-ahead bias。
          </p>
        </div>
      </section>

      <section id="signal-generation" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">策略訊號怎麼產生？</h2>
        <p className="text-base leading-8 text-slate-700">策略 signal 是把資料轉成可執行判斷的規則。Signal 不一定是買或賣，也可以是分數、排名、風險標籤或 portfolio weight。</p>
        <ArticleTable
          headers={["Signal 類型", "使用資料", "範例", "注意事項"]}
          rows={[
            ["動能", "歷史股價、報酬率", "近 60 日報酬率排名", "需要處理除權息與極端值"],
            ["均值回歸", "價格、波動率", "價格偏離均線後回歸", "需要控制風險與停損規則"],
            ["基本面", "財報、月營收、EPS、ROE", "營收成長率與 ROE 排名", "必須使用公告日，避免 look-ahead bias"],
            ["籌碼", "外資、投信、自營商買賣超", "投信連續買超天數", "需要和成交量、價格一起解讀"],
            ["流動性", "成交量、成交金額", "排除成交金額過低股票", "低流動性股票回測容易失真"],
          ]}
        />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Signal response schema 示意</h3>
          <CodeBlock code={quantSignalSchemaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">Signal 最好是結構化資料，而不是只輸出一句自然語言。這樣才能接進 portfolio construction、risk manager 或 dashboard。</p>
        </div>
      </section>

      <section id="backtest-system" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">回測系統需要處理什麼？</h2>
        <p className="text-base leading-8 text-slate-700">
          回測是用歷史資料模擬策略規則的過程。好的回測不是只計算一條資金曲線，而是要清楚記錄每一次 signal、持倉、交易、成本、現金與風險曝險。
        </p>
        <p className="text-base leading-8 text-slate-700">回測系統通常需要處理：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>資料載入</li>
          <li>日期對齊</li>
          <li>signal 生成</li>
          <li>持倉計算</li>
          <li>交易執行邏輯</li>
          <li>交易成本</li>
          <li>滑價</li>
          <li>現金管理</li>
          <li>風險限制</li>
          <li>績效統計</li>
          <li>交易紀錄與 audit log</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">回測資料表設計示意</h3>
          <ArticleTable
            headers={["表格", "用途", "常見欄位"]}
            rows={[
              ["prices", "歷史價格", "date, symbol, open, high, low, close, volume"],
              ["signals", "策略訊號", "date, symbol, signal, score, rank"],
              ["positions", "每日持倉", "date, symbol, quantity, market_value, weight"],
              ["orders", "交易指令", "date, symbol, side, quantity, reason"],
              ["fills", "成交紀錄", "date, symbol, side, quantity, price, fee"],
              ["portfolio", "投資組合狀態", "date, equity, cash, exposure, drawdown"],
            ]}
          />
        </div>
      </section>

      <section id="trading-costs" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">交易成本、滑價與流動性</h2>
        <p className="text-base leading-8 text-slate-700">很多回測結果失真的原因，是忽略交易成本與滑價。尤其在台股中小型股或低成交量股票上，理論價格和實際可成交價格可能有明顯差距。</p>
        <p className="text-base leading-8 text-slate-700">回測至少應該考慮：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>手續費</li>
          <li>交易稅</li>
          <li>買賣價差</li>
          <li>滑價</li>
          <li>成交量限制</li>
          <li>單日可交易比例</li>
          <li>是否允許零股或整股限制</li>
          <li>是否能在指定價格成交</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">交易成本模型示意</h3>
          <CodeBlock code={quantCostModelCode} language="json" />
          <p className="text-base leading-8 text-slate-700">上方只是資料結構示意，不代表實際費率設定。正式系統應依交易商品、券商、交易方式與策略需求設定成本模型。</p>
        </div>
      </section>

      <section id="risk-position-sizing" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">風險控管與 position sizing</h2>
        <p className="text-base leading-8 text-slate-700">
          策略 signal 只回答想買什麼或分數是多少，但 portfolio 還需要回答買多少。這就是 position sizing 和風險控管的工作。
        </p>
        <p className="text-base leading-8 text-slate-700">常見風控條件包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>單一股票最大權重</li>
          <li>單一產業最大曝險</li>
          <li>單日最大換手率</li>
          <li>最大回撤限制</li>
          <li>波動率目標</li>
          <li>流動性限制</li>
          <li>停損或再平衡規則</li>
          <li>現金比例</li>
          <li>投資組合集中度</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Risk rule schema 示意</h3>
          <CodeBlock code={quantRiskRuleCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            風控應該是策略流程的一部分，而不是回測結束後才補上的說明。否則策略可能在歷史資料上看起來有效，但實際上無法承受波動、集中風險或流動性限制。
          </p>
        </div>
      </section>

      <section id="backtest-biases" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見回測偏誤</h2>
        <p className="text-base leading-8 text-slate-700">台股量化交易最常見的錯誤，不一定是模型錯，而是資料和回測設計有偏誤。</p>
        <ArticleTable
          headers={["偏誤", "問題", "避免方式"]}
          rows={[
            ["Survivorship bias", "只回測目前仍存在的股票", "保留下市、下櫃與 inactive symbols"],
            ["Look-ahead bias", "使用當時尚未公開的資料", "使用公告日、有效日與資料版本"],
            ["Corporate actions bias", "未處理除權息造成報酬率失真", "使用 adjusted price 或 corporate actions endpoint"],
            ["Data snooping", "反覆調參直到歷史績效好看", "使用 out-of-sample test 與 walk-forward validation"],
            ["Liquidity bias", "假設低成交量股票也能大量成交", "加入成交量限制與滑價模型"],
            ["Calendar mismatch", "多檔股票日期對齊錯誤", "使用正確台股交易日曆"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          歷史股價資料與 adjusted price 的細節可以參考
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
      </section>

      <section id="python-workflow" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Python 台股量化 workflow 範例</h2>
        <p className="text-base leading-8 text-slate-700">以下是一個簡化版 Python workflow，示範如何從 API 取得歷史資料、計算 signal，並建立簡單回測欄位。</p>
        <CodeBlock code={quantPythonWorkflowCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">
          上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。這只是資料處理範例，不構成投資建議，也不是完整交易策略。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要看更基礎的 Python API 串接方式，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
            Python 抓台股資料教學
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把交易成本、滑價、停損與績效指標納入同一套流程，可以接著看
          {" "}
          <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
            Python 台股回測系統實作
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把 OHLCV 轉成可重現的技術指標資料層，可以接著看
          {" "}
          <Link href="/blog/taiwan-stock-technical-indicators-api" className="text-slate-900 underline underline-offset-4">
            台股技術分析 API
          </Link>
          。
        </p>
      </section>

      <section id="ai-agent-role" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 在量化研究裡的角色</h2>
        <p className="text-base leading-8 text-slate-700">AI agent 可以協助整理資料、產生研究摘要、比較策略結果或檢查風險，但不應該取代資料驗證、回測和風控。</p>
        <p className="text-base leading-8 text-slate-700">在台股量化 workflow 中，AI agent 比較適合做：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>讀取 API schema</li>
          <li>查詢特定股票資料</li>
          <li>摘要回測結果</li>
          <li>檢查策略是否使用未來資料</li>
          <li>產生風險檢查清單</li>
          <li>比較不同因子的表現</li>
          <li>產生 dashboard 說明文字</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">不適合直接做：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>未經驗證直接下單</li>
          <li>用語言模型內部記憶猜股價</li>
          <li>產生無資料來源的買賣建議</li>
          <li>忽略交易成本與風險限制</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">AI agent 量化研究 response schema 示意</h3>
          <CodeBlock code={quantAgentResponseSchemaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            這種結構化輸出可以接到 dashboard、risk manager 或下一個 agent。對 production workflow 來說，結構化結果比一段自然語言更容易檢查與監控。
          </p>
        </div>
      </section>

      <section id="production-pipeline" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">從 notebook 到 production pipeline</h2>
        <p className="text-base leading-8 text-slate-700">很多量化研究會從 Jupyter notebook 開始，但 production workflow 需要更明確的資料管線。</p>
        <p className="text-base leading-8 text-slate-700">一個較完整的台股量化資料 pipeline 可以長這樣：</p>
        <ol className="space-y-2 text-base leading-8 text-slate-700">
          <li>1. 每日收盤後更新 OHLCV</li>
          <li>2. 更新交易日曆與 corporate actions</li>
          <li>3. 更新財報、月營收或籌碼資料</li>
          <li>4. 執行資料品質檢查</li>
          <li>5. 產生策略 signal</li>
          <li>6. 建立投資組合與風險檢查</li>
          <li>7. 輸出 dashboard、報表或 agent summary</li>
          <li>8. 保留 audit log</li>
        </ol>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Data pipeline checklist</h3>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>是否有固定資料更新時間？</li>
            <li>是否有 API error retry？</li>
            <li>是否有 cache？</li>
            <li>是否檢查缺值與異常值？</li>
            <li>是否保留原始資料與清洗後資料？</li>
            <li>是否記錄 signal 產生時間？</li>
            <li>是否區分研究資料與 production 資料？</li>
            <li>是否能重跑某一天的結果？</li>
            <li>是否有 audit log？</li>
            <li>是否有風險檢查與人工審核流程？</li>
          </ul>
          <p className="text-base leading-8 text-slate-700">台股量化交易的長期價值不在於某一次回測結果，而在於整個研究流程是否可以穩定重複。</p>
        </div>
      </section>

      <section id="endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是支援台股量化 workflow 的 endpoint 設計示意。</p>
        <CodeBlock code={quantEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是資料模型要穩定，查詢參數要清楚，並且能支援研究、回測、dashboard 與 AI agent workflow。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const backtestingFetchOhlcvCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "from": "2025-01-01",
    "to": "2025-12-31",
    "interval": "1d",
    "adjusted": "true"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/ohlcv",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

payload = response.json()
df = pd.DataFrame(payload["data"])

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

print(df.head())`;

const backtestingSignalCode = `df["return"] = df["close"].pct_change()

df["ma20"] = df["close"].rolling(20).mean()
df["ma60"] = df["close"].rolling(60).mean()

df["signal"] = 0
df.loc[df["ma20"] > df["ma60"], "signal"] = 1

print(df[["date", "close", "ma20", "ma60", "signal"]].tail())`;

const backtestingPositionCode = `df["position"] = df["signal"].shift(1).fillna(0)

df["gross_strategy_return"] = df["position"] * df["return"]

print(df[["date", "signal", "position", "return", "gross_strategy_return"]].tail())`;

const backtestingCostSchemaCode = `cost_model = {
    "commission_rate": 0.001425,
    "transaction_tax_rate": 0.003,
    "min_commission": 20
}`;

const backtestingCostCode = `df["position_change"] = df["position"].diff().abs().fillna(df["position"].abs())
df["turnover"] = df["position_change"]

commission_rate = 0.001425
transaction_tax_rate = 0.003

df["commission_cost"] = df["turnover"] * commission_rate
df["tax_cost"] = (df["position"].diff() < 0).astype(float) * df["turnover"] * transaction_tax_rate

df["total_cost"] = df["commission_cost"] + df["tax_cost"]

df["net_strategy_return"] = df["gross_strategy_return"] - df["total_cost"]

print(df[["date", "position", "turnover", "gross_strategy_return", "total_cost", "net_strategy_return"]].tail())`;

const backtestingSlippageCode = `slippage_bps = 10
slippage_rate = slippage_bps / 10_000

df["slippage_cost"] = df["turnover"] * slippage_rate
df["net_strategy_return"] = df["gross_strategy_return"] - df["total_cost"] - df["slippage_cost"]`;

const backtestingLiquidityCode = `min_volume = 1_000_000

df["is_liquid"] = df["volume"] >= min_volume
df.loc[~df["is_liquid"], "position"] = 0`;

const backtestingStopLossCode = `df["equity_before_stop"] = (1 + df["net_strategy_return"].fillna(0)).cumprod()
df["running_max"] = df["equity_before_stop"].cummax()
df["drawdown"] = df["equity_before_stop"] / df["running_max"] - 1

stop_loss_threshold = -0.1

df["risk_off"] = df["drawdown"] <= stop_loss_threshold
df.loc[df["risk_off"], "position"] = 0`;

const backtestingEquityCurveCode = `df["equity_curve"] = (1 + df["net_strategy_return"].fillna(0)).cumprod()

print(df[["date", "net_strategy_return", "equity_curve"]].tail())`;

const backtestingMetricsCode = `import numpy as np

def calculate_metrics(returns: pd.Series, periods_per_year: int = 252) -> dict:
    returns = returns.dropna()

    if returns.empty:
        return {
            "total_return": 0,
            "annualized_return": 0,
            "annualized_volatility": 0,
            "sharpe_ratio": None,
            "max_drawdown": 0
        }

    equity = (1 + returns).cumprod()

    total_return = equity.iloc[-1] - 1
    annualized_return = equity.iloc[-1] ** (periods_per_year / len(returns)) - 1
    annualized_volatility = returns.std() * np.sqrt(periods_per_year)

    sharpe_ratio = None
    if annualized_volatility != 0:
        sharpe_ratio = annualized_return / annualized_volatility

    running_max = equity.cummax()
    drawdown = equity / running_max - 1
    max_drawdown = drawdown.min()

    return {
        "total_return": total_return,
        "annualized_return": annualized_return,
        "annualized_volatility": annualized_volatility,
        "sharpe_ratio": sharpe_ratio,
        "max_drawdown": max_drawdown
    }

metrics = calculate_metrics(df["net_strategy_return"])
print(metrics)`;

const backtestingTradeLogCode = `trades = df.loc[df["position_change"] > 0, [
    "date",
    "symbol",
    "close",
    "position_change",
    "commission_cost",
    "tax_cost",
    "slippage_cost"
]].copy()

trades["reason"] = "position_changed"

print(trades.tail())`;

const backtestingFullExampleCode = `import os
import numpy as np
import pandas as pd
import requests

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

def fetch_ohlcv(symbol: str, start: str, end: str) -> pd.DataFrame:
    response = requests.get(
        f"{BASE_URL}/v1/tw/stocks/{symbol}/ohlcv",
        headers=headers,
        params={
            "from": start,
            "to": end,
            "interval": "1d",
            "adjusted": "true"
        },
        timeout=20
    )
    response.raise_for_status()

    payload = response.json()
    frame = pd.DataFrame(payload["data"])

    frame["date"] = pd.to_datetime(frame["date"])
    frame = frame.sort_values("date").reset_index(drop=True)
    return frame

def calculate_metrics(returns: pd.Series, periods_per_year: int = 252) -> dict:
    returns = returns.dropna()

    if returns.empty:
        return {}

    equity = (1 + returns).cumprod()
    running_max = equity.cummax()
    drawdown = equity / running_max - 1

    total_return = equity.iloc[-1] - 1
    annualized_return = equity.iloc[-1] ** (periods_per_year / len(returns)) - 1
    annualized_volatility = returns.std() * np.sqrt(periods_per_year)

    sharpe_ratio = None
    if annualized_volatility != 0:
        sharpe_ratio = annualized_return / annualized_volatility

    return {
        "total_return": total_return,
        "annualized_return": annualized_return,
        "annualized_volatility": annualized_volatility,
        "sharpe_ratio": sharpe_ratio,
        "max_drawdown": drawdown.min(),
        "average_turnover": None
    }

df = fetch_ohlcv("2330", "2025-01-01", "2025-12-31")

df["return"] = df["close"].pct_change()
df["ma20"] = df["close"].rolling(20).mean()
df["ma60"] = df["close"].rolling(60).mean()

df["signal"] = (df["ma20"] > df["ma60"]).astype(int)
df["position"] = df["signal"].shift(1).fillna(0)

df["gross_strategy_return"] = df["position"] * df["return"]

df["position_change"] = df["position"].diff().abs().fillna(df["position"].abs())
df["turnover"] = df["position_change"]

commission_rate = 0.001425
transaction_tax_rate = 0.003
slippage_bps = 10
slippage_rate = slippage_bps / 10_000

df["commission_cost"] = df["turnover"] * commission_rate
df["tax_cost"] = (df["position"].diff() < 0).astype(float) * df["turnover"] * transaction_tax_rate
df["slippage_cost"] = df["turnover"] * slippage_rate

df["total_cost"] = df["commission_cost"] + df["tax_cost"] + df["slippage_cost"]
df["net_strategy_return"] = df["gross_strategy_return"] - df["total_cost"]

df["equity_curve"] = (1 + df["net_strategy_return"].fillna(0)).cumprod()

metrics = calculate_metrics(df["net_strategy_return"])
metrics["average_turnover"] = df["turnover"].mean()

print(df[["date", "close", "position", "net_strategy_return", "equity_curve"]].tail())
print(metrics)`;

const backtestingAiSummaryCode = `{
  "strategy_name": "ma_cross_example",
  "symbol": "2330",
  "period": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  },
  "data_used": [
    "adjusted_ohlcv"
  ],
  "metrics": {
    "total_return": 0.12,
    "annualized_return": 0.11,
    "max_drawdown": -0.08,
    "sharpe_ratio": 0.9,
    "average_turnover": 0.04
  },
  "risk_flags": [
    "single_stock_backtest",
    "requires_out_of_sample_test",
    "simplified_transaction_cost_model"
  ],
  "not_investment_advice": true
}`;

const backtestingEndpointDesignCode = `GET /v1/tw/stocks/{symbol}/ohlcv?from=2025-01-01&to=2025-12-31&adjusted=true
GET /v1/tw/stocks/{symbol}/corporate-actions
GET /v1/tw/calendar/trading-days
GET /v1/tw/stocks/search
GET /v1/tw/etfs/{symbol}/constituents
GET /v1/tw/stocks/{symbol}/financials
GET /v1/tw/stocks/{symbol}/institutional-flows`;

function PythonTaiwanStockBacktestingContent() {
  return (
    <>
      <section id="backtest-modules" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股回測系統需要哪些模組？</h2>
        <p className="text-base leading-8 text-slate-700">
          一個最小可用的台股回測系統不需要一開始就很複雜，但應該有清楚的資料流。至少要包含：
        </p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>data loader</li>
          <li>signal generator</li>
          <li>position engine</li>
          <li>execution model</li>
          <li>cost model</li>
          <li>risk rules</li>
          <li>performance metrics</li>
          <li>trade log</li>
          <li>audit log</li>
        </ul>
        <ArticleTable
          headers={["模組", "功能", "常見輸入", "常見輸出"]}
          rows={[
            ["Data loader", "載入歷史資料", "symbol, from, to, interval", "OHLCV DataFrame"],
            ["Signal generator", "產生策略訊號", "price, volume, factor data", "signal, score, rank"],
            ["Position engine", "將 signal 轉成持倉", "signal, portfolio rules", "position, target weight"],
            ["Execution model", "模擬交易執行", "target position, price", "orders, fills"],
            ["Cost model", "計算交易成本", "trade value, side", "commission, tax, total cost"],
            ["Risk rules", "控制風險", "position, volatility, drawdown", "adjusted position, risk flags"],
            ["Performance metrics", "評估策略表現", "equity curve, returns", "CAGR, max drawdown, Sharpe ratio"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          如果你還在建立整體 quant research 流程，可以先看
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          。
        </p>
      </section>

      <section id="prepare-ohlcv" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">準備歷史 OHLCV 資料</h2>
        <p className="text-base leading-8 text-slate-700">
          回測的第一步是取得乾淨且可重複的歷史資料。最基本欄位包括 date、symbol、open、high、low、close、volume。若要做長期回測，還要確認價格是否為 adjusted price。
        </p>
        <CodeBlock code={backtestingFetchOhlcvCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。</p>
        <p className="text-base leading-8 text-slate-700">
          如果你還不熟悉台股 API 資料分層，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要先了解 Python 基礎串接與 DataFrame 整理，可參考
          {" "}
          <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
            Python 抓台股資料教學
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要先確認 adjusted price 與除權息資料設計，可以看
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把均線、RSI、MACD 與 ATR 納入回測訊號流程，可以接著看
          {" "}
          <Link href="/blog/taiwan-stock-technical-indicators-api" className="text-slate-900 underline underline-offset-4">
            台股技術分析 API
          </Link>
          。
        </p>
      </section>

      <section id="build-signal" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建立策略訊號</h2>
        <p className="text-base leading-8 text-slate-700">
          策略訊號是把資料轉成可執行規則。這裡用最簡單的均線範例示範資料流程：當 20 日均線大於 60 日均線時，signal 為 1；否則為 0。
        </p>
        <CodeBlock code={backtestingSignalCode} language="python" />
        <p className="text-base leading-8 text-slate-700">這只是教學用資料處理範例，不代表策略有效。正式研究時，signal 應該經過 out-of-sample test、參數穩定性測試與風險檢查。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Signal table schema</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["date", "datetime", "訊號日期"],
              ["symbol", "string", "股票代號"],
              ["signal", "number", "策略訊號，例如 0 或 1"],
              ["score", "number", "可選，策略分數或排名依據"],
              ["reason", "string", "可選，訊號原因或規則名稱"],
            ]}
          />
        </div>
      </section>

      <section id="signal-to-position" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">從 signal 轉成持倉</h2>
        <p className="text-base leading-8 text-slate-700">
          回測不能只看 signal，還要定義持倉。最簡單的方式是使用前一日 signal 決定下一日持倉，避免使用當天收盤後才知道的訊號去交易同一天。
        </p>
        <CodeBlock code={backtestingPositionCode} language="python" />
        <p className="text-base leading-8 text-slate-700">
          `shift(1)` 是回測裡很重要的小細節。若省略這一步，策略可能會使用同一天已經發生的價格變化來決定同一天持倉，造成 look-ahead bias。
        </p>
      </section>

      <section id="trading-costs" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">加入交易成本</h2>
        <p className="text-base leading-8 text-slate-700">
          不考慮交易成本的回測通常太樂觀。台股回測至少要考慮手續費、交易稅和其他可能成本。不同券商、商品與交易方式會有不同費率，正式系統應依實際情境設定。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Cost model schema</h3>
          <CodeBlock code={backtestingCostSchemaCode} language="python" />
          <p className="text-base leading-8 text-slate-700">上方只是資料結構示意，不代表實際費率設定。正式交易成本應依商品、券商與交易條件設定。</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">用 turnover 估算交易成本</h3>
          <CodeBlock code={backtestingCostCode} language="python" />
          <p className="text-base leading-8 text-slate-700">這裡使用的是簡化模型。更完整的回測會根據實際成交金額、買賣方向、最低手續費、零股或整股限制計算成本。</p>
        </div>
      </section>

      <section id="slippage-model" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">加入滑價模型</h2>
        <p className="text-base leading-8 text-slate-700">滑價是理論成交價和實際成交價之間的差距。對成交量較低的股票，滑價可能比策略本身更重要。</p>
        <p className="text-base leading-8 text-slate-700">簡化滑價可以用 basis points 表示：</p>
        <CodeBlock code={backtestingSlippageCode} language="python" />
        <p className="text-base leading-8 text-slate-700">更完整的滑價模型會考慮：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>成交量</li>
          <li>買賣價差</li>
          <li>單日參與率</li>
          <li>股票流動性</li>
          <li>市場波動</li>
          <li>訂單大小</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Liquidity rule example</h3>
          <CodeBlock code={backtestingLiquidityCode} language="python" />
          <p className="text-base leading-8 text-slate-700">流動性限制應該在 signal 轉成持倉時就納入，而不是回測結束後才用文字說明。</p>
        </div>
      </section>

      <section id="stop-loss-risk-rules" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">加入停損與風險限制</h2>
        <p className="text-base leading-8 text-slate-700">
          停損不是唯一的風控方法，但它是很多回測系統會先實作的基本風險規則。以下示範用 rolling drawdown 做簡化停損。
        </p>
        <CodeBlock code={backtestingStopLossCode} language="python" />
        <p className="text-base leading-8 text-slate-700">
          這個範例只示範概念。實務上要注意停損觸發後如何恢復交易、是否逐檔停損、是否 portfolio-level 停損，以及停損是否能用實際交易價格執行。
        </p>
      </section>

      <section id="equity-curve" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">計算資金曲線</h2>
        <p className="text-base leading-8 text-slate-700">資金曲線可以讓你觀察策略在時間上的表現。通常會分成未扣成本和扣除成本後的版本。</p>
        <CodeBlock code={backtestingEquityCurveCode} language="python" />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">資金曲線資料表</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["date", "datetime", "日期"],
              ["equity_curve", "number", "策略資金曲線"],
              ["drawdown", "number", "從歷史高點回落的幅度"],
              ["turnover", "number", "每日換手率"],
              ["cost", "number", "每日交易成本"],
            ]}
          />
        </div>
      </section>

      <section id="performance-metrics" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">計算績效指標</h2>
        <p className="text-base leading-8 text-slate-700">單看總報酬不夠。回測至少應該輸出多個績效指標，包含報酬、風險、回撤與交易頻率。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">常見績效指標</h3>
          <ArticleTable
            headers={["指標", "說明", "為什麼重要"]}
            rows={[
              ["Total return", "策略期間總報酬", "衡量整體績效，但不能單獨使用"],
              ["Annualized return", "年化報酬", "方便比較不同期間策略"],
              ["Volatility", "報酬波動率", "衡量策略風險"],
              ["Sharpe ratio", "報酬與波動的比值", "衡量風險調整後報酬"],
              ["Max drawdown", "最大回撤", "衡量最壞期間損失"],
              ["Turnover", "換手率", "影響交易成本與策略可執行性"],
              ["Win rate", "正報酬交易比例", "可輔助理解策略行為，但不能單獨判斷好壞"],
            ]}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Python performance metrics function</h3>
          <CodeBlock code={backtestingMetricsCode} language="python" />
          <p className="text-base leading-8 text-slate-700">績效指標應該搭配交易紀錄一起看。年化報酬高但最大回撤過大、換手率過高或交易次數太少，都可能表示策略不可用。</p>
        </div>
      </section>

      <section id="trade-log-audit" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">儲存交易紀錄與 audit log</h2>
        <p className="text-base leading-8 text-slate-700">
          Production workflow 不能只保留最終績效。你需要知道每一天為什麼產生 signal、為什麼交易、交易成本是多少，以及是否觸發風險限制。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Trade log schema</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["date", "datetime", "交易日期"],
              ["symbol", "string", "股票代號"],
              ["side", "string", "buy 或 sell"],
              ["quantity", "number", "交易股數或單位"],
              ["price", "number", "模擬成交價"],
              ["commission", "number", "手續費"],
              ["tax", "number", "交易稅"],
              ["slippage", "number", "滑價成本"],
              ["reason", "string", "交易原因或策略規則"],
            ]}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">產生簡化交易紀錄</h3>
          <CodeBlock code={backtestingTradeLogCode} language="python" />
          <p className="text-base leading-8 text-slate-700">
            Audit log 對 AI agent workflow 也很重要。當 agent 需要摘要策略結果時，應該讀取結構化資料，而不是猜測策略做了什麼。
          </p>
        </div>
      </section>

      <section id="full-python-example" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">完整 Python 範例</h2>
        <p className="text-base leading-8 text-slate-700">
          以下是簡化版完整範例，包含資料抓取、signal、持倉、交易成本、滑價、資金曲線和績效指標。
        </p>
        <CodeBlock code={backtestingFullExampleCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">
          上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。這是教學用回測框架，不構成投資建議，也不是完整交易系統。
        </p>
      </section>

      <section id="common-backtest-mistakes" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見回測錯誤</h2>
        <p className="text-base leading-8 text-slate-700">台股回測常見錯誤包括：</p>
        <ArticleTable
          headers={["錯誤", "問題", "改善方式"]}
          rows={[
            ["沒有 shift signal", "使用同一天已知結果交易同一天", "用前一日 signal 決定下一日持倉"],
            ["忽略交易成本", "回測績效過度樂觀", "加入手續費、交易稅與其他成本"],
            ["忽略滑價", "假設所有交易都能用理想價格成交", "根據流動性、成交量或 bps 模型估算滑價"],
            ["忽略除權息", "長期報酬率與技術指標失真", "使用 adjusted price 或 corporate actions 資料"],
            ["忽略下市股票", "survivorship bias", "保留 inactive / delisted symbols"],
            ["過度調參", "策略只適合歷史樣本", "使用 out-of-sample test 與 walk-forward validation"],
            ["只看總報酬", "忽略回撤、波動與流動性", "同時檢查 max drawdown、volatility、turnover"],
          ]}
        />
      </section>

      <section id="ai-agent-backtest" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 如何讀取回測結果？</h2>
        <p className="text-base leading-8 text-slate-700">
          如果你要把回測系統接到 AI agent，不應該只把完整 CSV 丟給 LLM。比較好的方式是先輸出結構化 summary，讓 agent 讀取績效、風險與資料限制。
        </p>
        <CodeBlock code={backtestingAiSummaryCode} language="json" />
        <p className="text-base leading-8 text-slate-700">
          這樣 AI agent 可以負責摘要、比較與檢查風險，但不會取代資料驗證、正式回測與人為審核。
        </p>
      </section>

      <section id="backtest-endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是支援台股回測 workflow 的 endpoint 設計示意。</p>
        <CodeBlock code={backtestingEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是資料 schema 穩定、日期清楚、價格調整狀態明確，並能支援 Python、database、backtester 與 AI agent workflow。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const financialIncomeStatementCode = `{
  "data": [
    {
      "symbol": "2330",
      "market": "twse",
      "period": "2025Q4",
      "announcement_date": "2026-03-15",
      "currency": "TWD",
      "unit": "thousand",
      "revenue": 625000000,
      "gross_profit": 330000000,
      "operating_income": 285000000,
      "net_income": 238000000,
      "eps": 9.21
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "statement": "income_statement",
    "version": "latest"
  }
}`;

const financialBalanceSheetCode = `{
  "data": [
    {
      "symbol": "2330",
      "period": "2025Q4",
      "announcement_date": "2026-03-15",
      "currency": "TWD",
      "unit": "thousand",
      "total_assets": 6200000000,
      "total_liabilities": 2400000000,
      "total_equity": 3800000000,
      "cash_and_equivalents": 1200000000,
      "inventory": 260000000,
      "accounts_receivable": 420000000
    }
  ],
  "meta": {
    "statement": "balance_sheet",
    "version": "latest"
  }
}`;

const financialCashFlowCode = `{
  "data": [
    {
      "symbol": "2330",
      "period": "2025Q4",
      "announcement_date": "2026-03-15",
      "currency": "TWD",
      "unit": "thousand",
      "operating_cash_flow": 310000000,
      "investing_cash_flow": -180000000,
      "financing_cash_flow": -60000000,
      "capital_expenditure": -150000000,
      "free_cash_flow": 160000000
    }
  ],
  "meta": {
    "statement": "cash_flow_statement",
    "version": "latest"
  }
}`;

const financialFactorSchemaCode = `{
  "date": "2026-04-24",
  "symbol": "2330",
  "factor_name": "revenue_growth_12m",
  "value": 0.18,
  "rank": 15,
  "universe": "twse_large_cap",
  "data_used": [
    "monthly_revenue",
    "announcement_date"
  ]
}`;

const financialPythonExampleCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "symbol": "2330",
    "from": "2024Q1",
    "to": "2025Q4"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/financials/income-statement",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

payload = response.json()
df = pd.DataFrame(payload["data"])

df["announcement_date"] = pd.to_datetime(df["announcement_date"])
df = df.sort_values("announcement_date").reset_index(drop=True)

df["gross_margin"] = df["gross_profit"] / df["revenue"]
df["net_margin"] = df["net_income"] / df["revenue"]

print(df[["period", "announcement_date", "revenue", "eps", "gross_margin", "net_margin"]])`;

const financialBacktestDateCode = `backtest_date = pd.Timestamp("2025-08-01")

available_financials = df[df["announcement_date"] <= backtest_date]

latest = available_financials.tail(1)

print(latest)`;

const financialAgentToolCode = `{
  "name": "get_financial_statements",
  "description": "Get financial statements for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "statement": "income_statement",
    "from": "2024Q1",
    "to": "2025Q4"
  }
}`;

const financialAgentResponseCode = `{
  "symbol": "2330",
  "data_used": [
    "income_statement",
    "balance_sheet",
    "cash_flow_statement"
  ],
  "latest_period": "2025Q4",
  "announcement_date": "2026-03-15",
  "summary": "Revenue and EPS increased compared with the previous year, but valuation and industry cycle require additional checks.",
  "risk_flags": [
    "requires_peer_comparison",
    "requires_updated_market_price",
    "not_a_trading_signal"
  ],
  "not_investment_advice": true
}`;

const financialEndpointDesignCode = `GET /v1/tw/stocks/{symbol}/financials/income-statement
GET /v1/tw/stocks/{symbol}/financials/balance-sheet
GET /v1/tw/stocks/{symbol}/financials/cash-flow
GET /v1/tw/stocks/{symbol}/monthly-revenue
GET /v1/tw/stocks/{symbol}/financial-ratios
GET /v1/tw/stocks/{symbol}/fundamental-factors`;

function TaiwanStockFinancialStatementsApiContent() {
  return (
    <>
      <section id="why-financial-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼台股財報 API 重要？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股資料產品如果只提供股價，通常只能支援價格型分析、技術指標和部分回測需求。若要建立更完整的 financial data API，財報與基本面資料是必要的一層。
        </p>
        <p className="text-base leading-8 text-slate-700">財報 API 可以支援：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>基本面選股</li>
          <li>量化因子研究</li>
          <li>估值模型</li>
          <li>月營收追蹤</li>
          <li>財務比率分析</li>
          <li>產業比較</li>
          <li>dashboard 報表</li>
          <li>AI agent 股票研究助理</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          股價資料回答的是市場價格如何變動。財報資料回答的是公司營運與財務狀況如何變化。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你還在理解台股資料 API 的整體架構，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="financial-data-types" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">財報資料有哪些類型？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股基本面資料通常可以拆成幾個主要類型。不同資料的更新頻率、欄位格式和適用情境都不同。
        </p>
        <ArticleTable
          headers={["資料類型", "常見欄位", "更新頻率", "適合用途"]}
          rows={[
            ["月營收", "revenue, revenue_yoy, revenue_mom", "每月", "營運動能、成長因子、短期基本面追蹤"],
            ["損益表", "revenue, gross_profit, operating_income, net_income, eps", "每季 / 每年", "獲利能力、EPS、利潤率分析"],
            ["資產負債表", "assets, liabilities, equity, inventory, receivables", "每季 / 每年", "財務結構、槓桿、資產品質"],
            ["現金流量表", "operating_cash_flow, investing_cash_flow, financing_cash_flow, free_cash_flow", "每季 / 每年", "現金流品質、自由現金流、財務健康度"],
            ["財務比率", "roe, roa, gross_margin, operating_margin, net_margin", "依財報資料計算", "基本面因子、橫向比較、排名"],
            ["公告日與資料版本", "period, announcement_date, filing_date, version", "依公告更新", "避免 look-ahead bias、建立可回測資料集"],
          ]}
        />
      </section>

      <section id="monthly-vs-quarterly-vs-annual" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">月營收、季報與年報的差異</h2>
        <p className="text-base leading-8 text-slate-700">月營收、季報和年報不應該混在同一個資料模型裡。它們代表不同的時間粒度，也適合不同的研究問題。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">月營收</h3>
          <p className="text-base leading-8 text-slate-700">月營收適合觀察公司營運動能。常見分析包括：</p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>月增率</li>
            <li>年增率</li>
            <li>近 3 個月累計營收</li>
            <li>近 12 個月營收</li>
            <li>營收成長趨勢</li>
            <li>產業內營收排名</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">季報</h3>
          <p className="text-base leading-8 text-slate-700">
            季報提供更完整的獲利、資產負債與現金流資訊。常見欄位包括 EPS、毛利率、營業利益率、ROE、存貨與現金流。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">年報</h3>
          <p className="text-base leading-8 text-slate-700">
            年報適合長期分析與公司層級研究，但更新頻率較低。若要建立中低頻策略，通常會結合月營收、季報與歷史股價資料。
          </p>
        </div>
      </section>

      <section id="income-statement-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">損益表 API schema</h2>
        <p className="text-base leading-8 text-slate-700">
          損益表用來描述公司在特定期間的收入、成本、費用與獲利能力。API schema 應該清楚標示公司、期間、公告日、幣別與單位。
        </p>
        <CodeBlock code={financialIncomeStatementCode} language="json" />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">損益表欄位表</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["symbol", "string", "股票代號"],
              ["period", "string", "財報期間，例如 2025Q4"],
              ["announcement_date", "string", "財報公告日或可取得日期"],
              ["revenue", "number", "營收"],
              ["gross_profit", "number", "毛利"],
              ["operating_income", "number", "營業利益"],
              ["net_income", "number", "稅後淨利"],
              ["eps", "number", "每股盈餘"],
              ["currency", "string", "幣別，例如 TWD"],
              ["unit", "string", "數值單位，例如 thousand"],
            ]}
          />
        </div>
      </section>

      <section id="balance-sheet-schema" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">資產負債表 API schema</h2>
        <p className="text-base leading-8 text-slate-700">
          資產負債表描述公司在某個時間點的資產、負債與股東權益。它不是期間型資料，而是時間點資料。
        </p>
        <CodeBlock code={financialBalanceSheetCode} language="json" />
        <p className="text-base leading-8 text-slate-700">
          資產負債表常用於計算槓桿、流動性、資產品質與財務結構。例如 debt-to-equity、current ratio、inventory turnover 等。
        </p>
      </section>

      <section id="cash-flow-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">現金流量表 API schema</h2>
        <p className="text-base leading-8 text-slate-700">
          現金流量表用來觀察公司現金如何流入與流出。對基本面研究來說，現金流通常比單純獲利數字更能反映財務品質。
        </p>
        <CodeBlock code={financialCashFlowCode} language="json" />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">現金流常見用途</h3>
          <p className="text-base leading-8 text-slate-700">現金流資料可以用來建立：</p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>自由現金流因子</li>
            <li>營業現金流成長率</li>
            <li>現金流對淨利比率</li>
            <li>資本支出強度</li>
            <li>現金流品質分數</li>
          </ul>
        </div>
      </section>

      <section id="key-fundamental-metrics" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">EPS、ROE 與常見基本面指標</h2>
        <p className="text-base leading-8 text-slate-700">
          財報 API 不一定只提供原始報表欄位，也可以提供由財報計算出的 ratios。但無論 ratios 是 API 預先計算，還是 client 端自行計算，都必須清楚定義公式與資料期間。
        </p>
        <ArticleTable
          headers={["指標", "說明", "常見用途", "注意事項"]}
          rows={[
            ["EPS", "每股盈餘", "獲利能力、估值", "需確認期間與股本變動"],
            ["ROE", "股東權益報酬率", "資本效率、基本面選股", "應注意權益基準與是否年化"],
            ["Gross margin", "毛利率", "產品競爭力、成本結構", "需和同產業比較"],
            ["Operating margin", "營業利益率", "營運效率", "非本業收益不應混入"],
            ["Free cash flow", "自由現金流", "現金流品質、股東回報能力", "資本支出定義要一致"],
            ["Debt-to-equity", "負債對股東權益比", "槓桿與財務風險", "不同產業基準不同"],
          ]}
        />
      </section>

      <section id="announcement-date-priority" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">公告日比報表期更重要</h2>
        <p className="text-base leading-8 text-slate-700">在回測與量化研究裡，公告日通常比報表期更重要。</p>
        <p className="text-base leading-8 text-slate-700">
          例如，一份 2025Q4 財報可能代表 2025 年第四季的營運結果，但它不會在 2025Q4 當下就被市場完整知道。如果回測系統在 2025 年底就使用這份財報資料，就會產生 look-ahead bias。
        </p>
        <p className="text-base leading-8 text-slate-700">好的財報 API 應該至少區分：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>period</li>
          <li>fiscal_year</li>
          <li>fiscal_quarter</li>
          <li>announcement_date</li>
          <li>filing_date</li>
          <li>effective_date</li>
          <li>data_version</li>
        </ul>
        <ArticleTable
          headers={["欄位", "說明", "為什麼重要"]}
          rows={[
            ["period", "財報所屬期間", "用來理解資料代表哪段營運結果"],
            ["announcement_date", "市場可得日期", "回測必須用它判斷資料何時可使用"],
            ["effective_date", "策略或資料管線開始採用的日期", "用於避免使用未來資料"],
            ["version", "財報資料版本", "若資料有重編或修正，必須可追蹤"],
          ]}
        />
      </section>

      <section id="factor-construction" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何建立基本面因子？</h2>
        <p className="text-base leading-8 text-slate-700">
          基本面因子是把財報資料轉成可排序、可回測、可比較的數值。常見因子包括成長、獲利、品質、估值與財務風險。
        </p>
        <ArticleTable
          headers={["因子類型", "使用資料", "範例", "注意事項"]}
          rows={[
            ["成長", "月營收、revenue、eps", "近 12 個月營收年增率", "注意基期與產業週期"],
            ["獲利", "gross_margin, operating_margin, net_margin", "毛利率排名", "應和同產業比較"],
            ["品質", "operating_cash_flow, free_cash_flow, net_income", "現金流對淨利比", "避免單季異常值"],
            ["資本效率", "roe, roa", "ROE 排名", "注意槓桿造成的 ROE 提升"],
            ["財務風險", "liabilities, equity, cash", "debt-to-equity", "不同產業標準不同"],
          ]}
        />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Factor schema 示意</h3>
          <CodeBlock code={financialFactorSchemaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            如果你要把基本面因子放進量化流程，可以參考
            {" "}
            <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
              台股量化交易入門
            </Link>
            。
          </p>
          <p className="text-base leading-8 text-slate-700">
            若要把因子接進回測系統，可以參考
            {" "}
            <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
              Python 台股回測系統實作
            </Link>
            。
          </p>
        </div>
      </section>

      <section id="python-financials-integration" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Python 串接財報 API 範例</h2>
        <p className="text-base leading-8 text-slate-700">以下示範如何用 Python 呼叫財報 API，取得損益表資料並計算簡單基本面指標。</p>
        <CodeBlock code={financialPythonExampleCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">避免在回測中使用未來財報</h3>
          <CodeBlock code={financialBacktestDateCode} language="python" />
          <p className="text-base leading-8 text-slate-700">這段邏輯的重點是：回測日期只能使用當時已公告的資料。這比單純使用最新財報更接近真實研究環境。</p>
        </div>
      </section>

      <section id="ai-agent-financial-workflow" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 如何使用財報資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 不應該靠模型內部知識猜 EPS、ROE 或營收。正確做法是讓 agent 透過 tool calling 查詢財報 API，再用 LLM 做摘要、比較、解釋和風險標記。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent tool schema 示意</h3>
          <CodeBlock code={financialAgentToolCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent response schema 示意</h3>
          <CodeBlock code={financialAgentResponseCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          這種格式讓 agent 的輸出更容易被 dashboard、risk manager 或下一個 workflow 使用。重點是 agent 要標示自己用了哪些資料，以及哪些資料還不足。
        </p>
      </section>

      <section id="data-quality-issues" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見資料品質問題</h2>
        <p className="text-base leading-8 text-slate-700">財報資料比 OHLCV 更容易出現 schema 和時間問題。常見問題包括：</p>
        <ArticleTable
          headers={["問題", "影響", "API 應提供的協助"]}
          rows={[
            ["報表期與公告日混淆", "回測使用未來資料", "明確提供 announcement_date"],
            ["單位不清楚", "財報數字被放大或縮小", "提供 unit 欄位"],
            ["幣別不清楚", "跨公司比較錯誤", "提供 currency 欄位"],
            ["財報重編或修正", "歷史結果難以重現", "提供 version 或 revision 欄位"],
            ["欄位名稱不一致", "ETL 和 backtest 容易出錯", "統一 schema"],
            ["缺值未標示原因", "誤判公司沒有資料", "提供 missing reason 或 metadata"],
          ]}
        />
      </section>

      <section id="endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是台股財報與基本面資料相關 endpoint 的設計示意。</p>
        <CodeBlock code={financialEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是資料期間、公告日、單位、幣別與 schema 必須清楚，才能支援量化研究、dashboard 和 AI agent workflow。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const institutionalFlowUnitEndpointCode = `GET /v1/tw/stocks/2330/institutional-flows?from=2025-01-01&to=2025-12-31&unit=shares
GET /v1/tw/stocks/2330/institutional-flows?from=2025-01-01&to=2025-12-31&unit=lots
GET /v1/tw/stocks/2330/institutional-flows?from=2025-01-01&to=2025-12-31&unit=value`;

const institutionalFlowLongFormatCode = `{
  "data": [
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "market": "twse",
      "investor_type": "foreign",
      "buy": 12500000,
      "sell": 9800000,
      "net_buy": 2700000,
      "unit": "shares",
      "currency": "TWD"
    },
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "market": "twse",
      "investor_type": "investment_trust",
      "buy": 860000,
      "sell": 420000,
      "net_buy": 440000,
      "unit": "shares",
      "currency": "TWD"
    },
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "market": "twse",
      "investor_type": "dealer",
      "buy": 520000,
      "sell": 610000,
      "net_buy": -90000,
      "unit": "shares",
      "currency": "TWD"
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "from": "2026-04-24",
    "to": "2026-04-24",
    "unit": "shares",
    "timezone": "Asia/Taipei"
  }
}`;

const institutionalFlowWideFormatCode = `{
  "data": [
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "market": "twse",
      "foreign_net_buy": 2700000,
      "investment_trust_net_buy": 440000,
      "dealer_net_buy": -90000,
      "total_institutional_net_buy": 3050000,
      "unit": "shares"
    }
  ],
  "meta": {
    "format": "wide",
    "unit": "shares"
  }
}`;

const institutionalFlowFactorSchemaCode = `{
  "date": "2026-04-24",
  "symbol": "2330",
  "factor_name": "foreign_net_buy_volume_ratio_5d",
  "value": 0.036,
  "window": 5,
  "data_used": [
    "institutional_flows",
    "daily_ohlcv"
  ],
  "unit": "ratio"
}`;

const institutionalFlowPythonCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "from": "2025-01-01",
    "to": "2025-12-31",
    "unit": "shares",
    "format": "wide"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/institutional-flows",
    headers=headers,
    params=params,
    timeout=20
)

response.raise_for_status()

payload = response.json()
flows = pd.DataFrame(payload["data"])

flows["date"] = pd.to_datetime(flows["date"])
flows = flows.sort_values("date").reset_index(drop=True)

print(flows.head())`;

const institutionalFlowFeatureCode = `flows["foreign_net_buy_5d"] = flows["foreign_net_buy"].rolling(5).sum()
flows["investment_trust_net_buy_5d"] = flows["investment_trust_net_buy"].rolling(5).sum()
flows["dealer_net_buy_5d"] = flows["dealer_net_buy"].rolling(5).sum()

flows["total_institutional_net_buy_5d"] = (
    flows["foreign_net_buy_5d"]
    + flows["investment_trust_net_buy_5d"]
    + flows["dealer_net_buy_5d"]
)

print(flows[[
    "date",
    "foreign_net_buy_5d",
    "investment_trust_net_buy_5d",
    "dealer_net_buy_5d",
    "total_institutional_net_buy_5d"
]].tail())`;

const institutionalFlowMergeCode = `ohlcv = pd.DataFrame([
    {
        "date": "2025-01-02",
        "symbol": "2330",
        "close": 1005,
        "volume": 25000000
    }
])

ohlcv["date"] = pd.to_datetime(ohlcv["date"])

data = ohlcv.merge(flows, on=["date", "symbol"], how="left")

data["foreign_net_buy_volume_ratio"] = (
    data["foreign_net_buy"] / data["volume"]
)

print(data.head())`;

const institutionalFlowAgentToolCode = `{
  "name": "get_institutional_flows",
  "description": "Get institutional investor buy/sell flows for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "unit": "shares",
    "format": "wide"
  }
}`;

const institutionalFlowAgentResponseCode = `{
  "symbol": "2330",
  "data_used": [
    "institutional_flows",
    "daily_ohlcv"
  ],
  "summary": "Foreign investors were net buyers over the selected window, while dealer flows were mixed.",
  "flow_features": {
    "foreign_net_buy_5d": 12000000,
    "investment_trust_net_buy_5d": 1800000,
    "dealer_net_buy_5d": -600000
  },
  "risk_flags": [
    "requires_volume_normalization",
    "not_a_standalone_trading_signal",
    "requires_backtesting"
  ],
  "not_investment_advice": true
}`;

const institutionalFlowEndpointDesignCode = `GET /v1/tw/stocks/{symbol}/institutional-flows
GET /v1/tw/stocks/{symbol}/institutional-flows?from=2025-01-01&to=2025-12-31
GET /v1/tw/stocks/{symbol}/institutional-flows?unit=shares
GET /v1/tw/stocks/{symbol}/institutional-flows?format=wide
GET /v1/tw/institutional-flows/rankings?investor_type=foreign&side=buy
GET /v1/tw/institutional-flows/rankings?investor_type=investment_trust&window=5d
GET /v1/tw/stocks/{symbol}/flow-factors`;

function TaiwanInstitutionalInvestorsApiContent() {
  return (
    <>
      <section id="what-are-institutional-investors" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">什麼是三大法人買賣超？</h2>
        <p className="text-base leading-8 text-slate-700">
          台股常說的三大法人，通常指外資、投信與自營商。買賣超資料描述的是特定法人類別在某個交易日對特定股票的買進、賣出與淨買賣狀況。
        </p>
        <p className="text-base leading-8 text-slate-700">常見分類包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>外資及陸資</li>
          <li>投信</li>
          <li>自營商</li>
          <li>自營商自行買賣</li>
          <li>自營商避險</li>
          <li>三大法人合計</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          不同資料來源可能會有不同細分欄位，因此 API schema 應該明確標示資料口徑，而不是只回傳一個模糊的 `institutional_net_buy`。
        </p>
      </section>

      <section id="why-institutional-flow-data-matters" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼法人籌碼資料對台股 API 重要？</h2>
        <p className="text-base leading-8 text-slate-700">
          如果台股 financial data API 只提供股價和財報，就會少掉一種台股使用者非常常見的資料層：籌碼資料。三大法人買賣超常被用來觀察資金流向、機構投資人行為與市場結構變化。
        </p>
        <p className="text-base leading-8 text-slate-700">法人籌碼資料可以支援：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>籌碼 dashboard</li>
          <li>每日法人買賣超追蹤</li>
          <li>量化因子研究</li>
          <li>外資 / 投信連續買超分析</li>
          <li>買賣超佔成交量比重</li>
          <li>sector flow analysis</li>
          <li>AI agent 股票研究摘要</li>
          <li>風險標記與異常資金流提醒</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果你還在理解台股 API 的整體資料分類，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="institutional-flow-fields" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">三大法人資料有哪些欄位？</h2>
        <p className="text-base leading-8 text-slate-700">
          一個實用的三大法人 API 不應該只回傳單一數字。至少應包含日期、股票代號、市場別、法人類別、買進、賣出、買賣超與單位。
        </p>
        <ArticleTable
          headers={["欄位", "說明", "注意事項"]}
          rows={[
            ["date", "交易日期", "建議使用 ISO 8601，例如 2026-04-24"],
            ["symbol", "股票代號", "需和其他行情 / 財報 endpoint 一致"],
            ["market", "市場別，例如 twse、tpex", "上市與上櫃資料來源與口徑要區分"],
            ["investor_type", "法人類別", "foreign、investment_trust、dealer 等值應固定"],
            ["buy", "買進數量或金額", "必須標示單位"],
            ["sell", "賣出數量或金額", "必須標示單位"],
            ["net_buy", "買賣超，通常為買進減賣出", "正值代表買超，負值代表賣超"],
            ["unit", "資料單位", "shares、lots、TWD 等不能混淆"],
            ["source", "資料來源或資料供應標記", "方便 audit 與資料追蹤"],
          ]}
        />
      </section>

      <section id="buy-sell-net-and-units" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">買進、賣出、買賣超與單位設計</h2>
        <p className="text-base leading-8 text-slate-700">
          三大法人資料最容易出錯的地方是單位。使用者可能想看的是張數、股數或金額。如果 API 沒有清楚標示單位，後續做因子、圖表或回測時會非常容易出錯。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">常見資料單位</h3>
          <ArticleTable
            headers={["單位", "說明", "適合用途"]}
            rows={[
              ["shares", "股數", "和成交量直接對齊"],
              ["lots", "張數", "台股使用者介面常見顯示方式"],
              ["TWD", "新台幣金額", "買賣金額、資金流向、跨股票比較"],
            ]}
          />
        </div>

        <p className="text-base leading-8 text-slate-700">建議 API 可以提供明確參數讓使用者選擇：</p>
        <CodeBlock code={institutionalFlowUnitEndpointCode} language="text" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。</p>
      </section>

      <section id="institutional-flow-response-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">三大法人 API response schema</h2>
        <p className="text-base leading-8 text-slate-700">
          三大法人資料可以用長表格式表示。這種格式比把所有法人欄位攤成很多 column 更容易擴充，也更適合 database、ETL 與 AI agent tool calling。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Long format response</h3>
          <CodeBlock code={institutionalFlowLongFormatCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Wide format response</h3>
          <p className="text-base leading-8 text-slate-700">
            如果使用者主要是做 pandas 分析，也可以提供 wide format。這種格式適合直接和 OHLCV 合併。
          </p>
          <CodeBlock code={institutionalFlowWideFormatCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            Long format 比較彈性，wide format 比較方便。資料產品可以兩者都支援，或在 API 參數中讓使用者選擇。
          </p>
        </div>
      </section>

      <section id="build-institutional-factors" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何把買賣超轉成量化因子？</h2>
        <p className="text-base leading-8 text-slate-700">單日買賣超通常不適合直接使用。比較常見的做法是把它轉成 rolling feature 或 normalized feature。</p>
        <ArticleTable
          headers={["因子", "公式概念", "用途", "注意事項"]}
          rows={[
            ["單日買賣超", "net_buy", "每日籌碼變化", "容易受單日事件影響"],
            ["連續買超天數", "net_buy > 0 的連續天數", "資金流入持續性", "不代表價格一定上漲"],
            ["買賣超佔成交量比重", "net_buy / volume", "衡量法人買賣對成交量的相對影響", "成交量單位必須一致"],
            ["rolling net buy", "近 N 日 net_buy 加總", "中短期資金流向", "N 的選擇需要回測驗證"],
            ["rolling z-score", "net_buy 與過去平均 / 標準差比較", "偵測異常資金流", "低成交量股票容易產生極端值"],
            ["institutional disagreement", "外資、投信、自營商方向是否分歧", "衡量法人意見一致性", "不同法人行為含義不同"],
          ]}
        />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Factor schema 示意</h3>
          <CodeBlock code={institutionalFlowFactorSchemaCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            如果你要把籌碼因子放進量化策略，可以參考
            {" "}
            <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
              台股量化交易入門
            </Link>
            。
          </p>
          <p className="text-base leading-8 text-slate-700">
            若要接進回測系統，可以參考
            {" "}
            <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
              Python 台股回測系統實作
            </Link>
            。
          </p>
        </div>
      </section>

      <section id="align-with-price-volume-fundamentals" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何和成交量、股價與財報資料對齊？</h2>
        <p className="text-base leading-8 text-slate-700">
          三大法人買賣超資料通常不應該單獨使用。它更常和 OHLCV、成交量、產業分類與基本面資料一起使用。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">和成交量對齊</h3>
          <p className="text-base leading-8 text-slate-700">
            如果要計算買賣超佔成交量比重，必須確認兩邊單位一致。例如 institutional flow 是股數，成交量也應該是股數，而不是張數或金額。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">和股價對齊</h3>
          <p className="text-base leading-8 text-slate-700">
            如果要分析法人買超後的價格行為，必須小心避免 look-ahead bias。當日買賣超資料若在盤後才完整取得，回測時不能用它決定同日收盤前的交易。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">和財報資料對齊</h3>
          <p className="text-base leading-8 text-slate-700">
            法人籌碼可以和基本面因子搭配，例如觀察投信是否持續買超基本面改善的股票，或外資是否在財報公告後調整持股方向。
          </p>
          <p className="text-base leading-8 text-slate-700">
            如果你要理解財報與基本面資料，可以參考
            {" "}
            <Link href="/blog/taiwan-stock-financial-statements-api" className="text-slate-900 underline underline-offset-4">
              台股財報 API 教學
            </Link>
            。
          </p>
        </div>
      </section>

      <section id="python-institutional-flow-example" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Python 串接三大法人 API 範例</h2>
        <p className="text-base leading-8 text-slate-700">以下示範如何用 Python 呼叫三大法人買賣超 API，轉成 pandas DataFrame，並和 OHLCV 資料合併。</p>
        <CodeBlock code={institutionalFlowPythonCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">建立籌碼特徵</h3>
          <CodeBlock code={institutionalFlowFeatureCode} language="python" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">和 OHLCV 合併</h3>
          <CodeBlock code={institutionalFlowMergeCode} language="python" />
          <p className="text-base leading-8 text-slate-700">這裡的重點是資料對齊，而不是策略本身。正式回測還需要考慮資料可得時間、交易成本、滑價與風控。</p>
        </div>
      </section>

      <section id="ai-agent-institutional-flows" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 如何使用法人籌碼資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 不應該用語言模型內部知識猜法人買賣超。正確做法是透過 tool calling 查詢 institutional flow API，再用 LLM 做摘要、比較與風險標記。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent tool schema 示意</h3>
          <CodeBlock code={institutionalFlowAgentToolCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent response schema 示意</h3>
          <CodeBlock code={institutionalFlowAgentResponseCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          這種結構化輸出能讓 agent 清楚標示資料來源、時間區間與限制。對 production workflow 來說，它比一句法人買超所以看多更可靠。
        </p>
      </section>

      <section id="institutional-flow-data-quality" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見資料品質問題</h2>
        <p className="text-base leading-8 text-slate-700">三大法人資料常見問題不在於難以理解，而在於資料口徑、單位與對齊方式容易出錯。</p>
        <ArticleTable
          headers={["問題", "影響", "API 應提供的協助"]}
          rows={[
            ["單位不清楚", "張數、股數、金額混用", "提供 unit 欄位與查詢參數"],
            ["市場別混淆", "上市與上櫃資料口徑混在一起", "提供 market 欄位"],
            ["自營商細分不清楚", "自行買賣與避險行為被混在一起", "提供 dealer 子類別或 metadata"],
            ["和成交量單位不一致", "net_buy / volume 比例錯誤", "統一 volume 與 flow 單位"],
            ["資料可得時間不清楚", "回測可能使用未來資料", "提供 updated_at 或 available_at"],
            ["缺值未標示原因", "誤以為法人沒有買賣", "提供 missing reason 或 trading status"],
          ]}
        />
      </section>

      <section id="institutional-flow-endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是三大法人與籌碼資料相關 endpoint 的設計示意。</p>
        <CodeBlock code={institutionalFlowEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是資料單位、法人類別、市場別、日期與 response schema 必須清楚，才能支援量化研究、dashboard 和 AI agent workflow。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const technicalIndicatorMovingAverageCode = `{
  "data": [
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "indicator": "sma",
      "source": "close",
      "window": 20,
      "value": 812.35
    },
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "indicator": "ema",
      "source": "close",
      "window": 20,
      "value": 815.42
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "adjusted": true,
    "timezone": "Asia/Taipei"
  }
}`;

const technicalIndicatorRsiCode = `{
  "data": [
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "indicator": "rsi",
      "source": "close",
      "window": 14,
      "value": 58.7
    }
  ],
  "meta": {
    "adjusted": true,
    "timezone": "Asia/Taipei"
  }
}`;

const technicalIndicatorMacdCode = `{
  "data": [
    {
      "date": "2026-04-24",
      "symbol": "2330",
      "indicator": "macd",
      "source": "close",
      "fast_window": 12,
      "slow_window": 26,
      "signal_window": 9,
      "macd": 4.25,
      "signal": 3.88,
      "histogram": 0.37
    }
  ],
  "meta": {
    "adjusted": true,
    "timezone": "Asia/Taipei"
  }
}`;

const technicalIndicatorBollingerCode = `{
  "date": "2026-04-24",
  "symbol": "2330",
  "indicator": "bollinger_bands",
  "source": "close",
  "window": 20,
  "num_std": 2,
  "middle_band": 812.35,
  "upper_band": 845.12,
  "lower_band": 779.08
}`;

const technicalIndicatorAtrCode = `{
  "date": "2026-04-24",
  "symbol": "2330",
  "indicator": "atr",
  "window": 14,
  "value": 18.4,
  "data_used": [
    "high",
    "low",
    "previous_close"
  ]
}`;

const technicalIndicatorPythonCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/stocks/2330/ohlcv",
    headers=headers,
    params={
        "from": "2025-01-01",
        "to": "2025-12-31",
        "interval": "1d",
        "adjusted": "true"
    },
    timeout=20
)

response.raise_for_status()

payload = response.json()
df = pd.DataFrame(payload["data"])

df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date").reset_index(drop=True)

df["sma20"] = df["close"].rolling(20).mean()
df["sma60"] = df["close"].rolling(60).mean()

delta = df["close"].diff()
gain = delta.clip(lower=0)
loss = -delta.clip(upper=0)

avg_gain = gain.rolling(14).mean()
avg_loss = loss.rolling(14).mean()

rs = avg_gain / avg_loss
df["rsi14"] = 100 - (100 / (1 + rs))

ema12 = df["close"].ewm(span=12, adjust=False).mean()
ema26 = df["close"].ewm(span=26, adjust=False).mean()

df["macd"] = ema12 - ema26
df["macd_signal"] = df["macd"].ewm(span=9, adjust=False).mean()
df["macd_histogram"] = df["macd"] - df["macd_signal"]

print(df[[
    "date",
    "close",
    "sma20",
    "sma60",
    "rsi14",
    "macd",
    "macd_signal",
    "macd_histogram"
]].tail())`;

const technicalIndicatorSignalCode = `df["signal"] = 0
df.loc[df["sma20"] > df["sma60"], "signal"] = 1

df["position"] = df["signal"].shift(1).fillna(0)
df["return"] = df["close"].pct_change()
df["strategy_return"] = df["position"] * df["return"]`;

const technicalIndicatorAgentToolCode = `{
  "name": "get_technical_indicators",
  "description": "Get technical indicators for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "indicators": [
      {
        "name": "sma",
        "window": 20
      },
      {
        "name": "rsi",
        "window": 14
      },
      {
        "name": "macd",
        "fast_window": 12,
        "slow_window": 26,
        "signal_window": 9
      }
    ],
    "adjusted": true
  }
}`;

const technicalIndicatorAgentResponseCode = `{
  "symbol": "2330",
  "data_used": [
    "daily_ohlcv",
    "technical_indicators"
  ],
  "indicators": {
    "sma20": 812.35,
    "sma60": 785.42,
    "rsi14": 58.7,
    "macd_histogram": 0.37
  },
  "summary": "Short-term moving average is above long-term moving average, but this is not sufficient as a standalone trading signal.",
  "risk_flags": [
    "requires_backtesting",
    "technical_indicator_only",
    "not_a_standalone_trading_signal"
  ],
  "not_investment_advice": true
}`;

const technicalIndicatorEndpointDesignCode = `GET /v1/tw/stocks/{symbol}/ohlcv
GET /v1/tw/stocks/{symbol}/technical-indicators
GET /v1/tw/stocks/{symbol}/technical-indicators?sma=20,60
GET /v1/tw/stocks/{symbol}/technical-indicators?rsi=14
GET /v1/tw/stocks/{symbol}/technical-indicators?macd=12,26,9
GET /v1/tw/stocks/{symbol}/technical-indicators?bollinger=20,2
GET /v1/tw/stocks/{symbol}/signals/technical`;

function TaiwanStockTechnicalIndicatorsApiContent() {
  return (
    <>
      <section id="what-is-technical-analysis-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">技術分析 API 是什麼？</h2>
        <p className="text-base leading-8 text-slate-700">
          技術分析 API 是讓開發者透過 API 取得技術指標資料，或取得足夠乾淨的行情資料後自行計算指標。常見技術指標包括：
        </p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>SMA</li>
          <li>EMA</li>
          <li>RSI</li>
          <li>MACD</li>
          <li>Bollinger Bands</li>
          <li>ATR</li>
          <li>volume moving average</li>
          <li>price return</li>
          <li>volatility</li>
          <li>breakout signal</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          對台股資料產品來說，技術分析 API 的價值不是宣稱某個指標可以預測價格，而是讓 developer、quant 和 AI agent 能用一致 schema 取得可回測、可監控的 signal data。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你還在理解台股 API 的整體資料分類，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="api-vs-self-calculation" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">技術指標應該由 API 提供，還是自行計算？</h2>
        <p className="text-base leading-8 text-slate-700">
          技術指標可以由 API provider 預先計算，也可以由使用者在 client 端自行計算。兩種方式各有優缺點。
        </p>
        <ArticleTable
          headers={["方式", "優點", "限制", "適合情境"]}
          rows={[
            ["API 預先計算", "使用簡單、結果一致、適合 dashboard 和 agent tool", "指標參數彈性較低，需要清楚定義公式", "看板、警示系統、AI agent 摘要"],
            ["使用者自行計算", "彈性高，可自訂 window、公式與 signal", "需要自己處理資料對齊、缺值與測試", "量化研究、策略回測、客製化模型"],
            ["混合模式", "API 提供 OHLCV 與常用指標，進階使用者自行擴充", "文件要清楚，避免重複定義", "developer-first financial data API"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          對 TW Market Data 這類產品來說，最穩定的設計通常是：先提供乾淨 OHLCV，再逐步提供常用 indicator endpoint。這樣既能服務 Python 研究者，也能服務 dashboard 與 AI agent workflow。
        </p>
      </section>

      <section id="required-raw-data" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">技術分析需要哪些原始資料？</h2>
        <p className="text-base leading-8 text-slate-700">大多數技術指標都來自 OHLCV。不同指標需要的欄位略有差異。</p>
        <ArticleTable
          headers={["指標", "需要資料", "常見參數", "注意事項"]}
          rows={[
            ["SMA / EMA", "close", "window=20, 60", "前 N 筆會有缺值"],
            ["RSI", "close", "window=14", "需定義 gains / losses 計算方式"],
            ["MACD", "close", "fast=12, slow=26, signal=9", "EMA 公式與 min_periods 要清楚"],
            ["Bollinger Bands", "close", "window=20, num_std=2", "標準差計算方式需一致"],
            ["ATR", "high, low, close", "window=14", "需要前一日 close 計算 true range"],
            ["Volume MA", "volume", "window=20", "volume 單位必須清楚"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          如果你要理解 OHLCV、K 線與 adjusted price，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
      </section>

      <section id="moving-average-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">均線 API 與 moving average schema</h2>
        <p className="text-base leading-8 text-slate-700">
          均線是最常見的技術指標之一。SMA 是 simple moving average，EMA 是 exponential moving average。API 設計時應該清楚標示 indicator type、window、source field 和日期。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Moving average response example</h3>
          <CodeBlock code={technicalIndicatorMovingAverageCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          如果 API 回傳均線值，`window` 和 `source` 不能省略。否則使用者無法知道這是 20 日均線、60 日均線，還是用收盤價或調整後收盤價計算。
        </p>
      </section>

      <section id="rsi-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">RSI API 與 momentum indicator schema</h2>
        <p className="text-base leading-8 text-slate-700">
          RSI 常被用來衡量價格動能。API 不應該只回傳一個數字，還應該標示 window、source、計算日期與使用資料。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">RSI response example</h3>
          <CodeBlock code={technicalIndicatorRsiCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          RSI 的 interpretation 不應該由 API 強行決定。比較好的做法是 API 提供 indicator value，使用者或 agent 再根據策略規則決定如何解讀。
        </p>
      </section>

      <section id="macd-schema" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">MACD API 與 trend indicator schema</h2>
        <p className="text-base leading-8 text-slate-700">
          MACD 通常包含 MACD line、signal line 和 histogram。若 API 提供 MACD，應該一次回傳這三個欄位，並標示 fast、slow 和 signal window。
        </p>
        <CodeBlock code={technicalIndicatorMacdCode} language="json" />
        <p className="text-base leading-8 text-slate-700">MACD 的重點不只是交叉訊號。對回測來說，應該保留原始 indicator values，讓策略規則可以被重跑與驗證。</p>
      </section>

      <section id="bollinger-and-atr" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">布林通道與 ATR：波動率指標</h2>
        <p className="text-base leading-8 text-slate-700">除了價格方向，很多策略也需要波動率資訊。布林通道和 ATR 都可以用來描述價格波動，但兩者資料需求不同。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Bollinger Bands schema</h3>
          <CodeBlock code={technicalIndicatorBollingerCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">ATR schema</h3>
          <CodeBlock code={technicalIndicatorAtrCode} language="json" />
          <p className="text-base leading-8 text-slate-700">ATR 需要 high、low 和 previous close，因此比單純 close-based indicator 更容易受到資料對齊問題影響。</p>
        </div>
      </section>

      <section id="data-alignment" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何避免資料對齊錯誤？</h2>
        <p className="text-base leading-8 text-slate-700">技術指標最常見的錯誤不是公式，而是資料對齊。常見問題包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>用當日收盤後才知道的 indicator 交易當日</li>
          <li>未處理除權息造成均線與 RSI 失真</li>
          <li>不同股票交易日對齊錯誤</li>
          <li>volume 單位不一致</li>
          <li>前 N 筆 rolling window 缺值被錯誤填補</li>
          <li>停牌或無成交資料未標示</li>
          <li>週 K、月 K 聚合規則不清楚</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Data alignment checklist</h3>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>是否使用 adjusted price？</li>
            <li>indicator 是否由當日收盤後資料計算？</li>
            <li>回測是否使用 shift(1) 避免 look-ahead bias？</li>
            <li>交易日曆是否正確？</li>
            <li>停牌或無成交日是否有標示？</li>
            <li>rolling window 前 N 筆缺值是否保留？</li>
            <li>volume 單位是否和其他資料一致？</li>
            <li>週 K、月 K 是否有清楚聚合規則？</li>
          </ul>
        </div>
      </section>

      <section id="python-indicator-example" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Python 計算技術指標範例</h2>
        <p className="text-base leading-8 text-slate-700">以下示範如何用 Python 從 OHLCV 計算幾個常見技術指標。</p>
        <CodeBlock code={technicalIndicatorPythonCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際 API host 與路徑請以 TW Market Data docs 為準。這是資料處理範例，不構成投資建議。</p>
        <p className="text-base leading-8 text-slate-700">
          如果你還不熟悉 Python 串接台股資料，可以先看
          {" "}
          <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
            Python 抓台股資料教學
          </Link>
          。
        </p>
      </section>

      <section id="indicators-in-backtesting" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何把技術指標接進回測？</h2>
        <p className="text-base leading-8 text-slate-700">技術指標本身不是策略。策略需要明確定義 signal、持倉、交易成本、滑價與風控。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Signal example</h3>
          <CodeBlock code={technicalIndicatorSignalCode} language="python" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          `shift(1)` 是避免 look-ahead bias 的基本做法。若使用當日收盤後才計算出的 signal 來交易當日，回測結果會失真。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把技術指標放進完整的資料、signal 與風控流程，可以先看
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要建立完整回測流程，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
            Python 台股回測系統實作
          </Link>
          。
        </p>
      </section>

      <section id="ai-agent-technical-workflow" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 如何使用技術分析資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 不應該自己猜 RSI、MACD 或均線值。正確做法是透過 tool calling 查詢 OHLCV 或 technical indicators API，再讓 agent 做摘要、比較與風險標記。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent tool schema 示意</h3>
          <CodeBlock code={technicalIndicatorAgentToolCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent response schema 示意</h3>
          <CodeBlock code={technicalIndicatorAgentResponseCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            這種結構化輸出比一句技術面偏多更適合 production workflow。它能讓 dashboard、risk manager 或下一個 agent 知道使用了哪些資料與哪些限制。
          </p>
        </div>
      </section>

      <section id="technical-data-quality-issues" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見資料品質問題</h2>
        <p className="text-base leading-8 text-slate-700">技術指標看起來容易計算，但 production workflow 裡常見問題很多。</p>
        <ArticleTable
          headers={["問題", "影響", "API 應提供的協助"]}
          rows={[
            ["價格未調整", "除權息造成指標失真", "提供 adjusted 參數與 meta"],
            ["rolling window 缺值被填補", "前 N 筆指標不可信", "保留 null 或標示 insufficient_data"],
            ["交易日曆錯誤", "指標日期對齊錯誤", "提供 trading calendar endpoint"],
            ["週 K / 月 K 聚合規則不清楚", "不同使用者計算結果不一致", "在 meta 中標示 aggregation rule"],
            ["signal 和 indicator 混在一起", "使用者無法重現策略邏輯", "分開提供 indicator values 和 signal rules"],
            ["volume 單位不清楚", "volume-based indicator 失真", "提供 unit 欄位"],
          ]}
        />
      </section>

      <section id="technical-endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是技術分析與指標資料相關 endpoint 的設計示意。</p>
        <CodeBlock code={technicalIndicatorEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是 indicator 參數、資料來源、價格調整狀態、日期區間與 response schema 必須清楚。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const etfHoldingsResponseCode = `{
  "data": [
    {
      "etf_symbol": "0050",
      "etf_name": "Yuanta/P-shares Taiwan Top 50 ETF",
      "as_of_date": "2026-04-24",
      "holding_symbol": "2330",
      "holding_name": "台積電",
      "market": "twse",
      "weight": 0.61,
      "shares": 472160000,
      "market_value": 983330000000,
      "currency": "TWD"
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "data_type": "etf_holdings",
    "timezone": "Asia/Taipei"
  }
}`;

const indexConstituentResponseCode = `{
  "data": [
    {
      "index_code": "TW50",
      "index_name": "Taiwan 50 Index",
      "as_of_date": "2026-04-24",
      "effective_date": "2026-04-22",
      "constituent_symbol": "2330",
      "constituent_name": "台積電",
      "market": "twse",
      "weight": 0.61,
      "sector": "Semiconductors"
    }
  ],
  "meta": {
    "source": "tw-market-data",
    "data_type": "index_constituents",
    "timezone": "Asia/Taipei"
  }
}`;

const etf0050EndpointCode = `GET /v1/tw/etfs/0050/holdings?as_of=2026-04-24
GET /v1/tw/etfs/0050/holdings/history?from=2020-01-01&to=2026-04-24`;

const sectorExposureCode = `{
  "date": "2026-04-24",
  "portfolio": "example_strategy",
  "sector_exposure": [
    {
      "sector": "Semiconductors",
      "weight": 0.42
    },
    {
      "sector": "Financials",
      "weight": 0.18
    },
    {
      "sector": "Electronics",
      "weight": 0.15
    }
  ]
}`;

const constituentChangesCode = `{
  "data": [
    {
      "index_code": "TW50",
      "review_date": "2026-03-15",
      "effective_date": "2026-03-22",
      "change_type": "added",
      "symbol": "1234",
      "name": "Example Co",
      "new_weight": 0.012
    },
    {
      "index_code": "TW50",
      "review_date": "2026-03-15",
      "effective_date": "2026-03-22",
      "change_type": "removed",
      "symbol": "5678",
      "name": "Old Example Co",
      "old_weight": 0.008
    }
  ]
}`;

const universeSelectionCode = `{
  "universe": "0050_holdings",
  "as_of_date": "2026-04-24",
  "symbols": [
    {
      "symbol": "2330",
      "name": "台積電",
      "market": "twse",
      "weight": 0.61,
      "sector": "Semiconductors"
    }
  ],
  "source": {
    "type": "etf_holdings",
    "symbol": "0050"
  }
}`;

const etfPythonExampleCode = `import os
import requests
import pandas as pd

API_KEY = os.getenv("TW_MARKET_DATA_API_KEY")
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(
    f"{BASE_URL}/v1/tw/etfs/0050/holdings",
    headers=headers,
    params={
        "as_of": "2026-04-24"
    },
    timeout=20
)

response.raise_for_status()

payload = response.json()
holdings = pd.DataFrame(payload["data"])

holdings["as_of_date"] = pd.to_datetime(holdings["as_of_date"])

universe = holdings["holding_symbol"].dropna().unique().tolist()

print(universe[:10])`;

const etfSectorExposurePythonCode = `sector_exposure = (
    holdings
    .groupby("sector", as_index=False)["weight"]
    .sum()
    .sort_values("weight", ascending=False)
)

print(sector_exposure)`;

const backtestSafeUniverseCode = `backtest_date = "2025-06-30"

response = requests.get(
    f"{BASE_URL}/v1/tw/etfs/0050/holdings",
    headers=headers,
    params={
        "as_of": backtest_date
    },
    timeout=20
)

response.raise_for_status()

holdings = pd.DataFrame(response.json()["data"])
universe = holdings["holding_symbol"].tolist()`;

const etfAgentToolCode = `{
  "name": "get_etf_holdings",
  "description": "Get ETF holdings for a Taiwan ETF.",
  "parameters": {
    "etf_symbol": "0050",
    "as_of": "2026-04-24"
  }
}`;

const etfAgentResponseCode = `{
  "etf_symbol": "0050",
  "as_of_date": "2026-04-24",
  "data_used": [
    "etf_holdings",
    "sector_classification"
  ],
  "top_holdings": [
    {
      "symbol": "2330",
      "weight": 0.61
    }
  ],
  "sector_exposure": [
    {
      "sector": "Semiconductors",
      "weight": 0.42
    }
  ],
  "risk_flags": [
    "weights_require_latest_data",
    "not_a_trading_signal"
  ],
  "not_investment_advice": true
}`;

const etfEndpointDesignCode = `GET /v1/tw/etfs
GET /v1/tw/etfs/{symbol}/profile
GET /v1/tw/etfs/{symbol}/holdings
GET /v1/tw/etfs/{symbol}/holdings?as_of=2026-04-24
GET /v1/tw/indices
GET /v1/tw/indices/{index_code}/constituents
GET /v1/tw/indices/{index_code}/constituents?as_of=2026-04-24
GET /v1/tw/indices/{index_code}/constituent-changes
GET /v1/tw/stocks/{symbol}/sector-classification`;

function TaiwanEtfIndexConstituentsApiContent() {
  return (
    <>
      <section id="why-etf-index-api-matters" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼 ETF 與指數成分股 API 重要？</h2>
        <p className="text-base leading-8 text-slate-700">
          量化研究通常不會直接從全部上市上櫃股票開始，而是先定義 universe。Universe 可以是大型股、某個 ETF 成分股、某個指數成分股、特定產業，或流動性足夠的一組股票。
        </p>
        <p className="text-base leading-8 text-slate-700">ETF 與指數成分股 API 可以支援：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>ETF dashboard</li>
          <li>ETF holdings 查詢</li>
          <li>指數成分股查詢</li>
          <li>股票 universe selection</li>
          <li>sector exposure 分析</li>
          <li>產業輪動策略</li>
          <li>ETF 成分股變更追蹤</li>
          <li>回測資料集建立</li>
          <li>AI agent 股票研究助理</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果你還在理解台股 API 的整體架構，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="etf-vs-index-vs-stock-master" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ETF 資料、指數資料與股票清單有什麼差別？</h2>
        <p className="text-base leading-8 text-slate-700">ETF、指數與股票清單看起來都像一組股票，但資料語意不同。</p>
        <ArticleTable
          headers={["類型", "說明", "常見欄位", "適合用途"]}
          rows={[
            ["股票清單", "可交易股票或商品的基本列表", "symbol, name, market, industry, is_active", "搜尋、資料庫基礎表、universe 初始來源"],
            ["指數成分股", "某個指數在特定日期的成分股", "index_code, constituent_symbol, weight, effective_date", "指數研究、benchmark、universe selection"],
            ["ETF holdings", "ETF 持有的標的與權重", "etf_symbol, holding_symbol, weight, shares, market_value", "ETF dashboard、持股分析、曝險分析"],
            ["產業分類", "股票所屬產業或 sector", "symbol, industry, sector, classification_source", "sector exposure、產業輪動、風險控管"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          對資料產品來說，這些資料不應該全部塞在同一個 endpoint 裡。ETF holdings、index constituents 與 stock master 應該有各自清楚的 schema。
        </p>
      </section>

      <section id="etf-holdings-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ETF holdings API 應該包含哪些欄位？</h2>
        <p className="text-base leading-8 text-slate-700">ETF holdings API 應該描述某檔 ETF 在特定日期持有哪些標的、各自權重是多少，以及資料版本或資料日期。</p>
        <ArticleTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["etf_symbol", "string", "ETF 代號，例如 0050"],
            ["etf_name", "string", "ETF 名稱"],
            ["as_of_date", "string", "holdings 資料日期"],
            ["holding_symbol", "string", "成分股代號"],
            ["holding_name", "string", "成分股名稱"],
            ["market", "string", "市場別，例如 twse、tpex"],
            ["weight", "number", "成分股權重"],
            ["shares", "number", "ETF 持有股數，可選"],
            ["market_value", "number", "持股市值，可選"],
            ["currency", "string", "幣別，例如 TWD"],
          ]}
        />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">ETF holdings response example</h3>
          <CodeBlock code={etfHoldingsResponseCode} language="json" />
          <p className="text-base leading-8 text-slate-700">上方數值是 schema 示意，不代表實際 holdings。正式 API 應以資料來源與更新時間為準。</p>
        </div>
      </section>

      <section id="index-constituents-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">指數成分股 API schema</h2>
        <p className="text-base leading-8 text-slate-700">指數成分股 API 的重點是 index code、成分股、權重與生效日期。若要用於回測，還需要查詢歷史成分股，而不是只查最新成分。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Index constituents response example</h3>
          <CodeBlock code={indexConstituentResponseCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">欄位設計重點</h3>
          <ArticleTable
            headers={["欄位", "說明", "為什麼重要"]}
            rows={[
              ["index_code", "指數代碼", "區分不同指數"],
              ["as_of_date", "查詢資料日期", "支援歷史查詢與版本控制"],
              ["effective_date", "成分股變更生效日期", "避免回測使用未來成分"],
              ["constituent_symbol", "成分股股票代號", "用於連接 OHLCV、財報與籌碼資料"],
              ["weight", "成分股權重", "用於權重型 universe、sector exposure 與 benchmark"],
              ["sector", "產業或 sector", "用於風險控管與產業輪動"],
            ]}
          />
        </div>
      </section>

      <section id="taiwan-50-constituents-design" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">0050 成分股資料可以怎麼設計？</h2>
        <p className="text-base leading-8 text-slate-700">
          0050 是台灣市場常見的大型股 ETF，因此很多研究者會用它作為大型股 universe 的起點。但在 API 設計上，不應該把 0050 特別寫死，而是應該讓所有 ETF 使用同一套 holdings schema。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">查詢 0050 holdings endpoint 示意</h3>
          <CodeBlock code={etf0050EndpointCode} language="text" />
          <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
        </div>

        <p className="text-base leading-8 text-slate-700">
          這樣使用者可以查 0050，也可以用同一套 endpoint 查其他 ETF。資料產品應該用一致 schema，而不是為每個 ETF 設計一個特殊 case。
        </p>
      </section>

      <section id="sector-classification-and-exposure" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">產業分類與 sector exposure</h2>
        <p className="text-base leading-8 text-slate-700">
          ETF 與指數成分股資料通常會和產業分類一起使用。對量化交易來說，產業分類不只是顯示用途，也可以用來控制 portfolio exposure。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Sector exposure example</h3>
          <CodeBlock code={sectorExposureCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          如果策略只看股票分數而不控制 sector exposure，可能會不小心集中在同一產業。這也是 ETF、指數成分股與產業分類資料在回測中很重要的原因。
        </p>
      </section>

      <section id="rebalancing-and-asof-date" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Rebalancing、成分變更與 as-of date</h2>
        <p className="text-base leading-8 text-slate-700">
          ETF 和指數成分股會變動。對回測來說，最危險的錯誤是用最新成分股回測過去資料。這會產生 look-ahead bias，因為策略在歷史某一天使用了當時還不知道的成分股資訊。
        </p>
        <p className="text-base leading-8 text-slate-700">API 應該清楚提供：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>as_of_date</li>
          <li>effective_date</li>
          <li>review_date</li>
          <li>added_symbols</li>
          <li>removed_symbols</li>
          <li>old_weight</li>
          <li>new_weight</li>
          <li>data_version</li>
        </ul>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Constituent changes schema</h3>
          <CodeBlock code={constituentChangesCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          對 production workflow 來說，成分變更資料應該可以被重跑、被 audit，也能被 backtester 依照歷史日期查詢。
        </p>
      </section>

      <section id="universe-selection-with-constituents" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何用成分股建立 universe selection？</h2>
        <p className="text-base leading-8 text-slate-700">
          Universe selection 是量化策略的第一步。ETF 與指數成分股資料最常見的用途，就是建立可交易或可研究的股票集合。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Universe schema 示意</h3>
          <CodeBlock code={universeSelectionCode} language="json" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          如果你要理解量化研究中的 universe selection，可以參考
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          。
        </p>
      </section>

      <section id="python-etf-index-api-example" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Python 串接 ETF / index constituents API 範例</h2>
        <p className="text-base leading-8 text-slate-700">以下示範如何用 Python 查詢 ETF holdings，並建立一個股票 universe。</p>
        <CodeBlock code={etfPythonExampleCode} language="python" />
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">計算 sector exposure</h3>
          <CodeBlock code={etfSectorExposurePythonCode} language="python" />
        </div>

        <p className="text-base leading-8 text-slate-700">這種資料可以接到 dashboard，也可以接到回測中的風險控管模組。</p>
      </section>

      <section id="etf-index-data-in-backtesting" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何把 ETF / 指數資料接進回測？</h2>
        <p className="text-base leading-8 text-slate-700">把 ETF holdings 或 index constituents 接進回測時，最重要的是使用正確的歷史版本。回測日期只能使用當時有效的成分股資料。</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Backtest-safe universe query</h3>
          <CodeBlock code={backtestSafeUniverseCode} language="python" />
        </div>

        <p className="text-base leading-8 text-slate-700">
          如果用最新 holdings 直接回測過去策略，會讓策略看起來比真實更穩定，因為已經排除了過去被移除的成分股。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要建立完整回測流程，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
            Python 台股回測系統實作
          </Link>
          。
        </p>
      </section>

      <section id="ai-agent-etf-index-workflow" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI agent 如何使用 ETF 與指數資料？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 可以用 ETF 與指數成分股資料做研究輔助，例如查詢某檔 ETF 目前持有哪些股票、某個 index 的 sector exposure，或比較 ETF holdings 與基本面 / 籌碼資料。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent tool schema 示意</h3>
          <CodeBlock code={etfAgentToolCode} language="json" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Agent response schema 示意</h3>
          <CodeBlock code={etfAgentResponseCode} language="json" />
          <p className="text-base leading-8 text-slate-700">
            這種結構化資料可以讓 agent 做摘要與比較，但不應該讓 agent 用記憶猜 ETF 成分股或權重。
          </p>
        </div>
      </section>

      <section id="etf-index-data-quality-issues" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">常見資料品質問題</h2>
        <p className="text-base leading-8 text-slate-700">ETF 與指數資料最常見的問題是時間版本、權重、成分變更與分類口徑不清楚。</p>
        <ArticleTable
          headers={["問題", "影響", "API 應提供的協助"]}
          rows={[
            ["只提供最新成分股", "回測產生 look-ahead bias", "支援 as_of_date 與 historical constituents"],
            ["權重更新時間不清楚", "dashboard 和回測使用錯誤權重", "提供 as_of_date、updated_at"],
            ["ETF holdings 與 index constituents 混淆", "使用者誤把 ETF 持股當成指數成分", "分開 endpoint 與 data_type"],
            ["成分變更沒有記錄", "無法重建歷史 universe", "提供 constituent changes endpoint"],
            ["產業分類口徑不一致", "sector exposure 錯誤", "提供 classification_source"],
            ["權重加總不等於 1", "portfolio 或 exposure 計算錯誤", "提供 cash / other holdings 或 metadata"],
          ]}
        />
      </section>

      <section id="etf-index-endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是 ETF 與指數成分股資料相關 endpoint 的設計示意。</p>
        <CodeBlock code={etfEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是 ETF holdings、index constituents、sector classification 與 historical versions 要能被清楚查詢。
        </p>
        <p className="text-sm leading-7 text-slate-600">上方 endpoint 是示意。實際路徑請以 TW Market Data docs 為準。</p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把成分股 universe 和台股歷史價格資料一起回測，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把 ETF / 指數 universe 再結合營收、EPS、ROE 與現金流因子，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-financial-statements-api" className="text-slate-900 underline underline-offset-4">
            台股財報 API 教學
          </Link>
          。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要把 ETF universe 與外資、投信、自營商的資金流一起分析，可參考
          {" "}
          <Link href="/blog/taiwan-institutional-investors-api" className="text-slate-900 underline underline-offset-4">
            三大法人買賣超 API
          </Link>
          。
        </p>
      </section>
    </>
  );
}

const aiAgentArchitectureCode = `Data Sources
  ├─ OHLCV
  ├─ Financial statements
  ├─ Monthly revenue
  ├─ Institutional flows
  ├─ Technical indicators
  ├─ ETF / index constituents
  └─ Trading calendar

Tool Layer
  ├─ get_daily_ohlcv
  ├─ get_financial_statements
  ├─ get_institutional_flows
  ├─ get_technical_indicators
  ├─ get_etf_holdings
  └─ calculate_risk_metrics

Agent Layer
  ├─ Fundamentals Agent
  ├─ Technicals Agent
  ├─ Institutional Flow Agent
  ├─ ETF / Universe Agent
  ├─ Risk Manager
  └─ Portfolio Manager

Output
  ├─ structured signals
  ├─ risk flags
  ├─ portfolio constraints
  └─ research summary`;

const fundamentalsAgentInputCode = `{
  "symbol": "2330",
  "tools": [
    "get_financial_statements",
    "get_monthly_revenue"
  ],
  "lookback_period": "8q",
  "required_fields": [
    "revenue",
    "eps",
    "roe",
    "gross_margin",
    "operating_cash_flow",
    "announcement_date"
  ]
}`;

const fundamentalsAgentOutputCode = `{
  "agent": "fundamentals",
  "symbol": "2330",
  "signal": "neutral",
  "confidence": 0.64,
  "data_used": [
    "income_statement",
    "balance_sheet",
    "cash_flow_statement",
    "monthly_revenue"
  ],
  "summary": "Revenue growth remains positive, but valuation and sector cycle require additional checks.",
  "risk_flags": [
    "requires_peer_comparison",
    "requires_latest_announcement_date"
  ]
}`;

const technicalsAgentOutputCode = `{
  "agent": "technicals",
  "symbol": "2330",
  "signal": "bullish",
  "confidence": 0.58,
  "data_used": [
    "daily_ohlcv",
    "technical_indicators"
  ],
  "indicators": {
    "sma20": 812.35,
    "sma60": 785.42,
    "rsi14": 58.7,
    "macd_histogram": 0.37
  },
  "risk_flags": [
    "technical_indicator_only",
    "requires_backtesting"
  ]
}`;

const institutionalFlowAgentOutputCode = `{
  "agent": "institutional_flows",
  "symbol": "2330",
  "signal": "neutral",
  "confidence": 0.52,
  "data_used": [
    "institutional_flows",
    "daily_ohlcv"
  ],
  "flow_features": {
    "foreign_net_buy_5d": 12000000,
    "investment_trust_net_buy_5d": 1800000,
    "dealer_net_buy_5d": -600000,
    "foreign_net_buy_volume_ratio_5d": 0.036
  },
  "risk_flags": [
    "not_a_standalone_signal",
    "requires_volume_normalization"
  ]
}`;

const universeAgentOutputCode = `{
  "agent": "universe",
  "universe": "0050_holdings",
  "as_of_date": "2026-04-24",
  "symbols": [
    "2330",
    "2317",
    "2454"
  ],
  "sector_exposure": [
    {
      "sector": "Semiconductors",
      "weight": 0.42
    }
  ],
  "risk_flags": [
    "requires_historical_constituents_for_backtest"
  ]
}`;

const riskManagerOutputCode = `{
  "agent": "risk_manager",
  "symbol": "2330",
  "max_position_weight": 0.08,
  "risk_score": 0.37,
  "data_used": [
    "daily_ohlcv",
    "volume",
    "sector_exposure"
  ],
  "risk_flags": [
    "single_name_exposure_limit",
    "requires_liquidity_check"
  ]
}`;

const portfolioManagerOutputCode = `{
  "symbol": "2330",
  "final_signal": "neutral",
  "confidence": 0.59,
  "agent_signals": [
    {
      "agent": "fundamentals",
      "signal": "neutral",
      "confidence": 0.64
    },
    {
      "agent": "technicals",
      "signal": "bullish",
      "confidence": 0.58
    },
    {
      "agent": "institutional_flows",
      "signal": "neutral",
      "confidence": 0.52
    }
  ],
  "risk_manager": {
    "max_position_weight": 0.08,
    "risk_flags": [
      "requires_liquidity_check"
    ]
  },
  "decision": "research_only",
  "not_investment_advice": true
}`;

const aiToolSchemaOhlcvCode = `{
  "name": "get_daily_ohlcv",
  "description": "Get daily OHLCV data for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "adjusted": true
  }
}`;

const aiToolSchemaFinancialsCode = `{
  "name": "get_financial_statements",
  "description": "Get financial statements for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "statement": "income_statement",
    "from": "2024Q1",
    "to": "2025Q4"
  }
}`;

const aiToolSchemaFlowsCode = `{
  "name": "get_institutional_flows",
  "description": "Get institutional investor flows for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "unit": "shares",
    "format": "wide"
  }
}`;

const aiResearchWorkflowCode = `User asks:
"請分析 2330 最近的基本面、技術面與法人籌碼。"

Agent workflow:
1. search_stocks("2330")
2. get_daily_ohlcv("2330")
3. get_financial_statements("2330")
4. get_institutional_flows("2330")
5. get_technical_indicators("2330")
6. calculate_risk_metrics("2330")
7. generate structured research summary`;

const aiEndpointDesignCode = `GET /v1/tw/stocks/search
GET /v1/tw/stocks/{symbol}/profile
GET /v1/tw/stocks/{symbol}/ohlcv
GET /v1/tw/stocks/{symbol}/financials
GET /v1/tw/stocks/{symbol}/monthly-revenue
GET /v1/tw/stocks/{symbol}/institutional-flows
GET /v1/tw/stocks/{symbol}/technical-indicators
GET /v1/tw/etfs/{symbol}/holdings
GET /v1/tw/indices/{index_code}/constituents
GET /v1/tw/calendar/trading-days`;

function AiHedgeFundTaiwanStocksContent() {
  return (
    <>
      <section id="what-ai-hedge-fund-does" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI Hedge Fund 類型專案在做什麼？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI Hedge Fund 類型專案通常會把股票分析流程拆成多個 agent。每個 agent 負責不同任務，例如基本面分析、估值、技術分析、情緒分析、風險管理或投資組合決策。
        </p>
        <p className="text-base leading-8 text-slate-700">這種架構的重點不是讓一個 LLM 直接回答買或賣，而是把分析流程拆成可檢查的步驟：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>取得資料</li>
          <li>分析資料</li>
          <li>產生 signal</li>
          <li>標示信心與風險</li>
          <li>交給 risk manager 檢查</li>
          <li>交給 portfolio manager 整合</li>
          <li>輸出可 audit 的結果</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          對 TW Market Data 來說，這類架構提供一個清楚的產品方向：台股 AI agent workflow 需要穩定的 market data API，而不是只靠模型內部記憶。
        </p>
      </section>

      <section id="why-us-workflow-not-directly-portable" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼美股架構不能直接套用台股？</h2>
        <p className="text-base leading-8 text-slate-700">
          把美股 AI agent workflow 改成台股版，不能只替換股票代號。台股有自己的市場結構、資料來源、交易規則與資料特色。
        </p>
        <ArticleTable
          headers={["差異", "美股常見情境", "台股版需要處理什麼"]}
          rows={[
            ["股票代號", "AAPL, MSFT, NVDA", "2330、2317、0050，並區分上市、上櫃、ETF"],
            ["市場別", "NYSE / NASDAQ", "TWSE、TPEX、興櫃與 ETF 商品"],
            ["籌碼資料", "可能使用 institutional holdings 或 sentiment", "三大法人買賣超、外資、投信、自營商"],
            ["財報資料", "SEC filings、quarterly reports", "月營收、季報、年報、公告日與公開資訊資料"],
            ["交易日曆", "US market calendar", "台灣國定假日、補班日、特殊休市"],
            ["ETF / 指數資料", "SPY、QQQ、S&P 500 constituents", "0050、台灣 50、ETF holdings、產業分類"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          如果你還在理解台股資料 API 的整體架構，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="taiwan-required-tools" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股版需要哪些資料工具？</h2>
        <p className="text-base leading-8 text-slate-700">台股 AI agent 需要的不是一個萬能工具，而是一組清楚定義的 API tools。每個 tool 對應一種資料能力。</p>
        <ArticleTable
          headers={["Tool", "資料來源", "給哪個 agent 使用", "主要用途"]}
          rows={[
            ["search_stocks", "股票基本資料", "所有 agents", "查股票代號、市場別、商品類型"],
            ["get_daily_ohlcv", "歷史股價", "Technicals Agent, Risk Manager", "報酬率、趨勢、波動率、回測"],
            ["get_financial_statements", "財報與基本面", "Fundamentals Agent", "EPS、ROE、現金流、基本面因子"],
            ["get_monthly_revenue", "月營收", "Fundamentals Agent", "營收成長與營運動能"],
            ["get_institutional_flows", "三大法人", "Institutional Flow Agent", "外資、投信、自營商買賣超"],
            ["get_technical_indicators", "OHLCV / indicators", "Technicals Agent", "均線、RSI、MACD、波動率"],
            ["get_etf_holdings", "ETF / 指數資料", "ETF / Universe Agent", "universe、成分股、sector exposure"],
            ["calculate_risk_metrics", "price, volume, portfolio", "Risk Manager", "波動率、最大回撤、流動性、部位限制"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          如果你要把 Python 串接資料工具做起來，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
            Python 抓台股資料教學
          </Link>
          。
        </p>
      </section>

      <section id="taiwan-multi-agent-architecture" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股 multi-agent 系統架構</h2>
        <p className="text-base leading-8 text-slate-700">一個台股版 multi-agent 股票分析系統，可以拆成資料層、tool layer、agent layer 和 decision layer。</p>
        <CodeBlock code={aiAgentArchitectureCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          重點是每一層都要可檢查。Agent 的回答應該能回溯到 data_used、tool parameters、timestamp 與 schema，而不是只產生自然語言結論。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要先補齊台股量化研究流程的基礎概念，可以先看
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          。
        </p>
      </section>

      <section id="fundamentals-agent" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Fundamentals Agent：財報與基本面資料</h2>
        <p className="text-base leading-8 text-slate-700">Fundamentals Agent 負責分析公司基本面，例如營收成長、EPS、ROE、毛利率、現金流與財務風險。台股版還應該特別處理月營收與公告日。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Fundamentals Agent input</h3>
          <CodeBlock code={fundamentalsAgentInputCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Fundamentals Agent output</h3>
          <CodeBlock code={fundamentalsAgentOutputCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          如果你要理解台股財報 API 與基本面因子，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-financial-statements-api" className="text-slate-900 underline underline-offset-4">
            台股財報 API 教學
          </Link>
          。
        </p>
      </section>

      <section id="technicals-agent" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Technicals Agent：OHLCV 與技術指標</h2>
        <p className="text-base leading-8 text-slate-700">Technicals Agent 負責分析價格、成交量、趨勢、動能與波動率。它不應該自己猜技術指標，而是透過 OHLCV 或 technical indicators API 取得資料。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Technicals Agent output</h3>
          <CodeBlock code={technicalsAgentOutputCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          技術指標資料管線可以參考
          {" "}
          <Link href="/blog/taiwan-stock-technical-indicators-api" className="text-slate-900 underline underline-offset-4">
            台股技術分析 API
          </Link>
          ；OHLCV 與 adjusted price 設計可再看
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
      </section>

      <section id="institutional-flow-agent" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Institutional Flow Agent：三大法人與籌碼資料</h2>
        <p className="text-base leading-8 text-slate-700">Institutional Flow Agent 是台股版 AI Hedge Fund 很重要的差異化 agent。它可以分析外資、投信、自營商買賣超，並把單日資料轉成 rolling features。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Institutional Flow Agent output</h3>
          <CodeBlock code={institutionalFlowAgentOutputCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          三大法人與籌碼資料可以參考
          {" "}
          <Link href="/blog/taiwan-institutional-investors-api" className="text-slate-900 underline underline-offset-4">
            三大法人買賣超 API
          </Link>
          。
        </p>
      </section>

      <section id="etf-universe-agent" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ETF / Universe Agent：ETF、指數與產業分類</h2>
        <p className="text-base leading-8 text-slate-700">ETF / Universe Agent 負責定義研究範圍，例如 0050 成分股、台灣 50 指數成分股、特定產業或流動性足夠的股票集合。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Universe Agent output</h3>
          <CodeBlock code={universeAgentOutputCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          ETF 與指數成分股資料可以參考
          {" "}
          <Link href="/blog/taiwan-etf-index-constituents-api" className="text-slate-900 underline underline-offset-4">
            台股 ETF 與指數成分股 API
          </Link>
          。
        </p>
      </section>

      <section id="risk-manager" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Risk Manager：流動性、波動率與部位限制</h2>
        <p className="text-base leading-8 text-slate-700">Risk Manager 不負責找股票，而是限制風險。它應該根據波動率、成交量、流動性、最大回撤、產業曝險與集中度，設定 position limits 或 risk flags。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Risk Manager output</h3>
          <CodeBlock code={riskManagerOutputCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          如果你要理解回測與風控如何設計，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
            Python 台股回測系統實作
          </Link>
          。
        </p>
      </section>

      <section id="portfolio-manager" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Portfolio Manager：整合信號，不直接保證交易結果</h2>
        <p className="text-base leading-8 text-slate-700">Portfolio Manager 的工作是整合不同 agent 的結果，而不是盲目接受任何單一 signal。它應該檢查每個 agent 的 confidence、data_used、risk_flags 和資料缺口。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Portfolio Manager output</h3>
          <CodeBlock code={portfolioManagerOutputCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          建議 Portfolio Manager 的預設輸出應該是 research summary，而不是直接產生下單指令。若要進入實際交易，必須有完整回測、風控、人為審核與合規流程。
        </p>
      </section>

      <section id="agent-tool-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Agent tool schema 設計</h2>
        <p className="text-base leading-8 text-slate-700">Agent tool schema 應該簡單、可驗證、可 audit。以下是台股 AI agent 可以使用的工具設計示意。</p>
        <CodeBlock code={aiToolSchemaOhlcvCode} language="json" />
        <CodeBlock code={aiToolSchemaFinancialsCode} language="json" />
        <CodeBlock code={aiToolSchemaFlowsCode} language="json" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 與 tool naming 不一定要和上方完全相同。重點是每個 tool 的輸入、輸出、資料來源和限制要清楚。實際路徑請以 TW Market Data docs 為準。
        </p>
      </section>

      <section id="agent-output-schema" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Agent output schema 設計</h2>
        <p className="text-base leading-8 text-slate-700">每個 agent 都應輸出結構化 JSON。不要只輸出自然語言，否則 risk manager 和 portfolio manager 很難自動檢查。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Recommended output fields</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["agent", "string", "agent 名稱"],
              ["symbol", "string", "股票代號"],
              ["signal", "string", "bullish、bearish、neutral 或 custom signal"],
              ["confidence", "number", "0 到 1 的信心分數"],
              ["data_used", "array", "使用了哪些資料"],
              ["summary", "string", "簡短摘要"],
              ["risk_flags", "array", "風險標記或資料缺口"],
              ["not_investment_advice", "boolean", "明確標示不是投資建議"],
            ]}
          />
        </div>
      </section>

      <section id="avoid-hallucination" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何避免 hallucination？</h2>
        <p className="text-base leading-8 text-slate-700">
          金融 AI agent 最重要的問題之一是 hallucination。避免 hallucination 的方法不是要求模型不要亂說，而是設計資料與工具流程。
        </p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>Agent 只能透過 tool 查詢最新或指定日期資料</li>
          <li>回答必須列出 data_used</li>
          <li>回答必須列出資料時間區間</li>
          <li>回答必須標示 missing data</li>
          <li>不允許 agent 自己猜股價、財報或法人買賣超</li>
          <li>不允許沒有資料來源的 buy / sell recommendation</li>
          <li>所有 signal 必須可回測</li>
          <li>portfolio decision 必須通過 risk manager</li>
          <li>實際下單前必須有人為審核與合規檢查</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">AI agent 的可靠性來自資料邊界與工具設計，而不是來自模型自信的語氣。</p>
      </section>

      <section id="research-to-production" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">從 research workflow 到 production workflow</h2>
        <p className="text-base leading-8 text-slate-700">台股 AI agent workflow 可以先從 research assistant 開始，而不是一開始就做自動交易。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Research workflow</h3>
          <CodeBlock code={aiResearchWorkflowCode} language="text" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Production workflow</h3>
          <p className="text-base leading-8 text-slate-700">如果要往 production 推進，需要增加：</p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>API rate limit handling</li>
            <li>cache</li>
            <li>audit log</li>
            <li>data validation</li>
            <li>backtesting</li>
            <li>risk rules</li>
            <li>human approval</li>
            <li>compliance review</li>
            <li>monitoring</li>
            <li>rollback mechanism</li>
          </ul>
        </div>
        <p className="text-base leading-8 text-slate-700">
          這也是為什麼台股 AI agent workflow 的核心不是 LLM 本身，而是資料 API、工具邊界、風控流程與可追蹤紀錄。
        </p>
      </section>

      <section id="ai-agent-endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是支援台股 AI agent workflow 的 endpoint 設計示意。</p>
        <CodeBlock code={aiEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">
          實際 endpoint 命名不一定要完全相同。重點是資料 schema 穩定、文件清楚、更新時間明確，並能被 AI agent tool calling 安全使用。實際路徑請以 TW Market Data docs 為準。
        </p>
        <p className="text-base leading-8 text-slate-700">
          如果你要從 multi-agent 架構進一步落到 tool calling 實作流程，可以接著看
          {" "}
          <Link href="/blog/taiwan-stock-ai-agent-workflow" className="text-slate-900 underline underline-offset-4">
            台股 AI Agent Workflow
          </Link>
          。
        </p>
      </section>
    </>
  );
}

function TaiwanStockAiAgentWorkflowContent() {
  const searchStocksToolSchemaCode = `{
  "name": "search_stocks",
  "description": "Search Taiwan stocks, ETFs, and listed instruments by symbol or name.",
  "parameters": {
    "query": "台積電",
    "market": "twse",
    "instrument_type": "stock"
  }
}`;

  const searchStocksToolResponseCode = `{
  "data": [
    {
      "symbol": "2330",
      "name": "台積電",
      "market": "twse",
      "instrument_type": "stock",
      "currency": "TWD",
      "is_active": true
    }
  ],
  "meta": {
    "source": "tw-market-data"
  }
}`;

  const ohlcvToolSchemaCode = `{
  "name": "get_daily_ohlcv",
  "description": "Get daily OHLCV data for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "adjusted": true
  }
}`;

  const ohlcvToolResponseCode = `{
  "data": [
    {
      "date": "2025-01-02",
      "symbol": "2330",
      "open": 1000,
      "high": 1010,
      "low": 995,
      "close": 1005,
      "volume": 25000000,
      "turnover": 25200000000
    }
  ],
  "meta": {
    "adjusted": true,
    "timezone": "Asia/Taipei",
    "currency": "TWD"
  }
}`;

  const financialStatementsToolSchemaCode = `{
  "name": "get_financial_statements",
  "description": "Get financial statements for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "statement": "income_statement",
    "from": "2024Q1",
    "to": "2025Q4"
  }
}`;

  const financialStatementsToolResponseCode = `{
  "data": [
    {
      "symbol": "2330",
      "period": "2025Q4",
      "announcement_date": "2026-03-15",
      "revenue": 625000000,
      "gross_profit": 330000000,
      "operating_income": 285000000,
      "net_income": 238000000,
      "eps": 9.21,
      "currency": "TWD",
      "unit": "thousand"
    }
  ],
  "meta": {
    "statement": "income_statement",
    "version": "latest"
  }
}`;

  const institutionalFlowsToolSchemaCode = `{
  "name": "get_institutional_flows",
  "description": "Get institutional investor buy/sell flows for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "unit": "shares",
    "format": "wide"
  }
}`;

  const institutionalFlowsToolResponseCode = `{
  "data": [
    {
      "date": "2025-01-02",
      "symbol": "2330",
      "foreign_net_buy": 2700000,
      "investment_trust_net_buy": 440000,
      "dealer_net_buy": -90000,
      "total_institutional_net_buy": 3050000,
      "unit": "shares"
    }
  ],
  "meta": {
    "timezone": "Asia/Taipei",
    "unit": "shares"
  }
}`;

  const technicalIndicatorsToolSchemaCode = `{
  "name": "get_technical_indicators",
  "description": "Get technical indicators for a Taiwan stock.",
  "parameters": {
    "symbol": "2330",
    "from": "2025-01-01",
    "to": "2025-12-31",
    "adjusted": true,
    "indicators": [
      {
        "name": "sma",
        "window": 20
      },
      {
        "name": "rsi",
        "window": 14
      },
      {
        "name": "macd",
        "fast_window": 12,
        "slow_window": 26,
        "signal_window": 9
      }
    ]
  }
}`;

  const etfHoldingsToolSchemaCode = `{
  "name": "get_etf_holdings",
  "description": "Get ETF holdings for a Taiwan ETF.",
  "parameters": {
    "etf_symbol": "0050",
    "as_of": "2026-04-24"
  }
}`;

  const etfHoldingsToolResponseCode = `{
  "data": [
    {
      "etf_symbol": "0050",
      "as_of_date": "2026-04-24",
      "holding_symbol": "2330",
      "holding_name": "台積電",
      "weight": 0.61,
      "sector": "Semiconductors"
    }
  ],
  "meta": {
    "data_type": "etf_holdings"
  }
}`;

  const riskMetricsToolSchemaCode = `{
  "name": "calculate_risk_metrics",
  "description": "Calculate risk metrics for a Taiwan stock or portfolio.",
  "parameters": {
    "symbols": [
      "2330"
    ],
    "from": "2025-01-01",
    "to": "2025-12-31",
    "metrics": [
      "volatility",
      "max_drawdown",
      "average_turnover",
      "liquidity"
    ]
  }
}`;

  const riskMetricsToolResponseCode = `{
  "data": {
    "symbol": "2330",
    "annualized_volatility": 0.22,
    "max_drawdown": -0.18,
    "average_turnover": 0.04,
    "liquidity_score": 0.91
  },
  "risk_flags": [
    "requires_position_limit",
    "single_asset_analysis"
  ]
}`;

  const agentResponseSchemaCode = `{
  "symbol": "2330",
  "analysis_type": "stock_research",
  "final_signal": "neutral",
  "confidence": 0.61,
  "summary": "Fundamentals are stable and technical indicators are moderately positive, but risk checks and updated financial data are required.",
  "data_used": [
    "daily_ohlcv",
    "financial_statements",
    "institutional_flows",
    "technical_indicators",
    "risk_metrics"
  ],
  "date_range": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  },
  "missing_data": [
    "latest_monthly_revenue"
  ],
  "risk_flags": [
    "not_a_standalone_trading_signal",
    "requires_backtesting",
    "requires_human_review"
  ],
  "not_investment_advice": true
}`;

  const aiAgentWorkflowExampleCode = `User:
"請分析 2330 最近的基本面、技術面與法人籌碼。"

Agent plan:
1. search_stocks("2330")
2. get_daily_ohlcv(symbol="2330", from="2025-01-01", to="2025-12-31", adjusted=true)
3. get_financial_statements(symbol="2330", statement="income_statement", from="2024Q1", to="2025Q4")
4. get_institutional_flows(symbol="2330", from="2025-01-01", to="2025-12-31", unit="shares")
5. get_technical_indicators(symbol="2330", indicators=["sma20", "rsi14", "macd"])
6. calculate_risk_metrics(symbols=["2330"], from="2025-01-01", to="2025-12-31")
7. generate structured response with data_used and risk_flags`;

  const aiWorkflowEndpointDesignCode = `GET /v1/tw/stocks/search
GET /v1/tw/stocks/{symbol}/profile
GET /v1/tw/stocks/{symbol}/ohlcv
GET /v1/tw/stocks/{symbol}/financials
GET /v1/tw/stocks/{symbol}/monthly-revenue
GET /v1/tw/stocks/{symbol}/institutional-flows
GET /v1/tw/stocks/{symbol}/technical-indicators
GET /v1/tw/etfs/{symbol}/holdings
GET /v1/tw/indices/{index_code}/constituents
GET /v1/tw/calendar/trading-days`;

  return (
    <>
      <section id="why-ai-agent-needs-api" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼台股 AI agent 需要資料 API？</h2>
        <p className="text-base leading-8 text-slate-700">
          AI agent 要分析股票，首先需要可信資料。語言模型本身不適合作為金融資料來源，因為它可能不知道最新股價、最新財報、最新法人買賣超，也可能在沒有資料來源時產生看似合理但錯誤的回答。
        </p>
        <p className="text-base leading-8 text-slate-700">台股 AI agent 需要資料 API 的原因包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>查詢最新或指定日期的行情資料</li>
          <li>取得歷史 OHLCV 做技術指標或回測</li>
          <li>取得財報、月營收與基本面資料</li>
          <li>取得三大法人買賣超與籌碼資料</li>
          <li>取得 ETF holdings 與 index constituents</li>
          <li>取得交易日曆，避免日期對齊錯誤</li>
          <li>計算風險指標，例如波動率、最大回撤與流動性</li>
          <li>在回答中標示 data_used 與資料時間區間</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          如果你還在理解台股 API 的整體資料分類，可以先看
          {" "}
          <Link href="/blog/taiwan-stock-api-guide" className="text-slate-900 underline underline-offset-4">
            台股 API 完整指南
          </Link>
          。
        </p>
      </section>

      <section id="llm-cannot-guess-financial-data" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">LLM 不能直接猜金融資料</h2>
        <p className="text-base leading-8 text-slate-700">
          LLM 可以協助整理、推理、比較與產生摘要，但不應該直接作為股價、財報或法人籌碼資料來源。金融資料通常具有時間敏感性與高精度需求，錯一個日期、單位或欄位都可能導致錯誤結論。
        </p>
        <p className="text-base leading-8 text-slate-700">常見錯誤包括：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>模型猜測股價或成交量</li>
          <li>使用過期財報資料</li>
          <li>把報表期誤認為公告日</li>
          <li>把外資、投信、自營商口徑混在一起</li>
          <li>把 ETF holdings 和 index constituents 混用</li>
          <li>忘記價格是否 adjusted</li>
          <li>沒有標示資料缺口</li>
          <li>直接產生 buy / sell 建議</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">較好的做法是：LLM 只能透過明確工具查資料，並且在每次回答中列出使用了哪些資料。</p>
      </section>

      <section id="core-tools" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">台股 AI agent 的基本工具</h2>
        <p className="text-base leading-8 text-slate-700">一個台股 AI agent workflow 可以從幾個基本工具開始。這些工具不需要一開始就很複雜，但 schema 必須穩定。</p>
        <ArticleTable
          headers={["Tool", "功能", "主要資料", "常見使用者"]}
          rows={[
            ["search_stocks", "查股票代號、名稱、市場別", "股票基本資料", "所有 agents"],
            ["get_daily_ohlcv", "查歷史股價與成交量", "OHLCV", "Technicals Agent, Risk Manager"],
            ["get_financial_statements", "查財報與基本面資料", "損益表、資產負債表、現金流量表", "Fundamentals Agent"],
            ["get_monthly_revenue", "查月營收", "月營收、年增率、月增率", "Fundamentals Agent"],
            ["get_institutional_flows", "查三大法人買賣超", "外資、投信、自營商", "Institutional Flow Agent"],
            ["get_technical_indicators", "查技術指標", "SMA、RSI、MACD、ATR", "Technicals Agent"],
            ["get_etf_holdings", "查 ETF holdings 或 index constituents", "成分股、權重、產業分類", "Universe Agent"],
            ["calculate_risk_metrics", "計算風險指標", "報酬率、波動率、成交量", "Risk Manager"],
          ]}
        />
        <p className="text-base leading-8 text-slate-700">
          如果你要先了解 multi-agent 架構，可以參考
          {" "}
          <Link href="/blog/ai-hedge-fund-taiwan-stocks" className="text-slate-900 underline underline-offset-4">
            AI Hedge Fund 台股版
          </Link>
          。若要從 Python 端開始串接資料，建議先看
          {" "}
          <Link href="/blog/python-taiwan-stock-data-api" className="text-slate-900 underline underline-offset-4">
            Python 抓台股資料教學
          </Link>
          。
        </p>
      </section>

      <section id="tool-calling-schema-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Tool calling schema 設計</h2>
        <p className="text-base leading-8 text-slate-700">Tool schema 要讓 agent 清楚知道工具可以做什麼、需要哪些參數、會回傳什麼資料，以及有哪些限制。以下是基本設計原則：</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>工具名稱要清楚，例如 get_daily_ohlcv</li>
          <li>parameters 要明確，例如 symbol、from、to、adjusted</li>
          <li>回傳資料要有 data 和 meta</li>
          <li>meta 要標示 timezone、currency、unit、adjusted、source</li>
          <li>錯誤訊息要可讀</li>
          <li>缺資料要明確標示</li>
          <li>不要讓工具同時做太多事</li>
          <li>不要讓資料查詢 tool 直接產生投資建議</li>
        </ul>
      </section>

      <section id="search-stocks-tool" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">股票查詢 tool：search_stocks</h2>
        <p className="text-base leading-8 text-slate-700">Agent 第一步通常是確認使用者輸入的是哪個股票、ETF 或商品。台股有上市、上櫃、ETF 和指數，不能只用一個字串模糊處理。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={searchStocksToolSchemaCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool response</h3>
          <CodeBlock code={searchStocksToolResponseCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">這個 tool 的工作只是確認標的，不應該在這一步產生任何買賣分析。上方 endpoint 與 schema 是示意，實際路徑請以 TW Market Data docs 為準。</p>
      </section>

      <section id="daily-ohlcv-tool" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">行情與 OHLCV tool：get_daily_ohlcv</h2>
        <p className="text-base leading-8 text-slate-700">OHLCV 是技術分析、風控與回測的基礎。Agent 查詢 OHLCV 時，應該明確要求時間區間與 adjusted price 狀態。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={ohlcvToolSchemaCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool response</h3>
          <CodeBlock code={ohlcvToolResponseCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          如果你要理解 OHLCV、K 線與 adjusted price，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-historical-price-api" className="text-slate-900 underline underline-offset-4">
            台股歷史股價 API 設計
          </Link>
          。
        </p>
      </section>

      <section id="financial-statements-tool" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">財報 tool：get_financial_statements</h2>
        <p className="text-base leading-8 text-slate-700">財報 tool 應該讓 agent 查詢損益表、資產負債表、現金流量表與財務比率。最重要的是回傳 announcement_date，避免 agent 在回測或研究中使用尚未公開的資料。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={financialStatementsToolSchemaCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool response</h3>
          <CodeBlock code={financialStatementsToolResponseCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          如果你要理解財報資料、公告日與基本面因子，可以參考
          {" "}
          <Link href="/blog/taiwan-stock-financial-statements-api" className="text-slate-900 underline underline-offset-4">
            台股財報 API 教學
          </Link>
          。
        </p>
      </section>

      <section id="institutional-flows-tool" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">三大法人 tool：get_institutional_flows</h2>
        <p className="text-base leading-8 text-slate-700">三大法人資料是台股 AI agent 的差異化資料層。Agent 可以用它觀察外資、投信、自營商的買賣超變化，但不能把單日買超直接等同於交易訊號。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={institutionalFlowsToolSchemaCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool response</h3>
          <CodeBlock code={institutionalFlowsToolResponseCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          三大法人買賣超資料可以參考
          {" "}
          <Link href="/blog/taiwan-institutional-investors-api" className="text-slate-900 underline underline-offset-4">
            三大法人買賣超 API
          </Link>
          。
        </p>
      </section>

      <section id="technical-indicators-tool" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">技術指標 tool：get_technical_indicators</h2>
        <p className="text-base leading-8 text-slate-700">技術指標 tool 可以讓 agent 查詢 SMA、RSI、MACD、布林通道與 ATR。Agent 不應該自己猜指標值，也不應該只因為單一指標就產生買賣建議。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={technicalIndicatorsToolSchemaCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          技術指標資料管線可以參考
          {" "}
          <Link href="/blog/taiwan-stock-technical-indicators-api" className="text-slate-900 underline underline-offset-4">
            台股技術分析 API
          </Link>
          。
        </p>
      </section>

      <section id="etf-holdings-tool" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ETF / universe tool：get_etf_holdings</h2>
        <p className="text-base leading-8 text-slate-700">Agent 需要知道分析範圍。例如使用者可能問 0050 成分股最近的基本面變化，這時 agent 應該先查 ETF holdings，再逐一查財報或行情。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={etfHoldingsToolSchemaCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool response</h3>
          <CodeBlock code={etfHoldingsToolResponseCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          ETF 與指數成分股資料可以參考
          {" "}
          <Link href="/blog/taiwan-etf-index-constituents-api" className="text-slate-900 underline underline-offset-4">
            台股 ETF 與指數成分股 API
          </Link>
          。
        </p>
      </section>

      <section id="risk-metrics-tool" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">風控 tool：calculate_risk_metrics</h2>
        <p className="text-base leading-8 text-slate-700">風控 tool 應該和研究 tool 分開。它的工作不是產生 bullish 或 bearish，而是檢查波動率、最大回撤、流動性、集中度與交易限制。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool schema</h3>
          <CodeBlock code={riskMetricsToolSchemaCode} language="json" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Tool response</h3>
          <CodeBlock code={riskMetricsToolResponseCode} language="json" />
        </div>
        <p className="text-base leading-8 text-slate-700">
          如果你要理解回測與風控，可以參考
          {" "}
          <Link href="/blog/python-taiwan-stock-backtesting" className="text-slate-900 underline underline-offset-4">
            Python 台股回測系統實作
          </Link>
          ，並搭配
          {" "}
          <Link href="/blog/taiwan-quant-trading-guide" className="text-slate-900 underline underline-offset-4">
            台股量化交易入門
          </Link>
          建立完整研究流程。
        </p>
      </section>

      <section id="agent-response-schema" className="space-y-5 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Agent response schema</h2>
        <p className="text-base leading-8 text-slate-700">Agent 的最終輸出應該是可檢查的 structured JSON，而不是單純一段自然語言。這樣 dashboard、risk manager 或 human reviewer 才能追蹤資料來源與風險。</p>
        <CodeBlock code={agentResponseSchemaCode} language="json" />
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Recommended fields</h3>
          <ArticleTable
            headers={["Field", "Type", "Description"]}
            rows={[
              ["symbol", "string", "股票代號"],
              ["analysis_type", "string", "分析類型，例如 stock_research"],
              ["final_signal", "string", "bullish、bearish、neutral 或 custom signal"],
              ["confidence", "number", "0 到 1 的信心分數"],
              ["data_used", "array", "使用了哪些資料"],
              ["missing_data", "array", "缺少哪些資料"],
              ["risk_flags", "array", "風險標記"],
              ["not_investment_advice", "boolean", "明確標示不是投資建議"],
            ]}
          />
        </div>
      </section>

      <section id="end-to-end-workflow-example" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">一個完整台股 AI agent workflow 範例</h2>
        <p className="text-base leading-8 text-slate-700">以下是一個研究型 workflow，示範 agent 如何分析一檔股票。</p>
        <CodeBlock code={aiAgentWorkflowExampleCode} language="text" />
        <p className="text-base leading-8 text-slate-700">這種 workflow 的重點是每一步都能被 audit。若某個 tool 沒有資料，agent 應該標示 missing_data，而不是自行補上答案。</p>
      </section>

      <section id="hallucination-control" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">如何降低 hallucination？</h2>
        <p className="text-base leading-8 text-slate-700">降低 hallucination 的方法不是只靠 prompt，而是靠資料邊界與 workflow 設計。</p>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>所有金融數字都必須來自 API tool</li>
          <li>Agent 回答必須包含 data_used</li>
          <li>Agent 回答必須標示時間區間</li>
          <li>Agent 必須標示 missing_data</li>
          <li>不允許沒有資料來源的 buy / sell 結論</li>
          <li>不允許把單一指標直接變成交易建議</li>
          <li>不允許用最新資料回推過去回測</li>
          <li>不允許 agent 未經風控直接下單</li>
          <li>所有 signal 應可回測</li>
          <li>所有 response 應可被 audit</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">AI agent 的可靠性來自資料、schema、工具邊界與風控，而不是來自回答語氣。</p>
      </section>

      <section id="research-to-production-workflow" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">從 research assistant 到 production workflow</h2>
        <p className="text-base leading-8 text-slate-700">台股 AI agent 可以先從 research assistant 做起，而不是一開始就做自動交易。這樣可以先驗證資料品質、tool schema、response format 與風險流程。</p>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Research assistant</h3>
          <p className="text-base leading-8 text-slate-700">Research assistant 的任務包括：</p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>查詢股票資料</li>
            <li>摘要財報</li>
            <li>比較三大法人買賣超</li>
            <li>整理技術指標</li>
            <li>產生風險檢查清單</li>
            <li>輸出 dashboard summary</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Production workflow</h3>
          <p className="text-base leading-8 text-slate-700">Production workflow 需要更多控制：</p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
            <li>authentication</li>
            <li>rate limit handling</li>
            <li>cache</li>
            <li>data validation</li>
            <li>retry</li>
            <li>audit log</li>
            <li>monitoring</li>
            <li>backtesting</li>
            <li>risk manager</li>
            <li>human approval</li>
            <li>compliance review</li>
          </ul>
        </div>
        <p className="text-base leading-8 text-slate-700">對金融資料產品來說，AI agent 不是獨立存在的功能，而是建立在穩定 API、schema、文件與風控流程之上的 workflow。</p>
      </section>

      <section id="ai-agent-endpoint-design" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">建議的 API endpoint 設計</h2>
        <p className="text-base leading-8 text-slate-700">以下是支援台股 AI agent workflow 的 endpoint 設計示意。</p>
        <CodeBlock code={aiWorkflowEndpointDesignCode} language="text" />
        <p className="text-base leading-8 text-slate-700">實際 endpoint 命名不一定要完全相同。重點是 response schema 穩定、metadata 清楚、錯誤處理一致，並且能被 agent tool calling 安全使用。實際路徑請以 TW Market Data docs 為準。</p>
      </section>
    </>
  );
}

const taiwanStockApiFaq: BlogFaqItem[] = [
  {
    question: "台股 API 可以取得即時股價嗎？",
    answer:
      "可以，但即時行情通常牽涉資料授權、連線方式、latency 與使用情境。若只是做回測、每日研究或 AI agent 盤後分析，盤後資料或歷史資料通常更適合，也更容易維護。",
  },
  {
    question: "Python 可以用台股 API 抓資料嗎？",
    answer:
      "可以。大多數 HTTP API 都可以用 Python 的 requests 套件呼叫，再用 pandas 轉成 DataFrame。對量化交易來說，Python 是很常見的研究與回測工具。",
  },
  {
    question: "台股 API 和爬蟲有什麼差別？",
    answer:
      "爬蟲通常依賴網頁結構，當頁面改版時容易失效。API 則應該提供穩定 endpoint、文件、欄位定義、錯誤碼和 rate limit，較適合 production workflow。",
  },
  {
    question: "台股量化交易最少需要哪些資料？",
    answer:
      "最少需要股票清單、交易日曆、歷史 OHLCV、成交量、交易成本假設和除權息處理。若要建立更完整的策略，還會需要財報、月營收、法人買賣超、ETF 成分股或產業分類資料。",
  },
  {
    question: "AI agent 可以直接用台股 API 下單嗎？",
    answer:
      "台股資料 API 本身通常負責提供市場資料，不負責下單。AI agent 可以使用資料 API 做研究、整理、比較和產生訊號，但實際交易需要券商下單 API、風控、人為審核與合規設計。",
  },
  {
    question: "上市和上櫃資料可以用同一個 API 查嗎？",
    answer:
      "可以，但 API schema 應該清楚標示 market，例如 twse 或 tpex。這樣使用者可以用同一套工具查詢資料，同時保留市場別差異，避免後續回測或資料分析出錯。",
  },
];

const pythonTaiwanStockDataFaq: BlogFaqItem[] = [
  {
    question: "Python 可以抓台股資料嗎？",
    answer:
      "可以。Python 可以透過 requests 呼叫台股 API，再用 pandas 把 JSON response 轉成 DataFrame。這是量化研究、資料分析、dashboard 和 AI agent workflow 常見的做法。",
  },
  {
    question: "用 API 抓台股資料和爬蟲有什麼差別？",
    answer:
      "爬蟲依賴網頁結構，頁面改版時容易失效。API 則應該提供穩定 endpoint、schema、錯誤碼、rate limit 與文件，較適合 production workflow。",
  },
  {
    question: "OHLCV 是什麼？",
    answer:
      "OHLCV 是 open、high、low、close、volume 的縮寫，分別代表開盤價、最高價、最低價、收盤價與成交量。它是歷史股價分析和回測最常用的基礎資料。",
  },
  {
    question: "Python 抓台股資料需要 pandas 嗎？",
    answer:
      "不是必要，但 pandas 很適合處理表格型金融資料。你可以用 pandas 做日期排序、缺值處理、報酬率計算、rolling window 指標與資料匯出。",
  },
  {
    question: "台股 API 可以一次查多檔股票嗎？",
    answer:
      "取決於 API 是否支援 batch endpoint。若支援，應優先使用批次查詢。若不支援，也可以逐檔呼叫，但要注意 rate limit、retry、cache 和錯誤處理。",
  },
  {
    question: "用 Python 抓到台股資料後可以直接做交易嗎？",
    answer:
      "不建議。抓到資料只是研究流程的第一步。實際交易前還需要完整回測、交易成本、滑價、風險控管、券商下單 API、人為審核與合規設計。",
  },
];

const taiwanStockHistoricalPriceFaq: BlogFaqItem[] = [
  {
    question: "台股歷史股價 API 可以取得哪些資料？",
    answer:
      "通常至少會包含 OHLCV，也就是開盤價、最高價、最低價、收盤價與成交量。更完整的 API 還會包含成交金額、市場別、幣別、交易日曆、除權息資料與調整後價格。",
  },
  {
    question: "OHLCV 和 K 線是一樣的嗎？",
    answer:
      "OHLCV 是 K 線資料的核心欄位。日 K、週 K、月 K 通常都是用 open、high、low、close、volume 組成，只是資料聚合的時間區間不同。",
  },
  {
    question: "回測一定要用調整後收盤價嗎？",
    answer:
      "長期回測通常應該使用調整後價格，避免除權息或 corporate actions 造成報酬率失真。但如果研究的是實際成交價格或短期盤中行為，也可能需要使用未調整價格。重點是 API 必須清楚標示價格是否已調整。",
  },
  {
    question: "台股歷史股價 API 需要交易日曆嗎？",
    answer:
      "需要。交易日曆可以幫助回測系統區分交易日、非交易日、休市日與特殊情況，避免日期對齊錯誤。",
  },
  {
    question: "歷史股價資料可以直接拿來做量化交易嗎？",
    answer:
      "歷史股價資料是量化研究的基礎，但不能直接等同於可交易策略。正式策略還需要交易成本、滑價、風險控管、out-of-sample 測試與完整的回測流程。",
  },
  {
    question: "AI agent 可以用歷史股價 API 分析股票嗎？",
    answer:
      "可以。AI agent 可以透過 tool calling 查詢歷史 OHLCV、技術指標或風險指標，再產生結構化摘要。但 agent 不應該直接猜測資料，也不應該把分析結果當成投資建議。",
  },
];

const taiwanQuantTradingGuideFaq: BlogFaqItem[] = [
  {
    question: "台股量化交易需要即時資料嗎？",
    answer:
      "不一定。很多中低頻量化策略只需要盤後資料、歷史股價、交易日曆、財報與籌碼資料。即時資料適合看盤工具、intraday dashboard 或對 latency 敏感的策略，但不是所有量化研究都需要。",
  },
  {
    question: "Python 適合做台股量化交易嗎？",
    answer:
      "適合。Python 有 pandas、numpy、scipy、statsmodels、backtesting tools 等資料分析工具，很適合做台股資料處理、策略研究和回測。但 production 系統仍需要考慮資料更新、錯誤處理、排程、監控與風控。",
  },
  {
    question: "台股量化交易最少需要哪些資料？",
    answer:
      "最少需要股票清單、交易日曆、歷史 OHLCV、成交量、交易成本假設與除權息處理。若要做更完整的策略，還會需要財報、月營收、法人買賣超、ETF 成分股與產業分類資料。",
  },
  {
    question: "回測績效好代表策略可以直接交易嗎？",
    answer:
      "不代表。回測只是研究流程的一部分。正式使用前還需要檢查交易成本、滑價、流動性、out-of-sample 表現、資料偏誤、風險限制與實際執行條件。",
  },
  {
    question: "台股量化交易和程式交易一樣嗎？",
    answer:
      "不完全一樣。量化交易偏重資料、模型、策略研究與風控；程式交易通常強調自動化下單與執行。量化策略可以手動執行，也可以接到程式交易系統，但兩者不是同一件事。",
  },
  {
    question: "AI agent 可以做台股量化交易嗎？",
    answer:
      "AI agent 可以協助查詢資料、整理研究、摘要回測結果與檢查風險，但不應該未經回測、風控與人為審核就直接下單。金融資料必須由可信 API 提供，不能靠語言模型猜測。",
  },
];

const pythonTaiwanStockBacktestingFaq: BlogFaqItem[] = [
  {
    question: "Python 可以做台股回測嗎？",
    answer:
      "可以。Python 適合用來處理台股 OHLCV、計算策略訊號、建立持倉、模擬交易成本、計算資金曲線與績效指標。常見工具包含 pandas、numpy，以及各種 backtesting framework。",
  },
  {
    question: "台股回測最少需要哪些資料？",
    answer:
      "最少需要股票代號、交易日曆、歷史 OHLCV、成交量、成交金額與交易成本假設。若要做長期回測，還需要除權息或 adjusted price。若要做多股票策略，還需要 universe、產業分類與流動性資料。",
  },
  {
    question: "回測一定要加入交易成本嗎？",
    answer:
      "應該加入。沒有交易成本的回測通常會高估策略績效。至少要考慮手續費、交易稅、滑價與成交量限制。高換手策略尤其容易受到交易成本影響。",
  },
  {
    question: "滑價是什麼？",
    answer:
      "滑價是理論成交價和實際成交價之間的差距。當股票流動性不足、買賣價差較大或交易量相對市場成交量過高時，滑價可能顯著影響策略結果。",
  },
  {
    question: "Sharpe ratio 越高越好嗎？",
    answer:
      "Sharpe ratio 是風險調整後報酬的常見指標，但不能單獨判斷策略好壞。還需要同時檢查最大回撤、交易次數、換手率、流動性、穩定性與 out-of-sample 表現。",
  },
  {
    question: "回測績效好可以直接交易嗎？",
    answer:
      "不建議。回測只是研究流程的一部分。正式交易前還需要檢查資料偏誤、交易成本、滑價、流動性、風險限制、out-of-sample test、券商下單流程與合規要求。",
  },
];

const taiwanStockFinancialStatementsFaq: BlogFaqItem[] = [
  {
    question: "台股財報 API 可以取得哪些資料？",
    answer:
      "台股財報 API 通常可以支援月營收、損益表、資產負債表、現金流量表、EPS、ROE、毛利率、營業利益率、自由現金流與其他財務比率。實際支援項目取決於 API 供應商。",
  },
  {
    question: "月營收和財報有什麼差別？",
    answer:
      "月營收是每月公布的營收資料，適合追蹤營運動能。財報通常包含損益表、資產負債表和現金流量表，資料更完整，但更新頻率較低。",
  },
  {
    question: "為什麼公告日對回測很重要？",
    answer:
      "因為回測只能使用當時市場已經知道的資料。如果策略在回測中使用尚未公告的財報，就會產生 look-ahead bias，讓績效看起來比真實情況更好。",
  },
  {
    question: "EPS 和 ROE 可以直接拿來選股嗎？",
    answer:
      "EPS 和 ROE 可以作為基本面因子的一部分，但不應單獨使用。通常還需要搭配產業比較、估值、現金流、財務風險、股價資料與回測驗證。",
  },
  {
    question: "AI agent 可以用財報 API 分析股票嗎？",
    answer:
      "可以。AI agent 可以透過 tool calling 查詢財報 API，整理營收、EPS、ROE、現金流與風險標記。但 agent 不應該自己猜財報數字，也不應把分析結果當成投資建議。",
  },
  {
    question: "財報 API 和股價 API 哪個比較重要？",
    answer:
      "兩者用途不同。股價 API 適合行情、技術分析與回測；財報 API 適合基本面研究、估值、因子模型和 AI research assistant。完整的 financial data workflow 通常需要兩者。",
  },
];

const taiwanInstitutionalInvestorsFaq: BlogFaqItem[] = [
  {
    question: "三大法人買賣超 API 可以取得哪些資料？",
    answer:
      "通常可以取得外資、投信、自營商的買進、賣出、買賣超資料。更完整的 API 會提供市場別、股票代號、日期、單位、三大法人合計、自營商細分與資料更新時間。",
  },
  {
    question: "三大法人買超代表股價一定會上漲嗎？",
    answer:
      "不代表。法人買賣超是籌碼資料，可以作為研究或因子的一部分，但不能單獨視為買賣建議。仍需要搭配股價、成交量、基本面、風險控管與回測驗證。",
  },
  {
    question: "外資、投信、自營商資料可以直接加總嗎？",
    answer:
      "可以建立三大法人合計欄位，但要先確認單位一致，並理解不同法人類別的行為含義不同。部分資料來源也會對自營商或外資自營商有不同口徑，API 應以 metadata 清楚說明。",
  },
  {
    question: "三大法人資料適合做量化因子嗎？",
    answer:
      "適合，但通常需要轉成 rolling features 或 normalized features，例如連續買超天數、近 5 日買賣超、買賣超佔成交量比重或 rolling z-score。因子是否有效仍需要回測。",
  },
  {
    question: "Python 可以抓三大法人買賣超資料嗎？",
    answer:
      "可以。Python 可以透過 requests 呼叫三大法人 API，再用 pandas 轉成 DataFrame，計算 rolling sum、z-score、成交量比例，並接進回測或 dashboard。",
  },
  {
    question: "AI agent 可以用法人籌碼資料分析股票嗎？",
    answer:
      "可以。AI agent 可以透過 tool calling 查詢三大法人資料，摘要外資、投信、自營商近期買賣超變化，並標記風險。但 agent 不應該自己猜資料，也不應把分析結果當成投資建議。",
  },
];

const taiwanStockTechnicalIndicatorsFaq: BlogFaqItem[] = [
  {
    question: "台股技術分析 API 可以取得哪些指標？",
    answer:
      "常見技術分析 API 可以提供均線、RSI、MACD、布林通道、ATR、成交量均線、報酬率與波動率等指標。實際支援項目取決於 API 供應商。",
  },
  {
    question: "技術指標應該由 API 計算還是自己用 Python 計算？",
    answer:
      "兩種方式都可以。API 預先計算適合 dashboard 和 AI agent workflow；Python 自行計算適合量化研究和策略回測。關鍵是公式、window、資料來源與 adjusted price 狀態要清楚。",
  },
  {
    question: "RSI、MACD 可以直接當成買賣訊號嗎？",
    answer:
      "不建議直接使用單一技術指標作為買賣依據。技術指標可以作為 signal 的一部分，但仍需要回測、交易成本、滑價、風控與 out-of-sample 驗證。",
  },
  {
    question: "技術分析 API 需要 adjusted price 嗎？",
    answer:
      "長期技術分析與回測通常需要 adjusted price，避免除權息或 corporate actions 造成指標失真。但若研究實際市場成交價格，也可能需要未調整價格。API 應清楚標示 adjusted 狀態。",
  },
  {
    question: "Python 可以計算台股技術指標嗎？",
    answer:
      "可以。Python 可以用 pandas 從 OHLCV 計算均線、RSI、MACD、布林通道與其他指標，再接進回測系統或 dashboard。",
  },
  {
    question: "AI agent 可以用技術分析資料分析股票嗎？",
    answer:
      "可以。AI agent 可以透過 tool calling 查詢 OHLCV 或技術指標，再產生結構化摘要與風險標記。但 agent 不應該自己猜指標值，也不應把技術分析結果當成投資建議。",
  },
];

const taiwanEtfIndexConstituentsFaq: BlogFaqItem[] = [
  {
    question: "台股 ETF API 可以取得哪些資料？",
    answer:
      "台股 ETF API 通常可以取得 ETF 基本資料、持股明細、權重、淨值、折溢價、配息、交易資料與歷史 holdings。實際支援項目取決於 API 供應商與資料授權。",
  },
  {
    question: "ETF holdings 和指數成分股一樣嗎？",
    answer:
      "不完全一樣。ETF holdings 是 ETF 實際或揭露的持股資料；指數成分股是指數編製規則下的成分股票。兩者可能相似，但不應在資料模型中混用。",
  },
  {
    question: "為什麼 index constituents 需要 as_of_date？",
    answer:
      "因為指數成分股會變動。回測時必須使用當時有效的成分股，而不是最新成分股。`as_of_date` 可以幫助避免 look-ahead bias。",
  },
  {
    question: "0050 成分股可以用來做量化 universe 嗎？",
    answer:
      "可以，0050 成分股常被用作大型股 universe 的起點。但正式回測仍需要確認 holdings 的歷史版本、權重、交易日曆、交易成本與流動性條件。",
  },
  {
    question: "產業分類資料有什麼用途？",
    answer:
      "產業分類可以用於 sector exposure、產業輪動、風險控管與 portfolio constraints。它也能幫助 AI agent 比較同產業公司的財報、籌碼與技術指標。",
  },
  {
    question: "AI agent 可以查 ETF 成分股嗎？",
    answer:
      "可以。AI agent 可以透過 tool calling 查詢 ETF holdings 或 index constituents，並產生結構化摘要。但 agent 不應該自己猜 ETF 成分股或權重，也不應把結果當成投資建議。",
  },
];

const aiHedgeFundTaiwanStocksFaq: BlogFaqItem[] = [
  {
    question: "AI Hedge Fund 可以直接改成台股版嗎？",
    answer:
      "不能只替換股票代號。台股版需要處理上市、上櫃、ETF、交易日曆、財報公告日、三大法人、台股技術指標、ETF 成分股與本地資料口徑。真正的工作在資料層與 tool schema。",
  },
  {
    question: "台股 AI agent 需要哪些資料？",
    answer:
      "至少需要股票基本資料、OHLCV、財報、月營收、三大法人、技術指標、ETF / 指數成分股、交易日曆與風險資料。不同 agent 會使用不同資料工具。",
  },
  {
    question: "AI agent 可以直接下單嗎？",
    answer:
      "不建議。本文討論的是研究與分析 workflow。實際交易需要券商下單 API、完整回測、風控、人為審核、合規流程與監控機制。",
  },
  {
    question: "AI agent 會不會亂編股價或財報？",
    answer:
      "如果沒有工具邊界，就可能發生 hallucination。較好的做法是要求 agent 只能透過 API tool 查詢資料，並在回答中標示 data_used、日期區間、missing data 和 risk_flags。",
  },
  {
    question: "三大法人資料在台股 AI agent 裡有什麼用？",
    answer:
      "三大法人資料可以讓 agent 分析外資、投信、自營商近期買賣超變化，並轉成 rolling features 或風險標記。但它不應該被單獨視為買賣建議。",
  },
  {
    question: "TW Market Data 在 AI agent workflow 裡扮演什麼角色？",
    answer:
      "TW Market Data 的角色是提供穩定、結構化、developer-friendly 的台股 financial data API，讓 agent 能查詢行情、財報、籌碼、技術指標、ETF 與交易日曆資料，而不是靠 LLM 自己猜。",
  },
];

const taiwanStockAiAgentWorkflowFaq: BlogFaqItem[] = [
  {
    question: "台股 AI Agent 是什麼？",
    answer:
      "台股 AI Agent 是使用 LLM 搭配台股資料 API 的自動化研究 workflow。它可以透過 tools 查詢行情、財報、三大法人、技術指標與風控資料，再產生結構化摘要與風險標記。",
  },
  {
    question: "LLM 可以直接分析股票嗎？",
    answer:
      "LLM 可以協助整理與推理，但不應該自己猜股價、財報或法人買賣超。金融資料應該由可信 API tool 提供，LLM 負責把資料整理成可檢查的輸出。",
  },
  {
    question: "台股 AI Agent 需要哪些 API？",
    answer:
      "至少需要股票搜尋、OHLCV、財報、月營收、三大法人、技術指標、ETF holdings、交易日曆與風控資料。不同 agent 可以使用不同工具。",
  },
  {
    question: "AI agent 可以直接下單嗎？",
    answer:
      "不建議。本文討論的是研究與分析 workflow。實際交易需要券商下單 API、完整回測、風控、人為審核、合規流程與監控機制。",
  },
  {
    question: "如何避免 AI agent 亂編股票資料？",
    answer:
      "可以要求所有金融數字都必須來自 API tool，並在回應中列出 data_used、時間區間、missing_data 與 risk_flags。沒有資料來源時，agent 應該明確說明資料不足。",
  },
  {
    question: "TW Market Data 在 AI agent workflow 裡扮演什麼角色？",
    answer:
      "TW Market Data 提供穩定、結構化、developer-friendly 的台股 financial data API，讓 agent 可以查詢行情、財報、籌碼、技術指標、ETF 與交易日曆資料，而不是依賴模型記憶。",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "taiwan-stock-api-guide",
    title: "台股 API 完整指南：上市、上櫃、ETF、財報與即時行情資料怎麼串接",
    seoTitle: "台股 API 完整指南：上市、上櫃、ETF、財報與行情資料",
    description:
      "整理台股 API 的資料類型、上市上櫃差異、即時與盤後行情、歷史股價、ETF、財報、法人籌碼與量化交易 / AI Agent 使用情境。",
    category: "Taiwan Stock API",
    topic: { slug: "taiwan-stock-api", label: "Taiwan Stock API" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "12 min read",
    author: "TW Market Data Team",
    tags: ["台股 API", "台股資料 API", "Taiwan market data API", "台股量化交易", "AI agent 股票分析"],
    keywords: [
      "台股 API",
      "台股資料 API",
      "股票 API",
      "台灣股票 API",
      "股價 API",
      "台股即時股價 API",
      "台股歷史股價 API",
      "Taiwan stock API",
      "Taiwan market data API",
      "TWSE API",
      "TPEX API",
      "Python 抓台股資料",
      "台股量化交易",
      "AI agent 股票分析",
    ],
    lead: "台股 API 不只是把股價包成 JSON。對 developer、quant 和 AI agent workflow 來說，真正重要的是資料是否穩定、欄位是否一致、歷史資料是否完整，以及能不能被可靠地接進回測、研究、儀表板或自動化分析流程。",
    tldr: [
      "如果你要開發台股資料產品，最少需要三層資料：第一層是股票基本資料，例如上市、上櫃、ETF、產業分類與交易日曆；第二層是行情資料，例如即時報價、盤後行情、OHLCV、成交量與歷史 K 線；第三層是研究資料，例如財報、月營收、法人買賣超、ETF 成分股與 corporate actions。",
      "公開資料可以用來入門，但 production workflow 通常還需要標準化 schema、穩定 endpoint、錯誤處理、批次查詢、rate limit 管理、文件與可預期的資料更新時間。",
    ],
    tableOfContents: [
      { id: "what-is-taiwan-stock-api", label: "什麼是台股 API？" },
      { id: "data-types", label: "台股資料可以分成哪些類型？" },
      { id: "market-differences", label: "上市、上櫃、興櫃與 ETF：開發時要注意什麼？" },
      { id: "realtime-vs-eod-vs-history", label: "即時行情、延遲行情、盤後資料與歷史資料的差異" },
      { id: "data-source-comparison", label: "公開資料、交易所資料與商用 API 的差異" },
      { id: "schema-design", label: "一個好用的台股 API schema 應該長什麼樣子？" },
      { id: "quant-workflow", label: "台股 API 在量化交易裡怎麼使用？" },
      { id: "ai-agent-workflow", label: "台股 API 在 AI Agent workflow 裡怎麼使用？" },
      { id: "api-selection-checklist", label: "選擇台股 API 的 checklist" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanStockApiFaq,
    nextStepIntro:
      "如果你正在建立台股 app、量化回測系統、dashboard 或 AI agent workflow，下一步不是先寫更多爬蟲，而是先定義資料 schema。",
    nextStepItems: [
      "決定需要哪些台股資料類型",
      "把資料轉成一致的 schema",
      "用 API 文件和測試資料建立穩定 workflow",
    ],
    ctaPrompt: "Need structured Taiwan market data for your app, backtest, or AI agent workflow?",
    footerNote: "本文討論資料工程、API 設計、量化研究與 AI workflow，不構成投資建議。",
    content: TaiwanStockApiGuideContent,
  },
  {
    slug: "python-taiwan-stock-data-api",
    title: "Python 抓台股資料教學：用 API 取得 OHLCV、成交量與個股行情",
    seoTitle: "Python 抓台股資料教學：OHLCV、成交量與個股行情 API",
    description:
      "用 Python 串接台股 API，取得 OHLCV、成交量、成交金額與個股行情資料，並轉成 pandas DataFrame，適合量化交易、資料分析與 AI agent workflow。",
    category: "Python",
    topic: { slug: "python", label: "Python" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "10 min read",
    author: "TW Market Data Team",
    tags: ["Python", "台股 API", "OHLCV", "pandas", "量化交易", "AI Agent"],
    keywords: [
      "Python 抓台股資料",
      "Python 台股",
      "台股 API Python",
      "股票 API Python",
      "台股資料 API",
      "台股歷史股價 API",
      "OHLCV API",
      "pandas 股票資料",
      "Python 量化交易",
      "台股回測",
      "AI agent 股票分析",
    ],
    lead: "Python 是台股資料分析、量化研究和 AI agent workflow 最常見的工具之一。與其從網頁爬資料、手動清洗欄位，不如用穩定的台股 API 取得標準化 OHLCV、成交量、成交金額與個股行情，再轉成 pandas DataFrame 進行分析。",
    tldr: [
      "如果你要用 Python 抓台股資料，最基本的流程是：準備 API key、用 requests 呼叫 endpoint、檢查 HTTP status、把 JSON response 轉成 pandas DataFrame、標準化日期與數值欄位，最後再接進回測、dashboard 或 AI agent tool。",
      "公開資料適合入門，但 production workflow 需要更穩定的 schema、錯誤處理、rate limit 管理、cache、retry 和資料更新時間控管。",
    ],
    tableOfContents: [
      { id: "why-api", label: "為什麼用 API 抓台股資料？" },
      { id: "python-setup", label: "Python 環境準備" },
      { id: "requests-api", label: "用 requests 呼叫台股 API" },
      { id: "dataframe", label: "把 API response 轉成 pandas DataFrame" },
      { id: "ohlcv-schema", label: "OHLCV 欄位怎麼設計？" },
      { id: "multi-symbol", label: "一次查詢多檔股票" },
      { id: "error-handling", label: "加入錯誤處理、retry 與 timeout" },
      { id: "cache", label: "用 cache 降低 API request" },
      { id: "workflow", label: "接到台股回測或 AI agent workflow" },
      { id: "faq", label: "FAQ" },
    ],
    faq: pythonTaiwanStockDataFaq,
    nextStepIntro: "如果你已經能用 Python 抓到台股 OHLCV，下一步可以把資料接進三種 workflow：",
    nextStepItems: [
      "回測系統：檢查策略在歷史資料上的表現",
      "Dashboard：建立每日行情、成交量與指標監控",
      "AI agent：讓 LLM 透過 tool calling 查詢可信的台股資料",
    ],
    ctaPrompt: "Need structured Taiwan market data for your Python workflow, backtest, or AI agent?",
    footerNote: "本文討論資料工程、API 設計、Python 資料分析與 AI workflow，不構成投資建議。",
    content: PythonTaiwanStockDataApiContent,
  },
  {
    slug: "taiwan-stock-historical-price-api",
    title: "台股歷史股價 API 設計：K 線、除權息、調整後收盤價與回測資料",
    seoTitle: "台股歷史股價 API 設計：K 線、除權息與回測資料",
    description:
      "台股歷史股價 API 設計指南，說明 OHLCV、日 K、週 K、月 K、除權息、調整後收盤價與回測資料常見偏誤，適合量化交易與資料工程。",
    category: "Data Engineering",
    topic: { slug: "data-engineering", label: "Data Engineering" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "11 min read",
    author: "TW Market Data Team",
    tags: ["台股 API", "歷史股價", "OHLCV", "K 線", "回測", "量化交易", "Data Engineering"],
    keywords: [
      "台股歷史股價 API",
      "台股 K 線 API",
      "歷史股價 API",
      "台股 OHLCV",
      "adjusted close",
      "調整後收盤價",
      "除權息 API",
      "股票回測資料",
      "台股回測",
      "Python 台股回測",
      "量化交易資料",
      "Taiwan stock historical data API",
    ],
    lead: "歷史股價資料是台股量化交易、回測、技術分析、因子研究與 AI agent 股票分析的基礎。真正可用於 production workflow 的歷史股價 API，不只是回傳 open、high、low、close、volume，而是要清楚處理交易日曆、除權息、調整後價格、停牌、下市資料與資料偏誤。",
    tldr: [
      "如果你要用台股歷史股價 API 做回測，最少需要 OHLCV、交易日曆、成交量、成交金額、除權息資料與清楚的 adjusted price 設計。只用未調整的收盤價做長期回測，可能會因為配股、配息、減資或其他 corporate actions 造成績效失真。",
      "好的歷史資料 API 應該讓使用者清楚知道：價格是否調整、成交量單位是什麼、資料時間區間如何查詢、下市股票是否保留，以及 response schema 是否能穩定接進 Python、backtester、database 或 AI agent workflow。",
    ],
    tableOfContents: [
      { id: "why-historical-api", label: "為什麼歷史股價 API 對台股量化交易重要？" },
      { id: "ohlcv-basics", label: "OHLCV 是什麼？" },
      { id: "kline-interval", label: "日 K、週 K、月 K 怎麼設計？" },
      { id: "adjustments", label: "除權息與調整後收盤價" },
      { id: "schema", label: "歷史資料 API response schema" },
      { id: "biases", label: "回測資料常見偏誤" },
      { id: "range-query", label: "如何查詢一段時間的歷史資料？" },
      { id: "python-integration", label: "如何把歷史股價 API 接到 Python？" },
      { id: "backtest-integration", label: "如何把歷史資料接進回測系統？" },
      { id: "ai-agent", label: "AI agent 如何使用歷史股價資料？" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanStockHistoricalPriceFaq,
    nextStepIntro: "如果你正在建立台股回測、量化研究平台或 AI agent workflow，歷史股價 API 應該先處理三個問題：",
    nextStepItems: [
      "價格是否調整",
      "日期與交易日曆是否正確",
      "response schema 是否能穩定接進 Python、database 和 backtester",
    ],
    ctaPrompt: "Need historical Taiwan market data for your backtest, dashboard, or AI agent workflow?",
    footerNote: "本文討論資料工程、API 設計、量化研究與 AI workflow，不構成投資建議。",
    content: TaiwanStockHistoricalPriceApiContent,
  },
  {
    slug: "taiwan-quant-trading-guide",
    title: "台股量化交易入門：從資料取得、策略回測到風險控管",
    seoTitle: "台股量化交易入門：資料取得、回測與風險控管",
    description:
      "台股量化交易入門指南，從台股資料 API、股票 universe、歷史股價、財報與法人籌碼，到策略訊號、Python 回測、交易成本與風險控管。",
    category: "Quant Trading",
    topic: { slug: "quant-trading", label: "Quant Trading" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "12 min read",
    author: "TW Market Data Team",
    tags: ["台股量化交易", "回測", "Python", "台股 API", "風險控管", "Quant Trading", "Data Engineering"],
    keywords: [
      "台股量化交易",
      "量化交易 Python",
      "Python 台股量化",
      "台股回測",
      "股票回測",
      "台股 API",
      "台股資料 API",
      "量化交易資料",
      "台股程式交易",
      "量化選股",
      "台股策略回測",
      "quant trading Taiwan",
      "Taiwan stock backtesting",
    ],
    lead: "台股量化交易不是先寫一個買賣規則，而是先建立一條可靠的資料與研究流程。從股票 universe、歷史 OHLCV、財報、法人籌碼、交易日曆，到回測、交易成本、風險控管與 production pipeline，每一層都會影響策略結果是否可信。",
    tldr: [
      "台股量化交易的基本流程可以拆成七步：定義股票 universe、取得資料、清洗與對齊資料、產生策略 signal、建立 portfolio、執行回測、檢查風險與偏誤。真正的關鍵不是某個單一模型，而是資料是否穩定、回測是否合理、風控是否明確。",
      "如果資料來源不穩定、沒有處理除權息、沒有交易日曆、忽略交易成本或使用未來資料，回測績效很容易失真。對 developer、quant 和 AI agent workflow 來說，台股量化交易應該先從資料工程與可重複研究流程開始。",
    ],
    tableOfContents: [
      { id: "what-is-quant-trading", label: "什麼是台股量化交易？" },
      { id: "required-data", label: "台股量化交易需要哪些資料？" },
      { id: "universe-selection", label: "從 universe selection 開始" },
      { id: "signal-generation", label: "策略訊號怎麼產生？" },
      { id: "backtest-system", label: "回測系統需要處理什麼？" },
      { id: "trading-costs", label: "交易成本、滑價與流動性" },
      { id: "risk-position-sizing", label: "風險控管與 position sizing" },
      { id: "backtest-biases", label: "常見回測偏誤" },
      { id: "python-workflow", label: "Python 台股量化 workflow 範例" },
      { id: "ai-agent-role", label: "AI agent 在量化研究裡的角色" },
      { id: "production-pipeline", label: "從 notebook 到 production pipeline" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanQuantTradingGuideFaq,
    nextStepIntro: "如果你正在建立台股量化交易 workflow，建議先不要從複雜模型開始。先把下面三件事做好：",
    nextStepItems: [
      "建立穩定台股資料來源",
      "定義可重複的策略研究流程",
      "把回測、交易成本與風控納入同一條 pipeline",
    ],
    ctaPrompt: "Need structured Taiwan market data for your quant workflow, backtest, or AI agent?",
    footerNote: "本文討論資料工程、API 設計、量化研究、回測與 AI workflow，不構成投資建議。",
    content: TaiwanQuantTradingGuideContent,
  },
  {
    slug: "python-taiwan-stock-backtesting",
    title: "Python 台股回測系統實作：交易成本、滑價、停損與績效指標",
    seoTitle: "Python 台股回測系統實作：交易成本、滑價與績效指標",
    description:
      "用 Python 建立台股回測系統，從 OHLCV 資料、策略訊號、持倉、交易成本、滑價、停損，到年化報酬、最大回撤、Sharpe ratio 與績效分析。",
    category: "Quant Trading",
    topic: { slug: "quant-trading", label: "Quant Trading" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "13 min read",
    author: "TW Market Data Team",
    tags: ["Python", "台股回測", "量化交易", "Backtesting", "交易成本", "風險控管", "Quant Trading"],
    keywords: [
      "Python 台股回測",
      "台股回測",
      "股票回測 Python",
      "Python 量化交易",
      "台股量化交易",
      "台股策略回測",
      "股票回測系統",
      "交易成本",
      "滑價",
      "停損",
      "最大回撤",
      "Sharpe ratio",
      "Taiwan stock backtesting",
    ],
    lead: "台股回測不是把收盤價丟進策略公式就結束。真正可用的回測系統需要處理資料對齊、交易日曆、策略訊號、持倉、交易成本、滑價、停損、資金曲線與績效指標。這篇文章用 Python 示範一個簡化但結構完整的台股回測 workflow。",
    tldr: [
      "用 Python 做台股回測，最少需要六個部分：歷史 OHLCV、策略訊號、持倉計算、交易成本模型、績效指標與風險檢查。只看策略報酬率不夠，還要檢查最大回撤、波動率、Sharpe ratio、換手率、交易次數與流動性限制。",
      "這篇文章的範例是教學用回測框架，不是投資策略建議。正式使用前還需要更完整的交易成本、滑價、除權息、out-of-sample test、portfolio-level backtest 與合規檢查。",
    ],
    tableOfContents: [
      { id: "backtest-modules", label: "台股回測系統需要哪些模組？" },
      { id: "prepare-ohlcv", label: "準備歷史 OHLCV 資料" },
      { id: "build-signal", label: "建立策略訊號" },
      { id: "signal-to-position", label: "從 signal 轉成持倉" },
      { id: "trading-costs", label: "加入交易成本" },
      { id: "slippage-model", label: "加入滑價模型" },
      { id: "stop-loss-risk-rules", label: "加入停損與風險限制" },
      { id: "equity-curve", label: "計算資金曲線" },
      { id: "performance-metrics", label: "計算績效指標" },
      { id: "trade-log-audit", label: "儲存交易紀錄與 audit log" },
      { id: "full-python-example", label: "完整 Python 範例" },
      { id: "common-backtest-mistakes", label: "常見回測錯誤" },
      { id: "faq", label: "FAQ" },
    ],
    faq: pythonTaiwanStockBacktestingFaq,
    nextStepIntro: "如果你正在建立台股回測系統，建議先把三件事做好：",
    nextStepItems: [
      "確保歷史資料乾淨且價格調整狀態明確",
      "把交易成本、滑價與風控納入回測流程",
      "輸出可重複檢查的績效指標、交易紀錄與 audit log",
    ],
    ctaPrompt: "Need structured Taiwan market data for your Python backtest or quant workflow?",
    footerNote: "本文討論資料工程、Python 回測、量化研究與 AI workflow，不構成投資建議。",
    content: PythonTaiwanStockBacktestingContent,
  },
  {
    slug: "taiwan-stock-financial-statements-api",
    title: "台股財報 API 教學：用營收、EPS、ROE 與現金流建立基本面因子",
    seoTitle: "台股財報 API 教學：營收、EPS、ROE 與基本面因子",
    description:
      "台股財報 API 教學，說明月營收、損益表、資產負債表、現金流量表、EPS、ROE、公告日與基本面因子如何用於量化交易和 AI agent 股票分析。",
    category: "Fundamental Data",
    topic: { slug: "fundamental-data", label: "Fundamental Data" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "12 min read",
    author: "TW Market Data Team",
    tags: ["台股財報 API", "Fundamental Data", "月營收", "EPS", "ROE", "現金流", "基本面因子", "AI Agent"],
    keywords: [
      "台股財報 API",
      "台股基本面 API",
      "月營收 API",
      "EPS API",
      "ROE API",
      "現金流 API",
      "財報資料 API",
      "股票基本面資料",
      "台股量化因子",
      "基本面因子",
      "AI agent 股票分析",
      "Taiwan stock fundamentals API",
    ],
    lead: "台股財報 API 是建立基本面研究、量化選股、估值模型與 AI agent 股票分析的重要資料層。和股價資料不同，財報資料不只要看數字，還要處理報表期、公告日、資料版本、會計欄位、公司代號與資料可得時間，否則很容易在回測中產生 look-ahead bias。",
    tldr: [
      "台股財報 API 至少應該支援月營收、損益表、資產負債表、現金流量表、EPS、ROE、毛利率、營業利益率與公告日。對量化交易來說，最重要的不是只抓到財報數字，而是確認這些數字在回測當下是否已經公開。",
      "如果要把財報資料接進 AI agent workflow，API response 應該提供清楚的 schema、期間欄位、公告日、資料來源、單位與幣別，讓 agent 可以查詢、比較、摘要，但不能靠語言模型自己猜財報數字。",
    ],
    tableOfContents: [
      { id: "why-financial-api", label: "為什麼台股財報 API 重要？" },
      { id: "financial-data-types", label: "財報資料有哪些類型？" },
      { id: "monthly-vs-quarterly-vs-annual", label: "月營收、季報與年報的差異" },
      { id: "income-statement-schema", label: "損益表 API schema" },
      { id: "balance-sheet-schema", label: "資產負債表 API schema" },
      { id: "cash-flow-schema", label: "現金流量表 API schema" },
      { id: "key-fundamental-metrics", label: "EPS、ROE 與常見基本面指標" },
      { id: "announcement-date-priority", label: "公告日比報表期更重要" },
      { id: "factor-construction", label: "如何建立基本面因子？" },
      { id: "python-financials-integration", label: "Python 串接財報 API 範例" },
      { id: "ai-agent-financial-workflow", label: "AI agent 如何使用財報資料？" },
      { id: "data-quality-issues", label: "常見資料品質問題" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanStockFinancialStatementsFaq,
    nextStepIntro: "如果你正在建立台股基本面資料 workflow，建議先處理三件事：",
    nextStepItems: [
      "把報表期和公告日分開",
      "統一財報欄位、單位與幣別",
      "把財報資料轉成可回測、可比較的基本面因子",
    ],
    ctaPrompt: "Need structured Taiwan fundamentals data for your quant workflow, dashboard, or AI agent?",
    footerNote: "本文討論資料工程、API 設計、基本面研究、量化因子與 AI workflow，不構成投資建議。",
    content: TaiwanStockFinancialStatementsApiContent,
  },
  {
    slug: "taiwan-institutional-investors-api",
    title: "三大法人買賣超 API：用外資、投信、自營商資料做台股籌碼分析",
    seoTitle: "三大法人買賣超 API：外資、投信、自營商籌碼資料",
    description:
      "三大法人買賣超 API 教學，說明外資、投信、自營商買賣超資料如何設計 schema、建立籌碼因子，並用於台股量化交易、dashboard 與 AI agent 股票分析。",
    category: "Institutional Flows",
    topic: { slug: "institutional-flows", label: "Institutional Flows" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "11 min read",
    author: "TW Market Data Team",
    tags: ["三大法人 API", "Institutional Flows", "外資", "投信", "自營商", "籌碼資料", "量化因子", "AI Agent"],
    keywords: [
      "三大法人 API",
      "三大法人買賣超 API",
      "外資買賣超 API",
      "投信買賣超 API",
      "自營商買賣超 API",
      "台股籌碼 API",
      "法人買賣超資料",
      "台股 institutional flows",
      "台股量化因子",
      "籌碼分析",
      "AI agent 股票分析",
      "Taiwan institutional investors API",
    ],
    lead: "三大法人買賣超是台股市場很有特色的籌碼資料。對 developer、quant 和 AI agent workflow 來說，重點不只是看到外資、投信、自營商買超或賣超，而是要把資料整理成穩定 schema，處理市場別、日期、單位、買賣方向、成交量對齊與 rolling features，才能接進回測、dashboard 或自動化股票研究流程。",
    tldr: [
      "三大法人買賣超 API 應該清楚提供外資、投信、自營商的買進、賣出、買賣超、單位、日期、市場別與股票代號。對量化交易來說，單日買賣超通常不夠，還需要連續買超天數、買賣超佔成交量比重、rolling sum、rolling z-score、法人分歧程度與成交量對齊。",
      "籌碼資料可以作為台股量化因子或 AI agent 的研究資料，但不應該被直接解讀成買賣建議。資料產品的核心是提供一致、可回測、可監控的 institutional flow data，而不是宣稱法人買超就一定會上漲。",
    ],
    tableOfContents: [
      { id: "what-are-institutional-investors", label: "什麼是三大法人買賣超？" },
      { id: "why-institutional-flow-data-matters", label: "為什麼法人籌碼資料對台股 API 重要？" },
      { id: "institutional-flow-fields", label: "三大法人資料有哪些欄位？" },
      { id: "buy-sell-net-and-units", label: "買進、賣出、買賣超與單位設計" },
      { id: "institutional-flow-response-schema", label: "三大法人 API response schema" },
      { id: "build-institutional-factors", label: "如何把買賣超轉成量化因子？" },
      { id: "align-with-price-volume-fundamentals", label: "如何和成交量、股價與財報資料對齊？" },
      { id: "python-institutional-flow-example", label: "Python 串接三大法人 API 範例" },
      { id: "ai-agent-institutional-flows", label: "AI agent 如何使用法人籌碼資料？" },
      { id: "institutional-flow-data-quality", label: "常見資料品質問題" },
      { id: "institutional-flow-endpoint-design", label: "建議的 API endpoint 設計" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanInstitutionalInvestorsFaq,
    nextStepIntro: "如果你正在建立台股籌碼資料 workflow，建議先處理三件事：",
    nextStepItems: [
      "明確定義法人類別與資料單位",
      "把買賣超和成交量、股價、交易日曆對齊",
      "將單日資料轉成可回測的 rolling features",
    ],
    ctaPrompt: "Need structured Taiwan institutional flow data for your quant workflow, dashboard, or AI agent?",
    footerNote: "本文討論資料工程、API 設計、籌碼資料、量化因子與 AI workflow，不構成投資建議。",
    content: TaiwanInstitutionalInvestorsApiContent,
  },
  {
    slug: "taiwan-stock-technical-indicators-api",
    title: "台股技術分析 API：均線、RSI、MACD 與布林通道的資料管線",
    seoTitle: "台股技術分析 API：均線、RSI、MACD 與布林通道",
    description:
      "台股技術分析 API 教學，說明如何用 OHLCV 計算均線、RSI、MACD、布林通道與 ATR，並將技術指標接進 Python 回測、dashboard 與 AI agent workflow。",
    category: "Technical Indicators",
    topic: { slug: "technical-indicators", label: "Technical Indicators" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "11 min read",
    author: "TW Market Data Team",
    tags: ["台股技術分析 API", "Technical Indicators", "均線", "RSI", "MACD", "布林通道", "Python", "量化交易", "AI Agent"],
    keywords: [
      "台股技術分析 API",
      "技術指標 API",
      "均線 API",
      "RSI API",
      "MACD API",
      "布林通道 API",
      "台股 K 線 API",
      "OHLCV API",
      "Python 技術分析",
      "台股量化交易",
      "股票技術指標",
      "AI agent 股票分析",
      "Taiwan stock technical indicators API",
    ],
    lead: "技術分析 API 的核心不是把指標名稱包成 endpoint，而是建立一條穩定的資料管線：從 OHLCV、K 線、交易日曆、除權息與 adjusted price 開始，計算均線、RSI、MACD、布林通道、ATR 等技術指標，再把結果接進回測、dashboard 或 AI agent workflow。",
    tldr: [
      "台股技術分析 API 可以有兩種設計：一種是 API 直接回傳預先計算好的技術指標；另一種是 API 只提供乾淨的 OHLCV，讓使用者在 Python、database 或 backtesting engine 裡自行計算。對 production workflow 來說，關鍵不是指標公式本身，而是資料是否對齊、價格是否 adjusted、window 是否清楚、缺值是否處理，以及 signal 是否避免 look-ahead bias。",
      "如果要把技術指標接進 AI agent，建議回傳結構化資料，例如 indicator value、window、data_used、signal、risk_flags，而不是讓 LLM 自己猜 RSI 或 MACD。",
    ],
    tableOfContents: [
      { id: "what-is-technical-analysis-api", label: "技術分析 API 是什麼？" },
      { id: "api-vs-self-calculation", label: "技術指標應該由 API 提供，還是自行計算？" },
      { id: "required-raw-data", label: "技術分析需要哪些原始資料？" },
      { id: "moving-average-schema", label: "均線 API 與 moving average schema" },
      { id: "rsi-schema", label: "RSI API 與 momentum indicator schema" },
      { id: "macd-schema", label: "MACD API 與 trend indicator schema" },
      { id: "bollinger-and-atr", label: "布林通道與 ATR：波動率指標" },
      { id: "data-alignment", label: "如何避免資料對齊錯誤？" },
      { id: "python-indicator-example", label: "Python 計算技術指標範例" },
      { id: "indicators-in-backtesting", label: "如何把技術指標接進回測？" },
      { id: "ai-agent-technical-workflow", label: "AI agent 如何使用技術分析資料？" },
      { id: "technical-data-quality-issues", label: "常見資料品質問題" },
      { id: "technical-endpoint-design", label: "建議的 API endpoint 設計" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanStockTechnicalIndicatorsFaq,
    nextStepIntro: "如果你正在建立台股技術分析 workflow，建議先處理三件事：",
    nextStepItems: [
      "確認 OHLCV 與 adjusted price 狀態",
      "明確定義 indicator formula、window 與資料來源",
      "把 indicator value、signal、回測與風控分開處理",
    ],
    ctaPrompt: "Need structured Taiwan technical indicator data for your quant workflow, dashboard, or AI agent?",
    footerNote: "本文討論資料工程、API 設計、技術指標、量化研究與 AI workflow，不構成投資建議。",
    content: TaiwanStockTechnicalIndicatorsApiContent,
  },
  {
    slug: "taiwan-etf-index-constituents-api",
    title: "台股 ETF 與指數成分股 API：0050、產業分類與輪動策略資料",
    seoTitle: "台股 ETF 與指數成分股 API：0050、權重與產業分類",
    description:
      "台股 ETF 與指數成分股 API 教學，說明 0050、ETF holdings、指數成分股、權重、產業分類、rebalancing 與 sector rotation 如何用於量化交易、dashboard 和 AI agent workflow。",
    category: "ETF & Index Data",
    topic: { slug: "etf-index-data", label: "ETF & Index Data" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "11 min read",
    author: "TW Market Data Team",
    tags: ["台股 ETF API", "指數成分股", "ETF Holdings", "0050", "產業分類", "Universe Selection", "Sector Rotation", "Quant Trading", "AI Agent"],
    keywords: [
      "台股 ETF API",
      "指數成分股 API",
      "ETF 成分股 API",
      "0050 API",
      "0050 成分股",
      "台股指數 API",
      "台股產業分類 API",
      "ETF holdings API",
      "index constituents API",
      "sector rotation",
      "universe selection",
      "台股量化交易",
      "AI agent 股票分析",
      "Taiwan ETF API",
      "Taiwan index constituents API",
    ],
    lead: "ETF 與指數成分股資料是台股量化交易、ETF dashboard、universe selection、產業輪動策略與 AI agent 股票研究的重要資料層。對 developer 來說，重點不只是查到 0050 或某個指數有哪些成分股，而是要取得成分股、權重、產業分類、調整日期、rebalancing、成分變更與資料版本，才能把它穩定接進回測與 production workflow。",
    tldr: [
      "台股 ETF 與指數成分股 API 應該支援 ETF 基本資料、ETF holdings、指數成分股、權重、產業分類、成分變更、rebalancing date 與 as-of date。對量化交易來說，這些資料最常用來建立股票 universe、做 sector exposure 控制、設計輪動策略，或讓 AI agent 查詢某個 ETF / 指數目前包含哪些股票。",
      "ETF 與指數資料的難點不是欄位很多，而是時間版本。回測不能用今天的 0050 成分股去回測 2020 年策略，否則會產生 look-ahead bias。API 必須清楚標示 as_of_date、effective_date、weight 與 constituent_changes。",
    ],
    tableOfContents: [
      { id: "why-etf-index-api-matters", label: "為什麼 ETF 與指數成分股 API 重要？" },
      { id: "etf-vs-index-vs-stock-master", label: "ETF 資料、指數資料與股票清單有什麼差別？" },
      { id: "etf-holdings-schema", label: "ETF holdings API 應該包含哪些欄位？" },
      { id: "index-constituents-schema", label: "指數成分股 API schema" },
      { id: "taiwan-50-constituents-design", label: "0050 成分股資料可以怎麼設計？" },
      { id: "sector-classification-and-exposure", label: "產業分類與 sector exposure" },
      { id: "rebalancing-and-asof-date", label: "Rebalancing、成分變更與 as-of date" },
      { id: "universe-selection-with-constituents", label: "如何用成分股建立 universe selection？" },
      { id: "python-etf-index-api-example", label: "Python 串接 ETF / index constituents API 範例" },
      { id: "etf-index-data-in-backtesting", label: "如何把 ETF / 指數資料接進回測？" },
      { id: "ai-agent-etf-index-workflow", label: "AI agent 如何使用 ETF 與指數資料？" },
      { id: "etf-index-data-quality-issues", label: "常見資料品質問題" },
      { id: "etf-index-endpoint-design", label: "建議的 API endpoint 設計" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanEtfIndexConstituentsFaq,
    nextStepIntro: "如果你正在建立台股 ETF、指數或 universe selection workflow，建議先處理三件事：",
    nextStepItems: [
      "區分 ETF holdings、index constituents 與 stock master",
      "對所有成分股資料加入 as_of_date 與 effective_date",
      "將產業分類與權重接進回測、dashboard 和 AI agent workflow",
    ],
    ctaPrompt: "Need structured Taiwan ETF and index constituent data for your quant workflow, dashboard, or AI agent?",
    footerNote: "本文討論資料工程、API 設計、ETF / 指數成分股、量化研究與 AI workflow，不構成投資建議。",
    content: TaiwanEtfIndexConstituentsApiContent,
  },
  {
    slug: "ai-hedge-fund-taiwan-stocks",
    title: "把 AI Hedge Fund 改成台股版：Multi-Agent 股票分析系統架構",
    seoTitle: "AI Hedge Fund 台股版：Multi-Agent 股票分析系統架構",
    description:
      "解析如何把 AI Hedge Fund multi-agent 架構改成台股版，使用台股行情、歷史股價、財報、三大法人、技術指標、ETF 成分股與風控資料建立 AI 股票分析系統。",
    category: "AI Agents",
    topic: { slug: "ai-agents", label: "AI Agents" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "13 min read",
    author: "TW Market Data Team",
    tags: ["AI Hedge Fund", "AI Agents", "Multi-Agent", "台股 API", "量化交易", "Tool Calling", "風險控管", "Financial Data API"],
    keywords: [
      "AI Hedge Fund 台股",
      "台股 AI Agent",
      "AI agent 股票分析",
      "Multi-Agent 股票分析",
      "AI 量化交易",
      "LLM 股票分析",
      "台股資料 API",
      "台股 financial data API",
      "AI 股票研究助理",
      "agent workflow",
      "tool calling 股票資料",
      "Taiwan stock AI agent",
      "Taiwan market data API",
    ],
    lead: "AI Hedge Fund 這類 multi-agent 股票分析專案，核心不是讓 LLM 憑空猜股價，而是讓不同 agent 透過工具查詢可信的金融資料，再分別負責基本面、技術面、籌碼、估值、風控與投資組合決策。如果要把這種架構改成台股版，第一個問題不是 prompt 怎麼寫，而是台股 financial data API 能不能提供穩定、結構化、可回測的資料層。",
    tldr: [
      "把 AI Hedge Fund 改成台股版，不能只把 ticker 從 AAPL 換成 2330。台股版需要不同的資料工具與 agent 設計，包括台股行情、OHLCV、財報、月營收、三大法人、技術指標、ETF / 指數成分股、交易日曆與風控資料。",
      "一個合理的台股 multi-agent workflow 可以包含 Fundamentals Agent、Technicals Agent、Institutional Flow Agent、ETF / Universe Agent、Risk Manager 和 Portfolio Manager。每個 agent 都應該透過 API tool 查資料，輸出結構化 signal、confidence、data_used 與 risk_flags，而不是直接產生無來源的買賣建議。",
      "本文只討論資料工程、AI workflow 與系統架構，不構成投資建議，也不建議讓 agent 未經回測、風控與人為審核就直接下單。",
    ],
    tableOfContents: [
      { id: "what-ai-hedge-fund-does", label: "AI Hedge Fund 類型專案在做什麼？" },
      { id: "why-us-workflow-not-directly-portable", label: "為什麼美股架構不能直接套用台股？" },
      { id: "taiwan-required-tools", label: "台股版需要哪些資料工具？" },
      { id: "taiwan-multi-agent-architecture", label: "台股 multi-agent 系統架構" },
      { id: "fundamentals-agent", label: "Fundamentals Agent：財報與基本面資料" },
      { id: "technicals-agent", label: "Technicals Agent：OHLCV 與技術指標" },
      { id: "institutional-flow-agent", label: "Institutional Flow Agent：三大法人與籌碼資料" },
      { id: "etf-universe-agent", label: "ETF / Universe Agent：ETF、指數與產業分類" },
      { id: "risk-manager", label: "Risk Manager：流動性、波動率與部位限制" },
      { id: "portfolio-manager", label: "Portfolio Manager：整合信號，不直接保證交易結果" },
      { id: "agent-tool-schema", label: "Agent tool schema 設計" },
      { id: "agent-output-schema", label: "Agent output schema 設計" },
      { id: "avoid-hallucination", label: "如何避免 hallucination？" },
      { id: "research-to-production", label: "從 research workflow 到 production workflow" },
      { id: "faq", label: "FAQ" },
    ],
    faq: aiHedgeFundTaiwanStocksFaq,
    nextStepIntro: "如果你要把 AI Hedge Fund 類型架構改成台股版，建議先處理三件事：",
    nextStepItems: [
      "定義台股資料工具，而不是先寫 prompt",
      "讓每個 agent 輸出可檢查的 structured JSON",
      "把 risk manager、backtesting 和 human approval 放進 workflow",
    ],
    ctaPrompt: "Need structured Taiwan market data for your AI agent, quant workflow, or research assistant?",
    footerNote: "本文討論資料工程、AI agent workflow、量化研究與系統架構，不構成投資建議。",
    content: AiHedgeFundTaiwanStocksContent,
  },
  {
    slug: "taiwan-stock-ai-agent-workflow",
    title: "台股 AI Agent Workflow：讓 LLM 串接行情、財報、籌碼與風控資料",
    seoTitle: "台股 AI Agent Workflow：LLM 串接行情、財報與籌碼資料",
    description:
      "台股 AI Agent Workflow 教學，示範如何讓 LLM 透過 tool calling 串接台股行情、歷史股價、財報、三大法人、技術指標、ETF 成分股與風控資料，建立可檢查的股票分析流程。",
    category: "AI Agents",
    topic: { slug: "ai-agents", label: "AI Agents" },
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingTime: "12 min read",
    author: "TW Market Data Team",
    tags: ["AI Agents", "Tool Calling", "台股 API", "LLM", "股票分析", "風險控管", "Financial Data API", "Quant Workflow"],
    keywords: [
      "台股 AI Agent",
      "AI agent 股票分析",
      "LLM 股票分析",
      "tool calling 股票資料",
      "台股資料 API",
      "台股 financial data API",
      "AI 股票研究助理",
      "AI 量化交易",
      "Multi-Agent 股票分析",
      "股票 RAG",
      "AI agent workflow",
      "Taiwan stock AI agent",
      "Taiwan market data API",
    ],
    lead: "台股 AI agent 不應該靠語言模型自己猜股價、財報或三大法人買賣超。合理的 workflow 是讓 LLM 透過 tool calling 查詢可信的台股資料 API，再用結構化 schema 整理資料、標示風險、產生研究摘要，最後交給 risk manager 或 human reviewer 檢查。",
    tldr: [
      "台股 AI Agent Workflow 的核心是 LLM + tools + structured output。LLM 負責規劃查詢、摘要資料與產生研究結論；TW Market Data 這類台股 financial data API 負責提供行情、OHLCV、財報、月營收、三大法人、技術指標、ETF 成分股、交易日曆與風控資料。",
      "好的 agent workflow 應該包含 tool schema、data_used、時間區間、missing data、risk_flags、confidence、not_investment_advice 與 audit log。Agent 不應該在沒有資料來源的情況下產生買賣建議，也不應該未經回測、風控與人為審核就直接下單。",
    ],
    tableOfContents: [
      { id: "why-ai-agent-needs-api", label: "為什麼台股 AI agent 需要資料 API？" },
      { id: "llm-cannot-guess-financial-data", label: "LLM 不能直接猜金融資料" },
      { id: "core-tools", label: "台股 AI agent 的基本工具" },
      { id: "tool-calling-schema-design", label: "Tool calling schema 設計" },
      { id: "search-stocks-tool", label: "股票查詢 tool：search_stocks" },
      { id: "daily-ohlcv-tool", label: "行情與 OHLCV tool：get_daily_ohlcv" },
      { id: "financial-statements-tool", label: "財報 tool：get_financial_statements" },
      { id: "institutional-flows-tool", label: "三大法人 tool：get_institutional_flows" },
      { id: "technical-indicators-tool", label: "技術指標 tool：get_technical_indicators" },
      { id: "etf-holdings-tool", label: "ETF / universe tool：get_etf_holdings" },
      { id: "risk-metrics-tool", label: "風控 tool：calculate_risk_metrics" },
      { id: "agent-response-schema", label: "Agent response schema" },
      { id: "end-to-end-workflow-example", label: "一個完整台股 AI agent workflow 範例" },
      { id: "hallucination-control", label: "如何降低 hallucination？" },
      { id: "research-to-production-workflow", label: "從 research assistant 到 production workflow" },
      { id: "faq", label: "FAQ" },
    ],
    faq: taiwanStockAiAgentWorkflowFaq,
    nextStepIntro: "如果你正在建立台股 AI agent workflow，建議先處理三件事：",
    nextStepItems: [
      "定義 tools，而不是先寫長 prompt",
      "讓所有 agent output 都是 structured JSON",
      "把 hallucination control、risk manager 和 human review 放進流程",
    ],
    ctaPrompt: "Need structured Taiwan market data for your AI agent, quant workflow, or research assistant?",
    footerNote: "本文討論資料工程、AI agent workflow、tool calling 與風控設計，不構成投資建議。",
    content: TaiwanStockAiAgentWorkflowContent,
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts() {
  const FEATURED_SLUG = "taiwan-stock-api-guide";
  return [...blogPosts].sort((a, b) => {
    if (a.slug === FEATURED_SLUG && b.slug !== FEATURED_SLUG) return -1;
    if (b.slug === FEATURED_SLUG && a.slug !== FEATURED_SLUG) return 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

export function getBlogTopics(): BlogTopicSummary[] {
  const order = ["taiwan-stock-api", "python", "data-engineering", "technical-indicators", "fundamental-data", "institutional-flows", "etf-index-data", "ai-agents", "quant-trading"];
  const orderIndex = new Map(order.map((slug, index) => [slug, index]));
  const topicMap = new Map<string, BlogTopicSummary>();

  for (const post of blogPosts) {
    const current = topicMap.get(post.topic.slug);
    if (current) {
      current.count += 1;
      continue;
    }

    topicMap.set(post.topic.slug, {
      slug: post.topic.slug,
      label: post.topic.label,
      count: 1,
    });
  }

  return [...topicMap.values()].sort((a, b) => {
    const aIndex = orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.label.localeCompare(b.label);
  });
}

export function getBlogPostsByTopic(topicSlug?: string) {
  const posts = getAllBlogPosts();
  if (!topicSlug) {
    return posts;
  }

  const normalizedTopicSlug = topicSlug.toLowerCase();
  const filteredPosts = posts.filter((post) => post.topic.slug === normalizedTopicSlug);
  return filteredPosts.length > 0 ? filteredPosts : posts;
}
