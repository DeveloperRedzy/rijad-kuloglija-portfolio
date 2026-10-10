"use client";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { announceLanded, hasLanded } from "@/lib/ready";
import { sweep } from "@/components/motion/LightSweeps";
import { sceneBridge, setScenePaused } from "./SceneBridge";

/** Pinned scroll distance of the dive, in viewport heights (spec §6.2: 250 vh). */
const DIVE_VH = 2.5;
/** Progress at which the dive has landed (navbar dot lit, chapter 01 under the light). */
const LANDED = 0.82;
/**
 * Landing threshold actually tested: a hair under LANDED, so a scroll that stops on the landing position (the #work
 * anchor, rounded to whole pixels, then smoothed by the scrub) still counts as landed.
 */
const LAND_AT = LANDED - 0.002;
/** Past this the scene is fully faded: hidden and its render loop paused. */
const SCENE_GONE = 0.72;

const land = () => { if (!hasLanded()) announceLanded(); };

/**
 * Spec §6.2 – §6.4. Tier A: the hero is pinned for 250 vh and a scrubbed timeline (duration 1 = progress) dives the
 * camera into the counter, flashes the white core, recedes the light into the navbar dot and reveals chapter 01.
 * The work section is pulled up (margin-top) so it lies under the pinned, opaque hero and is exactly in place at
 * .82, when the hero backdrop fades. Tier B: one red fade when the hero leaves. Tier C: nothing.
 */
