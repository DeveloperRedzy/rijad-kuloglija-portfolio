import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out = (dir) => mkdir(`public/media/${dir}`, { recursive: true });

async function image(src, dest, { width, height, fit = "cover", position = "top", gray = false }) {
  let img = sharp(src).resize({ width, height, fit, position });
  if (gray) img = img.grayscale().modulate({ brightness: 1.02 }).linear(1.08, -6);
  await img.clone().webp({ quality: 82 }).toFile(`public/media/${dest}.webp`);
  await img.clone().avif({ quality: 55 }).toFile(`public/media/${dest}.avif`);
  console.log(dest);
}

const cap = (slug, i, kind) => `assets/source/captures/${slug}/${i}-${kind}.png`;

await Promise.all(["work/liblynx", "work/din-solution", "work/neo-labs", "work/arkona", "work/nepa-invest", "about"].map(out));

// Heroes and galleries (desktop 1600x1000, mobile 800x1734)
await image(cap("liblynx", 0, "desktop"), "work/liblynx/hero-desktop-1600", { width: 1600, height: 1000 });
await image(cap("liblynx", 0, "desktop"), "work/liblynx/gallery-1-1600", { width: 1600, height: 1000, position: "bottom" });
await image(cap("liblynx", 0, "mobile"), "work/liblynx/gallery-2-800", { width: 800, height: 1734 });
await image(cap("din-solution", 0, "desktop"), "work/din-solution/hero-desktop-1600", { width: 1600, height: 1000 });
await image(cap("din-solution", 0, "mobile"), "work/din-solution/gallery-1-800", { width: 800, height: 1734 });
await image(cap("neo-labs", 0, "desktop"), "work/neo-labs/hero-labs-1600", { width: 1600, height: 1000 });
await image(cap("neo-labs", 1, "desktop"), "work/neo-labs/hero-care-1600", { width: 1600, height: 1000 });
await image(cap("neo-labs", 2, "desktop"), "work/neo-labs/hero-therapy-1600", { width: 1600, height: 1000 });
await image(cap("neo-labs", 1, "mobile"), "work/neo-labs/gallery-1-800", { width: 800, height: 1734 });
await image(cap("neo-labs", 2, "mobile"), "work/neo-labs/gallery-2-800", { width: 800, height: 1734 });
await image(cap("arkona", 0, "desktop"), "work/arkona/hero-desktop-1600", { width: 1600, height: 1000 });
await image(cap("arkona", 0, "mobile"), "work/arkona/gallery-1-800", { width: 800, height: 1734 });
await image(cap("nepa-invest", 0, "desktop"), "work/nepa-invest/hero-desktop-1600", { width: 1600, height: 1000 });
await image("assets/source/nepa/render-villa-park-obarak.jpg", "work/nepa-invest/render-villa-park-obarak-1600", { width: 1600, height: 1000, position: "centre" });
await image("assets/source/nepa/render-bulevar-gorazde.jpg", "work/nepa-invest/render-bulevar-gorazde-1600", { width: 1600, height: 1000, position: "centre" });

// Portrait: 4:5 crop, grayscale (spec 5.5)
await image("assets/source/photo/untitled-6516.jpg", "about/portrait-1200", { width: 1200, height: 1500, position: "centre", gray: true });
await image("assets/source/photo/untitled-6516.jpg", "about/portrait-2400", { width: 2400, height: 3000, position: "centre", gray: true });

// Video: up to 1280 wide (source is 848 wide, never upscaled) H.264, poster from the first second (requires ffmpeg: brew install ffmpeg)
const poster = join(tmpdir(), "tour-poster.png");
execFileSync("ffmpeg", ["-y", "-i", "assets/source/nepa/tour-pobjeda.mp4", "-vf", "scale=min(1280\\,iw):-2", "-c:v", "libx264", "-crf", "30", "-preset", "slow", "-an", "-movflags", "+faststart", "public/media/work/nepa-invest/tour-pobjeda-1280.mp4"], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-ss", "1", "-i", "public/media/work/nepa-invest/tour-pobjeda-1280.mp4", "-frames:v", "1", poster], { stdio: "inherit" });
await image(poster, "work/nepa-invest/tour-pobjeda-poster-1280", { width: 1280, height: 720, position: "centre" });
