/** The work-section progress line (Tier A/B, lg+): each chapter prints its own "0N / 05", so the rail is the fill only. */
export function ProgressRail() {
  return (
    <div data-rail aria-hidden="true" className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center opacity-0 lg:flex" style={{ ["--progress" as string]: 0 }}>
      <span className="relative block h-40 w-px bg-hairline">
        <span className="absolute left-0 top-0 block w-px bg-signal shadow-[0_0_8px_2px_rgba(255,74,38,.5)]" style={{ height: "calc(var(--progress) * 100%)" }} />
      </span>
    </div>
  );
}
