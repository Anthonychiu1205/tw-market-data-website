import { Fragment } from "react";
import Link from "next/link";

import { Container } from "../ui/container";

const footerLinks = [
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "服務條款" },
  { href: "/", label: "TW Market Data © 2026" },
];

type SiteFooterProps = {
  onContactClick: () => void;
};

export function SiteFooter({ onContactClick }: SiteFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
        <div className="mx-auto flex flex-nowrap items-center text-sm text-slate-600">
          {footerLinks.slice(0, 2).map((item) => (
            <Fragment key={item.label}>
              <Link href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
              <span className="px-2 text-slate-600">|</span>
            </Fragment>
          ))}
          <button
            type="button"
            onClick={onContactClick}
            className="text-sm text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            聯繫我們
          </button>
          <span className="px-2 text-slate-600">|</span>
          <Link href={footerLinks[2].href} className="text-sm text-slate-600 hover:text-slate-900">
            {footerLinks[2].label}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
