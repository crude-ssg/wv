import { useState, useRef } from 'react';
import { PlayCircle, Loader2, Menu, Sparkles } from 'lucide-react';
import { GradientCard } from '@/components/primary/gradient-card';
import { Sidebar } from '@/components/sidebar';
import { OutputTab, type OutputTabHandle } from '@/pages/gen-video/components/output-tab';
import { Pill } from '@/components/primary/pill';
import { GlowDot } from '@/components/primary/glow-dot';
import { cn } from "@/lib/utils";
import { GenerateTab } from './components/generate-tab';
import type { GenSettings } from '@/lib/api.types.gen';

export function GenVideoPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'output'>('generate');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const outputTabRef = useRef<OutputTabHandle>(null);

  const handleGenerate = (settings: GenSettings) => {
    setActiveTab('output');
    // We need to wait a tick for the tab to be potentially "visible" if we were doing mount-based logic,
    // but with hidden it should be fine. However, startGeneration is imperative.
    outputTabRef.current?.startGeneration(settings);
  };

  return (
    <div className="flex h-screen w-full bg-bg">
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

        <div className="w-full h-full p-2 md:p-4 flex flex-col">
          <GradientCard className="flex-1 flex flex-col">
            {/* Tabs Header */}
            <div className="flex items-center gap-4 px-6 pt-4 border-b border-white/5">
              <button
                onClick={() => setActiveTab('generate')}
                className={cn(
                  "flex items-center gap-2 pb-3 text-sm font-bold transition-all relative",
                  activeTab === 'generate' ? "text-accent" : "text-muted hover:text-brand"
                )}
              >
                <Sparkles size={16} />
                Generate
                {activeTab === 'generate' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full shadow-glow-sm" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={cn(
                  "flex items-center gap-2 pb-3 text-sm font-bold transition-all relative",
                  activeTab === 'output' ? "text-accent" : "text-muted hover:text-brand"
                )}
              >
                <PlayCircle size={16} />
                Output
                {isProcessing && <Loader2 size={12} className="animate-spin text-accent" />}
                {activeTab === 'output' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full shadow-glow-sm" />
                )}
              </button>
            </div>

            <div className="flex-1 relative min-h-0">
               {/* 
                 We keep both mounted to preserve state. 
                 We use absolute positioning to stack them and control visibility with opacity/pointer-events OR display:none.
                 Using display:none is safer for avoiding layout issues, but we might lose some transitions.
                 However, the user asked for state movement, which requires persistence.
               */}
               <div className={cn("absolute inset-0 flex flex-col", activeTab !== 'generate' && "hidden")}>
                  <GenerateTab onGenerate={handleGenerate} />
               </div>
               
               <div className={cn("absolute inset-0 flex flex-col", activeTab !== 'output' && "hidden")}>
                  <OutputTab 
                    ref={outputTabRef} 
                    onRetry={() => setActiveTab('generate')} 
                    onProcessingChange={setIsProcessing} 
                  />
               </div>
            </div>
          </GradientCard>
        </div>
      </main>
    </div>
  );
}