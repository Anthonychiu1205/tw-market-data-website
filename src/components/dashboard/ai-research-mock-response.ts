export type AiResearchAnalystRole =
  | "market_data"
  | "technical"
  | "monthly_revenue"
  | "financial_statement"
  | "valuation"
  | "news_event"
  | "chip_institutional"
  | "macro_sector";

export type AiResearchAnalystStatus = "mock_real" | "placeholder" | "missing";
export type AiResearchAnalystStance = "neutral" | "mixed" | "unavailable";

export type AiResearchAnalyst = {
  analyst_role: AiResearchAnalystRole;
  display_name: string;
  output_status: AiResearchAnalystStatus;
  stance: AiResearchAnalystStance;
  score: number;
  confidence: number;
  summary: string;
  key_points: string[];
  evidence: Array<{
    dataset: string;
    field: string;
    value: number | string;
    interpretation: string;
  }>;
  data_gaps: string[];
  warnings: string[];
  provenance: {
    source_system: string;
    source_dataset: string;
    data_origin: string;
    data_status: string;
    live_provider_used: boolean;
    llm_used: boolean;
    broker_execution: boolean;
  };
  metadata: {
    deterministic: boolean;
    adapter: string;
  };
};

export type AiResearchMockResponse = {
  run_id: string;
  ticker: string;
  as_of_date: string;
  mode: "mock";
  decision: {
    action: "no_action" | "hold" | "avoid";
    confidence: number;
    reason: string;
  };
  simulation: {
    order: {
      order_id: string;
      status: "rejected" | "proposed";
      side: "buy";
      quantity: number;
      simulation_only: true;
      broker_execution: false;
      reason: string;
    };
    fill: null;
    position: {
      ticker: string;
      quantity: number;
      average_price: number;
      market_value: number;
      unrealized_pnl: number;
      status: "flat";
    };
  };
  research: {
    analysts: AiResearchAnalyst[];
    bull_case: {
      status: "placeholder";
      key_points: string[];
    };
    bear_case: {
      status: "placeholder";
      key_points: string[];
    };
    trader_proposal: {
      proposed_action: "hold" | "avoid";
      confidence: number;
      summary: string;
    };
    risk_review: {
      decision: "needs_more_data";
      max_allocation: number;
      required_user_confirmation: boolean;
      flags: string[];
    };
    portfolio_decision: {
      action: "no_action";
      confidence: number;
      rationale: string;
    };
  };
  data_gaps: string[];
  warnings: string[];
  disclaimer: string;
  replay_fingerprint: string;
  broker_execution: false;
  simulation_only: true;
  not_investment_advice: true;
};

export type BuildAiResearchMockInput = {
  ticker: string;
  asOfDate: string;
  includeSimulation?: boolean;
};

type MarketProfile = {
  confidence: number;
  sectorHint: string;
  profileNote: string;
  extraWarnings?: string[];
  extraDataGaps?: string[];
};

const MARKET_PROFILE_BY_TICKER: Record<string, MarketProfile> = {
  "1101": {
    confidence: 0.54,
    sectorHint: "建材",
    profileNote: "local fixture 顯示為大型建材股範圍。",
  },
  "2303": {
    confidence: 0.57,
    sectorHint: "半導體製造",
    profileNote: "local fixture 顯示為成熟製程半導體範圍。",
  },
  "2317": {
    confidence: 0.66,
    sectorHint: "電子製造",
    profileNote: "local fixture 顯示為大型電子製造權重股範圍。",
  },
  "2330": {
    confidence: 0.72,
    sectorHint: "半導體",
    profileNote: "local fixture 顯示為半導體大型權值股範圍。",
  },
  "2412": {
    confidence: 0.56,
    sectorHint: "電信",
    profileNote: "local fixture 顯示為電信權值股範圍。",
  },
  "2454": {
    confidence: 0.64,
    sectorHint: "IC 設計",
    profileNote: "local fixture 顯示為半導體 IC 設計範圍。",
  },
  "2603": {
    confidence: 0.58,
    sectorHint: "航運",
    profileNote: "local fixture 顯示為航運循環股範圍。",
    extraWarnings: ["航運板塊具景氣循環特性，mock 判讀僅供研究流程演示。"],
  },
  "2881": {
    confidence: 0.6,
    sectorHint: "金融",
    profileNote: "local fixture 顯示為金融權值股範圍。",
    extraWarnings: ["金融板塊對利率敏感，mock 判讀僅供研究流程演示。"],
  },
  "2882": {
    confidence: 0.6,
    sectorHint: "金融",
    profileNote: "local fixture 顯示為金融權值股範圍。",
    extraWarnings: ["金融板塊對利率敏感，mock 判讀僅供研究流程演示。"],
  },
  "3034": {
    confidence: 0.59,
    sectorHint: "IC 設計",
    profileNote: "local fixture 顯示為中大型 IC 設計範圍。",
  },
};

