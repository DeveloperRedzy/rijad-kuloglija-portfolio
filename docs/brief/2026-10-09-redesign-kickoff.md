# Portfolio redesign — kickoff brief (2026-10-09)

Prepared in a ClipForge session as a handoff. The new Fable session in this folder owns everything from here: brainstorming, spec, plan, implementation.

## Owner's request (paraphrased from chat, Bosnian original)

- Complete redesign of the personal portfolio. "Sve novo": new theme, new logo, full **Redzy** branding.
- Design must feel timeless but with **wow** effects: animations, backgrounds that move, custom imagery. Three.js is welcome if it earns its place.
- Content must be refreshed with the newest facts. Source of truth for content is the **DIN joint portfolio** (https://din-portfolio-five.vercel.app/), section "Rijad Kuloglija" and his projects. It is the most recent update and has everything in one place.
- A new **CV** must be produced as part of this work (current `public/Rijad-Kuloglija-CV.pdf` is stale).
- Owner wants to be asked questions. Ask them one at a time before designing.

## What exists

### This repo (old portfolio, deployed at https://www.rijadkuloglija.com/)
- Vite 5 + React 18 + TypeScript, Tailwind 3, Framer Motion 11, react-i18next (en + bs), lucide-react, EmailJS contact form, react-scroll. Deployed on Vercel (`vercel.json` SPA rewrite).
- Single-page sections: Hero, About, Experience, Skills, Projects, Contact, Navbar, Footer. Light/dark theme via class.
- Visual today: Inter + JetBrains Mono, sky-blue primary (#0ea5e9), slate dark palette, spinning-circle hero background. Generic template look. This is what the redesign replaces.
- Logo: raster `logo_light/dark.webp|avif` plus a PNG-in-SVG favicon. No vector source. Needs a real logo.
- Content in `src/locales/en/translation.json` and `bs/translation.json` is **outdated** (says "Full-Stack Developer at ProCredit Bank", "Present"). Treat as legacy; the DIN portfolio supersedes it. Useful legacy material: ten project write-ups (Sui NFT DApp, Ultimate Dashboard, FeedBack PRO, MemberGetMember, Bloola CM, Bloola Factory, Project Planner, Travel App, BMW My Learning Finder, BDM Network) and education: B.Sc. Computer Science, International Burch University; languages EN professional, DE intermediate, BS native; age 26 at time of writing.
- Last commit: "Feat: Update projects section with new design and project". Remote: github.com/DeveloperRedzy/rijad-kuloglija-portfolio, branch main.

### Facts pulled from the DIN portfolio (2026-10-09)
- Title: Lead Software Developer / Full-Stack. Building software professionally since 2021. Sarajevo, Bosnia & Herzegovina.
- Positioning: frontend architecture backed by backend work; integrated AI into a Swiss legal-tech product; shipped a dApp on Sui.
- Strengths: frontend architecture, React/Vue ecosystems, design-to-deployment ownership, enterprise and banking software, AI integrations, performance and UI engineering.
- Core stack: React / Next.js, Vue 3, TypeScript, Material UI, Tailwind CSS, TanStack Query, PHP (Laravel), Python (Flask), Node.js / Express, GraphQL, MySQL / PostgreSQL, Docker.
- Current roles:
  - DIN Solution (2026–present): CTO & Head of Software Development. London / Luxembourg / US, remote.
  - Neo Labs (current): Head of Communications & Software Innovation. EU, remote. One of four members.
  - LibLynx via Clearview (Jul 2025–present): Senior Frontend Developer, promoted to Lead Software Developer Oct 2025. Leads the report-builder app (React 19, TypeScript, Vite, Material UI, TanStack Query, Storybook).
- History: Arkona Technology (Oct 2024–Mar 2025, Senior Frontend, Belgrade, part-time; website + GumaMax tire-ordering dashboard). ProCredit Bank (Mar 2024–Oct 2025, Full-Stack, Sarajevo; HR dashboard, referral system, ATM-feedback tooling). Superlex (Feb–May 2024, React + AI Engineer, Switzerland, contract). ACKE Creative Studio (May–Jul 2023, React dashboard MVP for music producers). Bloola GmbH (Sep 2021–Nov 2023, React Developer, Germany; BMW, Deutsche Bundesbank). Solution404 (Jan–Sep 2021, Sarajevo; MyLawyer, led Mine Tracking app).
- Projects: LibLynx report builder (liblynx.com), Neo Labs (neo-labs.ai), Neo Care, Neo Therapy (neo-therapy.ai), DIN Solution (dinsolution.com), Arkona website + GumaMax dashboard, Nepa Invest website (real estate), Sui NFT DApp.
- Contact: rkuloglija@gmail.com, github.com/DeveloperRedzy, linkedin.com/in/rijad-kuloglija.
- Note: the DIN site is a joint portfolio with Anel Kujović. Only Rijad's material is in scope here.

### Assets ready in this repo
- `design/DESIGN.md`: Linear's design system (from VoltAgent/awesome-design-md, MIT). Owner picked it as the starting reference: near-black canvas, lavender-blue single accent, hairline borders, dense technical feel. A **starting point only**; the brand must become Redzy, not Linear.

### Skills installed globally (`~/.claude/skills/`)
- `design-taste-frontend` (anti-slop landing/portfolio skill, the main one), `redesign-existing-projects`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste` (GSAP-heavy), `stitch-design-taste` (generates DESIGN.md), `brandkit` (logo/brand boards, image-gen oriented), `web-design-guidelines` (Vercel review skill, fetches rules from GitHub at run time), `image-to-code` and `imagegen-frontend-*` (Codex image-gen workflows, limited use in Claude Code), `full-output-enforcement`.
- Process: Superpowers (brainstorming → spec → writing-plans → TDD), `frontend-design`, Playwright plugin for screenshots.

## Open questions for brainstorming (ask one at a time)

1. Stack: keep Vite + React and rebuild on it, or move to Next.js / Astro? (Three.js, scroll animation and static deploy all work on Vite; Next adds routing for per-project pages and OG images.)
2. Structure: single long page like today, or multi-page with a case study per project?
3. Brand "Redzy": what does the name mean to you, what should the logo say? Wordmark, monogram (R / RK), or symbol? Any colors you love or hate?
4. Mood: dark-only, light-only, or both? Timeless = editorial and typographic, or cinematic with 3D and particles? Reference sites you admire.
5. Motion budget: how heavy? Three.js hero scene, GSAP scroll choreography, or restrained micro-motion with one signature moment?
6. Content: who is the audience, recruiters and CTOs, or clients for freelance/consulting work? Which of the three current roles leads?
7. Projects: which 4 to 6 are the showcase? Do you have screenshots or permission to show client UIs?
8. Custom imagery: do you have a photo you want to use? Should imagery be generated (in Codex with the imagegen skills), illustrated, or abstract 3D?
9. Languages: keep EN + BS? CV in both?
10. CV: PDF generated from the same data as the site (single source of truth), or designed separately?
11. Contact: keep EmailJS form, or mailto + calendar link?
12. Deploy: same Vercel project and domain rijadkuloglija.com?

## Suggested first steps for the new session
1. `npm install`, `npm run dev`, screenshot the current site with Playwright so the "before" is on record.
2. Screenshot https://din-portfolio-five.vercel.app/ for content and visual reference.
3. Run brainstorming (architectural path) through the questions above, then spec in `docs/superpowers/specs/`, then writing-plans.
4. Create a `CLAUDE.md` for this repo once stack and conventions are decided.

## Materials to request from the owner

The owner offered: "If my photo can help, ask for whatever you want, anything that comes to mind." Collect early, into `assets/source/` (keep originals out of `public/` until processed):

- Portrait photo(s): high resolution, ideally one neutral-background shot for cut-out treatment and one environmental shot. Ask about mood (serious, approachable) and whether a stylized or 3D-treated version is acceptable.
- Existing logo files if any vector source survives (AI, SVG, Figma). If not, the logo is designed from scratch.
- Project screenshots or demo videos for the showcase projects, with a note on which client UIs may be shown publicly. Public ones: liblynx.com, neo-labs.ai, neo-therapy.ai, dinsolution.com, arkonatechnology.com, Nepa Invest site. Local folders exist on the Desktop: `arkonatecnhology.com/`, `NepaInvest/`, `Porsche/` (check for usable assets, ask before using anything).
- Current CV PDF is in `public/Rijad-Kuloglija-CV.pdf` (stale). Ask for any newer CV or LinkedIn export.
- Testimonials or quotes from clients and leads, if any.
- Handles to show: GitHub, LinkedIn. Ask about X/Twitter, Dribbble, YouTube or others.
- Fonts or brands the owner admires; links to two or three sites whose feel they want.
- Domain and Vercel access confirmation for deploy.
