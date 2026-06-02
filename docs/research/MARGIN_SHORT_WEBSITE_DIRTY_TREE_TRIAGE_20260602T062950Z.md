# Margin Short Website Dirty Tree Triage

## Summary
- modified tracked files: none observed
- staged files: none observed
- untracked files: present
- deploy-scope finding: current dirty tree appears dominated by historical research reports and artifacts unrelated to the margin_short deploy approval chain

## Modified files
- none

## Staged files
- none

## Untracked files inventory and classification

### Existing untracked directory
- `artifacts/`
  - classification: `unrelated_existing_dirty`
  - should be: `ignored for deploy approval`, `left untouched`
  - note: contains many historical validation artifacts from prior website tasks, not created by the margin_short deploy approval chain

### Existing untracked research reports
- `docs/research/API_PLAYGROUND_CONSOLE_LAYOUT_20260524T052323Z.md`
- `docs/research/API_PLAYGROUND_DROPDOWN_ZINDEX_20260524T061210Z.md`
- `docs/research/API_PLAYGROUND_FILL_LEFT_WRAP_CODE_20260524T044210Z.md`
- `docs/research/API_PLAYGROUND_ICONS_LEFT_HIERARCHY_20260524T055212Z.md`
- `docs/research/API_PLAYGROUND_LAYOUT_RHYTHM_CODE_WRAP_20260524T045937Z.md`
- `docs/research/API_PLAYGROUND_RATIO_EMPTY_SPACE_20260524T042513Z.md`
- `docs/research/API_RUN_PLAYGROUND_COMPACT_20260523T151600Z.md`
- `docs/research/API_RUN_PLAYGROUND_DENSITY_POLISH_20260524T040253Z.md`
- `docs/research/API_RUN_PLAYGROUND_FINANCIALDATASETS_LAYOUT_20260524T041544Z.md`
- `docs/research/API_RUN_PLAYGROUND_VISUAL_REFINE_20260523T164909Z.md`
- `docs/research/CODE_BLOCK_COPY_ICON_HIGHLIGHT_20260522T052109Z.md`
- `docs/research/CODE_BLOCK_REMAINING_EXCEPTIONS_20260522T054425Z.md`
- `docs/research/DATASETS_SSR_CRAWLER_AUDIT_20260523T050203Z.md`
- `docs/research/DATASET_SLUG_SEO_PHASE1_20260522T041044Z.md`
- `docs/research/DATASET_SLUG_SEO_PHASE2_20260523T062046Z.md`
- `docs/research/DATASET_SLUG_SEO_PHASE2_20260523T062127Z.md`
- `docs/research/DEV_COMPILE_LATENCY_DIAGNOSIS_20260523T142128Z.md`
- `docs/research/DOCS_API_RUN_PLAYGROUND_20260523T145947Z.md`
- `docs/research/DOCS_SIDEBAR_ORDER_UNIQUE_ICONS_20260523T141241Z.md`
- `docs/research/FRONTEND_DOCS_SIDEBAR_ENDPOINT_CONSISTENCY_20260526T152856Z.md`
- `docs/research/FRONTEND_DOCS_SIDEBAR_ENDPOINT_CONSISTENCY_20260526T153003Z.md`
- `docs/research/FRONTEND_DOCS_SIDEBAR_ENDPOINT_CONSISTENCY_20260526T153102Z.md`
- `docs/research/GUIDES_EXISTING_SEO_HARDENING_20260522T043312Z.md`
- `docs/research/HELP_CENTER_ARTICLE_PILOT_20260524T070329Z.md`
- `docs/research/HELP_CENTER_BINANCE_STYLE_NAV_20260525T122545Z.md`
- `docs/research/HELP_CENTER_COLLAPSIBLE_SEARCH_20260525T120745Z.md`
- `docs/research/HELP_CENTER_FAQ_MERGE_20260524T063247Z.md`
- `docs/research/HELP_CENTER_PHASE2_20260524T122723Z.md`
- `docs/research/HELP_CENTER_PHASE3_20260525T040600Z.md`
- `docs/research/HELP_CENTER_STANDALONE_AREA_20260524T073137Z.md`
- `docs/research/LLMS_READABILITY_CLEANUP_20260523T044310Z.md`
- `docs/research/OPENAPI_BUILD_HANG_DIAGNOSIS_20260523T053540Z.md`
- `docs/research/OPENAPI_DISCOVERABILITY_20260522T035129Z.md`
- `docs/research/OPENAPI_LLMS_MCP_READY_BUILD_FIX_20260523T072457Z.md`
- `docs/research/OPENAPI_LLMS_MCP_READY_PRE_DEPLOY_20260523T073845Z.md`
- `docs/research/OPENAPI_LLMS_MCP_READY_PRODUCTION_DEPLOY_20260523T075240Z.md`
- `docs/research/OPENAPI_SCHEMA_DEEPENING_PHASE1_20260523T051638Z.md`
- `docs/research/OPENAPI_SCHEMA_PHASE1_PRE_DEPLOY_20260523T055015Z.md`
- `docs/research/OPENAPI_SCHEMA_PHASE1_PRODUCTION_DEPLOY_20260523T060055Z.md`
- `docs/research/PROVENANCE_COVERAGE_SEO_20260522T052410Z.md`
- `docs/research/REMOVE_DOCS_PLAN_REQUIREMENT_20260523T143945Z.md`
- `docs/research/REMOVE_LEGACY_HELP_FAQ_20260526T030226Z.md`
- `docs/research/REVERT_PHASE2_DATASET_AND_OPENAPI_PHASE2_20260523T064820Z.md`
- `docs/research/SEO_AI_DISCOVERABILITY_HARDENING_20260522T033835Z.md`
- `docs/research/SEO_COMPLETENESS_GAP_AUDIT_20260523T060816Z.md`
- `docs/research/SEO_DOCS_PRE_DEPLOY_AUDIT_20260522T055906Z.md`
- `docs/research/SEO_DOCS_PRODUCTION_DEPLOY_20260522T061004Z.md`
- `docs/research/TW_MARKET_DATA_WEBSITE_MOPS_MATERIAL_EVENTS_DOCS_ALIGNMENT_REVIEW_20260524T162502Z.md`
  - classification: `unrelated_existing_dirty`
  - should be: `ignored for deploy approval`, `left untouched`
  - note: these are historical docs research outputs predating the current margin_short deploy approval recheck

### This task generated report
- `docs/research/MARGIN_SHORT_WEBSITE_DIRTY_TREE_TRIAGE_20260602T062950Z.md`
  - classification: `validation_report_related`
  - should be: `committed`
  - note: created by this task only, scoped to dirty-tree triage

## Margin-short deploy relevance assessment
- margin_short deploy approval chain files themselves are already committed in prior commits
- no untracked file in the observed dirty tree is required for margin_short route correctness
- no dirty file appears to modify runtime margin_short content, dataset pages, or docs route behavior

## Decision guidance
- unrelated existing untracked files should remain untouched in this task
- this task may commit only the triage/recheck reports it generates
- deploy approval remains blocked while unrelated dirty tree remains present, unless a later user-approved deploy policy explicitly tolerates unrelated untracked files
