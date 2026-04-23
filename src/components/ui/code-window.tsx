import { cn } from "@/src/lib/cn";

type CodeWindowProps = {
  title: string;
  code: string;
  className?: string;
};

export function CodeWindow({ title, code, className }: CodeWindowProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-slate-950 transition hover:border-slate-400", className)}>
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-600" />
        </div>
        <p className="text-[11px] font-medium text-slate-400">{title}</p>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
