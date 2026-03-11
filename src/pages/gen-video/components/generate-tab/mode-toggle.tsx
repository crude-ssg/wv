import { ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mode } from "@/lib/api.types.gen";

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="flex justify-center">
      <div className="flex p-1 rounded-full border bg-card-deep/50 border-border/20 max-w-full overflow-x-auto no-scrollbar">
        {(['T2V', 'I2V'] as Mode[]).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => onChange(m)}
              className={cn(
                "flex items-center gap-2 px-4 md:px-7 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                active 
                  ? "bg-gradient-accent text-white shadow-mode-btn" 
                  : "text-muted"
              )}
            >
              {m === 'T2V' ? <Sparkles size={16} /> : <ImageIcon size={16} />}
              {m === 'T2V' ? 'Text to Video' : 'Image to Video'}
            </button>
          );
        })}
      </div>
    </div>
  );
}