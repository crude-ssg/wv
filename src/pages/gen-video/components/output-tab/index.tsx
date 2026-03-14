import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { VideoPlayer } from '@/components/video-player';
import { ProcessingState } from './processing-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { HistorySidebar } from './history-sidebar';
import type { GenSettings, VideoData } from '@/lib/api.types.gen';
import { generateVideo, getHistory, status } from '@/lib/api';

export interface OutputTabHandle {
  startGeneration: (settings: GenSettings) => void;
}

interface OutputTabProps {
  onRetry: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const MOCK_HISTORY: VideoData[] = [
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

  useEffect(() => {
    pollState()
    const interval = setInterval(pollState, 10_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if(currentVideo?.job_status == 'completed' || currentVideo?.job_status == 'failed') {
      setIsProcessing(false)
    } else {
      setIsProcessing(true)
    }
  }, [currentVideo])

  async function pollState() {
    if (currentVideo != null) {
      const videoStatus = await status(currentVideo.id)
      setCurrentVideo(videoStatus)
    }

    const latestHistory = await getHistory()
    setHistory(latestHistory)
  }

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
          currentVideo.job_status === 'completed' ? (
            <div className="flex-1 p-2 md:p-4 flex items-center justify-center min-h-0 overflow-hidden">
              <div className="w-full h-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-black/40">
                <VideoPlayer src={currentVideo.url!} />
              </div>
            </div>
          ) : currentVideo.job_status === 'failed' ? (
            <ErrorState error="This video generation task failed to complete." onRetry={onRetry} />
          ) : (
            <ProcessingState />
          )
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
