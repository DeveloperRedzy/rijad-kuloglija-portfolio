import { describe, expect, it } from "vitest";
import { LabLinkSchema, LinkSchema, ProfileSchema, ProjectListSchema, ProjectSchema, type Project } from "../../content/schema";
import { profile } from "../../content/profile";
import { allProjects } from "../../content/work";
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

  it("names enterprise clients only inside the role summaries that cover them", () => {
    const { roles, ...rest } = profile;
    expect(JSON.stringify(rest)).not.toMatch(/BMW|Bundesbank|Porsche/);
    const named = roles.filter((r) => /BMW|Bundesbank|Porsche/.test(JSON.stringify(r))).map((r) => r.company);
    expect(named).toEqual(["Amodo", "Bloola GmbH & Co. KG"]);
  });

  it("links roles only to routable case studies", () => {
    for (const r of profile.roles) if (r.projectSlug) expect(projectSlugs).toContain(r.projectSlug);
    for (const l of profile.lab) if (l.previewSlug) expect(projectSlugs).toContain(l.previewSlug);
  });
});

describe("projects", () => {
  it("validates every project file, featured or not, as one list", () => {
    const r = ProjectListSchema.safeParse(allProjects);
    if (!r.success) console.error(r.error.format());
    expect(r.success).toBe(true);
  });

  it("lists only featured projects, numbered 1..n in order", () => {
    expect(projects.length).toBe(allProjects.filter((p) => p.featured).length);
    projects.forEach((p, i) => {
      expect(ProjectSchema.safeParse(p).success).toBe(true);
      expect(p.featured).toBe(true);
      expect(p.index).toBe(i + 1);
    });
    expect(projectSlugs).toEqual(projects.map((p) => p.slug));
  });

  it("keeps unfeatured projects out of every list and route", () => {
    const hidden = allProjects.filter((p) => !p.featured).map((p) => p.slug);
    expect(hidden).toContain("din-solution");
    for (const slug of hidden) {
      expect(projectSlugs).not.toContain(slug);
      expect(getProject(slug)).toBeUndefined();
    }
  });

  it("rejects featured indices with gaps or repeats", () => {
    const at = (p: Project, index: number): Project => ({ ...p, index });
    const featured = allProjects.filter((p) => p.featured);
    expect(ProjectListSchema.safeParse(featured.map((p, i) => at(p, i + 2))).success).toBe(false);
    expect(ProjectListSchema.safeParse(featured.map((p) => at(p, 1))).success).toBe(false);
  });

  it("wraps next project around", () => {
    expect(nextProject(projects[0].slug).slug).toBe(projects[1].slug);
    expect(nextProject(projects[projects.length - 1].slug).slug).toBe(projects[0].slug);
    expect(getProject("nope")).toBeUndefined();
  });

  it("uses first person, not third person", () => {
    for (const p of allProjects) {
      const text = [...Object.values(p.body), p.sinceLaunch ?? ""].join(" ");
      expect(text).not.toMatch(/\bRijad (leads|is|built|engineered|worked)\b/);
    }
  });

  it("gives every featured project evidence rows", () => {
    for (const p of projects) {
      expect(p.sinceLaunch, p.slug).toBeTruthy();
      expect(p.decisions?.length ?? 0, p.slug).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("tone", () => {
  // Site copy outside the Strengths list (which may say "ownership").
  const copy = JSON.stringify([{ ...profile, strengths: [] }, projects]);

  it("avoids defensive and inflated words", () => {
    expect(copy.match(/\breal\b(?![- ]estate)/gi)).toBeNull();
    expect(copy.match(/\bownership\b/gi)).toBeNull();
  });
});

describe("link schemas", () => {
  it("accepts only http(s) for project links", () => {
    expect(LinkSchema.safeParse({ label: "x", url: "https://example.com" }).success).toBe(true);
    expect(LinkSchema.safeParse({ label: "x", url: "javascript:alert(1)" }).success).toBe(false);
    expect(LinkSchema.safeParse({ label: "x", url: "/work/arkona/" }).success).toBe(false);
  });
  it("lets lab links point at a site path, but never an off-site path", () => {
    expect(LabLinkSchema.safeParse({ label: "x", url: "/work/arkona/" }).success).toBe(true);
    expect(LabLinkSchema.safeParse({ label: "x", url: "//evil.com" }).success).toBe(false);
    expect(LabLinkSchema.safeParse({ label: "x", url: "/\\evil.com" }).success).toBe(false);
  });
});
