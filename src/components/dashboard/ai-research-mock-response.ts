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

export const aiResearchMockResponse: AiResearchMockResponse = {
  run_id: "research_firm_mock_2330_2026-05-13_mock_b846f8a4a9f7d1e2",
  ticker: "2330",
  as_of_date: "2026-05-13",
  mode: "mock",
  decision: {
    action: "no_action",
    confidence: 0.62,
    reason: "市場資料可用，但其餘關鍵分析節點仍有資料缺口，暫不採取動作。",
  },
  simulation: {
    order: {
      order_id: "research_firm_mock_2330_2026-05-13_mock_order_001",
      status: "rejected",
      side: "buy",
      quantity: 0,
      simulation_only: true,
      broker_execution: false,
      reason: "風控審查需要更多資料。",
    },
    fill: null,
    position: {
      ticker: "2330",
      quantity: 0,
      average_price: 0,
      market_value: 0,
      unrealized_pnl: 0,
      status: "flat",
    },
  },
  research: {
    analysts: [
      {
        analyst_role: "market_data",
        display_name: "市場資料分析師",
        output_status: "mock_real",
        stance: "neutral",
        score: 0,
        confidence: 0.72,
        summary: "市場資料已可用，但尚未啟用完整趨勢模型，因此維持中性判讀。",
        key_points: [
          "TWSE 日線價格 fixture 可用",
          "收盤價 970.0 可用",
          "成交量 35,000,000 可用",
        ],
        evidence: [
          {
            dataset: "twse_daily_price",
            field: "price.close",
            value: 970.0,
            interpretation: "收盤價由 deterministic fixture 提供，僅供 mock 研究流程使用。",
          },
        ],
        data_gaps: [
          "live read 尚未接入",
          "fixture-only payload excludes technical, fundamentals, and news datasets",
        ],
        warnings: ["fixture data is deterministic mock input, not live market data"],
        provenance: {
          source_system: "deterministic_local_fixture",
          source_dataset: "twse_daily_price",
          data_origin: "feature_engine_fixture",
          data_status: "mock_real",
          live_provider_used: false,
          llm_used: false,
          broker_execution: false,
        },
        metadata: {
          deterministic: true,
          adapter: "market_data_analyst",
        },
      },
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
    ],
    bull_case: {
      status: "placeholder",
      key_points: [
        "價格資料 fixture 結構完整可用。",
        "市場資料路徑具備審計追蹤性。",
        "研究流程可產生可重播的決策記錄。",
        "未來接入 TWSE read-only 後可提升信心。",
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
      flags: ["技術指標缺失", "估值資料缺失", "新聞訊號為 placeholder", "未使用 live provider"],
    },
    portfolio_decision: {
      action: "no_action",
      confidence: 0.0,
      rationale: "風控審查尚未通過，投組不採取動作。",
    },
  },
  data_gaps: [
    "技術指標尚未接入。",
    "月營收 mapping 待完成。",
    "財報資料 adapter 尚未接入。",
    "估值資料待完成。",
    "此 mock run 尚未執行 NewsEventTool。",
    "TPEx 歷史深度資料仍待補齊。",
  ],
  warnings: [
    "僅 mock 模式。",
    "非投資建議。",
    "未使用 live provider。",
    "不進行券商下單。",
    "使用者需自行做最終決策。",
  ],
  disclaimer:
    "本頁內容僅為研究與模擬用途，不構成投資建議，不保證報酬，亦不會進行任何真實下單。所有決策應由使用者自行判斷。",
  replay_fingerprint: "rf_2330_20260513_mock",
  broker_execution: false,
  simulation_only: true,
  not_investment_advice: true,
};

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
    { stage: "模擬訂單", status: response.simulation.order.simulation_only ? "紙上模擬" : "非模擬" },
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
        response.research.portfolio_decision.action === "no_action" ? "不採取動作" : response.research.portfolio_decision.action,
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
      status:
        response.simulation.order.status === "rejected"
          ? "拒絕 / 不採取動作"
          : response.simulation.order.status,
      simulationOnly: String(response.simulation_only),
      brokerExecution: String(response.broker_execution),
      reason: response.simulation.order.reason,
    },
    dataGaps: response.data_gaps,
    warnings: response.warnings,
    disclaimer: response.disclaimer,
    replayFingerprint: response.replay_fingerprint,
  };
}
