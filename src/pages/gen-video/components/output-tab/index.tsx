import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { VideoPlayer } from '@/components/video-player';
import { ProcessingState } from './processing-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { HistorySidebar } from './history-sidebar';
import type { HistoryItem } from './history-sidebar';
import type { GenSettings } from '../generate-tab';

export interface OutputTabHandle {
  startGeneration: (settings: GenSettings) => void;
}

interface OutputTabProps {
  onRetry: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', prompt: 'Cinematic sunset over mountains', timestamp: '2m ago' },
  { id: '2', url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: 'Cute bunny in the forest', timestamp: '15m ago' },
  { id: '3', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', prompt: 'Cyberpunk rainy city street', timestamp: '1h ago' },
];

export const OutputTab = forwardRef<OutputTabHandle, OutputTabProps>(({ onRetry, onProcessingChange }, ref) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    onProcessingChange?.(isProcessing);
  }, [isProcessing, onProcessingChange]);

  useImperativeHandle(ref, () => ({
    startGeneration: (settings: GenSettings) => {
      setIsProcessing(true);
      setError(null);
      
      // Simulate generation
      setTimeout(() => {
        setIsProcessing(false);
        const newVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
        setResultVideo(newVideoUrl);
        
        // Add to history
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          url: newVideoUrl,
          prompt: settings.prompt,
          timestamp: 'Just now'
        };
        setHistory(prev => [newItem, ...prev]);
      }, 4000);
    }
  }));

  return (
    <div className="flex-1 flex flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
      {/* Left Area (Player/States) */}
      <div className="flex-1 flex flex-col min-w-0">
        {isProcessing ? (
          <ProcessingState />
        ) : error ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : resultVideo ? (
          <div className="flex-1 p-2 md:p-4 flex items-center justify-center min-h-0 overflow-hidden">
            <div className="w-full h-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-black/40">
              <VideoPlayer src={resultVideo} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* History Sidebar */}
      <HistorySidebar 
        history={history}
        currentVideoUrl={resultVideo}
        onSelect={setResultVideo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
});

OutputTab.displayName = 'OutputTab';
