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
    [key: string]: string | number | boolean;
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
  availability?: {
    market_price?: {
      ticker: string;
      market: string;
      dataset: string;
      requested_start_date?: string;
      requested_end_date?: string;
      available: boolean;
      readiness: "ready" | "partial" | "beta_limited" | "unavailable";
      agent_action: "proceed" | "fallback" | "skip" | "needs_more_data";
      min_date?: string;
      max_date?: string;
      rows_in_range: number;
      ohlc_null_rows: number;
      volume_null_rows: number;
      duplicate_groups: number;
      freshness: string;
      data_gaps: string[];
      warnings: string[];
      metadata?: Record<string, string | number | boolean | null>;
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

type AiResearchAvailability = NonNullable<AiResearchMockResponse["availability"]>["market_price"];

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

function normalizeTickerForAvailability(ticker: string): {
  symbol: string;
  market: "twse" | "tpex";
} {
  const normalized = normalizeTicker(ticker);
  if (normalized.startsWith("TPEX:")) {
    const symbol = normalized.split(":", 2)[1] ?? "";
    return { symbol: symbol || "6488", market: "tpex" };
  }
  if (normalized.startsWith("TWSE:")) {
    const symbol = normalized.split(":", 2)[1] ?? "";
    return { symbol: symbol || "2330", market: "twse" };
  }
  return { symbol: normalized, market: "twse" };
}

function shiftDate(asOfDate: string, days: number): string {
  const d = new Date(`${asOfDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

function buildMarketPriceAvailability(ticker: string, asOfDate: string): AiResearchAvailability {
  const normalized = normalizeTickerForAvailability(ticker);
  const requestedStartDate = shiftDate(asOfDate, -182);
  const requestedEndDate = asOfDate;

  if (normalized.market === "tpex") {
    return {
      ticker: normalized.symbol,
      market: "tpex",
      dataset: "tpex_daily_price",
      requested_start_date: requestedStartDate,
      requested_end_date: requestedEndDate,
      available: true,
      readiness: "beta_limited",
      agent_action: "fallback",
      min_date: requestedEndDate,
      max_date: requestedEndDate,
      rows_in_range: 1,
      ohlc_null_rows: 0,
      volume_null_rows: 0,
      duplicate_groups: 0,
      freshness: "current",
      data_gaps: ["tpex_historical_depth_deferred"],
      warnings: ["tpex_latest_day_limited_for_historical_requests"],
      metadata: { source: "deterministic_local_availability_fixture" },
    };
  }

  if (normalized.symbol === "UNKNOWN") {
    return {
      ticker: normalized.symbol,
      market: "twse",
      dataset: "twse_daily_price",
      requested_start_date: requestedStartDate,
      requested_end_date: requestedEndDate,
      available: false,
      readiness: "unavailable",
      agent_action: "skip",
      min_date: undefined,
      max_date: undefined,
      rows_in_range: 0,
      ohlc_null_rows: 0,
      volume_null_rows: 0,
      duplicate_groups: 0,
      freshness: "unknown",
      data_gaps: ["ticker_not_found_in_market_price_dataset"],
      warnings: [],
      metadata: { source: "deterministic_local_availability_fixture" },
    };
  }

  if (normalized.symbol === "2317") {
    return {
      ticker: normalized.symbol,
      market: "twse",
      dataset: "twse_daily_price",
      requested_start_date: requestedStartDate,
      requested_end_date: requestedEndDate,
      available: true,
      readiness: "partial",
      agent_action: "fallback",
      min_date: "2000-03-01",
      max_date: requestedEndDate,
      rows_in_range: 114,
      ohlc_null_rows: 1,
      volume_null_rows: 0,
      duplicate_groups: 0,
      freshness: "current",
      data_gaps: ["ohlc_null_rows_in_requested_range"],
      warnings: [],
      metadata: { source: "deterministic_local_availability_fixture" },
    };
  }

  if (["2330", "2454", "2308", "3008", "3030", "1101", "2882"].includes(normalized.symbol)) {
    return {
      ticker: normalized.symbol,
      market: "twse",
      dataset: "twse_daily_price",
      requested_start_date: requestedStartDate,
      requested_end_date: requestedEndDate,
      available: true,
      readiness: "ready",
      agent_action: "proceed",
      min_date: "2000-03-01",
      max_date: requestedEndDate,
      rows_in_range: 114,
      ohlc_null_rows: 0,
      volume_null_rows: 0,
      duplicate_groups: 0,
      freshness: "current",
      data_gaps: [],
      warnings: [],
      metadata: { source: "deterministic_local_availability_fixture" },
    };
  }

  return {
    ticker: normalized.symbol,
    market: "twse",
    dataset: "twse_daily_price",
    requested_start_date: requestedStartDate,
    requested_end_date: requestedEndDate,
    available: true,
    readiness: "partial",
    agent_action: "fallback",
    min_date: "2000-03-01",
    max_date: requestedEndDate,
    rows_in_range: 60,
    ohlc_null_rows: 0,
    volume_null_rows: 0,
    duplicate_groups: 0,
    freshness: "current",
    data_gaps: ["market_price_fixture_coverage_limited_for_ticker"],
    warnings: ["deterministic local availability fixture used"],
    metadata: { source: "deterministic_local_availability_fixture" },
  };
}

function buildMarketDataAnalyst(
  ticker: string,
  asOfDate: string,
  availability: AiResearchAvailability,
): AiResearchAnalyst {
  const profile = MARKET_PROFILE_BY_TICKER[ticker];
  const fallbackProfile: MarketProfile = {
    confidence: 0.5,
    sectorHint: "一般產業",
    profileNote: "local fixture coverage 僅提供基本市場資料樣本。",
    extraDataGaps: ["mock fixture coverage is limited for this ticker"],
  };
  const resolved = profile ?? fallbackProfile;
  const price = buildDeterministicPrice(ticker, asOfDate);

  const isUnavailable =
    availability.readiness === "unavailable" || availability.agent_action === "skip";
  const isFallback =
    availability.readiness === "partial" ||
    availability.readiness === "beta_limited" ||
    availability.agent_action === "fallback" ||
    availability.agent_action === "needs_more_data";

  const confidence = isUnavailable
    ? 0
    : isFallback
      ? Number(Math.max(0, resolved.confidence - 0.2).toFixed(2))
      : resolved.confidence;

  return {
    analyst_role: "market_data",
    display_name: "市場資料分析師",
    output_status: isUnavailable ? "missing" : "mock_real",
    stance: isUnavailable ? "unavailable" : "neutral",
    score: 0,
    confidence,
    summary: isUnavailable
      ? "市場價格資料不可用，已回退為缺資料輸出。"
      : "市場資料已可用，但尚未啟用完整趨勢模型，因此維持中性判讀。",
    key_points: isUnavailable
      ? ["availability preflight indicates unavailable/skip"]
      : [
          "TWSE 日線價格 fixture 可用",
          `收盤價 ${price.close.toLocaleString("en-US")} 可用`,
          `成交量 ${price.volume.toLocaleString("en-US")} 可用`,
          `產業範圍：${resolved.sectorHint}`,
          resolved.profileNote,
        ],
    evidence: isUnavailable
      ? []
      : [
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
      ...availability.data_gaps,
      ...(resolved.extraDataGaps ?? []),
    ]),
    warnings: dedupe([
      "fixture data is deterministic mock input, not live market data",
      ...availability.warnings,
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
      availability_readiness: availability.readiness,
      availability_agent_action: availability.agent_action,
      availability_rows_in_range: availability.rows_in_range,
      availability_ohlc_null_rows: availability.ohlc_null_rows,
      availability_volume_null_rows: availability.volume_null_rows,
      availability_duplicate_groups: availability.duplicate_groups,
      availability_freshness: availability.freshness,
      availability_market: availability.market,
      availability_dataset: availability.dataset,
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
  const normalizedTicker = normalizeTickerForAvailability(input.ticker);
  const ticker = normalizedTicker.symbol;
  const asOfDate = normalizeAsOfDate(input.asOfDate);
  const includeSimulation = input.includeSimulation ?? true;
  const availability = buildMarketPriceAvailability(input.ticker, asOfDate);
  const marketAnalyst = buildMarketDataAnalyst(ticker, asOfDate, availability);
  const replayFingerprint = buildReplayFingerprint(ticker, asOfDate);
  const runId = buildRunId(ticker, asOfDate);
  const profile = MARKET_PROFILE_BY_TICKER[ticker];

  const warnings = dedupe([
    ...BASELINE_WARNINGS,
    ...availability.warnings,
    ...(profile?.extraWarnings ?? []),
  ]);
  const dataGaps = dedupe([
    ...BASELINE_DATA_GAPS,
    ...availability.data_gaps,
    ...(profile?.extraDataGaps ?? []),
  ]);

  const decisionConfidence = Number((0.52 + marketAnalyst.confidence * 0.14).toFixed(2));
  const decisionReason =
    availability.readiness === "unavailable" || availability.agent_action === "skip"
      ? "找不到此 ticker 的市場價格資料，研究流程已保守降級。"
      : availability.readiness === "partial" || availability.readiness === "beta_limited"
        ? "市場資料存在覆蓋限制，研究流程已保守降級並維持不採取動作。"
        : "市場資料可用，但其餘關鍵分析節點仍有資料缺口，暫不採取動作。";

  return {
    run_id: runId,
    ticker,
    as_of_date: asOfDate,
    mode: "mock",
    decision: {
      action: "no_action",
      confidence: decisionConfidence,
      reason: decisionReason,
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
    availability: {
      market_price: availability,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.filter((item): item is string => typeof item === "string");
  return items;
}

function parseAnalystRole(value: unknown): AiResearchAnalystRole | null {
  const role = asString(value);
  if (
    role === "market_data" ||
    role === "technical" ||
    role === "monthly_revenue" ||
    role === "financial_statement" ||
    role === "valuation" ||
    role === "news_event" ||
    role === "chip_institutional" ||
    role === "macro_sector"
  ) {
    return role;
  }
  return null;
}

function parseOutputStatus(value: unknown): AiResearchAnalystStatus | null {
  const status = asString(value);
  if (status === "mock_real" || status === "placeholder" || status === "missing") {
    return status;
  }
  if (status === "mock-real") {
    return "mock_real";
  }
  return null;
}

function parseStance(value: unknown): AiResearchAnalystStance | null {
  const stance = asString(value);
  if (stance === "neutral" || stance === "mixed" || stance === "unavailable") {
    return stance;
  }
  return null;
}

function parseAvailabilityReadiness(
  value: unknown,
): AiResearchAvailability["readiness"] | null {
  const readiness = asString(value);
  if (
    readiness === "ready" ||
    readiness === "partial" ||
    readiness === "beta_limited" ||
    readiness === "unavailable"
  ) {
    return readiness;
  }
  return null;
}

function parseAvailabilityAgentAction(
  value: unknown,
): AiResearchAvailability["agent_action"] | null {
  const action = asString(value);
  if (
    action === "proceed" ||
    action === "fallback" ||
    action === "skip" ||
    action === "needs_more_data"
  ) {
    return action;
  }
  return null;
}

function normalizeAvailability(
  raw: unknown,
  fallback: AiResearchAvailability,
): AiResearchAvailability {
  if (!isRecord(raw)) {
    return fallback;
  }
  return {
    ticker: asString(raw.ticker) ?? fallback.ticker,
    market: asString(raw.market) ?? fallback.market,
    dataset: asString(raw.dataset) ?? fallback.dataset,
    requested_start_date:
      asString(raw.requested_start_date) ?? fallback.requested_start_date,
    requested_end_date:
      asString(raw.requested_end_date) ?? fallback.requested_end_date,
    available: asBoolean(raw.available) ?? fallback.available,
    readiness:
      parseAvailabilityReadiness(raw.readiness) ?? fallback.readiness,
    agent_action:
      parseAvailabilityAgentAction(raw.agent_action) ?? fallback.agent_action,
    min_date: asString(raw.min_date) ?? fallback.min_date,
    max_date: asString(raw.max_date) ?? fallback.max_date,
    rows_in_range: asNumber(raw.rows_in_range) ?? fallback.rows_in_range,
    ohlc_null_rows: asNumber(raw.ohlc_null_rows) ?? fallback.ohlc_null_rows,
    volume_null_rows:
      asNumber(raw.volume_null_rows) ?? fallback.volume_null_rows,
    duplicate_groups:
      asNumber(raw.duplicate_groups) ?? fallback.duplicate_groups,
    freshness: asString(raw.freshness) ?? fallback.freshness,
    data_gaps: asStringArray(raw.data_gaps) ?? fallback.data_gaps,
    warnings: asStringArray(raw.warnings) ?? fallback.warnings,
    metadata: isRecord(raw.metadata)
      ? (raw.metadata as Record<string, string | number | boolean | null>)
      : fallback.metadata,
  };
}

function normalizeAnalyst(
  raw: unknown,
  fallback: AiResearchAnalyst,
): AiResearchAnalyst {
  if (!isRecord(raw)) {
    return fallback;
  }

  const evidence = Array.isArray(raw.evidence)
    ? raw.evidence
        .filter(isRecord)
        .map((item) => ({
          dataset: asString(item.dataset) ?? fallback.provenance.source_dataset,
          field: asString(item.field) ?? "field",
          value:
            typeof item.value === "string" || typeof item.value === "number"
              ? item.value
              : "n/a",
          interpretation:
            asString(item.interpretation) ??
            "來源資料可用，僅供 mock 研究流程顯示。",
        }))
    : fallback.evidence;

  const provenance = isRecord(raw.provenance)
    ? {
        source_system:
          asString(raw.provenance.source_system) ?? fallback.provenance.source_system,
        source_dataset:
          asString(raw.provenance.source_dataset) ?? fallback.provenance.source_dataset,
        data_origin:
          asString(raw.provenance.data_origin) ?? fallback.provenance.data_origin,
        data_status:
          asString(raw.provenance.data_status) ?? fallback.provenance.data_status,
        live_provider_used:
          asBoolean(raw.provenance.live_provider_used) ??
          fallback.provenance.live_provider_used,
        llm_used: asBoolean(raw.provenance.llm_used) ?? fallback.provenance.llm_used,
        broker_execution:
          asBoolean(raw.provenance.broker_execution) ??
          fallback.provenance.broker_execution,
      }
    : fallback.provenance;

  const metadata = isRecord(raw.metadata)
    ? {
        deterministic:
          asBoolean(raw.metadata.deterministic) ?? fallback.metadata.deterministic,
        adapter: asString(raw.metadata.adapter) ?? fallback.metadata.adapter,
      }
    : fallback.metadata;

  return {
    ...fallback,
    display_name: asString(raw.display_name) ?? fallback.display_name,
    output_status: parseOutputStatus(raw.output_status) ?? fallback.output_status,
    stance: parseStance(raw.stance) ?? fallback.stance,
    score: asNumber(raw.score) ?? fallback.score,
    confidence: asNumber(raw.confidence) ?? fallback.confidence,
    summary: asString(raw.summary) ?? fallback.summary,
    key_points: asStringArray(raw.key_points) ?? fallback.key_points,
    evidence,
    data_gaps: asStringArray(raw.data_gaps) ?? fallback.data_gaps,
    warnings: asStringArray(raw.warnings) ?? fallback.warnings,
    provenance,
    metadata,
  };
}

function normalizeSimulation(
  raw: unknown,
  fallback: AiResearchMockResponse["simulation"],
): AiResearchMockResponse["simulation"] {
  if (!isRecord(raw)) {
    return fallback;
  }

  if (raw.status === "skipped") {
    return {
      order: {
        ...fallback.order,
        status: "rejected",
        reason: "未執行模擬流程。",
      },
      fill: null,
      position: {
        ...fallback.position,
        status: "flat",
      },
    };
  }

  if (!isRecord(raw.order) || !isRecord(raw.position)) {
    return fallback;
  }

  return {
    order: {
      ...fallback.order,
      status: raw.order.status === "proposed" ? "proposed" : "rejected",
      quantity: asNumber(raw.order.quantity) ?? fallback.order.quantity,
      reason: asString(raw.order.reason) ?? fallback.order.reason,
      simulation_only:
        asBoolean(raw.order.simulation_only) === true
          ? true
          : fallback.order.simulation_only,
      broker_execution:
        asBoolean(raw.order.broker_execution) === false
          ? false
          : fallback.order.broker_execution,
    },
    fill: null,
    position: {
      ...fallback.position,
      ticker: asString(raw.position.ticker) ?? fallback.position.ticker,
      quantity: asNumber(raw.position.quantity) ?? fallback.position.quantity,
      average_price:
        asNumber(raw.position.average_price) ?? fallback.position.average_price,
      market_value: asNumber(raw.position.market_value) ?? fallback.position.market_value,
      unrealized_pnl:
        asNumber(raw.position.unrealized_pnl) ?? fallback.position.unrealized_pnl,
      status: raw.position.status === "flat" ? "flat" : fallback.position.status,
    },
  };
}

export function normalizeAiResearchResponse(
  response: unknown,
  fallbackInput?: BuildAiResearchMockInput,
): AiResearchMockResponse {
  const fallback = buildAiResearchMockResponse({
    ticker: fallbackInput?.ticker ?? "2330",
    asOfDate: fallbackInput?.asOfDate ?? "2026-05-13",
    includeSimulation: fallbackInput?.includeSimulation ?? true,
  });

  if (!isRecord(response)) {
    return fallback;
  }

  const ticker = normalizeTicker(asString(response.ticker) ?? fallback.ticker);
  const asOfDate = normalizeAsOfDate(asString(response.as_of_date) ?? fallback.as_of_date);

  const base = buildAiResearchMockResponse({
    ticker,
    asOfDate,
    includeSimulation: fallbackInput?.includeSimulation ?? true,
  });

  const decision = isRecord(response.decision)
    ? {
        action:
          response.decision.action === "hold" ||
          response.decision.action === "avoid" ||
          response.decision.action === "no_action"
            ? response.decision.action
            : base.decision.action,
        confidence:
          asNumber(response.decision.confidence) ?? base.decision.confidence,
        reason: asString(response.decision.reason) ?? base.decision.reason,
      }
    : base.decision;

  const availability =
    isRecord(response.availability) && isRecord(response.availability.market_price)
      ? {
          market_price: normalizeAvailability(
            response.availability.market_price,
            base.availability?.market_price ?? buildMarketPriceAvailability(ticker, asOfDate),
          ),
        }
      : base.availability;

  let analysts = base.research.analysts;
  if (isRecord(response.research) && Array.isArray(response.research.analysts)) {
    const byRole = new Map<AiResearchAnalystRole, AiResearchAnalyst>();
    for (const fallbackAnalyst of base.research.analysts) {
      byRole.set(fallbackAnalyst.analyst_role, fallbackAnalyst);
    }
    const parsed = response.research.analysts
      .filter(isRecord)
      .map((item) => {
        const role = parseAnalystRole(item.analyst_role);
        if (!role) return null;
        const fallbackAnalyst = byRole.get(role);
        if (!fallbackAnalyst) return null;
        return normalizeAnalyst(item, fallbackAnalyst);
      })
      .filter((item): item is AiResearchAnalyst => item !== null);
    if (parsed.length > 0) {
      analysts = parsed;
    }
  }

  return {
    ...base,
    run_id: asString(response.run_id) ?? base.run_id,
    mode: response.mode === "mock" ? "mock" : base.mode,
    decision,
    simulation: normalizeSimulation(response.simulation, base.simulation),
    research: {
      ...base.research,
      analysts,
      bull_case:
        isRecord(response.research) && isRecord(response.research.bull_case)
          ? {
              status:
                response.research.bull_case.status === "placeholder"
                  ? "placeholder"
                  : base.research.bull_case.status,
              key_points:
                asStringArray(response.research.bull_case.key_points) ??
                base.research.bull_case.key_points,
            }
          : base.research.bull_case,
      bear_case:
        isRecord(response.research) && isRecord(response.research.bear_case)
          ? {
              status:
                response.research.bear_case.status === "placeholder"
                  ? "placeholder"
                  : base.research.bear_case.status,
              key_points:
                asStringArray(response.research.bear_case.key_points) ??
                base.research.bear_case.key_points,
            }
          : base.research.bear_case,
      trader_proposal:
        isRecord(response.research) && isRecord(response.research.trader_proposal)
          ? {
              proposed_action:
                response.research.trader_proposal.proposed_action === "avoid"
                  ? "avoid"
                  : "hold",
              confidence:
                asNumber(response.research.trader_proposal.confidence) ??
                base.research.trader_proposal.confidence,
              summary:
                asString(response.research.trader_proposal.summary) ??
                base.research.trader_proposal.summary,
            }
          : base.research.trader_proposal,
      risk_review:
        isRecord(response.research) && isRecord(response.research.risk_review)
          ? {
              decision:
                response.research.risk_review.decision === "needs_more_data"
                  ? "needs_more_data"
                  : base.research.risk_review.decision,
              max_allocation:
                asNumber(response.research.risk_review.max_allocation) ??
                base.research.risk_review.max_allocation,
              required_user_confirmation:
                asBoolean(response.research.risk_review.required_user_confirmation) ??
                base.research.risk_review.required_user_confirmation,
              flags:
                asStringArray(response.research.risk_review.flags) ??
                base.research.risk_review.flags,
            }
          : base.research.risk_review,
      portfolio_decision:
        isRecord(response.research) && isRecord(response.research.portfolio_decision)
          ? {
              action:
                response.research.portfolio_decision.action === "no_action"
                  ? "no_action"
                  : base.research.portfolio_decision.action,
              confidence:
                asNumber(response.research.portfolio_decision.confidence) ??
                base.research.portfolio_decision.confidence,
              rationale:
                asString(response.research.portfolio_decision.rationale) ??
                base.research.portfolio_decision.rationale,
            }
          : base.research.portfolio_decision,
    },
    availability,
    data_gaps: asStringArray(response.data_gaps) ?? base.data_gaps,
    warnings: asStringArray(response.warnings) ?? base.warnings,
    disclaimer: asString(response.disclaimer) ?? base.disclaimer,
    replay_fingerprint:
      asString(response.replay_fingerprint) ?? base.replay_fingerprint,
    broker_execution:
      asBoolean(response.broker_execution) === false ? false : base.broker_execution,
    simulation_only:
      asBoolean(response.simulation_only) === true ? true : base.simulation_only,
    not_investment_advice:
      asBoolean(response.not_investment_advice) === true
        ? true
        : base.not_investment_advice,
  };
}

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
  availabilitySummary: {
    label: string;
    readiness: string;
    agentAction: string;
    statusTone: "ready" | "fallback" | "skip" | "neutral";
    rowsInRange: string;
    coverageWindow: string;
    qualityNotes: string[];
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

function formatAvailabilityLabel(readiness: string, action: string): string {
  return `${readiness} / ${action}`;
}

function toAvailabilityTone(
  readiness: AiResearchAvailability["readiness"],
  action: AiResearchAvailability["agent_action"],
): "ready" | "fallback" | "skip" | "neutral" {
  if (readiness === "ready" && action === "proceed") return "ready";
  if (readiness === "unavailable" || action === "skip") return "skip";
  if (
    readiness === "partial" ||
    readiness === "beta_limited" ||
    action === "fallback" ||
    action === "needs_more_data"
  ) {
    return "fallback";
  }
  return "neutral";
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

export function mapAiResearchResponseToViewModel(response: unknown): AiResearchViewModel {
  const normalized = normalizeAiResearchResponse(response);
  const marketAvailability =
    normalized.availability?.market_price ?? buildMarketPriceAvailability(normalized.ticker, normalized.as_of_date);
  const availabilityTone = toAvailabilityTone(
    marketAvailability.readiness,
    marketAvailability.agent_action,
  );
  const qualityNotes = dedupe([
    `OHLC 缺口：${marketAvailability.ohlc_null_rows}`,
    `成交量缺口：${marketAvailability.volume_null_rows}`,
    `重複筆數群組：${marketAvailability.duplicate_groups}`,
    `freshness：${marketAvailability.freshness}`,
    ...marketAvailability.data_gaps.slice(0, 2),
    ...marketAvailability.warnings.slice(0, 1),
  ]);

  const analystRows = normalized.research.analysts.map((analyst) => ({
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
    ticker: normalized.ticker,
    asOfDate: normalized.as_of_date,
    modeLabel: normalized.mode === "mock" ? "Mock" : normalized.mode,
    summary: {
      actionCandidate: mapActionLabel(normalized.decision.action),
      confidence: normalized.decision.confidence.toFixed(2),
      riskDecision: normalized.research.risk_review.decision === "needs_more_data" ? "需要更多資料" : "已完成",
      portfolioAction:
        normalized.research.portfolio_decision.action === "no_action"
          ? "不採取動作"
          : normalized.research.portfolio_decision.action,
      simulationStatus: normalized.simulation_only ? "僅紙上模擬" : "非模擬",
    },
    availabilitySummary: {
      label: formatAvailabilityLabel(
        marketAvailability.readiness,
        marketAvailability.agent_action,
      ),
      readiness: marketAvailability.readiness,
      agentAction: marketAvailability.agent_action,
      statusTone: availabilityTone,
      rowsInRange: String(marketAvailability.rows_in_range),
      coverageWindow: `${marketAvailability.requested_start_date ?? "n/a"} → ${marketAvailability.requested_end_date ?? "n/a"}`,
      qualityNotes,
    },
    timelineSteps: mapTimeline(normalized),
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
    bullCasePoints: normalized.research.bull_case.key_points,
    bearCasePoints: normalized.research.bear_case.key_points,
    risk: {
      decision: normalized.research.risk_review.decision === "needs_more_data" ? "需要更多資料" : "已完成",
      maxAllocation: `${normalized.research.risk_review.max_allocation}%`,
      requiredUserConfirmation: normalized.research.risk_review.required_user_confirmation ? "是" : "否",
      flags: normalized.research.risk_review.flags,
    },
    order: {
      status:
        normalized.simulation.order.status === "rejected"
          ? "拒絕 / 不採取動作"
          : normalized.simulation.order.status,
      simulationOnly: String(normalized.simulation_only),
      brokerExecution: String(normalized.broker_execution),
      reason: normalized.simulation.order.reason,
    },
    dataGaps: normalized.data_gaps,
    warnings: normalized.warnings,
    disclaimer: normalized.disclaimer,
    replayFingerprint: normalized.replay_fingerprint,
    runId: normalized.run_id,
    safetyFlags: {
      brokerExecution: String(normalized.broker_execution),
      simulationOnly: String(normalized.simulation_only),
      notInvestmentAdvice: String(normalized.not_investment_advice),
    },
  };
}
