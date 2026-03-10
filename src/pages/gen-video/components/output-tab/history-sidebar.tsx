import { Search, PlayCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
  thumbnail?: string;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  currentVideoUrl: string | null;
  onSelect: (url: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HistorySidebar({ 
  history, 
  currentVideoUrl, 
  onSelect, 
  searchQuery, 
  onSearchChange 
}: HistorySidebarProps) {
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
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
                onClick={() => onSelect(item.url)}
                className={cn(
                  "w-full text-left p-2 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                  currentVideoUrl === item.url 
                    ? "bg-accent/10 border-accent/20" 
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                )}
              >
                <div className="flex gap-3">
                  <div className="w-16 h-12 rounded-lg bg-black/40 shrink-0 overflow-hidden relative border border-white/5">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <PlayCircle size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[11px] font-bold text-brand truncate group-hover:text-accent transition-colors">
                      {item.prompt}
                    </p>
                    <p className="text-[9px] text-muted font-medium mt-0.5 opacity-60">
                      {item.timestamp}
                    </p>
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
