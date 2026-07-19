import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DATASET_GRADE_COLORS,
  DATASET_GRADE_LABELS,
  datasetGradeLabel,
  deriveDatasetGrade,
} from "./dataset-grade.ts";

test("grade labels are bilingual and the English side is CJK-free", () => {
  const cjk = /[぀-ヿ㐀-䶿一-鿿]/;
  for (const grade of ["verified", "derived", "reference", "building"] as const) {
    assert.ok(DATASET_GRADE_LABELS[grade].en.length > 0);
    assert.ok(!cjk.test(DATASET_GRADE_LABELS[grade].en), `${grade} en label must be CJK-free`);
    assert.ok(cjk.test(DATASET_GRADE_LABELS[grade].zh), `${grade} zh label should be Chinese`);
  }
  assert.equal(datasetGradeLabel("verified", "en"), "Verified");
  assert.equal(datasetGradeLabel("verified", "zh-TW"), "已驗證");
  assert.equal(datasetGradeLabel("building", "en"), "Building");
});

test("every grade has the spec colour code", () => {
  assert.equal(DATASET_GRADE_COLORS.verified, "#2C8C6A");
  assert.equal(DATASET_GRADE_COLORS.derived, "#3E6EA6");
  assert.equal(DATASET_GRADE_COLORS.reference, "#928C7F");
  assert.equal(DATASET_GRADE_COLORS.building, "#C08A33");
});

test("official + available + real coverage → verified", () => {
  assert.equal(
    deriveDatasetGrade({ availability: "available", readiness: "available_now", sourceRole: "official_twse_t86", hasRealCoverage: true }),
    "verified",
  );
});

test("derived source role → derived (never verified)", () => {
  assert.equal(deriveDatasetGrade({ availability: "available", sourceRole: "derived_market_breadth", hasRealCoverage: true }), "derived");
});

test("roadmap / frozen / no-coverage → building", () => {
  assert.equal(deriveDatasetGrade({ availability: "roadmap", sourceRole: "official_x" }), "building");
  assert.equal(deriveDatasetGrade({ availability: "frozen", sourceRole: "official_x" }), "building");
  assert.equal(deriveDatasetGrade({ sourceRole: "official_x", hasRealCoverage: false }), "building");
});

test("metadata / master / calendar → reference (no verifiable time series)", () => {
  assert.equal(deriveDatasetGrade({ availability: "metadata-only", sourceRole: "official_twse_issuer_profile" }), "reference");
  assert.equal(deriveDatasetGrade({ availability: "available", sourceRole: "official_twse_security_master", hasRealCoverage: true }), "reference");
  assert.equal(deriveDatasetGrade({ availability: "available", sourceRole: "official_trading_calendar", hasRealCoverage: true }), "reference");
});

test("official but preview / coverage-limited → reference, not a premature verified", () => {
  assert.equal(deriveDatasetGrade({ availability: "available", readiness: "preview", sourceRole: "official_twse_x", hasRealCoverage: true }), "reference");
  assert.equal(deriveDatasetGrade({ availability: "coverage-limited", sourceRole: "official_twse_x", hasRealCoverage: true }), "reference");
});

test("unknown source role never fabricates verified", () => {
  assert.equal(deriveDatasetGrade({ availability: "available", sourceRole: "", hasRealCoverage: true }), "reference");
  assert.equal(deriveDatasetGrade({}), "reference");
});
