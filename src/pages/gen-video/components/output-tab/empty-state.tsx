import { PlayCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted/30 border border-white/5">
        <PlayCircle size={48} />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-muted">No output yet</h3>
        <p className="text-sm text-muted/60 max-w-[200px]">Your generated videos will appear here.</p>
      </div>
    </div>
  );
}
