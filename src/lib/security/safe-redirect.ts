import { getSafeRedirectTarget as getSafeRedirectTargetImpl } from "./safe-redirect-impl.mjs";

export function getSafeRedirectTarget(input: string | null | undefined, fallback = "/dashboard") {
  return getSafeRedirectTargetImpl(input, fallback);
}
