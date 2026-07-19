// siteConfig.url is the CANONICAL origin — it drives `<link rel="canonical">` + hreflang on every
// page (src/i18n/seo.ts). It MUST match the single served/primary domain, or canonical points at a
// URL different from where the page is served (the www vs non-www split flagged in I18N-FIX-01 §5).
// Unify at the Vercel domain level: pick ONE primary (apex `twmarketdata.com` here) and 301-redirect
// the other (www → apex). To override the canonical origin, set NEXT_PUBLIC_SITE_URL (wins below).
const PROD_FALLBACK_SITE_URL = "https://twmarketdata.com";
const DEV_FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

function resolveSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) {
    return normalizeBaseUrl(configuredSiteUrl);
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) {
    return normalizeBaseUrl(`https://${vercelProductionUrl}`);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return normalizeBaseUrl(`https://${vercelUrl}`);
  }

  if (process.env.NODE_ENV === "production") {
    return PROD_FALLBACK_SITE_URL;
  }

  return DEV_FALLBACK_SITE_URL;
}

const siteUrl = resolveSiteUrl();

export const siteConfig = {
  name: "TW Market Data Platform",
  shortName: "TWMD",
  description:
    "台股資料 API，為系統、量化研究與 AI agent workflow 提供 official/public-first、可追溯且結構一致的資料能力。",
  descriptionEn:
    "A Taiwan stock market data API — official/public-first, traceable, and structurally consistent data for systems, quantitative research, and AI agent workflows.",
  url: siteUrl,
  supportEmail: "avenra.platform@gmail.com",
  ogImagePath: "/og-image.png",
};

export function getAbsoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteConfig.url}${normalizedPath}`;
}
