import { ProgressBar } from '@/components/primary/progress-bar';
import { Loader2 } from 'lucide-react';

export function ProcessingState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-accent/20 border-t-accent animate-spin mx-auto" />
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent animate-pulse" size={32} />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-bold text-brand">Generating your video...</h3>
        <p className="text-sm text-muted">This may take a minute or two.</p>
      </div>
      <ProgressBar pending className='w-64' />
    </div>
  );
}
