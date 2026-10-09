import { describe, expect, it } from "vitest";
import { ProfileSchema, ProjectSchema } from "../../content/schema";
import { profile } from "../../content/profile";
import { projects, getProject, nextProject, projectSlugs } from "../../content";

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

  it("has language codes and a short school name", () => {
    expect(profile.languages.map((l) => l.code).sort()).toEqual(["BS", "DE", "EN"]);
    expect(profile.education[0].short).toBe("International Burch University");
  });

  it("has no legacy facts", () => {
    const text = JSON.stringify(profile);
    expect(text).not.toMatch(/Full-Stack Developer at ProCredit/);
    expect(text).not.toMatch(/5 years/);
  });
});

describe("projects", () => {
  it("has five valid projects ordered 1..5", () => {
    expect(projects).toHaveLength(5);
    projects.forEach((p, i) => {
      const r = ProjectSchema.safeParse(p);
      if (!r.success) console.error(p.slug, r.error.format());
      expect(r.success).toBe(true);
      expect(p.index).toBe(i + 1);
    });
    expect(projectSlugs).toEqual(["liblynx", "din-solution", "neo-labs", "arkona", "nepa-invest"]);
  });

  it("wraps next project around", () => {
    expect(nextProject("liblynx").slug).toBe("din-solution");
    expect(nextProject("nepa-invest").slug).toBe("liblynx");
    expect(getProject("nope")).toBeUndefined();
  });

  it("uses first person, not third person", () => {
    for (const p of projects) {
      const text = Object.values(p.body).join(" ");
      expect(text).not.toMatch(/\bRijad (leads|is|built|engineered|worked)\b/);
    }
  });
});
