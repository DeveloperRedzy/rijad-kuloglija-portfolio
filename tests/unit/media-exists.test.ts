import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { projects } from "../../content";

describe("media files", () => {
  it("every referenced media src and poster exists in public/", () => {
    const missing: string[] = [];
    for (const p of projects) {
      const heroes = Array.isArray(p.media.hero) ? p.media.hero : [p.media.hero];
      for (const m of [...heroes, ...p.media.gallery]) {
        if (!existsSync(`public${m.src}`)) missing.push(m.src);
        if (m.poster && !existsSync(`public${m.poster}`)) missing.push(m.poster);
      }
    }
    expect(missing).toEqual([]);
  });
  it("portrait exists", () => {
    expect(existsSync("public/media/about/portrait-1200.webp")).toBe(true);
  });
});
