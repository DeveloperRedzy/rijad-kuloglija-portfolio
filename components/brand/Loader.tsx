"use client";
import { useEffect, useRef, useState } from "react";
import type { gsap } from "gsap";
import { loadGsap } from "@/lib/gsap-load";
import { useTier } from "@/lib/tiers";
import { announceLanded, readiness } from "@/lib/ready";
import { MONOGRAM } from "./Monogram";

const KEY = "redzy:loaded";

function seen(): boolean {
  try { return !!sessionStorage.getItem(KEY); } catch { return false; }
}

export function Loader() {
  const tier = useTier();
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!tier) return;
    if (tier === "C" || seen() || location.pathname !== "/") { announceLanded(); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on client-only tier/session state
    setShow(true);
  }, [tier]);

  useEffect(() => {
    if (!show || !root.current || !tier) return;
    const el = root.current;
    const dot = el.querySelector<HTMLElement>("[data-l-dot]");
    const parts = el.querySelectorAll("[data-l-part]");
    const word = el.querySelector("[data-l-word]");
    if (!dot) return;
    const fill = { v: 0 };
    const setFill = () => el.style.setProperty("--fill", fill.v.toFixed(3));
    const started = performance.now();
    let done = false;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    // GSAP is fetched on demand (not in the initial bundle); the mark and word stay hidden until the intro sets its
    // "from" state, so nothing flashes at full size first.
    const lib = loadGsap();
    let ctx: gsap.Context | undefined;
    let intro: gsap.core.Timeline | undefined;
    let progress: gsap.core.Tween | undefined;
    const land = () => { setShow(false); announceLanded(); };

    lib.then((gsap) => {
      if (cancelled || done) return;
      ctx = gsap.context(() => {
        gsap.set([el.querySelector("[data-l-art]"), word], { visibility: "visible" });
        intro = gsap.timeline()
          .fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" })
          .to(dot, { scale: 1.25, yoyo: true, repeat: 1, duration: 0.25 }, "+=0.05")
          .fromTo(parts, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.1")
          .fromTo(word, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
        progress = gsap.to(fill, { v: 0.85, duration: 2.4, ease: "none", onUpdate: setFill });
      }, el);
    }, () => { if (!cancelled) { done = true; land(); } });

    const finish = () => {
      if (done || cancelled) return;
      done = true;
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      lib.then((gsap) => {
        if (cancelled) return;
        intro?.kill();
        const nav = document.querySelector<HTMLElement>("[data-nav-dot]");
        const target = nav?.getBoundingClientRect();
        const from = dot.getBoundingClientRect();
        ctx ??= gsap.context(() => {}, el);
        ctx.add(() => {
          gsap.timeline({ onComplete: land })
            .to([parts, word], { opacity: 0, duration: 0.25 })
            .to(dot, {
              x: (target ? target.left + target.width / 2 : 24) - (from.left + from.width / 2),
              y: (target ? target.top + target.height / 2 : 32) - (from.top + from.height / 2),
              scale: 0.6, duration: 0.4, ease: "power3.inOut",
            }, "-=0.1")
            .to(el, { opacity: 0, duration: 0.25 }, "-=0.1");
        });
      }, () => { if (!cancelled) land(); });
    };

    Promise.all([readiness(tier), lib]).then(([, gsap]) => {
      if (cancelled || done) return;
      progress?.kill();
      ctx?.add(() => gsap.to(fill, { v: 1, duration: 0.2, onUpdate: setFill }));
      timers.push(setTimeout(finish, Math.max(0, 900 - (performance.now() - started))));
    }, () => {});
    timers.push(setTimeout(finish, 2400));

    const skip = () => finish();
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      ctx?.revert();
    };
  }, [show, tier]);

  if (!show) return null;
  return (
    <div ref={root} role="status" aria-label="Loading" className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-canvas" style={{ ["--fill" as string]: 0 }}>
      <svg data-l-art width="160" height="160" viewBox="0 0 100 100" aria-hidden="true" style={{ visibility: "hidden" }}>
        <defs><radialGradient id="lg" cx="46" cy="32" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FF4A26" stopOpacity=".5" /><stop offset="1" stopColor="#FF4A26" stopOpacity="0" /></radialGradient></defs>
        <g fill="var(--color-ink)">
          <rect data-l-part x={MONOGRAM.stem.x} y={MONOGRAM.stem.y} width={MONOGRAM.stem.width} height={MONOGRAM.stem.height} />
          <path data-l-part fillRule="evenodd" d={MONOGRAM.bowl} />
          <polygon data-l-part points={MONOGRAM.leg} />
        </g>
        <g fill="url(#lg)" style={{ opacity: "var(--fill)" }}>
          <rect x={MONOGRAM.stem.x} y={MONOGRAM.stem.y} width={MONOGRAM.stem.width} height={MONOGRAM.stem.height} />
          <path fillRule="evenodd" d={MONOGRAM.bowl} />
          <polygon points={MONOGRAM.leg} />
        </g>
        <circle data-l-dot cx="46" cy="32" r="5" fill="#FF4A26" style={{ filter: "drop-shadow(0 0 6px #FF4A26)", transformOrigin: "46px 32px" }} />
      </svg>
      <p data-l-word style={{ visibility: "hidden" }} className="font-display text-2xl font-extrabold tracking-[-0.045em] text-ink">Redzy</p>
    </div>
  );
}
