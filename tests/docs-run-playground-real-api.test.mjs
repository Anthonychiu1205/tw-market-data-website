import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildRunUrl,
  createLiveRunResult,
  maskApiKey,
  validateApiKey,
} from '../src/lib/docs/run-playground.ts';

test('buildRunUrl encodes query string correctly', () => {
  const url = buildRunUrl('/v2/datasets/twse-daily-price', [
    ['symbol', '2330'],
    ['start_date', '2026-05-01'],
    ['limit', '100'],
  ]);

  assert.equal(url, '/v2/datasets/twse-daily-price?symbol=2330&start_date=2026-05-01&limit=100');
});

test('api key must not be present in generated URL', () => {
  const url = buildRunUrl('/v2/datasets/tpex-daily-price', [['symbol', '5483']]);
  assert.equal(url.includes('X-API-Key'), false);
  assert.equal(url.includes('twmd_live_'), false);
});

test('validateApiKey blocks missing and placeholder keys', () => {
  assert.deepEqual(validateApiKey(''), { ok: false, reason: 'missing' });
  assert.deepEqual(validateApiKey('  your_api_key_here  '), { ok: false, reason: 'placeholder' });
  assert.deepEqual(validateApiKey('twmd_live_xxx_demo'), { ok: false, reason: 'placeholder' });
  assert.deepEqual(validateApiKey('twmd_live_real_abc12345'), { ok: true });
});

test('maskApiKey never returns full key', () => {
  assert.equal(maskApiKey(''), '<api-key>');
  assert.equal(maskApiKey('12345678'), '••••••');
  assert.equal(maskApiKey('twmd_live_abcdef123456'), 'twmd_liv••••••');
});

test('live run result preserves success and non-200 statuses', () => {
  assert.deepEqual(createLiveRunResult(200, '{\"ok\":true}'), {
    status: '200',
    body: '{"ok":true}',
    usageCounted: true,
  });
  assert.deepEqual(createLiveRunResult(401, '{\"error\":\"unauthorized\"}'), {
    status: '401',
    body: '{"error":"unauthorized"}',
    usageCounted: true,
  });
});

test('playground does not persist API key in localStorage/sessionStorage', () => {
  const source = fs.readFileSync('/Volumes/DEV_USB/Projects/tw-market-data-website/src/components/docs/api-run-playground.tsx', 'utf8');
  assert.equal(source.includes('localStorage'), false);
  assert.equal(source.includes('sessionStorage'), false);
  assert.equal(source.includes('CodeBlock'), true);
  assert.equal(source.includes('Example / Sample response'), true);
});