const BASELINE_DATA_GAPS = [
  "技術指標尚未接入。",
  "月營收 mapping 待完成。",
  "財報資料 adapter 尚未接入。",
  "估值資料待完成。",
  "此 mock run 尚未執行 NewsEventTool。",
  "TPEx 歷史深度資料仍待補齊。",
];

const BASELINE_WARNINGS = [
  "僅 mock 模式。",
  "非投資建議。",
  "未使用 live provider。",
  "不進行券商下單。",
  "使用者需自行做最終決策。",
];

function normalizeTicker(ticker: string): string {
  const normalized = ticker.trim().toUpperCase();
  return normalized || "2330";
}

function normalizeAsOfDate(asOfDate: string): string {
  const text = asOfDate.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }
  return "2026-05-13";
}

function toSeed(ticker: string, asOfDate: string): number {
  const raw = `${ticker}|${asOfDate}`;
  let seed = 0;
  for (let i = 0; i < raw.length; i += 1) {
    seed = (seed + raw.charCodeAt(i) * (i + 7)) % 100000;
  }
  return seed;
}

function buildDeterministicPrice(ticker: string, asOfDate: string): {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
} {
  const seed = toSeed(ticker, asOfDate);
  const base = 40 + (seed % 940);
  const close = Number((base + (seed % 17) * 0.5).toFixed(2));
  const open = Number((close - 2.4).toFixed(2));
  const high = Number((close + 3.2).toFixed(2));
  const low = Number((close - 4.1).toFixed(2));
  const volume = 12000000 + (seed % 120) * 210000;
  return { open, high, low, close, volume };
}

function buildReplayFingerprint(ticker: string, asOfDate: string): string {
  const dateCompact = asOfDate.replaceAll("-", "");
  const seed = toSeed(ticker, asOfDate).toString(16).padStart(5, "0");
  return `rf_${ticker}_${dateCompact}_mock_${seed}`;
}

function buildRunId(ticker: string, asOfDate: string): string {
  const seed = toSeed(ticker, asOfDate).toString(16).padStart(5, "0");
  return `research_firm_mock_${ticker}_${asOfDate}_mock_${seed}`;
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }
  return output;
}

function buildMarketDataAnalyst(ticker: string, asOfDate: string): AiResearchAnalyst {
  const profile = MARKET_PROFILE_BY_TICKER[ticker];
  const fallbackProfile: MarketProfile = {
    confidence: 0.5,
    sectorHint: "一般產業",
    profileNote: "local fixture coverage 僅提供基本市場資料樣本。",
    extraDataGaps: ["mock fixture coverage is limited for this ticker"],
  };
  const resolved = profile ?? fallbackProfile;
  const price = buildDeterministicPrice(ticker, asOfDate);

  return {
    analyst_role: "market_data",
    display_name: "市場資料分析師",
    output_status: "mock_real",
    stance: "neutral",
    score: 0,
    confidence: resolved.confidence,
    summary: "市場資料已可用，但尚未啟用完整趨勢模型，因此維持中性判讀。",
    key_points: [
      "TWSE 日線價格 fixture 可用",
      `收盤價 ${price.close.toLocaleString("en-US")} 可用`,
      `成交量 ${price.volume.toLocaleString("en-US")} 可用`,
      `產業範圍：${resolved.sectorHint}`,
      resolved.profileNote,
    ],
    evidence: [
      {
        dataset: "twse_daily_price",
        field: "price.close",
        value: price.close,
        interpretation: "收盤價由 deterministic local fixture 提供，僅供 mock 研究流程使用。",
      },
      {
        dataset: "twse_daily_price",
        field: "price.volume",
        value: price.volume,
        interpretation: "成交量由 deterministic local fixture 提供，僅供 mock 研究流程使用。",
      },
    ],
    data_gaps: dedupe([
      "live read 尚未接入",
      "fixture-only payload excludes technical, fundamentals, and news datasets",
      ...(resolved.extraDataGaps ?? []),
    ]),
    warnings: dedupe([
      "fixture data is deterministic mock input, not live market data",
      ...(resolved.extraWarnings ?? []),
    ]),
    provenance: {
      source_system: "deterministic_local_fixture",
      source_dataset: "twse_daily_price",
      data_origin: "deterministic_local_fixture_mock",
      data_status: "mock_real",
      live_provider_used: false,
      llm_used: false,
      broker_execution: false,
    },
    metadata: {
      deterministic: true,
      adapter: "market_data_analyst",
    },
  };
}

