import Link from "next/link";

import { cn } from "@/src/lib/cn";

type SectionHeadingProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({ id, children, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cn("group scroll-mt-24 text-xl font-semibold tracking-tight text-slate-900", className)}>
      <Link href={`#${id}`} className="-mx-1 inline-flex min-h-8 items-center gap-2 rounded-sm px-1 hover:text-slate-700">
        <span>{children}</span>
        <span className="inline-flex h-5 w-5 items-center justify-center text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          #
        </span>
      </Link>
    </h2>
  );
}
