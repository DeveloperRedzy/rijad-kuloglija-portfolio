import { describe, expect, it } from "vitest";
import { resolveTier } from "../../lib/tiers";

const base = { gpuTier: 3 as const, pointerFine: true, width: 1440, reducedMotion: false, webgl: true };

describe("resolveTier", () => {
  it("A on a capable desktop", () => expect(resolveTier(base)).toBe("A"));
  it("B on touch", () => expect(resolveTier({ ...base, pointerFine: false })).toBe("B"));
  it("B under 1024px", () => expect(resolveTier({ ...base, width: 1023 })).toBe("B"));
  it("B on gpu tier 1", () => expect(resolveTier({ ...base, gpuTier: 1 })).toBe("B"));
  it("C on reduced motion even on a capable desktop", () => expect(resolveTier({ ...base, reducedMotion: true })).toBe("C"));
  it("C on gpu tier 0 or no webgl", () => {
    expect(resolveTier({ ...base, gpuTier: 0 })).toBe("C");
    expect(resolveTier({ ...base, webgl: false })).toBe("C");
  });
});
