import { ViewTransition } from "react";
import type { Media } from "@/content/schema";
import { Picture } from "@/components/ui/Picture";
import { ShaderFrameGate } from "./ShaderGate";

type Props = { media: Media; slug: string; url?: string; sizes?: string; priority?: boolean; className?: string; morph?: boolean; shader?: boolean };

/** `shader`: on Tier A with hardware GL, images (not videos) get the WebGL hover ripple and band (spec §15.8). */
export function ProductFrame({ media, slug, url, sizes, priority, className = "", morph = true, shader = false }: Props) {
  const isMobile = media.kind === "mobile";
  const withShader = shader && media.kind !== "video";
  const picture = <Picture media={media} sizes={sizes ?? (isMobile ? "320px" : "(min-width: 1024px) 60vw, 100vw")} priority={priority} className="block w-full rounded-md" />;
  const frame = (
    <figure
      data-frame={slug}
      className={`relative overflow-hidden rounded-[var(--radius-frame)] border border-hairline bg-surface-1 p-2.5 shadow-[0_30px_80px_rgba(0,0,0,.6)] ring-1 ring-signal/10 ${isMobile ? "mx-auto max-w-[320px]" : ""} ${className}`}
    >
      <div className="flex items-center gap-1.5 px-1.5 pb-2.5 pt-1">
        <span className="h-2 w-2 rounded-full bg-hairline-strong" /><span className="h-2 w-2 rounded-full bg-hairline-strong" /><span className="h-2 w-2 rounded-full bg-hairline-strong" />
        {url && <span className="eyebrow ml-2 normal-case tracking-[0.06em] text-ink-muted">{url}</span>}
      </div>
      {withShader ? (
        <div className="relative">
          {picture}
          <ShaderFrameGate src={media.src} />
        </div>
      ) : picture}
      <span aria-hidden data-sweep className="pointer-events-none absolute inset-x-0 -top-1/2 h-1/2 opacity-0" style={{ background: "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.22), rgba(255,74,38,0))" }} />
    </figure>
  );
  if (!morph) return frame;
  return (
    <ViewTransition name={`frame-${slug}`} share="morph" default="none">
      {frame}
    </ViewTransition>
  );
}
