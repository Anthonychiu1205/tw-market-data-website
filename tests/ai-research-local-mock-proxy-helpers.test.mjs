import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getProxyBaseUrl,
  hasSafeFlags,
  isProxyAllowedInCurrentEnv,
  isProxyEnabled,
  parseAiResearchProxyRequest,
} from '../src/lib/ai-research/local-mock-proxy.ts';

test('proxy request parser accepts valid mock request', () => {
  const result = parseAiResearchProxyRequest({
    ticker: '2330',
    as_of_date: '2026-05-13',
    mode: 'mock',
    include_simulation: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.mode, 'mock');
    assert.equal(result.data.ticker, '2330');
  }
});

test('proxy request parser rejects invalid mode', () => {
  const result = parseAiResearchProxyRequest({
    ticker: '2330',
    as_of_date: '2026-05-13',
    mode: 'fixture',
  });
  assert.equal(result.ok, false);
});

test('proxy env gate blocks production by default', () => {
  assert.equal(isProxyAllowedInCurrentEnv('production', undefined), false);
  assert.equal(isProxyAllowedInCurrentEnv('production', 'true'), true);
  assert.equal(isProxyAllowedInCurrentEnv('development', undefined), true);
});

test('proxy enable flag and base URL normalization', () => {
  assert.equal(isProxyEnabled(undefined), false);
  assert.equal(isProxyEnabled('true'), true);
  assert.equal(getProxyBaseUrl('http://127.0.0.1:8010/'), 'http://127.0.0.1:8010');
  assert.equal(getProxyBaseUrl('   '), null);
});

test('safety flags validation', () => {
  assert.equal(
    hasSafeFlags({
      broker_execution: false,
      simulation_only: true,
      not_investment_advice: true,
    }),
    true,
  );

  assert.equal(
    hasSafeFlags({
      broker_execution: true,
      simulation_only: true,
      not_investment_advice: true,
    }),
    false,
  );
});
