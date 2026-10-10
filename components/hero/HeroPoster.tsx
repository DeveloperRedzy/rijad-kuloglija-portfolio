"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

import type { Props as SceneProps } from "./HeroScene";

/** Rendered instead of the scene when its chunk fails to load: falls back to the poster and releases readiness. */
function SceneFailed({ onFail }: SceneProps) {
  useEffect(() => { onFail?.(); }, [onFail]);
  return null;
}

// The only entry point into `three`/R3F: a lazy client-only chunk, never part of the initial bundle.
const HeroScene = dynamic<SceneProps>(() => import("./HeroScene").catch(() => ({ default: SceneFailed })), { ssr: false });

// Projected position and size of the counter dot in the rendered poster
// (camera z 6, fov 35, dot at world (-0.128, 0.576), sphere r 0.16; see RLetter/HeroScene).
const POSTER_DOT = { left: "46.62%", top: "34.78%", size: "8.46%" };

/** Set by sceneCapable(): the scene was forced onto a software rasterizer (tests/debug); it then renders lighter. */
let softwareForced = false;

/** Dev-only: `?poster=1` forces the scene full-viewport with a preserved drawing buffer for scripts/render-poster.mjs. */
function posterMode(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return new URLSearchParams(location.search).has("poster");
}

/**
 * Software rasterizers (SwiftShader, llvmpipe, WARP) link shaders synchronously for seconds and freeze the page, so
 * they get the poster (spec §6.4: GPU tier 0 is never a scene tier). Real tier detection already rules them out; this
 * covers the `redzy:tier` override. three 0.186 needs WebGL2, so without it there is no scene either.
 * `localStorage["redzy:scene"] = "force"` mounts the scene on a software renderer anyway (tests/debug).
 */
function sceneCapable(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    let forced = false;
    try { forced = localStorage.getItem("redzy:scene") === "force"; } catch {}
    const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    softwareForced = forced && software;
    return forced || !software;
  } catch { return false; }
}

type Idle = { cancel: () => void };
function onIdle(cb: () => void): Idle {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 1500 });
    return { cancel: () => window.cancelIdleCallback(id) };
  }
  const id = window.setTimeout(cb, 1);
  return { cancel: () => window.clearTimeout(id) };
}

export function HeroPoster() {
  const tier = useTier();
  const [poster, setPoster] = useState(false);
  // null until checked; false when Tier A runs on a software renderer
  const [capable, setCapable] = useState<boolean | null>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const resolveRef = useRef<(() => void) | null>(null);
  const wantsScene = poster || tier === "A";
  const sceneTier = wantsScene && capable === true;
  const showPoster = tier !== null && !poster && (tier !== "A" || capable === false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL, client only
    if (posterMode()) setPoster(true);
  }, []);

  useEffect(() => {
    // Wait for the tier even in poster mode: mounting the Canvas while the tier context flips can leave it unsized.
    if (!wantsScene || tier === null) return;
    const ok = poster || sceneCapable();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on client-only GPU info
    setCapable(ok);
    if (!ok) return;
    // Set before the scene mounts so the loader's readiness() can await the first frame.
    window.__heroSceneReady = new Promise<void>((r) => { resolveRef.current = r; });
    if (poster) {
      setMount(true);
      return;
    }
    const idle = onIdle(() => setMount(true));
    return () => {
      idle.cancel();
      // never leave the loader waiting on a scene that will not render
      resolveRef.current?.();
    };
  }, [wantsScene, poster, tier]);

  const handleReady = useCallback(() => {
    setReady(true);
    resolveRef.current?.();
  }, []);
  const handleFail = useCallback(() => {
    setCapable(false);
    resolveRef.current?.();
  }, []);

  const box = poster
    ? "fixed left-1/2 top-1/2 z-[200] aspect-square w-[100vmin] -translate-x-1/2 -translate-y-1/2"
    : "relative mx-auto aspect-square w-[min(72vw,520px)] lg:w-[min(38vw,620px)]";

  return (
    <div data-hero-poster className={box}>
      {!poster && (
        // Ambient glow centred on the counter; fully transparent well before the box edges (no visible disc).
        <div data-hero-glow aria-hidden className="pointer-events-none absolute inset-[-20%]" style={{ background: "radial-gradient(circle at 47.6% 39.1%, rgba(255,74,38,.2), rgba(255,74,38,.05) 22%, transparent 45%)" }} />
      )}

      {/* SSR, first client frame, and Tier A until the scene draws: the SVG monogram (no layout shift); it crossfades to the scene. */}
      {(tier === null || (wantsScene && capable !== false)) && !poster && (
        <div aria-hidden={ready || undefined} className={`absolute inset-0 ${ready ? "opacity-0 transition-opacity duration-500" : "opacity-100"}`}>
          <Monogram size={620} className="h-full w-full text-[#1C1A18] [filter:drop-shadow(0_0_24px_rgba(255,74,38,.35))]" title="Redzy monogram" glow={false} />
        </div>
      )}

      {sceneTier && mount && (
        <div role="img" aria-label="Redzy monogram, lit from the counter" aria-hidden={!ready || undefined} className={ready ? "absolute inset-0 opacity-100 transition-opacity duration-500" : "absolute inset-0 opacity-0"}>
          <HeroScene onReady={handleReady} onFail={handleFail} preserveDrawingBuffer={poster} viewport={!poster} lite={softwareForced && !poster} />
        </div>
      )}

      {showPoster && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export: pre-rendered WebP pair picked by srcset */}
          <img
            src="/media/hero/poster-900.webp"
            srcSet="/media/hero/poster-900.webp 900w, /media/hero/poster-1600.webp 1600w"
            sizes="(min-width: 1024px) min(38vw, 620px), min(72vw, 520px)"
            alt="Redzy monogram"
            width={900}
            height={900}
            decoding="async"
            fetchPriority="high"
            className="relative block h-full w-full object-contain"
          />
          <span
            aria-hidden
            data-poster-dot
            className={`absolute rounded-full shadow-[0_0_24px_8px_rgba(255,74,38,.55)] ${tier !== "C" ? "motion-safe:animate-[navpulse_2.4s_ease-in-out_infinite]" : ""}`}
            style={{ left: POSTER_DOT.left, top: POSTER_DOT.top, width: POSTER_DOT.size, height: POSTER_DOT.size, translate: "-50% -50%", background: "radial-gradient(circle, #FFF1EC 0 30%, var(--color-signal) 70%)" }}
          />
        </>
      )}
    </div>
  );
}
