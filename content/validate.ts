import "server-only";
import { ProfileSchema, ProjectListSchema } from "./schema";
import { profile } from "./profile";
import { allProjects } from "./work";

// Parsed once when a build-time route imports this module, so a bad content edit fails `npm run build`.
// Server-only: zod must not reach client bundles (content/index.ts is imported by client components).
ProfileSchema.parse(profile);
ProjectListSchema.parse(allProjects);

export { profile, projects, projectSlugs } from "./index";
