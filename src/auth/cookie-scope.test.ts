import assert from "node:assert/strict";
import { test } from "node:test";

// These tests run against @auth/core's REAL merge + defaultCookies, because the AUTH-FIX in
// src/auth/index.ts rests on one assumption: supplying only `{ options: { domain } }` for the
// handshake cookies adds the Domain attribute WITHOUT dropping the defaults (cookie name, the
// 15-minute maxAge, httpOnly/secure/sameSite). If a dependency bump ever changed merge() to a
// shallow overwrite, the pkce cookie would silently lose its maxAge and name — which is exactly
// the class of bug that produced the outage. Fail loudly here instead.
// Deep file-path imports: @auth/core does not export these subpaths, and the whole point of this
// test is to exercise the library's real implementation rather than a copy of it.
// @ts-expect-error - no type declarations for this internal path
import { defaultCookies } from "../../node_modules/@auth/core/lib/utils/cookie.js";
// @ts-expect-error - no type declarations for this internal path
import { merge } from "../../node_modules/@auth/core/lib/utils/merge.js";

const SSO_DOMAIN = ".twmarketdata.com";

// Mirrors the override in src/auth/index.ts for the three handshake cookies.
const overrides = {
  pkceCodeVerifier: { options: { domain: SSO_DOMAIN } },
  state: { options: { domain: SSO_DOMAIN } },
  nonce: { options: { domain: SSO_DOMAIN } },
};

function resolved(useSecureCookies: boolean, cookieOverrides: unknown) {
  return merge(defaultCookies(useSecureCookies), cookieOverrides) as Record<
    string,
    { name: string; options: Record<string, unknown> }
  >;
}

test("the handshake cookies get the zone domain in production", () => {
  const cookies = resolved(true, overrides);
  for (const key of ["pkceCodeVerifier", "state", "nonce"] as const) {
    assert.equal(cookies[key].options.domain, SSO_DOMAIN, `${key} must be zone-scoped`);
  }
});

test("a partial override preserves every default it does not mention", () => {
  const defaults = resolved(true, {});
  const cookies = resolved(true, overrides);

  // The exact name matters: it is the cookie Google's callback will look for.
  assert.equal(cookies.pkceCodeVerifier.name, "__Secure-authjs.pkce.code_verifier");
  assert.equal(cookies.pkceCodeVerifier.name, defaults.pkceCodeVerifier.name);

  // The 15-minute expiry must survive — losing it would leave the verifier as a session cookie.
  assert.equal(cookies.pkceCodeVerifier.options.maxAge, 900);
  assert.equal(cookies.state.options.maxAge, 900);

  // Security attributes must survive.
  for (const key of ["pkceCodeVerifier", "state", "nonce"] as const) {
    assert.equal(cookies[key].options.httpOnly, true, `${key} must stay httpOnly`);
    assert.equal(cookies[key].options.secure, true, `${key} must stay secure`);
    assert.equal(cookies[key].options.sameSite, "lax", `${key} must stay sameSite=lax`);
    assert.equal(cookies[key].options.path, "/", `${key} must stay path=/`);
  }
});

test("outside production the cookies stay host-only", () => {
  // ssoCookieDomain is undefined off-production, and merge() skips undefined values.
  const cookies = resolved(false, {
    pkceCodeVerifier: { options: { domain: undefined } },
    state: { options: { domain: undefined } },
    nonce: { options: { domain: undefined } },
  });
  for (const key of ["pkceCodeVerifier", "state", "nonce"] as const) {
    assert.equal(cookies[key].options.domain, undefined, `${key} must be host-only locally`);
  }
  assert.equal(cookies.pkceCodeVerifier.name, "authjs.pkce.code_verifier");
});

test("csrfToken is never given a Domain", () => {
  // The __Host- prefix forbids a Domain attribute; adding one breaks sign-in outright.
  const cookies = resolved(true, overrides);
  assert.equal(cookies.csrfToken.options.domain, undefined);
  assert.match(cookies.csrfToken.name, /^__Host-/);
});
