"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTier } from "@/lib/tiers";
import { glCapability, type GLCapability } from "@/lib/gl";

// `three`/R3F only load through these lazy client-only chunks (shared with the hero scene), never the initial bundle.
const FrameCanvas = dynamic(() => import("./FrameCanvas"), { ssr: false });
const ShaderFrame = dynamic(() => import("./ShaderFrame"), { ssr: false });

/** Tier A on hardware WebGL2 (or `redzy:scene=force`), the same gate as the 3D hero. */
function useShaderFrames(): { on: boolean; lite: boolean } {
  const tier = useTier();
  const [cap, setCap] = useState<GLCapability | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on client-only GPU info
    if (tier === "A") setCap(glCapability());
  }, [tier]);
  return { on: tier === "A" && !!cap?.capable, lite: !!cap?.software };
}

/** Mounts the case page's one shared WebGL canvas. */
export function FrameCanvasMount() {
  const { on, lite } = useShaderFrames();
  return on ? <FrameCanvas lite={lite} /> : null;
}

/**
 * Placed next to a frame's <picture> inside a `relative` wrapper: once the <img> has loaded, mounts the shader plane over
 * it, textured with the very file the <img> shows (`currentSrc`, so no second download).
 */
export function ShaderFrameGate({ src }: { src: string }) {
  const { on } = useShaderFrames();
  const anchor = useRef<HTMLSpanElement>(null);
  const [target, setTarget] = useState<{ src: string; host: HTMLElement } | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the media changes (HeroTabs)
    setTarget(null);
    const el = anchor.current;
    const img = el?.parentElement?.querySelector("img");
    const host = el?.closest<HTMLElement>("[data-frame]");
    if (!on || !img || !host) return;
    const shown = () => img.currentSrc || img.src;
    // The <img> may be showing another file: a HeroTabs swap in progress, or the art-directed phone capture below md.
    // Only take it once it shows this image (any srcset width, AVIF or WebP: `…/hero-labs-1600.webp` → `…/hero-labs-`),
    // and keep listening so a later swap back to the desktop file (window widened past md) still arms the shader.
    const stem = src.replace(/-\d+\.webp$/, "-");
    const ready = () => { if (shown().includes(stem)) setTarget({ src: shown(), host }); };
    if (img.complete && img.naturalWidth > 0) ready();
    img.addEventListener("load", ready);
    return () => img.removeEventListener("load", ready);
  }, [on, src]);
  return (
    <>
      <span ref={anchor} hidden />
      {target && <ShaderFrame key={target.src} src={target.src} host={target.host} />}
    </>
  );
}
