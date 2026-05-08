import "server-only";

import { createHash, randomBytes } from "crypto";

import { getPeriodConfig, type BillingCycle } from "@/src/lib/billing/plans";

const ECPAY_STAGE_CHECKOUT_URL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
const ECPAY_PRODUCTION_CHECKOUT_URL = "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5";
const ECPAY_STAGE_PERIOD_ACTION_URL = "https://payment-stage.ecpay.com.tw/Cashier/CreditCardPeriodAction";
const ECPAY_PRODUCTION_PERIOD_ACTION_URL = "https://payment.ecpay.com.tw/Cashier/CreditCardPeriodAction";

const ECPAY_MAC_NORMALIZE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/%20/g, "+"],
  [/%2d/g, "-"],
  [/%5f/g, "_"],
  [/%2e/g, "."],
  [/%21/g, "!"],
  [/%2a/g, "*"],
  [/%28/g, "("],
  [/%29/g, ")"],
];

export type EcpayParamValue = string | number | boolean;
export type EcpayParams = Record<string, EcpayParamValue | null | undefined>;

function normalizeSiteUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "http://localhost:3000";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }

  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(withoutTrailingSlash)) {
    return `http://${withoutTrailingSlash}`;
  }

  return `https://${withoutTrailingSlash}`;
}

function getRequiredEcpayConfig() {
  const merchantId = process.env.ECPAY_MERCHANT_ID?.trim();
  const hashKey = process.env.ECPAY_HASH_KEY?.trim();
  const hashIv = process.env.ECPAY_HASH_IV?.trim();

  if (!merchantId || !hashKey || !hashIv) {
    throw new Error("ECPAY configuration missing");
  }

  return { merchantId, hashKey, hashIv };
}

function normalizeEcpayEnv() {
  return process.env.ECPAY_ENV?.trim().toLowerCase() === "production" ? "production" : "stage";
}

function encodeForCheckMacValue(input: string) {
  let encoded = encodeURIComponent(input).toLowerCase();
  for (const [pattern, replacement] of ECPAY_MAC_NORMALIZE_REPLACEMENTS) {
    encoded = encoded.replace(pattern, replacement);
  }
  return encoded;
}

function normalizeParams(params: EcpayParams) {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    normalized[key] = String(value);
  }
  return normalized;
}

function sortParamEntries(params: Record<string, string>) {
  return Object.entries(params)
    .filter(([key]) => key !== "CheckMacValue")
    .sort(([keyA], [keyB]) => keyA.toLowerCase().localeCompare(keyB.toLowerCase()));
}

function buildCheckMacRawString(params: Record<string, string>, hashKey: string, hashIv: string) {
  const sorted = sortParamEntries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `HashKey=${hashKey}&${sorted}&HashIV=${hashIv}`;
}

