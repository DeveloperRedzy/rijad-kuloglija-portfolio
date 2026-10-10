"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function SplitReveal() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (!tier || tier === "C") return;
    let cancelled = false;
    // Images settling after fonts shift layout; re-measure trigger positions once the page has loaded.
    const onLoad = () => { ScrollTrigger.refresh(); };
    if (document.readyState !== "complete") window.addEventListener("load", onLoad, { once: true });
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        ctx.add(() => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          if (el.dataset.revealed) return;
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "none", // aria-label on a <p> is prohibited; split lines stay real text
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 100, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 80%", once: true },
                onComplete: () => { el.dataset.revealed = "true"; },
              });
            },
          });
        });
        gsap.utils.toArray<HTMLElement>(".eyebrow").forEach((el) => {
          gsap.from(el, { y: 2, opacity: 0, duration: 0.5, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });
        ScrollTrigger.refresh();
        });
      });
    });
    return () => { cancelled = true; window.removeEventListener("load", onLoad); ctx.revert(); };
  }, [tier, pathname]);
  return null;
}
