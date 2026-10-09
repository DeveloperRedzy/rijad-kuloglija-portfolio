# Redesign decisions (brainstorming, 2026-10-09)

Answers to the open questions in `2026-10-09-redesign-kickoff.md`. These are locked unless the owner changes them.

| # | Question | Decision |
|---|----------|----------|
| 1 | Audience / lead role | Clients and partners. Tone: senior, product ownership. Lead roles: CTO @ DIN Solution + Lead Software Developer @ LibLynx. |
| 2 | Structure | Hybrid: long scroll-driven home + case study page per showcase project (`/work/<slug>`). |
| 3 | Stack | Next.js 15 App Router + React 19, static export on Vercel. Full rewrite of the repo. |
| 4 | Logo | Monogram "R" + custom wordmark "Redzy". Monogram must work at 16 px, as a 3D hero object and as a loader. No shield, no crown. |
| 5 | Colors | Dark-only, near-black canvas, one warm red/vermilion accent (the "red" in Redzy), warm greys. Not DIN gold, not Linear lavender. |
| 6 | Mood | Dark-only, editorial + cinematic: big typography and editorial grid as skeleton, Three.js / shader light as a layer on top. No theme toggle. |
| 7 | Motion budget | React Three Fiber hero scene (3D monogram reacting to pointer + scroll), live shader background through the home, GSAP ScrollTrigger choreography (pin/stack/scrub), Lenis smooth scroll. Lighter fallback on mobile and `prefers-reduced-motion`. |
| 8 | Case studies (5) | LibLynx report builder; DIN Solution; Neo Labs (Neo Care + Neo Therapy inside); Arkona + GumaMax; Nepa Invest. |
| 8b | More work / Lab | Sui NFT DApp (GitHub + live link, no page). ProCredit Bank and Bloola (BMW, Deutsche Bundesbank) appear in experience + logo strip only, no UI shown. |
| 9 | Imagery | Owner portrait in About (editorial treatment: B&W or duotone with brand red). Everything else is live: 3D monogram, shader backgrounds, product screenshots in dark frames. No generated stock imagery. |
| 10 | Languages | English only, site and CV. No i18n layer. |
| 11 | CV | Single source of truth: experience, projects, stack in one TypeScript data module. Site and `/cv` page render from it; PDF generated at build (react-pdf or Playwright print), served as download. Brand typography, red accent used sparingly for print. |
| 12 | Contact | Mailto CTA with copy-to-clipboard. No calendar link for now (owner has none). No EmailJS, no form. |
| 13 | Deploy | Same Vercel project, same domain rijadkuloglija.com. Work on a feature branch; Vercel preview before merge to main. |

## Materials

- Portrait: owner will supply several high-res photos into `assets/source/photo/`; we pick the best.
- Allowed publicly: Nepa Invest renders and video tours (`~/Desktop/NepaInvest/public/projects`), Arkona logo + screenshots of arkonatechnology.com (we capture), newer CV `~/Desktop/Dokumentacija/Rijad Kuloglija CV.pdf` as a data source only.
- GumaMax: no screenshots available for now; text only unless owner supplies.
- No calendar link, no extra social handles (GitHub + LinkedIn only), no reference sites, no font preferences, no testimonials. Design direction and typography are ours to choose.
- DIN portfolio screenshots of the projects are saved in `assets/source/din-screenshots/` (desktop + mobile per project) as reference and fallback.
- Case study copy source: `docs/brief/din-case-studies-2026-10-09.md`. Home copy source: `docs/brief/din-portfolio-content-2026-10-09.txt`.

## Before screenshots

`docs/screenshots/before/`: old site (desktop light/dark, mobile, full page), DIN portfolio (hero, full page, Sui and Nepa and LibLynx case pages).

## Note on `Dokumentacija/Rijad Kuloglija CV.pdf`

Checked 2026-10-09: this CV is older than the DIN portfolio (ends at Bloola, Nov 2023). DIN stays the source of truth. Facts it adds that DIN lacks:
- Amodo, Zagreb (Sep–Oct 2022): Flutter Developer, contract; Porsche Smart Driver App, Insurtech clients.
- Education: Electrical technician of computer science and informatics (secondary), Sarajevo, 2013–2017; B.Sc. Computer Science, International Burch University, 2017–2023.
- Spoken languages: Bosnian native, Croatian and Serbian fluent, English professional, German upper intermediate.
- Legacy projects: Bloola CM (Teams contract management), Bloola Factory (no-code app builder, MUI + Java Spring), BDM Network, BMW My Learning Finder, BMW Forms, Project Planner, Travel App, Movie App.

## Design-phase decisions (visual companion, 2026-10-09)

| Screen | Decision |
|--------|----------|
| Direction | A "Signal": the R monogram is a red light source; everything on the page is lit by it. |
| Logo | Concept A "Signal": solid geometric R (stem 14 units wide, D-shaped bowl, diagonal leg), red dot in the counter. Wordmark "Redzy" in Cabinet Grotesk 800, tracking -4.5%. |
| Hero transition | A "Dive": scroll pushes the camera into the dot; the page emerges from the light; the dot settles into the navbar. |
| Typography | A: Cabinet Grotesk 800 (display) + Switzer 400/500 (body) + IBM Plex Mono 400 (meta). Self-hosted woff2. |
| Palette | canvas #0A0908, surface-1 #121110, surface-2 #1A1816, hairline #23211E, ink-muted #8A857E, ink-soft #B8B2AA, ink #F2EFEA, signal #FF4A26, signal-soft #FFB3A3. |
| Home | B: vertical sticky chapters for Selected work (5 × 100vh), then logo strip, about, experience, lab, contact. |
| Case study | Template per DIN structure; hero screenshot A: dark browser frame + light sweep + subtle tilt. |
| CV | A: single column editorial on cream paper, print-safe, generated from the shared data module via Playwright print. |
| Portrait | `assets/source/photo/untitled-6516.jpg` (window) for About; `untitled-7189.jpg` (column) as warm secondary. |
| Screenshots | Owner supplies app screenshots behind login (LibLynx report builder, GumaMax, Neo Care/Therapy panels). Public sites captured by us. |
| Copy | Working hero line "Software that keeps working after launch." CTA "Send a signal". Final copy in the spec. |
