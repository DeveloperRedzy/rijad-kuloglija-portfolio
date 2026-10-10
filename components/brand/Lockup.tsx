import { Monogram } from "./Monogram";

/** `unlit` renders the monogram without its signal dot lit, for when a live NavDot is overlaid beside the link. */
export function Lockup({ size = 22, unlit = false }: { size?: number; unlit?: boolean }) {
  return (
    <span className="inline-flex items-center gap-[0.45em] text-ink" style={{ fontSize: size }}>
      <Monogram size={size} title="Redzy monogram" lit={!unlit} glow={!unlit} />
      <span className="font-display font-extrabold tracking-[-0.045em] leading-none" style={{ fontSize: size * 1.05 }}>
        Redzy
      </span>
    </span>
  );
}
