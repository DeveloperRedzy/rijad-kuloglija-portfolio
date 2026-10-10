"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function ChapterChoreo() {
  const tier = useTier();
  useEffect(() => {
    if (!tier || tier === "C") return;
    const root = document.querySelector<HTMLElement>("[data-chapters]");
    const rail = document.querySelector<HTMLElement>("[data-rail]");
    const label = rail?.querySelector<HTMLElement>("[data-rail-label]");
    if (!root) return;
    const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
      chapters.forEach((ch, i) => {
        const next = chapters[i + 1];
        // Explicit hook instead of DOM-order traversal.
        const grid = ch.querySelector("[data-chapter-grid]");
        if (!next || !grid) return;
        // As the next chapter slides over, the current one recedes.
        gsap.to(grid, {
          scale: 0.96, opacity: 0.5, transformOrigin: "50% 0%", ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: 0.6 },
        });
      });
      ScrollTrigger.create({
        trigger: root, start: "top 60%", end: "bottom bottom",
        onToggle: (st) => { gsap.to(rail, { opacity: st.isActive ? 1 : 0, duration: 0.3 }); },
        onUpdate: (st) => {
          rail?.style.setProperty("--progress", st.progress.toFixed(3));
          const idx = Math.min(chapters.length, Math.floor(st.progress * chapters.length) + 1);
          if (label) label.textContent = `${String(idx).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
        },
      });
      });
    }, root);
    return () => ctx.revert();
  }, [tier]);
  return null;
}
