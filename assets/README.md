# Source assets (gitignored)

- `photo/` owner portraits (originals). About uses `untitled-6516.jpg`.
- `captures/<slug>/` Playwright captures of public sites (`npm run capture`).
- `app-screenshots/<slug>/` owner-supplied screenshots of apps behind login (LibLynx report builder, GumaMax, Neo panels). When present, point `content/work/<slug>.ts` media at processed versions and add the jobs to `scripts/process-assets.mjs`.
- `nepa/` renders and a tour video copied from the NepaInvest repo (owner approved).
- `din-screenshots/` fallback captures from the DIN joint portfolio.

Processed outputs live in `public/media` and are committed. Re-run `npm run assets` after changing sources.
