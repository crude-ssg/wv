import { useState } from "react";
import { Sparkles, Zap, Ban, Eye, EyeOff, LayoutDashboard, Clock } from "lucide-react";
import { FieldLabel } from "@/components/primary/field-label";
import { I2VImagePicker } from "@/pages/gen-video/components/generate-tab/i2v-image-picker";
import { PrimaryButton } from "@/components/primary/primary-button";
import { DropdownSelector } from "@/components/primary/dropdown-selector";
import { type Mode, type AspectRatio, type Duration } from "@/pages/gen-video";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  mode: Mode;
  prompt: string;
  onChange: (v: string) => void;
  negativePrompt: string;
  onNegativeChange: (v: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (v: AspectRatio) => void;
  duration: Duration;
  onDurationChange: (v: Duration) => void;
  onGenerate: () => void;
}

export function PromptInput({ 
  mode, 
  prompt, 
  onChange, 
  negativePrompt, 
  onNegativeChange,
  aspectRatio,
  onAspectRatioChange,
  duration,
  onDurationChange,
  onGenerate
}: PromptInputProps) {
  const [showNegative, setShowNegative] = useState(false);

  const hasNegative = negativePrompt.trim().length > 0;
  const hasPositive = prompt.trim().length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel 
          icon={showNegative ? <Ban size={13} className="text-red-400 my-auto" /> : <Sparkles size={13} />} 
        >
          {showNegative ? "Negative Prompt" : "Positive Prompt"}
        </FieldLabel>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNegative(!showNegative)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border",
              showNegative 
                ? "bg-accent/10 border-accent/30 text-accent" 
                : "bg-white/5 border-white/10 text-muted hover:text-brand hover:border-white/20"
            )}
          >
            {showNegative? (<Eye size={13}/>): (<EyeOff size={13} />)} 
            Negative
            {!showNegative && hasNegative && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            )}
            {showNegative && hasPositive && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="relative group">
          <textarea
            value={showNegative ? negativePrompt : prompt}
            onChange={(e) => showNegative ? onNegativeChange(e.target.value) : onChange(e.target.value)}
            placeholder={showNegative 
              ? 'Low quality, blurry, static, distorted, messy, watermark…'
              : mode === 'T2V'
                ? 'A neon-lit cityscape at midnight, slow cinematic pan, ethereal fog, 4K…'
                : 'Describe how you want your image to animate…'}
            rows={6}
            className={cn(
              "w-full border p-5 text-sm leading-relaxed resize-none focus:outline-none transition-all duration-300 rounded-input caret-accent focus:ring-3",
              showNegative 
                ? "bg-red-900/5 border-red-500/20 text-brand focus:border-red-500/40 focus:ring-red-500/5" 
                : "bg-card-deep/30 border-dim/85 text-brand focus:border-accent/50 focus:ring-accent/8"
            )}
          />

          {!showNegative && mode === 'I2V' && <I2VImagePicker />}
          
          {/* Subtle indicator of which mode we are in */}
          <div className="absolute top-4 right-5 pointer-events-none opacity-20 transition-opacity group-hover:opacity-40">
             {showNegative ? <Ban size={18} /> : <Sparkles size={18} />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownSelector
            variant="small"
            icon={<LayoutDashboard size={11} />}
            options={['16:9', '9:16','1:1', '4:3'] as AspectRatio[]}
            value={aspectRatio}
            onChange={onAspectRatioChange}
          />
          <DropdownSelector
            variant="small"
            icon={<Clock size={11} />}
            options={['5s', '10s', '15s'] as Duration[]}
            value={duration}
            onChange={onDurationChange}
          />
        </div>

        <PrimaryButton 
          onClick={onGenerate}
          className="md:absolute md:bottom-12 md:right-4 mt-3 md:mt-0 w-full md:w-auto px-6 py-2.5 rounded-full text-sm"
        >
          Generate <Zap size={15} />
        </PrimaryButton>
      </div>

      <p className="text-xs text-center pt-1 text-muted">
        {showNegative 
          ? "Describe what you want the AI to avoid in the generation."
          : "Describe your scene and let our AI bring it to life."}
      </p>
    </div>
  );
}