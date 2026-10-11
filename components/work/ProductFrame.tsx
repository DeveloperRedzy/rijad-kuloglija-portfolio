import { ViewTransition } from "react";
import type { Media } from "@/content/schema";
import { Picture } from "@/components/ui/Picture";
import { ShaderFrameGate } from "./ShaderGate";

type Props = {
  media: Media;
  /**
   * A phone capture shown below md instead of `media` (a desktop image): one frame, one <img> with art-directed
   * sources, so `priority` applies to whichever image the viewport shows. Below md the frame takes the phone bezel and
   * the mobile caption.
   */
  mobile?: Media;
  slug: string;
  url?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  morph?: boolean;
  shader?: boolean;
  /** Rendered as the figure's `figcaption`, under the frame (or beside it with `captionBeside`). */
  caption?: string;
  /** md+: the frame sits in columns 3–4 of a 6-column row and the caption beside it (a phone alone on its row). */
  captionBeside?: boolean;
};

// Shadows stay black like spec §3.4 (no token: a canvas-coloured shadow would vanish on the canvas background).
// Class strings are spelled out in full (Tailwind scans literals), including the max-md:/md: pairs for `mobile`.
const PHONE = { img: "rounded-[calc(var(--radius-frame)*1.75)]", bezel: "rounded-[calc(var(--radius-frame)*2.5)] p-2 shadow-[0_20px_60px_rgba(0,0,0,.45)]" };
const DESKTOP = { img: "rounded-md", bezel: "rounded-[var(--radius-frame)] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,.6)]" };
const SWAP_IMG = "max-md:rounded-[calc(var(--radius-frame)*1.75)] md:rounded-md";
const SWAP_BEZEL =
  "max-md:mx-auto max-md:max-w-[320px] max-md:rounded-[calc(var(--radius-frame)*2.5)] max-md:p-2 max-md:shadow-[0_20px_60px_rgba(0,0,0,.45)] " +
  "md:rounded-[var(--radius-frame)] md:p-2.5 md:shadow-[0_30px_80px_rgba(0,0,0,.6)]";

/**
 * The `figure` carries `data-frame` (sweeps, shader host, hover) and holds the bezel plus an optional caption; the bezel
 * is the positioned, clipped box the sweep band and the shader plane measure against.
 * `shader`: on Tier A with hardware GL, images (not videos) get the WebGL hover ripple and band (spec §15.8).
 */
export function ProductFrame({ media, mobile, slug, url, sizes, priority, className = "", morph = true, shader = false, caption, captionBeside = false }: Props) {
  const isMobile = media.kind === "mobile";
  // art direction only swaps a desktop image for a phone capture
  const swap = !isMobile && media.kind !== "video" && mobile?.kind === "mobile" ? mobile : undefined;
  const withShader = shader && media.kind !== "video";
  const picture = (
    <Picture
      media={media}
      mobile={swap}
      sizes={sizes}
      priority={priority}
      className={`block w-full ${isMobile ? PHONE.img : swap ? SWAP_IMG : DESKTOP.img}`}
    />
  );
  // Phone: a rounder bezel with a centred speaker slot and a softer shadow, no browser chrome (audit #20).
  // Desktop/video: the browser bar with three dots and the URL, and the spec §3.4 frame shadow.
  // With `mobile`, the phone look applies below md and the desktop look from md.
  const bezel = isMobile ? `${PHONE.bezel} mx-auto max-w-[320px]` : swap ? SWAP_BEZEL : DESKTOP.bezel;
  const frame = (
    <figure
      data-frame={slug}
      className={`${captionBeside ? "md:grid md:grid-cols-6 md:items-end md:gap-5" : ""} ${className}`}
    >
      <div
        data-bezel
        className={`relative overflow-hidden border border-hairline bg-surface-1 ring-1 ring-signal/10 ${bezel} ${captionBeside ? "md:col-span-2 md:col-start-3 md:w-full" : ""}`}
      >
        {(isMobile || swap) && (
          <div aria-hidden className={`flex justify-center pb-2 pt-0.5 ${swap ? "md:hidden" : ""}`}>
            <span className="h-1.5 w-12 rounded-full bg-hairline-strong" />
          </div>
        )}
        {!isMobile && (
          <div className={`items-center gap-1.5 px-1.5 pb-2.5 pt-1 ${swap ? "hidden md:flex" : "flex"}`}>
            <span className="h-2 w-2 rounded-full bg-hairline-strong" /><span className="h-2 w-2 rounded-full bg-hairline-strong" /><span className="h-2 w-2 rounded-full bg-hairline-strong" />
            {url && <span className="eyebrow ml-2 normal-case tracking-[0.06em] text-ink-muted">{url}</span>}
          </div>
        )}
        {withShader ? (
          <div className="relative">
            {picture}
            <ShaderFrameGate src={media.src} />
          </div>
        ) : picture}
        <span aria-hidden data-sweep className="pointer-events-none absolute inset-x-0 -top-1/2 h-1/2 opacity-0" style={{ background: "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.22), rgba(255,74,38,0))" }} />
      </div>
      {swap ? (
        (swap.caption || caption) && (
          // one figcaption; its text follows the image the viewport shows
          <figcaption className="eyebrow mt-3 max-md:text-center">
            {swap.caption && <span className={caption ? "md:hidden" : undefined}>{swap.caption}</span>}
            {caption && <span className={swap.caption ? "hidden md:inline" : undefined}>{caption}</span>}
          </figcaption>
        )
      ) : caption && (
        <figcaption className={`eyebrow mt-3 ${isMobile && !captionBeside ? "text-center" : ""} ${captionBeside ? "md:col-span-2 md:mt-0 md:border-t md:border-hairline md:pb-2 md:pt-3" : ""}`}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
  if (!morph) return frame;
  return (
    <ViewTransition name={`frame-${slug}`} share="morph" default="none">
      {frame}
    </ViewTransition>
  );
}
