import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAiResearchMockResponse,
  mapAiResearchResponseToViewModel,
  normalizeAiResearchResponse,
} from '../src/components/dashboard/ai-research-mock-response.ts';

test('local mock response maps to view model', () => {
  const response = buildAiResearchMockResponse({
    ticker: '2330',
    asOfDate: '2026-05-13',
    includeSimulation: true,
  });
  const view = mapAiResearchResponseToViewModel(response);
  assert.equal(view.ticker, '2330');
  assert.equal(view.analystRows[0].analyst, '市場資料分析師');
  assert.equal(view.analystRows[0].status, 'mock-real');
  assert.equal(response.availability?.market_price?.readiness, 'ready');
  assert.equal(response.availability?.market_price?.agent_action, 'proceed');
  assert.equal(view.availabilitySummary.readiness, 'ready');
  assert.equal(view.availabilitySummary.agentAction, 'proceed');
});

test('tw-ai-like response normalizes and keeps market_data mock_real', () => {
  const upstreamLike = {
    run_id: 'run_demo',
    ticker: '2454',
    as_of_date: '2026-05-13',
    mode: 'mock',
    decision: {
      action: 'hold',
      confidence: 0.61,
      reason: 'mock',
    },
    simulation: {
      order: {
        status: 'rejected',
        quantity: 0,
        reason: 'needs data',
        simulation_only: true,
        broker_execution: false,
      },
      fill: null,
      position: {
        ticker: '2454',
        quantity: 0,
        average_price: 0,
        market_value: 0,
        unrealized_pnl: 0,
        status: 'flat',
      },
    },
    research: {
      analysts: [
        {
          analyst_role: 'market_data',
          display_name: '市場資料分析師',
          output_status: 'mock_real',
          stance: 'neutral',
          score: 0,
          confidence: 0.64,
          summary: 'mock',
          key_points: ['TWSE 日線價格 fixture 可用'],
          evidence: [{ dataset: 'twse_daily_price', field: 'price.close', value: 100, interpretation: 'fixture' }],
          data_gaps: ['live read 尚未接入'],
          warnings: [],
          provenance: {
            source_system: 'deterministic_local_fixture',
            source_dataset: 'twse_daily_price',
            data_origin: 'deterministic_local_fixture_mock',
            data_status: 'mock_real',
            live_provider_used: false,
            llm_used: false,
            broker_execution: false,
          },
          metadata: {
            deterministic: true,
            adapter: 'market_data_analyst',
          },
        },
      ],
      bull_case: { status: 'placeholder', key_points: ['a'] },
      bear_case: { status: 'placeholder', key_points: ['b'] },
      trader_proposal: { proposed_action: 'hold', confidence: 0.3, summary: 's' },
      risk_review: { decision: 'needs_more_data', max_allocation: 0, required_user_confirmation: true, flags: ['x'] },
      portfolio_decision: { action: 'no_action', confidence: 0, rationale: 'r' },
    },
    data_gaps: ['x'],
    warnings: ['w'],
    disclaimer: 'd',
    replay_fingerprint: 'rf_2454_20260513_mock_abcde',
    broker_execution: false,
    simulation_only: true,
    not_investment_advice: true,
    availability: {
      market_price: {
        ticker: '2454',
        market: 'twse',
        dataset: 'twse_daily_price',
        requested_start_date: '2025-11-13',
        requested_end_date: '2026-05-13',
        available: true,
        readiness: 'ready',
        agent_action: 'proceed',
        min_date: '2000-03-01',
        max_date: '2026-05-13',
        rows_in_range: 114,
        ohlc_null_rows: 0,
        volume_null_rows: 0,
        duplicate_groups: 0,
        freshness: 'current',
        data_gaps: [],
        warnings: [],
      },
    },
  };

  const normalized = normalizeAiResearchResponse(upstreamLike, {
    ticker: '2454',
    asOfDate: '2026-05-13',
    includeSimulation: true,
  });

  assert.equal(normalized.research.analysts[0].analyst_role, 'market_data');
  assert.equal(normalized.research.analysts[0].output_status, 'mock_real');
  const view = mapAiResearchResponseToViewModel(normalized);
  assert.equal(view.analystRows[0].status, 'mock-real');
  assert.equal(view.availabilitySummary.readiness, 'ready');
  assert.equal(view.availabilitySummary.agentAction, 'proceed');
});

