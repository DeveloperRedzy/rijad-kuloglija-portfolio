"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

/**
 * Runs a light band from 50 % above its positioned container to 110 % down it. Animates a transform (y in px of the
 * container height), never `top`: a moving `top` is a layout shift and counts against CLS (spec §10: CLS ≤ 0.05).
 */
export function sweep(target: Element, duration = 1.2) {
  gsap.killTweensOf(target);
  const el = target as HTMLElement;
  const h = (el.offsetParent as HTMLElement | null)?.offsetHeight ?? 0;
  const base = el.offsetTop; // layout position without transforms
  return gsap.fromTo(el, { y: -0.5 * h - base, opacity: 1 }, { y: 1.1 * h - base, duration, ease: "power2.inOut", onComplete: () => { gsap.set(el, { opacity: 0 }); } });
}

export function LightSweeps() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (!tier || tier === "C") return;
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {})
    ctx.add(() => {
      gsap.utils.toArray<HTMLElement>("[data-frame]").forEach((frame) => {
        const band = frame.querySelector("[data-sweep]");
        if (!band) return;
        ScrollTrigger.create({ trigger: frame, start: "top 75%", once: true, onEnter: () => { ctx.add(() => { sweep(band); }); } });
        if (tier === "A") {
          // a frame with a live WebGL shader runs its band in the shader instead (ShaderFrame); no double sweep
          const onEnter = () => { if (frame.dataset.shaderFrame) return; ctx.add(() => { sweep(band, 0.9); }); };
          frame.addEventListener("mouseenter", onEnter);
          cleanups.push(() => frame.removeEventListener("mouseenter", onEnter));
        }
      });
      gsap.utils.toArray<HTMLElement>("[data-sweep-section]").forEach((section) => {
        const band = document.createElement("span");
        band.setAttribute("aria-hidden", "true");
        band.className = "pointer-events-none absolute inset-x-0 h-[40vh] opacity-0";
        band.style.background = "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.12), rgba(255,74,38,0))";
        const prevPos = section.style.position;
        section.style.position = "relative";
        section.prepend(band);
        cleanups.push(() => { band.remove(); section.style.position = prevPos; });
        ScrollTrigger.create({ trigger: section, start: "top 70%", once: true, onEnter: () => { ctx.add(() => { sweep(band, 1.4); }); } });
      });
    });
    return () => { cleanups.forEach((fn) => fn()); ctx.revert(); };
  }, [tier, pathname]);
  return null;
}
