import { useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { PromptInput } from './prompt-input';
import type { GenSettings, Mode, AspectRatio, Duration } from '@/lib/api.types.gen';

interface GenerateTabProps {
  onGenerate: (settings: GenSettings) => void;
}

export function GenerateTab({ onGenerate }: GenerateTabProps) {
  const [mode, setMode] = useState<Mode>('I2V');
  const [positivePrompt, setPositivePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<Duration>('10s');
  const [encodedImage, setEncodedImage] = useState<string | null>(null);

  const handleGenerate = () => {
    onGenerate({
      mode,
      positivePrompt,
      encodedImage,
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
        positivePrompt={positivePrompt} 
        onPositiveChange={setPositivePrompt} 
        negativePrompt={negativePrompt}
        onNegativeChange={setNegativePrompt}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        duration={duration}
        onDurationChange={setDuration}
        image={encodedImage}
        onImageChange={setEncodedImage}
        onGenerate={handleGenerate}
      />
    </div>
  );
}