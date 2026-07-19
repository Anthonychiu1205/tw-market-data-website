#!/usr/bin/env node
// OPENAPI-01: single-source OpenAPI generator.
//
// The hand-authored SEMANTIC spec lives in openapi/openapi.base.json (paths, schemas, descriptions).
// This script DERIVES the machine-quality fields so they can never drift by hand (禁手維護):
//   - operationId: snake_case, verb-first, derived from method + path (get_twse_daily_price)
//   - security: [] on keyless demo endpoints, ApiKeyAuth on the rest (frameworks auto-decide what to try)
//   - a 402 (payment-required) response on every keyed endpoint (mirrors the 429 error shape)
//   - root externalDocs, info.x-spec-version + info.x-generated-at
// then VALIDATES structurally (build-blocking) and writes BOTH public/openapi.json and
// public/openapi.yaml from the same object — same-source proof by construction (acceptance ①/③/⑤).
//
// Usage: `node scripts/generate_openapi.mjs`         → write json + yaml
//        `node scripts/generate_openapi.mjs --check`  → validate + verify outputs in sync (CI), no write
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = join(root, "openapi", "openapi.base.json");
const OUT_JSON = join(root, "public", "openapi.json");
const OUT_YAML = join(root, "public", "openapi.yaml");
const check = process.argv.includes("--check");

// Endpoints callable without an API key (the skill.md 免-key demo surface). Everything else needs a key.
const KEYLESS_ENDPOINTS = new Set(["/v2/datasets/twse-daily-price"]);
const SPEC_VERSION = "1.0.0";
// TODO(OPENAPI-01 step ④): point externalDocs at /meta/boundaries once the A2 boundaries artifact
// (greening) ships. Until then link the live docs so the spec never references a 404.
const EXTERNAL_DOCS = { description: "TW Market Data developer docs", url: "https://twmarketdata.com/docs" };

const snake = (s) =>
  s.replace(/[^a-zA-Z0-9]+/g, "_").replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/_+/g, "_").replace(/^_|_$/g, "").toLowerCase();

// Path segments that are structural containers, not part of the resource name.
const PATH_NOISE = new Set(["v2", "v1", "datasets"]);
function resourceFromPath(path) {
  // "/v2/datasets/twse-daily-price" → "twse_daily_price"; drops version + "datasets" container and any
  // {param} segments so the operationId reads like get_twse_daily_price.
  const parts = path.split("/").filter((p) => p && !p.startsWith("{") && !PATH_NOISE.has(p));
  return snake(parts.join("_"));
}

function enrich(spec, generatedAt) {
  spec.info["x-spec-version"] = SPEC_VERSION;
  spec.info["x-generated-at"] = generatedAt;
  spec.externalDocs = EXTERNAL_DOCS;

  for (const [path, item] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(item)) {
      if (!op || typeof op !== "object" || !op.responses) continue;
      op.operationId = `${method.toLowerCase()}_${resourceFromPath(path)}`;
      const keyless = KEYLESS_ENDPOINTS.has(path);
      op.security = keyless ? [] : [{ ApiKeyAuth: [] }];
      if (!keyless && !op.responses["402"]) {
        // Clone the 429 response shape (same two-field error schema) as the 402 template.
        const template = op.responses["429"] ?? op.responses["401"];
        if (template) {
          op.responses["402"] = { ...JSON.parse(JSON.stringify(template)), description: "Payment required — plan does not include this dataset. See payment.credits_url in the body to upgrade." };
        }
      }
    }
  }
  return spec;
}

function validate(spec) {
  const errors = [];
  if (!String(spec.openapi || "").startsWith("3.")) errors.push("openapi must be 3.x");
  if (!spec.info?.title || !spec.info?.version) errors.push("info.title and info.version required");
  if (!spec.paths || Object.keys(spec.paths).length === 0) errors.push("paths must be non-empty");
  const seenIds = new Set();
  for (const [path, item] of Object.entries(spec.paths || {})) {
    for (const [method, op] of Object.entries(item)) {
      if (!op || typeof op !== "object" || !op.responses) continue;
      const where = `${method.toUpperCase()} ${path}`;
      if (!op.operationId || !/^[a-z]+_[a-z0-9_]+$/.test(op.operationId)) errors.push(`${where}: operationId must be snake_case verb-first (got "${op.operationId}")`);
      if (op.operationId && seenIds.has(op.operationId)) errors.push(`${where}: duplicate operationId ${op.operationId}`);
      seenIds.add(op.operationId);
      if (!op.summary) errors.push(`${where}: missing summary`);
      if (op.security === undefined) errors.push(`${where}: missing security`);
      if (!op.responses["200"]) errors.push(`${where}: missing 200 response`);
    }
  }
  // $ref sanity: every local ref target exists.
  const json = JSON.stringify(spec);
  for (const m of json.matchAll(/"\$ref":"(#\/[^"]+)"/g)) {
    const parts = m[1].slice(2).split("/").map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
    let node = spec;
    for (const p of parts) node = node?.[p];
    if (node === undefined) errors.push(`unresolved $ref ${m[1]}`);
  }
  return errors;
}

const base = JSON.parse(readFileSync(BASE, "utf8"));
// generated_at: stable in --check (so it never reports drift); real timestamp when writing. When
// writing we still keep the previously written timestamp if content is otherwise unchanged is out of
// scope — build regenerates it each deploy, which is the intended "generated_at".
const generatedAt = check ? (JSON.parse(readFileSync(OUT_JSON, "utf8")).info?.["x-generated-at"] ?? "") : new Date().toISOString();
const spec = enrich(base, generatedAt);

const errors = validate(spec);
if (errors.length > 0) {
  console.error("[openapi] SPEC INVALID:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

const jsonOut = JSON.stringify(spec, null, 2) + "\n";
const yamlOut = yaml.dump(spec, { lineWidth: 100, noRefs: true });

if (check) {
  // Verify committed outputs match what would be generated (ignoring the generated_at field).
  const strip = (s) => s.replace(/"x-generated-at":\s*"[^"]*"/g, "").replace(/x-generated-at:.*/g, "");
  const curJson = readFileSync(OUT_JSON, "utf8");
  const curYaml = readFileSync(OUT_YAML, "utf8");
  const drift = [];
  if (strip(curJson) !== strip(jsonOut)) drift.push("public/openapi.json out of date");
  if (strip(curYaml) !== strip(yamlOut)) drift.push("public/openapi.yaml out of date");
  if (drift.length) {
    console.error("[openapi] DRIFT — run `npm run generate:openapi`:\n" + drift.map((d) => "  - " + d).join("\n"));
    process.exit(1);
  }
  console.error(`[openapi] OK: spec valid, ${Object.keys(spec.paths).length} paths, outputs in sync.`);
} else {
  writeFileSync(OUT_JSON, jsonOut);
  writeFileSync(OUT_YAML, yamlOut);
  console.error(`[openapi] wrote public/openapi.json + public/openapi.yaml (${Object.keys(spec.paths).length} paths, spec ${SPEC_VERSION}).`);
}
