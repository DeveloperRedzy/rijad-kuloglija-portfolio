// Deterministic "aura": soft red light + grain derived from a string seed.
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return (s >>> 0) / 4294967296;
  };
}

export function auraSvg(seed: string, width: number, height: number): string {
  const h = hash(seed);
  const rand = rng(h);
  const id = `a${h.toString(36)}`;
  const lights = Array.from({ length: 3 }, (_, i) => ({
    cx: Math.round((0.15 + rand() * 0.7) * width),
    cy: Math.round((0.1 + rand() * 0.8) * height),
    r: Math.round((0.25 + rand() * 0.35) * Math.max(width, height)),
    o: (0.22 - i * 0.05).toFixed(2),
  }));
  const freq = (0.004 + rand() * 0.006).toFixed(4);
  const scale = Math.round(40 + rand() * 60);
  const grads = lights
    .map(
      (l, i) =>
        `<radialGradient id="${id}g${i}" cx="${l.cx}" cy="${l.cy}" r="${l.r}" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0" stop-color="#FF4A26" stop-opacity="${l.o}"/><stop offset="1" stop-color="#FF4A26" stop-opacity="0"/></radialGradient>`,
    )
    .join("");
  const rects = lights.map((_, i) => `<rect width="${width}" height="${height}" fill="url(#${id}g${i})"/>`).join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs>${grads}<filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${h % 1000}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>` +
    `<feGaussianBlur stdDeviation="${Math.round(width / 40)}"/></filter></defs>` +
    `<rect width="${width}" height="${height}" fill="#0A0908"/>` +
    `<g filter="url(#${id}f)">${rects}</g></svg>`
  );
}
