export type DocsSection = {
  id: string;
  label: string;
};

export const docsPageNav = [
  { href: "/docs", label: "快速上手" },
  { href: "/api", label: "API 參考" },
  { href: "/datasets", label: "資料集目錄" },
  { href: "/pricing", label: "方案" },
  { href: "/about", label: "來源政策" },
];

export const docsLandingSections: DocsSection[] = [
  { id: "intro", label: "介紹" },
  { id: "auth", label: "驗證" },
  { id: "datasets", label: "資料集" },
  { id: "examples", label: "範例" },
];

export const apiSections: DocsSection[] = [
  { id: "overview", label: "總覽" },
  { id: "auth", label: "驗證" },
  { id: "datasets", label: "資料集" },
  { id: "examples", label: "請求範例" },
];

export const datasetsSections: DocsSection[] = [
  { id: "catalog", label: "資料目錄" },
  { id: "maturity", label: "成熟度" },
  { id: "source", label: "來源" },
];

export const aboutSections: DocsSection[] = [
  { id: "trust-model", label: "信任模型" },
  { id: "source-policy", label: "來源政策" },
  { id: "why-us", label: "為什麼是這個產品" },
];
