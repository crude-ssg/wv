import { useState } from 'react';
import {
  LayoutDashboard,
  Clock,
  Menu,
} from 'lucide-react';
import { GradientCard } from '@/components/primary/gradient-card';
import { Sidebar } from '@/components/sidebar';
import { PageHeader } from '@/pages/gen-video/components/page-header';
import { ModeToggle } from '@/pages/gen-video/components/mode-toggle';
import { OptionSelector } from '@/components/primary/option-selector';
import { PromptInput } from '@/pages/gen-video/components/prompt-input';
import { Pill } from '@/components/primary/pill';
import { GlowDot } from '@/components/primary/glow-dot';

export type Mode = 'T2V' | 'I2V';
export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
export type Duration = '5s' | '10s' | '15s';

export function GenVideoPage() {
  const [mode, setMode] = useState<Mode>('T2V');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<Duration>('10s');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto flex flex-col items-center relative">
        {/* Mobile Header */}
        <div className="w-full flex lg:hidden items-center justify-between p-4 border-b border-border/12 bg-bg-alt/50 backdrop-blur-md sticky top-0 z-30">
          <Pill variant="default"><GlowDot />BabeGen</Pill>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-muted hover:text-brand transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="w-full max-w-4xl space-y-8 px-4 py-8 lg:px-10 lg:py-10">
          <PageHeader />

          <GradientCard className="p-4 md:p-8 space-y-6 md:space-y-8">
            <ModeToggle mode={mode} onChange={setMode} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <OptionSelector
                label="Aspect Ratio"
                icon={<LayoutDashboard size={13} />}
                options={['16:9', '9:16','1:1', '4:3'] as AspectRatio[]}
                value={aspectRatio}
                onChange={setAspectRatio}
              />
              <OptionSelector
                label="Duration"
                icon={<Clock size={13} />}
                options={['5s', '10s', '15s'] as Duration[]}
                value={duration}
                onChange={setDuration}
                stretch
              />
            </div>

            <PromptInput 
              mode={mode} 
              prompt={prompt} 
              onChange={setPrompt} 
              negativePrompt={negativePrompt}
              onNegativeChange={setNegativePrompt}
            />
          </GradientCard>
        </div>
      </main>
    </div>
  );
}