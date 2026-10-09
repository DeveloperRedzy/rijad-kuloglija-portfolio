"use client";
import { TierProvider } from "@/lib/tiers";
import { SmoothScroll } from "./SmoothScroll";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <TierProvider>
      {children}
      <SmoothScroll />
    </TierProvider>
  );
}
