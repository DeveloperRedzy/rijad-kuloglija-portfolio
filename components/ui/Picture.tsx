import type { Media } from "@/content/schema";
import { VideoFrame } from "./VideoFrame";
import { mediaSrcSet, SIZES } from "@/lib/media";

type Props = { media: Media; sizes?: string; priority?: boolean; className?: string };

export function Picture({ media, sizes, priority = false, className = "" }: Props) {
  if (media.kind === "video") {
    return <VideoFrame media={media} className={className} />;
  }
  const { avif, webp } = mediaSrcSet(media.src);
  const resolvedSizes = sizes ?? (media.kind === "mobile" ? SIZES.phone : SIZES.hero);
  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={resolvedSizes} />
      <img
        className={className}
        src={media.src}
        srcSet={webp}
        sizes={resolvedSizes}
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
