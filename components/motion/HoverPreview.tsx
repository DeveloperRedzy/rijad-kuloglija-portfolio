"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { projects } from "@/content";

const W = 240, H = 158, PAD = 16;

export function HoverPreview() {
  const tier = useTier();
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const wanted = useRef(false);
  const fadeIn = useRef<() => void>(() => {});
  const curSrc = useRef<string | null>(null);

  useEffect(() => {
    if (tier !== "A" || !box.current) return;
    const el = box.current;
    const ctx = gsap.context(() => {});
    gsap.set(el, { scale: 0.96, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const clampX = (v: number) => Math.min(v, innerWidth - W - PAD);
    const clampY = (v: number) => gsap.utils.clamp(PAD, Math.max(PAD, innerHeight - H - PAD), v);
    let lastX = 0;
    const settle = gsap.delayedCall(0.12, () => { gsap.to(el, { rotate: 0, duration: 0.4, ease: "power3.out", overwrite: "auto" }); });
    settle.pause();
    fadeIn.current = () => { if (wanted.current) ctx.add(() => { gsap.to(el, { opacity: 1, scale: 1, duration: 0.25, overwrite: "auto" }); }); };
    const show = (s: string) => {
      wanted.current = true;
      if (curSrc.current === s) return fadeIn.current();
      gsap.set(el, { opacity: 0 });
      curSrc.current = s;
      setSrc(s); // img onLoad fades the box in
    };
    const hide = () => {
      wanted.current = false;
      ctx.add(() => { gsap.to(el, { opacity: 0, scale: 0.96, duration: 0.2, overwrite: "auto" }); });
    };
    const rows = document.querySelectorAll<HTMLElement>("[data-row][data-preview]");
    const cleanups: Array<() => void> = [];
    const seen = new Set<string>();
    rows.forEach((row) => {
      const slug = row.dataset.preview!;
      const p = projects.find((pr) => pr.slug === slug);
      if (!p) return;
      const hero = Array.isArray(p.media.hero) ? p.media.hero[0] : p.media.hero;
      if (!seen.has(hero.src)) { seen.add(hero.src); new Image().src = hero.src; }
      const enter = (e: PointerEvent) => { lastX = e.clientX; gsap.set(el, { x: clampX(e.clientX + 24), y: clampY(e.clientY - 75) }); show(hero.src); };
      const move = (e: PointerEvent) => {
        x(clampX(e.clientX + 24)); y(clampY(e.clientY - 75));
        const rot = gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4);
        lastX = e.clientX;
        ctx.add(() => { gsap.to(el, { rotate: rot, duration: 0.3, overwrite: "auto" }); });
        settle.restart(true);
      };
      const leave = () => hide();
      const focus = () => { const r = row.getBoundingClientRect(); gsap.set(el, { x: clampX(r.right - 260), y: clampY(r.top - 20), rotate: 0 }); show(hero.src); };
      const blur = (e: FocusEvent) => { if (e.relatedTarget && row.contains(e.relatedTarget as Node)) return; hide(); };
      row.addEventListener("pointerenter", enter); row.addEventListener("pointermove", move); row.addEventListener("pointerleave", leave);
      row.addEventListener("focusin", focus); row.addEventListener("focusout", blur);
      cleanups.push(() => { row.removeEventListener("pointerenter", enter); row.removeEventListener("pointermove", move); row.removeEventListener("pointerleave", leave); row.removeEventListener("focusin", focus); row.removeEventListener("focusout", blur); });
    });
    return () => { cleanups.forEach((c) => c()); settle.kill(); wanted.current = false; fadeIn.current = () => {}; gsap.killTweensOf(el); ctx.revert(); };
  }, [tier, pathname]);
  if (tier !== "A") return null;
  return (
    <div ref={box} aria-hidden data-preview-box className="pointer-events-none fixed left-0 top-0 z-[65] w-[240px] overflow-hidden rounded-lg border border-hairline bg-surface-1 p-1 opacity-0 shadow-[0_20px_50px_rgba(0,0,0,.6)]">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- static export, decorative preview
        <img key={src} src={src} alt="" width={240} height={150} onLoad={() => fadeIn.current()} className="block h-[150px] w-full rounded object-cover object-top" />
      )}
    </div>
  );
}
