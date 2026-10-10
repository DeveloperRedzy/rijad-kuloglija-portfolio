# Launch checklist (redesign/signal → main)

Owner-run. Nothing here is automated; tick each box on the branch before merging.

## Before merge

- [ ] Gates green on the branch:
  ```bash
  npm ci
  npm run check          # lint + typecheck + unit
  npm run build          # static export to out/, regenerates the CV PDF
  npm run budget         # initial JS ≤ 200 KB gz, 3D chunks ≤ 400 KB gz and lazy
  npm run lhci           # Lighthouse desktop + mobile (set CHROME_PATH if needed)
  npx playwright test    # desktop, mobile, reduced-motion
  ```
- [ ] `git status` clean after the build (a changed `public/Rijad-Kuloglija-CV.pdf` means CV content changed: commit it)
- [ ] LibLynx: report-builder screenshots swapped in (`content/work/liblynx.ts` TODO, spec §7.2) or the marketing-site capture accepted for launch
- [ ] Copy questions in the Task 10 report answered (Neo Labs start month, Amodo row, availability, Neo Labs title wording)
- [ ] Vercel preview of `redesign/signal` reviewed on phone and laptop, in Tier B and Tier A
  (force a tier in DevTools: `localStorage.setItem("redzy:tier", "A")`, reload; `localStorage.removeItem("redzy:tier")` to reset)
- [ ] Manual Tier A dive on an M1 Air: no frame > 32 ms; loader lands in the navbar; cursor, magnetic pills, hover previews and shader frames work
- [ ] Reduced motion (OS setting): no loader, static hero, all content visible
- [ ] CV PDF: 2 pages, dates correct, downloads from the footer CTA and `/cv/`
- [ ] OG images render in a social preview tool for `/` and `/work/liblynx/` (`/og/home.png`, `/og/liblynx.png`)
- [ ] `docs/screenshots/after/` refreshed against the preview: `BASE_URL=https://<preview-url> npm run screens`

## Merge and deploy

```bash
git checkout main && git pull
git merge --no-ff redesign/signal -m "feat: Redzy redesign (Signal): Next.js 16, 3D hero, case studies, generated CV"
git push origin main
```

- [ ] Vercel production deploy finished
- [ ] `curl -I https://www.rijadkuloglija.com/` returns 200; `/work/liblynx/`, `/cv/`, `/Rijad-Kuloglija-CV.pdf` return 200
- [ ] Old anchors still land: `/#about`, `/#experience`, `/#contact`
- [ ] `https://www.rijadkuloglija.com/robots.txt` and `/sitemap.xml` correct; sitemap submitted in Google Search Console

## After launch

- [ ] Lighthouse on production (desktop and mobile); record below
- [ ] Append "Plan 2 result" (preview URL, production URL, Lighthouse numbers, frame-time note, date) to `docs/superpowers/plans/2026-10-10-portfolio-redesign-signal-motion.md`

| Date | Page | Profile | Perf | A11y | BP | SEO |
| ---- | ---- | ------- | ---- | ---- | -- | --- |
|      | /    | desktop |      |      |    |     |
|      | /    | mobile  |      |      |    |     |