test('invalid payload falls back to deterministic local mock response', () => {
  const normalized = normalizeAiResearchResponse({ not: 'valid' }, {
    ticker: '2603',
    asOfDate: '2026-05-13',
    includeSimulation: true,
  });

  assert.equal(normalized.ticker, '2603');
  assert.equal(normalized.research.analysts[0].analyst_role, 'market_data');
  assert.equal(normalized.research.analysts[0].output_status, 'mock_real');
  assert.equal(normalized.availability?.market_price?.readiness, 'partial');
  assert.equal(normalized.availability?.market_price?.agent_action, 'fallback');
});

test('2317 maps to partial fallback availability', () => {
  const response = buildAiResearchMockResponse({
    ticker: '2317',
    asOfDate: '2026-05-13',
    includeSimulation: true,
  });
  assert.equal(response.availability?.market_price?.readiness, 'partial');
  assert.equal(response.availability?.market_price?.agent_action, 'fallback');
  assert.ok(response.availability?.market_price?.data_gaps.includes('ohlc_null_rows_in_requested_range'));
});

test('unknown maps to unavailable skip and conservative output', () => {
  const response = buildAiResearchMockResponse({
    ticker: 'UNKNOWN',
    asOfDate: '2026-05-13',
    includeSimulation: true,
  });
  assert.equal(response.availability?.market_price?.readiness, 'unavailable');
  assert.equal(response.availability?.market_price?.agent_action, 'skip');
  assert.equal(response.research.analysts[0].output_status, 'missing');
  assert.equal(response.decision.action, 'no_action');
});

test('missing availability in upstream response does not crash view model', () => {
  const normalized = normalizeAiResearchResponse(
    {
      run_id: 'x',
      ticker: '2330',
      as_of_date: '2026-05-13',
      mode: 'mock',
      decision: { action: 'no_action', confidence: 0.6, reason: 'r' },
      simulation: {
        order: { status: 'rejected', quantity: 0, reason: 'r', simulation_only: true, broker_execution: false },
        fill: null,
        position: { ticker: '2330', quantity: 0, average_price: 0, market_value: 0, unrealized_pnl: 0, status: 'flat' },
      },
      research: { analysts: [], bull_case: { status: 'placeholder', key_points: [] }, bear_case: { status: 'placeholder', key_points: [] }, trader_proposal: { proposed_action: 'hold', confidence: 0.2, summary: 's' }, risk_review: { decision: 'needs_more_data', max_allocation: 0, required_user_confirmation: true, flags: [] }, portfolio_decision: { action: 'no_action', confidence: 0, rationale: 'r' } },
      data_gaps: [],
      warnings: [],
      disclaimer: 'd',
      replay_fingerprint: 'rf',
      broker_execution: false,
      simulation_only: true,
      not_investment_advice: true,
    },
    { ticker: '2330', asOfDate: '2026-05-13', includeSimulation: true },
  );
  const view = mapAiResearchResponseToViewModel(normalized);
  assert.ok(view.availabilitySummary);
  assert.equal(typeof view.availabilitySummary.readiness, 'string');
});

test('response has no timestamp-like keys and safety flags unchanged', () => {
  const response = buildAiResearchMockResponse({
    ticker: '2330',
    asOfDate: '2026-05-13',
    includeSimulation: true,
  });
  const rendered = JSON.stringify(response).toLowerCase();
  for (const key of ['timestamp', 'created_at', 'updated_at', 'generated_at', 'current_time']) {
    assert.equal(rendered.includes(key), false);
  }
  assert.equal(response.broker_execution, false);
  assert.equal(response.simulation_only, true);
  assert.equal(response.not_investment_advice, true);
});
