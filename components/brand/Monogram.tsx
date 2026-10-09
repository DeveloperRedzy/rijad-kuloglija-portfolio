export const MONOGRAM = {
  stem: { x: 16, y: 10, width: 14, height: 80 },
  bowl: "M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z",
  leg: "42,50 56,50 80,90 66,90",
  dot: { cx: 46, cy: 32 },
} as const;

type Props = {
  size?: number;
  lit?: boolean;
  className?: string;
  title?: string;
  glow?: boolean;
};

export function Monogram({ size = 32, lit = true, className, title = "Redzy", glow = true }: Props) {
  const r = size <= 20 ? 6.5 : 5;
  const dotColor = lit ? "var(--color-signal)" : "var(--color-ink-muted)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
      style={lit && glow ? { filter: "drop-shadow(0 0 6px rgba(255,74,38,.55))" } : undefined}
    >
      <g fill="currentColor">
        <rect x={MONOGRAM.stem.x} y={MONOGRAM.stem.y} width={MONOGRAM.stem.width} height={MONOGRAM.stem.height} />
        <path fillRule="evenodd" d={MONOGRAM.bowl} />
        <polygon points={MONOGRAM.leg} />
      </g>
      <circle cx={MONOGRAM.dot.cx} cy={MONOGRAM.dot.cy} r={r} fill={dotColor} data-signal-dot />
    </svg>
  );
}