function buildNonMarketAnalysts(): AiResearchAnalyst[] {
  return [
    {
      analyst_role: "technical",
      display_name: "技術面分析師",
      output_status: "placeholder",
      stance: "mixed",
      score: 0,
      confidence: 0,
      summary: "技術指標尚未接入，暫以佔位輸出。",
      key_points: ["—"],
      evidence: [],
      data_gaps: ["技術指標尚未接入"],
      warnings: [],
      provenance: {
        source_system: "placeholder",
        source_dataset: "not_connected",
        data_origin: "placeholder",
        data_status: "placeholder",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "placeholder",
      },
    },
    {
      analyst_role: "monthly_revenue",
      display_name: "月營收分析師",
      output_status: "missing",
      stance: "unavailable",
      score: 0,
      confidence: 0,
      summary: "月營收資料映射尚未完成。",
      key_points: ["—"],
      evidence: [],
      data_gaps: ["月營收 mapping 待完成"],
      warnings: [],
      provenance: {
        source_system: "not_connected",
        source_dataset: "monthly_revenue",
        data_origin: "missing",
        data_status: "missing",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "missing",
      },
    },
    {
      analyst_role: "financial_statement",
      display_name: "財報分析師",
      output_status: "missing",
      stance: "unavailable",
      score: 0,
      confidence: 0,
      summary: "財報資料尚未接入。",
      key_points: ["—"],
      evidence: [],
      data_gaps: ["財報資料尚未接入"],
      warnings: [],
      provenance: {
        source_system: "not_connected",
        source_dataset: "financial_statement",
        data_origin: "missing",
        data_status: "missing",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "missing",
      },
    },
    {
      analyst_role: "valuation",
      display_name: "估值分析師",
      output_status: "missing",
      stance: "unavailable",
      score: 0,
      confidence: 0,
      summary: "估值資料尚未接入。",
      key_points: ["—"],
      evidence: [],
      data_gaps: ["估值資料待完成"],
      warnings: [],
      provenance: {
        source_system: "not_connected",
        source_dataset: "valuation",
        data_origin: "missing",
        data_status: "missing",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "missing",
      },
    },
    {
      analyst_role: "news_event",
      display_name: "新聞事件分析師",
      output_status: "placeholder",
      stance: "neutral",
      score: 0,
      confidence: 0,
      summary: "新聞事件資料路徑仍為 placeholder。",
      key_points: ["fixture 邊界"],
      evidence: [],
      data_gaps: ["尚未執行 live 事件工具"],
      warnings: [],
      provenance: {
        source_system: "placeholder",
        source_dataset: "news_event",
        data_origin: "placeholder",
        data_status: "placeholder",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "placeholder",
      },
    },
    {
      analyst_role: "chip_institutional",
      display_name: "籌碼 / 法人分析師",
      output_status: "missing",
      stance: "unavailable",
      score: 0,
      confidence: 0,
      summary: "法人 / 籌碼資料尚未接入。",
      key_points: ["—"],
      evidence: [],
      data_gaps: ["法人 / 籌碼資料待完成"],
      warnings: [],
      provenance: {
        source_system: "not_connected",
        source_dataset: "chip_institutional",
        data_origin: "missing",
        data_status: "missing",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "missing",
      },
    },
    {
      analyst_role: "macro_sector",
      display_name: "總經 / 產業分析師",
      output_status: "missing",
      stance: "unavailable",
      score: 0,
      confidence: 0,
      summary: "總經 / 產業資料尚未接入。",
      key_points: ["—"],
      evidence: [],
      data_gaps: ["總經 / 產業資料待完成"],
      warnings: [],
      provenance: {
        source_system: "not_connected",
        source_dataset: "macro_sector",
        data_origin: "missing",
        data_status: "missing",
        live_provider_used: false,
        llm_used: false,
        broker_execution: false,
      },
      metadata: {
        deterministic: true,
        adapter: "missing",
      },
    },
  ];
}

