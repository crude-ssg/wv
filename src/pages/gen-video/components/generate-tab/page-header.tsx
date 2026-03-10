import { GlowDot } from "@/components/primary/glow-dot";
import { Pill } from "@/components/primary/pill";

export function PageHeader() {
  return (
    <header className="text-center space-y-3">
      <div className="flex justify-center">
        <Pill variant="accent"><GlowDot />AI Video Studio</Pill>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold leading-tight">
        Generate stunning{' '}
        <span className="text-gradient-accent">
          AI videos
        </span>
        .
      </h1>
      <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed text-muted">
        Hyper-polished videos from text prompts or source images. Fast generations, curated models, and a clean dashboard.
      </p>
    </header>
  );
}