// Server-safe shared content for the quick-start & authentication guide pages. Their page
// components are "use client" (they render the client CodeBlock), so the /llms-full.txt generator
// (server) cannot import functions from those files. Keeping the data + markdown builders here —
// a plain module with no "use client" — lets BOTH the client components and the server generator
// import them. Endpoint/param/header values match the homepage code sample + /openapi.json (symbol).

export const quickStartCurl = `curl "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=10" \\
  -H "X-API-Key: $TWMD_API_KEY"`;

export const quickStartPython = `import requests

r = requests.get(
    "https://api.twmarketdata.com/v2/datasets/twse-daily-price",
    params={"symbol": "2330", "limit": 10},
    headers={"X-API-Key": TWMD_API_KEY},
)
data = r.json()`;

export const quickStartNextDatasets: { href: string; name: string }[] = [
  { href: "/docs/api/market-prices/twse-daily-price", name: "上市日線" },
  { href: "/docs/api/financial-growth/monthly-revenue", name: "月營收" },
  { href: "/docs/api/capital-flow/institutional-flow", name: "三大法人" },
  { href: "/docs/api/financial-growth/income-statement", name: "財報三表" },
];

export function quickStartLlmsMarkdown(): string {
  return [
    "### 1. 拿一把 API 金鑰",
    "到儀表板（/dashboard）註冊，並在後台建立一把 API 金鑰。金鑰放在請求標頭，別放進網址。",
    "",
    "### 2. 打第一個請求",
    "每個資料端點都是 GET /v2/datasets/{資料集}，用 X-API-Key 標頭帶上金鑰。",
    "```bash",
    quickStartCurl,
    "```",
    "```python",
    quickStartPython,
    "```",
    "",
    "### 3. 看回應",
    "回傳 typed JSON，每筆都帶來源；缺的資料如實留空，不會亂補。欄位說明在各資料集頁（/datasets）。",
    "",
    "### 接下來",
    `- 挑一個資料集開始：${quickStartNextDatasets.map((d) => `${d.name} (${d.href})`).join("、")}。`,
    "- 想看額度與方案 → 方案價格（/pricing）。",
    "- 下一步 → 認證（/docs/authentication）",
  ].join("\n");
}

export const authCurl = `curl "https://api.twmarketdata.com/v2/datasets/monthly-revenue?symbol=2330" \\
  -H "X-API-Key: $TWMD_API_KEY"`;

export const authHabits: { term: string; desc: string }[] = [
  { term: "金鑰只放標頭，別放網址", desc: "免得留在伺服器日誌或瀏覽紀錄裡。" },
  { term: "一個環境一把金鑰", desc: "開發跟正式分開，哪把外洩就撤哪把（多把金鑰依方案提供）。" },
  { term: "額度看方案", desc: "每把金鑰的每分鐘請求數與每月用量依方案計。" },
];

export function authenticationLlmsMarkdown(): string {
  return [
    "每個請求都帶 X-API-Key 標頭。金鑰在儀表板（/dashboard）自己建立、輪替、撤銷，不用聯絡我們。",
    "```bash",
    authCurl,
    "```",
    "",
    "### 幾個習慣",
    ...authHabits.map((h) => `- ${h.term} — ${h.desc}`),
    "",
    "### 常見錯誤",
    "- 401 — 金鑰沒帶或無效。",
    "- 403 — 你的方案沒有這個資料集的權限。",
    "- 429（速率限制）— rate-limit 回應與 Retry-After 標頭建置中；超過方案 RPM／額度的行為以上線公告為準。",
    "",
    "下一步 → 來源政策（/docs/data-provenance）",
  ].join("\n");
}
