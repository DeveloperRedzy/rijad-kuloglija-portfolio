import { profile } from "./profile";
import { liblynx } from "./work/liblynx";
import { dinSolution } from "./work/din-solution";
import { neoLabs } from "./work/neo-labs";
import { arkona } from "./work/arkona";
import { nepaInvest } from "./work/nepa-invest";
import type { Project } from "./schema";

export const projects: Project[] = [liblynx, dinSolution, neoLabs, arkona, nepaInvest].sort((a, b) => a.index - b.index);
export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export { profile };
export type { Project, Profile, Role, Media, LabItem, Link } from "./schema";
