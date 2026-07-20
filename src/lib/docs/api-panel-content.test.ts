import assert from "node:assert/strict";
import { test } from "node:test";

import {
  API_AUTH_HEADER,
  API_KEY_PREFIX,
  LOCALIZED_MESSAGE_PLACEHOLDER,
  READ_API_ERRORS,
} from "../../content/api-truth.ts";
import { API_CAPTURES, apiCaptureBody, getApiCapture } from "../../content/api-captures.ts";
import {
  API_BASE_URL,
  PANEL_ERRORS,
  buildErrorBody,
  buildRequestSnippet,
  buildSuccessBody,
  datasetRowsKey,
  exampleArgs,
  panelStatuses,
  type PanelParam,
} from "./api-panel-content.ts";

const STANDARD: PanelParam[] = [
  { name: "symbol", required: true },
  { name: "start_date", required: false },
  { name: "end_date", required: false },
  { name: "limit", required: false },
];

const PATH = "/v2/datasets/twse-daily-price";
const LANGUAGES = ["curl", "python", "javascript", "typescript"] as const;
const CJK = /[　-〿぀-ヿ㐀-䶿一-鿿＀-￯]/;

// ── Request ──────────────────────────────────────────────────────────────────

test("snippets target the read API, which is where sk_live_ keys authenticate", () => {
  assert.equal(API_BASE_URL, "https://api.twmarketdata.com");
  assert.equal(API_KEY_PREFIX, "sk_live_");
  for (const language of LANGUAGES) {
    const code = buildRequestSnippet(language, { backendPath: PATH, params: STANDARD, rowsKey: "rows" });
    assert.ok(code.includes(`${API_BASE_URL}${PATH}`), `${language} must hit the read API`);
    assert.ok(code.includes(API_AUTH_HEADER), `${language} must send ${API_AUTH_HEADER}`);
    // The billing gateway is a different host with a different key namespace — never document it here.
    assert.ok(!code.includes("https://twmarketdata.com/"), `${language} must not point at the gateway`);
  }
});

test("each snippet reads THIS dataset's row key, never a shared one", () => {
  const withRows = buildRequestSnippet("python", { backendPath: PATH, params: STANDARD, rowsKey: "rows" });
  assert.ok(withRows.includes('payload["rows"]'));

  const withData = buildRequestSnippet("python", { backendPath: PATH, params: STANDARD, rowsKey: "data" });
  assert.ok(withData.includes('payload["data"]'));
  assert.ok(!withData.includes('payload["rows"]'), "must not leak another dataset's key");

  const withItems = buildRequestSnippet("javascript", { backendPath: PATH, params: STANDARD, rowsKey: "items" });
  assert.ok(withItems.includes("const { items } = payload;"));
});

test("an uncaptured dataset gets a snippet that asserts no row key at all", () => {
  for (const language of ["python", "javascript", "typescript"] as const) {
    const code = buildRequestSnippet(language, { backendPath: PATH, params: STANDARD, rowsKey: null });
    for (const key of ["rows", "items"]) {
      assert.ok(!code.includes(`["${key}"]`) && !code.includes(`{ ${key} }`), `${language} must not invent "${key}"`);
    }
    assert.ok(code.includes("payload"), `${language} should print the whole payload instead`);
  }
});

test("undocumented params get no invented example value", () => {
  const args = exampleArgs([{ name: "made_up_param", required: false }, { name: "symbol", required: true }]);
  assert.deepEqual(args.map((a) => a.name), ["symbol"]);
});

// ── Response: success ────────────────────────────────────────────────────────

test("a captured dataset serves its own real body verbatim", () => {
  const result = buildSuccessBody("twse-daily-price", "zh-TW");
  assert.equal(result.kind, "captured");
  if (result.kind !== "captured") return;
  const parsed = JSON.parse(result.body);
  // twse-daily-price really does use `rows` with a singular top-level source_role.
  assert.ok(Array.isArray(parsed.rows));
  assert.equal(parsed.source_role, "official_twse");
  assert.equal(result.rowsKey, "rows");
});

