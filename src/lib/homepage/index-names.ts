// SSOT for bilingual Taiwan index display names. Keyed by the reliable zh name (from the API /
// INDEX_META / the marquee config), so any surface that shows an index name — the hero card, the
// market marquee, demo panels — resolves through the SAME map and can never diverge (I18N-FIX-03).
//
// Pure module (no server-only): safe to import from client components too. A name we don't have a
// translation for degrades to the original zh name, so a row always renders (§1.4 fallback).
export const INDEX_NAME_I18N: Record<string, { en: string; zh: string }> = {
  加權指數: { en: "TAIEX", zh: "加權指數" },
  櫃買指數: { en: "TPEx Index", zh: "櫃買指數" },
  台灣50: { en: "Taiwan 50", zh: "台灣50" },
  電子類股: { en: "Electronics", zh: "電子類股" },
  金融保險: { en: "Finance & Insurance", zh: "金融保險" },
  半導體: { en: "Semiconductor", zh: "半導體" },
};

export function indexDisplayName(name: string, locale: string): string {
  const localized = INDEX_NAME_I18N[name];
  if (!localized) return name;
  return locale === "en" ? localized.en : localized.zh;
}
