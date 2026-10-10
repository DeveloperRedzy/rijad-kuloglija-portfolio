// GSAP core with the site defaults. Never imported statically from the initial bundle: the Loader, NavDot and 404 flicker
// fetch it through `lib/gsap-load.ts`; the lazy motion chunks get it (plus plugins) through `lib/gsap.ts`.
import { gsap } from "gsap";

if (typeof window !== "undefined") gsap.defaults({ ease: "power2.out", duration: 0.6 });

export { gsap };