export function HeroDive() {
  const tier = useTier();
  const pathname = usePathname();
  // A layout effect, not a passive one: on route change React removes the hero <section> from <main> during the
  // commit, and this cleanup (ctx.revert → unpin) must run first, while the hero still sits inside GSAP's pin-spacer.
  // Passive cleanups run after the DOM mutation and would leave React calling removeChild on the wrong parent.
  useLayoutEffect(() => {
    if (!tier || tier === "C") return;
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const work = document.querySelector<HTMLElement>("[data-chapters]");
    const chapter = document.querySelector<HTMLElement>("[data-chapter]");
    const redfade = document.querySelector<HTMLElement>("[data-redfade]");
    if (!hero || !work || !chapter) return;

    if (tier === "B") {
      // One red-to-transparent fade (a radial glow, peaking at .35) when the hero leaves; no pin, no camera.
      const ctx = gsap.context(() => {
        const fade = gsap.timeline({ paused: true })
          .to(redfade, { opacity: 0.35, duration: 0.12, ease: "power1.out" })
          .to(redfade, { opacity: 0, duration: 0.28, ease: "power1.in" });
        ScrollTrigger.create({
          trigger: hero, start: "bottom 60%", once: true,
          onEnter: (self) => {
            hero.dataset.dive = "landed";
            land();
            // a deep link (/#experience) starts past the hero: land without the flash
            if (self.getVelocity() !== 0) fade.play();
          },
        });
      }, hero);
      return () => { ctx.revert(); delete hero.dataset.dive; };
    }

    const copy = hero.querySelector<HTMLElement>("[data-hero-copy]");
    const box = hero.querySelector<HTMLElement>("[data-hero-poster]");
    const bg = hero.querySelector<HTMLElement>("[data-hero-bg]");
    const flash = hero.querySelector<HTMLElement>("[data-flash]");
    const recede = hero.querySelector<HTMLElement>("[data-recede]");
    const glow = hero.querySelector<HTMLElement>("[data-hero-glow]");
    const navDot = document.querySelector<HTMLElement>("[data-nav-dot]");
    const rows = chapter.querySelectorAll<HTMLElement>("[data-chapter-grid] > *");
    const band = chapter.querySelector<HTMLElement>("[data-sweep]");
    const distance = () => DIVE_VH * window.innerHeight;
    // The work header lands right under the navbar at .82: the work section starts .82·distance below the hero's top
    // (ceil: the #work anchor then lands at or just past .82, never a pixel short of it).
    const pullUp = () => { work.style.marginTop = `${Math.ceil(LANDED * distance() - hero.offsetHeight)}px`; };
    // the receding light is anchored above the navbar dot, so it visibly shrinks into it
    const anchorRecede = () => {
      if (!recede || !navDot) return;
      const r = navDot.getBoundingClientRect();
      const x = `${(((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(2)}%`;
      recede.style.setProperty("--dot-x", x);
      recede.style.transformOrigin = `${x} 0%`;
    };
    const onRefreshInit = () => { pullUp(); anchorRecede(); };
    /** Scroll position of the landing (work section under the navbar). */
    const landingY = () => LANDED * distance();
    const navH = () => hero.getBoundingClientRect().top + window.scrollY;
    // Chapter 01's rows: a timed (not scrubbed) reveal played when the dive lands, so a scroll that stops exactly at
    // the landing (the #work anchor) still shows them; reversed when the dive unwinds.
    let reveal: gsap.core.Timeline | null = null;
    let ctxReady: gsap.Context | null = null;
    /** Mirrors the smoothed timeline progress into the scene and the DOM state. */
    const sync = (p: number) => {
      setScenePaused(p > SCENE_GONE);
      sceneBridge.invalidate?.();
      if (p >= 0.62) land();
      const landed = p >= LAND_AT;
      // the empty hero must not swallow clicks on chapter 01 once landed
      hero.style.pointerEvents = landed ? "none" : "";
      if (landed === (hero.dataset.dive === "landed")) return;
      if (landed) {
        hero.dataset.dive = "landed";
        window.dispatchEvent(new CustomEvent("redzy:dive-landed"));
        reveal?.play();
        // .82 – 1: one light sweep down the chapter 01 frame
        if (band) { if (ctxReady) ctxReady.add(() => { sweep(band); }); else sweep(band); }
      } else {
        delete hero.dataset.dive;
        reveal?.reverse();
      }
    };

    let dive: gsap.core.Timeline | null = null;
    const onRefresh = () => { if (dive) sync(dive.progress()); };

    // The work section stays in the tab order under the opaque pinned hero: focus entering it before the landing
    // scrolls the dive to its landing (and lands), so keyboard users reach the case studies directly.
    const onFocusIn = (e: FocusEvent) => {
      if (hero.dataset.dive === "landed" || !(e.target instanceof Node) || !work.contains(e.target)) return;
      window.scrollTo(0, Math.ceil(landingY()));
    };

    const ctx = gsap.context(() => {
      onRefreshInit();
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
      document.addEventListener("focusin", onFocusIn);
      // Above the chapters (z 1–5) while pinned so it hides the work section passing beneath it.
      gsap.set(hero, { zIndex: 10 });
      reveal = gsap.timeline({ paused: true })
        // opacity, not autoAlpha: the links stay in the tab order (focusing one scrolls the dive to its landing)
        .fromTo(rows, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: () => `top ${navH()}px`, // scroll 0: the hero sits under the navbar
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: false, // the work section's margin-top is the spacing (see pullUp)
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        // `this`, not `tl`: ScrollTrigger can render (and call this) while the timeline is still being created
        onUpdate(this: gsap.core.Timeline) { sync(this.progress()); },
      });
      dive = tl;
      // refreshes (load, resize, deep links) set the progress without update callbacks
      ScrollTrigger.addEventListener("refresh", onRefresh);

      // 0 – .20 approach: copy lifts away, camera moves in front of the dot, the tilt settles
      // (explicit from values: SplitReveal fades the eyebrow in on load, which must not be recorded as the start)
      // The copy is gone by .10, so the letter never slides over legible text.
      if (copy) {
        tl.fromTo(copy.children, { y: 0, autoAlpha: 1 }, { y: -40, autoAlpha: 0, stagger: 0.01, duration: 0.06, ease: "power1.in", immediateRender: false }, 0);
      }
      tl.to(sceneBridge, { cameraZ: 2.8, duration: 0.2, ease: "power1.inOut" }, 0)
        .to(sceneBridge, { aim: 1, duration: 0.14, ease: "power1.inOut" }, 0.06)
        .to(glow, { opacity: 0, duration: 0.15 }, 0)
        // .20 – .55 dive: into the counter until it fills the view (z .19: the sphere subtends ±57°, past the corners of
        // a 2560 × 1080 viewport). The light grows: key light ×3 and bloom up by .50, the counter at full emissive.
        .to(sceneBridge, { cameraZ: 0.19, duration: 0.35, ease: "power2.in" }, 0.2)
        .to(sceneBridge, { intensity: 3, duration: 0.3, ease: "power1.in" }, 0.2)
        .to(sceneBridge, { bloom: 2.3, duration: 0.25, ease: "power1.in" }, 0.2)
        .to(sceneBridge, { core: 1.2, duration: 0.25, ease: "power1.in" }, 0.2)
        // .45 – .53, as the sphere fills the frame: the emissive eases down and the key light sinks into the counter
        // (lighting it from inside), so the filled screen reads signal red, not blown-out white; the #FFF1EC overlay
        // at .55 is the white beat.
        .to(sceneBridge, { core: 0.4, lightZ: 0, bloom: 1.8, duration: 0.08, ease: "power1.inOut" }, 0.45)
        // .55 – .62 white-hot core
        .to(flash, { opacity: 1, duration: 0.035, ease: "power1.in" }, 0.55)
        .to(flash, { opacity: 0, duration: 0.035, ease: "power1.out" }, 0.585)
        // the light arrives in the navbar under the flash
        .to(navDot, { scale: 6, duration: 0.035, ease: "power1.out" }, 0.585)
        .fromTo(recede, { opacity: 0, scale: 1.4 }, { opacity: 1, duration: 0.035, immediateRender: false }, 0.585)
        // .62 – .82 recede: the scene fades (hidden + paused past .72), the light shrinks into the navbar dot
        .to(box, { autoAlpha: 0, duration: 0.1 }, 0.62)
        .to(recede, { opacity: 0, scale: 0.2, duration: 0.2, ease: "power2.in" }, 0.62)
        .to(navDot, { scale: 1, duration: 0.2, ease: "power2.out" }, 0.62)
        // .80: the backdrop opens onto the work section, already in place beneath
        .to(bg, { opacity: 0, duration: 0.02 }, 0.8)
        // .82 – 1: chapter 01 reveal (see `reveal` and sync); pad to exactly 1 so timeline time equals progress
        .set({}, {}, 1);
      sync(tl.progress());

      // A deep link (/#work, /#experience) was resolved by the browser before the work section was pulled up: re-resolve it.
      const target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (target && window.scrollY > 0) {
        ScrollTrigger.refresh();
        target.scrollIntoView();
      }
    }, hero);
    ctxReady = ctx;

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      document.removeEventListener("focusin", onFocusIn);
      recede?.style.removeProperty("--dot-x");
      recede?.style.removeProperty("transform-origin");
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ctx.revert();
      work.style.marginTop = "";
      hero.style.pointerEvents = "";
      delete hero.dataset.dive;
      setScenePaused(false);
      Object.assign(sceneBridge, { aim: 0, cameraZ: 6, intensity: 1, bloom: 1.2, core: 1, lightZ: 0.4 });
    };
  }, [tier, pathname]);
  // Runs after the effect above: the lazy chunk is mounted and its triggers exist (tests wait on this marker).
  useEffect(() => {
    if (!tier || tier === "C") return;
    document.documentElement.dataset.diveMounted = "true";
    return () => { delete document.documentElement.dataset.diveMounted; };
  }, [tier]);
  return null;
}
