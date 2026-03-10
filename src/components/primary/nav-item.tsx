import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function NavItem({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-btn transition-all duration-200 border border-transparent hover:text-brand",
        active 
          ? "bg-accent/12 border-accent/28 text-brand" 
          : "text-muted",
      )}
    >
      <span className={cn(active && "text-accent")}>{icon}</span>
      {label}
    </a>
  );
}