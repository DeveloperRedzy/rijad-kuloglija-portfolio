"use client";
import dynamic from "next/dynamic";

// Client-only, lazily loaded motion pieces: they pull GSAP's plugins (ScrollTrigger, SplitText, DrawSVG) and Lenis,
// which stay out of the initial bundle (spec §10: initial JS ≤ 200 KB gz). Each renders nothing on Tier C.
export const MotionLayer = dynamic(() => import("./MotionLayer"), { ssr: false });
export const HeroDive = dynamic(() => import("@/components/hero/HeroDive").then((m) => m.HeroDive), { ssr: false });
export const ChapterChoreo = dynamic(() => import("./ChapterChoreo").then((m) => m.ChapterChoreo), { ssr: false });
