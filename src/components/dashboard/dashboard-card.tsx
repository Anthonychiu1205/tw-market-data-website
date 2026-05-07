import { cn } from "@/src/lib/cn";

type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_1px_0_rgba(15,23,42,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