function parseTradeDateInTaipei(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${partValue("year")}/${partValue("month")}/${partValue("day")} ${partValue("hour")}:${partValue("minute")}:${partValue("second")}`;
}

function htmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelEnv = process.env.VERCEL_ENV;
  const vercelBranchUrl = process.env.VERCEL_BRANCH_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (explicit?.trim()) {
    return normalizeSiteUrl(explicit);
  }

  if (vercelEnv === "preview") {
    const previewCandidate = vercelBranchUrl?.trim() || vercelUrl?.trim();
    if (previewCandidate) {
      return normalizeSiteUrl(previewCandidate);
    }
  }

  if (vercelEnv === "production") {
    const productionCandidate = vercelProductionUrl?.trim() || vercelUrl?.trim();
    if (productionCandidate) {
      return normalizeSiteUrl(productionCandidate);
    }
  }

  if (vercelUrl?.trim()) {
    return normalizeSiteUrl(vercelUrl);
  }

  return "http://localhost:3000";
}

export function getEcpayCheckoutUrl() {
  return normalizeEcpayEnv() === "production" ? ECPAY_PRODUCTION_CHECKOUT_URL : ECPAY_STAGE_CHECKOUT_URL;
}

export function getEcpayPeriodActionUrl() {
  return normalizeEcpayEnv() === "production" ? ECPAY_PRODUCTION_PERIOD_ACTION_URL : ECPAY_STAGE_PERIOD_ACTION_URL;
}

export function generateMerchantTradeNo() {
  const timestampBase36 = Date.now().toString(36).toUpperCase();
  const randomSuffix = randomBytes(3).toString("hex").toUpperCase();
  const candidate = `TWMD${timestampBase36}${randomSuffix}`.replace(/[^A-Za-z0-9]/g, "");
  return candidate.slice(0, 20);
}

export function formatEcpayTradeDate(date = new Date()) {
  return parseTradeDateInTaipei(date);
}

export function generateCheckMacValue(params: EcpayParams) {
  const { hashKey, hashIv } = getRequiredEcpayConfig();
  return generateCheckMacValueWithSecrets(params, { hashKey, hashIv });
}

export function generateCheckMacValueWithSecrets(params: EcpayParams, secrets: { hashKey: string; hashIv: string }) {
  const normalizedParams = normalizeParams(params);
  const raw = buildCheckMacRawString(normalizedParams, secrets.hashKey, secrets.hashIv);
  const encoded = encodeForCheckMacValue(raw);
  return createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

export function verifyCheckMacValue(params: EcpayParams) {
  const provided = String(params.CheckMacValue ?? "").trim().toUpperCase();
  if (!provided) return false;
  const calculated = generateCheckMacValue(params);
  return provided === calculated;
}

export function buildPeriodicCheckoutParams(input: {
  merchantTradeNo: string;
  amount: number;
  billingCycle: BillingCycle;
  itemName: string;
  clientBackPath?: string;
}) {
  const { merchantId } = getRequiredEcpayConfig();
  const siteUrl = getSiteUrl();
  const periodConfig = getPeriodConfig(input.billingCycle);
  const totalAmount = String(input.amount);

  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: input.merchantTradeNo,
    MerchantTradeDate: formatEcpayTradeDate(),
    PaymentType: "aio",
    TotalAmount: totalAmount,
    TradeDesc: "TW Market Data Subscription",
    ItemName: input.itemName,
    ReturnURL: `${siteUrl}/api/billing/ecpay/notify`,
    ChoosePayment: "Credit",
    EncryptType: "1",
    PeriodAmount: totalAmount,
    PeriodType: periodConfig.periodType,
    Frequency: String(periodConfig.frequency),
    ExecTimes: String(periodConfig.execTimes),
    PeriodReturnURL: `${siteUrl}/api/billing/ecpay/period-notify`,
    ClientBackURL: `${siteUrl}${input.clientBackPath ?? "/billing/thank-you"}`,
    NeedExtraPaidInfo: "N",
    Language: "CHT",
  };

  params.CheckMacValue = generateCheckMacValue(params);

  return params;
}

export function buildPeriodActionParams(input: {
  merchantTradeNo: string;
  action: "Cancel";
  timeStamp?: number;
}) {
  const { merchantId } = getRequiredEcpayConfig();
  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: input.merchantTradeNo,
    Action: input.action,
    TimeStamp: String(input.timeStamp ?? Math.floor(Date.now() / 1000)),
  };

  params.CheckMacValue = generateCheckMacValue(params);
  return params;
}

export function renderAutoSubmitForm(actionUrl: string, params: Record<string, string>) {
  const inputHtml = Object.entries(params)
    .map(([name, value]) => `<input type="hidden" name="${htmlEscape(name)}" value="${htmlEscape(value)}" />`)
    .join("\n");

  const escapedActionUrl = htmlEscape(actionUrl);

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirecting to ECPay</title>
</head>
<body>
  <form id="ecpay-checkout-form" method="post" action="${escapedActionUrl}">
    ${inputHtml}
    <noscript>
      <p>若頁面未自動跳轉，請點擊下方按鈕繼續付款。</p>
      <button type="submit">前往綠界付款</button>
    </noscript>
  </form>
  <script>
    document.getElementById('ecpay-checkout-form')?.submit();
  </script>
</body>
</html>`;
}

export function selfCheckCheckMacValue() {
  const params = {
    TradeDesc: "促銷方案",
    PaymentType: "aio",
    MerchantTradeDate: "2023/03/12 15:30:23",
    MerchantTradeNo: "ecpay20230312153023",
    MerchantID: "3002607",
    ReturnURL: "https://www.ecpay.com.tw/receive.php",
    ItemName: "Apple iphone 15",
    TotalAmount: "30000",
    ChoosePayment: "ALL",
    EncryptType: "1",
  };

  const calculated = generateCheckMacValueWithSecrets(params, {
    hashKey: "pwFHCqoQZGmho4w6",
    hashIv: "EkRm7iFT261dpevs",
  });

  return calculated === "6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840";
}
