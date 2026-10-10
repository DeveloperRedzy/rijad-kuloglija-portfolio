"use client";
import dynamic from "next/dynamic";
import { useTier } from "@/lib/tiers";

// Client-only, lazily loaded motion pieces: they pull GSAP's plugins (ScrollTrigger, SplitText, DrawSVG) and Lenis,
// which stay out of the initial bundle (spec §10: initial JS ≤ 200 KB gz). Each is mounted (and its chunk fetched)
// only once the tier is known to be A or B: Tier C never downloads them.
export const MotionLayer = dynamic(() => import("./MotionLayer"), { ssr: false });
const LazyHeroDive = dynamic(() => import("@/components/hero/HeroDive").then((m) => m.HeroDive), { ssr: false });
const LazyChapterChoreo = dynamic(() => import("./ChapterChoreo").then((m) => m.ChapterChoreo), { ssr: false });

function useMotionTier(): boolean {
  const tier = useTier();
  return tier === "A" || tier === "B";
}

export function HeroDive() {
  return useMotionTier() ? <LazyHeroDive /> : null;
}

export function ChapterChoreo() {
  return useMotionTier() ? <LazyChapterChoreo /> : null;
}
