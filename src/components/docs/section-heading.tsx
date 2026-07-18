import { Link } from "@/src/i18n/navigation";

import { cn } from "@/src/lib/cn";

type SectionHeadingProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({ id, children, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cn("group scroll-mt-24 text-xl font-semibold tracking-tight text-slate-900", className)}>
      {/* Heading stays anchor-linkable (TOC targets #id), but the hover "#" affordance is hidden
          site-wide per request — no anchor icon appears on hover/focus. */}
      <Link href={`#${id}`} className="-mx-1 inline-flex min-h-8 items-center rounded-sm px-1 hover:text-slate-700">
        <span>{children}</span>
      </Link>
    </h2>
  );
}
