export const ANALYTICS_CONSENT_STORAGE_KEY = "twmd.analytics.enabled";

function isBrowser() {
  return typeof window !== "undefined";
}

export function isAnalyticsEnabledByDefault() {
  const flag = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
  return flag !== "false";
}

export function getAnalyticsConsentValue() {
  if (!isBrowser()) return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (value === "granted") return true;
    if (value === "denied") return false;
    return null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  const stored = getAnalyticsConsentValue();
  if (stored === null) return isAnalyticsEnabledByDefault();
  return stored;
}

export function setAnalyticsConsent(granted: boolean) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, granted ? "granted" : "denied");
  } catch {
    // ignore storage write failures
  }
}
