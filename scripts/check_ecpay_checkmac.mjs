import crypto from "node:crypto";

function generateCheckMacValue(params, hashKey, hashIv) {
  const sorted = Object.keys(params)
    .filter((key) => key !== "CheckMacValue")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  let encoded = encodeURIComponent(`HashKey=${hashKey}&${sorted}&HashIV=${hashIv}`).toLowerCase();
  encoded = encoded
    .replace(/%20/g, "+")
    .replace(/%2d/g, "-")
    .replace(/%5f/g, "_")
    .replace(/%2e/g, ".")
    .replace(/%21/g, "!")
    .replace(/%2a/g, "*")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")");

  return crypto.createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

const sample = {
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

const expected = "6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840";
const actual = generateCheckMacValue(sample, "pwFHCqoQZGmho4w6", "EkRm7iFT261dpevs");

if (actual !== expected) {
  console.error(`check:ecpay-checkmac failed expected=${expected} actual=${actual}`);
  process.exit(1);
}

console.log("check:ecpay-checkmac passed");
