"use client";
import { TierProvider } from "@/lib/tiers";
import { SmoothScroll } from "./SmoothScroll";
import { SplitReveal } from "./SplitReveal";
import { LightSweeps } from "./LightSweeps";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <TierProvider>
      {children}
      <SmoothScroll />
      <SplitReveal />
      <LightSweeps />
    </TierProvider>
  );
}
