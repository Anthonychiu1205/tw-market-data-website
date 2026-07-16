import test from "node:test";
import assert from "node:assert/strict";

// §A5 — the SSRF test set. A single miss fails the whole Phase A, so this is the gate. Every hostile
// URL must be REJECTED; only genuinely public https URLs pass. We assert on the pre-flight validator
// (URL + DNS) and on the sender's no-redirect behaviour.
import { assertSafeDestinationUrl, isPrivateAddress } from "../src/lib/webhooks/ssrf.ts";
import { postWebhook } from "../src/lib/webhooks/delivery.ts";

// Literal-IP + scheme cases — deterministic, no DNS needed.
const MUST_REJECT = [
  ["non-https (http)", "http://example.com/hook"],
  ["non-https (ftp)", "ftp://example.com/hook"],
  ["loopback v4", "https://127.0.0.1/hook"],
  ["loopback 127.x", "https://127.9.9.9/hook"],
  ["private 10/8", "https://10.0.0.5/hook"],
  ["private 172.16/12", "https://172.16.0.1/hook"],
  ["private 172.31/12", "https://172.31.255.254/hook"],
  ["private 192.168/16", "https://192.168.1.1/hook"],
  ["link-local", "https://169.254.10.10/hook"],
  ["AWS/GCP/Azure metadata", "https://169.254.169.254/latest/meta-data/"],
  ["metadata with port-less host", "https://169.254.169.254/"],
  ["CGNAT 100.64/10", "https://100.64.0.1/hook"],
  ["this-network 0.0.0.0", "https://0.0.0.0/hook"],
  ["broadcast", "https://255.255.255.255/hook"],
  ["multicast", "https://224.0.0.1/hook"],
  ["IPv6 loopback", "https://[::1]/hook"],
  ["IPv6 unspecified", "https://[::]/hook"],
  ["IPv6 ULA fc00::/7", "https://[fd00::1]/hook"],
  ["IPv6 ULA metadata (fd00:ec2::254)", "https://[fd00:ec2::254]/hook"],
  ["IPv6 link-local fe80::/10", "https://[fe80::1]/hook"],
  ["IPv4-mapped loopback", "https://[::ffff:127.0.0.1]/hook"],
  ["IPv4-mapped metadata", "https://[::ffff:169.254.169.254]/hook"],
  ["6to4 embedding private", "https://[2002:0a00:0001::]/hook"], // 2002:10.0.0.1
  ["NAT64 embedding metadata", "https://[64:ff9b::a9fe:a9fe]/hook"], // 64:ff9b::169.254.169.254
  ["credentials in url", "https://user:pass@1.1.1.1/hook"],
  ["non-default port", "https://1.1.1.1:8080/hook"],
];

for (const [label, url] of MUST_REJECT) {
  test(`SSRF rejects: ${label}`, async () => {
    const result = await assertSafeDestinationUrl(url);
    assert.equal(result.ok, false, `expected ${url} to be REJECTED, got ${JSON.stringify(result)}`);
  });
}

test("SSRF rejects hostnames that resolve to loopback (localhost)", async () => {
  const result = await assertSafeDestinationUrl("https://localhost/hook");
  assert.equal(result.ok, false);
});

test("SSRF accepts a public literal IP over https", async () => {
  const result = await assertSafeDestinationUrl("https://1.1.1.1/hook");
  assert.equal(result.ok, true);
});

test("isPrivateAddress classifier spot checks", () => {
  // reserved / private → true
  for (const ip of ["127.0.0.1", "10.1.2.3", "169.254.169.254", "::1", "fd00::1", "fe80::1"]) {
    assert.equal(isPrivateAddress(ip), true, `${ip} should be private`);
  }
  // public → false
  for (const ip of ["1.1.1.1", "8.8.8.8", "93.184.216.34", "2606:4700:4700::1111"]) {
    assert.equal(isPrivateAddress(ip), false, `${ip} should be public`);
  }
});

// redirect-to-internal: we NEVER follow redirects. Stub fetch to return a 3xx and assert the sender
// refuses to chase it (rather than following into an internal host). 1.1.1.1 passes the pre-flight so
// we exercise the redirect path itself.
test("sender blocks redirects (never follows a 3xx)", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(null, { status: 302, headers: { location: "http://169.254.169.254/" } });
  try {
    const outcome = await postWebhook({ url: "https://1.1.1.1/hook", headers: {}, body: "{}" });
    assert.equal(outcome.ok, false);
    assert.equal(outcome.error, "redirect_blocked");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sender rejects a non-https URL before connecting", async () => {
  const outcome = await postWebhook({ url: "http://1.1.1.1/hook", headers: {}, body: "{}" });
  assert.equal(outcome.ok, false);
  assert.equal(outcome.error, "ssrf_not_https");
});

test("sender rejects an oversized payload before connecting", async () => {
  const huge = "x".repeat(300 * 1024);
  const outcome = await postWebhook({ url: "https://1.1.1.1/hook", headers: {}, body: huge });
  assert.equal(outcome.ok, false);
  assert.equal(outcome.error, "payload_too_large");
});
