"use client";
import { useLayoutEffect, useRef } from "react";
import type { gsap } from "gsap";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

export function ContactAssemble() {
  const tier = useTier();
  const ref = useRef<HTMLSpanElement>(null);
  // The hidden state before first paint comes from the CSS pre-hide (globals.css); GSAP takes over once loaded.
  useLayoutEffect(() => {
    if (!tier || tier === "C" || !ref.current) return;
    const svg = ref.current.querySelector("svg");
    if (!svg) return;
    const parts = svg.querySelectorAll("rect, path, polygon");
    const dot = svg.querySelector("circle");
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    const host = ref.current;
    // GSAP + ScrollTrigger live in the lazy motion chunk; the CSS pre-hide in globals.css holds the hidden state
    // (from the first A/B frame) until it loads and the timeline starts.
    import("@/lib/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.set(parts, { opacity: 0, x: (i) => [-14, 0, 14][i] ?? 0, y: (i) => [0, -10, 10][i] ?? 0 });
        gsap.set(dot, { scale: 0, svgOrigin: "46 32" });
        // `once` fires immediately when the trigger is already past its start (e.g. /#contact deep links).
        gsap.timeline({
          scrollTrigger: { trigger: host, start: "top 85%", once: true },
          // Releases the CSS pre-hide in globals.css and stays set.
          onStart: () => { host.dataset.assembled = "true"; },
        })
          .to(dot, { scale: 1, duration: 0.3, ease: "back.out(2)" })
          .to(parts, { opacity: 1, x: 0, y: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" }, "-=0.1");
      });
    }, () => { if (!cancelled) host.dataset.assembled = "true"; });
    return () => { cancelled = true; ctx?.revert(); };
  }, [tier]);
  return (
    <span ref={ref} data-contact-mark className="hidden md:inline-block">
      <Monogram size={64} className="text-ink" title="Redzy monogram" />
    </span>
  );
}
