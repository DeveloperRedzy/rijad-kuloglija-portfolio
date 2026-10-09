"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Tier = "A" | "B" | "C";
export type TierInput = { gpuTier: 0 | 1 | 2 | 3; pointerFine: boolean; width: number; reducedMotion: boolean; webgl: boolean };

export function resolveTier(i: TierInput): Tier {
  if (i.reducedMotion || i.gpuTier === 0 || !i.webgl) return "C";
  if (!i.pointerFine || i.width < 1024 || i.gpuTier < 2) return "B";
  return "A";
}

const TierContext = createContext<Tier | null>(null);

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pointerFine = matchMedia("(pointer: fine)").matches;
      const webgl = hasWebGL();
      let gpuTier: TierInput["gpuTier"] = 1;
      if (!reducedMotion && webgl && pointerFine && innerWidth >= 1024) {
        const { getGPUTier } = await import("detect-gpu");
        gpuTier = (await getGPUTier()).tier as TierInput["gpuTier"];
      }
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
