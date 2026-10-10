"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function sweep(target: Element, duration = 1.2) {
  return gsap.fromTo(target, { top: "-50%", opacity: 1 }, { top: "110%", duration, ease: "power2.inOut", onComplete: () => { gsap.set(target, { opacity: 0 }); } });
}

export function LightSweeps() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (!tier || tier === "C") return;
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-frame]").forEach((frame) => {
        const band = frame.querySelector("[data-sweep]");
        if (!band) return;
        gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 75%", once: true } }).add(() => { sweep(band); });
        if (tier === "A") {
          const onEnter = () => { sweep(band, 0.9); };
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
        gsap.timeline({ scrollTrigger: { trigger: section, start: "top 70%", once: true } }).add(() => { sweep(band, 1.4); });
      });
    });
    return () => { cleanups.forEach((fn) => fn()); ctx.revert(); };
  }, [tier, pathname]);
  return null;
}
