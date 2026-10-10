import { projects } from "@/content";

export function ProgressRail() {
  return (
    <div data-rail aria-hidden="true" className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 opacity-0 lg:flex" style={{ ["--progress" as string]: 0 }}>
      <span data-rail-label className="eyebrow text-ink">01 / {String(projects.length).padStart(2, "0")}</span>
      <span className="relative block h-40 w-px bg-hairline">
        <span className="absolute left-0 top-0 block w-px bg-signal shadow-[0_0_8px_2px_rgba(255,74,38,.5)]" style={{ height: "calc(var(--progress) * 100%)" }} />
      </span>
    </div>
  );
}
