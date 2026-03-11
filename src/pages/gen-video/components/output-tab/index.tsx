import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { VideoPlayer } from '@/components/video-player';
import { ProcessingState } from './processing-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { HistorySidebar } from './history-sidebar';
import type { GenSettings, VideoData } from '@/lib/api.types.gen';
import { generateVideo } from '@/lib/api';

export interface OutputTabHandle {
  startGeneration: (settings: GenSettings) => void;
}

interface OutputTabProps {
  onRetry: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const MOCK_HISTORY: VideoData[] = [
  { id: 1, url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', prompt: 'Cinematic sunset over mountains', timestamp: '2m ago', thumbnail: null },
  { id: 2, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: 'Cute bunny in the forest', timestamp: '15m ago', thumbnail: null },
  { id: 3, url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', prompt: 'Cyberpunk rainy city street', timestamp: '1h ago', thumbnail: null },
];

export const OutputTab = forwardRef<OutputTabHandle, OutputTabProps>(({ onRetry, onProcessingChange }, ref) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<VideoData[]>(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    onProcessingChange?.(isProcessing);
  }, [isProcessing, onProcessingChange]);

  useImperativeHandle(ref, () => ({
    startGeneration: async (settings: GenSettings) => {
      setIsProcessing(true);
      setCurrentVideo(null);
      setError(null);

      try {
        const resultVideo = await generateVideo(settings)
        setCurrentVideo(resultVideo);
        setHistory(prev => [resultVideo, ...prev]);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("Unknown error occured")
        }
      } finally {
        setIsProcessing(false);
      }
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
        ) : currentVideo ? (
          <div className="flex-1 p-2 md:p-4 flex items-center justify-center min-h-0 overflow-hidden">
            <div className="w-full h-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-black/40">
              <VideoPlayer src={currentVideo.url} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        currentVideo={currentVideo}
        onSelect={setCurrentVideo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
});

OutputTab.displayName = 'OutputTab';
