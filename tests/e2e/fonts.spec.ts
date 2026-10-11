import { test, expect } from "@playwright/test";

const SAMPLE = "Goražde Ilijaš čćđšž ČĆĐŠŽ";

// A face that has every glyph of the sample measures the same whatever fallback follows it; a missing glyph would be
// drawn by the fallback (serif and monospace differ in width), so the two measurements would differ.
test("display, body and mono faces cover Bosnian letters", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.addInitScript(() => sessionStorage.setItem("redzy:loaded", "1"));
  await page.goto("/");
  const results = await page.evaluate(async (sample) => {
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-mono-face").split(",")[0].trim();
    const faces = [`800 32px "Cabinet Grotesk"`, `400 32px "Switzer"`, `400 32px ${mono}`, `500 32px ${mono}`];
    const ctx = document.createElement("canvas").getContext("2d")!;
    const width = (font: string) => { ctx.font = font; return ctx.measureText(sample).width; };
    const out: Record<string, { loaded: number; serif: number; monospace: number }> = {};
    for (const face of faces) {
      const loaded = (await document.fonts.load(face, sample)).length;
      out[face] = { loaded, serif: width(`${face}, serif`), monospace: width(`${face}, monospace`) };
    }
    return out;
  }, SAMPLE);
  for (const [face, r] of Object.entries(results)) {
    expect(r.loaded, face).toBeGreaterThan(0);
    expect(r.serif, face).toBeCloseTo(r.monospace, 1);
  }
});
