import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectButtonProps { 
  active: boolean; 
  onClick: () => void; 
  children: ReactNode; 
  className?: string; 
}

export function SelectButton({ active, onClick, children, className = '' }: SelectButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-3 border text-xs font-semibold transition-all duration-200 rounded-btn",
        active
          ? "bg-accent/15 border-accent text-white"
          : "bg-white/3 border-border-card text-muted",
        className
      )}
    >
      {children}
    </button>
  );
}