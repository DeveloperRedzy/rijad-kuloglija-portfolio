# Redzy portfolio

Portfolio of Rijad Kuloglija (rijadkuloglija.com). Next.js 16 App Router, static export, React 19, TypeScript strict, Tailwind 4, GSAP and React Three Fiber for motion. Dark only, English only. All copy comes from `content/` and is validated by `content/schema.ts`.

## Commands
- `npm run dev` · `npm run build` (static export to `out/`, then writes the CV PDF) · `npm run check` (lint + typecheck + unit) · `npm run e2e` (build + Playwright)
- After a build: `npm run budget` (bundle budgets) · `npm run lhci` (Lighthouse desktop and mobile) · `npm run screens` (after-screenshots into `docs/screenshots/after/`, `BASE_URL` overrides the server)
- Assets: `npm run capture`, `npm run assets`, `npm run icons`, `npm run auras`, `npm run poster` (hero posters from the live scene, needs `npm run dev`), `node scripts/fetch-fonts.mjs`

## Motion tiers
`lib/tiers.tsx` picks Tier A (full 3D dive, cursor, shaders), B (poster and light motion) or C (reduced motion, static). For testing, set `localStorage["redzy:tier"]` to `A`, `B` or `C`; `localStorage["redzy:scene"] = "force"` allows the 3D scene on a software renderer; `sessionStorage["redzy:loaded"] = "1"` skips the first-visit loader.

## Deploy
Hosted on Vercel. `main` is production; other branches get preview deployments. The CV PDF is committed (`public/Rijad-Kuloglija-CV.pdf`) because Vercel builds skip its generation. Launch steps: `docs/launch-checklist.md`.
