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
  it("renders a muted looping video for video media", () => {
    const html = renderToStaticMarkup(
      <ProductFrame media={{ ...media, kind: "video", src: "/media/work/x/tour.mp4", poster: "/media/work/x/poster.webp" }} slug="x" />,
    );
    expect(html).toMatch(/<video[^>]*muted/);
    expect(html).toMatch(/<video[^>]*loop/);
    expect(html).toMatch(/<video[^>]*playsinline/i);
  });
});