test("the envelope is NOT normalized across datasets", () => {
  // This is the whole point: one dataset's shape must never be imposed on another.
  const twse = buildSuccessBody("twse-daily-price", "zh-TW");
  const esg = buildSuccessBody("esg-tesg", "zh-TW");
  assert.equal(twse.kind, "captured");
  assert.equal(esg.kind, "captured");
  if (twse.kind !== "captured" || esg.kind !== "captured") return;
  assert.equal(twse.rowsKey, "rows");
  assert.equal(esg.rowsKey, "data");
  const esgBody = JSON.parse(esg.body);
  assert.ok(Array.isArray(esgBody.data));
  assert.equal(esgBody.rows, undefined);
  // Provenance shape differs too — plural array here, singular string on twse.
  assert.ok(Array.isArray(esgBody.lineage.source_roles));
  assert.equal(esgBody.source_role, undefined);
});

test("an uncaptured dataset yields nothing rather than a templated body", () => {
  const result = buildSuccessBody("no-such-dataset-anywhere", "en");
  assert.equal(result.kind, "uncaptured");
});

test("every capture is valid JSON and declares a row key that exists in it", () => {
  for (const [slug, capture] of Object.entries(API_CAPTURES)) {
    const parsed = JSON.parse(capture.zh);
    if (capture.rowsKey) {
      assert.ok(Array.isArray(parsed[capture.rowsKey]), `${slug}: rowsKey "${capture.rowsKey}" must be an array`);
    }
    if (capture.en) JSON.parse(capture.en);
  }
});

test("the /en body of every capture is CJK-free", () => {
  for (const [slug, capture] of Object.entries(API_CAPTURES)) {
    const body = apiCaptureBody(capture, "en");
    assert.ok(!CJK.test(body), `${slug}: the /en body must not contain Chinese`);
  }
});

test("the /zh body keeps the real Chinese values", () => {
  const capture = getApiCapture("esg-tesg");
  assert.ok(capture);
  if (!capture) return;
  assert.ok(CJK.test(apiCaptureBody(capture, "zh-TW")), "zh must show the values the API really returned");
  assert.notEqual(apiCaptureBody(capture, "en"), apiCaptureBody(capture, "zh-TW"));
});

test("datasetRowsKey reports null for anything not captured", () => {
  assert.equal(datasetRowsKey("twse-daily-price"), "rows");
  assert.equal(datasetRowsKey("no-such-dataset-anywhere"), null);
});

// ── Response: errors ─────────────────────────────────────────────────────────

test("error bodies use the read API's flat envelope, not the gateway's", () => {
  for (const error of PANEL_ERRORS) {
    const parsed = JSON.parse(buildErrorBody(error, "zh-TW"));
    // Flat string, not { code, message }; and no requestId — that is the gateway's shape.
    assert.equal(typeof parsed.error, "string");
    assert.equal(parsed.error, error.code);
    assert.equal(parsed.requestId, undefined);
    assert.deepEqual(Object.keys(parsed).sort(), ["error", "message"]);
  }
});

test("/zh shows the real Chinese message; /en shows a marker, not a translation", () => {
  const missingKey = READ_API_ERRORS.find((e) => e.code === "missing_api_key");
  assert.ok(missingKey);
  if (!missingKey) return;

  const zh = JSON.parse(buildErrorBody(missingKey, "zh-TW"));
  assert.equal(zh.message, missingKey.messageZh);
  assert.ok(CJK.test(zh.message));

  const en = JSON.parse(buildErrorBody(missingKey, "en"));
  assert.equal(en.message, LOCALIZED_MESSAGE_PLACEHOLDER);
  assert.ok(!CJK.test(JSON.stringify(en)), "the /en error body must be CJK-free");
});

test("only statuses actually observed are documented", () => {
  const statuses = panelStatuses();
  // Every one of these was captured live from the read API on 2026-07-20.
  assert.deepEqual(statuses, ["200", "400", "401", "403", "404", "422"]);
  // 429 and 5xx have never been observed, so they stay undocumented rather than assumed.
  assert.ok(!statuses.includes("429"));
  assert.ok(!statuses.includes("500"));
});

test("the 403 documents the real read-API code, not the gateway's", () => {
  const forbidden = READ_API_ERRORS.find((e) => e.status === 403);
  assert.ok(forbidden);
  // The gateway calls this plan_not_entitled; the read API does not.
  assert.equal(forbidden?.code, "commercial_use_not_allowed");
});

test("data_grade is never emitted into any documented body", () => {
  const success = buildSuccessBody("twse-daily-price", "en");
  assert.ok(success.kind === "captured" && !success.body.includes("data_grade"));
  for (const error of PANEL_ERRORS) {
    assert.ok(!buildErrorBody(error, "en").includes("data_grade"));
  }
});
