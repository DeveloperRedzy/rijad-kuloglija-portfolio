"use client";
import { useEffect } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { SplitReveal } from "./SplitReveal";
import { LightSweeps } from "./LightSweeps";
import { Magnetic } from "./Magnetic";
import { DrawArrows } from "./DrawArrows";
import { HoverPreview } from "./HoverPreview";
import { Cursor } from "./Cursor";

/** The site-wide motion layer (GSAP plugins, Lenis, pointer effects). Loaded lazily by MotionRoot on Tier A/B. */
export default function MotionLayer() {
  // Parent effects run after the children's: every motion listener is attached once this marker is set (tests wait on it).
  useEffect(() => {
    document.documentElement.dataset.motion = "ready";
    return () => { delete document.documentElement.dataset.motion; };
  }, []);
  return (
    <>
      <SmoothScroll />
      <SplitReveal />
      <LightSweeps />
      <Magnetic />
      <DrawArrows />
      <HoverPreview />
      <Cursor />
    </>
  );
}
