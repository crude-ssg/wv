import { ChevronDown, History, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface I2VImagePickerProps {
  className?: string;
}

export function I2VImagePicker({ className }: I2VImagePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={cn("absolute bottom-4 left-4 z-20", className)} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200",
          "bg-accent/14 border border-accent/40 text-[#ffe4f1] backdrop-blur-md shadow-picker hover:bg-accent/20"
        )}
      >
        <Plus size={13} className="text-accent" />
        Source Image
        <ChevronDown 
          size={12} 
          className={cn(
            "text-accent transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )} 
        />
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-52 border overflow-hidden z-50 rounded-drop bg-gradient-dropdown border-border shadow-dropdown"
        >
          {[
            { icon: <Upload size={15} />,  label: 'Upload from device',  border: true },
            { icon: <History size={15} />, label: 'Choose from history', border: false },
          ].map(({ icon, label, border }) => (
            <button
              key={label}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-3.5 text-sm text-subtle transition-colors hover:bg-accent/7",
                border && "border-b border-dim/70"
              )}
            >
              <span className="text-accent">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}