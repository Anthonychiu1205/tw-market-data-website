"use client";

import { buttonClass } from "@/src/components/ui/button";

type AnalystRow = {
  analyst: string;
  stance: string;
  confidence: number;
  status: "mock-real" | "placeholder" | "missing";
  keyData: string;
  dataGaps: string;
};

const analystRows: AnalystRow[] = [
  {
    analyst: "市場資料分析師",
    stance: "中性",
    confidence: 0.72,
    status: "mock-real",
    keyData: "TWSE 日線價格 fixture",
    dataGaps: "live read 尚未接入",
  },
  {
    analyst: "技術面分析師",
    stance: "分歧",
    confidence: 0.0,
    status: "placeholder",
    keyData: "—",
    dataGaps: "技術指標尚未接入",
  },
  {
    analyst: "月營收分析師",
    stance: "尚無資料",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "月營收 mapping 待完成",
  },
  {
    analyst: "財報分析師",
    stance: "尚無資料",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "財報資料尚未接入",
  },
  {
    analyst: "估值分析師",
    stance: "尚無資料",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "估值資料待完成",
  },
  {
    analyst: "新聞事件分析師",
    stance: "中性",
    confidence: 0.0,
    status: "placeholder",
    keyData: "fixture 邊界",
    dataGaps: "尚未執行 live 事件工具",
  },
  {
    analyst: "籌碼 / 法人分析師",
    stance: "尚無資料",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "法人 / 籌碼資料待完成",
  },
  {
    analyst: "總經 / 產業分析師",
    stance: "尚無資料",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "總經 / 產業資料待完成",
  },
];

const confidenceChartData = analystRows.map((row) => ({
  name: row.analyst,
  confidence: row.confidence,
}));

const coverageChartData = [
  { name: "可用", value: 1, colorClass: "bg-slate-900" },
  { name: "佔位", value: 2, colorClass: "bg-slate-500" },
  { name: "缺資料", value: 5, colorClass: "bg-slate-300" },
];

const timelineSteps = [
  { stage: "市場資料", status: "mock-real" },
  { stage: "分析師", status: "部分完成" },
  { stage: "多空研究", status: "placeholder" },
  { stage: "交易提案", status: "保守" },
  { stage: "風控", status: "需更多資料" },
  { stage: "投組", status: "不採取動作" },
  { stage: "模擬訂單", status: "紙上模擬" },
];

function formatConfidence(value: number) {
  return value.toFixed(2);
}

function statusBadgeClass(status: AnalystRow["status"]) {
  if (status === "mock-real") {
    return "bg-slate-900 text-white";
  }
  if (status === "placeholder") {
    return "bg-slate-200 text-slate-700";
  }
  return "bg-slate-100 text-slate-500";
}