export function buildAiResearchMockResponse(input: BuildAiResearchMockInput): AiResearchMockResponse {
  const ticker = normalizeTicker(input.ticker);
  const asOfDate = normalizeAsOfDate(input.asOfDate);
  const includeSimulation = input.includeSimulation ?? true;
  const marketAnalyst = buildMarketDataAnalyst(ticker, asOfDate);
  const replayFingerprint = buildReplayFingerprint(ticker, asOfDate);
  const runId = buildRunId(ticker, asOfDate);
  const profile = MARKET_PROFILE_BY_TICKER[ticker];

  const warnings = dedupe([
    ...BASELINE_WARNINGS,
    ...(profile?.extraWarnings ?? []),
  ]);
  const dataGaps = dedupe([
    ...BASELINE_DATA_GAPS,
    ...(profile?.extraDataGaps ?? []),
  ]);

  const decisionConfidence = Number((0.52 + marketAnalyst.confidence * 0.14).toFixed(2));

  return {
    run_id: runId,
    ticker,
    as_of_date: asOfDate,
    mode: "mock",
    decision: {
      action: "no_action",
      confidence: decisionConfidence,
      reason: "市場資料可用，但其餘關鍵分析節點仍有資料缺口，暫不採取動作。",
    },
    simulation: {
      order: {
        order_id: `${runId}_order_001`,
        status: includeSimulation ? "rejected" : "proposed",
        side: "buy",
        quantity: 0,
        simulation_only: true,
        broker_execution: false,
        reason: includeSimulation ? "風控審查需要更多資料。" : "未執行模擬流程。",
      },
      fill: null,
      position: {
        ticker,
        quantity: 0,
        average_price: 0,
        market_value: 0,
        unrealized_pnl: 0,
        status: "flat",
      },
    },
    research: {
      analysts: [marketAnalyst, ...buildNonMarketAnalysts()],
      bull_case: {
        status: "placeholder",
        key_points: [
          "價格資料 fixture 結構完整可用。",
          "市場資料路徑具備審計追蹤性。",
          "研究流程可產生可重播的決策記錄。",
          `mock 範圍：${marketAnalyst.key_points[3] ?? "產業範圍未標示"}`,
        ],
      },
      bear_case: {
        status: "placeholder",
        key_points: [
          "本次尚未接入 live 市場資料。",
          "技術面 / 估值 / 基本面資料仍有缺口。",
          "新聞事件訊號仍為 placeholder。",
          "在覆蓋率補齊前應維持保守結論。",
        ],
      },
      trader_proposal: {
        proposed_action: "hold",
        confidence: 0.34,
        summary: "在資料覆蓋不足前維持保守。",
      },
      risk_review: {
        decision: "needs_more_data",
        max_allocation: 0,
        required_user_confirmation: true,
        flags: [
          "技術指標缺失",
          "估值資料缺失",
          "新聞訊號為 placeholder",
          "未使用 live provider",
        ],
      },
      portfolio_decision: {
        action: "no_action",
        confidence: 0,
        rationale: "風控審查尚未通過，投組不採取動作。",
      },
    },
    data_gaps: dataGaps,
    warnings,
    disclaimer:
      "本頁內容僅為研究與模擬用途，不構成投資建議，不保證報酬，亦不會進行任何真實下單。所有決策應由使用者自行判斷。",
    replay_fingerprint: replayFingerprint,
    broker_execution: false,
    simulation_only: true,
    not_investment_advice: true,
  };
}

export const aiResearchMockResponse: AiResearchMockResponse = buildAiResearchMockResponse({
  ticker: "2330",
  asOfDate: "2026-05-13",
  includeSimulation: true,
});

export type AiResearchViewModel = {
  ticker: string;
  asOfDate: string;
  modeLabel: string;
  summary: {
    actionCandidate: string;
    confidence: string;
    riskDecision: string;
    portfolioAction: string;
    simulationStatus: string;
  };
  timelineSteps: Array<{ stage: string; status: string }>;
  analystRows: Array<{
    analyst: string;
    stance: string;
    confidence: number;
    status: "mock-real" | "placeholder" | "missing";
    keyData: string;
    dataGaps: string;
  }>;
  confidenceChartData: Array<{ name: string; confidence: number }>;
  coverageChartData: Array<{ name: string; value: number; colorClass: string }>;
  bullCasePoints: string[];
  bearCasePoints: string[];
  risk: {
    decision: string;
    maxAllocation: string;
    requiredUserConfirmation: string;
    flags: string[];
  };
  order: {
    status: string;
    simulationOnly: string;
    brokerExecution: string;
    reason: string;
  };
  dataGaps: string[];
  warnings: string[];
  disclaimer: string;
  replayFingerprint: string;
  runId: string;
  safetyFlags: {
    brokerExecution: string;
    simulationOnly: string;
    notInvestmentAdvice: string;
  };
};

