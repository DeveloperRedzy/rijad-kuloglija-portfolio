import { ViewTransition } from "react";
import type { Media } from "@/content/schema";
import { Picture } from "@/components/ui/Picture";
import { ShaderFrameGate } from "./ShaderGate";

type Props = {
  media: Media;
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

/**
 * The `figure` carries `data-frame` (sweeps, shader host, hover) and holds the bezel plus an optional caption; the bezel
 * is the positioned, clipped box the sweep band and the shader plane measure against.
 * `shader`: on Tier A with hardware GL, images (not videos) get the WebGL hover ripple and band (spec §15.8).
 */
export function ProductFrame({ media, slug, url, sizes, priority, className = "", morph = true, shader = false, caption, captionBeside = false }: Props) {
  const isMobile = media.kind === "mobile";
  const withShader = shader && media.kind !== "video";
  const picture = (
    <Picture
      media={media}
      sizes={sizes ?? (isMobile ? "320px" : "(min-width: 1024px) 60vw, 100vw")}
      priority={priority}
      className={`block w-full ${isMobile ? "rounded-[calc(var(--radius-frame)*1.75)]" : "rounded-md"}`}
    />
  );
  // Phone: a rounder bezel with a centred speaker slot and a softer shadow, no browser chrome (audit #20).
  // Desktop/video: the browser bar with three dots and the URL, and the spec §3.4 frame shadow.
  // Shadows stay black like spec §3.4 (no token: a canvas-coloured shadow would vanish on the canvas background).
  const bezel = isMobile
    ? "rounded-[calc(var(--radius-frame)*2.5)] p-2 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
    : "rounded-[var(--radius-frame)] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,.6)]";
  const frame = (
    <figure
      data-frame={slug}
      className={`${captionBeside ? "md:grid md:grid-cols-6 md:items-end md:gap-5" : ""} ${className}`}
    >
      <div
        data-bezel
        className={`relative overflow-hidden border border-hairline bg-surface-1 ring-1 ring-signal/10 ${bezel} ${isMobile ? "mx-auto max-w-[320px]" : ""} ${captionBeside ? "md:col-span-2 md:col-start-3 md:w-full" : ""}`}
      >
        {isMobile ? (
          <div aria-hidden className="flex justify-center pb-2 pt-0.5">
            <span className="h-1.5 w-12 rounded-full bg-hairline-strong" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-1.5 pb-2.5 pt-1">
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
      {caption && (
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
