import { z } from "zod";

/** Absolute http(s) URL — the only protocols rendered as plain hrefs. */
export const HttpUrl = z.url({ protocol: /^https?$/ });

/** Site path starting with a single "/" (rendered with next/link); "//" and "/\" would become off-site. */
const SitePath = z.string().regex(/^\/(?![\/\\])\S*$/, "internal links start with a single /");

/** Project links are always external. */
export const LinkSchema = z.object({ label: z.string().min(1), url: HttpUrl });

/** Lab links may also point at a page on this site (e.g. a case study). */
export const LabLinkSchema = z.object({ label: z.string().min(1), url: z.union([HttpUrl, SitePath]) });

export const MediaSchema = z.object({
  src: z.string().startsWith("/media/"),
  alt: z.string().min(4),
  kind: z.enum(["desktop", "mobile", "video"]),
  caption: z.string().optional(),
  poster: z.string().startsWith("/media/").optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const RoleSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  titleProgression: z.string().optional(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  location: z.string().min(1),
  mode: z.enum(["remote", "on-site", "hybrid", "contract", "part-time"]),
  summary: z.string().min(20),
  stack: z.array(z.string()).optional(),
  url: HttpUrl.optional(),
  current: z.boolean(),
  showOnCv: z.boolean(),
  projectSlug: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Position among featured projects; uniqueness and contiguity are checked in content/validate.ts. */
  index: z.number().int().min(1),
  name: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1).max(4),
  oneLiner: z.string().min(10).max(140),
  role: z.string().min(1),
  roleNote: z.string().optional(),
  period: z.string().min(4),
  /** Technologies only (a stack line and the case's Stack row). */
  stack: z.array(z.string().min(1)).min(1),
  /** Non-technology themes of the work (the case's Focus row). */
  focus: z.array(z.string().min(1)).min(1).max(5).optional(),
  live: LinkSchema.optional(),
  repo: LinkSchema.optional(),
  body: z.object({
    overview: z.string().min(40),
    problem: z.string().min(40),
    contribution: z.string().min(40),
    engineering: z.string().min(40),
  }),
  delivered: z.array(z.string().min(10)).min(2).max(5),
  media: z.object({
    hero: z.union([MediaSchema, z.array(MediaSchema).min(2).max(3)]),
    gallery: z.array(MediaSchema).max(4),
  }),
  /** Choices made on the project and the reason for each (the case's Decisions row). */
  decisions: z.array(z.object({ choice: z.string().min(10), why: z.string().min(10) })).max(4).optional(),
  /** What happened after the work shipped (the case's Since launch row). */
  sinceLaunch: z.string().min(20).max(400).optional(),
  /** A hand-drawn figure rendered in the case body. */
  figure: z.enum(["report-flow"]).optional(),
  cvLine: z.string().min(20).max(260),
  /** Only featured projects are listed, routed and linked anywhere on the site. */
  featured: z.boolean(),
});

/** Every project, featured or not: slugs are unique and featured indices run 1..n without gaps or repeats. */
export const ProjectListSchema = z.array(ProjectSchema).superRefine((list, ctx) => {
  const slugs = list.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) ctx.addIssue({ code: "custom", message: `duplicate project slugs: ${slugs.join(", ")}` });
  const indices = list.filter((p) => p.featured).map((p) => p.index).sort((a, b) => a - b);
  if (indices.some((n, i) => n !== i + 1)) {
    ctx.addIssue({ code: "custom", message: `featured project indices must be 1..${indices.length}, got ${indices.join(", ")}` });
  }
});

export const LabItemSchema = z.object({
  name: z.string().min(1),
  line: z.string().min(10),
  year: z.string().min(4),
  links: z.array(LabLinkSchema).optional(),
  previewSlug: z.string().optional(),
  /** False when the CV already covers the item through a role. */
  showOnCv: z.boolean(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  brand: z.string().min(1),
  title: z.string(),
  jobTitle: z.string().min(1),
  /** The second current title, used next to jobTitle in the site title. */
  secondTitle: z.string().min(1),
  headline: z.string().max(60),
  lead: z.string().max(260),
  aboutHeading: z.string().min(1).max(60),
  about: z.string().min(200).max(900),
  availability: z.string().max(80).nullable(),
  /** What to write about, shown above the email in Contact. */
  contactNote: z.string().min(40).max(300),
  location: z.string(),
  city: z.string().min(1),
  countryCode: z.string().length(2),
  since: z.number().int(),
  email: z.email(),
  domain: z.string(),
  links: z.object({ github: HttpUrl, linkedin: HttpUrl }),
  strengths: z.array(z.string()).length(6),
  stack: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })).min(3),
  education: z.array(z.object({ school: z.string(), short: z.string(), degree: z.string(), years: z.string() })).min(1),
  languages: z.array(z.object({ name: z.string(), code: z.string().length(2), level: z.string() })).min(1),
  companies: z.array(z.string()).min(6),
  /** Current employers for structured data (Person.worksFor). */
  worksFor: z.array(z.object({ name: z.string().min(1), url: HttpUrl.optional() })).min(1),
  roles: z.array(RoleSchema).min(5),
  lab: z.array(LabItemSchema).min(3),
});

export type Link = z.infer<typeof LinkSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Decision = NonNullable<Project["decisions"]>[number];
export type LabItem = z.infer<typeof LabItemSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
