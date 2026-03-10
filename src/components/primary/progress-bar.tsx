import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // percentage 0-100
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  return (
    <div className={cn("w-full h-1 rounded-full overflow-hidden bg-white/6", className)}>
      <div 
        className={cn("h-full rounded-full bg-gradient-accent-bar transition-all duration-500", barClassName)} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }} 
      />
    </div>
  );
}
