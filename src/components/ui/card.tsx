import { cn } from "@/src/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_1px_0_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
