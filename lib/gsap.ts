// Full GSAP (core + ScrollTrigger, SplitText, DrawSVGPlugin). Import statically only from lazily loaded modules
// (components/motion/MotionLayer, the dynamic wrappers in components/motion/lazy.tsx, the shader frames) or with a
// dynamic import() (ContactAssemble): it must stay out of the initial bundle (spec §10, `npm run budget`).
import { gsap } from "./gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
