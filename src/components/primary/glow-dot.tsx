export function GlowDot({ size = 8 }: { size?: number }) {
  return (
    <span
      className="shrink-0 inline-block bg-accent rounded-full shadow-glow-dot"
      style={{ width: size, height: size }}
    />
  );
}