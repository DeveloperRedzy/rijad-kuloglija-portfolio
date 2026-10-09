"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/brand/Icon";
import type { Media } from "@/content/schema";

export function VideoFrame({ media, className = "" }: { media: Media; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const sync = () => setPlaying(!el.paused);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);
    let io: IntersectionObserver | undefined;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= 0.5) el.play().catch(() => {});
          else el.pause();
        },
        { threshold: [0, 0.5] },
      );
      io.observe(el);
    }
    return () => { io?.disconnect(); el.removeEventListener("play", sync); el.removeEventListener("pause", sync); };
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div className="relative">
      <video
        ref={video}
        className={className}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={media.alt}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause tour" : "Play tour"}
        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong bg-canvas/80 text-ink backdrop-blur hover:text-signal-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        <Icon name={playing ? "pause" : "play"} size={18} />
      </button>
    </div>
  );
}
