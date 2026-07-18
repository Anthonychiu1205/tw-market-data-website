import { cn } from "@/src/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-secondary";

const baseButtonClass =
  "inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50";

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    "border border-black bg-black !text-white hover:opacity-90 hover:!text-white active:!text-white focus:!text-white visited:!text-white",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "border border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  danger: "border border-red-600 bg-red-600 !text-white hover:bg-red-700 hover:!text-white active:!text-white",
  "danger-secondary": "border border-red-300 bg-white text-red-600 hover:bg-red-50",
};

export function buttonClass(variant: ButtonVariant = "secondary", className?: string) {
  return cn(baseButtonClass, variantClassMap[variant], className);
}

