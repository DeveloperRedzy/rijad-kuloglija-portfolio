# Redzy portfolio

Portfolio of Rijad Kuloglija (rijadkuloglija.com). Next.js 16 App Router, static export, React 19, TypeScript strict, Tailwind 4. Dark only, English only. All copy comes from `content/` and is validated by `content/schema.ts`.

## Commands
- `npm run dev` · `npm run build` (also writes the CV PDF in postbuild) · `npm run check` (lint + typecheck + unit) · `npm run e2e` (build + Playwright) · `npm run screens` (after-screenshots into `docs/screenshots/after/`)
- Assets: `npm run capture`, `npm run assets`, `npm run icons`, `npm run auras`, `node scripts/fetch-fonts.mjs`

## Deploy
Hosted on Vercel (same project as before). `main` is production; other branches get preview deployments.
