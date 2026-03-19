import { useState, useImperativeHandle, forwardRef, useEffect, useRef, useMemo } from 'react';
import { VideoPlayer } from '@/components/video-player';
import { ProcessingState } from './processing-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { HistorySidebar } from './history-sidebar';
import type { GenSettings, VideoData } from '@/lib/api.types.gen';
import { createDummyVideo, generateVideo, getHistory } from '@/lib/api';
import { useEvent, appEvents } from '@/lib/events';
import type { Tab } from '../..';

export interface OutputTabHandle {
  startGeneration: (settings: GenSettings) => void;
}

interface OutputTabProps {
  onChangeTab: (tab: Tab) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export const OutputTab = forwardRef<OutputTabHandle, OutputTabProps>(({ onChangeTab }, ref) => {
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentVideoRef = useRef<VideoData | null>(null);

  // Sync ref with state
  useEffect(() => {
    currentVideoRef.current = currentVideo;
  }, [currentVideo]);

  // Handle history updates from events
  useEvent('history:update', ({ history: newHistory }) => {
    setVideoHistory(newHistory);
  });

  useEffect(() => {
    pollState()
    const interval = setInterval(pollState, 15_000)
    return () => clearInterval(interval)
  }, [])

  async function pollState() {
    try {
      let latestHistory = await getHistory()
      const current = currentVideoRef.current;

      // if current video is not in history, add it
      if (current != null) {
        const videoFromHistory = latestHistory.find(v => v.id === current.id)
        if (videoFromHistory == null) {
          // If it's a dummy or just not indexed yet, keep using the current one
          if (!latestHistory.some(h => h.id === current.id)) {
            latestHistory.unshift(current)
          }
        } else {
          // IMPORTANT: Only update if status changed. 
          // This prevents "Video player resets" and "UI resets" bugs.
          // Also check for downgrade (stale server data)
          const isDowngrade = current.job_status === 'completed' && videoFromHistory.job_status !== 'completed';
          
          if (videoFromHistory.job_status !== current.job_status && !isDowngrade) {
            setCurrentVideo(videoFromHistory)
          } else if (JSON.stringify(videoFromHistory) !== JSON.stringify(current) && !isDowngrade) {
             // If extra data changed but status didn't, we still might want to update,
             // but we must be careful not to trigger a re-render that resets the player.
             // For now, let's only update if status changed to be safe.
          }
        }
      }
      
      appEvents.emit('history:update', { history: latestHistory });
    } catch (e) {
      console.error("Failed to poll state:", e);
    }
  }

  useImperativeHandle(ref, () => ({
    startGeneration
  }));

  async function startGeneration(settings: GenSettings) {
    setError(null);
    const dummy = createDummyVideo(settings)
    dummy.id = "dummy"
    dummy.job_status = 'pending'
    setCurrentVideo(dummy)

    try {
      const resultVideo = await generateVideo(settings)
      setCurrentVideo(resultVideo);
      setVideoHistory(prev => [resultVideo, ...prev])
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Unknown error occured")
      }
    } finally {
    }
  }

  // We use useMemo for the main content to avoid unnecessary re-renders
  // and we inline the logic instead of using a nested function component
  // to avoid the "remount on every render" bug.
  const mainContent = useMemo(() => {
    if (currentVideo?.id == null) {
      return <EmptyState />
    }

    // Must appear before pending check so it shows error instead of pending
    if (currentVideo.job_status == 'failed' || error != null) {
      return (
        <ErrorState
          error={error ?? 'Unknown error occured'}
          onAdjust={() => onChangeTab('generate')}
          onRetry={() => startGeneration(currentVideo.prompt)}
        />
      )
    }

    if (currentVideo.job_status == 'pending' || currentVideo.job_status == 'processing') {
      return <ProcessingState />
    }

    if (currentVideo.job_status == 'completed') {
      return (
        <div className="flex-1 p-2 md:p-4 flex items-center justify-center min-h-0 overflow-hidden">
          <div className="w-full h-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-black/40">
            {/* The src must be the same string across renders to avoid player reload */}
            <VideoPlayer src={currentVideo.url ?? ''} />
          </div>
        </div>
      )
    }

    return <EmptyState />
  }, [currentVideo, error, onChangeTab]);

  return (
    <div className="flex-1 flex flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
      {/* Left Area (Player/States) */}
      <div className="flex-1 flex flex-col min-w-0">
        {mainContent}
      </div>

      {/* History Sidebar */}
      <HistorySidebar
        history={videoHistory}
        selectedVideoId={currentVideo?.id ?? null}
        onSelect={(id) => {
          const video = videoHistory.find(v => v.id === id)
          if (video) {
            setCurrentVideo(video)
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
});

OutputTab.displayName = 'OutputTab';
