import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DATASET_GRADE_COLORS,
  DATASET_GRADE_LABELS,
  datasetGradeLabel,
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
