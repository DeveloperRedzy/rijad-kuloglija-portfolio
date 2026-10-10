import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/work/liblynx/", "/cv/"]) {
  test(`${path} has no serious axe violations`, async ({ page }) => {
    await page.goto(path);
    // Let entrance tweens settle: axe measures contrast on mid-fade text.
    await page.waitForFunction(() => document.documentElement.dataset.tier !== undefined);
    await expect
      .poll(() => page.locator("header .eyebrow").evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1")), { timeout: 5000 })
      .toBe(true);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
