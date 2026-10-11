import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out = (dir) => mkdir(`public/media/${dir}`, { recursive: true });

// Width ladders (srcset candidates). lib/media.ts derives the same list from the width in the content `src`
// (`-1600.webp` → DESKTOP, `-800.webp` → MOBILE), so keep the two in sync.
const DESKTOP = [800, 1200, 1600];
const MOBILE = [400, 800];

/** Writes `<base>-<w>.webp|.avif` for every width in `widths`, each the same `width`×`height` crop scaled to w. */
async function image(src, base, { width, height, widths = [width], fit = "cover", position = "top", gray = false }) {
  for (const w of widths) {
    let img = sharp(src).resize({ width: w, height: Math.round((w * height) / width), fit, position });
    if (gray) img = img.grayscale().modulate({ brightness: 1.02 }).linear(1.08, -6);
    await img.clone().webp({ quality: 82 }).toFile(`public/media/${base}-${w}.webp`);
    await img.clone().avif({ quality: 55 }).toFile(`public/media/${base}-${w}.avif`);
    console.log(`${base}-${w}`);
  }
}

const cap = (slug, i, kind) => `assets/source/captures/${slug}/${i}-${kind}.png`;

await Promise.all(["work/liblynx", "work/din-solution", "work/neo-labs", "work/arkona", "work/nepa-invest", "about"].map(out));

// Heroes and galleries (desktop 1600x1000, mobile 800x1734)
await image(cap("liblynx", 0, "desktop"), "work/liblynx/hero-desktop", { width: 1600, height: 1000, widths: DESKTOP });
await image(cap("liblynx", 0, "mobile"), "work/liblynx/gallery-2", { width: 800, height: 1734, widths: MOBILE });
await image(cap("din-solution", 0, "desktop"), "work/din-solution/hero-desktop", { width: 1600, height: 1000, widths: DESKTOP });
await image(cap("din-solution", 0, "mobile"), "work/din-solution/gallery-1", { width: 800, height: 1734, widths: MOBILE });
await image(cap("neo-labs", 0, "desktop"), "work/neo-labs/hero-labs", { width: 1600, height: 1000, widths: DESKTOP });
await image(cap("neo-labs", 1, "desktop"), "work/neo-labs/hero-care", { width: 1600, height: 1000, widths: DESKTOP });
await image(cap("neo-labs", 2, "desktop"), "work/neo-labs/hero-therapy", { width: 1600, height: 1000, widths: DESKTOP });
await image(cap("neo-labs", 1, "mobile"), "work/neo-labs/gallery-1", { width: 800, height: 1734, widths: MOBILE });
await image(cap("neo-labs", 2, "mobile"), "work/neo-labs/gallery-2", { width: 800, height: 1734, widths: MOBILE });
await image(cap("arkona", 0, "desktop"), "work/arkona/hero-desktop", { width: 1600, height: 1000, widths: DESKTOP });
await image(cap("arkona", 0, "mobile"), "work/arkona/gallery-1", { width: 800, height: 1734, widths: MOBILE });
await image(cap("nepa-invest", 0, "desktop"), "work/nepa-invest/hero-desktop", { width: 1600, height: 1000, widths: DESKTOP });
await image("assets/source/nepa/render-villa-park-obarak.jpg", "work/nepa-invest/render-villa-park-obarak", { width: 1600, height: 1000, widths: DESKTOP, position: "centre" });
await image("assets/source/nepa/render-bulevar-gorazde.jpg", "work/nepa-invest/render-bulevar-gorazde", { width: 1600, height: 1000, widths: DESKTOP, position: "centre" });

// Portrait: 4:5 crop, grayscale (spec 5.5)
await image("assets/source/photo/untitled-6516.jpg", "about/portrait", { width: 2400, height: 3000, widths: [1200, 2400], position: "centre", gray: true });

// Video: up to 1280 wide (source is 848 wide, never upscaled), H.264, silent. The source opens with a title card and
// the screen recorder's toolbar until ~5.6 s, so the encode starts at 5.75 s (input seek, frame-accurate when
// re-encoding) and the poster is the first clean frame (6 s in the source), which is also where playback starts.
// Requires ffmpeg (brew install ffmpeg).
const tour = "assets/source/nepa/tour-pobjeda.mp4";
const poster = join(tmpdir(), "tour-poster.png");
execFileSync("ffmpeg", ["-y", "-ss", "5.75", "-i", tour, "-vf", "scale=min(1280\\,iw):-2", "-c:v", "libx264", "-crf", "30", "-preset", "slow", "-an", "-movflags", "+faststart", "public/media/work/nepa-invest/tour-pobjeda-1280.mp4"], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-ss", "6", "-i", tour, "-frames:v", "1", poster], { stdio: "inherit" });
await image(poster, "work/nepa-invest/tour-pobjeda-poster", { width: 1280, height: 720, position: "centre" });
