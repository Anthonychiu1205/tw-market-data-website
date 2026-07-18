// Shared serializable types for the homepage real-data demo panels.
//
// This module contains TYPES ONLY — no fetch logic, no `server-only`, and crucially no reference to
// BACKEND_API_TOKEN. Client components ("use client") import their prop types from here, so there is
// zero risk of the server-side fetch (or the service token) being pulled into the client bundle. The
// server adapter (demo-real-data.ts, which IS `server-only`) imports the same types.

export type DemoRecord = Record<string, unknown>;

// A demo panel's data is either a real row + its real as_of date, or null (panel degrades to an
// honest "no data" state — a fabricated fallback is never produced).
export type DemoResponse = { dataset: string; symbol: string; asOf: string; data: DemoRecord[] } | null;

// api-demo-section: responses[endpointId][tickerSymbol].
export type ApiDemoRealData = { responses: Record<string, Record<string, DemoResponse>> };

// source-of-truth-section: real response JSON + as_of keyed by item id.
export type SourceOfTruthRealData = { byId: Record<string, { code: string; asOf: string }> };

export type HomepageDemoData = { apiDemo: ApiDemoRealData; sourceOfTruth: SourceOfTruthRealData };
