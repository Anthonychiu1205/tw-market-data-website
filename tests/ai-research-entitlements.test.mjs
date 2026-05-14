import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getAiResearchEntitlement,
  listAiResearchPlans,
} from '../src/components/dashboard/ai-research-entitlements.ts';

test('free cannot run research', () => {
  const ent = getAiResearchEntitlement('free');
  assert.equal(ent.canRunResearch, false);
  assert.equal(ent.access, 'blocked');
});

test('developer can run mock preview only', () => {
  const ent = getAiResearchEntitlement('developer');
  assert.equal(ent.canRunResearch, true);
  assert.equal(ent.access, 'preview');
  assert.equal(ent.modeLabel, 'Mock Preview');
  assert.equal(ent.commercialUse, false);
});

test('pro can run basic research', () => {
  const ent = getAiResearchEntitlement('pro');
  assert.equal(ent.canRunResearch, true);
  assert.equal(ent.access, 'basic');
  assert.equal(ent.modeLabel, 'Basic');
});

test('team has batch and simulated portfolio flags', () => {
  const ent = getAiResearchEntitlement('team');
  assert.equal(ent.batch, true);
  assert.equal(ent.simulatedPortfolio, true);
  assert.equal(ent.access, 'full');
});

test('enterprise is custom mode', () => {
  const ent = getAiResearchEntitlement('enterprise');
  assert.equal(ent.access, 'custom');
  assert.equal(ent.customWorkflow, true);
  assert.equal(ent.modeLabel, 'Custom');
});

test('entitlement helper is deterministic', () => {
  const first = getAiResearchEntitlement('pro');
  const second = getAiResearchEntitlement('pro');
  assert.deepEqual(first, second);
  assert.deepEqual(listAiResearchPlans(), ['free', 'developer', 'pro', 'team', 'enterprise']);
});

test('entitlement helper contains no production billing/auth coupling strings', () => {
  const joined = JSON.stringify([
    getAiResearchEntitlement('free'),
    getAiResearchEntitlement('developer'),
    getAiResearchEntitlement('pro'),
    getAiResearchEntitlement('team'),
    getAiResearchEntitlement('enterprise'),
  ]).toLowerCase();
  for (const forbidden of ['database_url', 'billing_event', 'credit_deduction', 'auth_middleware']) {
    assert.equal(joined.includes(forbidden), false);
  }
});
