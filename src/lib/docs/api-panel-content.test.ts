import assert from "node:assert/strict";
import { test } from "node:test";

import { GATEWAY_DEFAULT_MESSAGES } from "../gateway/error-codes.ts";
import {
  API_AUTH_HEADER,
  API_CAPTURED_ERRORS,
  API_GATEWAY_BASE_URL,
  API_ROWS_KEY,
} from "../../content/api-truth.ts";
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

test("every request snippet uses the captured base, auth header and endpoint", () => {
  // The base is the GATEWAY (the host that validates the key and meters credits), not the backend.
  assert.equal(API_BASE_URL, API_GATEWAY_BASE_URL);
  for (const language of ["curl", "python", "javascript", "typescript"] as const) {
    const code = buildRequestSnippet(language, { backendPath: PATH, params: STANDARD });
    assert.ok(code.includes(API_AUTH_HEADER), `${language} must send ${API_AUTH_HEADER}`);
    assert.ok(code.includes(`${API_BASE_URL}${PATH}`), `${language} must hit the real endpoint`);
    assert.ok(!code.includes("api.twmarketdata.com"), `${language} must not point at the backend host`);
  }
});

test("snippets read the captured row-array key, not the OpenAPI fiction", () => {
  assert.equal(API_ROWS_KEY, "rows");
  for (const language of ["python", "javascript", "typescript"] as const) {
    const code = buildRequestSnippet(language, { backendPath: PATH, params: STANDARD });
    assert.ok(code.includes(API_ROWS_KEY), `${language} must read ${API_ROWS_KEY}`);
    assert.ok(!/\bdata\b/.test(code), `${language} must not read a "data" array — the API returns rows`);
  }
});

test("the documented error contract matches what the live gateway returned", () => {
  for (const captured of API_CAPTURED_ERRORS) {
    assert.equal(
      GATEWAY_DEFAULT_MESSAGES[captured.code as keyof typeof GATEWAY_DEFAULT_MESSAGES],
      captured.message,
      `${captured.code} message must match the captured body`,
    );
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

test("a captured dataset serves its real response verbatim", () => {
  const result = buildSuccessBody({
    exampleJson: `{"data":[{"symbol":"2330"}]}`,
    datasetSlug: "twse-daily-price",
    planCode: "starter",
    creditsCost: 1,
  });
  assert.equal(result.provenance, "captured");
  const parsed = JSON.parse(result.body);
  // Real captured shape: rows (not data), with source_role and lineage at the TOP level.
  assert.ok(Array.isArray(parsed.rows));
  assert.equal(parsed.data, undefined);
  assert.equal(parsed.source_role, "official_twse");
  assert.ok(parsed.lineage.provider);
  // The hand-written page example must NOT override the capture.
  assert.equal(parsed.rows[0].close, 2290.0);
});

test("an uncaptured dataset gets the captured envelope with illustrative rows", () => {
  const result = buildSuccessBody({
    exampleJson: `{"data":[{"symbol":"1101","close":40.0}]}`,
    datasetSlug: "some-uncaptured-dataset",
    planCode: "starter",
    creditsCost: 1,
  });
  assert.equal(result.provenance, "illustrative");
  const parsed = JSON.parse(result.body);
  assert.deepEqual(parsed.rows, [{ symbol: "1101", close: 40.0 }]);
  assert.equal(parsed.count, 1);
  assert.equal(parsed.data, undefined);
  assert.equal(parsed.meta.planCode, "starter");
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
  assert.deepEqual(JSON.parse(result.body).rows, [{ rate_name: "rediscount_rate", value_pct: 2.0 }]);
});

test("an unparseable example falls back to a pointer instead of invented rows", () => {
  const result = buildSuccessBody({
    exampleJson: `{ "a": 1 }\n{ "b": 2 }`, // two objects — not valid JSON on its own
    datasetSlug: "interest-rate",
    planCode: "free",
    creditsCost: 0,
  });
  assert.equal(result.provenance, "illustrative");
  const parsed = JSON.parse(result.body);
  assert.equal(parsed.rows.length, 1);
  assert.match(parsed.rows[0], /Example response section/);
});
