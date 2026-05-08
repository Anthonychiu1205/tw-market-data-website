const DEFAULT_FALLBACK = "/dashboard";

const ALLOWED_BASE_PATHS = ["/dashboard", "/account", "/billing", "/usage", "/settings", "/pricing"];

function normalizeRawValue(input) {
  if (!input) return "";
  const trimmed = String(input).trim();
  if (!trimmed) return "";

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

function isAllowedPath(pathname) {
  return ALLOWED_BASE_PATHS.some((base) => pathname === base || pathname.startsWith(`${base}/`));
}

export function getSafeRedirectTarget(input, fallback = DEFAULT_FALLBACK) {
  const candidate = normalizeRawValue(input);
  if (!candidate) return fallback;

  if (
    candidate.startsWith("http://") ||
    candidate.startsWith("https://") ||
    candidate.startsWith("//") ||
    candidate.startsWith("\\") ||
    candidate.startsWith("javascript:") ||
    candidate.startsWith("data:") ||
    candidate.includes("\\")
  ) {
    return fallback;
  }

  if (!candidate.startsWith("/")) {
    return fallback;
  }

  const [pathname] = candidate.split(/[?#]/, 1);
  if (!pathname || !isAllowedPath(pathname)) {
    return fallback;
  }

  return candidate;
}
