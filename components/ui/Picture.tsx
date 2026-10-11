import type { Media } from "@/content/schema";
import { VideoFrame } from "./VideoFrame";
import { mediaSrcSet, SIZES } from "@/lib/media";

/** Below md a `mobile` image replaces the main one (art direction); keep in sync with Tailwind's md breakpoint. */
export const MOBILE_QUERY = "(max-width: 767px)";

type Props = {
  media: Media;
  /** Image shown below md instead of `media` (a phone capture leading a desktop hero); one <img>, one request. */
  mobile?: Media;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function Picture({ media, mobile, sizes, priority = false, className = "" }: Props) {
  if (media.kind === "video") {
    return <VideoFrame media={media} className={className} />;
  }
  const { avif, webp } = mediaSrcSet(media.src);
  const resolvedSizes = sizes ?? (media.kind === "mobile" ? SIZES.phone : SIZES.hero);
  const alt = mobile && mobile.kind !== "video" ? mobileSources(mobile) : null;
  return (
    <picture>
      {/* media-query sources come first: the browser takes the first matching <source> */}
      {alt}
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

/** AVIF then WebP sources for the mobile image; width/height on <source> keep its own aspect ratio (no layout shift). */
function mobileSources(m: Media) {
  const { avif, webp } = mediaSrcSet(m.src);
  return (
    <>
      <source media={MOBILE_QUERY} type="image/avif" srcSet={avif} sizes={SIZES.phone} width={m.width} height={m.height} />
      <source media={MOBILE_QUERY} type="image/webp" srcSet={webp} sizes={SIZES.phone} width={m.width} height={m.height} />
    </>
  );
}
