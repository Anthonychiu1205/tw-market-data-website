import Link from "next/link";

import { Container } from "../ui/container";

const policyLinks = [
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "服務條款" },
];

const supportLinks = [
  { href: "/faq", label: "常見問題" },
  { href: "/help", label: "幫助中心" },
  { href: "/help#system-status", label: "API 狀態" },
  { href: "/docs/sdk/python-sdk", label: "SDK" },
  { href: "/docs/ai-agents/mcp-server-preview", label: "AI Agents" },
];

type SiteFooterProps = {
  onContactClick: () => void;
};

export function SiteFooter({ onContactClick }: SiteFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
        <div className="mx-auto flex flex-wrap items-center justify-center text-sm text-slate-600">
          {policyLinks.map((item) => (
            <span key={item.label} className="inline-flex items-center">
              <Link href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
              <span className="px-2 text-slate-600">|</span>
            </span>
          ))}
          {supportLinks.map((item) => (
            <span key={item.label} className="inline-flex items-center">
              <Link href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
              <span className="px-2 text-slate-600">|</span>
            </span>
          ))}
          <button
            type="button"
            onClick={onContactClick}
            className="text-sm text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            聯繫我們
          </button>
          <span className="px-2 text-slate-600">|</span>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            TW Market Data © 2026
          </Link>
        </div>
      </Container>
    </footer>
  );
}
