const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(#n)' opacity='.9'/></svg>`,
  );

export function Grain() {
  return (
    <div
      data-grain
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.065] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "120px 120px" }}
    />
  );
}
