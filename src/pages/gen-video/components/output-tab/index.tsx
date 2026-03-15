import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { VideoPlayer } from '@/components/video-player';
import { ProcessingState } from './processing-state';
import { ErrorState } from './error-state';
import { EmptyState } from './empty-state';
import { HistorySidebar } from './history-sidebar';
import type { GenSettings, VideoData } from '@/lib/api.types.gen';
import { createDummyVideo, generateVideo, getHistory } from '@/lib/api';
import type { Tab } from '../..';

export interface OutputTabHandle {
  startGeneration: (settings: GenSettings) => void;
}

interface OutputTabProps {
  onChangeTab: (tab: Tab) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export const OutputTab = forwardRef<OutputTabHandle, OutputTabProps>(({ onChangeTab, onProcessingChange }, ref) => {
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<VideoData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    pollState()
    const interval = setInterval(pollState, 10_000)
    return () => clearInterval(interval)
  }, [currentVideo])

  async function pollState() {
    let latestHistory = await getHistory()

    // if current video is not in history, add it
    if (currentVideo != null) {
      const video = latestHistory.find(v => v.id === currentVideo.id)
      if (video == null) {
        latestHistory.unshift(currentVideo)
      } else {
        setCurrentVideo(video)
      }
    }
    setHistory(latestHistory)
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
    setHistory(prev => [dummy, ...prev])

    try {
      const resultVideo = await generateVideo(settings)
      setCurrentVideo(resultVideo);
      throw new Error("Something went wrong")
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Unknown error occured")
      }
    } finally {
    }
  }

  // Using an inner Component so we can use early returns (I hate nested ternaries)
  function StateSwitch() {
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

    if (currentVideo.job_status == 'pending') {
      return <ProcessingState />
    }

    if (currentVideo.job_status == 'processing') {
      return <ProcessingState />
    }

    if (currentVideo.job_status == 'completed') {
      return (
        <div className="flex-1 p-2 md:p-4 flex items-center justify-center min-h-0 overflow-hidden">
          <div className="w-full h-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-black/40">
            <VideoPlayer src={currentVideo.url!} />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex-1 flex flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 h-full">
      {/* Left Area (Player/States) */}
      <div className="flex-1 flex flex-col min-w-0">
        <StateSwitch />
      </div>

      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        selectedVideoId={currentVideo?.id ?? null}
        onSelect={(id) => {
          const video = history.find(v => v.id === id)
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
