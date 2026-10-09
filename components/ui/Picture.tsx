import type { Media } from "@/content/schema";
import { mediaSrcSet } from "@/lib/media";

type Props = { media: Media; sizes?: string; priority?: boolean; className?: string };

export function Picture({ media, sizes = "100vw", priority = false, className = "" }: Props) {
  if (media.kind === "video") {
    return (
      <video
        className={className}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={media.alt}
      />
    );
  }
  const { avif, webp } = mediaSrcSet(media.src);
  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img
        className={className}
        src={webp}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
