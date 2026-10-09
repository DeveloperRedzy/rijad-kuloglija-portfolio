"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function SmoothScroll() {
  const tier = useTier();
  useEffect(() => {
    if (tier !== "A") return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // anchor links: let Lenis scroll to hashes with the navbar offset
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='/#'], a[href^='#']") as HTMLAnchorElement | null;
      if (!a || location.pathname !== "/") return;
      const id = a.getAttribute("href")!.split("#")[1];
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -64 });
      history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); gsap.ticker.remove(raf); lenis.destroy(); };
  }, [tier]);
  return null;
}
