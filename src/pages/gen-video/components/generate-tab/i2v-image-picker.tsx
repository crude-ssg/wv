import { ChevronDown, History, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, fileToDataUrl } from "@/lib/utils";

interface I2VImagePickerProps {
  className?: string;
  selectedImage?: string | null;
  onImageChange: (base64Image: string) => void;
}

type PickerSource = 'device' | 'library';

export function I2VImagePicker({ className, selectedImage, onImageChange }: I2VImagePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handlePick(selectFrom: PickerSource) {
    if (selectFrom === 'device') {
      fileInputRef.current?.click();
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToDataUrl(file);
        onImageChange(base64);
      } catch (error) {
        console.error("Failed to convert file to data URL:", error);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("absolute bottom-4 left-4 z-20", className)} ref={ref}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200",
          selectedImage
            ? "bg-accent/20 border border-accent/60 text-[#ffe4f1]"
            : "bg-accent/14 border border-accent/40 text-[#ffe4f1] backdrop-blur-md shadow-picker hover:bg-accent/20"
        )}
      >
        {selectedImage ? (
          <div className="w-4 h-4 rounded overflow-hidden shadow-sm">
            <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
          </div>
        ) : (
          <Plus size={13} className="text-accent" />
        )}
        Reference Image
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
            { icon: <Upload size={15} />, label: 'Upload from device', selectFrom: 'device' as PickerSource, border: true },
            { icon: <History size={15} />, label: 'Choose from history', selectFrom: 'library' as PickerSource, border: false },
          ].map(({ icon, label, border, selectFrom }) => (
            <button
              key={label}
              onClick={() => handlePick(selectFrom)}
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