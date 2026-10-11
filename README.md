# Redzy portfolio

Portfolio of Rijad Kuloglija (rijadkuloglija.com). Next.js 16 App Router, static export, React 19, TypeScript strict, Tailwind 4, GSAP and React Three Fiber for motion. Dark only, English only. All copy comes from `content/` and is validated by `content/schema.ts`.

## Commands
- `npm run dev` · `npm run build` (static export to `out/`, then writes the CV PDF) · `npm run check` (lint + typecheck + unit) · `npm run e2e` (build + Playwright)
- After a build: `npm run budget` (bundle budgets) · `npm run lhci` (Lighthouse desktop and mobile) · `npm run screens` (after-screenshots into `docs/screenshots/after/`, `BASE_URL` overrides the server)
- Assets: `npm run capture`, `npm run assets`, `npm run icons`, `npm run auras`, `npm run poster` (hero posters from the live scene, needs `npm run dev`), `node scripts/fetch-fonts.mjs` (woff2 into `assets/fonts`, the `next/font/local` sources)

## Motion tiers
`lib/tiers.tsx` picks Tier A (full 3D dive, cursor, shaders), B (poster and light motion) or C (reduced motion, static). For testing, set `localStorage["redzy:tier"]` to `A`, `B` or `C`; `localStorage["redzy:scene"] = "force"` allows the 3D scene on a software renderer; `sessionStorage["redzy:loaded"] = "1"` skips the first-visit loader.

The loader is gated in the server HTML: `LOADER_SCRIPT` sets `html[data-loader="on"]` before first paint on a first visit to `/` and removes it after an 8 s failsafe. Tier C without WebGL shows the loader shell until the tier resolves. detect-gpu's benchmarks are self-hosted in `public/detect-gpu`; re-copy them from `node_modules/detect-gpu/dist/benchmarks` when upgrading detect-gpu.

## Content notes
- `content/work/*.ts`: `stack` lists technologies only (the home chapter line and the case "Stack" row); non-technology themes go in the optional `focus` list (the case "Focus" row).
- `profile.lab[].links`: absolute URLs open in a new tab; site paths starting with `/` (e.g. `/work/arkona/`) are internal and render with `next/link`.
- The navbar dot is a decorative easter egg (pointer click sends a ping band): `aria-hidden`, out of the tab order.
- Primary navigation and the primary call to action (`CTA`: label and mailto subject) live in `content/nav.ts`; fixed interface labels (case body row headings, the company marquee eyebrow and pause control) in `content/labels.ts`.
- `featured: false` keeps a project file (and its role) but removes it from chapters, routes, OG images, the sitemap and the CV; featured `index` values must run 1..n. `content/validate.ts` (server-only, imported by `app/sitemap.ts` and `app/cv/page.tsx`) parses all content at build time, so an invalid edit fails `npm run build`.
- Case evidence: optional `decisions` (choice and why), `sinceLaunch` and `figure` (`"report-flow"`, copy in `content/figures.ts`) render as rows in the case body via `components/work/CaseNotes.tsx`.
- `profile.contactNote` sits above the email in Contact; `profile.lab[].showOnCv` hides items the CV already covers through a role.

## Deploy
Hosted on Vercel. `main` is production; other branches get preview deployments. The CV PDF is committed (`public/Rijad-Kuloglija-CV.pdf`) because Vercel builds skip its generation. Launch steps: `docs/launch-checklist.md`. `vercel.json` sets the security headers for every path and the `Cache-Control` for `/media/*`.
