"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

export function ContactAssemble() {
  const tier = useTier();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!tier || tier === "C" || !ref.current) return;
    const svg = ref.current.querySelector("svg");
    if (!svg) return;
    const parts = svg.querySelectorAll("rect, path, polygon");
    const dot = svg.querySelector("circle");
    const ctx = gsap.context(() => {
      gsap.set(parts, { opacity: 0, x: (i) => [-14, 0, 14][i] ?? 0, y: (i) => [0, -10, 10][i] ?? 0 });
      gsap.set(dot, { scale: 0, svgOrigin: "46 32" });
      // `once` fires immediately when the trigger is already past its start (e.g. /#contact deep links).
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } })
        .to(dot, { scale: 1, duration: 0.3, ease: "back.out(2)" })
        .to(parts, { opacity: 1, x: 0, y: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" }, "-=0.1");
    });
    return () => ctx.revert();
  }, [tier]);
  return (
    <span ref={ref} className="hidden md:inline-block">
      <Monogram size={64} className="text-ink" title="Redzy monogram" />
    </span>
  );
}
