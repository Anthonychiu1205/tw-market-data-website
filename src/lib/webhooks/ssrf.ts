import "server-only";

import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

// §A5 SSRF 一票否決 — the destination URL is attacker-controlled (a customer types it in), so every
// outbound delivery must be proven safe BEFORE we connect:
//   1. https only.
//   2. The host must resolve to PUBLIC IPs only — private/loopback/link-local/CGNAT/cloud-metadata are
//      all rejected (IPv4 and IPv6, including IPv4-mapped/6to4/NAT64 embeddings and the AWS/GCP/Azure
//      metadata address 169.254.169.254 / fd00:ec2::254).
//   3. No redirects (the fetch is pinned to the vetted IP and 3xx is a hard failure — see delivery.ts).
//   4. Payload size + per-destination rate caps (enforced by the worker).
// One test-set miss = the whole Phase A fails, so this is deliberately strict and default-deny.

export const MAX_PAYLOAD_BYTES = 256 * 1024; // 256 KiB — a data-event notification, never a bulk feed.

export type SsrfRejection = {
  ok: false;
  reason:
    | "not_https"
    | "invalid_url"
    | "no_host"
    | "dns_resolution_failed"
    | "private_or_reserved_ip"
    | "userinfo_in_url"
    | "non_default_disallowed_port";
  detail: string;
};

export type SsrfAcceptance = {
  ok: true;
  // The exact IPs the host resolved to. delivery pins the connection to one of these so a DNS-rebind
  // between check and connect cannot swap in a private IP.
  addresses: Array<{ address: string; family: 4 | 6 }>;
  hostname: string;
  port: number;
};

export type SsrfResult = SsrfRejection | SsrfAcceptance;

function parseIpv4(address: string): number[] | null {
  const parts = address.split(".");
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const value = Number(part);
    if (value < 0 || value > 255) return null;
    octets.push(value);
  }
  return octets;
}

// True for any IPv4 that must never be a delivery target: this host's own networks, RFC1918 private
// space, loopback, link-local (incl. the 169.254.169.254 metadata endpoint), CGNAT, and the various
// reserved/documentation/benchmark/multicast ranges.
function isPrivateIpv4(address: string): boolean {
  const o = parseIpv4(address);
  if (!o) return true; // unparseable → treat as unsafe
  const [a, b] = o;
  if (a === 0) return true; // 0.0.0.0/8 "this network"
  if (a === 10) return true; // 10/8 private
  if (a === 127) return true; // 127/8 loopback
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64/10 CGNAT
  if (a === 169 && b === 254) return true; // 169.254/16 link-local (incl. 169.254.169.254 metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12 private
  if (a === 192 && b === 168) return true; // 192.168/16 private
  if (a === 192 && b === 0 && o[2] === 0) return true; // 192.0.0/24 IETF protocol assignments
  if (a === 192 && b === 0 && o[2] === 2) return true; // 192.0.2/24 TEST-NET-1
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18/15 benchmarking
  if (a === 198 && b === 51 && o[2] === 100) return true; // 198.51.100/24 TEST-NET-2
  if (a === 203 && b === 0 && o[2] === 113) return true; // 203.0.113/24 TEST-NET-3
  if (a >= 224) return true; // 224/4 multicast + 240/4 reserved + 255.255.255.255 broadcast
  return false;
}

function expandIpv6(address: string): number[] | null {
  // Strip a zone id (fe80::1%eth0) — the address part is what matters.
  const zone = address.indexOf("%");
  const addr = zone === -1 ? address : address.slice(0, zone);

  // IPv4-mapped / embedded (::ffff:1.2.3.4, ::1.2.3.4) — pull the trailing dotted quad into 2 groups.
  const lastColon = addr.lastIndexOf(":");
  let head = addr;
  const tailGroups: string[] = [];
  if (lastColon !== -1 && addr.slice(lastColon + 1).includes(".")) {
    const v4 = parseIpv4(addr.slice(lastColon + 1));
    if (!v4) return null;
    head = addr.slice(0, lastColon + 1);
    tailGroups.push(((v4[0] << 8) | v4[1]).toString(16), ((v4[2] << 8) | v4[3]).toString(16));
  }

  const halves = head.split("::");
  if (halves.length > 2) return null;

  const toWords = (segment: string) =>
    segment.split(":").filter((s) => s.length > 0).map((s) => parseInt(s, 16));

  let words: number[];
  if (halves.length === 2) {
    const left = toWords(halves[0]);
    const right = [...toWords(halves[1]), ...tailGroups.map((s) => parseInt(s, 16))];
    const fill = 8 - left.length - right.length;
    if (fill < 0) return null;
    words = [...left, ...new Array(fill).fill(0), ...right];
  } else {
    words = [...toWords(head), ...tailGroups.map((s) => parseInt(s, 16))];
  }
  if (words.length !== 8 || words.some((w) => Number.isNaN(w) || w < 0 || w > 0xffff)) return null;
  return words;
}

