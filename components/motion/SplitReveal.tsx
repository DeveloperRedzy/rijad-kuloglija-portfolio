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
    // Tier A home: text under the pinned dive (`[data-reveal-after-dive]`, the work header) would reveal unseen beneath
    // the hero; it waits for the dive to land instead (HeroDive dispatches `redzy:dive-landed`).
    const offs: Array<() => void> = [];
    const heroDive = () => (tier === "A" ? document.querySelector<HTMLElement>("[data-hero]") : null);
    const gated = (el: HTMLElement) => !!heroDive() && !!el.closest("[data-reveal-after-dive]");
    const landed = () => heroDive()?.dataset.dive === "landed";
    const afterLanding = (run: () => void) => {
      if (landed()) return run();
      const on = () => run();
      window.addEventListener("redzy:dive-landed", on, { once: true });
      offs.push(() => window.removeEventListener("redzy:dive-landed", on));
    };
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        ctx.add(() => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          if (el.dataset.revealed) return;
          if (gated(el)) {
            let current: gsap.core.Tween | null = null;
            let go = landed();
            if (!go) afterLanding(() => { go = true; current?.play(); });
            SplitText.create(el, {
              type: "lines", mask: "lines", autoSplit: true, aria: "none",
              onSplit(self) {
                current = gsap.from(self.lines, {
                  yPercent: 100, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, paused: !go,
                  onComplete: () => { el.dataset.revealed = "true"; },
                });
                return current;
              },
            });
            return;
          }
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
          if (gated(el)) {
            const t = gsap.from(el, { y: 2, opacity: 0, duration: 0.5, paused: true });
            afterLanding(() => { t.play(); });
            return;
          }
          // The footer can sit below 90% of the viewport even at max scroll, so its eyebrows would never reveal.
          if (el.closest("footer")) return;
          gsap.from(el, { y: 2, opacity: 0, duration: 0.5, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });
        ScrollTrigger.refresh();
        });
      });
    });
    return () => { cancelled = true; window.removeEventListener("load", onLoad); offs.forEach((o) => o()); ctx.revert(); };
  }, [tier, pathname]);
  return null;
}
