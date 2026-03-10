import { ImageIcon, Sparkles, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const TIPS = [
  { 
    icon: <Sparkles size={15} />, 
    title: 'Use keywords',   
    body: "Add 'cinematic', 'slow motion', or '4K' for better quality.",
    colorClass: "text-accent",
    bgClass: "bg-accent/18",
    hoverBorderClass: "hover:border-accent/35"
  },
  { 
    icon: <ImageIcon size={15} />, 
    title: 'Clear subjects', 
    body: 'Ensure your source image has a clear subject for better animation.',
    colorClass: "text-[#38bdf8]",
    bgClass: "bg-[#38bdf8]/18",
    hoverBorderClass: "hover:border-[#38bdf8]/35"
  },
  { 
    icon: <Video size={15} />,     
    title: 'Batch it',       
    body: 'Try multiple prompts to explore different directions quickly.',
    colorClass: "text-accent-amber",
    bgClass: "bg-accent-amber/18",
    hoverBorderClass: "hover:border-accent-amber/35"
  },
];

export function TipCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TIPS.map(({ icon, title, body, colorClass, bgClass, hoverBorderClass }) => (
        <div
          key={title}
          className={cn(
            "border p-5 text-sm transition-all duration-200 cursor-default",
            "rounded-input bg-card/60 border-dim/80",
            "hover:bg-card/90",
            hoverBorderClass
          )}
        >
          <div className={cn("w-8 h-8 rounded-icon flex items-center justify-center mb-3", bgClass, colorClass)}>
            {icon}
          </div>
          <p className="font-semibold mb-1 text-subtle">{title}</p>
          <p className="text-xs leading-relaxed text-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}