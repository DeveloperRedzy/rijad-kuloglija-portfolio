# Redzy portfolio (rijadkuloglija.com)

Next.js 16 App Router, static export (`out/`), React 19, TypeScript strict, Tailwind 4. Dark only, English only.

## Commands
- `npm run dev` · `npm run build` (also writes the CV PDF in postbuild) · `npm run check` (lint + typecheck + unit) · `npm run e2e` (build + Playwright) · `npm run screens` (after-screenshots)
- Performance gates (after a build): `npm run budget` (initial JS ≤ 200 KB gz, 3D chunk ≤ 400 KB gz and lazy) · `npm run lhci` (Lighthouse desktop + mobile; set `CHROME_PATH` if no system Chrome). Keep GSAP plugins, Lenis and `three` out of the initial bundle: motion goes through `components/motion/lazy.tsx` / `MotionLayer`, GSAP core through `lib/gsap-load.ts`.
- Assets: `npm run capture` (public-site captures → assets/source/captures), `npm run assets` (sharp → public/media), `npm run icons`, `npm run auras`, `node scripts/fetch-fonts.mjs`

## Rules
- All copy lives in `content/` (`profile.ts`, `work/*.ts`) and is validated by `content/schema.ts`. Never hardcode roles, projects or profile text in components.
- Design tokens live in `app/globals.css` `@theme`; use the Tailwind utilities (`bg-canvas`, `text-ink`, `text-signal`, `display-xl`, `eyebrow`). Never pure #000/#FFF. Red is light, never a large fill or body text.
- Spec: `docs/superpowers/specs/2026-10-09-portfolio-redesign-design.md`. Plans: `docs/superpowers/plans/`.
- `assets/source/` is gitignored (originals). `public/media/` is committed (processed).
- Motion: respect `prefers-reduced-motion`; Plan 2 adds GSAP/R3F behind `lib/tiers.ts`.
- Commits: conventional prefix, end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Build and deploy notes
- OG images are static `.png` route handlers at `app/og/[slug]/route.tsx` (`/og/home.png`, `/og/<slug>.png`), so Vercel serves the right content type with `trailingSlash: true`.
- The `postbuild` CV PDF script (`scripts/build-cv-pdf.mjs`) is deploy-safe: when Chromium is unavailable (e.g. on Vercel) it skips generation and keeps the committed `public/Rijad-Kuloglija-CV.pdf`. Regenerate locally and commit the PDF whenever the CV content or styling changes.
- Text contrast is checked by axe (`tests/e2e/a11y.spec.ts`, serious/critical must be zero on `/`, a case study and `/cv/`). Keep small muted text at or above 4.5:1.
- CI (`.github/workflows/ci.yml`): `npm run check`, build, then the full Playwright suite (desktop, mobile, reduced-motion).
