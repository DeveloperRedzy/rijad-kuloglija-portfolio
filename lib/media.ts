export function mediaSrcSet(src: string): { avif: string; webp: string } {
  if (!src.endsWith(".webp")) throw new Error(`expected a .webp src, got ${src}`);
  return { webp: src, avif: src.replace(/\.webp$/, ".avif") };
}
