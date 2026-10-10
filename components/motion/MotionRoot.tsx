"use client";
import { TierProvider } from "@/lib/tiers";
import { Loader } from "@/components/brand/Loader";
import { SmoothScroll } from "./SmoothScroll";
import { SplitReveal } from "./SplitReveal";
import { LightSweeps } from "./LightSweeps";
import { Magnetic } from "./Magnetic";
import { DrawArrows } from "./DrawArrows";
import { HoverPreview } from "./HoverPreview";
import { Cursor } from "./Cursor";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <TierProvider>
      <Loader />
      {children}
      <SmoothScroll />
      <SplitReveal />
      <LightSweeps />
      <Magnetic />
      <DrawArrows />
      <HoverPreview />
      <Cursor />
    </TierProvider>
  );
}
