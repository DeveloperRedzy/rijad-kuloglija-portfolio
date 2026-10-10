import { z } from "zod";

/** External links are absolute URLs; internal links are site paths starting with "/" (rendered with next/link). */
export const LinkSchema = z.object({
  label: z.string().min(1),
  url: z.union([z.url(), z.string().regex(/^\/(?!\/)\S*$/, "internal links start with a single /")]),
});

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
  url: z.url().optional(),
  current: z.boolean(),
  showOnCv: z.boolean(),
  projectSlug: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.number().int().min(1).max(5),
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
  cvLine: z.string().min(20).max(260),
  featured: z.literal(true),
});

export const LabItemSchema = z.object({
  name: z.string().min(1),
  line: z.string().min(10),
  year: z.string().min(4),
  links: z.array(LinkSchema).optional(),
  previewSlug: z.string().optional(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  brand: z.string().min(1),
  title: z.string(),
  jobTitle: z.string().min(1),
  headline: z.string().max(60),
  lead: z.string().max(260),
  aboutHeading: z.string().min(1).max(60),
  about: z.string().min(200).max(900),
  availability: z.string().max(80).nullable(),
  location: z.string(),
  city: z.string().min(1),
  countryCode: z.string().length(2),
  since: z.number().int(),
  email: z.email(),
  domain: z.string(),
  links: z.object({ github: z.url(), linkedin: z.url() }),
  strengths: z.array(z.string()).length(6),
  stack: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })).min(3),
  education: z.array(z.object({ school: z.string(), short: z.string(), degree: z.string(), years: z.string() })).min(1),
  languages: z.array(z.object({ name: z.string(), code: z.string().length(2), level: z.string() })).min(1),
  companies: z.array(z.string()).min(6),
  roles: z.array(RoleSchema).min(5),
  lab: z.array(LabItemSchema).min(3),
});

export type Link = z.infer<typeof LinkSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type LabItem = z.infer<typeof LabItemSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
