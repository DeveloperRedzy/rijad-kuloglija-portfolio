import { test, expect } from "@playwright/test";
import { projectSlugs } from "../../content";

// Every route, including the 404, must not scroll sideways on narrow phones (audit #11).
const routes = ["/", ...projectSlugs.map((s) => `/work/${s}/`), "/cv/", "/nope/"];

test.describe("no horizontal overflow on narrow phones", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "mobile", "viewport-driven; one project is enough");
  });

  for (const width of [320, 360]) {
    for (const path of routes) {
      test(`${path} at ${width} px`, async ({ page }) => {
        await page.addInitScript(() => sessionStorage.setItem("redzy:loaded", "1"));
        await page.setViewportSize({ width, height: 740 });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        // clientWidth, not innerWidth: with isMobile the layout viewport grows to fit the content, so innerWidth would
        // equal scrollWidth and hide the overflow.
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
        expect(scrollWidth, `${path} scrollWidth at ${width} px`).toBeLessThanOrEqual(clientWidth);
      });
    }
  }
});
