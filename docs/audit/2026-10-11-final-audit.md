# Završni audit — rijadkuloglija.com (grana `redesign/signal`, HEAD 2d12949)

Datum: 2026-10-11. Faza: audit i prijedlozi, bez implementacije. Ništa na sajtu, u kodu, sadržaju ili zavisnostima nije mijenjano; ovaj fajl je jedini novi fajl i nije commitovan.

Kako je rađeno: tri nezavisna pregleda (sadržaj i pozicioniranje; dizajn i UX u renderovanom sajtu; tehnika, SEO i pristupačnost), koje sam zatim usaglasio i provjerio na ključnim mjestima (kod, screenshotovi, živi sajtovi dinsolution.com i liblynx.com). Izvorni izvještaji i svi screenshotovi su u radnom folderu sesije, na zahtjev. Prijedlozi teksta su na engleskom (jezik sajta), obrazloženja na bosanskom. Oznake: **[greška]** stvarna greška · **[strateško]** slabost pozicioniranja ili dokaza · **[uredničko]** poboljšanje teksta ili dizajna · **[ukus]** subjektivno.

---

## A. Iskrena ukupna procjena

Sajt je vizuelno i tehnički znatno iznad prosjeka portfolija inženjera. Koncept "Signal" je dosljedno proveden od logotipa do 404 stranice i ne djeluje kao šablon. Tipografija je disciplinovana, kontrast prolazi svuda, tastatura i reduced-motion rade, nema grešaka u konzoli, gateovi su zeleni. Tehnička ozbiljnost se vidi i to je stvarna prednost pred evaluatorom.

Ono što sajt trenutno **ograničava** za cilj (ozbiljni međunarodni klijenti, veliki projekti) nije izgled nego **dokaz i pozicioniranje**:

1. **Sajt tvrdi, ali ne pokazuje.** Glavni projekat (LibLynx report builder) prikazuje liblynx.com marketing stranicu sa stock fotografijom konferencije, a nikad aplikaciju o kojoj piše 450 riječi. Svih pet poglavlja prikazuje javne početne stranice klijenata, ne ono što je napravljeno. Hero obećava "keeps working after launch", a nijedan case study ne govori šta se dešavalo poslije lansiranja.
2. **Pozicioniranje nije na istom nivou kroz stranicu.** Hero govori o cjelovitoj odgovornosti i CTO ulozi; About naslov ("Frontend architecture, backed by real backend work.") i Strengths spuštaju ga na frontend specijalistu; eyebrow kaže "Lead Software Developer". Kupac velikog projekta kupuje vođenje isporuke, i treba jasno da vidi da li kupuje pojedinca, tehničkog lidera ili lidera s timom. Sajt to ne kaže.
3. **Kapacitet nije objašnjen.** "10 roles · 3 current" uz "Open to product engagements from Q1 2027" otvara očigledno pitanje: koliko vremena ostaje za moj projekat? Datumi pokazuju i preklapanja (ProCredit / LibLynx / Neo Labs, sep–okt 2025).
4. **DIN je najslabiji case study, a nosi najvišu titulu.** Opisuje ulogu umjesto isporuke, "getting four teams in three time zones to ship" vjerovatno preuveličava opseg (izvor kaže da su to računovodstvo, inženjering, IT i marketing), a dinsolution.com (provjereno danas) ne navodi tvoje ime i ne koristi naziv "DIN Solution" (predstavlja se kao "DIN | FinTech Solutions"). Pažljiv klijent koji provjeri CTO tvrdnju neće naći potvrdu.
5. **Kontakt ne vodi.** "Send a signal" je metafora koja otvara mail klijent bez subjecta, i nigdje ne piše za kakve projekte pisati, šta poslati i šta slijedi.

Zaključak: temelj je dobar i vrijedan čuvanja. Da bi stranica podržala ozbiljne prijave, potrebna je jedna runda rada na **dokazima i tekstu** (uz nekoliko tvojih odgovora) i jedan dan **tehničkih i dizajnerskih popravki**. Nikakva promjena okvira, dizajna ili arhitekture nije potrebna.

---

## B. Šta treba sačuvati

- **Koncept "Signal"** (R kao izvor svjetla, tačka u navbaru, pill tačka, "Lost signal." na 404). Autentičan, dosljedan, ne liči na šablon.
- **Tipografski sistem** (Cabinet Grotesk 800 + Switzer + IBM Plex Mono) i tamna paleta; kontrast ink-muted izmjeren 5.44:1, ink-soft 9.46:1, bez padova.
- **Experience lista** na home stranici: mono kolona perioda, tekuće uloge u crvenom, progresija titule, lokacija desno. Urednički najzreliji blok na sajtu.
- **Case study tijelo** (label lijevo / tekst desno, 52–59 znakova po redu na desktopu) i **LibLynx "Engineering" pasus**: iframe bridge, postMessage za visinu i sesiju, Zod na API granici, async eksport, šabloni u backendu. To su stvarne odluke i to je najuvjerljiviji tekst na sajtu.
- **Neo Labs "Problem"** ("a trust problem before it is a technology problem", kupac ≠ korisnik, GDPR, eskalacija) i **Nepa "Engineering"** (formati, lazy loading, posteri → brz prvi prikaz). Dobri primjeri veze tehnike i koristi.
- **Mobilni meni** (focus trap, Esc, povratak fokusa), **vidljivi fokus** svuda uključujući skip link, **reduced motion** potpun (ništa ne ostaje na opacity 0).
- **CV kao papir** na `/cv/` i generisanje PDF-a iz istih podataka: pošten artefakt; jedini svijetli ekran na sajtu funkcioniše jer je uokviren kao dokument.
- **Tehnička higijena**: nema curenja listenera ni WebGL konteksta nakon pet navigacija, jedan canvas, Lenis nije dupliran; sve zavisnosti u upotrebi; CI s punim Playwright suiteom.
- **Portret** u toplom duotonu, bolji uz paletu nego čisti grayscale iz speca.

---

## C. Najvažniji nalazi (rangirano)

