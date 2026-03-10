import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-bold text-brand">Generation Failed</h3>
        <p className="text-sm text-muted">{error}</p>
      </div>
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all text-brand"
      >
        Try Adjusting Settings
      </button>
    </div>
  );
}
