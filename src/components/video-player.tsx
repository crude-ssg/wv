import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export function VideoPlayer({ src, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const resetActivityTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className={cn("relative group overflow-hidden bg-black flex items-center justify-center h-full w-full", className)}
      onMouseMove={resetActivityTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        autoPlay
        loop
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />

      {/* Play Overlay (Desktop) */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
          isPlaying ? "opacity-0" : "opacity-100 bg-black/20"
        )}
      >
        <div className="w-16 h-16 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-glow-sm scale-110">
          <Play size={32} fill="currentColor" />
        </div>
      </div>

      {/* Control Bar Overlay */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 w-full px-6 pb-4 pt-16 md:px-10 md:pb-6 md:pt-20 transition-all duration-500",
          "bg-linear-to-t from-black/95 via-black/40 to-transparent", 
          showControls ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="flex items-center gap-4 md:gap-5">
          {/* Play/Pause & Mute */}
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="p-1.5 hover:text-accent transition-colors text-brand">
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            <button onClick={toggleMute} className="p-1.5 hover:text-accent transition-colors text-brand/90">
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </div>

          {/* Time Indicator */}
          <div className="text-[11px] font-mono text-brand/70 tabular-nums min-w-[75px] hidden sm:block">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Progress Bar (Scrobbler) - Now in the middle */}
          <div className="flex-1 relative h-1.5 group/progress cursor-pointer">
            <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden" />
            <div 
              className="absolute inset-0 bg-gradient-accent rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute h-3 w-3 bg-white rounded-full shadow-md -top-0.75 -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progress}%` }}
            />
          </div>

          <a 
            href={src} 
            download 
            className="p-1.5 hover:text-accent transition-colors text-brand/90"
            title="Download Video"
          >
            <Download size={22} />
          </a>

          <button 
            onClick={handleFullscreen} 
            className="p-1.5 hover:text-accent transition-colors text-brand/90"
            title="Fullscreen"
          >
            <Maximize size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
