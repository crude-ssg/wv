import { useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { PromptInput } from './prompt-input';
import type { GenSettings, Mode, AspectRatio, Duration } from '@/lib/api.types.gen';

interface GenerateTabProps {
  onGenerate: (settings: GenSettings) => void;
}

export function GenerateTab({ onGenerate }: GenerateTabProps) {
  const [mode, setMode] = useState<Mode>('T2V');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<Duration>('10s');

  const handleGenerate = () => {
    onGenerate({
      mode,
      prompt,
      negativePrompt,
      aspectRatio,
      duration
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <ModeToggle mode={mode} onChange={setMode} />
      <PromptInput 
        mode={mode} 
        prompt={prompt} 
        onChange={setPrompt} 
        negativePrompt={negativePrompt}
        onNegativeChange={setNegativePrompt}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        duration={duration}
        onDurationChange={setDuration}
        onGenerate={handleGenerate}
      />
    </div>
  );
}