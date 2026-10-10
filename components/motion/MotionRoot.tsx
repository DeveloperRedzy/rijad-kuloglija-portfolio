"use client";
import { TierProvider, useTier } from "@/lib/tiers";
import { Loader } from "@/components/brand/Loader";
import { MotionLayer } from "./lazy";

/**
 * Mounts the lazy motion layer once the tier is known (A/B only; Tier C has no motion). Its chunk (GSAP plugins,
 * Lenis, pointer effects) is fetched at that point, after hydration, never as part of the initial bundle.
 */
function DeferredMotion() {
  const tier = useTier();
  return tier === "A" || tier === "B" ? <MotionLayer /> : null;
}

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <TierProvider>
      <Loader />
      {children}
      <DeferredMotion />
    </TierProvider>
  );
}
