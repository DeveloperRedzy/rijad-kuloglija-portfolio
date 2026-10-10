import type { gsap as Gsap } from "gsap";

let pending: Promise<typeof Gsap> | null = null;

/**
 * GSAP core on demand, for the components in the initial bundle (Loader, NavDot, ContactAssemble, 404 flicker):
 * keeps GSAP out of the initial JS (spec §10). Resolves instantly once any motion chunk has loaded it.
 */
export function loadGsap(): Promise<typeof Gsap> {
  pending ??= import("./gsap-core").then((m) => m.gsap).catch((e) => { pending = null; throw e; });
  return pending;
}
