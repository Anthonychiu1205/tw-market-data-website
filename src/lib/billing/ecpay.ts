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

function getUrlHostPath(value: string | undefined) {
  if (!value) return "unknown";

  try {
    const url = new URL(value);
    return `${url.host}${url.pathname}`;
  } catch {
    return "invalid-url";
  }
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

export function renderAutoSubmitForm(
  actionUrl: string,
  params: Record<string, string>,
  diagnostics?: {
    planCode?: string;
    billingCycle?: string;
    amount?: number | string;
  },
) {
  const inputHtml = Object.entries(params)
    .map(([name, value]) => `<input type="hidden" name="${htmlEscape(name)}" value="${htmlEscape(value)}" />`)
    .join("\n");

  const escapedActionUrl = htmlEscape(actionUrl);
  const env = normalizeEcpayEnv();
  const checkoutHost = getUrlHostPath(actionUrl).split("/")[0] ?? "unknown";
  const merchantId = htmlEscape(params.MerchantID ?? "");
  const choosePayment = htmlEscape(params.ChoosePayment ?? "");
  const merchantTradeNo = htmlEscape(params.MerchantTradeNo ?? "");
  const amount = htmlEscape(String(diagnostics?.amount ?? params.TotalAmount ?? ""));
  const periodAmount = htmlEscape(params.PeriodAmount ?? "");
  const periodType = htmlEscape(params.PeriodType ?? "");
  const frequency = htmlEscape(params.Frequency ?? "");
  const execTimes = htmlEscape(params.ExecTimes ?? "");
  const itemName = htmlEscape(params.ItemName ?? "");
  const tradeDesc = htmlEscape(params.TradeDesc ?? "");
  const returnUrlHostPath = htmlEscape(getUrlHostPath(params.ReturnURL));
  const periodReturnUrlHostPath = htmlEscape(getUrlHostPath(params.PeriodReturnURL));
  const billingCycle = htmlEscape(
    diagnostics?.billingCycle ?? (params.PeriodType === "Y" ? "yearly" : "monthly"),
  );
  const planCode = htmlEscape(diagnostics?.planCode ?? "unknown");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>前往綠界付款</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .panel {
      width: 100%;
      max-width: 560px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 28px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
    }
    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.35;
      font-weight: 650;
      color: #020617;
    }
    p {
      margin: 10px 0 0;
      font-size: 14px;
      line-height: 1.7;
      color: #475569;
    }
    .button {
      margin-top: 20px;
      width: 100%;
      height: 44px;
      border: 0;
      border-radius: 12px;
      background: #0f172a;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .button:hover { background: #1e293b; }
    .diagnostics {
      margin-top: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
      padding: 12px;
      font-size: 12px;
      line-height: 1.6;
      color: #64748b;
    }
    .diagnostics code { color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .helper {
      margin-top: 8px;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="panel">
      <h1>正在前往綠界付款頁面</h1>
      <p>系統會自動跳轉到綠界金流。若未自動跳轉，請點擊下方按鈕繼續。</p>
      <form id="ecpay-checkout-form" method="post" action="${escapedActionUrl}">
        ${inputHtml}
        <button class="button" type="submit">前往綠界付款</button>
      </form>
      <p class="helper">提示：付款狀態以伺服器端 ReturnURL / PeriodReturnURL 通知為準。</p>
      <div class="diagnostics" role="status" aria-live="polite">
        <div>ECPAY_ENV: <code>${htmlEscape(env)}</code></div>
        <div>checkoutUrl host: <code>${htmlEscape(checkoutHost)}</code></div>
        <div>MerchantID: <code>${merchantId}</code></div>
        <div>ChoosePayment: <code>${choosePayment}</code></div>
        <div>planCode: <code>${htmlEscape(planCode)}</code></div>
        <div>billingCycle: <code>${htmlEscape(billingCycle)}</code></div>
        <div>TotalAmount: <code>${amount}</code></div>
        <div>PeriodAmount: <code>${periodAmount}</code></div>
        <div>PeriodType: <code>${periodType}</code></div>
        <div>Frequency: <code>${frequency}</code></div>
        <div>ExecTimes: <code>${execTimes}</code></div>
        <div>ItemName: <code>${itemName}</code></div>
        <div>TradeDesc: <code>${tradeDesc}</code></div>
        <div>ReturnURL: <code>${returnUrlHostPath}</code></div>
        <div>PeriodReturnURL: <code>${periodReturnUrlHostPath}</code></div>
        <div>order: <code>${merchantTradeNo}</code></div>
      </div>
      <noscript>
        <p class="helper">你目前停用了 JavaScript，請直接點上方按鈕前往付款。</p>
      </noscript>
    </div>
  </div>
  <script>
    window.setTimeout(function () {
      document.getElementById('ecpay-checkout-form')?.submit();
    }, 120);
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
