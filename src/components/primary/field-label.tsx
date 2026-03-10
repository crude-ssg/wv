import type { ReactNode } from "react";

export function FieldLabel({ icon, children, right }: { icon: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-widest flex items-center justify-between text-muted">
      <span className="flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        {children}
      </span>
      {right && <span className="font-normal normal-case tracking-normal text-xs">{right}</span>}
    </label>
  );
}