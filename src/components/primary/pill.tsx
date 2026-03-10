import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps { 
  children: ReactNode; 
  variant?: 'default' | 'accent'; 
  className?: string;
}

export function Pill({ children, variant = 'default', className = '' }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-brand",
        variant === 'accent' 
          ? "bg-accent/12 border-accent/35 text-[#ffe4f1]" 
          : "bg-bg-alt/80 border-border text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}