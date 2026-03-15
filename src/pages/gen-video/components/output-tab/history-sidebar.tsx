import { Search, PlayCircle, Loader2, AlertCircle, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { VideoData } from '@/lib/api.types.gen';

interface HistorySidebarProps {
  history: VideoData[];
  selectedVideoId: string | null;
  onSelect: (videoId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HistorySidebar({
  history,
  selectedVideoId,
  onSelect,
  searchQuery,
  onSearchChange
}: HistorySidebarProps) {
  const filteredHistory = history.filter(item =>
    item.prompt.positivePrompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hidden md:flex w-72 flex-col bg-black/20 backdrop-blur-sm border-l border-white/5">
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-brand placeholder:text-muted/50 focus:outline-none focus:border-accent/30 pr-8 transition-colors"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-muted/40 pointer-events-none">
            <Search size={14} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredHistory.length > 0 ? (
          <div className="p-2 space-y-1">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "w-full text-left p-2 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                   selectedVideoId === item.id
                    ? "bg-accent/10 border-accent/20"
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                )}
              >
                <div className="flex gap-3">
                  <div className="w-16 h-12 rounded-lg bg-black/40 shrink-0 overflow-hidden relative border border-white/5">
                    {item.thumbnail ? (
                      <>
                        <img src={item.thumbnail} className="w-full h-full object-cover" />
                        {item.job_status === 'processing' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 size={14} className="animate-spin text-accent" />
                          </div>
                        )}
                        {item.job_status === 'failed' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <AlertCircle size={14} className="text-red-500" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/60">
                        {item.job_status === 'processing' ? <Loader2 size={14} className="animate-spin text-accent" /> :
                         item.job_status === 'pending' ? <Clock size={14} className="text-white/50" /> :
                         item.job_status === 'failed' ? <AlertCircle size={14} className="text-red-500/70" /> :
                         <PlayCircle size={14} className="opacity-20" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[11px] font-bold text-brand truncate group-hover:text-accent transition-colors">
                      {item.prompt.positivePrompt}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[9px] text-muted font-medium opacity-60">
                        {item.timestamp}
                      </p>
                      {item.job_status && item.job_status !== 'completed' && (
                        <span className={cn(
                          "text-[8px] px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wider",
                          item.job_status === 'failed' ? "bg-red-500/10 text-red-500" :
                          item.job_status === 'processing' ? "bg-accent/10 text-accent animate-pulse" :
                          "bg-white/10 text-white/70"
                        )}>
                          {item.job_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-30">
            <PlayCircle size={24} className="mb-2" />
            <p className="text-[10px] font-semibold">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}
