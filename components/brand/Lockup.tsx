import { Monogram } from "./Monogram";
import { profile } from "@/content/profile";

/**
 * `unlit` renders the monogram without its signal dot lit, for when a live NavDot is overlaid beside the link.
 * `decorative` hides the whole lockup from assistive tech, for when the wrapping link carries its own label.
 */
export function Lockup({ size = 22, unlit = false, decorative = false }: { size?: number; unlit?: boolean; decorative?: boolean }) {
  return (
    <span aria-hidden={decorative || undefined} className="inline-flex items-center gap-[0.45em] text-ink" style={{ fontSize: size }}>
      <Monogram size={size} lit={!unlit} glow={!unlit} decorative={decorative} />
      <span className="font-display font-extrabold tracking-[-0.045em] leading-none" style={{ fontSize: size * 1.05 }}>
        {profile.brand}
      </span>
    </span>
  );
}
