// Last-known-good (LKG) selection for the homepage market card.
//
// Approved behaviour (I18N-FIX / REG-1 follow-up): when a live fetch yields no usable rows, keep
// showing the LAST REAL CLOSE together with its REAL date ("資料日期 <that day>" / "As of <that day>").
// Rule 2 compliant — real data + real date. A dateless stale value is strictly forbidden, and a
// value older than the cap is dropped rather than surfaced (a dated-but-ancient "last close" is still
// misleading). This module is intentionally pure + storage-agnostic so it is unit-testable; the
// caller holds the actual cache (in-memory, per warm instance — no DB write per pageview).

// Generous cap so a genuine long market holiday (e.g. Lunar New Year, ~9 days) still shows the last
// real close; past this we revert to rendering nothing.
export const LKG_MAX_AGE_DAYS = 14;

export type LastGood<T> = { items: T[]; asOf: string } | null | undefined;

// Returns the cached snapshot only when it is safe to serve: present, carrying a valid ISO date, and
// within the staleness cap. Otherwise null (caller renders nothing). `nowMs` is injected (not read
// from the clock) so the decision is deterministic and testable.
export function pickServableLastGood<T>(
  lastGood: LastGood<T>,
  nowMs: number,
  maxAgeDays: number = LKG_MAX_AGE_DAYS,
): { items: T[]; asOf: string } | null {
  if (!lastGood || !lastGood.asOf || lastGood.items.length === 0) return null;
  // asOf is a YYYY-MM-DD trade date; anchor to UTC midnight for a stable age computation.
  const asOfMs = Date.parse(`${lastGood.asOf}T00:00:00Z`);
  if (Number.isNaN(asOfMs)) return null;
  const ageDays = (nowMs - asOfMs) / 86_400_000;
  // Reject future-dated (clock skew / bad data) and anything past the cap.
  if (ageDays < 0 || ageDays > maxAgeDays) return null;
  return { items: lastGood.items, asOf: lastGood.asOf };
}
