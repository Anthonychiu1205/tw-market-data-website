import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SiteShellProps = {
  children: React.ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">{children}</main>
      <SiteFooter />
    </>
  );
}