### C1. Riješiti prije ozbiljnih prijava

| # | Nalaz | Vidio | Tumačenje | Preporuka |
|---|---|---|---|---|
| 1 | **[strateško] Proizvod se nikad ne vidi.** | `content/work/liblynx.ts` hero = liblynx.com naslovna sa stock fotografijom; jedina galerija je isti sajt na telefonu. Ostala četiri poglavlja: javne naslovne klijenata. Spec §7.2 traži aplikaciju. | Prvi dokaz nakon hero tvrdnje je tuđa marketing stranica. Evaluator ne može vidjeti šta si napravio. | 2–3 ekrana report buildera (demo podaci ili zamagljeno). Ako NDA blokira: ručno nacrtan dijagram "filter brick" interakcije (SVG, bez JS). Za ostale: bar jedan "unutrašnji" ekran po projektu (GumaMax, Neo paneli). |
| 2 | **[strateško] Nema dokaza "poslije lansiranja".** | Nigdje trajanje u produkciji, iteracije, ko održava. "Delivered" liste su izlazi, ne ishodi. Arkona `delivered[0]` "live and maintained" iako je angažman završen 2025-03. | Hero postavlja test koji dokazi ne polažu; stranica se čita kao niz lijepih sekcija, ne kao argument. | U svaki case study red **"Since launch"** (šta si održavao, iterirao, ko ga vodi sad) i blok **"Decisions"** (2–3 odluke s alternativom). Sve iz činjenica koje imaš; bez metrika. |
| 3 | **[strateško] DIN: opseg i dokaz.** | `din-solution.ts` → `engineering` "four teams in three time zones"; `delivered` su opisi uloge. dinsolution.com te ne navodi; ime firme na sajtu je "DIN \| FinTech Solutions". | Najviša titula na sajtu je i najmanje provjerljiva. | Svesti tekst na ono što stvarno vodiš; `delivered` zamijeniti s 2–3 stvari koje možeš braniti (sajt, standardi, klijentske isporuke). Zamoliti DIN da te navede na sajtu ili bar na LinkedInu; dok toga nema, formulacija "CTO" ostaje, ali bez "four teams". |
| 4 | **[strateško] Hero vs About vs eyebrow nisu isti nivo.** | `profile.aboutHeading` "Frontend architecture, backed by real backend work."; `strengths` bez liderstva; eyebrow `jobTitle` "Lead Software Developer"; lead "CTO". | Kupac ne zna šta kupuje: frontend specijalistu, tech leada ili CTO-a. | Odluka pozicioniranja (pitanje 1 u H). Potom: About naslov koji spaja hands-on i vođenje; "Product delivery and technical leadership" u Strengths; eyebrow usklađen. |
| 5 | **[strateško] Lično vs tim.** | LibLynx: "my team owns" + "I built", bez veličine tima. Arkona: "led" + "one engineer". Neo: "one of four members", nejasan udio u crisis-prevention toku. | Za kupca je ovo najvažnije pitanje; nejasnoća se čita kao napuhavanje. | Jedna rečenica opsega na vrhu svakog case studyja: "My part: … The team: …". Arkona "built" umjesto "led" ako si bio sam. |
| 6 | **[strateško] Kapacitet.** | `Experience.tsx` header "3 current"; badge "Open to product engagements from Q1 2027"; preklapanja datuma. | Ozbiljan klijent odmah pita koliko vremena ima. | Ukloniti "3 current" iz headera; u kontakt dodati rečenicu kako novi angažman staje uz postojeće uloge (pitanje 2 u H). |
| 7 | **[strateško] Imena klijenata i dozvole.** | `profile.companies` marquee: BMW i Deutsche Bundesbank ravnopravno uz LibLynx, bez konteksta Bloola; eyebrow "Products and companies I've built for". Porsche u Amodo opisu; interni ProCredit alati imenovani. | "Built for" je netačno za poslodavce i posrednike; evaluator koji provjeri vidi React developera kod podizvođača i gubi povjerenje. | "Bloola (BMW, Deutsche Bundesbank)" ili BMW/Bundesbank samo u Experience; eyebrow "Companies I've worked for and with". Potvrditi dozvole (pitanje 5). |
| 8 | **[strateško] Kontakt bez vodstva.** | `Contact.tsx`: naslov, email, linkovi, badge. Nema teksta. Nav/hero mailto bez subjecta. | Kupac ne zna za šta pisati, šta poslati, šta slijedi. | Novo polje `profile.contactNote` (prijedlog u E) i subject na glavnom CTA. Bez obećanja o vremenu odgovora. |
| 9 | **[uredničko] Hero rečenica.** | Vidi D. | — | Vidi D. |
| 10 | **[greška] Nepa video poster** sadrži traku snimača ekrana i kursor. | `public/media/work/nepa-invest/tour-pobjeda-poster-1280.webp`; video je čist od ~6 s. | Izgleda kao neobrađen snimak; pod reduced motion to je sve što posjetilac vidi. | Regenerisati poster iz čistog kadra, odrezati uvodnu karticu videa. |
| 11 | **[greška] Horizontalni scroll** na `/work/arkona/` pri 360 px (stranica 376 px) i na `/cv/` pri 320 px. | Meta "Live" link `arkonatechnology.com ↗` ne prelama se; CV adresni linkovi isto. Sve ostale stranice × širine: 0. | Cijela stranica se pomjera na uskom telefonu. | `min-width:0` na ćelijama meta grida + `overflow-wrap:anywhere` na URL linkovima. |
| 12 | **[greška] Fokus skriven iza sticky poglavlja** (WCAG 2.4.11). | Desktop ≥1024, svi tierovi: Shift+Tab iz Contact fokusira linkove poglavlja 01–04 dok ih poglavlje 05 potpuno prekriva (`WorkChapters.tsx:30-31`). | Korisnik tastature gubi fokus iz vida. | `[data-chapter]:focus-within { z-index: 50 }` ili scroll na prirodni offset poglavlja pri `focusin`. |
| 13 | **[greška] Poziv na unpkg.com** na svakom desktop učitavanju. | `lib/tiers.tsx:39` `getGPUTier` bez `benchmarksURL`; vidi se u svakom Lighthouse izvještaju. | Jedini vanjski zahtjev na sajtu koji inače nema nijedan: curenje IP-a i zavisnost Tier A od dostupnosti unpkg-a. | Kopirati `detect-gpu` benchmark fajlove u `public/detect-gpu/` i proslijediti `benchmarksURL`. |
| 14 | **[greška] Loader prekriva već iscrtanu stranicu.** | Prva posjeta `/`, Tier A i B uključujući telefone: stranica se iscrta ~140 ms, loader je prekrije od ~0.5 s do ~2.1 s (emulirani Pixel 7, 4× CPU). `components/brand/Loader.tsx`. | Posjetilac vidi sadržaj, pa loader, pa opet sadržaj. Suprotno od svrhe loadera. | Renderovati loader u SSR HTML-u s inline skriptom koja ga uklanja za povratnike i reduced motion, ili ga ukinuti na Tier B. |