export function AiResearchStaticMockPage() {
  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">AI Research</h1>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Pro+ 功能
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                僅模擬
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                非投資建議
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-600">
              使用台股資料流程產生可審計的研究結論、風險檢查與模擬決策。
            </p>
            <p className="text-xs text-slate-500">
              開放 Pro、Team、Enterprise 方案使用；Developer 僅提供 mock 預覽。
            </p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-[420px]">
            <label className="space-y-1">
              <span className="text-xs text-slate-500">股票代碼</span>
              <input
                defaultValue="2330"
                readOnly
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-slate-500">資料日期</span>
              <input
                defaultValue="2026-05-13"
                readOnly
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">模式</span>
              <div className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm leading-10 text-slate-700">
                Mock
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-transparent">執行</span>
              <button type="button" disabled className={buttonClass("primary", "h-10 w-full rounded-lg text-sm")}>
                執行研究
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-5">
          <div>
            <p className="text-xs text-slate-500">研究動作候選</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">持有 / 觀望</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">信心分數</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">0.62</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">風控判斷</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">需要更多資料</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">投組動作</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">不採取動作</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">模擬狀態</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">僅紙上模擬</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Replay fingerprint
          <span className="ml-2 font-mono text-slate-700">rf_2330_20260513_mock</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">研究流程</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-7">
            {timelineSteps.map((step, index) => (
              <div key={step.stage} className="min-w-0 rounded-lg bg-slate-50/80 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-slate-700" />
                  <p className="min-w-0 break-words text-xs font-medium text-slate-900">{step.stage}</p>
                </div>
                <div className="mt-1 flex items-center gap-2 pl-4">
                  <p className="min-w-0 break-words text-xs text-slate-500">{step.status}</p>
                  {index < timelineSteps.length - 1 ? (
                    <span className="hidden text-[11px] text-slate-400 xl:inline">→</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">分析師總覽</h2>
            <div className="text-xs text-slate-500">目前方案：Pro · 功能已啟用</div>
          </div>
          <div>
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[23%]" />
                <col className="w-[25%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">分析師</th>
                  <th className="py-2 pr-4 font-medium">立場</th>
                  <th className="py-2 pr-4 font-medium">信心</th>
                  <th className="py-2 pr-4 font-medium">狀態</th>
                  <th className="py-2 pr-4 font-medium">關鍵資料</th>
                  <th className="py-2 font-medium">資料缺口</th>
                </tr>
              </thead>
              <tbody>
                {analystRows.map((row) => (
                  <tr key={row.analyst} className="border-b border-slate-100 align-top text-slate-700 last:border-b-0">
                    <td className="py-2.5 pr-4 font-medium text-slate-900">{row.analyst}</td>
                    <td className="py-2.5 pr-4">{row.stance}</td>
                    <td className="py-2.5 pr-4">{formatConfidence(row.confidence)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-normal break-words">{row.keyData}</td>
                    <td className="py-2.5 whitespace-normal break-words">{row.dataGaps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">多方觀點（Bull Case）</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>價格資料 fixture 結構完整可用。</li>
                <li>市場資料路徑具備審計追蹤性。</li>
                <li>研究流程可產生可重播的決策記錄。</li>
                <li>未來接入 TWSE read-only 後可提升信心。</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">空方觀點（Bear Case）</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>本次尚未接入 live 市場資料。</li>
                <li>技術面 / 估值 / 基本面資料仍有缺口。</li>
                <li>新聞事件訊號仍為 placeholder。</li>
                <li>在覆蓋率補齊前應維持保守結論。</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">圖表分析</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">分析師信心分數</p>
              <div className="space-y-2">
                {confidenceChartData.map((row) => (
                  <div key={row.name} className="grid grid-cols-[150px_minmax(0,1fr)_40px] items-center gap-3">
                    <span className="truncate text-xs text-slate-600">{row.name}</span>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-slate-800" style={{ width: `${Math.max(4, row.confidence * 100)}%` }} />
                    </div>
                    <span className="text-right text-xs text-slate-500">{formatConfidence(row.confidence)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">研究覆蓋狀態</p>
              <div className="space-y-3">
                {coverageChartData.map((row) => {
                  const pct = (row.value / 8) * 100;
                  return (
                    <div key={row.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{row.name}</span>
                        <span className="text-slate-500">{row.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className={`h-2 rounded-full ${row.colorClass}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">風控審查</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">風控判斷</dt>
                <dd className="font-medium text-slate-900">需要更多資料</dd>
                <dt className="text-slate-500">最大配置</dt>
                <dd className="font-medium text-slate-900">0%</dd>
                <dt className="text-slate-500">需要使用者確認</dt>
                <dd className="font-medium text-slate-900">是</dd>
              </dl>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>技術指標缺失</li>
                <li>估值資料缺失</li>
                <li>新聞訊號為 placeholder</li>
                <li>未使用 live provider</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">模擬訂單</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">訂單狀態</dt>
                <dd className="font-medium text-slate-900">拒絕 / 不採取動作</dd>
                <dt className="text-slate-500">僅模擬</dt>
                <dd className="font-medium text-slate-900">true</dd>
                <dt className="text-slate-500">券商下單</dt>
                <dd className="font-medium text-slate-900">false</dd>
              </dl>
              <p className="mt-3 text-sm text-slate-700">原因：風控審查仍需要更多資料。</p>
              <p className="mt-2 text-xs text-slate-500">這是模擬研究輸出，不會建立任何券商委託單。</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">資料缺口</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>技術指標尚未接入。</li>
                <li>月營收 mapping 待完成。</li>
                <li>財報資料 adapter 尚未接入。</li>
                <li>估值資料待完成。</li>
                <li>此 mock run 尚未執行 NewsEventTool。</li>
                <li>TPEx 歷史深度資料仍待補齊。</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">風險提示</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>僅 mock 模式。</li>
                <li>非投資建議。</li>
                <li>未使用 live provider。</li>
                <li>不進行券商下單。</li>
                <li>使用者需自行做最終決策。</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
          <p className="text-sm text-slate-700">
            本頁內容僅為研究與模擬用途，不構成投資建議，不保證報酬，亦不會進行任何真實下單。所有決策應由使用者自行判斷。
          </p>
        </div>
      </section>
    </div>
  );
}
