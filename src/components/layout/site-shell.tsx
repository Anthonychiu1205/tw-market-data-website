"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { ContactModal } from "./contact-modal";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const hideFooterForAppShell =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/usage");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onContactClick={() => setIsContactModalOpen(true)} />
      <main className="flex-1 bg-slate-50">{children}</main>
      {!hideFooterForAppShell ? <SiteFooter onContactClick={() => setIsContactModalOpen(true)} /> : null}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
