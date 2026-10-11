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
- [ ] Owner questions answered (each names the file and field to change; edit, then `npm run check` and `npm run build`):
  - [ ] **Neo Labs start month**: `content/profile.ts` → `roles[company "Neo Labs"].start`. Currently assumed `"2025-09"`.
  - [ ] **Amodo row** (Flutter, 2022-09 → 2022-10): keep it off the CV, or show it? `content/profile.ts` → `roles[company "Amodo"].showOnCv` (currently `false`).
  - [ ] **Neo Labs title on the CV**: is "Head of Communications & Software Innovation" the wording you want? `content/profile.ts` → `roles[company "Neo Labs"].title` (also `content/work/neo-labs.ts` → `role`).
  - [ ] **Nepa Invest role and months**: `content/work/nepa-invest.ts` → `role` (currently "Web Engineer") and `period` (currently "2025"; add months if known, e.g. "Mar 2025 — Jun 2025").
  - [ ] **Sui NFT dApp live URL**: `content/profile.ts` → `lab[name "Sui NFT dApp"].links` points at `https://dapp-test-hazel.vercel.app/`, which reads as a test deployment. Provide a proper URL, or remove the "Live" link (the GitHub link was dropped because it pointed at the profile root).
  - [ ] **ProCredit / Arkona overlap**: ProCredit Bank (on-site, `2024-03` → `2025-10`) overlaps Arkona Technology (part-time, `2024-10` → `2025-03`). Confirm both date ranges in `content/profile.ts` → `roles[company "ProCredit Bank"]` and `roles[company "Arkona Technology"]` (`start` / `end`; Arkona also `content/work/arkona.ts` → `period`).
- [ ] Vercel preview of `redesign/signal` reviewed on phone and laptop, in Tier B and Tier A
  (force a tier in DevTools: `localStorage.setItem("redzy:tier", "A")`, reload; `localStorage.removeItem("redzy:tier")` to reset)
- [ ] Manual Tier A dive on an M1 Air: no frame > 32 ms; loader lands in the navbar; cursor, magnetic pills, hover previews and shader frames work
- [ ] Reduced motion (OS setting): no loader, static hero, all content visible
- [ ] CV PDF: 2 pages, dates correct, downloads from the "Download CV (PDF)" link in the Contact section and from `/cv/`
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
- [ ] Add the production numbers (preview URL, production URL, Lighthouse numbers, frame-time note, date) under the existing "Plan 2 result" section of `docs/superpowers/plans/2026-10-10-portfolio-redesign-signal-motion.md`

| Date | Page | Profile | Perf | A11y | BP | SEO |
| ---- | ---- | ------- | ---- | ---- | -- | --- |
|      | /    | desktop |      |      |    |     |
|      | /    | mobile  |      |      |    |     |
