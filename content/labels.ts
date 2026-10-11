import type { Project } from "./schema";

/** Fixed interface labels (row headings, eyebrows, control names); like nav.ts, copy that is not profile or project data. */

/** Case study body rows, in order: the prose sections, then the evidence rows CaseNotes renders when a project has them. */
export const CASE = {
  sections: [
    ["overview", "Overview"], ["problem", "Problem"], ["contribution", "Contribution"], ["engineering", "Engineering"],
  ] as Array<[keyof Project["body"], string]>,
  decisions: "Decisions",
  sinceLaunch: "Since launch",
  delivered: "Delivered",
} as const;

/** The home page company marquee. */
export const COMPANIES = {
  eyebrow: "Companies I've worked for and with",
  pause: "Pause the company names",
} as const;
