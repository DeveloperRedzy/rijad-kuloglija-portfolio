import { describe, expect, it } from "vitest";
import { ProfileSchema } from "../../content/schema";
import { profile } from "../../content/profile";

describe("profile content", () => {
  it("validates against the schema", () => {
    const result = ProfileSchema.safeParse(profile);
    if (!result.success) console.error(result.error.format());
    expect(result.success).toBe(true);
  });

  it("lists roles newest first and marks current roles", () => {
    const starts = profile.roles.map((r) => r.start);
    const sorted = [...starts].sort((a, b) => (a < b ? 1 : -1));
    expect(starts).toEqual(sorted);
    expect(profile.roles.filter((r) => r.current).map((r) => r.company)).toEqual([
      "DIN Solution",
      "Neo Labs",
      "LibLynx via Clearview",
    ]);
  });

  it("has no legacy facts", () => {
    const text = JSON.stringify(profile);
    expect(text).not.toMatch(/Full-Stack Developer at ProCredit/);
    expect(text).not.toMatch(/5 years/);
  });
});