function isPrivateIpv6(address: string): boolean {
  const w = expandIpv6(address);
  if (!w) return true;

  // Unspecified :: and loopback ::1
  if (w.every((x) => x === 0)) return true;
  if (w.slice(0, 7).every((x) => x === 0) && w[7] === 1) return true;

  // IPv4-mapped ::ffff:0:0/96 and IPv4-compatible ::/96 → judge the embedded IPv4.
  if (w.slice(0, 5).every((x) => x === 0) && (w[5] === 0xffff || w[5] === 0)) {
    const a = (w[6] >> 8) & 0xff;
    const b = w[6] & 0xff;
    const c = (w[7] >> 8) & 0xff;
    const d = w[7] & 0xff;
    return isPrivateIpv4(`${a}.${b}.${c}.${d}`);
  }
  // NAT64 64:ff9b::/96 → embedded IPv4.
  if (w[0] === 0x64 && w[1] === 0xff9b && w.slice(2, 6).every((x) => x === 0)) {
    const a = (w[6] >> 8) & 0xff;
    const b = w[6] & 0xff;
    const c = (w[7] >> 8) & 0xff;
    const d = w[7] & 0xff;
    return isPrivateIpv4(`${a}.${b}.${c}.${d}`);
  }
  // 6to4 2002::/16 embeds the IPv4 in words[1..2].
  if (w[0] === 0x2002) {
    const a = (w[1] >> 8) & 0xff;
    const b = w[1] & 0xff;
    const c = (w[2] >> 8) & 0xff;
    const d = w[2] & 0xff;
    return isPrivateIpv4(`${a}.${b}.${c}.${d}`);
  }

  const first = w[0];
  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique-local (incl. fd00:ec2::254 metadata)
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((first & 0xffc0) === 0xfec0) return true; // fec0::/10 deprecated site-local
  if ((first & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  return false;
}

export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family === 6) return isPrivateIpv6(address);
  return true; // not a literal IP → caller must resolve first; unknown = unsafe
}

// Full pre-flight for a destination URL. Resolves DNS and rejects unless EVERY resolved address is
// public. Returns the vetted addresses so the actual connection can be pinned to one of them.
export async function assertSafeDestinationUrl(rawUrl: string): Promise<SsrfResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "invalid_url", detail: rawUrl };
  }

  if (url.protocol !== "https:") {
    return { ok: false, reason: "not_https", detail: url.protocol };
  }
  // user:pass@host can be used to smuggle a different authority past naive parsers — refuse outright.
  if (url.username || url.password) {
    return { ok: false, reason: "userinfo_in_url", detail: "credentials in url" };
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (!hostname) {
    return { ok: false, reason: "no_host", detail: rawUrl };
  }

  const port = url.port ? Number(url.port) : 443;
  if (url.port && port !== 443) {
    return { ok: false, reason: "non_default_disallowed_port", detail: url.port };
  }

  // If the host is a literal IP, judge it directly — no DNS.
  const literalFamily = isIP(hostname);
  if (literalFamily) {
    if (isPrivateAddress(hostname)) {
      return { ok: false, reason: "private_or_reserved_ip", detail: hostname };
    }
    return {
      ok: true,
      addresses: [{ address: hostname, family: literalFamily as 4 | 6 }],
      hostname,
      port,
    };
  }

  // Resolve ALL records; a single private answer fails the whole host (defends DNS rebinding where the
  // attacker returns one public + one private A record).
  let resolved: Array<{ address: string; family: number }>;
  try {
    resolved = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    return { ok: false, reason: "dns_resolution_failed", detail: hostname };
  }
  if (resolved.length === 0) {
    return { ok: false, reason: "dns_resolution_failed", detail: hostname };
  }
  for (const record of resolved) {
    if (isPrivateAddress(record.address)) {
      return { ok: false, reason: "private_or_reserved_ip", detail: record.address };
    }
  }

  return {
    ok: true,
    addresses: resolved.map((r) => ({ address: r.address, family: (r.family === 6 ? 6 : 4) as 4 | 6 })),
    hostname,
    port,
  };
}
