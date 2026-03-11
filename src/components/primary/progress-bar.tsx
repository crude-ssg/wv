import { cn } from "@/lib/utils";

interface ProgressBarProps {
  pending?: boolean;
  value?: number; // percentage 0-100
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, pending, className, barClassName }: ProgressBarProps) {
  return (
    <div className={cn("w-full h-1 relative rounded-full overflow-hidden bg-white/6", className)}>
      {value && !pending && (
        <div
          className={cn("h-full rounded-full bg-gradient-accent-bar transition-all duration-500", barClassName)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      )}
      {pending && (
        <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-accent-bar animate-progress" />
      )}
    </div>
  );
}
