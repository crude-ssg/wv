import { ProgressBar } from "@/components/primary/progress-bar";

export function CreditsCard({ used, total }: { used: number; total: number }) {
  return (
    <div className="mt-auto pt-6">
      <div className="p-4 border text-sm rounded-input bg-gradient-credits-card border-border-card shadow-card">
        <p className="mb-2 text-xs uppercase tracking-widest font-medium text-muted">Tokens</p>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base text-brand">{total.toLocaleString()}</span>
          <span className="text-xs font-semibold cursor-pointer text-accent"><a href="/buy.php">Recharge →</a></span>
        </div>
        <ProgressBar value={used} />
      </div>
    </div>
  );
}