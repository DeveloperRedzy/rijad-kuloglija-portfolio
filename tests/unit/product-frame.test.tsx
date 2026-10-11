import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductFrame } from "../../components/work/ProductFrame";

const media = { src: "/media/work/liblynx/hero-desktop-1600.webp", alt: "LibLynx hero", kind: "desktop" as const, width: 1600, height: 1000 };

describe("ProductFrame", () => {
  it("renders avif+webp sources, the url bar and a data-frame hook", () => {
    const html = renderToStaticMarkup(<ProductFrame media={media} slug="liblynx" url="liblynx.com" />);
    expect(html).toContain('type="image/avif"');
    expect(html).toContain("/media/work/liblynx/hero-desktop-1600.avif");
    expect(html).toContain('data-frame="liblynx"');
    expect(html).toContain("liblynx.com");
    expect(html).toContain('alt="LibLynx hero"');
  });
  it("art-directs a phone capture below md in the same <img> (one frame, one priority image)", () => {
    const phone = { src: "/media/work/liblynx/gallery-2-800.webp", alt: "LibLynx on a phone", kind: "mobile" as const, width: 800, height: 1734, caption: "liblynx.com · mobile" };
    const html = renderToStaticMarkup(<ProductFrame media={media} mobile={phone} slug="liblynx" url="liblynx.com" priority caption="Desktop caption" />);
    expect(html.match(/<img/g)).toHaveLength(1);
    expect(html.match(/data-frame=/g)).toHaveLength(1);
    // the media-query sources come before the unconditional desktop source
    const first = html.indexOf('media="(max-width: 767px)"');
    expect(first).toBeGreaterThan(-1);
    expect(first).toBeLessThan(html.indexOf("hero-desktop-1600.avif"));
    expect(html).toContain("/media/work/liblynx/gallery-2-800.avif 800w");
    expect(html).toMatch(/<img[^>]*fetchpriority="high"/i);
    expect(html).toContain("liblynx.com · mobile");
    expect(html).toContain("Desktop caption");
  });
  it("renders a muted looping video for video media", () => {
    const html = renderToStaticMarkup(
      <ProductFrame media={{ ...media, kind: "video", src: "/media/work/x/tour.mp4", poster: "/media/work/x/poster.webp" }} slug="x" />,
    );
    expect(html).toMatch(/<video[^>]*muted/);
    expect(html).toMatch(/<video[^>]*loop/);
    expect(html).toMatch(/<video[^>]*playsinline/i);
  });
});
