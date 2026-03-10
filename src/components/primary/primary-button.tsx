import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PrimaryButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("btn-primary", className)}
    >
      {children}
    </button>
  );
}