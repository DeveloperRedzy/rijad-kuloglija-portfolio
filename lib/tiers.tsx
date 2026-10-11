"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { probeGL, releaseProbe } from "./gl";

export type Tier = "A" | "B" | "C";
export type TierInput = { gpuTier: 0 | 1 | 2 | 3; pointerFine: boolean; width: number; reducedMotion: boolean; webgl: boolean };

export function resolveTier(i: TierInput): Tier {
  if (i.reducedMotion || i.gpuTier === 0 || !i.webgl) return "C";
  if (!i.pointerFine || i.width < 1024 || i.gpuTier < 2) return "B";
  return "A";
}

const TierContext = createContext<Tier | null>(null);

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // test/debug override; Playwright sets it via addInitScript
      let forced: string | null = null;
      try { forced = localStorage.getItem("redzy:tier"); } catch {}
      if (forced === "A" || forced === "B" || forced === "C") {
        if (cancelled) return;
        document.documentElement.dataset.tier = forced;
        setTier(forced);
        return;
      }
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pointerFine = matchMedia("(pointer: fine)").matches;
      const probe = probeGL();
      const webgl = !!probe.gl;
      let gpuTier: TierInput["gpuTier"] = 1;
      if (!reducedMotion && webgl && pointerFine && innerWidth >= 1024) {
        try {
          const { getGPUTier } = await import("detect-gpu");
          // reuse the probing context: every new context is another long main-thread task. The benchmark JSON is
          // self-hosted (copied from node_modules/detect-gpu/dist/benchmarks of the locked version, 5.0.70) instead of
          // the library's unpkg default, so no request leaves the origin; re-copy it whenever detect-gpu is upgraded.
          gpuTier = (await getGPUTier({ glContext: probe.gl ?? undefined, benchmarksURL: "/detect-gpu" })).tier as TierInput["gpuTier"];
        } catch { gpuTier = 1; }
      }
      releaseProbe();
      const t = resolveTier({ gpuTier, pointerFine, width: innerWidth, reducedMotion, webgl });
      if (cancelled) return;
      document.documentElement.dataset.tier = t;
      setTier(t);
    })();
    return () => { cancelled = true; };
  }, []);
  return <TierContext.Provider value={tier}>{children}</TierContext.Provider>;
}

export function useTier(): Tier | null {
  return useContext(TierContext);
}
