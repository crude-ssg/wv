import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GradientCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border rounded-card bg-gradient-card border-border shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}