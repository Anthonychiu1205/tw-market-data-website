import { cn } from "@/src/lib/cn";

type MarketingContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingContainer({ children, className }: MarketingContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[52px]", className)}>
      {children}
    </div>
  );
}

