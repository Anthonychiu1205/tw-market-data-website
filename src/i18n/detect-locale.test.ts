import assert from "node:assert/strict";
import { test } from "node:test";

import { detectLocale, localeFromPathname } from "./detect-locale.ts";

test("cookie wins over every other signal (returning visitor's choice sticks)", () => {
  assert.equal(
    detectLocale({ cookieLocale: "en", geoCountry: "TW", acceptLanguage: "zh-TW" }),
    "en",
  );
  assert.equal(
    detectLocale({ cookieLocale: "zh-TW", geoCountry: "US", acceptLanguage: "en-US" }),
    "zh-TW",
  );
});

test("an unknown cookie value is ignored and detection falls through", () => {
  assert.equal(
    detectLocale({ cookieLocale: "fr", geoCountry: "TW", acceptLanguage: "en" }),
    "zh-TW",
  );
  assert.equal(detectLocale({ cookieLocale: "", geoCountry: "US", acceptLanguage: "en" }), "en");
});

test("TW geo (x-vercel-ip-country) maps to zh-TW when there is no cookie", () => {
  assert.equal(detectLocale({ geoCountry: "TW", acceptLanguage: "en-US,en" }), "zh-TW");
  assert.equal(detectLocale({ geoCountry: "tw" }), "zh-TW");
});

test("Traditional-Chinese Accept-Language maps to zh-TW (no cookie, non-TW geo)", () => {
  assert.equal(detectLocale({ geoCountry: "US", acceptLanguage: "zh-TW,zh;q=0.9" }), "zh-TW");
  assert.equal(detectLocale({ acceptLanguage: "zh-Hant" }), "zh-TW");
  assert.equal(detectLocale({ acceptLanguage: "zh-HK,zh" }), "zh-TW");
});

test("Simplified/mainland and everything else fall back to en", () => {
  // zh-CN / plain zh are NOT treated as Traditional — overseas simplified readers get English.
  assert.equal(detectLocale({ acceptLanguage: "zh-CN,zh;q=0.9" }), "en");
  assert.equal(detectLocale({ acceptLanguage: "zh" }), "en");
  assert.equal(detectLocale({ acceptLanguage: "ja-JP,ja" }), "en");
  assert.equal(detectLocale({}), "en");
  assert.equal(detectLocale({ geoCountry: "US", acceptLanguage: null }), "en");
});

test("localeFromPathname extracts a leading locale prefix or null", () => {
  assert.equal(localeFromPathname("/en/pricing"), "en");
  assert.equal(localeFromPathname("/zh-TW"), "zh-TW");
  assert.equal(localeFromPathname("/pricing"), null);
  assert.equal(localeFromPathname("/"), null);
  assert.equal(localeFromPathname("/fr/x"), null);
});
