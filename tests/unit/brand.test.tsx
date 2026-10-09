import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Monogram } from "../../components/brand/Monogram";
import { Icon } from "../../components/brand/Icon";
import { auraSvg } from "../../lib/aura";

describe("Monogram", () => {
  it("renders the spec geometry and a lit signal dot", () => {
    const html = renderToStaticMarkup(<Monogram size={64} />);
    expect(html).toContain('d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z"');
    expect(html).toContain('points="42,50 56,50 80,90 66,90"');
    expect(html).toContain('x="16" y="10" width="14" height="80"');
    expect(html).toMatch(/<circle[^>]*cx="46"[^>]*cy="32"[^>]*r="5"/);
    expect(html).toContain("var(--color-signal)");
  });
  it("uses the larger dot at favicon size and a muted dot when unlit", () => {
    expect(renderToStaticMarkup(<Monogram size={16} />)).toMatch(/r="6.5"/);
    expect(renderToStaticMarkup(<Monogram size={64} lit={false} />)).toContain("var(--color-ink-muted)");
  });
});

describe("Icon", () => {
  it("references the sprite by name", () => {
    const html = renderToStaticMarkup(<Icon name="arrow-up-right" />);
    expect(html).toContain('href="/brand/icons.svg#arrow-up-right"');
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("aura", () => {
  it("is deterministic per seed and differs between seeds", () => {
    const a1 = auraSvg("liblynx", 1200, 630);
    const a2 = auraSvg("liblynx", 1200, 630);
    const b = auraSvg("nepa-invest", 1200, 630);
    expect(a1).toBe(a2);
    expect(a1).not.toBe(b);
    expect(a1).toContain("<feTurbulence");
    expect(a1).toContain("#FF4A26");
  });
});
