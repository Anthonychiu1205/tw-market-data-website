import assert from "node:assert/strict";
import { test } from "node:test";

import { GATEWAY_DEFAULT_MESSAGES } from "../gateway/error-codes.ts";
import {
  API_BASE_URL,
  PANEL_ERROR_CODES,
  PANEL_STATUSES,
  buildErrorBody,
  buildRequestSnippet,
  buildSuccessBody,
  errorStatusFor,
  exampleArgs,
  type PanelParam,
} from "./api-panel-content.ts";

const STANDARD: PanelParam[] = [
  { name: "symbol", required: true },
  { name: "start_date", required: false },
  { name: "end_date", required: false },
  { name: "limit", required: false },
];

const PATH = "/v2/datasets/twse-daily-price";

test("every request snippet carries the X-API-Key header and the real endpoint", () => {
  for (const language of ["curl", "python", "javascript", "typescript"] as const) {
    const code = buildRequestSnippet(language, { backendPath: PATH, params: STANDARD });
    assert.ok(code.includes("X-API-Key"), `${language} must send X-API-Key`);
    assert.ok(code.includes(`${API_BASE_URL}${PATH}`), `${language} must hit the real endpoint`);
  }
});

test("no snippet references an unpublished SDK package", () => {
  // packages/python-sdk and packages/js-sdk exist but are not on PyPI / npm, so the docs must not
  // show an import a reader cannot install.
  for (const language of ["curl", "python", "javascript", "typescript"] as const) {
    const code = buildRequestSnippet(language, { backendPath: PATH, params: STANDARD });
    assert.ok(!code.includes("twmarketdata import"), `${language} must not import the unpublished SDK`);
    assert.ok(!code.includes("@twmarketdata/sdk"), `${language} must not import the unpublished SDK`);
    assert.ok(!/\btwmd\./.test(code), `${language} must not use a package name that does not exist`);
  }
});

test("undocumented params get no invented example value", () => {
  const args = exampleArgs([{ name: "made_up_param", required: false }, { name: "symbol", required: true }]);
  assert.deepEqual(args.map((a) => a.name), ["symbol"]);
});

test("a reference dataset without a date range produces a shorter query", () => {
  const code = buildRequestSnippet("curl", {
    backendPath: "/v2/datasets/security-master",
    params: [{ name: "symbol", required: false }, { name: "limit", required: false }],
  });
  assert.ok(code.includes("symbol=2330&limit=5"));
  assert.ok(!code.includes("start_date"));
});

test("a dataset with no documented params produces a bare URL", () => {
  const code = buildRequestSnippet("curl", { backendPath: PATH, params: [] });
  assert.ok(code.includes(`"${API_BASE_URL}${PATH}"`));
  assert.ok(!code.includes("?"));
});

test("error bodies mirror the gateway's real contract", () => {
  for (const code of PANEL_ERROR_CODES) {
    const parsed = JSON.parse(buildErrorBody(code));
    assert.equal(parsed.error.code, code);
    assert.equal(parsed.error.message, GATEWAY_DEFAULT_MESSAGES[code]);
    assert.ok(parsed.requestId, "every error body carries requestId");
  }
});

test("the documented statuses are the ones the gateway actually throws", () => {
  assert.equal(errorStatusFor("invalid_api_key"), 401);
  assert.equal(errorStatusFor("insufficient_credits"), 402);
  assert.equal(errorStatusFor("plan_not_entitled"), 403);
  assert.equal(errorStatusFor("dataset_not_found"), 404);
  assert.deepEqual(PANEL_STATUSES, ["200", "401", "402", "403", "404"]);
  // 400 is not in the list: the gateway never emits one.
  assert.ok(!PANEL_STATUSES.includes("400"));
});

test("the 200 body wraps the dataset's own example rows, adding no new fields", () => {
  const example = `{"data":[{"symbol":"2330","close":2470.0,"source_role":"official_twse"}]}`;
  const result = buildSuccessBody({
    exampleJson: example,
    datasetSlug: "twse-daily-price",
    planCode: "starter",
    creditsCost: 1,
  });
  assert.equal(result.embeddedExample, true);
  const parsed = JSON.parse(result.body);
  // The row is passed through verbatim — same keys, same values, nothing invented.
  assert.deepEqual(parsed.data, JSON.parse(example).data);
  assert.equal(parsed.meta.dataset, "twse-daily-price");
  assert.equal(parsed.meta.planCode, "starter");
  assert.equal(parsed.meta.creditsCost, 1);
  assert.equal(parsed.meta.dryRun, false);
});

test("data_grade is never emitted into a response body", () => {
  const result = buildSuccessBody({
    exampleJson: `{"data":[{"symbol":"2330"}]}`,
    datasetSlug: "twse-daily-price",
    planCode: "starter",
    creditsCost: 1,
  });
  assert.ok(!result.body.includes("data_grade"));
  for (const code of PANEL_ERROR_CODES) {
    assert.ok(!buildErrorBody(code).includes("data_grade"));
  }
});

test("a bare example row is still wrapped in the envelope", () => {
  const result = buildSuccessBody({
    exampleJson: `{"rate_name":"rediscount_rate","value_pct":2.0}`,
    datasetSlug: "interest-rate",
    planCode: "free",
    creditsCost: 0,
  });
  assert.equal(result.embeddedExample, true);
  assert.deepEqual(JSON.parse(result.body).data, [{ rate_name: "rediscount_rate", value_pct: 2.0 }]);
});

test("an unparseable example falls back to a pointer instead of invented rows", () => {
  const result = buildSuccessBody({
    exampleJson: `{ "a": 1 }\n{ "b": 2 }`, // two objects — not valid JSON on its own
    datasetSlug: "interest-rate",
    planCode: "free",
    creditsCost: 0,
  });
  assert.equal(result.embeddedExample, false);
  const parsed = JSON.parse(result.body);
  assert.equal(parsed.data.length, 1);
  assert.match(parsed.data[0], /Example response section/);
});
