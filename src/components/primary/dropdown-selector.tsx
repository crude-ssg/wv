import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { FieldLabel } from "./field-label";
import { cn } from "@/lib/utils";

interface DropdownSelectorProps<T extends string> {
  label?: string;
  icon?: ReactNode;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  variant?: "default" | "small";
}

export function DropdownSelector<T extends string>({
  label,
  icon,
  options,
  value,
  onChange,
  className = "",
  variant = "default"
}: DropdownSelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSmall = variant === "small";

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn(!isSmall && "space-y-3", "relative", className)} ref={dropdownRef}>
      {!isSmall && label && <FieldLabel icon={icon}>{label}</FieldLabel>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between transition-all duration-300 border cursor-pointer",
            isSmall 
              ? "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" 
              : "w-full px-4 py-3 rounded-btn text-sm font-semibold",
            isOpen 
              ? "bg-accent/10 border-accent/30 text-accent shadow-glow-sm" 
              : "bg-white/5 border-white/10 text-muted hover:text-brand hover:border-white/20"
          )}
        >
          <span className="flex items-center gap-2">
            {isSmall && icon && <span>{icon}</span>}
            {value}
          </span>
          <ChevronDown 
            size={isSmall ? 12 : 16} 
            className={cn("transition-transform duration-300 opacity-60 ml-2", isOpen && "rotate-180 opacity-100")} 
          />
        </button>

        {/* Dropdown Menu */}
        <div 
          className={cn(
            "absolute top-full mt-2 z-50 overflow-hidden transition-all duration-300 rounded-drop border border-border shadow-dropdown bg-gradient-dropdown backdrop-blur-xl origin-top",
            isSmall ? "right-0 min-w-32" : "left-0 w-full",
            isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="p-1.5 space-y-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200",
                  value === opt 
                    ? "bg-accent/20 text-accent font-bold" 
                    : "text-muted hover:bg-white/5 hover:text-brand"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
