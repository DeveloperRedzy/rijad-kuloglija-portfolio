# Redzy portfolio (rijadkuloglija.com)

Next.js 16 App Router, static export (`out/`), React 19, TypeScript strict, Tailwind 4. Dark only, English only.

## Commands
- `npm run dev` · `npm run build` (also writes the CV PDF in postbuild) · `npm run check` (lint + typecheck + unit) · `npm run e2e` (build + Playwright) · `npm run screens` (after-screenshots)
- Performance gates (after a build): `npm run budget` (initial JS ≤ 200 KB gz, 3D chunk ≤ 400 KB gz and lazy) · `npm run lhci` (Lighthouse desktop then mobile via `scripts/lhci.mjs`, fails if either fails; set `CHROME_PATH` if no system Chrome). Keep GSAP plugins, Lenis and `three` out of the initial bundle: motion goes through `components/motion/lazy.tsx` / `MotionLayer`, GSAP core through `lib/gsap-load.ts`.
- Assets: `npm run capture` (public-site captures → assets/source/captures), `npm run assets` (sharp → public/media), `npm run icons`, `npm run auras`, `npm run poster` (Tier B/C hero posters from the live scene; run against `npm run dev`), `node scripts/fetch-fonts.mjs` (woff2 into `assets/fonts`, the `next/font/local` sources in `app/fonts.ts`)
- Tier overrides for testing: `localStorage["redzy:tier"]` = `A` | `B` | `C`; `localStorage["redzy:scene"] = "force"` lets the R3F scene run on a software renderer; `sessionStorage["redzy:loaded"] = "1"` skips the loader. Playwright sets these via `addInitScript`; headless CI usually resolves to Tier C, so tests branch on the detected tier.
- Loader: the server layout inlines `LOADER_SCRIPT` (`components/brand/loader-script.ts`), which sets `html[data-loader="on"]` before first paint on a first visit to `/` (not under reduced motion) and drops it after an 8 s failsafe; the loader is only displayed while that attribute is set. Tier C without WebGL shows the loader shell until the tier resolves, then drops it.
- GPU tiering: detect-gpu's benchmarks are self-hosted in `public/detect-gpu` (`benchmarksURL: "/detect-gpu"` in `lib/tiers.tsx`); re-copy them from `node_modules/detect-gpu/dist/benchmarks` whenever detect-gpu is upgraded.

## Rules
- All copy lives in `content/` (`profile.ts`, `work/*.ts`, `nav.ts`, `figures.ts`) and is validated by `content/schema.ts`. Never hardcode roles, projects or profile text in components; brand, city, job title and project totals come from `profile.brand`, `profile.city`, `profile.jobTitle` and `projects.length`. The primary CTA label and mailto subject come from `CTA` in `content/nav.ts`.
- Content model: `projects` (from `content/index.ts`) holds only `featured: true` projects, indexed 1..n; only `content/index.ts` and `content/validate.ts` read `content/work`. Case evidence fields: `decisions`, `sinceLaunch`, `figure` (rendered by `components/work/CaseNotes.tsx`); `profile.contactNote` above the Contact email. Validation runs at build through `content/validate.ts` (server-only; keep `zod` out of client bundles and out of `content/index.ts`).
- Project `stack` = technologies only; non-technology themes go in `focus` (rendered as the case "Focus" row). Lab links may be internal (`/work/<slug>/`, rendered with `next/link`). Nav items live in `content/nav.ts`. The About heading is `profile.aboutHeading`.
- The navbar dot (`NavDot`) is decorative: `aria-hidden`, `tabIndex={-1}`, pointer click only. The hero scene renders on demand (`frameloop="demand"`, ~30 fps idle ticker, `sceneBridge.invalidate` during the dive).
- Design tokens live in `app/globals.css` `@theme`; use the Tailwind utilities (`bg-canvas`, `text-ink`, `text-signal`, `display-xl`, `eyebrow`). Never pure #000/#FFF. Red is light, never a large fill or body text.
- Spec: `docs/superpowers/specs/2026-10-09-portfolio-redesign-design.md`. Plans: `docs/superpowers/plans/`.
- `assets/source/` is gitignored (originals). `public/media/` is committed (processed).
- Motion: respect `prefers-reduced-motion`; GSAP/R3F run behind `lib/tiers.tsx` (Tier C = reduced motion, no motion layer).
- Commits: conventional prefix, end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Build and deploy notes
- `vercel.json` sets the security headers (nosniff, referrer policy, permissions policy, `frame-ancestors 'none'`) for every path and a 1-day `Cache-Control` with stale-while-revalidate for `/media/*`.
- OG images are static `.png` route handlers at `app/og/[slug]/route.tsx` (`/og/home.png`, `/og/<slug>.png`), so Vercel serves the right content type with `trailingSlash: true`.
- The `postbuild` CV PDF script (`scripts/build-cv-pdf.mjs`) is deploy-safe: when Chromium is unavailable (e.g. on Vercel) it skips generation and keeps the committed `public/Rijad-Kuloglija-CV.pdf`. Regenerate locally and commit the PDF whenever the CV content or styling changes.
- Text contrast is checked by axe (`tests/e2e/a11y.spec.ts`, serious/critical must be zero on `/`, a case study and `/cv/`). Keep small muted text at or above 4.5:1.
- CI (`.github/workflows/ci.yml`): `npm run check`, build, then the full Playwright suite (desktop, mobile, reduced-motion).
