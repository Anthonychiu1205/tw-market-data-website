import assert from "node:assert/strict";
import { test } from "node:test";

import { pickServableLastGood, LKG_MAX_AGE_DAYS } from "./homepage-market-lkg.ts";

const NOW = Date.parse("2026-07-19T00:00:00Z"); // fixed clock (UTC midnight) for determinism
const rows = [{ v: 1 }, { v: 2 }, { v: 3 }];

test("returns null when there is no cached snapshot", () => {
  assert.equal(pickServableLastGood(null, NOW), null);
  assert.equal(pickServableLastGood(undefined, NOW), null);
});

test("returns null when the cached snapshot has no date (never serve a dateless value)", () => {
  assert.equal(pickServableLastGood({ items: rows, asOf: "" }, NOW), null);
});

test("returns null when the cached snapshot has no rows", () => {
  assert.equal(pickServableLastGood({ items: [], asOf: "2026-07-18" }, NOW), null);
});

test("serves a fresh cached snapshot (yesterday) unchanged, with its real date", () => {
  const lg = { items: rows, asOf: "2026-07-18" };
  const out = pickServableLastGood(lg, NOW);
  assert.deepEqual(out, { items: rows, asOf: "2026-07-18" });
});

test("serves a snapshot right at the staleness cap", () => {
  const asOf = new Date(NOW - LKG_MAX_AGE_DAYS * 86_400_000).toISOString().slice(0, 10);
  const out = pickServableLastGood({ items: rows, asOf }, NOW);
  assert.ok(out, "snapshot exactly at the cap should still be served");
});

test("drops a snapshot older than the cap (dated-but-ancient is still misleading)", () => {
  const asOf = new Date(NOW - (LKG_MAX_AGE_DAYS + 2) * 86_400_000).toISOString().slice(0, 10);
  assert.equal(pickServableLastGood({ items: rows, asOf }, NOW), null);
});

test("drops a future-dated snapshot (clock skew / bad data)", () => {
  assert.equal(pickServableLastGood({ items: rows, asOf: "2026-07-25" }, NOW), null);
});

test("drops an unparseable date", () => {
  assert.equal(pickServableLastGood({ items: rows, asOf: "not-a-date" }, NOW), null);
});
