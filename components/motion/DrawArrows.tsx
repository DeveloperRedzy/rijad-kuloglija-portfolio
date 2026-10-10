"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

// <use> sprites cannot be drawn; swap arrow icons for inline paths on hover targets.
const PATHS: Record<string, string[]> = {
  "arrow-up-right": ["M7 17 17 7", "M8.5 7H17v8.5"],
  "arrow-right": ["M4 12h15", "m13.5 6.5 5.5 5.5-5.5 5.5"],
  "arrow-left": ["M20 12H5", "M10.5 6.5 5 12l5.5 5.5"],
};

export function DrawArrows() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (tier !== "A") return;
    const ctx = gsap.context(() => {});
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<SVGSVGElement>("a svg, button svg").forEach((svg) => {
      let name = svg.dataset.drawn;
      if (!name) {
        name = svg.querySelector("use")?.getAttribute("href")?.split("#")[1];
        if (!name || !PATHS[name]) return;
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        svg.innerHTML = PATHS[name].map((d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
        svg.dataset.drawn = name;
      }
      const paths = svg.querySelectorAll("path");
      const host = svg.closest("a, button");
      if (!host || !paths.length) return;
      const enter = () => ctx.add(() => { gsap.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, stagger: 0.08, ease: "power2.out", overwrite: "auto" }); });
      host.addEventListener("pointerenter", enter);
      cleanups.push(() => { host.removeEventListener("pointerenter", enter); gsap.killTweensOf(paths); });
    });
    return () => { cleanups.forEach((c) => c()); ctx.revert(); };
  }, [tier, pathname]);
  return null;
}
