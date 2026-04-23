import { Fragment } from "react";
import Link from "next/link";

import { Container } from "../ui/container";

const footerLinks = [
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "服務條款" },
  { href: "/contact", label: "聯絡我們" },
  { href: "/", label: "TW Market Data © 2026" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
        <div className="mx-auto flex flex-nowrap items-center text-sm text-slate-600">
          {footerLinks.map((item, index) => (
            <Fragment key={item.label}>
              <Link href={item.href} className="text-sm text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
              {index < footerLinks.length - 1 ? <span className="px-2 text-slate-600">|</span> : null}
            </Fragment>
          ))}
        </div>
      </Container>
    </footer>
  );
}
