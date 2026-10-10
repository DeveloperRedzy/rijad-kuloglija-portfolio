/**
 * Fixed full-viewport layers for the dive (Tier A) and the Tier B exit fade. Opacity 0 until HeroDive animates them;
 * they sit under the navbar (z-50) so the navbar dot stays the brightest point on landing. -top-16: inside the pinned
 * (transformed) hero the containing block starts under the navbar, so they extend up behind its glass.
 */
export function HeroOverlay() {
  return (
    <>
      {/* the white-hot core (.55 – .62) */}
      <div data-flash aria-hidden className="pointer-events-none fixed inset-x-0 -top-16 bottom-0 z-[45] bg-[#FFF1EC] opacity-0" />
      {/* the light receding into the navbar dot (.62 – .82) */}
      <div
        data-recede
        aria-hidden
        className="pointer-events-none fixed inset-x-0 -top-16 bottom-0 z-[44] opacity-0"
        style={{ background: "radial-gradient(60% 50% at var(--dot-x, 50%) 0%, rgba(255,74,38,.55), rgba(255,74,38,.08) 60%, rgba(255,74,38,0) 100%)" }}
      />
      {/* Tier B: one red-to-transparent fade when the hero leaves */}
      <div data-redfade aria-hidden className="pointer-events-none fixed inset-x-0 -top-16 bottom-0 z-[44] bg-signal opacity-0" />
    </>
  );
}
