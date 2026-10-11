import { liblynx } from "./liblynx";
import { neoLabs } from "./neo-labs";
import { arkona } from "./arkona";
import { nepaInvest } from "./nepa-invest";
import { dinSolution } from "./din-solution";
import type { Project } from "../schema";

/** Every project file, featured or not. Site code reads `projects` from content/index.ts instead. */
export const allProjects: Project[] = [liblynx, neoLabs, arkona, nepaInvest, dinSolution];
