// Canonical non-investment-advice disclaimer — single source of truth.
// /terms §九 and the site footer render this exact string; STORE-01 GPT/Gem masters
// (skill.md v2 §5.3) quote it verbatim. Change here → both surfaces + masters align.
//
// I18N-01: the zh-TW string below is UNCHANGED (STORE-01 masters match it byte-for-byte). The English
// counterpart is a faithful translation of the same meaning; pending owner legal sign-off it carries
// no new legal commitment beyond the zh original. Callers pick the locale via investmentDisclaimer().
export const INVESTMENT_DISCLAIMER =
  "TW Market Data（TWMD）提供之歷史資料與統計，非投資建議；投資決策與風險由您自行判斷。";

export const INVESTMENT_DISCLAIMER_EN =
  "TW Market Data (TWMD) provides historical data and statistics, not investment advice; investment decisions and their risks are your own.";

type DisclaimerLocale = "en" | "zh-TW";

// Locale-aware accessor. Defaults to the zh-TW canonical string so any non-en caller (and the
// STORE-01 masters path) is unchanged.
export function investmentDisclaimer(locale: DisclaimerLocale): string {
  return locale === "en" ? INVESTMENT_DISCLAIMER_EN : INVESTMENT_DISCLAIMER;
}
