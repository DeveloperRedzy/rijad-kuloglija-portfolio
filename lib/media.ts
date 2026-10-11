// Widths scripts/process-assets.mjs writes next to each image, keyed by the width in the file name content points at
// (`hero-desktop-1600.webp` → 800, 1200 and 1600). Keep in sync with DESKTOP/MOBILE there.
const LADDERS: Record<string, readonly number[]> = { "1600": [800, 1200, 1600], "800": [400, 800] };

/** `sizes` for the layouts frames sit in (case hero and full-width gallery cells, 4/6 gallery cells, phones). */
export const SIZES = {
  hero: "(min-width: 1024px) 1072px, 100vw",
  gallery: "(min-width: 768px) 700px, 100vw",
  phone: "(min-width: 768px) 340px, 60vw",
} as const;

/** AVIF and WebP `srcset` lists (w descriptors) for a `<name>-<width>.webp` src. */
export function mediaSrcSet(src: string): { avif: string; webp: string } {
  const match = /^(.+)-(\d+)\.webp$/.exec(src);
  if (!match) throw new Error(`expected a <name>-<width>.webp src, got ${src}`);
  const [, base, width] = match;
  const widths = LADDERS[width] ?? [Number(width)];
  const list = (ext: string) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  return { avif: list("avif"), webp: list("webp") };
}
