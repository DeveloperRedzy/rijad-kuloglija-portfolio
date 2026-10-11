import { profile } from "./profile";
import { allProjects } from "./work";
import type { Project } from "./schema";

/** Featured projects in chapter order: the only list that is routed, linked or shown. */
export const projects: Project[] = allProjects.filter((p) => p.featured).sort((a, b) => a.index - b.index);
export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export { profile };
export type { Project, Profile, Role, Media, LabItem, Link, Decision } from "./schema";