### C2. Veliko poboljšanje

| # | Nalaz | Vidio | Preporuka |
|---|---|---|---|
| 15 | **[uredničko] Title i opis stavljaju brend ispred osobe.** | `<title>` "Redzy — Rijad Kuloglija", case "… — Redzy", PDF naslov "CV — Redzy", footer "© 2026 Redzy · Rijad Kuloglija". Opis 79 znakova bez CTO, Sarajevo, React. | Ime prvo: "Rijad Kuloglija — Lead Software Developer & CTO, Sarajevo"; `%s — Rijad Kuloglija`; opis iz novog leada; PDF `Title`/`Author`. "Redzy" sugeriše agenciju onome ko traži odgovornu osobu. |
| 16 | **[uredničko] About pasus** predug i ponavlja poglavlja. | 11 redova, ~69 znakova po redu (spec ≤62), ~140 riječi (spec ~90). | Prepisati (prijedlog u E) i `max-width: 62ch`. |
| 17 | **[strateško/dizajn] Dive: 20 % pina je prazan ekran.** | Tier A (softverski renderer), 1440×900: .62–.82 ≈ 450 px scrolla gotovo crn ekran, rail već vidljiv (`diveA-1440-075.jpg`, provjereno). Prije toga preko cijelog ekrana peach pa narandžasti flash. | Preklopiti slijetanje: početi otkrivanje "Selected work" i poglavlja 01 oko .68 ili skratiti pin na ~2 vh; flash ispod punog bijelog (~0.6) i samo u smjeru naprijed; rail sakriti do .82. **Obavezno provjeriti na pravom GPU-u.** |
| 18 | **[uredničko] Hero na 1280×800 i 1440×900.** | Naslov u 4 reda po 1–2 riječi, CTA na y≈775/900, badge dostupnosti ispod folda (provjereno `first-home-1440-natural.jpg`). | Širi stupac (7/12) ili display-xl ≤104 px da naslov stane u 3 reda; badge iznad CTA ili u eyebrow. |
| 19 | **[uredničko] Case hero na mobilnom** je desktop snimak širine ~312 px, nečitljiv; mobilni snimak je tek na dnu. | `sheet-work_*-360.jpg`. | Ispod 768 px hero = mobilni snimak (`<picture>` media), desktop u galeriju. |
| 20 | **[uredničko] Usamljeni telefoni u galeriji** s "browser" tačkama i sjenom koja se čita kao kutija. | LibLynx, DIN, Arkona na 1440. | Upariti s drugim kadrom (desktop detalj ili ekran aplikacije); bezel bez tačaka; mekša sjena. Nestaje samo s rješenjem nalaza 1. |
| 21 | **[uredničko] `/cv/` na ekranu u print veličinama** (9.5–11.5 px); Lighthouse a11y 95–96 zbog `target-size` i `font-size`. | `full-cv-1440-natural-00.jpg`. | `@media screen` skala ×1.25 (min 13 px tijelo), print nepromijenjen. |
| 22 | **[uredničko] Dodirne površine** 18–38 px (toggle 38×38; Contact/Lab linkovi 18 px visine). | Mjereno pri 360×740. | `py-3` ili `::after` proširenje; toggle 44×44. Bez vizuelne promjene. |
| 23 | **[uredničko] Frame poglavlja nema hover na Tier B** (većina laptopa). | Pixel diff 0 na hover. | CSS hover za sve tierove: tanki signal ring, `scale(1.01)`, pomak strelice; Tier A kursor-pill dobija `canvas/80` pozadinu. |
| 24 | **[greška vs spec] Slike u jednoj širini.** | `lib/media.ts` daje jedan `srcset` kandidat; `sizes` ne radi ništa; telefoni skidaju 1600 px hero. | Generisati 800/1200/1600 u `scripts/process-assets.mjs` i pravi `srcset`. |
| 25 | **[greška, nizak rizik] Nema sigurnosnih zaglavlja** (nema `vercel.json`). | Provjereno: fajl ne postoji. | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`; CSP prvo u report-only. Besplatno, a sajt je CTO-a. |
| 26 | **[greška održavanja] Šesti case study ne prolazi validaciju.** | `content/schema.ts:43` `index.max(5)`, `featured: literal(true)`, testovi hardkodiraju 5. Sadržaj se validira samo u Vitestu, ne u buildu. | Ukloniti cap, refinement za jedinstvene indekse, testovi iz podataka; parsirati sadržaj u `content/index.ts` da loš unos obori build. |
| 27 | **[uredničko] Mono font bez ž/š/č/đ.** | Latin subset; "Goražde", "Ilijaš" padaju na sistemski font. | Dodati latin-ext u `scripts/fetch-fonts.mjs`. |
| 28 | **[greška, WCAG 2.2.2] Marquee** firmi bez pauze (samo hover). | `Companies.tsx:11`. | Dugme pauze ili zaustaviti nakon jednog prolaza. |
| 29 | **[uredničko] Alt tekstovi** imenuju URL, ne ekran ("liblynx.com marketing site home page"). | `content/work/*.ts` `media.*.alt`. | Opisati šta se vidi. |
| 30 | **[uredničko] Formati perioda** miješani ("present" vs "now"; CV samo godine; "2026 — present" iako je start jan 2026). | Case meta, Experience, CV. | "present" svuda; mjeseci svuda, i na CV-u (kratki angažmani su bolje predstavljeni iskreno nego da ih evaluator otkrije). |
| 31 | **[uredničko] "Lab & more work"** sadrži klijentski rad (ProCredit, Bloola, BMW) i duplira GumaMax (poglavlje + lab + CV ×2). | `profile.lab`. | "More work"; GumaMax ukloniti iz laba; Sui označiti kao lični projekat i "testnet" ako jeste. |

### C3. Opciono dotjerivanje

Footer "Status · shipping · built …" → "Updated 10 Oct 2026"; 404 tekst bez trijade; `/cv/` eyebrow "Generated from the same data…" ukloniti; JSON-LD `worksFor` "LibLynx via Clearview" razdvojiti; sitemap `lastmod` = vrijeme builda (ukloniti ili iz sadržaja); `public/fonts/` kopije se ne koriste; `profile` objekat cijeli u klijentskom bundleu (proslijediti `brand`/`email` kao propove); aura SVG inline ~21 KB u HTML-u (CSS background na postojeće PNG-ove); `Environment`/`Lightformer` i "Vercel Analytics" u specu §10 ne odgovaraju stvarnosti (spec osvježiti); spec kaže 180 KB, skripta 200 KB; copy-email je `<a mailto>` koji kopira (semantika: dugme + pravi mailto); naslovi sekcija "2021 → now" i "Send a signal." ne imenuju sekciju za čitač ekrana (eyebrow kao h2); `cursor: none` na Tier A uklanja i uvećani OS kursor; video 3.9 MB autoplay na mobilnom (čekati tap); `/cv/` opis hardkodira ime (CLAUDE.md pravilo).

---

## D. Pet hero pravaca

**Trenutno** (`content/profile.ts`, `components/hero/Hero.tsx`):
- Eyebrow: "Rijad Kuloglija · Lead Software Developer · Sarajevo"
- Naslov: **"Software that keeps working after launch."**
- Lead: "I take products from design to deployment and stay accountable for them after launch. CTO at DIN Solution and Lead Software Developer at LibLynx."
- CTA: "Send a signal" (mailto, bez subjecta) · "Selected work"
- Badge: "Open to product engagements from Q1 2027"

**Zašto trenutna rečenica ne predstavlja nivo dovoljno dobro.** Ideja (odgovornost poslije lansiranja, pouzdanost) je prava za kupca koji se boji da ostane sam s proizvodom, i treba je zadržati. Formulacija ima četiri problema: obećava ono što svaki kupac podrazumijeva, pa zvuči blago defanzivno (odgovor na prigovor koji niko nije izgovorio); ne kaže ni nivo (lead/CTO), ni vrstu proizvoda, ni za koga; "after launch" se ponavlja u leadu, koji se zatim raspada na fragment CV-a bez glagola; i sajt trenutno nema dokaz za nju (nalaz 2). Gramatički je prirodna i dobro se prelama na svim širinama. Izgovorena klijentu zvuči kao slogan, ne kao rečenica koju bi rekao za stolom.

Činjenice na koje hero smije da se osloni: vođenje report buildera u LibLynxu (platforma čiji su kupci, javno navedeni na liblynx.com, PLOS, The Economist Group, Digital Science); unapređenje u Lead tri mjeseca nakon dolaska; CTO u DIN-u od januara 2026; platforme dva živa AI voice proizvoda u Neo Labsu; rad od 2021 za timove u DE, CH, UK, LU, US; interni alati u ProCredit Bank; dvije godine na BMW/Bundesbank projektima kroz Bloolu; pet živih case studyja. Ne smije: metrike, veličina tima, "founder", PLOS/BMW kao tvoji klijenti, AI/ML rad na modelima, "banking systems".

### Pravac 1 — Odgovornost (ideja sadašnjeg, nova formulacija)
- Naslov: **"I build products and stand behind them."** (40)
- Lead: "Lead developer on LibLynx's reporting product and CTO at DIN Solution. I take a product from first design to production, and I'm still there when it has users."
- CTA: "Discuss a project" (mailto sa subjectom) · "Selected work"
- Dokaz: "Since 2021 · Sarajevo · teams in Germany, Switzerland, the UK, Luxembourg and the US"
- Poruka: ne nestajem poslije isporuke. Kome: kupac koji se opekao. Razlika: prvo lice i glagol umjesto "software that"; "stand behind" je prirodan idiom za odgovornost. Kompromis: i dalje obećanje; traži "Since launch" dokaz u case studyjima. Mobilno: 3 reda, čisto.

### Pravac 2 — Uloga koju ozbiljan projekat traži
- Naslov: **"The lead engineer a serious product needs."** (42)
- Lead: "I design the architecture, write the critical code and lead the team that ships it. Currently leading the report-builder application at LibLynx and the technology function at DIN Solution."
- CTA: "Discuss a project" · "Selected work"
- Dokaz: "Lead Software Developer, LibLynx · CTO, DIN Solution"
- Poruka: hands-on i vođenje u jednoj osobi. Kome: kupac koji bira između agencije i pojedinca. Razlika: definiše šta kupuje. Kompromis: "serious" je blago samohvalno; "the team that ships it" traži da postoji tim (pitanje 1). Mobilno: 3 reda.

### Pravac 3 — Domeni s visokim ulogom
- Naslov: **"Software for places where mistakes are expensive."** (49)
- Lead: "Usage analytics for scholarly publishers, internal tools for a bank, AI voice products for people in care. I build the web platforms around them, from architecture to production."
- CTA: "Discuss a project" · "Selected work"
- Dokaz: "LibLynx · ProCredit Bank · Neo Labs" (konteksti rada, ne klijenti)
- Poruka: naviknut na odgovornost i regulisane sredine. Kome: fintech, health, enterprise. Razlika: najkonkretnije kaže "za koga". Kompromis: najbliže sloganu; "expensive" može zvučati dramatično; sužava na ozbiljne domene (što je i cilj). Mobilno: 4 reda.

### Pravac 4 — Bez slogana, činjenice
- Naslov: **"Rijad Kuloglija leads and builds web products."** (46) — ili samo "Lead software developer, Sarajevo."
- Lead: "Lead Software Developer at LibLynx and CTO at DIN Solution. Since 2021 I've built products for teams in Germany, Switzerland, the UK, Luxembourg and the US: identity and analytics, internal banking tools, AI voice platforms."
- CTA: "Email me" · "Selected work"
- Dokaz: nije potreban, lead ga nosi.
- Poruka: ko sam, šta radim, za koga, bez reklame (pristup kakav koristi rauno.me: ~50 riječi na prvom ekranu). Kome: tehnički evaluator i konzervativan kupac. Razlika: nula retorike, najlakše izgovoriti. Kompromis: manje karaktera u tekstu; 3D hero nosi atmosferu, pa je odbranjivo. Mobilno: ime u naslovu daje 4 reda.

### Pravac 5 — Model saradnje iz perspektive kupca
- Naslov: **"One engineer accountable, from design to production."** (52)
- Lead: "I join as the person responsible for the product: architecture, build, delivery and the months after launch. Lead developer at LibLynx, CTO at DIN Solution."
- CTA: "Discuss a project" · "How I work" (traži novu sekciju, vidi F) ili "Selected work"
- Dokaz: "Since 2021 · 5 products in production" (5 = `projects.length`, provjerljivo)
- Poruka: jedan odgovoran sagovornik, bez prebacivanja. Kome: osnivač ili direktor koji želi jednu osobu. Razlika: fokus na kako se radi s tobom. Kompromis: "one engineer" može zvučati malo za milionski projekat ako kupac očekuje tim; traži da About/kontakt objasne kako radiš s timovima. Mobilno: 4 reda.

### Finalisti i preporuka

Finalisti: **1** (odgovornost, prirodno izgovorena) i **2** (uloga). Pravac 3 je upečatljiv ali dramatičan; 4 je najsigurniji ali bez karaktera; 5 zavisi od odgovora o modelu saradnje.

**Preporuka: spoj 1 i 2.**
- Naslov: **"I lead the build and stand behind the product."** (46)
- Lead: "Lead Software Developer at LibLynx and CTO at DIN Solution. Since 2021 I've built products for teams in Germany, Switzerland, the UK, Luxembourg and the US: identity and analytics, internal banking tools, AI voice platforms." (229 ≤ 260)
- CTA: "Discuss a project" → `mailto:…?subject=Project%20enquiry` · "Selected work"
- Dokaz: postojeći eyebrow (ime · titula · grad) i badge dostupnosti, usklađeni s odlukom o kapacitetu.
- Meta opis iz leada (bez "·").

Zašto: jedna rečenica koju možeš izgovoriti klijentu bez osjećaja slogana; kaže nivo ("lead") i karakter ("build", hands-on); zadržava ideju odgovornosti iz sadašnjeg naslova ("stand behind") bez obećanja koje se podrazumijeva i bez ponavljanja "launch"; lead odmah daje ko, od kada, za koga i šta. Prelom na desktopu u 3 reda ("I lead the build / and stand behind / the product."), na 360 px u 4. Naslov, lead, dokaz i CTA rade kao cjelina: tvrdnja → činjenice → sljedeći korak.

Ako odgovor na pitanje 1 bude "radim sam, bez tima", preporuka pada na pravac 1 u čistom obliku.

---

## E. Konkretne izmjene sadržaja (prije → poslije → razlog)

Samo najvažnije; puna lista od 34 stavke po polju je u izvornom izvještaju o sadržaju. Limiti iz `content/schema.ts` provjereni.

**Hero** — `profile.headline`, `profile.lead`: vidi D.

**Glavni CTA** — `Navbar.tsx`, `Hero.tsx`: "Send a signal" → "Discuss a project", `mailto` sa `?subject=Project%20enquiry`. Razlog: metafora ne govori šta klik radi; "Send a signal." ostaje kao naslov Contact sekcije, gdje ispod stoji email.

**Naslov radova** — `WorkChapters.tsx`: "Real products, in production." → "Work in production." Razlog: "real" je defanzivno (ko je rekao da nisu?). Isti refleks je u About naslovu.

**About naslov** — `profile.aboutHeading` (≤60): "Frontend architecture, backed by real backend work." → "Hands-on engineering, with the lead role around it." Razlog: sadašnji sužava na frontend dok hero tvrdi CTO i end-to-end; novi spaja ono što sajt dokazuje (piše kod u LibLynxu, vodi u LibLynxu i DIN-u). Konačna verzija zavisi od odluke u H.

**About pasus** — `profile.about` (200–900):

> I've built software professionally since 2021, from Sarajevo, for teams in Germany, Switzerland, the UK, Luxembourg and the US. I lead development of the report-builder application at LibLynx, an identity and analytics platform whose customers include PLOS, The Economist Group and Digital Science. I'm CTO at DIN Solution, an international FinTech consulting firm, where I set technology direction and run software delivery. At Neo Labs, a four-person AI company, I engineered the customer-facing platforms of two AI voice products. My core is frontend architecture in React, Vue 3, TypeScript and Next.js, with backend work in Laravel, Flask and Node. Before that: internal tools for ProCredit Bank, two years with Bloola on BMW and Deutsche Bundesbank projects, and an OpenAI integration for a Swiss legal-tech product.

Razlog: ista dužina reda, manje ponavljanja poglavlja, "member of the Neo Labs team" postaje jasno, Sui dApp ide u Lab (lični projekat), "AI integration"/"integrating ChatGPT" postaje tačno ("OpenAI API"). "Four-person" samo ako firma ima četiri osobe.

**Strengths** — `profile.strengths` (tačno 6): "React / Vue ecosystems" → "Product delivery and technical leadership" (duplira "Frontend architecture", a liderstvo nedostaje); "Enterprise & banking software" → "Enterprise and internal banking tools" (ProCredit rad su interni alati, ne bankarski sistemi; tačno je jače od napuhanog); "AI integrations" → "Products built around AI services" (nema ML rada na sajtu).

**Companies** — `Companies.tsx` eyebrow: "Products and companies I've built for" → "Companies I've worked for and with"; `profile.companies`: BMW i Deutsche Bundesbank → "Bloola (BMW, Deutsche Bundesbank)" ili samo u Experience. Razlog: nalaz 7.

**Experience header** — `Experience.tsx`: "2021 → now · 10 roles · 3 current" → "2021 → now · 10 roles". Razlog: nalaz 6.

**Experience sažeci** — `profile.roles`:
- Arkona: "Led end-to-end development of Arkona's website; built the GumaMax…" → "Built Arkona's website end to end, as the sole frontend engineer, and the GumaMax multi-vendor tire-ordering dashboard." (ako si bio sam)
- ProCredit: "Design-to-deployment ownership of internal banking products: …" → "Built internal tools for the bank from design to deployment: an HR dashboard, a customer-referral system and ATM-feedback tooling."
- Superlex: "…integrating ChatGPT." → "…built on the OpenAI API."
- Amodo: "Developed the Porsche Smart Driver App in an agile team…" → "Flutter work on the Porsche Smart Driver App, in a team building for international insurtech clients." (dvomjesečni ugovor ne "razvija aplikaciju")
- Solution404: "Full-stack React work…" → "Full-stack work (React, Node.js)…"
- Neo Labs: "One of the company's four members. … and own how they are built and communicated." → "One of four people at the company. Engineered the customer-facing platforms of its two AI voice products, Neo Care and Neo Therapy, and lead product communication."
- Zadržati: DIN, Bloola, LibLynx (uz "three months later" umjesto "that October", opciono).

**LibLynx** — `content/work/liblynx.ts`:
- `oneLiner`: "Leading a new analytics product: …" → "Leading development of self-serve usage reporting inside an identity and access platform used by major publishers." Razlog: vodiš razvoj aplikacije, ne product ownership; "enterprise" je filler.
- `body.problem` / `body.contribution`: dodati rečenicu opsega ("I designed the report model and built X and Y; the team I lead shipped Z."). Traži tvoje činjenice.
- `body.engineering`: "Zod validation on API responses" → "…so a malformed response fails loudly instead of producing a wrong report"; "template configuration lives in the backend so reports never go stale" → "…so new report templates ship without a frontend release". Razlog: tehnika → korist, i oboje je istina onoga što opisuješ.
- caption dok nema app screenshota: "liblynx.com (product marketing site; the report builder sits behind customer login)".
- Zadržati `body.overview` i `delivered[3]`.

**DIN** — `content/work/din-solution.ts`:
- `body.overview`: skratiti listu usluga na "…Alongside accounting, consulting and FinTech advisory, it sells IT and engineering services to clients."
- `body.problem`: početi od "The role points two ways: …" (prva rečenica "A consulting firm that sells precision has to run its own technology precisely." je slogan).
- `body.engineering`: "…reviewing architecture and owning outcomes rather than tickets. The web platform is the visible part. The rest is getting four teams in three time zones to ship on one process." → "…setting technical direction, choosing stacks per engagement and reviewing architecture. The firm's website is the visible part; most of the work is client delivery and the process behind it." + jedna konkretna odluka (tvoja).
- `delivered`: tri opisa uloge → 2–3 isporuke koje možeš braniti (pitanje 3).

**Neo Labs** — `content/work/neo-labs.ts`: `roleNote` "one of four members · …" → "One of four people at the company · engineered both customer-facing platforms"; `body.contribution` "…and how they speak to the people who depend on them." → "I'm responsible for the engineering of both web platforms and for how the company communicates its products."; `body.engineering` precizirati tvoj dio u crisis-prevention toku ("including the web side of…"). Zadržati `oneLiner`, `overview`, `problem`.

**Arkona** — `content/work/arkona.ts`: `oneLiner` "End-to-end ownership of…" → "Sole frontend engineer on a software company's bilingual website, plus a multi-vendor tire-ordering dashboard."; `body.contribution` "I led development…" → "I built the website end to end…"; `delivered[0]` "…live and maintained" → "…live at arkonatechnology.com"; `delivered[2]` "Frontend ownership from first commit to production" → "Architecture, responsive build and deployment of the website"; `body.overview` ukloniti "A software company's own website is a portfolio piece by definition: engineers judge it." Razlog: "led" vs "one engineer" kontradikcija; "maintained" nakon završenog angažmana; aforizmi.

**Nepa** — `content/work/nepa-invest.ts` `body.problem`: "Outside SaaS the job changes: … as polished and solid as the buildings it presents." → "The site has to present each development convincingly and stay fast on phones, despite large render galleries and video tours." Razlog: "Outside SaaS" se obraća čitaocu portfolija, ne kupcu. Zadržati `oneLiner`, `engineering`.

**Contact** — novo polje `profile.contactNote` (prikaz iznad emaila):

> Write about the product you need built or led: what it does, where it stands today, who is already on the team and your timeline. I read and answer every message myself.

Razlog: kupac dobija za šta, šta poslati i šta slijedi; druga rečenica je obećanje koje potvrđuješ; bez vremena odgovora.

**Lab** — eyebrow "04 — Lab & more work" → "04 — More work"; Sui: "Live on the Sui blockchain: …" → "Running on Sui (testnet): wallet connection, on-chain NFT minting and leveling, SUI coin management. A personal project. Next.js, TypeScript, Zustand." (ako je testnet); GumaMax ukloniti iz laba; ProCredit "Internal, so no UI shown." → "Internal systems, not shown publicly."

**Metadata** — `app/layout.tsx`: title "Rijad Kuloglija — Lead Software Developer & CTO, Sarajevo", template "%s — Rijad Kuloglija", description iz leada; `app/cv/page.tsx` description iz `profile`; `app/not-found.tsx` vlastiti title; PDF `Title`/`Author`.

**Sitno** — footer "Status · shipping · built 2026-10-10" → "Updated 10 Oct 2026"; "© 2026 Rijad Kuloglija"; 404 "This page isn't lit. The work, the story and the contact are all back home." → "This page doesn't exist. Everything else is on the home page."; "Back to the signal" → "Back to home"; `/cv/` eyebrow ukloniti; "present" svuda; "Full-stack" dosljedno.

**Zadržati kakvi jesu**: nav ("Work · About · Experience · Contact"), chapter meta red (uloga · stack), "Read case study", Contact h2 "Send a signal.", CopyEmailButton, Bloola sažetak, LibLynx overview i engineering (uz dvije veze ka koristi), Neo problem, Nepa engineering, facts red u About, "Show all 10 roles", CV footer.

---

## F. Dizajn, tehnički nalazi i dodatne ideje

### Dizajn (ono što nije već u C)
- **Eyebrow prelomi na 360/390**: "…LEAD SOFTWARE / DEVELOPER · SARAJEVO", orphan "SARAJEVO", badge "Q1 / 2027", case eyebrow red koji počinje separatorom. Rješenje: `white-space:nowrap` po segmentu, `&nbsp;` u "Q1 2027", ime izbaciti iz eyebrowa ispod 400 px (logo ga nosi). [uredničko]
- **Case head**: naslov u uskom stupcu (~450 px) s ~300 px praznine iznad meta grida; Neo Labs poravnat drugačije. Meta grid poravnati s eyebrowom, naslov 8/12. [ukus]
- **Jezik dokaza**: Neo paneli na njemačkom, Nepa na bosanskom. Autentično; jedan caption ("DE market site", "BS market site") da se čita kao namjera. [ukus]
- **Tier B red fade** nije uhvaćen ni u jednom kadru; ako je toliko suptilan, kandidat za uklanjanje (manje koda). [pretpostavka, treba pravi uređaj]
- **Tier B dokument** ima ~348 px ispod footera (10 308 vs 9 960 px); Lenis staje na footeru, pa možda nije vidljivo; provjeriti End tipkom. [pretpostavka]
- **Nav tačka** proširena hit-area preklapa R u logotipu; klik na counter može pingati umjesto navigacije (ranije odlučeno, wordmark je home link). Provjeriti rukom. [pretpostavka]

### Tehnika (ono što nije već u C)
- **Mobile LCP**: Lighthouse lab 2.73–3.47 s na sve četiri stranice (spec ≤2.5 s), gate samo upozorava. Pravi browser trace (Pixel 7 emulacija, 4× CPU) daje LCP ~150 ms za h1, pa je lab broj vjerovatno artefakt Lantern simulacije JS boota. Zaključak: neprovjereno do terenskih podataka; preporuka Vercel Speed Insights nakon lansiranja i odluka da li LCP postaje `error`.
- **Tier A prvi load**: 1 od 3 desktop Lighthouse runa na `/` imao TBT 2.7 s (long task 1.76 s pri montaži 3D scene). Uz `cursor: none` korisnik tada nema ni kursor. Profilisati na M1 s hladnim shader cacheom; eventualno odgoditi montažu scene do prve interakcije ili idle+. [lab, povremeno]
- **Inicijalni JS** 149.6 KB gz: react-dom 71.8, Next runtime 45.1, app 12.8; cijeli `profile` objekat je u klijentskom chunku jer Loader/HeroPoster/MobileMenu čitaju `brand`/`email` (proslijediti kao propove).
- **CI**: `npm run budget` i Lighthouse samo na PR-u; direktan push na main ih preskače. Dodati budget u `ci.yml`.
- **Testovi koji nedostaju**: unazadna navigacija kroz sticky poglavlja; "nema vanjskih zahtjeva"; PDF vs sadržaj drift; axe na otvorenom meniju i raširenoj listi.

### Reference (dvije stranice sa sličnom publikom, pregledane danas)
- **robinwieruch.de** (freelance full-stack, klijenti): usluge napisane kao **uloge koje popunjava u klijentovom timu** (Technical Lead, Architect, AI Engineer), eksplicitan CTA "Work with Me" koji vodi na stranicu s objašnjenjem saradnje, lista "Notable clients". Princip vrijedan za nas: **reci u kojoj ulozi ulaziš u projekat i šta se dešava kad se javim**. Ne preuzimati: brojke posjeta i knjige su njegov model.
- **rauno.me** (dizajn-inženjer, Vercel): ~50 riječi na prvom ekranu, bez slogana, email koji se kopira. Princip: **suzdržanost teksta kad vizual nosi karakter**; naš 3D hero to dopušta. Ne preuzimati: on ne prodaje usluge, mi prodajemo.

### Tri dodatne ideje (najviše tri, namjerno)
1. **Sekcija "How I work"** (između About i Experience ili kao dio Contacta): u kojoj ulozi ulaziš (lead koji i gradi), kako izgleda prvih nekoliko sedmica (arhitektura, plan, prvi release), s kim radiš (tvoj tim / klijentov tim / DIN inženjering), šta klijent dobija svake sedmice, i kako se završava (predaja, "since launch"). Korist: odgovara na "šta je sljedeći korak" i "koliku odgovornost preuzima", najveća rupa za kupca. Potrebno: tvoje činjenice o modelu saradnje (pitanje 1). Složenost: mala (tekst + jedna sekcija u postojećem sistemu). Rizik: ako obećaš proces koji ne držiš, šteti više nego pomaže.
2. **Set ekrana aplikacija** umjesto marketing naslovnih: LibLynx builder (demo podaci ili zamagljeni), GumaMax dashboard, Neo Care/Therapy paneli. Korist: pretvara pet tvrdnji u pet dokaza; rješava nalaze 1, 19 i 20 odjednom. Potrebno: screenshoti i dozvole; gdje nema dozvole, dijagram toka nacrtan iz tvog znanja (bez podataka). Složenost: sadržajna (sharp pipeline već postoji). Rizik: NDA; zato dijagram kao fallback.
3. **Dvije kratke reference** (po jedna rečenica, ime, uloga, firma; s pismenom dozvolom): npr. lead u LibLynx/Clearview i neko iz Neo Labsa ili Arkone. Korist: jedini dokaz koji ne možeš sam napisati; za kupca koji ne može provjeriti kod to je najjači signal. Potrebno: zamoliti i dobiti dozvolu. Složenost: mala. Rizik: generičke pohvale ("great to work with") ne vrijede; tražiti rečenicu o konkretnoj odgovornosti ili odluci.

---

## G. Provjereno i neprovjereno

**Pokrenuto (lokalno, lab):**

| Gate | Rezultat |
|---|---|
| `npm run check` | prolazi: lint, typecheck, 38 unit testova |
| `npm run budget` | prolazi: initial JS 149.6 KB gz (limit 200), 3D 306.4 KB gz lazy (limit 400) |
| `npm run lhci` | prolazi (exit 0) uz 4 mobilna LCP upozorenja |
| Playwright (puni suite) | 106 prošlo, 53 preskočeno po dizajnu (tier grananje), 0 palo |
| axe (dodatno) | 0 prekršaja bilo kojeg nivoa: 8 stranica × desktop/mobile × Tier B/reduced motion + otvoren meni |

Lighthouse (reprezentativni run, lab, lokalni stroj): desktop performance 99–100, a11y 95–100 (`/cv/` 95), best practices 100, SEO 100; mobile performance 91–96, LCP 2.79–3.45 s, TBT 20–51 ms, CLS 0. Jedan desktop run na `/` s TBT 2.7 s (Tier A montaža).

**Pregledano u browseru (headless Chromium):** 8 stranica × 7 širina (360–1920) u prirodnom tieru (B) i reduced motion (C); forsirani Tier A (softverski renderer) s 13 kadrova divea i povratkom; meni, tastatura (14 stopova), hover, dodirne površine, kontrast pixel-samplingom, znakova po redu, overflow, konzola, listeneri i WebGL konteksti nakon pet navigacija.

**Pregledano u kodu i HTML-u:** sav sadržaj u `content/`, komponente s tekstom, `out/` HTML, metadata, sitemap, robots, OG slike (6 × 1200×630 PNG), JSON-LD, PDF (2 strane, A4, 49 KB), CI workflowi, zavisnosti.

**Vanjski:** dinsolution.com i liblynx.com pročitani danas radi provjere naziva i navođenja klijenata; robinwieruch.de i rauno.me kao reference.

**Neprovjereno:** renderovanje 3D heroa na pravom GPU-u (materijal, bloom, aliasing na dijagonali R, frame rate, detect-gpu tier na stvarnom hardveru; svi Tier A kadrovi su sa SwiftShadera); Safari/iOS/Firefox (view transitions, backdrop-filter, sticky, autoplay, Lenis); pravi dodir i fotosenzitivnost flasha pri brzom scrubbanju; loader i morph tranzicija frameova (preskočeni override-om); stvarni čitači ekrana (samo a11y stablo); produkcijski Vercel (zaglavlja, 308 na trailing slash, www redirect, 404 status); terenski LCP.

---

## H. Preporučeni sljedeći korak

**Prvo odobriti (redoslijed po uticaju):**
1. Pozicioniranje: odgovori na pet pitanja ispod. Bez njih hero, About, DIN i kontakt ostaju nagađanje.
2. Hero: preporučeni spoj iz D (ili drugi pravac po izboru).
3. Sadržajna runda iz E: posebno DIN, LibLynx opseg, Arkona, Companies, Strengths, kontakt tekst, metadata.
4. Dokazi: LibLynx ekrani ili dijagram, "Since launch" i "Decisions" po case studyju, Nepa poster.
5. Tehnički i dizajnerski batch bez odluka: overflow 360, fokus iza sticky poglavlja, unpkg, loader, sigurnosna zaglavlja, srcset širine, mono latin-ext, marquee pauza, dodirne površine, hover na Tier B, CV skala na ekranu, mobile case hero, schema cap i validacija u buildu.
6. Tier A dive (prazan .62–.82, flash) tek nakon provjere na tvom M1.

**Ostaviti kako jeste:** vizuelni sistem, tipografija, koncept Signal, dive kao ideja, Experience lista, case study layout tijela, CV papir, mobilni meni, test infrastruktura.

**Pet pitanja koja mijenjaju pozicioniranje** (svako vodi do konkretne odluke):
1. **Model isporuke.** Kad klijent povjeri veliki projekat, ko ga isporučuje: ti sam, DIN-ov inženjerski tim pod tobom, ili tim koji sastavljaš po projektu? (Određuje hero, About naslov, "How I work" i da li "one engineer" smije u tekst.)
2. **Kapacitet.** Uz tri tekuće uloge, šta znači "Open to product engagements from Q1 2027": dani sedmično, ekskluzivno, ili zavisi? (Određuje badge i kontakt tekst.)
3. **DIN.** Hoće li dinsolution.com ili LinkedIn navesti tebe kao CTO-a? Šta si konkretno isporučio od januara 2026 (2–3 stavke), i koliko inženjera vodiš? (Određuje DIN case i da li ostaje na drugom mjestu.)
4. **LibLynx.** Koliko ljudi vodiš, šta si lično napisao a šta tim; smijemo li pokazati ekrane aplikacije (makar zamagljene) ili dijagram? (Određuje glavni dokaz na sajtu.)
5. **Dozvole za imena.** BMW, Deutsche Bundesbank, Porsche, nazivi internih ProCredit alata: smiju li javno, i u kojoj formulaciji (npr. "through Bloola")? (Određuje Companies traku, Experience i Lab.)