function mapStanceLabel(stance: AiResearchAnalystStance): string {
  if (stance === "neutral") return "中性";
  if (stance === "mixed") return "分歧";
  return "尚無資料";
}

function mapActionLabel(action: AiResearchMockResponse["decision"]["action"]): string {
  if (action === "hold") return "持有 / 觀望";
  if (action === "avoid") return "避免";
  return "不採取動作";
}

function mapStatusLabel(status: AiResearchAnalystStatus): "mock-real" | "placeholder" | "missing" {
  if (status === "mock_real") return "mock-real";
  return status;
}

function mapTimeline(response: AiResearchMockResponse): Array<{ stage: string; status: string }> {
  const marketData = response.research.analysts.find((item) => item.analyst_role === "market_data");
  const analystStatus = response.research.analysts.some((item) => item.output_status === "mock_real")
    ? "部分完成"
    : "佔位";

  return [
    { stage: "市場資料", status: marketData?.output_status === "mock_real" ? "mock-real" : "佔位" },
    { stage: "分析師", status: analystStatus },
    { stage: "多空研究", status: response.research.bull_case.status === "placeholder" ? "佔位" : "完成" },
    { stage: "交易提案", status: "保守" },
    { stage: "風控", status: response.research.risk_review.decision === "needs_more_data" ? "需更多資料" : "已檢查" },
    { stage: "投組", status: response.research.portfolio_decision.action === "no_action" ? "不採取動作" : "已更新" },
    { stage: "模擬訂單", status: response.simulation_only ? "紙上模擬" : "非模擬" },
  ];
}

export function mapAiResearchResponseToViewModel(response: AiResearchMockResponse): AiResearchViewModel {
  const analystRows = response.research.analysts.map((analyst) => ({
    analyst: analyst.display_name,
    stance: mapStanceLabel(analyst.stance),
    confidence: analyst.confidence,
    status: mapStatusLabel(analyst.output_status),
    keyData: analyst.key_points[0] ?? "—",
    dataGaps: analyst.data_gaps[0] ?? "—",
  }));

  const coverage = {
    available: analystRows.filter((item) => item.status === "mock-real").length,
    placeholder: analystRows.filter((item) => item.status === "placeholder").length,
    missing: analystRows.filter((item) => item.status === "missing").length,
  };

  return {
    ticker: response.ticker,
    asOfDate: response.as_of_date,
    modeLabel: response.mode === "mock" ? "Mock" : response.mode,
    summary: {
      actionCandidate: mapActionLabel(response.decision.action),
      confidence: response.decision.confidence.toFixed(2),
      riskDecision: response.research.risk_review.decision === "needs_more_data" ? "需要更多資料" : "已完成",
      portfolioAction:
        response.research.portfolio_decision.action === "no_action"
          ? "不採取動作"
          : response.research.portfolio_decision.action,
      simulationStatus: response.simulation_only ? "僅紙上模擬" : "非模擬",
    },
    timelineSteps: mapTimeline(response),
    analystRows,
    confidenceChartData: analystRows.map((row) => ({
      name: row.analyst,
      confidence: row.confidence,
    })),
    coverageChartData: [
      { name: "可用", value: coverage.available, colorClass: "bg-slate-900" },
      { name: "佔位", value: coverage.placeholder, colorClass: "bg-slate-500" },
      { name: "缺資料", value: coverage.missing, colorClass: "bg-slate-300" },
    ],
    bullCasePoints: response.research.bull_case.key_points,
    bearCasePoints: response.research.bear_case.key_points,
    risk: {
      decision: response.research.risk_review.decision === "needs_more_data" ? "需要更多資料" : "已完成",
      maxAllocation: `${response.research.risk_review.max_allocation}%`,
      requiredUserConfirmation: response.research.risk_review.required_user_confirmation ? "是" : "否",
      flags: response.research.risk_review.flags,
    },
    order: {
      status: response.simulation.order.status === "rejected" ? "拒絕 / 不採取動作" : response.simulation.order.status,
      simulationOnly: String(response.simulation_only),
      brokerExecution: String(response.broker_execution),
      reason: response.simulation.order.reason,
    },
    dataGaps: response.data_gaps,
    warnings: response.warnings,
    disclaimer: response.disclaimer,
    replayFingerprint: response.replay_fingerprint,
    runId: response.run_id,
    safetyFlags: {
      brokerExecution: String(response.broker_execution),
      simulationOnly: String(response.simulation_only),
      notInvestmentAdvice: String(response.not_investment_advice),
    },
  };
}
